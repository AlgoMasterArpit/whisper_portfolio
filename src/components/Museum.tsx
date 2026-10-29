import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { resolveReceipts } from '../../shared/receipts';
import { SCENES, closingLine, matchCount, type ExhibitKind } from '../data/story';
import { ProofList } from './Receipt';

const KIND_LABEL: Record<ExhibitKind, string> = { risk: 'Risk', mistake: 'Mistake', call: 'Judgement call' };

export function Museum() {
  const [choices, setChoices] = useState<(0 | 1)[]>([]);
  const [index, setIndex] = useState(0);
  const [dark, setDark] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  const finished = index >= SCENES.length;
  const scene = SCENES[index];
  const picked = choices[index];

  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [index]);

  const track = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || document.documentElement.dataset.motion === 'off') return;
    const box = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--x', `${e.clientX - box.left}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY - box.top}px`);
    if (!dark) setDark(true);
  };

  const choose = (option: 0 | 1) => {
    if (picked !== undefined) return;
    setChoices((c) => {
      const next = [...c];
      next[index] = option;
      return next;
    });
  };

  const go = (to: number) => {
    moved.current = true;
    setIndex(to);
  };

  const restart = () => {
    setChoices([]);
    go(0);
  };

  return (
    <section
      id="museum"
      className={`section museum ${dark ? 'is-dark' : ''}`}
      onPointerMove={track}
      onPointerLeave={() => setDark(false)}
    >
      <div className="museum__dark" aria-hidden="true" />
      <div className="wrap museum__inner">
        <div data-reveal>
          <p className="kicker">03 — Mistake museum</p>
          <h2 className="title">
            Walk through <em>my worst calls.</em>
          </h2>
          <p className="lede">
            Real decisions I made. Make each call before you see mine. Bring a torch — the lights are off in here.
          </p>
        </div>

        <ol className="museum__progress" aria-label="Exhibits">
          {SCENES.map((s, i) => (
            <li key={s.id} className={i === index ? 'is-current' : i < index ? 'is-done' : ''}>
              <span className="sr-only">
                Exhibit {i + 1}
                {i === index ? ' (current)' : ''}
              </span>
            </li>
          ))}
        </ol>

        {finished || !scene ? (
          <div className="exhibit exhibit--end">
            <p className="exhibit__year" aria-hidden="true">
              {matchCount(choices)}/{SCENES.length}
            </p>
            <h3 ref={headingRef} tabIndex={-1}>
              You made {matchCount(choices)} of {SCENES.length} calls the way I did.
            </h3>
            <p className="exhibit__setup">{closingLine(matchCount(choices), SCENES.length)}</p>
            <button type="button" className="btn" onClick={restart}>
              Walk it again
            </button>
          </div>
        ) : (
          <article className="exhibit" key={scene.id}>
            <p className="exhibit__year" aria-hidden="true">
              {scene.year}
            </p>
            <p className={`exhibit__kind exhibit__kind--${scene.kind}`}>
              Exhibit {index + 1} · {KIND_LABEL[scene.kind]} · {scene.year}
            </p>
            <h3 ref={headingRef} tabIndex={-1}>
              {scene.title}
            </h3>
            <p className="exhibit__setup">{scene.setup}</p>

            <div className="exhibit__options" role="group" aria-label="What would you do?">
              {scene.options.map((option, i) => {
                const state =
                  picked === undefined ? '' : i === scene.actual ? 'is-actual' : i === picked ? 'is-yours' : 'is-muted';
                return (
                  <button
                    key={option}
                    type="button"
                    className={`option ${state}`}
                    onClick={() => choose(i as 0 | 1)}
                    disabled={picked !== undefined}
                  >
                    <span className="option__key">{i === 0 ? 'A' : 'B'}</span>
                    {option}
                    {picked !== undefined && i === scene.actual && <span className="option__tag">I chose this</span>}
                  </button>
                );
              })}
            </div>

            {picked !== undefined && (
              <div className="plaque" aria-live="polite">
                <p className="plaque__verdict">{picked === scene.actual ? 'Same call as me.' : 'You called it differently.'}</p>
                <p>{scene.outcome}</p>
                <p className="plaque__lesson">{scene.lesson}</p>
                <ProofList receipts={resolveReceipts(scene.receipts)} />
                <button type="button" className="btn" onClick={() => go(index + 1)}>
                  {index + 1 < SCENES.length ? 'Next exhibit →' : 'See how you did →'}
                </button>
              </div>
            )}
          </article>
        )}
      </div>
    </section>
  );
}
