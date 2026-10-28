export type ReceiptKind = 'public' | 'self-reported';

export interface Receipt {
  id: string;
  label: string;
  kind: ReceiptKind;
  url?: string;
  note?: string;
}

export type Verdict = 'verified' | 'self-reported' | 'no-receipt';

const GH = 'https://github.com/AlgoMasterArpit';

export const RECEIPTS: readonly Receipt[] = [
  { id: 'github', label: 'GitHub profile', kind: 'public', url: GH },
  { id: 'linkedin', label: 'LinkedIn', kind: 'public', url: 'https://www.linkedin.com/in/arpit-tyagi-526b33277' },
  { id: 'codolio', label: 'Codolio — DSA stats', kind: 'public', url: 'https://codolio.com/profile/AlgoMasterArpit' },
  { id: 'nova', label: 'N.O.V.A repo', kind: 'public', url: `${GH}/N.O.V.A` },
  { id: 'legal-sarthi', label: 'Legal Sarthi frontend repo', kind: 'public', url: `${GH}/Legal_ai_frontend` },
  { id: 'seniorsays', label: 'SeniorSays repo', kind: 'public', url: `${GH}/SeniorSays` },
  { id: 'seniorsays-live', label: 'SeniorSays live', kind: 'public', url: 'https://senior-says.vercel.app' },
  { id: 'kin', label: 'Kin — Alexa+ MCP server', kind: 'public', url: `${GH}/kin_Alexa-` },
  { id: 'alexa-sim', label: 'alexa-plus-sim', kind: 'public', url: `${GH}/alexa-plus-sim` },
  { id: 'metermind', label: 'MeterMind repo', kind: 'public', url: `${GH}/Build_with_AI` },
  { id: 'electrothon-8', label: 'Electrothon 8.0 site', kind: 'public', url: 'https://electrothon-8-0-32d6.vercel.app' },
  { id: 'electrothon-8-repo', label: 'Electrothon 8.0 repo', kind: 'public', url: `${GH}/Electrothon_8.0-` },
  { id: 'electrothon-7', label: 'Electrothon 7.0 site', kind: 'public', url: 'https://electrothon-7-0.vercel.app' },
  { id: 'spec', label: 'SPEC, NIT Hamirpur', kind: 'public', url: 'https://spec.nith.ac.in' },
  { id: 'dsa-sheet', label: 'DSA revision sheet', kind: 'public', url: 'https://dsa-revision-lime.vercel.app' },
  { id: 'raw-tape', label: 'Raw voice transcripts', kind: 'public', url: '#tape', note: 'unedited Wispr Flow takes on this page' },
  { id: 'cgpa', label: 'CGPA 8.94', kind: 'self-reported', note: 'transcript on request' },
  { id: 'jee', label: 'JEE — 99th percentile', kind: 'self-reported', note: 'scorecard on request' },
  { id: 'ssb', label: 'NDA written + SSB attempts', kind: 'self-reported', note: 'call letters on request' },
  { id: 'sih', label: 'SIH internal round — top 13 of ~100', kind: 'self-reported', note: 'NIT Hamirpur internal round' },
  { id: 'carboledger', label: 'Carboledger internship', kind: 'self-reported', note: 'listed on LinkedIn, offer letter on request' },
];

const BY_ID = new Map(RECEIPTS.map((r) => [r.id, r]));

export function findReceipt(id: string): Receipt | undefined {
  return BY_ID.get(id);
}

export function resolveReceipts(ids: readonly unknown[]): Receipt[] {
  const seen = new Set<string>();
  const out: Receipt[] = [];
  for (const id of ids) {
    if (typeof id !== 'string' || seen.has(id)) continue;
    const receipt = BY_ID.get(id);
    if (!receipt) continue;
    seen.add(id);
    out.push(receipt);
  }
  return out;
}

export function verdictFor(receipts: readonly Receipt[]): Verdict {
  if (receipts.some((r) => r.kind === 'public')) return 'verified';
  if (receipts.length > 0) return 'self-reported';
  return 'no-receipt';
}
