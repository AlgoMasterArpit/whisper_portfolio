import { describe, expect, it } from 'vitest';
import { envelope, loudness, spectrumRow, syntheticRow } from '../src/lib/ridge';

const inRange = (row: Float32Array) => row.every((v) => v >= 0 && v <= 1);

describe('envelope', () => {
  it('peaks in the middle and fades to the edges', () => {
    expect(envelope(32, 65)).toBeCloseTo(1);
    expect(envelope(0, 65)).toBeLessThan(0.05);
    expect(envelope(0, 65)).toBeCloseTo(envelope(64, 65));
  });
});

describe('syntheticRow', () => {
  it('stays within 0..1 and changes over time', () => {
    const a = syntheticRow(48, 0, 1);
    const b = syntheticRow(48, 2, 1);
    expect(inRange(a)).toBe(true);
    expect(a).not.toEqual(b);
  });
});

describe('spectrumRow', () => {
  it('is silent for silence', () => {
    expect(spectrumRow(new Uint8Array(128), 48).every((v) => v === 0)).toBe(true);
  });

  it('is symmetric, clamped and tallest near the centre for low frequencies', () => {
    const spectrum = new Uint8Array(128);
    spectrum.fill(255, 0, 6);
    const row = spectrumRow(spectrum, 49);
    expect(inRange(row)).toBe(true);
    expect(row[10]).toBeCloseTo(row[38]!);
    expect(row[24]!).toBeGreaterThan(row[2]!);
  });
});

describe('loudness', () => {
  it('averages the spectrum to 0..1', () => {
    expect(loudness([])).toBe(0);
    expect(loudness([0, 255])).toBeCloseTo(0.5);
  });
});
