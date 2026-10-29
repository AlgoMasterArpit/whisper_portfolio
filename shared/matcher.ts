import { INTENTS, NO_RECEIPT_ANSWER, NO_RECEIPT_TOPICS, UNKNOWN_ANSWER, type Intent } from './faq.js';
import { resolveReceipts, verdictFor, type Receipt, type Verdict } from './receipts.js';

export interface Answer {
  text: string;
  receipts: Receipt[];
  verdict: Verdict;
  source: 'twin' | 'offline';
}

const STOP = new Set(
  (
    'a an the is are was were be been am i me my you your yours we our it its this that these those of in on at to for from with and or ' +
    'do did does done have has had can could would should will what which who whom how why when where tell about please just so ' +
    'kya hai hain ho tha thi tum tumhara tumhare tumne aap aapka aapne apne apna mera mere main mein me ka ki ke ko se ne ye wo bhi aur'
  ).split(' '),
);

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9'.,+\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function stem(word: string): string {
  if (word.length <= 4) return word;
  if (word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (/(ss|x|z|ch|sh)es$/.test(word)) return word.slice(0, -2);
  if (word.endsWith('ing')) return word.slice(0, -3);
  if (word.endsWith('ed')) return word.slice(0, -2);
  if (word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

export function tokenize(text: string): string[] {
  return normalize(text)
    .split(/[^a-z0-9+]+/)
    .filter((t) => t && !STOP.has(t))
    .map(stem);
}

function hasPhrase(haystack: string, phrase: string): boolean {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${escaped}`).test(haystack);
}

export function scoreIntent(question: string, intent: Intent): number {
  const tokens = new Set(tokenize(question));
  let score = 0;
  for (const keyword of intent.keywords) {
    if (keyword.includes(' ')) {
      if (hasPhrase(question, keyword)) score += 3;
    } else if (tokens.has(stem(keyword))) {
      score += 2;
    }
  }
  return score;
}

const ANSWER_TOKENS = new Map(INTENTS.map((i) => [i.id, new Set(tokenize(`${i.keywords.join(' ')} ${i.answer}`))]));

function overlap(question: string, intent: Intent): number {
  const vocab = ANSWER_TOKENS.get(intent.id)!;
  return tokenize(question).filter((t) => t.length >= 4 && vocab.has(t)).length;
}

function best(question: string, score: (q: string, i: Intent) => number): Intent | undefined {
  let top: Intent | undefined;
  let topScore = 0;
  for (const intent of INTENTS) {
    const s = score(question, intent);
    if (s > topScore) {
      top = intent;
      topScore = s;
    }
  }
  return top;
}

const offline = (text: string, receipts: Receipt[] = []): Answer => ({
  text,
  receipts,
  verdict: verdictFor(receipts),
  source: 'offline',
});

export function noReceiptAnswer(): Answer {
  return offline(NO_RECEIPT_ANSWER);
}

export function matchOffline(rawQuestion: string): Answer {
  const question = normalize(rawQuestion);
  if (NO_RECEIPT_TOPICS.some((topic) => hasPhrase(question, topic))) return noReceiptAnswer();
  const intent = best(question, scoreIntent) ?? best(question, overlap);
  if (!intent) return offline(UNKNOWN_ANSWER);
  return offline(intent.answer, resolveReceipts(intent.receipts));
}
