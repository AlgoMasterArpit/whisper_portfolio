import { describe, expect, it } from 'vitest';
import { selectContext, splitSections } from '../shared/context';
import { KNOWLEDGE } from '../shared/knowledge';

const sections = splitSections(KNOWLEDGE);
const titlesIn = (context: string) => sections.filter((s) => context.includes(s.text)).map((s) => s.title);

describe('splitSections', () => {
  it('splits the knowledge base on its headings', () => {
    const titles = sections.map((s) => s.title);
    expect(titles).toContain('Basics');
    expect(titles).toContain('Projects');
    expect(titles).toContain('Mistakes');
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe('selectContext', () => {
  it('always includes the basics', () => {
    expect(titlesIn(selectContext('What is NOVA?'))).toContain('Basics');
  });

  it('picks the sections that match the question', () => {
    expect(titlesIn(selectContext('Tell me about Legal Sarthi'))).toContain('Projects');
    expect(titlesIn(selectContext('What was your biggest mistake?'))).toContain('Mistakes');
    expect(titlesIn(selectContext('Why Wispr and why growth?'))).toContain('Why growth, why Wispr');
  });

  it('falls back to the pitch sections when nothing matches', () => {
    expect(titlesIn(selectContext('hmm'))).toEqual(['Basics', 'Work', 'Projects', 'Why growth, why Wispr']);
  });

  it('sends far less than the whole knowledge base', () => {
    expect(selectContext('Tell me about Legal Sarthi').length).toBeLessThan(KNOWLEDGE.length * 0.75);
  });

  it('respects the section cap', () => {
    expect(titlesIn(selectContext('projects mistakes risks growth work record', 2))).toHaveLength(3);
  });
});

describe('Hinglish questions', () => {
  it.each([
    ['Tumne sabse badi galti kya ki?', 'Mistakes'],
    ['Sabse bada khatra kya liya?', 'Biggest risks'],
    ['Aapka kaam kya hai?', 'Work'],
  ])('“%s” pulls in %s', (question, title) => {
    expect(titlesIn(selectContext(question))).toContain(title);
  });
});

describe('skills questions', () => {
  it.each(['What is your tech stack?', 'Which skills do you have?', 'Do you know FastAPI?', 'Tumhe kaunsi languages aati hain?'])(
    '“%s” pulls in the skills section',
    (question) => {
      expect(titlesIn(selectContext(question))).toContain('Skills and tech stack');
    },
  );
});
