import { createRateLimiter } from '../shared/ask.js';
import { pipeline, redisEnv } from '../shared/redis.js';
import { channelOf, dayKey, isBot, visitorHash } from '../shared/stats.js';

const allow = createRateLimiter(30, 60_000);

export async function POST(request: Request): Promise<Response> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const userAgent = request.headers.get('user-agent');
  if (!allow(ip) || isBot(userAgent)) return new Response(null, { status: 204 });

  let body: { ref?: unknown; referrer?: unknown } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    /* an empty beacon still counts as a visit */
  }

  const day = dayKey(new Date());
  const salt = process.env.STATS_SALT || process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || 'receipts';
  const visitor = await visitorHash(ip, userAgent!, day, salt);
  const channel = channelOf(body.ref, body.referrer);

  const env = redisEnv(process.env);
  const [, , isNew] =
    (await pipeline(env, [
      ['SADD', 'days', day],
      ['INCR', `visits:${day}`],
      ['PFADD', `visitors:${day}`, visitor],
    ])) ?? [];
  if (isNew === 1) await pipeline(env, [['HINCRBY', `channels:${day}`, channel, 1]]);
  return new Response(null, { status: 204 });
}
