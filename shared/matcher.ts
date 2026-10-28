import { INTENTS, NO_RECEIPT_ANSWER, NO_RECEIPT_TOPICS, type Intent } from './faq';
import { resolveReceipts, verdictFor, type Receipt, type Verdict } from './receipts';

export interface Answer {
  text: string;
  receipts: Receipt[];
  verdict: Verdict;
  source: 'twin' | 'offline';
}

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9'.,+\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasPhrase(haystack: string, phrase: string): boolean {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${escaped}`).test(haystack);
}

export function scoreIntent(question: string, intent: Intent): number {
  let score = 0;
  for (const keyword of intent.keywords) {
    if (hasPhrase(question, keyword)) score += keyword.includes(' ') ? 3 : 2;
  }
  return score;
}

export function noReceiptAnswer(): Answer {
  return { text: NO_RECEIPT_ANSWER, receipts: [], verdict: 'no-receipt', source: 'offline' };
}

export function matchOffline(rawQuestion: string): Answer {
  const question = normalize(rawQuestion);
  if (NO_RECEIPT_TOPICS.some((topic) => hasPhrase(question, topic))) return noReceiptAnswer();

  let best: Intent | undefined;
  let bestScore = 0;
  for (const intent of INTENTS) {
    const score = scoreIntent(question, intent);
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }
  if (!best) return noReceiptAnswer();

  const receipts = resolveReceipts(best.receipts);
  return { text: best.answer, receipts, verdict: verdictFor(receipts), source: 'offline' };
}
