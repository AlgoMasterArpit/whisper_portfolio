import { describe, expect, it } from 'vitest';
import { CAMPAIGN, dayNumber, totals } from '../src/data/campaign';

describe('totals', () => {
  it('sums reach and installs and computes conversion', () => {
    expect(
      totals([
        { date: '2026-10-30', reach: 120, installs: 6 },
        { date: '2026-10-31', reach: 80, installs: 4 },
      ]),
    ).toEqual({ reach: 200, installs: 10, conversion: 0.05 });
  });

  it('avoids dividing by zero before launch', () => {
    expect(totals([])).toEqual({ reach: 0, installs: 0, conversion: 0 });
  });
});

describe('dayNumber', () => {
  it('counts launch day as day 1 in IST', () => {
    expect(dayNumber('2026-10-30', new Date('2026-10-30T00:30:00+05:30'))).toBe(1);
    expect(dayNumber('2026-10-30', new Date('2026-11-02T23:00:00+05:30'))).toBe(4);
  });

  it('is zero or negative before launch', () => {
    expect(dayNumber('2026-10-30', new Date('2026-10-29T12:00:00+05:30'))).toBeLessThanOrEqual(0);
  });
});

describe('campaign data', () => {
  it('logs days in order with sane numbers', () => {
    const dates = CAMPAIGN.days.map((d) => d.date);
    expect([...dates].sort()).toEqual(dates);
    for (const d of CAMPAIGN.days) {
      expect(d.date >= CAMPAIGN.startsOn).toBe(true);
      expect(d.installs).toBeLessThanOrEqual(d.reach);
      expect(d.installs).toBeGreaterThanOrEqual(0);
    }
  });
});
