import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');
const token = (name: string) => {
  const value = css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1];
  if (!value) throw new Error(`missing token --${name}`);
  return value;
};

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

describe('contrast', () => {
  it('computes known ratios', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21);
    expect(contrast('#777777', '#777777')).toBeCloseTo(1);
  });
});

describe('text colours meet WCAG AA (4.5:1)', () => {
  it.each([
    ['text-on-ink', 'ink'],
    ['muted-on-ink', 'ink'],
    ['muted-on-ink', 'ink-2'],
    ['muted-on-ink', 'ink-3'],
    ['text-on-paper', 'paper'],
    ['muted-on-paper', 'paper'],
    ['muted-on-paper', 'paper-2'],
    ['stamp-text', 'paper'],
    ['stamp-bright', 'ink'],
    ['stamp-bright', 'ink-2'],
    ['verified', 'paper'],
    ['self', 'paper'],
    ['paper', 'stamp-text'],
    ['ink', 'highlight'],
    ['highlight', 'ink'],
  ])('%s on %s', (fg, bg) => {
    expect(contrast(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps the big red headline above the 3:1 large-text bar', () => {
    expect(contrast(token('stamp'), token('ink'))).toBeGreaterThanOrEqual(3);
  });
});
