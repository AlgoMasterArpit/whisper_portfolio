import { useCallback, useRef, useState } from 'react';
import type { Answer } from '../../shared/matcher';
import { AskError, askArpit } from './askClient';

export interface Entry {
  id: number;
  question: string;
  answer?: Answer;
  error?: string;
  voice?: boolean;
}

const KEEP = 6;

export function useAsk() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const nextId = useRef(1);

  const ask = useCallback(async (raw: string, voice = false) => {
    const question = raw.trim();
    if (!question) return;
    const id = nextId.current++;
    const patch = (fields: Partial<Entry>) =>
      setEntries((list) => list.map((e) => (e.id === id ? { ...e, ...fields } : e)));

    setEntries((list) => [{ id, question, voice }, ...list].slice(0, KEEP));
    try {
      patch({ answer: await askArpit(question) });
    } catch (err) {
      patch({ error: err instanceof AskError ? err.message : 'Something broke — try again.' });
    }
  }, []);

  const busy = entries.some((e) => !e.answer && !e.error);
  return { entries, ask, busy };
}
