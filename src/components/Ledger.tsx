import { useId, useState } from 'react';
import { resolveReceipts } from '../../shared/receipts';
import { LEDGER, type LedgerItem } from '../data/ledger';
import { RawStrip } from './RawStrip';
import { Barcode, ProofList } from './Receipt';

export function Ledger() {
  return (
    <section id="ledger" className="section ledger">
      <div className="wrap ledger__grid">
        <div className="ledger__intro" data-reveal>
          <RawStrip question="q2" />
          <p className="kicker">02 — The ledger</p>
          <h2 className="title">
            Itemised, <em>not inflated.</em>
          </h2>
          <p className="lede">
            Everything I’ve done, as line items. Tap one to see what it was — and where the proof lives. No percentages
            I can’t show you.
          </p>
        </div>

        <div className="receipt ledger__paper" data-reveal>
          <header className="receipt__head">
            <span>Arpit Tyagi — itemised</span>
            <span>Bijnor → Hamirpur</span>
          </header>
          {LEDGER.map((group) => (
            <div className="ledger__group" key={group.title}>
              <h3>{group.title}</h3>
              {group.items.map((item) => (
                <Row key={item.name} item={item} />
              ))}
            </div>
          ))}
          <hr />
          <div className="line">
            <span>Credentials</span>
            <span className="line__dots" />
            <span>see work</span>
          </div>
          <div className="line line--total">
            <span>Paid in</span>
            <span className="line__dots" />
            <span>shipped work</span>
          </div>
          <p className="ledger__thanks">Thank you for reading. Keep this receipt.</p>
          <Barcode seed="ledger" />
        </div>
      </div>
    </section>
  );
}

function Row({ item }: { item: LedgerItem }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div className={`ledger__row ${open ? 'is-open' : ''}`}>
      <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
        <span className="ledger__name">{item.name}</span>
        <span className="line__dots" />
        <span className="ledger__tag">{item.tag}</span>
        <span className="ledger__toggle" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>
      <div id={panelId} className="ledger__panel" hidden={!open}>
        <p className="ledger__when">{item.when}</p>
        <ul>
          {item.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <ProofList receipts={resolveReceipts(item.receipts)} />
      </div>
    </div>
  );
}
