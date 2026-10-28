import type { CSSProperties } from 'react';
import { WORDS_SPOKEN } from '../lib/raw';
import type { VoiceMode } from '../lib/voice';
import { RawStrip } from './RawStrip';
import { Barcode, Stamp } from './Receipt';
import { VoiceRidge } from './VoiceRidge';

interface Props {
  readSpectrum: () => Uint8Array | null;
  motion: boolean;
  listening: VoiceMode | null;
  interim: string;
  heard: string;
  voiceError: string | null;
  onTalk: () => void;
  onStop: () => void;
}

const LINES: readonly [string, string][] = [
  ['NIT Hamirpur · ECE ’28', 'CGPA 8.94'],
  ['DSA problems', '600+'],
  ['Electrothon dashboard users', '500+'],
  ['Hackathons, Oct 2026', '4'],
  ['Words spoken to build this', WORDS_SPOKEN.toLocaleString('en-IN')],
];

export function Hero({ readSpectrum, motion, listening, interim, heard, voiceError, onTalk, onStop }: Props) {
  const live = listening === 'command';
  return (
    <header id="top" className="hero">
      <VoiceRidge readSpectrum={readSpectrum} motion={motion} />
      <div className="hero__inner wrap">
        <div className="hero__copy">
          <RawStrip question="q1" />
          <p className="kicker">Arpit Tyagi · NIT Hamirpur · built by voice</p>
          <h1 className="hero__title">
            Don’t trust my resume.
            <span>Check my receipts.</span>
          </h1>
          <p className="lede">
            Every claim on this page links to proof — or admits it has none. Ask me anything, out loud.
          </p>
          <div className="hero__actions">
            <button type="button" className={`btn btn--mic ${live ? 'is-live' : ''}`} onClick={live ? onStop : onTalk}>
              <span className="btn__dot" aria-hidden="true" />
              {live ? 'Listening — tap to stop' : 'Talk to this page'}
            </button>
            <a className="btn btn--ghost" href="#ask">
              Ask the twin ↓
            </a>
          </div>
          <p className="hero__caption" aria-live="polite">
            {voiceError ??
              (live
                ? interim || heard || 'Try “mistakes dikhao” or “ask why growth?”'
                : 'Try saying “mistakes dikhao” or “ask why growth?”')}
          </p>
        </div>

        <div className="hero__receipt" aria-label="Summary receipt">
          <div className="printer-slot" aria-hidden="true" />
          <div className="receipt receipt--print">
            <header className="receipt__head">
              <span>Arpit Tyagi</span>
              <span>#0001</span>
            </header>
            {LINES.map(([label, value], i) => (
              <div className="line" key={label} style={{ '--i': i } as CSSProperties}>
                <span>{label}</span>
                <span className="line__dots" />
                <span>{value}</span>
              </div>
            ))}
            <hr />
            <div className="line line--total" style={{ '--i': LINES.length } as CSSProperties}>
              <span>Total</span>
              <span className="line__dots" />
              <span>Work &gt; credentials</span>
            </div>
            <div className="hero__stamp">
              <Stamp verdict="verified" />
            </div>
            <Barcode seed="arpit-tyagi-receipts" />
          </div>
        </div>
      </div>
    </header>
  );
}
