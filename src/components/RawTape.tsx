import { MISHEARS } from '../data/mishears';
import { QUESTIONS, WORDS_SPOKEN } from '../lib/raw';

const TAKES = QUESTIONS.reduce((n, q) => n + q.takes.length, 0);

export function RawTape() {
  return (
    <section id="tape" className="section tape">
      <div className="wrap">
        <div data-reveal>
          <p className="kicker">06 — The tape</p>
          <h2 className="title">
            Raw <span className="tape__arrow">→</span> <em>shipped.</em>
          </h2>
          <p className="lede">
            I didn’t type this portfolio. I said it — into Wispr Flow, rambling, in Hinglish, wrong numbers and all. Here
            is what I actually said, and what it misheard.
          </p>
        </div>

        <dl className="tape__stats" data-reveal>
          <div>
            <dt>Words spoken</dt>
            <dd>{WORDS_SPOKEN.toLocaleString('en-IN')}</dd>
          </div>
          <div>
            <dt>Voice takes</dt>
            <dd>{TAKES}</dd>
          </div>
          <div>
            <dt>Mis-hearings fixed</dt>
            <dd>{MISHEARS.length}</dd>
          </div>
        </dl>

        <ul className="mishears">
          {MISHEARS.map((m) => (
            <li key={m.said} className="mishear" data-reveal>
              <span className="mishear__said">
                <s>{m.said}</s>
              </span>
              <span className="mishear__shipped">{m.shipped}</span>
              <span className="mishear__q">{m.question.toUpperCase()}</span>
            </li>
          ))}
        </ul>

        <div className="transcripts">
          <h3>Every take, unedited</h3>
          {QUESTIONS.map((q) => (
            <details key={q.id} className="transcript">
              <summary>
                <span className="transcript__id">{q.id.toUpperCase()}</span>
                {q.title}
                <span className="transcript__count">
                  {q.takes.length} take{q.takes.length > 1 ? 's' : ''}
                </span>
              </summary>
              {q.takes.map((t) => (
                <div key={t.label} className="transcript__take">
                  <p className="transcript__label">{t.label}</p>
                  {t.text.split(/\n{2,}/).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ))}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
