export const CHANNELS = ['linkedin', 'whatsapp', 'instagram', 'x', 'college', 'github', 'direct', 'other'] as const;
export type Channel = (typeof CHANNELS)[number];

const FROM_REFERRER: readonly [RegExp, Channel][] = [
  [/linkedin\.com|lnkd\.in/, 'linkedin'],
  [/whatsapp\.com|wa\.me/, 'whatsapp'],
  [/instagram\.com/, 'instagram'],
  [/(^|\.)x\.com|twitter\.com|t\.co/, 'x'],
  [/github\.com/, 'github'],
];

export function channelOf(ref: unknown, referrer: unknown): Channel {
  const tag = typeof ref === 'string' ? ref.trim().toLowerCase() : '';
  if ((CHANNELS as readonly string[]).includes(tag)) return tag as Channel;
  if (tag) return 'other';
  if (typeof referrer !== 'string' || !referrer) return 'direct';
  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return 'other';
  }
  return FROM_REFERRER.find(([pattern]) => pattern.test(host))?.[1] ?? 'other';
}

export function dayKey(now: Date): string {
  return new Date(now.getTime() + 5.5 * 3_600_000).toISOString().slice(0, 10);
}

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|linkedinbot|whatsapp|embedly|headless|lighthouse|curl|wget|python|axios|node-fetch/i;

export function isBot(userAgent: string | null): boolean {
  return !userAgent || BOT.test(userAgent);
}

export async function visitorHash(ip: string, userAgent: string, day: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}|${day}|${ip}|${userAgent}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

export interface DayStats {
  date: string;
  visitors: number;
  visits: number;
  wisprClicks: number;
  channels: Partial<Record<Channel, number>>;
}

export interface StatsTotals {
  visitors: number;
  wisprClicks: number;
  clickRate: number;
  channels: Partial<Record<Channel, number>>;
}

export function totalsOf(days: readonly DayStats[]): StatsTotals {
  const channels: Partial<Record<Channel, number>> = {};
  let visitors = 0;
  let wisprClicks = 0;
  for (const d of days) {
    visitors += d.visitors;
    wisprClicks += d.wisprClicks;
    for (const [c, n] of Object.entries(d.channels)) channels[c as Channel] = (channels[c as Channel] ?? 0) + (n ?? 0);
  }
  return { visitors, wisprClicks, clickRate: visitors ? wisprClicks / visitors : 0, channels };
}
