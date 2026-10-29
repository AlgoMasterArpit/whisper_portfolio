import { useCallback, useState } from 'react';

export interface VoiceLike {
  lang: string;
  name: string;
  localService?: boolean;
}

const NATURAL = /natural|neural|online|premium|enhanced|google|siri/i;
const LANG_SCORE: Record<string, number> = { 'en-in': 4, 'en-gb': 2, 'en-us': 2, 'hi-in': 1 };

export function voiceScore(voice: VoiceLike): number {
  const lang = voice.lang.replace('_', '-').toLowerCase();
  const langScore = LANG_SCORE[lang] ?? (lang.startsWith('en') ? 1.5 : 0);
  if (!langScore) return 0;
  return langScore + (NATURAL.test(voice.name) ? 10 : 0);
}

export function pickVoice<V extends VoiceLike>(voices: readonly V[]): V | undefined {
  let best: V | undefined;
  let bestScore = 0;
  for (const voice of voices) {
    const score = voiceScore(voice);
    if (score > bestScore) {
      best = voice;
      bestScore = score;
    }
  }
  return best;
}

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

export function loadVoices(timeoutMs = 1000): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis;
  const now = synth.getVoices();
  if (now.length) return Promise.resolve(now);
  return new Promise((resolve) => {
    const done = () => {
      synth.removeEventListener?.('voiceschanged', done);
      resolve(synth.getVoices());
    };
    synth.addEventListener?.('voiceschanged', done);
    setTimeout(done, timeoutMs);
  });
}

export async function speak(text: string): Promise<void> {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(await loadVoices());
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }
  utterance.rate = 1.03;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (canSpeak()) window.speechSynthesis.cancel();
}

const KEY = 'receipts:speak';

export function useSpeakPref(): [boolean, (on: boolean) => void] {
  const [on, setOn] = useState(() => {
    try {
      return localStorage.getItem(KEY) === 'on';
    } catch {
      return false;
    }
  });
  const set = useCallback((next: boolean) => {
    setOn(next);
    if (!next) stopSpeaking();
    try {
      localStorage.setItem(KEY, next ? 'on' : 'off');
    } catch {
      /* storage unavailable */
    }
  }, []);
  return [on, set];
}
