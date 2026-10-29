import { createRateLimiter } from '../shared/ask.js';
import { readSpeakText, synthesize, voiceFrom } from '../shared/speech.js';

const allow = createRateLimiter(10, 60_000);
const cache = new Map<string, Uint8Array>();
const CACHE_MAX = 40;

const wav = (audio: Uint8Array) =>
  new Response(audio as BodyInit, { headers: { 'content-type': 'audio/wav', 'cache-control': 'no-store' } });

export async function POST(request: Request): Promise<Response> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!allow(ip)) return Response.json({ error: 'Too many — give it a minute.' }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Body must be JSON.' }, { status: 400 });
  }
  const result = readSpeakText(body);
  if ('error' in result) return Response.json(result, { status: 400 });

  const voice = voiceFrom(process.env.TTS_VOICE);
  const key = `${voice}:${result.text}`;
  const hit = cache.get(key);
  if (hit) return wav(hit);

  const audio = await synthesize(result.text, {
    apiKey: process.env.TTS_API_KEY || process.env.LLM_API_KEY,
    baseUrl: process.env.LLM_BASE_URL,
    voice,
  });
  if (!audio) return Response.json({ error: 'Voice is resting — using the browser voice.' }, { status: 503 });

  cache.set(key, audio);
  // ponytail: per-instance LRU of ~40 short answers (~20 MB worst case); Vercel Blob if it ever needs to survive cold starts.
  if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value!);
  return wav(audio);
}
