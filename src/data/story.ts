export type ExhibitKind = 'risk' | 'mistake' | 'call';

export interface Scene {
  id: string;
  year: string;
  title: string;
  kind: ExhibitKind;
  setup: string;
  options: readonly [string, string];
  actual: 0 | 1;
  outcome: string;
  lesson: string;
  receipts: readonly string[];
}

export const SCENES: readonly Scene[] = [
  {
    id: 'nda',
    year: '2022',
    title: 'Class 12, done.',
    kind: 'mistake',
    setup: 'Defence has been the dream. NDA is a year of prep. JEE is the safe road everyone else is on.',
    options: ['Go all-in on NDA', 'NDA, with JEE prep running in parallel'],
    actual: 0,
    outcome: 'Cleared the written exams. Sat several SSBs. Not recommended. When the attempts ran out, I had nothing else in hand.',
    lesson: 'Mistake #1 — no backup plan. Run the backup in parallel; it would have saved a full year.',
    receipts: ['ssb'],
  },
  {
    id: 'second-drop',
    year: '2023',
    title: 'SSB attempts: over.',
    kind: 'risk',
    setup: 'One year gone. A private B.Tech seat is right there. A second drop means betting another year on JEE.',
    options: ['Take the private college seat', 'Bet another year on JEE'],
    actual: 1,
    outcome: '99th percentile. NIT Hamirpur, Electronics & Communication.',
    lesson: 'The biggest risk I have taken — and the year that built my discipline.',
    receipts: ['jee'],
  },
  {
    id: 'software',
    year: '2024',
    title: 'First year at SPEC.',
    kind: 'call',
    setup: 'ECE branch. Hardware and software workshops every week. Hardware wants PhD-level depth; software lets you ship.',
    options: ['Stay in my lane: hardware', 'Follow the kick: software'],
    actual: 1,
    outcome: 'Building products gave me a kick hardware never did. Kept the CGPA at 8.94 while doing it.',
    lesson: 'Self-doubt is loud. Shipping is louder.',
    receipts: ['spec', 'cgpa'],
  },
  {
    id: 'slug',
    year: '2025',
    title: '“The slug is taken.”',
    kind: 'call',
    setup: 'SeniorSays. Seniors fill a long interview form — and only on submit learn their URL slug is taken. Complaints pile up.',
    options: ['Write a friendlier error message', 'Check the slug live while they type'],
    actual: 1,
    outcome: 'Slug auto-generated from the title, availability checked with a 300 ms debounce. No more lost forms.',
    lesson: 'Pen and paper, find the root cause, fix that — not the symptom.',
    receipts: ['seniorsays', 'seniorsays-live'],
  },
  {
    id: 'dsa',
    year: '2026',
    title: '600 problems in.',
    kind: 'mistake',
    setup: 'Hundreds of DSA problems solved — but contests feel brutal. The clock keeps winning.',
    options: ['Solve even more problems', 'Put a timer on every single problem'],
    actual: 1,
    outcome: 'I had practised with no clock for two years. Now every problem is time-boxed, and I sit contests.',
    lesson: 'Mistake #2 — untimed practice. Train under the pressure you will be tested in.',
    receipts: ['codolio'],
  },
  {
    id: 'october',
    year: 'Oct 2026',
    title: 'Four deadlines, one week.',
    kind: 'risk',
    setup: 'Internship. Classes. And four hackathons with overlapping deadlines — Amazon, Build With AI, OpenCV, Meta.',
    options: ['Pick one, drop the rest', 'Run all of them'],
    actual: 1,
    outcome: 'Kin shipped for Amazon on 24 Oct. MeterMind for Build With AI and OpenCV on 27 Oct. Meta is due 4 Nov. Then this site.',
    lesson: 'Time management is a skill you only learn by running out of time.',
    receipts: ['kin', 'metermind'],
  },
];

export function matchCount(choices: readonly (0 | 1)[], scenes: readonly Scene[] = SCENES): number {
  return choices.reduce<number>((n, choice, i) => n + (scenes[i]?.actual === choice ? 1 : 0), 0);
}

export function closingLine(matches: number, total: number): string {
  if (matches === total) return 'You think exactly like me. Slightly worrying.';
  if (matches >= Math.ceil(total * 0.66)) return 'Mostly the same calls. We would work well together.';
  if (matches >= Math.ceil(total / 3)) return 'Half your calls differ from mine — and some of yours were wiser.';
  return 'You would have avoided most of my mistakes. Teach me?';
}
