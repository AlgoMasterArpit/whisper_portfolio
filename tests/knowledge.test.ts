import { readFileSync } from 'node:fs';
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

describe('knowledge stays in sync with the resume', () => {
  const resume = readFileSync(new URL('../content/resume.md', import.meta.url), 'utf8');
  const skills = resume
    .slice(resume.indexOf('## Technical skills'), resume.indexOf('## Experience'))
    .split('\n')
    .filter((l) => l.startsWith('- '))
    .flatMap((l) => l.slice(l.indexOf(':**') + 3).split(/,|\(|\)/))
    .map((s) => s.trim())
    .filter(Boolean);

  it('lists every skill from the resume', () => {
    expect(skills.length).toBeGreaterThan(25);
    for (const skill of skills) expect(KNOWLEDGE.toLowerCase(), skill).toContain(skill.toLowerCase());
  });

  it('keeps the phone number out of the public resume', () => {
    expect(resume).not.toMatch(/\+91|\d{10}/);
  });

  it('carries the spoken corrections, not the old resume values', () => {
    expect(resume).toContain('CGPA 8.94');
    expect(resume).toContain('July 2026 – present');
  });
});
