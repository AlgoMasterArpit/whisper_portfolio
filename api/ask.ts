import { askTwin, createRateLimiter, readQuestion } from '../shared/ask.js';

const allow = createRateLimiter(20, 60_000);

export async function POST(request: Request): Promise<Response> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!allow(ip)) {
    return Response.json({ error: 'Too many questions — give it a minute.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Body must be JSON.' }, { status: 400 });
  }

  const result = readQuestion(body);
  if ('error' in result) return Response.json(result, { status: 400 });

  const answer = await askTwin(result.question, {
    apiKey: process.env.LLM_API_KEY,
    baseUrl: process.env.LLM_BASE_URL,
    model: process.env.LLM_MODEL,
  });
  return Response.json(answer, { headers: { 'cache-control': 'no-store' } });
}
