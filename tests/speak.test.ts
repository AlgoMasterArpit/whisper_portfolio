import { describe, expect, it } from 'vitest';
import { pickVoice } from '../src/lib/speak';

const v = (lang: string, name = lang, localService = false) => ({ lang, name, localService });

describe('pickVoice', () => {
  it('prefers an Indian English voice', () => {
    expect(pickVoice([v('en-US'), v('en-IN'), v('hi-IN')])?.lang).toBe('en-IN');
  });

  it('falls back to Hindi, then British, then American English', () => {
    expect(pickVoice([v('en-US'), v('hi-IN')])?.lang).toBe('hi-IN');
    expect(pickVoice([v('en-US'), v('en-GB')])?.lang).toBe('en-GB');
    expect(pickVoice([v('fr-FR'), v('en-US')])?.lang).toBe('en-US');
  });

  it('prefers an on-device voice within the same language', () => {
    expect(pickVoice([v('en-IN', 'cloud'), v('en-IN', 'local', true)])?.name).toBe('local');
  });

  it('handles underscores and odd casing in language tags', () => {
    expect(pickVoice([v('EN_in')])?.lang).toBe('EN_in');
  });

  it('takes any English voice before giving up', () => {
    expect(pickVoice([v('fr-FR'), v('en-AU')])?.lang).toBe('en-AU');
    expect(pickVoice([v('fr-FR')])).toBeUndefined();
    expect(pickVoice([])).toBeUndefined();
  });
});
