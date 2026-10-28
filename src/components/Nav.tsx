const LINKS = [
  ['#ask', 'Ask'],
  ['#ledger', 'Ledger'],
  ['#museum', 'Museum'],
  ['#growth', 'Growth'],
  ['#game', 'Play'],
  ['#tape', 'Tape'],
] as const;

interface Props {
  raw: boolean;
  onRaw: (on: boolean) => void;
  listening: boolean;
  onHelp: () => void;
}

export function Nav({ raw, onRaw, listening, onHelp }: Props) {
  return (
    <nav className="nav" aria-label="Main">
      <a className="nav__brand" href="#top">
        <span className={`nav__dot ${listening ? 'is-live' : ''}`} aria-hidden="true" />
        Receipts<span className="nav__by">/arpit</span>
      </a>
      <ul className="nav__links">
        {LINKS.map(([href, label]) => (
          <li key={href}>
            <a href={href}>{label}</a>
          </li>
        ))}
      </ul>
      <div className="nav__tools">
        <button type="button" className="switch" aria-pressed={raw} onClick={() => onRaw(!raw)}>
          <span className="switch__track" aria-hidden="true">
            <span className="switch__thumb" />
          </span>
          {raw ? 'Raw' : 'Shipped'}
        </button>
        <button type="button" className="nav__help" onClick={onHelp} aria-label="Voice commands">
          ?
        </button>
      </div>
    </nav>
  );
}
