import { pipeline, redisEnv } from '../shared/redis.js';
import { dayKey, isBot } from '../shared/stats.js';

const destinations: Record<string, () => string> = {
  wispr: () => process.env.WISPR_LINK || 'https://wisprflow.ai',
};

export async function GET(request: Request): Promise<Response> {
  const to = new URL(request.url).searchParams.get('to') ?? '';
  const destination = destinations[to];
  if (!destination) return Response.json({ error: 'Unknown link.' }, { status: 404 });

  if (!isBot(request.headers.get('user-agent'))) {
    const day = dayKey(new Date());
    await pipeline(redisEnv(process.env), [
      ['SADD', 'days', day],
      ['INCR', `clicks:${to}:${day}`],
    ]);
  }
  return new Response(null, { status: 302, headers: { location: destination(), 'cache-control': 'no-store' } });
}
