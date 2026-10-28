import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ROUNDS, fakeIndex, rank } from '../src/data/game';
import { LEDGER } from '../src/data/ledger';
import { MISHEARS } from '../src/data/mishears';
import { SCENES, closingLine, matchCount } from '../src/data/story';
import { parseBrainDump } from '../src/lib/transcripts';
import { findReceipt } from '../shared/receipts';

describe('museum story', () => {
  it('has unique scene ids and real receipts', () => {
    expect(new Set(SCENES.map((s) => s.id)).size).toBe(SCENES.length);
    for (const scene of SCENES) {
      expect(scene.receipts.length, scene.id).toBeGreaterThan(0);
      for (const id of scene.receipts) expect(findReceipt(id), `${scene.id}:${id}`).toBeDefined();
    }
  });

  it('counts how many calls match mine', () => {
    expect(matchCount(SCENES.map((s) => s.actual))).toBe(SCENES.length);
    expect(matchCount(SCENES.map((s) => (s.actual === 0 ? 1 : 0)))).toBe(0);
    expect(matchCount([])).toBe(0);
  });

  it('has a closing line for every score', () => {
    const total = SCENES.length;
    const lines = new Set(Array.from({ length: total + 1 }, (_, n) => closingLine(n, total)));
    expect(lines.size).toBe(4);
  });
});

describe('spot the fake', () => {
  it('has exactly one fake per round and real receipts for the rest', () => {
    for (const round of ROUNDS) {
      expect(round.claims.filter((c) => !c.receipt)).toHaveLength(1);
      expect(fakeIndex(round)).toBeGreaterThanOrEqual(0);
      for (const c of round.claims) if (c.receipt) expect(findReceipt(c.receipt), c.text).toBeDefined();
    }
  });

  it('does not always hide the fake in the same slot', () => {
    expect(new Set(ROUNDS.map(fakeIndex)).size).toBeGreaterThan(1);
  });

  it('ranks perfect, partial and zero scores differently', () => {
    expect(new Set([rank(3, 3), rank(1, 3), rank(0, 3)]).size).toBe(3);
  });
});

describe('mishears', () => {
  const raw = parseBrainDump(readFileSync(new URL('../content/brain-dump.md', import.meta.url), 'utf8'));
  const textOf = (id: string) => raw.find((q) => q.id === id)?.takes.map((t) => t.text).join(' ') ?? '';

  it('only quotes things I actually said, in the question they came from', () => {
    for (const m of MISHEARS) expect(textOf(m.question), m.said).toContain(m.said);
  });
});

describe('ledger', () => {
  it('backs every item with at least one real receipt', () => {
    for (const item of LEDGER.flatMap((g) => g.items)) {
      expect(item.receipts.length, item.name).toBeGreaterThan(0);
      for (const id of item.receipts) expect(findReceipt(id), `${item.name}:${id}`).toBeDefined();
    }
  });
});
