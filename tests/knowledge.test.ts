import { describe, expect, it } from 'vitest';
import { KNOWLEDGE } from '../shared/knowledge';
import { findReceipt } from '../shared/receipts';

describe('knowledge base', () => {
  it('only cites receipts that exist', () => {
    const ids = [...KNOWLEDGE.matchAll(/\[([a-z0-9-]+)\]/g)].map((m) => m[1]!);
    expect(ids.length).toBeGreaterThan(10);
    for (const id of ids) expect(findReceipt(id), id).toBeDefined();
  });

  it('keeps the corrected facts, not the mis-transcribed ones', () => {
    expect(KNOWLEDGE).toContain('8.94');
    expect(KNOWLEDGE).toContain('Carboledger');
    expect(KNOWLEDGE).toContain('Electrothon 9.0');
    expect(KNOWLEDGE).toContain('300 ms');
    expect(KNOWLEDGE).not.toMatch(/9\.84|Carbolager|Mindpointo|ECS/);
  });
});
