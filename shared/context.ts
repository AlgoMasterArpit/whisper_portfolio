import { KNOWLEDGE } from './knowledge.js';
import { tokenize } from './matcher.js';

export interface Section {
  title: string;
  text: string;
  vocab: Set<string>;
}

export function splitSections(knowledge: string): Section[] {
  return knowledge
    .split(/^## /m)
    .slice(1)
    .map((chunk) => {
      const title = chunk.slice(0, chunk.indexOf('\n')).trim();
      const text = `## ${chunk.trim()}`;
      return { title, text, vocab: new Set(tokenize(text)) };
    });
}

const SECTIONS = splitSections(KNOWLEDGE);
const ALWAYS = 'Basics';
const DEFAULTS = ['Why growth, why Wispr', 'Work', 'Projects'];

export function selectContext(question: string, max = 3, sections: readonly Section[] = SECTIONS): string {
  const words = tokenize(question).filter((w) => w.length >= 3);
  const ranked = sections
    .filter((s) => s.title !== ALWAYS)
    .map((s) => ({ s, score: words.filter((w) => s.vocab.has(w)).length }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map((r) => r.s);
  const picked = ranked.length ? ranked : sections.filter((s) => DEFAULTS.includes(s.title));
  const basics = sections.filter((s) => s.title === ALWAYS);
  return [...basics, ...picked].map((s) => s.text).join('\n\n');
}
