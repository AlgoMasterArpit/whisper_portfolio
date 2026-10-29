import type { DayStats } from '../../shared/stats';

const KEY = 'receipts:counted';

export function countVisit(): void {
  try {
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, '1');
  } catch {
    /* storage blocked — count anyway */
  }
  const body = JSON.stringify({ ref: new URLSearchParams(location.search).get('ref') ?? '', referrer: document.referrer });
  if (navigator.sendBeacon?.('/api/hit', new Blob([body], { type: 'application/json' }))) return;
  fetch('/api/hit', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {});
}

export interface LiveStats {
  configured: boolean;
  days: DayStats[];
}

export async function loadStats(fetchImpl: typeof fetch = fetch): Promise<LiveStats | null> {
  try {
    const res = await fetchImpl('/api/stats');
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<LiveStats>;
    return Array.isArray(data.days) ? { configured: !!data.configured, days: data.days } : null;
  } catch {
    return null;
  }
}
