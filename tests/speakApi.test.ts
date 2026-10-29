import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readWav, writeWav } from '../shared/speech';

const post = (body: string, ip = '1.2.3.4') =>
  new Request('http://localhost/api/speak', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body,
  });

const audio = () => new Response(writeWav([{ data: new Uint8Array([5, 5]), rate: 24000, channels: 1, bits: 16 }]) as BodyInit);

describe('POST /api/speak', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('LLM_API_KEY', 'k');
    vi.stubEnv('TTS_VOICE', '');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('returns playable wav audio', async () => {
    vi.stubGlobal('fetch', vi.fn(audio));
    const { POST } = await import('../api/speak');
    const res = await POST(post(JSON.stringify({ text: 'Hello there.' })));
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('audio/wav');
    expect(readWav(new Uint8Array(await res.arrayBuffer()))?.rate).toBe(24000);
  });

  it('serves repeated text from cache', async () => {
    const fetchImpl = vi.fn(audio);
    vi.stubGlobal('fetch', fetchImpl);
    const { POST } = await import('../api/speak');
    await POST(post(JSON.stringify({ text: 'Same words.' })));
    await POST(post(JSON.stringify({ text: 'Same words.' })));
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('answers 503 so the page can fall back to the browser voice', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 429 })));
    const { POST } = await import('../api/speak');
    expect((await POST(post(JSON.stringify({ text: 'Hi.' })))).status).toBe(503);
  });

  it('rejects bad bodies', async () => {
    const { POST } = await import('../api/speak');
    expect((await POST(post('{nope'))).status).toBe(400);
    expect((await POST(post(JSON.stringify({ text: '' })))).status).toBe(400);
  });

  it('rate limits a noisy client', async () => {
    vi.stubGlobal('fetch', vi.fn(audio));
    const { POST } = await import('../api/speak');
    for (let i = 0; i < 10; i++) await POST(post(JSON.stringify({ text: `n${i}` }), '6.6.6.6'));
    expect((await POST(post(JSON.stringify({ text: 'one more' }), '6.6.6.6'))).status).toBe(429);
  });
});
