export interface LedgerItem {
  name: string;
  tag: string;
  when: string;
  lines: readonly string[];
  receipts: readonly string[];
}

export interface LedgerGroup {
  title: string;
  items: readonly LedgerItem[];
}

export const LEDGER: readonly LedgerGroup[] = [
  {
    title: 'Work',
    items: [
      {
        name: 'Carboledger',
        tag: 'Full Stack Intern',
        when: 'Jul 2026 →',
        lines: [
          'Smart Balance — supply-chain compliance that automates ISCC mass-balance bookkeeping.',
          'React screens from Figma for the frontend revamp, wired to REST APIs from Notion specs and KT sessions.',
        ],
        receipts: ['carboledger', 'linkedin'],
      },
      {
        name: 'SPEC, NIT Hamirpur',
        tag: 'DevRel Lead',
        when: 'Aug 2024 →',
        lines: [
          'Part of the SPEC team that brought speakers and judges to Electrothon 7.0 and 8.0 and grew its national reach.',
          'Real-time infra dashboard for Electrothon 8.0 — 500+ participants.',
          'Trained a 27-member team on DSA and full-stack. Co-Coordinator, Alumni Cell.',
        ],
        receipts: ['electrothon-8', 'electrothon-7', 'electrothon-8-repo', 'spec'],
      },
    ],
  },
  {
    title: 'Built',
    items: [
      {
        name: 'N.O.V.A',
        tag: 'Kotlin · voice',
        when: '2026',
        lines: [
          '“Hey Nova” — my own Hinglish Android assistant.',
          'Meet reminders, Claude answers read aloud, WhatsApp, calls that confirm when two contacts match.',
          'Offline voice model fetched at build time with a SHA-256 check.',
        ],
        receipts: ['nova'],
      },
      {
        name: 'Legal Sarthi',
        tag: 'FastAPI · LLM',
        when: '2025',
        lines: [
          'Born in a law office: lawyers hunt IPC/BNS sections and precedents by hand.',
          'Llama-3.3-70B suggests sections → lawyer confirms → Indian Kanoon precedents ranked by embeddings.',
          'Cheap similarity first, LLM only when ambiguous; one batched call, ~2–3x faster.',
        ],
        receipts: ['legal-sarthi'],
      },
      {
        name: 'SeniorSays',
        tag: 'React · Appwrite',
        when: '2025',
        lines: [
          'Seniors share interview experiences; juniors search by company and role.',
          'Live slug check with a 300 ms debounce; fixed a silent 25-record Appwrite cap.',
          'List payload ~2 MB → ~100 KB.',
        ],
        receipts: ['seniorsays', 'seniorsays-live'],
      },
      {
        name: 'Kin',
        tag: 'Alexa+ · MCP',
        when: 'Oct 2026',
        lines: ['Medicine tracking and daily check-ins for parents who live alone.', '“Kin asks before it worries.”'],
        receipts: ['kin', 'alexa-sim'],
      },
      {
        name: 'MeterMind',
        tag: 'OpenCV · agent',
        when: 'Oct 2026',
        lines: ['Reads Indian water, gas and sub-meters from phone photos.', 'Reframed after research killed my first assumption.'],
        receipts: ['metermind'],
      },
    ],
  },
  {
    title: 'Record',
    items: [
      { name: 'B.Tech ECE, NIT Hamirpur', tag: 'CGPA 8.94', when: '2024–28', lines: ['Electronics & Communication Engineering, batch of 2028.'], receipts: ['cgpa'] },
      { name: 'DSA', tag: '600+ solved', when: 'ongoing', lines: ['LeetCode and GeeksforGeeks.'], receipts: ['codolio', 'dsa-sheet'] },
      { name: 'Smart India Hackathon', tag: 'Top 13 / ~100', when: 'internal round', lines: ['NIT Hamirpur internal round.'], receipts: ['sih'] },
    ],
  },
];
