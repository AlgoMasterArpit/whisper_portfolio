export interface Claim {
  text: string;
  receipt?: string;
}

export interface Round {
  claims: readonly Claim[];
  why: string;
}

export const ROUNDS: readonly Round[] = [
  {
    claims: [
      { text: 'Built a Hinglish voice assistant for Android', receipt: 'nova' },
      { text: 'Ran ₹1 lakh of Meta ads for Electrothon' },
      { text: 'Legal Sarthi ranks precedents from Indian Kanoon', receipt: 'legal-sarthi' },
      { text: 'Built a dashboard 500+ hackers used', receipt: 'electrothon-8' },
    ],
    why: 'There is no receipt for paid ads anywhere on this page — so I don’t claim it.',
  },
  {
    claims: [
      { text: 'Fixed a silent 25-record cap in Appwrite', receipt: 'seniorsays' },
      { text: 'Scored the 99th percentile after a second drop', receipt: 'jee' },
      { text: 'Got recommended at my SSB' },
      { text: 'Debounced slug checks at 300 ms', receipt: 'seniorsays-live' },
    ],
    why: 'I sat several SSBs and was never recommended. That is exhibit one in the museum.',
  },
  {
    claims: [
      { text: 'Solved 600+ DSA problems', receipt: 'codolio' },
      { text: 'Shipped an Alexa+ MCP server for a hackathon', receipt: 'kin' },
      { text: 'Brought speakers and judges to Electrothon', receipt: 'electrothon-7' },
      { text: 'Speak fluent German' },
    ],
    why: 'Hindi and English only. A foreign language is a summer-holiday plan.',
  },
];

export function fakeIndex(round: Round): number {
  return round.claims.findIndex((c) => !c.receipt);
}

export function rank(score: number, total: number): string {
  if (score === total) return 'Receipt auditor. Hired.';
  if (score > 0) return 'Good instincts. Check the receipts next time.';
  return 'I could sell you anything. Good thing I only claim what I can prove.';
}
