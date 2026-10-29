import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const BROWSER = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36';

function fakeRedis() {
  const strings = new Map<string, number>();
  const sets = new Map<string, Set<string>>();
  const hashes = new Map<string, Map<string, number>>();
  const set = (k: string) => sets.get(k) ?? sets.set(k, new Set()).get(k)!;
  const hash = (k: string) => hashes.get(k) ?? hashes.set(k, new Map()).get(k)!;

  const run = ([cmd, key, ...args]: (string | number)[]): unknown => {
    const k = String(key);
    switch (cmd) {
      case 'INCR':
        strings.set(k, (strings.get(k) ?? 0) + 1);
        return strings.get(k);
      case 'GET':
        return strings.has(k) ? String(strings.get(k)) : null;
      case 'SADD':
      case 'PFADD': {
        const before = set(k).size;
        args.forEach((a) => set(k).add(String(a)));
        return set(k).size > before ? 1 : 0;
      }
      case 'SMEMBERS':
        return [...set(k)];
      case 'PFCOUNT':
        return set(k).size;
      case 'HINCRBY':
        hash(k).set(String(args[0]), (hash(k).get(String(args[0])) ?? 0) + Number(args[1]));
        return hash(k).get(String(args[0]));
      case 'HGETALL':
        return [...hash(k)].flatMap(([f, v]) => [f, String(v)]);
      default:
        throw new Error(`unsupported ${cmd}`);
    }
  };

  return vi.fn(async (_url: string, init: RequestInit) => {
    const commands = JSON.parse(init.body as string) as (string | number)[][];
    return Response.json(commands.map((c) => ({ result: run(c) })));
  });
}

const hit = (body: object, ua = BROWSER, ip = '10.0.0.1') =>
  new Request('http://localhost/api/hit', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'user-agent': ua, 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });

describe('live stats endpoints', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('KV_REST_API_URL', 'https://redis.test');
    vi.stubEnv('KV_REST_API_TOKEN', 't');
    vi.stubEnv('WISPR_LINK', '');
    vi.stubGlobal('fetch', fakeRedis());
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('counts visits, unique visitors and channels, then reports them', async () => {
    const { POST } = await import('../api/hit');
    const { GET } = await import('../api/stats');
    await POST(hit({ ref: 'linkedin' }));
    await POST(hit({ ref: 'linkedin' }));
    await POST(hit({ referrer: 'https://web.whatsapp.com/' }, BROWSER, '10.0.0.2'));
    const { days } = (await (await GET()).json()) as { days: { visits: number; visitors: number; channels: object }[] };
    expect(days).toHaveLength(1);
    expect(days[0]).toMatchObject({ visits: 3, visitors: 2, channels: { linkedin: 1, whatsapp: 1 } });
    const chips = Object.values(days[0]!.channels as Record<string, number>).reduce((a, b) => a + b, 0);
    expect(chips).toBe(days[0]!.visitors);
  });

  it('ignores link-preview bots so LinkedIn crawlers do not inflate the numbers', async () => {
    const { POST } = await import('../api/hit');
    const { GET } = await import('../api/stats');
    await POST(hit({ ref: 'linkedin' }, 'LinkedInBot/1.0'));
    expect(((await (await GET()).json()) as { days: unknown[] }).days).toEqual([]);
  });

  it('counts a Try Wispr Flow click and redirects to Wispr', async () => {
    const { GET: go } = await import('../api/go');
    const { GET: stats } = await import('../api/stats');
    const res = await go(new Request('http://localhost/api/go?to=wispr', { headers: { 'user-agent': BROWSER } }));
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('https://wisprflow.ai');
    const { days } = (await (await stats()).json()) as { days: { wisprClicks: number }[] };
    expect(days[0]?.wisprClicks).toBe(1);
  });

  it('uses the referral link once it is configured', async () => {
    vi.stubEnv('WISPR_LINK', 'https://wisprflow.ai/r/ARPIT');
    const { GET: go } = await import('../api/go');
    const res = await go(new Request('http://localhost/api/go?to=wispr', { headers: { 'user-agent': BROWSER } }));
    expect(res.headers.get('location')).toBe('https://wisprflow.ai/r/ARPIT');
  });

  it('refuses unknown redirect targets, so it cannot be used as an open redirect', async () => {
    const { GET: go } = await import('../api/go');
    expect((await go(new Request('http://localhost/api/go?to=https://evil.test'))).status).toBe(404);
  });

  it('reports an empty, unconfigured state without a database', async () => {
    vi.stubEnv('KV_REST_API_URL', '');
    vi.stubEnv('KV_REST_API_TOKEN', '');
    const { GET } = await import('../api/stats');
    expect(await (await GET()).json()).toEqual({ configured: false, days: [] });
  });

  it('caches the public stats at the edge for a minute', async () => {
    const { GET } = await import('../api/stats');
    expect((await GET()).headers.get('cache-control')).toContain('s-maxage=60');
  });
});
