import { useCallback, useEffect, useState } from 'react';

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

function browserVoice(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

export function canSpeak(): boolean {
  return browserVoice() || typeof Audio !== 'undefined';
}

let turn = 0;
let playing: HTMLAudioElement | null = null;
const clips = new Map<string, string>();

let speakingNow = false;
const listeners = new Set<(speaking: boolean) => void>();

function setSpeaking(next: boolean): void {
  if (speakingNow === next) return;
  speakingNow = next;
  listeners.forEach((l) => l(next));
}

export function isSpeaking(): boolean {
  return speakingNow;
}

export function useSpeaking(): boolean {
  const [speaking, setState] = useState(speakingNow);
  useEffect(() => {
    listeners.add(setState);
    setState(speakingNow);
    return () => {
      listeners.delete(setState);
    };
  }, []);
  return speaking;
}

async function twinClip(text: string): Promise<string | null> {
  const hit = clips.get(text);
  if (hit) return hit;
  try {
    const res = await fetch('/api/speak', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok || !res.headers.get('content-type')?.startsWith('audio/')) return null;
    const url = URL.createObjectURL(await res.blob());
    clips.set(text, url);
    return url;
  } catch {
    return null;
  }
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

async function speakInBrowser(text: string, mine: number): Promise<void> {
  if (!browserVoice()) return;
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(await loadVoices());
  if (mine !== turn) return;
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }
  utterance.rate = 1.03;
  const done = () => {
    if (mine === turn) setSpeaking(false);
  };
  utterance.onend = done;
  utterance.onerror = done;
  window.speechSynthesis.speak(utterance);
}

export async function speak(text: string): Promise<void> {
  stopSpeaking();
  const mine = turn;
  setSpeaking(true);
  const url = typeof Audio === 'undefined' ? null : await twinClip(text);
  if (mine !== turn) return;
  if (url) {
    const audio = new Audio(url);
    playing = audio;
    audio.onended = () => {
      if (mine === turn) {
        playing = null;
        setSpeaking(false);
      }
    };
    try {
      await audio.play();
      return;
    } catch {
      playing = null;
    }
  }
  if (browserVoice()) await speakInBrowser(text, mine);
  else if (mine === turn) setSpeaking(false);
}

export function stopSpeaking(): void {
  turn++;
  playing?.pause();
  playing = null;
  if (browserVoice()) window.speechSynthesis.cancel();
  setSpeaking(false);
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
