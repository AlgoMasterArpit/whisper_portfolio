import { describe, expect, it } from 'vitest';
import { INTENTS } from '../shared/faq';
import { matchOffline, normalize } from '../shared/matcher';
import { findReceipt } from '../shared/receipts';

const intentOf = (question: string) => INTENTS.find((i) => i.answer === matchOffline(question).text)?.id;

describe('normalize', () => {
  it('lowercases, strips emoji and collapses whitespace', () => {
    expect(normalize('  Who ARE   you?? 🙂 ')).toBe('who are you');
  });

  it('keeps apostrophes so contractions still match', () => {
    expect(normalize("What can’t you do")).toBe("what can't you do");
  });
});

describe('matchOffline', () => {
  it.each([
    ['Tell me about yourself', 'about'],
    ['Sabse bada risk kya liya?', 'risk'],
    ['What was your biggest mistake?', 'mistakes'],
    ['Why Wispr?', 'why-wispr'],
    ['How did you build Legal Sarthi?', 'legal-sarthi'],
    ['What is NOVA?', 'nova'],
    ['what did you do at electrothon', 'electrothon'],
    ['Why should a developer do growth?', 'why-growth'],
    ['What would you do on day one?', 'day-one'],
    ['kahan se ho aap', 'hometown'],
    ["What can't you do yet?", 'cant-do'],
  ])('%s → %s', (question, intent) => {
    expect(intentOf(question)).toBe(intent);
  });

  it('refuses topics with no receipt instead of guessing', () => {
    const answer = matchOffline('How much did you spend on Meta ads?');
    expect(answer.verdict).toBe('no-receipt');
    expect(answer.receipts).toEqual([]);
  });

  it('falls back to no-receipt for unrelated questions', () => {
    expect(matchOffline('What is the capital of Peru?').verdict).toBe('no-receipt');
  });

  it('marks public proof as verified and self-reported proof as such', () => {
    expect(matchOffline('What is NOVA?').verdict).toBe('verified');
    expect(matchOffline('What is your CGPA?').verdict).toBe('self-reported');
  });

  it('answers offline', () => {
    expect(matchOffline('who are you').source).toBe('offline');
  });
});

describe('intents', () => {
  it('have unique ids and only real receipts', () => {
    expect(new Set(INTENTS.map((i) => i.id)).size).toBe(INTENTS.length);
    for (const intent of INTENTS) {
      for (const id of intent.receipts) expect(findReceipt(id), `${intent.id}:${id}`).toBeDefined();
    }
  });
});
