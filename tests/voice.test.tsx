// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { isMobile, speechErrorMessage, useVoice } from '../src/lib/voice';

const ANDROID = 'Mozilla/5.0 (Linux; Android 14; SM-A165F) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36';
const DESKTOP = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36';

class FakeRecognition {
  static last: FakeRecognition;
  lang = '';
  continuous = false;
  interimResults = false;
  started = 0;
  onresult: ((e: unknown) => void) | null = null;
  onerror: ((e: { error: string }) => void) | null = null;
  onend: (() => void) | null = null;
  constructor() {
    FakeRecognition.last = this;
  }
  start() {
    this.started++;
  }
  aborted = 0;
  stop() {}
  abort() {
    this.aborted++;
  }
  say(text: string) {
    this.onresult?.({ resultIndex: 0, results: { length: 1, 0: { isFinal: true, length: 1, 0: { transcript: text } } } });
  }
}

function setUp(userAgent: string) {
  const getUserMedia = vi.fn(async () => ({ getTracks: () => [] }));
  vi.stubGlobal('navigator', { ...navigator, userAgent, mediaDevices: { getUserMedia } });
  vi.stubGlobal('webkitSpeechRecognition', FakeRecognition);
  vi.stubGlobal(
    'AudioContext',
    class {
      createAnalyser() {
        return { fftSize: 0, smoothingTimeConstant: 0, frequencyBinCount: 8, getByteFrequencyData() {} };
      }
      createMediaStreamSource() {
        return { connect() {} };
      }
      close() {
        return Promise.resolve();
      }
    },
  );
  return { getUserMedia };
}

afterEach(() => vi.unstubAllGlobals());

describe('isMobile', () => {
  it('spots phones and tablets', () => {
    expect(isMobile(ANDROID)).toBe(true);
    expect(isMobile('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)')).toBe(true);
    expect(isMobile(DESKTOP)).toBe(false);
  });
});

describe('speechErrorMessage', () => {
  it('explains each failure in plain words and stays quiet on a deliberate stop', () => {
    expect(speechErrorMessage('audio-capture')).toMatch(/another app/i);
    expect(speechErrorMessage('not-allowed')).toMatch(/blocked/i);
    expect(speechErrorMessage('service-not-allowed')).toMatch(/blocked/i);
    expect(speechErrorMessage('network')).toMatch(/internet/i);
    expect(speechErrorMessage('no-speech')).toMatch(/didn’t catch/i);
    expect(speechErrorMessage('aborted')).toBeNull();
    expect(speechErrorMessage('weird')).toMatch(/try again/i);
  });
});

describe('useVoice on a phone', () => {
  it('leaves the mic to the speech service instead of grabbing it for the waveform', async () => {
    const { getUserMedia } = setUp(ANDROID);
    const heard: string[] = [];
    const { result } = renderHook(() => useVoice((t) => heard.push(t)));
    await act(() => result.current.start('command'));
    expect(getUserMedia).not.toHaveBeenCalled();
    expect(FakeRecognition.last.started).toBe(1);
    expect(FakeRecognition.last.continuous).toBe(false);
    act(() => FakeRecognition.last.say('rate my tech skills'));
    expect(heard).toEqual(['rate my tech skills']);
  });

  it('stops after one phrase instead of beeping in a restart loop', async () => {
    setUp(ANDROID);
    const { result } = renderHook(() => useVoice(() => {}));
    await act(() => result.current.start('command'));
    act(() => FakeRecognition.last.onend?.());
    expect(FakeRecognition.last.started).toBe(1);
    expect(result.current.listening).toBeNull();
  });

  it('tells the visitor when another app holds the mic', async () => {
    setUp(ANDROID);
    const { result } = renderHook(() => useVoice(() => {}));
    await act(() => result.current.start('dictate'));
    act(() => FakeRecognition.last.onerror?.({ error: 'audio-capture' }));
    expect(result.current.error).toMatch(/another app/i);
    expect(result.current.listening).toBeNull();
  });
});

describe('useVoice on a laptop', () => {
  it('opens the mic for the live waveform and keeps listening for commands', async () => {
    const { getUserMedia } = setUp(DESKTOP);
    const { result } = renderHook(() => useVoice(() => {}));
    await act(() => result.current.start('command'));
    expect(getUserMedia).toHaveBeenCalledTimes(1);
    expect(FakeRecognition.last.continuous).toBe(true);
    act(() => FakeRecognition.last.onend?.());
    expect(FakeRecognition.last.started).toBe(2);
    expect(result.current.readSpectrum()).not.toBeNull();
  });
});

describe('no echo: the mic is held while the twin answers', () => {
  it.each([
    ['laptop', DESKTOP],
    ['phone', ANDROID],
  ])('on a %s, stops listening after a question and ignores the spoken answer', async (_name, ua) => {
    setUp(ua);
    const heard: string[] = [];
    const { result } = renderHook(() => useVoice((t) => heard.push(t)));
    await act(() => result.current.start('command'));
    const rec = FakeRecognition.last;

    act(() => rec.say('tell me about your internship'));
    expect(heard).toEqual(['tell me about your internship']);
    expect(result.current.paused).toBe(true);
    expect(rec.aborted).toBe(1);

    act(() => rec.say('Carboledger is a supply chain compliance platform'));
    act(() => rec.onend?.());
    expect(heard).toEqual(['tell me about your internship']);
    expect(rec.started).toBe(1);
    expect(result.current.listening).toBe('command');
  });

  it('listens again for the next question once released', async () => {
    setUp(ANDROID);
    const heard: string[] = [];
    const { result } = renderHook(() => useVoice((t) => heard.push(t)));
    await act(() => result.current.start('command'));
    const rec = FakeRecognition.last;
    act(() => rec.say('first question'));
    act(() => rec.onend?.());
    act(() => result.current.release());
    expect(result.current.paused).toBe(false);
    expect(rec.started).toBe(2);
    act(() => rec.say('second question'));
    expect(heard).toEqual(['first question', 'second question']);
  });

  it('turning the mic off clears the hold so the next tap starts fresh', async () => {
    setUp(DESKTOP);
    const { result } = renderHook(() => useVoice(() => {}));
    await act(() => result.current.start('command'));
    act(() => FakeRecognition.last.say('hello there friend'));
    act(() => result.current.stop());
    expect(result.current).toMatchObject({ listening: null, paused: false });
  });
});
