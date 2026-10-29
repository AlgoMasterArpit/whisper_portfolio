import { DEFAULT_BASE_URL } from './ask.js';

export const TTS_MODEL = 'canopylabs/orpheus-v1-english';
export const TTS_VOICES = ['austin', 'daniel', 'troy', 'autumn', 'diana', 'hannah'] as const;
export const DEFAULT_VOICE = 'daniel';
export const MAX_SPEAK_CHARS = 600;
const CHUNK_CHARS = 180;
const TTS_TIMEOUT_MS = 15_000;

export interface SpeechEnv {
  apiKey?: string;
  baseUrl?: string;
  voice?: string;
}

export function readSpeakText(body: unknown): { text: string } | { error: string } {
  const raw = (body as { text?: unknown } | null)?.text;
  if (typeof raw !== 'string') return { error: 'Send JSON like {"text": "..."}' };
  const text = raw.replace(/\s+/g, ' ').trim();
  if (!text) return { error: 'Nothing to say.' };
  if (text.length > MAX_SPEAK_CHARS) return { error: `Keep it under ${MAX_SPEAK_CHARS} characters.` };
  return { text };
}

export function splitForSpeech(text: string, max = CHUNK_CHARS): string[] {
  const pieces = (text.match(/[^.!?]+[.!?]*/g) ?? [text])
    .map((s) => s.trim())
    .filter(Boolean)
    .flatMap((sentence) => {
      if (sentence.length <= max) return [sentence];
      const words = sentence.split(' ');
      const parts: string[] = [];
      let current = '';
      for (const word of words) {
        if (current && (current + ' ' + word).length > max) {
          parts.push(current);
          current = word;
        } else current = current ? `${current} ${word}` : word;
      }
      if (current) parts.push(current);
      return parts;
    });

  const chunks: string[] = [];
  for (const piece of pieces) {
    const last = chunks.at(-1);
    if (last && (last + ' ' + piece).length <= max) chunks[chunks.length - 1] = `${last} ${piece}`;
    else chunks.push(piece);
  }
  return chunks;
}

export interface Pcm {
  data: Uint8Array;
  rate: number;
  channels: number;
  bits: number;
}

export function readWav(wav: Uint8Array): Pcm | null {
  const view = new DataView(wav.buffer, wav.byteOffset, wav.byteLength);
  const tag = (at: number) => String.fromCharCode(...wav.subarray(at, at + 4));
  if (wav.length < 12 || tag(0) !== 'RIFF' || tag(8) !== 'WAVE') return null;
  let rate = 0;
  let channels = 0;
  let bits = 0;
  for (let at = 12; at + 8 <= wav.length; ) {
    const id = tag(at);
    const size = view.getUint32(at + 4, true);
    if (id === 'fmt ') {
      channels = view.getUint16(at + 10, true);
      rate = view.getUint32(at + 12, true);
      bits = view.getUint16(at + 22, true);
    }
    if (id === 'data') {
      if (!rate) return null;
      const end = Math.min(wav.length, at + 8 + size);
      return { data: wav.subarray(at + 8, end), rate, channels, bits };
    }
    at += 8 + size + (size % 2);
  }
  return null;
}

export function writeWav(parts: readonly Pcm[]): Uint8Array {
  const { rate, channels, bits } = parts[0]!;
  const length = parts.reduce((n, p) => n + p.data.length, 0);
  const out = new Uint8Array(44 + length);
  const view = new DataView(out.buffer);
  const put = (at: number, s: string) => [...s].forEach((c, i) => (out[at + i] = c.charCodeAt(0)));
  const blockAlign = (channels * bits) / 8;
  put(0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  put(8, 'WAVE');
  put(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bits, true);
  put(36, 'data');
  view.setUint32(40, length, true);
  let at = 44;
  for (const p of parts) {
    out.set(p.data, at);
    at += p.data.length;
  }
  return out;
}

export function voiceFrom(voice: string | undefined): string {
  return (TTS_VOICES as readonly string[]).includes(voice ?? '') ? voice! : DEFAULT_VOICE;
}

export async function synthesize(text: string, env: SpeechEnv, fetchImpl: typeof fetch = fetch): Promise<Uint8Array | null> {
  if (!env.apiKey) return null;
  const signal = AbortSignal.timeout(TTS_TIMEOUT_MS);
  try {
    const parts = await Promise.all(
      splitForSpeech(text).map(async (input) => {
        const res = await fetchImpl(`${env.baseUrl || DEFAULT_BASE_URL}/audio/speech`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: `Bearer ${env.apiKey}` },
          body: JSON.stringify({ model: TTS_MODEL, voice: voiceFrom(env.voice), input, response_format: 'wav' }),
          signal,
        });
        return res.ok ? readWav(new Uint8Array(await res.arrayBuffer())) : null;
      }),
    );
    if (!parts.length || parts.some((p) => !p)) return null;
    return writeWav(parts as Pcm[]);
  } catch {
    return null;
  }
}
