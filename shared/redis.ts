export interface RedisEnv {
  url?: string;
  token?: string;
}

export function redisEnv(env: Record<string, string | undefined>): RedisEnv {
  return {
    url: env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL,
    token: env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN,
  };
}

export type Command = readonly (string | number)[];

export async function pipeline(env: RedisEnv, commands: readonly Command[], fetchImpl: typeof fetch = fetch): Promise<unknown[] | null> {
  if (!env.url || !env.token || !commands.length) return null;
  try {
    const res = await fetchImpl(`${env.url}/pipeline`, {
      method: 'POST',
      headers: { authorization: `Bearer ${env.token}`, 'content-type': 'application/json' },
      body: JSON.stringify(commands),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: unknown }[];
    return data.map((d) => d.result ?? null);
  } catch {
    return null;
  }
}
