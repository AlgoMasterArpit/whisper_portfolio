import { useCallback, useEffect, useRef, useState } from 'react';

export type VoiceMode = 'command' | 'dictate';

export function recognitionCtor() {
  return typeof window === 'undefined' ? undefined : (window.SpeechRecognition ?? window.webkitSpeechRecognition);
}

export function isMobile(userAgent: string): boolean {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent);
}

export function speechErrorMessage(code: string): string | null {
  switch (code) {
    case 'no-speech':
      return 'Didn’t catch that — tap and speak again.';
    case 'aborted':
      return null;
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Mic is blocked — allow it in the browser, or just type.';
    case 'audio-capture':
      return 'Another app is using the mic — close it and try again.';
    case 'network':
      return 'Voice needs internet for speech-to-text — typing works offline.';
    default:
      return 'Voice hiccup — try again, or type your question.';
  }
}

export function useVoice(onFinal: (text: string, mode: VoiceMode) => void) {
  const [listening, setListening] = useState<VoiceMode | null>(null);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const buffer = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const teardown = useRef<(() => void) | null>(null);
  const onFinalRef = useRef(onFinal);

  useEffect(() => {
    onFinalRef.current = onFinal;
  }, [onFinal]);

  const stop = useCallback(() => {
    teardown.current?.();
    teardown.current = null;
    analyser.current = null;
    setListening(null);
    setInterim('');
  }, []);

  const start = useCallback(
    async (mode: VoiceMode) => {
      stop();
      setError(null);

      const Ctor = recognitionCtor();
      // Android/iOS give the mic to one recorder at a time; the speech service must get it, so skip the waveform tap.
      const mobile = isMobile(navigator.userAgent);
      let stream: MediaStream | null = null;
      let ctx: AudioContext | null = null;

      if (!Ctor || !mobile) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
          setError(speechErrorMessage('not-allowed'));
          return;
        }
        ctx = new AudioContext();
        const node = ctx.createAnalyser();
        node.fftSize = 256;
        node.smoothingTimeConstant = 0.78;
        ctx.createMediaStreamSource(stream).connect(node);
        analyser.current = node;
      }

      const rec = Ctor ? new Ctor() : null;
      teardown.current = () => {
        if (rec) {
          rec.onend = null;
          rec.abort();
        }
        stream?.getTracks().forEach((t) => t.stop());
        void ctx?.close();
      };
      setListening(mode);

      if (!rec) {
        setError('Voice commands need Chrome or Edge — the waveform still hears you.');
        return;
      }
      const continuous = mode === 'command' && !mobile;
      rec.lang = 'en-IN';
      rec.continuous = continuous;
      rec.interimResults = true;
      rec.onresult = (event) => {
        let pending = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]!;
          const text = result[0]?.transcript ?? '';
          if (result.isFinal) onFinalRef.current(text.trim(), mode);
          else pending += text;
        }
        setInterim(pending);
      };
      rec.onerror = (event) => {
        const message = speechErrorMessage(event.error);
        if (!message) return;
        setError(message);
        if (event.error !== 'no-speech') stop();
      };
      rec.onend = () => {
        if (continuous) rec.start();
        else stop();
      };
      rec.start();
    },
    [stop],
  );

  const readSpectrum = useCallback((): Uint8Array | null => {
    const node = analyser.current;
    if (!node) return null;
    if (buffer.current?.length !== node.frequencyBinCount) buffer.current = new Uint8Array(node.frequencyBinCount);
    node.getByteFrequencyData(buffer.current);
    return buffer.current;
  }, []);

  useEffect(() => stop, [stop]);

  return { listening, interim, error, start, stop, readSpectrum };
}
