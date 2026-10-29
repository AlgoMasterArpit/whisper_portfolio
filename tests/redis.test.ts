import { describe, expect, it, vi } from 'vitest';
import { pipeline, redisEnv } from '../shared/redis';

describe('redisEnv', () => {
  it('reads Vercel KV names first, then Upstash names', () => {
    expect(redisEnv({ KV_REST_API_URL: 'a', KV_REST_API_TOKEN: 'b', UPSTASH_REDIS_REST_URL: 'c' })).toEqual({ url: 'a', token: 'b' });
    expect(redisEnv({ UPSTASH_REDIS_REST_URL: 'c', UPSTASH_REDIS_REST_TOKEN: 'd' })).toEqual({ url: 'c', token: 'd' });
    expect(redisEnv({})).toEqual({ url: undefined, token: undefined });
  });
});

describe('pipeline', () => {
  const env = { url: 'https://redis.test', token: 't' };

  it('does nothing when the database is not configured', async () => {
    const fetchImpl = vi.fn();
    expect(await pipeline({}, [['INCR', 'x']], fetchImpl)).toBeNull();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('sends every command in one request and returns the results in order', async () => {
    const fetchImpl = vi.fn(async () => Response.json([{ result: 1 }, { result: 'OK' }]));
    expect(await pipeline(env, [['INCR', 'a'], ['SET', 'b', 1]], fetchImpl)).toEqual([1, 'OK']);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://redis.test/pipeline');
    expect(new Headers(init.headers).get('authorization')).toBe('Bearer t');
    expect(JSON.parse(init.body as string)).toEqual([['INCR', 'a'], ['SET', 'b', 1]]);
  });

  it('returns null on errors instead of breaking the page', async () => {
    expect(await pipeline(env, [['INCR', 'a']], vi.fn(async () => new Response('no', { status: 500 })))).toBeNull();
    const down = vi.fn(async () => {
      throw new TypeError('down');
    });
    expect(await pipeline(env, [['INCR', 'a']], down)).toBeNull();
  });
});
