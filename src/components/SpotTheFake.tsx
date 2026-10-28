import { useState } from 'react';
import { findReceipt } from '../../shared/receipts';
import { ROUNDS, fakeIndex, rank } from '../data/game';
import { RawStrip } from './RawStrip';
import { Stamp } from './Receipt';

export function SpotTheFake() {
  const [round, setRound] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const done = round >= ROUNDS.length;
  const current = ROUNDS[round];

  const choose = (i: number) => {
    if (pick !== null || !current) return;
    setPick(i);
    if (i === fakeIndex(current)) setScore((s) => s + 1);
  };

  const next = () => {
    setPick(null);
    setRound((r) => r + 1);
  };

  const reset = () => {
    setRound(0);
    setPick(null);
    setScore(0);
  };

  return (
    <section id="game" className="section game">
      <div className="wrap">
        <div data-reveal>
          <RawStrip question="q9" />
          <p className="kicker">05 — Spot the fake</p>
          <h2 className="title">
            One of these <em>is a lie.</em>
          </h2>
          <p className="lede">Four claims about me. Three have receipts. Find the one that doesn’t.</p>
        </div>

        {done || !current ? (
          <div className="game__end">
            <p className="game__score">
              {score}/{ROUNDS.length}
            </p>
            <p className="game__rank">{rank(score, ROUNDS.length)}</p>
            <button type="button" className="btn" onClick={reset}>
              Play again
            </button>
          </div>
        ) : (
          <>
            <p className="game__round">
              Round {round + 1} of {ROUNDS.length} · score {score}
            </p>
            <div className="claims" role="group" aria-label="Which claim is fake?">
              {current.claims.map((claim, i) => {
                const revealed = pick !== null;
                const fake = !claim.receipt;
                const proof = claim.receipt ? findReceipt(claim.receipt) : undefined;
                return (
                  <button
                    key={claim.text}
                    type="button"
                    className={`claim ${revealed ? (fake ? 'is-fake' : 'is-real') : ''} ${pick === i ? 'is-picked' : ''}`}
                    onClick={() => choose(i)}
                    aria-disabled={revealed}
                  >
                    <span className="claim__text">{claim.text}</span>
                    {revealed && (
                      <span className="claim__reveal">
                        <Stamp verdict={fake ? 'no-receipt' : proof?.kind === 'public' ? 'verified' : 'self-reported'} />
                        {proof && <span className="claim__proof">{proof.label}</span>}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {pick !== null && (
              <div className="game__why" aria-live="polite">
                <p>
                  <strong>{pick === fakeIndex(current) ? 'Caught it.' : 'Not that one.'}</strong> {current.why}
                </p>
                <button type="button" className="btn" onClick={next}>
                  {round + 1 < ROUNDS.length ? 'Next round →' : 'Final score →'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
