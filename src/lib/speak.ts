import { useCallback, useState } from 'react';

export interface VoiceLike {
  lang: string;
  name: string;
  localService?: boolean;
}

const PREFERRED_LANGS = ['en-IN', 'hi-IN', 'en-GB', 'en-US'];

export function pickVoice<V extends VoiceLike>(voices: readonly V[]): V | undefined {
  const norm = (lang: string) => lang.replace('_', '-').toLowerCase();
  for (const lang of PREFERRED_LANGS.map((l) => l.toLowerCase())) {
    const matches = voices.filter((v) => norm(v.lang) === lang);
    if (matches.length) return matches.find((v) => v.localService) ?? matches[0];
  }
  return voices.find((v) => norm(v.lang).startsWith('en'));
}

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

export function speak(text: string): void {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(window.speechSynthesis.getVoices());
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
