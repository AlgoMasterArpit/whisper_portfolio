import { describe, expect, it } from 'vitest';
import { channelOf, dayKey, isBot, totalsOf, visitorHash } from '../shared/stats';

describe('channelOf', () => {
  it('trusts a known ?ref tag first', () => {
    expect(channelOf('LinkedIn', 'https://www.google.com/')).toBe('linkedin');
    expect(channelOf('whatsapp', '')).toBe('whatsapp');
  });

  it('files unknown tags under other instead of inventing channels', () => {
    expect(channelOf('<script>', '')).toBe('other');
  });

  it('falls back to the referrer', () => {
    expect(channelOf(undefined, 'https://www.linkedin.com/feed/')).toBe('linkedin');
    expect(channelOf(null, 'https://lnkd.in/abc')).toBe('linkedin');
    expect(channelOf('', 'https://web.whatsapp.com/')).toBe('whatsapp');
    expect(channelOf('', 'https://t.co/xyz')).toBe('x');
    expect(channelOf('', 'https://www.google.com/')).toBe('other');
  });

  it('counts no referrer as direct and garbage as other', () => {
    expect(channelOf(undefined, '')).toBe('direct');
    expect(channelOf(undefined, 'not a url')).toBe('other');
  });
});

describe('dayKey', () => {
  it('uses the Indian calendar day', () => {
    expect(dayKey(new Date('2026-10-30T18:29:00Z'))).toBe('2026-10-30');
    expect(dayKey(new Date('2026-10-30T18:31:00Z'))).toBe('2026-10-31');
  });
});

describe('isBot', () => {
  it.each([
    'LinkedInBot/1.0 (compatible; Mozilla/5.0)',
    'WhatsApp/2.23.20.0',
    'facebookexternalhit/1.1',
    'Mozilla/5.0 (compatible; Googlebot/2.1)',
    'curl/8.4.0',
    'HeadlessChrome/120',
  ])('flags %s', (ua) => {
    expect(isBot(ua)).toBe(true);
  });

  it('lets real browsers through and treats a missing agent as a bot', () => {
    expect(isBot('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36')).toBe(false);
    expect(isBot(null)).toBe(true);
  });
});

describe('visitorHash', () => {
  it('is stable within a day and changes across days and salts', async () => {
    const a = await visitorHash('1.2.3.4', 'ua', '2026-10-30', 's');
    expect(a).toMatch(/^[0-9a-f]{32}$/);
    expect(await visitorHash('1.2.3.4', 'ua', '2026-10-30', 's')).toBe(a);
    expect(await visitorHash('1.2.3.4', 'ua', '2026-10-31', 's')).not.toBe(a);
    expect(await visitorHash('1.2.3.4', 'ua', '2026-10-30', 't')).not.toBe(a);
  });

  it('never contains the raw ip', async () => {
    expect(await visitorHash('203.0.113.9', 'ua', 'd', 's')).not.toContain('203');
  });
});

describe('totalsOf', () => {
  it('adds days and channels and computes the click rate', () => {
    const totals = totalsOf([
      { date: '2026-10-30', visitors: 40, visits: 50, wisprClicks: 4, channels: { linkedin: 30, direct: 10 } },
      { date: '2026-10-31', visitors: 60, visits: 70, wisprClicks: 6, channels: { linkedin: 20, whatsapp: 40 } },
    ]);
    expect(totals).toEqual({ visitors: 100, wisprClicks: 10, clickRate: 0.1, channels: { linkedin: 50, direct: 10, whatsapp: 40 } });
  });

  it('is zero before any traffic', () => {
    expect(totalsOf([])).toEqual({ visitors: 0, wisprClicks: 0, clickRate: 0, channels: {} });
  });
});
