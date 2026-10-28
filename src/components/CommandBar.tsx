import { useEffect, useRef } from 'react';
import { COMMAND_HELP } from '../lib/commands';

interface Props {
  live: boolean;
  interim: string;
  heard: string;
  onToggle: () => void;
  helpOpen: boolean;
  onCloseHelp: () => void;
}

export function CommandBar({ live, interim, heard, onToggle, helpOpen, onCloseHelp }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (helpOpen && !d.open) d.showModal?.();
    if (!helpOpen && d.open) d.close();
  }, [helpOpen]);

  return (
    <>
      <div className={`cmdbar ${live ? 'is-live' : ''}`}>
        <button type="button" className="cmdbar__mic" onClick={onToggle} aria-pressed={live} aria-label={live ? 'Stop voice commands' : 'Start voice commands'}>
          <span className="cmdbar__bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        </button>
        <p className="cmdbar__text" aria-live="polite">
          {live ? interim || heard || 'Listening…' : heard || 'Press to talk to this page'}
        </p>
      </div>

      <dialog ref={dialog} className="help" onClose={onCloseHelp} aria-labelledby="help-title">
        <h2 id="help-title">Say it, don’t click it</h2>
        <p>Turn on the mic (bottom right), then say any of these. Hinglish works.</p>
        <ul>
          {COMMAND_HELP.map((c) => (
            <li key={c.say}>
              <span>{c.say}</span>
              <span>{c.does}</span>
            </li>
          ))}
        </ul>
        <p className="help__keys">
          Keyboard: <kbd>?</kbd> this list · <kbd>V</kbd> mic on/off · <kbd>R</kbd> raw mode
        </p>
        <form method="dialog">
          <button className="btn">Got it</button>
        </form>
      </dialog>
    </>
  );
}
