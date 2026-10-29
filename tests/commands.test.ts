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

describe('speak command', () => {
  it.each([
    ['bolke sunao', true],
    ['read aloud', true],
    ['read aloud off', false],
    ['mute', false],
    ['unmute', true],
    ['sunao mat, band karo', false],
  ])('“%s” → %s', (said, on) => {
    expect(parseCommand(said)).toEqual({ type: 'speak', on });
  });

  it('does not hijack questions that merely mention speaking', () => {
    expect(parseCommand('do you speak german')).toBeNull();
  });
});

describe('voice edge cases', () => {
  it.each([
    ['MUSEUM!!!', 'museum'],
    ['please, open the growth lab.', 'growth'],
    ['  upar  ', 'top'],
    ['गलतियाँ दिखाओ', 'museum'],
    ['ग्रोथ लैब', 'growth'],
    ['खेल', 'game'],
    ['ऊपर जाओ', 'top'],
  ])('“%s” → %s', (said, section) => {
    expect(parseCommand(said)).toEqual({ type: 'goto', section });
  });

  it('asks in Devanagari too', () => {
    expect(parseCommand('पूछो सबसे बड़ा रिस्क')).toEqual({ type: 'ask', question: 'सबसे बड़ा रिस्क' });
  });

  it('does not treat words that merely contain a keyword as commands', () => {
    expect(parseCommand('playstation')).toBeNull();
    expect(parseCommand('stopwatch')).toBeNull();
  });

  it('treats Devanagari questions as questions', () => {
    expect(looksLikeQuestion('क्या तुमने ads चलाए')).toBe(true);
  });
});
