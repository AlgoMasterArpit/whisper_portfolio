import type { ReactNode } from 'react';
import type { Receipt as Proof, Verdict } from '../../shared/receipts';

export const VERDICT_LABEL: Record<Verdict, string> = {
  verified: 'Verified',
  'self-reported': 'Self-reported',
  'no-receipt': 'No receipt',
};

interface ReceiptProps {
  heading?: string;
  no?: string;
  barcode?: string;
  className?: string;
  children: ReactNode;
}

export function Receipt({ heading, no, barcode, className = '', children }: ReceiptProps) {
  return (
    <article className={`receipt ${className}`}>
      {heading && (
        <header className="receipt__head">
          <span>{heading}</span>
          {no && <span>#{no}</span>}
        </header>
      )}
      {children}
      {barcode !== undefined && <Barcode seed={barcode} />}
    </article>
  );
}

export function Barcode({ seed }: { seed: string }) {
  const bars: { x: number; w: number }[] = [];
  let h = 2166136261;
  let x = 0;
  for (let i = 0; x < 220; i++) {
    h = Math.imul(h ^ (seed.charCodeAt(i % Math.max(1, seed.length)) || i), 16777619);
    const w = 1 + (Math.abs(h) % 3);
    if (i % 2 === 0) bars.push({ x, w });
    x += w + 1;
  }
  return (
    <svg className="barcode" viewBox="0 0 220 40" preserveAspectRatio="none" aria-hidden="true">
      {bars.map((b) => (
        <rect key={b.x} x={b.x} width={b.w} height="40" />
      ))}
    </svg>
  );
}

export function Stamp({ verdict }: { verdict: Verdict }) {
  return <span className={`stamp stamp--${verdict}`}>{VERDICT_LABEL[verdict]}</span>;
}

export function ProofList({ receipts }: { receipts: readonly Proof[] }) {
  if (!receipts.length) return null;
  return (
    <ul className="proofs">
      {receipts.map((r) => (
        <li key={r.id}>
          {r.url ? (
            <a href={r.url} target={r.url.startsWith('#') ? undefined : '_blank'} rel="noreferrer">
              <span>{r.label}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <span className="proofs__self">
              <span>{r.label}</span>
              <span>{r.note}</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
