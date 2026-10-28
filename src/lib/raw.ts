import { createContext, useContext } from 'react';
import brainDump from '../../content/brain-dump.md?raw';
import { countWords, parseBrainDump, type Question } from './transcripts';

export const QUESTIONS: readonly Question[] = parseBrainDump(brainDump);
export const WORDS_SPOKEN = countWords(QUESTIONS);

export const RawContext = createContext(false);

export function useRaw(): boolean {
  return useContext(RawContext);
}

export function questionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}
