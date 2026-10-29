import { useEffect, useRef, useState, type FormEvent } from 'react';
import { canSpeak, speak } from '../lib/speak';
import type { Entry } from '../lib/useAsk';
import { RawStrip } from './RawStrip';
import { ProofList, Receipt, Stamp } from './Receipt';

const SUGGESTIONS = [
  'Why should a developer do growth?',
  'Sabse bada risk kya liya?',
  'What was your biggest mistake?',
  'What would you do on day one?',
  'How much have you spent on Meta ads?',
];

interface Props {
  entries: readonly Entry[];
  busy: boolean;
  onAsk: (question: string) => void;
  dictating: boolean;
  interim: string;
  onDictate: () => void;
  onStopDictate: () => void;
  speaking: boolean;
  onStopSpeaking: () => void;
  speakOn: boolean;
  onSpeak: (on: boolean) => void;
}

export function AskArpit({
  entries,
  busy,
  onAsk,
  dictating,
  interim,
  onDictate,
  onStopDictate,
  speaking,
  onStopSpeaking,
  speakOn,
  onSpeak,
}: Props) {
  const [draft, setDraft] = useState('');
  const [voiceOut] = useState(canSpeak);
  const spoken = useRef(0);
  const latest = entries[0];

  useEffect(() => {
    if (!(speakOn || latest?.voice) || !latest?.answer || latest.id <= spoken.current) return;
    spoken.current = latest.id;
    void speak(latest.answer.text);
  }, [speakOn, latest]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim() || busy) return;
    onAsk(draft);
    setDraft('');
  };

  return (
    <section id="ask" className="section ask">
      <div className="wrap ask__grid">
        <div className="ask__intro" data-reveal>
          <RawStrip question="q6" />
          <p className="kicker">01 — Ask</p>
          <h2 className="title">
            Ask me <em>anything.</em>
          </h2>
          <p className="lede">
            My twin answers from what I said out loud and prints the receipts. If there’s no proof, it says so — and
            stamps it.
          </p>

          <form className="ask__form" onSubmit={submit}>
            <label className="sr-only" htmlFor="ask-input">
              Your question
            </label>
            <input
              id="ask-input"
              value={dictating ? interim : draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={dictating ? 'Listening…' : 'Type or tap the mic — Hinglish works'}
              maxLength={300}
              autoComplete="off"
              readOnly={dictating}
            />
            <button
              type="button"
              className={`ask__mic ${dictating || speaking ? 'is-live' : ''}`}
              onClick={dictating ? onStopDictate : speaking ? onStopSpeaking : onDictate}
              aria-label={dictating ? 'Stop listening' : speaking ? 'Stop the voice' : 'Ask by voice'}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-2.08A7 7 0 0 0 19 12h-2Z" />
              </svg>
            </button>
            <button type="submit" className="ask__send" disabled={busy || !draft.trim()}>
              Print
            </button>
          </form>

          <ul className="chips" aria-label="Suggested questions">
            {SUGGESTIONS.map((s) => (
              <li key={s}>
                <button type="button" className="chip" disabled={busy} onClick={() => onAsk(s)}>
                  {s}
                </button>
              </li>
            ))}
          </ul>

          {voiceOut && (
            <button type="button" className="switch ask__speak" aria-pressed={speakOn} onClick={() => onSpeak(!speakOn)}>
              <span className="switch__track" aria-hidden="true">
                <span className="switch__thumb" />
              </span>
              Read answers aloud
            </button>
          )}
        </div>

        <div className="printer" aria-live="polite" aria-busy={busy}>
          <div className="printer__slot" aria-hidden="true">
            <span />
          </div>
          {entries.length === 0 && (
            <p className="printer__empty">
              Paper loaded. <br /> Ask something.
            </p>
          )}
          <div className="printer__feed">
            {entries.map((entry) => (
              <AnswerReceipt key={entry.id} entry={entry} voiceOut={voiceOut} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AnswerReceipt({ entry, voiceOut }: { entry: Entry; voiceOut: boolean }) {
  const { answer, error } = entry;
  return (
    <Receipt heading="Answer" no={String(entry.id).padStart(4, '0')} className="answer">
      <p className="answer__q">Q: {entry.question}</p>
      {!answer && !error && <p className="answer__printing">printing</p>}
      {error && <p className="answer__error">{error}</p>}
      {answer && (
        <>
          <p className="answer__text">{answer.text}</p>
          <ProofList receipts={answer.receipts} />
          <div className="answer__foot">
            <span>
              {answer.source === 'twin' ? 'AI twin · from my words' : 'Offline · my own answers'}
              {voiceOut && (
                <button type="button" className="answer__play" onClick={() => void speak(answer.text)}>
                  ▶ Read aloud
                </button>
              )}
            </span>
            <Stamp verdict={answer.verdict} />
          </div>
        </>
      )}
    </Receipt>
  );
}
