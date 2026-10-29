import { useCallback, useEffect, useState } from 'react';
import { AskArpit } from './components/AskArpit';
import { CommandBar } from './components/CommandBar';
import { Footer } from './components/Footer';
import { GrowthLab } from './components/GrowthLab';
import { Hero } from './components/Hero';
import { Ledger } from './components/Ledger';
import { Museum } from './components/Museum';
import { Nav } from './components/Nav';
import { RawTape } from './components/RawTape';
import { SpotTheFake } from './components/SpotTheFake';
import { looksLikeQuestion, parseCommand, type Command, type SectionId } from './lib/commands';
import { useMotion, useReveal } from './lib/motion';
import { RawContext } from './lib/raw';
import { useSpeakPref } from './lib/speak';
import { useAsk } from './lib/useAsk';
import { useVoice, type VoiceMode } from './lib/voice';

const SECTION_NAME: Record<SectionId, string> = {
  top: 'top',
  ask: 'the twin',
  ledger: 'the ledger',
  museum: 'the museum',
  growth: 'the growth lab',
  game: 'the game',
  tape: 'the tape',
};

function isTyping(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

export function App() {
  const [raw, setRaw] = useState(false);
  const [motion, setMotion] = useMotion();
  const [speakOn, setSpeakOn] = useSpeakPref();
  const [helpOpen, setHelpOpen] = useState(false);
  const [heard, setHeard] = useState('');
  const { entries, ask, busy } = useAsk();
  useReveal();

  const scrollTo = useCallback(
    (id: SectionId) => document.getElementById(id)?.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' }),
    [motion],
  );

  const askAndShow = useCallback(
    (question: string) => {
      scrollTo('ask');
      void ask(question);
    },
    [ask, scrollTo],
  );

  const run = useCallback(
    (command: Command) => {
      switch (command.type) {
        case 'goto':
          scrollTo(command.section);
          return `→ ${SECTION_NAME[command.section]}`;
        case 'raw':
          setRaw(command.on);
          return command.on ? '→ raw mode on' : '→ shipped mode';
        case 'motion':
          setMotion(command.on);
          return command.on ? '→ motion on' : '→ motion reduced';
        case 'ask':
          askAndShow(command.question);
          return `→ asking: ${command.question}`;
        case 'speak':
          setSpeakOn(command.on);
          return command.on ? '→ answers read aloud' : '→ answers silent';
        case 'help':
          setHelpOpen(true);
          return '→ help';
      }
    },
    [askAndShow, scrollTo, setMotion, setSpeakOn],
  );

  const onFinal = useCallback(
    (text: string, mode: VoiceMode) => {
      if (!text) return;
      if (mode === 'dictate') {
        askAndShow(text);
        return;
      }
      const command = parseCommand(text);
      if (command) setHeard(`“${text}” ${run(command)}`);
      else if (looksLikeQuestion(text)) {
        askAndShow(text);
        setHeard(`“${text}” → asking the twin`);
      } else setHeard(`“${text}” — try “help”`);
    },
    [askAndShow, run],
  );

  const voice = useVoice(onFinal);
  const { listening, start, stop } = voice;

  const toggleCommands = useCallback(() => {
    if (listening === 'command') stop();
    else void start('command');
  }, [listening, start, stop]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      if (e.key === '?') setHelpOpen(true);
      else if (e.key === 'v' || e.key === 'V') toggleCommands();
      else if (e.key === 'r' || e.key === 'R') setRaw((r) => !r);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleCommands]);

  return (
    <RawContext.Provider value={raw}>
      <a className="skip" href="#ask">
        Skip to the twin
      </a>
      <Nav raw={raw} onRaw={setRaw} listening={listening !== null} onHelp={() => setHelpOpen(true)} />
      <main className={raw ? 'is-raw' : undefined}>
        <Hero
          readSpectrum={voice.readSpectrum}
          motion={motion}
          listening={listening}
          interim={voice.interim}
          heard={heard}
          voiceError={voice.error}
          onTalk={() => void start('command')}
          onStop={stop}
        />
        <AskArpit
          entries={entries}
          busy={busy}
          onAsk={askAndShow}
          dictating={listening === 'dictate'}
          interim={voice.interim}
          onDictate={() => void start('dictate')}
          onStopDictate={stop}
          speakOn={speakOn}
          onSpeak={setSpeakOn}
        />
        <Ledger />
        <Museum />
        <GrowthLab />
        <SpotTheFake />
        <RawTape />
      </main>
      <Footer motion={motion} onMotion={setMotion} />
      <CommandBar
        live={listening === 'command'}
        interim={voice.interim}
        heard={heard}
        onToggle={toggleCommands}
        helpOpen={helpOpen}
        onCloseHelp={() => setHelpOpen(false)}
      />
    </RawContext.Provider>
  );
}
