// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { countVisit, loadStats } from '../src/lib/track';

describe('countVisit', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it('sends one beacon per session with the ref tag and referrer', async () => {
    const sendBeacon = vi.fn(() => true);
    vi.stubGlobal('navigator', { ...navigator, sendBeacon });
    window.history.replaceState(null, '', '/?ref=linkedin');
    countVisit();
    countVisit();
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    const [url, blob] = sendBeacon.mock.calls[0] as unknown as [string, Blob];
    expect(url).toBe('/api/hit');
    expect(JSON.parse(await blob.text())).toEqual({ ref: 'linkedin', referrer: '' });
  });

  it('falls back to a keepalive fetch when beacons are unavailable', () => {
    vi.stubGlobal('navigator', { ...navigator, sendBeacon: undefined });
    const fetchImpl = vi.fn(async () => new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchImpl);
    countVisit();
    expect((fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].keepalive).toBe(true);
  });
});

describe('loadStats', () => {
  it('returns the live days', async () => {
    const data = { configured: true, days: [{ date: '2026-10-30', visitors: 3, visits: 4, wisprClicks: 1, channels: {} }] };
    expect(await loadStats(vi.fn(async () => Response.json(data)))).toEqual(data);
  });

  it('returns null when the endpoint is missing or broken', async () => {
    expect(await loadStats(vi.fn(async () => new Response('nope', { status: 404 })))).toBeNull();
    expect(await loadStats(vi.fn(async () => Response.json({ weird: true })))).toBeNull();
    expect(
      await loadStats(
        vi.fn(async () => {
          throw new TypeError('offline');
        }),
      ),
    ).toBeNull();
  });
});
