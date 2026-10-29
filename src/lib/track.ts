import type { DayStats } from '../../shared/stats';

const KEY = 'receipts:counted';
const OWNER = 'receipts:owner';

export function isOwner(params: URLSearchParams): boolean {
  try {
    if (params.has('me')) localStorage.setItem(OWNER, '1');
    return localStorage.getItem(OWNER) === '1';
  } catch {
    return params.has('me');
  }
}

export function countVisit(): void {
  const params = new URLSearchParams(location.search);
  if (isOwner(params)) return;
  try {
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, '1');
  } catch {
    /* storage blocked — count anyway */
  }
  const body = JSON.stringify({ ref: params.get('ref') ?? '', referrer: document.referrer });
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
