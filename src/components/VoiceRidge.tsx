import { useEffect, useRef } from 'react';
import { loudness, spectrumRow, syntheticRow } from '../lib/ridge';

const ROWS = 30;
const POINTS = 72;

interface Props {
  readSpectrum: () => Uint8Array | null;
  motion: boolean;
}

export function VoiceRidge({ readSpectrum, motion }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const css = getComputedStyle(document.documentElement);
    const ink = css.getPropertyValue('--ink').trim() || '#0e0d0b';
    const paper = css.getPropertyValue('--paper').trim() || '#f3eee2';
    const stamp = css.getPropertyValue('--stamp').trim() || '#d4472c';

    let t = 0;
    const rows = Array.from({ length: ROWS }, (_, i) => syntheticRow(POINTS, (t = i * 0.08), 3));
    let width = 0;
    let height = 0;
    let level = 0;

    const draw = () => {
      ctx.fillStyle = ink;
      ctx.fillRect(0, 0, width, height);
      const top = height * 0.16;
      const gap = (height * 0.78) / ROWS;
      const amp = Math.min(height * 0.34, gap * 10);
      const left = width * 0.03;
      const span = width * 0.94;
      for (let r = 0; r < ROWS; r++) {
        const row = rows[r]!;
        const depth = (r + 1) / ROWS;
        const y0 = top + (r + 1) * gap;
        ctx.beginPath();
        ctx.moveTo(left, y0);
        for (let i = 0; i < POINTS; i++) {
          ctx.lineTo(left + (span * i) / (POINTS - 1), y0 - row[i]! * amp * (0.3 + 0.7 * depth));
        }
        ctx.lineTo(left + span, y0);
        ctx.closePath();
        ctx.fillStyle = ink;
        ctx.fill();
        ctx.globalAlpha = 0.12 + 0.88 * depth ** 1.4;
        ctx.strokeStyle = r === ROWS - 1 && level > 0.03 ? stamp : paper;
        ctx.lineWidth = r === ROWS - 1 ? 1.8 : 1.1;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    };

    const resize = () => {
      const dpr = Math.min(canvas.clientWidth > 1600 ? 1.5 : 2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    resize();
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
    ro?.observe(canvas);
    if (!motion) return () => ro?.disconnect();

    let raf = 0;
    let frame = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (++frame % 3) return;
      t += 0.08;
      const spectrum = readSpectrum();
      level = spectrum ? loudness(spectrum) : 0;
      rows.shift();
      rows.push(spectrum && level > 0.02 ? spectrumRow(spectrum, POINTS) : syntheticRow(POINTS, t, 3));
      draw();
    };
    const play = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => (entry?.isIntersecting ? play() : pause()));
    io?.observe(canvas);
    if (!io) play();

    return () => {
      pause();
      ro?.disconnect();
      io?.disconnect();
    };
  }, [readSpectrum, motion]);

  return <canvas ref={ref} className="ridge" aria-hidden="true" />;
}
