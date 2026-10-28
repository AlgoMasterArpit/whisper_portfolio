import { matchOffline, type Answer } from '../../shared/matcher';

export class AskError extends Error {}

export async function askArpit(question: string, fetchImpl: typeof fetch = fetch): Promise<Answer> {
  let res: Response;
  try {
    res = await fetchImpl('/api/ask', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ question }),
    });
  } catch {
    return matchOffline(question);
  }
  if (res.status === 400 || res.status === 429) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new AskError(body.error ?? 'Try that again.');
  }
  if (!res.ok) return matchOffline(question);
  try {
    const answer = (await res.json()) as Answer;
    return typeof answer?.text === 'string' && Array.isArray(answer.receipts) ? answer : matchOffline(question);
  } catch {
    return matchOffline(question);
  }
}
