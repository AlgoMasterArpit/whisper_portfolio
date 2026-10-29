interface Props {
  motion: boolean;
  onMotion: (on: boolean) => void;
}

export function Footer({ motion, onMotion }: Props) {
  return (
    <footer className="footer">
      <div className="wrap">
        <p className="footer__tagline">
          Ask <span>·</span> Verify <span>·</span> <em>Hire.</em>
        </p>
        <div className="footer__grid">
          <div>
            <p className="kicker">Reach me</p>
            <a className="footer__mail" href="mailto:arpittyag246@gmail.com">
              arpittyag246@gmail.com
            </a>
            <ul className="footer__links">
              <li>
                <a href="https://www.linkedin.com/in/arpit-tyagi-526b33277" target="_blank" rel="noreferrer">
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <a href="https://github.com/AlgoMasterArpit" target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              </li>
              <li>
                <a href="https://github.com/AlgoMasterArpit/whisper_portfolio" target="_blank" rel="noreferrer">
                  Source of this site ↗
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="kicker">How this was made</p>
            <p className="footer__made">
              Spoken into Wispr Flow, built with Claude Code, shipped on Vercel. Every claim here links to proof or says
              it has none.
            </p>
            <p className="footer__made">
              Visits are counted anonymously for the growth experiment — no cookies, and no IP addresses are stored.
            </p>
            <button type="button" className="switch" aria-pressed={!motion} onClick={() => onMotion(!motion)}>
              <span className="switch__track" aria-hidden="true">
                <span className="switch__thumb" />
              </span>
              Reduce motion
            </button>
          </div>
        </div>
        <p className="footer__fine">© 2026 Arpit Tyagi · Bijnor → Hamirpur → wherever the work is.</p>
      </div>
    </footer>
  );
}
