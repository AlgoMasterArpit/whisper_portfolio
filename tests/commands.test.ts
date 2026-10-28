import { describe, expect, it } from 'vitest';
import { looksLikeQuestion, parseCommand } from '../src/lib/commands';

describe('parseCommand', () => {
  it.each([
    ['Mistakes dikhao', 'museum'],
    ['open the museum', 'museum'],
    ['growth lab', 'growth'],
    ['show me your projects', 'ledger'],
    ['khel', 'game'],
    ["let's play", 'game'],
    ['show the transcripts', 'tape'],
    ['upar jao', 'top'],
    ['talk to the twin', 'ask'],
  ])('“%s” goes to %s', (said, section) => {
    expect(parseCommand(said)).toEqual({ type: 'goto', section });
  });

  it('turns everything after “ask” into a question', () => {
    expect(parseCommand('Ask why growth?')).toEqual({ type: 'ask', question: 'why growth?' });
    expect(parseCommand('pucho NOVA kya hai')).toEqual({ type: 'ask', question: 'nova kya hai' });
  });

  it('toggles raw mode both ways', () => {
    expect(parseCommand('raw mode on')).toEqual({ type: 'raw', on: true });
    expect(parseCommand('Raw mode off.')).toEqual({ type: 'raw', on: false });
    expect(parseCommand('raw band karo')).toEqual({ type: 'raw', on: false });
    expect(parseCommand('show shipped')).toEqual({ type: 'raw', on: false });
  });

  it('toggles motion', () => {
    expect(parseCommand('animation band karo')).toEqual({ type: 'motion', on: false });
    expect(parseCommand('reduce motion')).toEqual({ type: 'motion', on: false });
    expect(parseCommand('animations on')).toEqual({ type: 'motion', on: true });
  });

  it('opens help', () => {
    expect(parseCommand('What can I say?')).toEqual({ type: 'help' });
    expect(parseCommand('help')).toEqual({ type: 'help' });
  });

  it('ignores noise', () => {
    expect(parseCommand('')).toBeNull();
    expect(parseCommand('   ...  ')).toBeNull();
    expect(parseCommand('the weather is nice')).toBeNull();
  });
});

describe('looksLikeQuestion', () => {
  it.each(['why wispr', 'Kya tumne ads chalaye?', 'tell me about nova', 'sabse bada risk', 'anything?'])('“%s” is a question', (t) => {
    expect(looksLikeQuestion(t)).toBe(true);
  });

  it.each(['hello there', 'nice site', ''])('“%s” is not', (t) => {
    expect(looksLikeQuestion(t)).toBe(false);
  });
});
