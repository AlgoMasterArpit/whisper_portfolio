import { describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_VOICE,
  MAX_SPEAK_CHARS,
  TTS_MODEL,
  readSpeakText,
  readWav,
  splitForSpeech,
  synthesize,
  voiceFrom,
  writeWav,
  type Pcm,
} from '../shared/speech';

const pcm = (bytes: number[], rate = 24000): Pcm => ({ data: new Uint8Array(bytes), rate, channels: 1, bits: 16 });

function streamingWav(samples: number[]): Uint8Array {
  const head = writeWav([pcm(samples)]);
  const view = new DataView(head.buffer);
  view.setUint32(4, 0xffffffff, true);
  view.setUint32(40, 0xffffffff, true);
  return head;
}

describe('readSpeakText', () => {
  it('accepts and tidies text', () => {
    expect(readSpeakText({ text: '  hello   there ' })).toEqual({ text: 'hello there' });
  });

  it.each([null, {}, { text: 1 }, { text: '  ' }, { text: 'x'.repeat(MAX_SPEAK_CHARS + 1) }])('rejects %j', (body) => {
    expect(readSpeakText(body)).toHaveProperty('error');
  });
});

describe('splitForSpeech', () => {
  it('keeps short text whole', () => {
    expect(splitForSpeech('One. Two.')).toEqual(['One. Two.']);
  });

  it('packs sentences into chunks under the limit', () => {
    const chunks = splitForSpeech('Aaaa aaaa. Bbbb bbbb. Cccc cccc.', 22);
    expect(chunks).toEqual(['Aaaa aaaa. Bbbb bbbb.', 'Cccc cccc.']);
    expect(chunks.every((c) => c.length <= 22)).toBe(true);
  });

  it('breaks an overlong sentence on word boundaries', () => {
    const chunks = splitForSpeech('one two three four five six seven', 10);
    expect(chunks.every((c) => c.length <= 10)).toBe(true);
    expect(chunks.join(' ')).toBe('one two three four five six seven');
  });

  it('never drops text', () => {
    const text = 'I built NOVA. It speaks Hinglish! Does it work? Yes, mostly — and it never goes online on its own.';
    expect(splitForSpeech(text, 40).join(' ')).toBe(text);
  });
});

describe('wav round trip', () => {
  it('reads a streaming wav whose sizes are unknown', () => {
    const parsed = readWav(streamingWav([1, 2, 3, 4]));
    expect(parsed).toMatchObject({ rate: 24000, channels: 1, bits: 16 });
    expect([...parsed!.data]).toEqual([1, 2, 3, 4]);
  });

  it('stitches chunks into one wav with correct sizes', () => {
    const wav = writeWav([pcm([1, 2]), pcm([3, 4, 5, 6])]);
    const view = new DataView(wav.buffer);
    expect(view.getUint32(4, true)).toBe(36 + 6);
    expect(view.getUint32(40, true)).toBe(6);
    expect(view.getUint32(28, true)).toBe(48000);
    expect([...readWav(wav)!.data]).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('rejects things that are not wav', () => {
    expect(readWav(new TextEncoder().encode('{"error":"nope"}'))).toBeNull();
    expect(readWav(new Uint8Array(4))).toBeNull();
  });
});

describe('voiceFrom', () => {
  it('only allows known voices', () => {
    expect(voiceFrom('troy')).toBe('troy');
    expect(voiceFrom('evil')).toBe(DEFAULT_VOICE);
    expect(voiceFrom(undefined)).toBe(DEFAULT_VOICE);
  });
});

describe('synthesize', () => {
  const ok = () => vi.fn(async () => new Response(streamingWav([7, 7]) as BodyInit));

  it('does nothing without a key', async () => {
    const fetchImpl = vi.fn();
    expect(await synthesize('hi', {}, fetchImpl)).toBeNull();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('asks orpheus for each chunk and returns one stitched wav', async () => {
    const fetchImpl = ok();
    const long = 'Sentence one is here. '.repeat(12).trim();
    const wav = await synthesize(long, { apiKey: 'k', voice: 'troy' }, fetchImpl);
    const calls = fetchImpl.mock.calls.length;
    expect(calls).toBe(splitForSpeech(long).length);
    expect(calls).toBeGreaterThan(1);
    const body = JSON.parse(((fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].body as string));
    expect(body).toMatchObject({ model: TTS_MODEL, voice: 'troy', response_format: 'wav' });
    expect(readWav(wav!)!.data.length).toBe(2 * calls);
  });

  it('gives up cleanly when any chunk fails, so the browser voice can take over', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response(streamingWav([1, 1]) as BodyInit))
      .mockResolvedValueOnce(new Response('{"error":"rate limited"}', { status: 429 }));
    expect(await synthesize('One. '.repeat(60), { apiKey: 'k' }, fetchImpl)).toBeNull();
    const down = vi.fn(async () => {
      throw new TypeError('offline');
    });
    expect(await synthesize('hi', { apiKey: 'k' }, down)).toBeNull();
  });
});
