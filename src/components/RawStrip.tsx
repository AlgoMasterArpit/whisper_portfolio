import { questionById, useRaw } from '../lib/raw';
import { firstSentences } from '../lib/transcripts';

export function RawStrip({ question }: { question: string }) {
  const raw = useRaw();
  const q = questionById(question);
  const take = q?.takes[0];
  if (!raw || !q || !take) return null;
  return (
    <figure className="raw-strip">
      <blockquote>“{firstSentences(take.text, 3)}”</blockquote>
      <figcaption>
        raw take · {q.id.toUpperCase()} · {q.title}
      </figcaption>
    </figure>
  );
}
