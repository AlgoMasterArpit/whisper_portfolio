export function envelope(i: number, points: number): number {
  const x = (i / (points - 1)) * 2 - 1;
  return Math.exp(-((x * 2.1) ** 2));
}

function hash(n: number): number {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

export function syntheticRow(points: number, t: number, seed: number): Float32Array {
  const row = new Float32Array(points);
  for (let i = 0; i < points; i++) {
    const wave = Math.sin(i * 0.35 + t * 1.7 + seed) * 0.5 + Math.sin(i * 0.11 - t * 0.9 + seed * 2) * 0.5;
    const grit = hash(i * 13 + seed * 7) * 0.35;
    row[i] = Math.max(0, Math.min(1, (wave * 0.5 + 0.5) * 0.55 + grit * 0.45)) * envelope(i, points);
  }
  return row;
}

export function spectrumRow(spectrum: ArrayLike<number>, points: number, gain = 1.6): Float32Array {
  const row = new Float32Array(points);
  const usable = Math.max(2, Math.floor(spectrum.length * 0.45));
  const half = (points - 1) / 2;
  for (let i = 0; i < points; i++) {
    const distance = Math.abs(i - half) / half;
    const bin = Math.min(usable - 1, Math.floor(distance * (usable - 1)));
    const value = ((spectrum[bin] ?? 0) / 255) * gain;
    row[i] = Math.min(1, value) * envelope(i, points);
  }
  return row;
}

export function loudness(spectrum: ArrayLike<number>): number {
  if (!spectrum.length) return 0;
  let sum = 0;
  for (let i = 0; i < spectrum.length; i++) sum += spectrum[i]!;
  return sum / spectrum.length / 255;
}
