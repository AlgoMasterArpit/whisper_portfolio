import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { countWords, firstSentences, parseBrainDump } from '../src/lib/transcripts';

const SAMPLE = `# Brain dump

## Corrections
- "Carbolager" → Carboledger

## Q1. Who are you?

### Take 1

hello everyone,
I am Arpit.

### Take 2

More here.

## Q5. Skipped

## Q2. Projects

### Take 1 — NOVA

Nova is my assistant.
`;

describe('parseBrainDump', () => {
  const questions = parseBrainDump(SAMPLE);

  it('reads questions and takes, skipping notes and empty questions', () => {
    expect(questions.map((q) => q.id)).toEqual(['q1', 'q2']);
    expect(questions[0]!.takes.map((t) => t.label)).toEqual(['Take 1', 'Take 2']);
    expect(questions[1]!.takes[0]).toEqual({ label: 'Take 1 — NOVA', text: 'Nova is my assistant.' });
  });

  it('keeps the raw text untouched apart from outer whitespace', () => {
    expect(questions[0]!.takes[0]!.text).toBe('hello everyone,\nI am Arpit.');
  });

  it('never leaks the corrections list', () => {
    expect(JSON.stringify(questions)).not.toContain('Carbolager');
  });

  it('handles windows line endings', () => {
    expect(parseBrainDump(SAMPLE.replace(/\n/g, '\r\n'))).toEqual(questions);
  });

  it('parses the real brain dump', () => {
    const real = parseBrainDump(readFileSync(new URL('../content/brain-dump.md', import.meta.url), 'utf8'));
    expect(real.map((q) => q.id)).toEqual(['q1', 'q2', 'q6', 'q7']);
    expect(real.every((q) => q.takes.length > 0)).toBe(true);
    expect(countWords(real)).toBeGreaterThan(1500);
  });
});

describe('countWords', () => {
  it('counts words across every take', () => {
    expect(countWords(parseBrainDump(SAMPLE))).toBe(11);
  });
});

describe('firstSentences', () => {
  it('returns the opening sentences', () => {
    expect(firstSentences('One. Two!  Three? Four.', 2)).toBe('One. Two!');
  });

  it('returns text with no punctuation as is', () => {
    expect(firstSentences('no punctuation here')).toBe('no punctuation here');
  });
});

describe('what the public brain dump leaves out', () => {
  const raw = readFileSync(new URL('../content/brain-dump.md', import.meta.url), 'utf8');

  it('has no drop-year, NDA, DSA-timing or personal-plan content', () => {
    expect(raw).not.toMatch(/\bNDA\b|\bSSB\b|second drop|percentile|stock market|\$3,000|time-driven/i);
  });
});
