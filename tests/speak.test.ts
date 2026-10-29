import { describe, expect, it } from 'vitest';
import { pickVoice, voiceScore } from '../src/lib/speak';

const v = (lang: string, name = lang) => ({ lang, name });

describe('pickVoice', () => {
  it('prefers a natural-sounding voice over a robotic one, even in another accent', () => {
    const picked = pickVoice([v('en-IN', 'Microsoft Heera - English (India)'), v('en-US', 'Microsoft Aria Online (Natural) - English (United States)')]);
    expect(picked?.name).toContain('Aria');
  });

  it('picks the natural Indian English voice when there is one', () => {
    const picked = pickVoice([
      v('en-US', 'Google US English'),
      v('en-IN', 'Microsoft Neerja Online (Natural) - English (India)'),
      v('en-IN', 'Microsoft Heera - English (India)'),
    ]);
    expect(picked?.name).toContain('Neerja');
  });

  it('prefers Indian English among equally robotic voices', () => {
    expect(pickVoice([v('en-US'), v('en-IN'), v('hi-IN')])?.lang).toBe('en-IN');
  });

  it('uses Hindi only when there is no English voice', () => {
    expect(pickVoice([v('fr-FR'), v('hi-IN')])?.lang).toBe('hi-IN');
    expect(pickVoice([v('hi-IN'), v('en-AU')])?.lang).toBe('en-AU');
  });

  it('handles underscores and odd casing in language tags', () => {
    expect(pickVoice([v('EN_in')])?.lang).toBe('EN_in');
  });

  it('gives up when nothing can read English or Hindi', () => {
    expect(pickVoice([v('fr-FR')])).toBeUndefined();
    expect(pickVoice([])).toBeUndefined();
  });
});

describe('voiceScore', () => {
  it('ranks natural voices far above robotic ones', () => {
    expect(voiceScore(v('en-GB', 'Google UK English Female'))).toBeGreaterThan(voiceScore(v('en-IN', 'Microsoft Ravi')));
  });
});
