import { pipeline, redisEnv } from '../shared/redis.js';
import { CHANNELS, type Channel, type DayStats } from '../shared/stats.js';

const MAX_DAYS = 30;

function channelsFrom(flat: unknown): Partial<Record<Channel, number>> {
  const out: Partial<Record<Channel, number>> = {};
  if (!Array.isArray(flat)) return out;
  for (let i = 0; i + 1 < flat.length; i += 2) {
    const name = String(flat[i]) as Channel;
    if ((CHANNELS as readonly string[]).includes(name)) out[name] = Number(flat[i + 1]) || 0;
  }
  return out;
}

export async function GET(): Promise<Response> {
  const env = redisEnv(process.env);
  const headers = { 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' };
  if (!env.url) return Response.json({ configured: false, days: [] }, { headers });

  const [members] = (await pipeline(env, [['SMEMBERS', 'days']])) ?? [];
  const dates = (Array.isArray(members) ? members.map(String) : []).sort().slice(-MAX_DAYS);
  if (!dates.length) return Response.json({ configured: true, days: [] }, { headers });

  const results =
    (await pipeline(
      env,
      dates.flatMap((d) => [
        ['GET', `visits:${d}`],
        ['PFCOUNT', `visitors:${d}`],
        ['HGETALL', `channels:${d}`],
        ['GET', `clicks:wispr:${d}`],
      ]),
    )) ?? [];

  const days: DayStats[] = dates.map((date, i) => ({
    date,
    visits: Number(results[i * 4]) || 0,
    visitors: Number(results[i * 4 + 1]) || 0,
    channels: channelsFrom(results[i * 4 + 2]),
    wisprClicks: Number(results[i * 4 + 3]) || 0,
  }));
  return Response.json({ configured: true, days }, { headers });
}
