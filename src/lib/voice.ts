import { useCallback, useEffect, useRef, useState } from 'react';

export type VoiceMode = 'command' | 'dictate';

export function recognitionCtor() {
  return typeof window === 'undefined' ? undefined : (window.SpeechRecognition ?? window.webkitSpeechRecognition);
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

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        setError('Mic is blocked — typing works too.');
        return;
      }

      const ctx = new AudioContext();
      const node = ctx.createAnalyser();
      node.fftSize = 256;
      node.smoothingTimeConstant = 0.78;
      ctx.createMediaStreamSource(stream).connect(node);
      analyser.current = node;

      const Ctor = recognitionCtor();
      const rec = Ctor ? new Ctor() : null;

      teardown.current = () => {
        if (rec) {
          rec.onend = null;
          rec.abort();
        }
        stream.getTracks().forEach((t) => t.stop());
        void ctx.close();
      };
      setListening(mode);

      if (!rec) {
        setError('Voice commands need Chrome or Edge — the waveform still hears you.');
        return;
      }
      rec.lang = 'en-IN';
      rec.continuous = mode === 'command';
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
        if (event.error === 'not-allowed') setError('Mic is blocked — typing works too.');
      };
      rec.onend = () => {
        if (mode === 'dictate') stop();
        else rec.start();
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
