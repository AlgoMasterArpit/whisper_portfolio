export interface CampaignDay {
  date: string;
  reach: number;
  installs: number;
  note?: string;
}

export interface Campaign {
  name: string;
  hypothesis: string;
  channel: string;
  startsOn: string;
  days: readonly CampaignDay[];
}

export const CAMPAIGN: Campaign = {
  name: 'Experiment #1 — Bolo, likho mat',
  hypothesis: 'Students who already live on WhatsApp voice notes will try Wispr Flow when a peer shows it working in Hinglish.',
  channel: 'Campus groups + short Hinglish demo reels',
  startsOn: '2026-10-30',
  days: [],
};

export interface Totals {
  reach: number;
  installs: number;
  conversion: number;
}

export function totals(days: readonly CampaignDay[]): Totals {
  const reach = days.reduce((n, d) => n + d.reach, 0);
  const installs = days.reduce((n, d) => n + d.installs, 0);
  return { reach, installs, conversion: reach ? installs / reach : 0 };
}

export function dayNumber(startsOn: string, today: Date): number {
  const start = Date.parse(`${startsOn}T00:00:00+05:30`);
  return Math.floor((today.getTime() - start) / 86_400_000) + 1;
}
