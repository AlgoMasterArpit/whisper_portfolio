import { describe, expect, it } from 'vitest';
import { RECEIPTS, findReceipt, resolveReceipts, verdictFor } from '../shared/receipts';

describe('receipt catalog', () => {
  it('has unique ids', () => {
    const ids = RECEIPTS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every public receipt a link and every self-reported one a note', () => {
    for (const r of RECEIPTS) {
      if (r.kind === 'public') expect(r.url, r.id).toBeTruthy();
      else expect(r.note, r.id).toBeTruthy();
    }
  });

  it('links only over https or to an anchor on this page', () => {
    for (const r of RECEIPTS) {
      if (r.url) expect(r.url).toMatch(/^(https:\/\/|#)/);
    }
  });
});

describe('resolveReceipts', () => {
  it('drops unknown ids, non-strings and duplicates', () => {
    const out = resolveReceipts(['nova', 'made-up', 42, 'nova', null, 'cgpa']);
    expect(out.map((r) => r.id)).toEqual(['nova', 'cgpa']);
  });

  it('returns nothing for an empty list', () => {
    expect(resolveReceipts([])).toEqual([]);
  });
});

describe('verdictFor', () => {
  it('is verified when any receipt is public', () => {
    expect(verdictFor(resolveReceipts(['cgpa', 'nova']))).toBe('verified');
  });

  it('is self-reported when only self-reported receipts back the claim', () => {
    expect(verdictFor(resolveReceipts(['cgpa', 'sih']))).toBe('self-reported');
  });

  it('is no-receipt when nothing backs the claim', () => {
    expect(verdictFor([])).toBe('no-receipt');
  });
});

describe('findReceipt', () => {
  it('finds by id', () => {
    expect(findReceipt('kin')?.url).toContain('kin_Alexa-');
    expect(findReceipt('nope')).toBeUndefined();
  });
});
