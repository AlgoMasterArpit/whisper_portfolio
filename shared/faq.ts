export interface Intent {
  id: string;
  keywords: string[];
  answer: string;
  receipts: string[];
}

export const INTENTS: readonly Intent[] = [
  {
    id: 'about',
    keywords: ['who are you', 'about you', 'introduce', 'yourself', 'kaun ho', 'apne baare', 'tell me about'],
    answer:
      "I'm Arpit Tyagi from Bijnor, UP — a third-year ECE student at NIT Hamirpur with a 8.94 CGPA. I'm a full-stack developer interning at Carboledger, and Developer Relations Lead at SPEC, where I helped run Electrothon 7.0 and 8.0.",
    receipts: ['cgpa', 'carboledger', 'spec', 'linkedin'],
  },
  {
    id: 'why-software',
    keywords: ['why software', 'ece', 'electronics', 'hardware', 'branch', 'software kyu'],
    answer:
      'In first year I joined SPEC and tried both hardware and software workshops. Going deep in hardware needs PhD-level specialisation; building products gave me a kick hardware never did. So I went all-in on software and kept my CGPA while doing it.',
    receipts: ['spec', 'cgpa'],
  },
  {
    id: 'carboledger',
    keywords: ['carboledger', 'internship', 'intern', 'smart balance', 'current job', 'kaam kahan'],
    answer:
      "I'm a Full Stack Engineer Intern at Carboledger — a 6-month remote internship that started in July 2026. Carboledger automates ISCC mass-balance bookkeeping for supply-chain compliance. I build React screens from Figma for the Smart Balance revamp and wire them to REST APIs.",
    receipts: ['carboledger', 'linkedin'],
  },
  {
    id: 'electrothon',
    keywords: ['electrothon', 'spec', 'devrel', 'developer relations', 'hackathon organis', 'speakers', 'judges', 'community'],
    answer:
      'As Developer Relations Lead at SPEC I brought speakers and judges to Electrothon 7.0 and 8.0 and grew the brand nationally. I also built the real-time infra dashboard for Electrothon 8.0 — 500+ participants used it — and trained a 27-member team on DSA and full-stack.',
    receipts: ['electrothon-8', 'electrothon-7', 'electrothon-8-repo', 'spec'],
  },
  {
    id: 'nova',
    keywords: ['nova', 'assistant', 'jarvis', 'android', 'voice project', 'hinglish assistant'],
    answer:
      'N.O.V.A is my personal "Hey Nova" Android assistant. It understands Hinglish, reminds me an hour before Meet calls, answers through Claude, sends WhatsApp messages and confirms before calling when two contacts match. It never goes online on its own.',
    receipts: ['nova'],
  },
  {
    id: 'legal-sarthi',
    keywords: ['legal', 'sarthi', 'lawyer', 'ipc', 'bns', 'kanoon', 'court'],
    answer:
      'Legal Sarthi started at a law office near my home — I watched how long it takes to find IPC/BNS sections and precedents by hand. A lawyer describes the case, Llama-3.3-70B suggests sections, they accept or reject, and Indian Kanoon precedents get ranked by embedding similarity. Cheap local similarity first, LLM only for ambiguous cases, one batched call — about 2–3x faster.',
    receipts: ['legal-sarthi'],
  },
  {
    id: 'seniorsays',
    keywords: ['seniorsays', 'senior says', 'placement', 'slug', 'debounce', 'appwrite'],
    answer:
      'SeniorSays lets seniors share interview experiences so juniors can prepare. Seniors complained they were told the slug was taken only after filling the whole form — so I auto-generate it from the title and check it live with a 300 ms debounce. I also fixed a silent 25-record cap in Appwrite.',
    receipts: ['seniorsays', 'seniorsays-live'],
  },
  {
    id: 'kin',
    keywords: ['kin', 'alexa', 'amazon', 'mcp', 'medicine', 'parents'],
    answer:
      'Kin is an Alexa+ MCP server for parents who live alone — medicine tracking, memory and daily check-ins — built for the Amazon developer hackathon. Its rule: "Kin asks before it worries." An unlogged dose is unconfirmed, not missed.',
    receipts: ['kin', 'alexa-sim'],
  },
  {
    id: 'metermind',
    keywords: ['metermind', 'meter', 'opencv', 'build with ai'],
    answer:
      'MeterMind reads Indian water, gas and factory sub-meters from phone photos with OpenCV. My first assumption was wrong — electricity meters mostly use smart meters and optical probes now — so I reframed the problem before building further.',
    receipts: ['metermind'],
  },
  {
    id: 'risk',
    keywords: ['risk', 'biggest risk', 'bold', 'gamble', 'drop', 'jee', 'percentile', 'sabse bada risk'],
    answer:
      'After my NDA year, SSB attempts were over. Private B.Tech or a second drop for JEE? I took the second drop — a whole year on the line — and it paid off: 99th percentile and NIT Hamirpur.',
    receipts: ['jee', 'ssb'],
  },
  {
    id: 'mistakes',
    keywords: ['mistake', 'failure', 'failed', 'regret', 'galti', 'went wrong', 'learned'],
    answer:
      "Two big ones. In my NDA year I had no backup plan — I didn't prepare for JEE in parallel, and it cost me a full year. And I practised DSA with no clock, so contest pressure hurt; now I time-box every problem.",
    receipts: ['ssb', 'codolio'],
  },
  {
    id: 'nda',
    keywords: ['nda', 'ssb', 'defence', 'defense', 'army', 'not on your resume', 'discipline'],
    answer:
      "My 2022–23 NDA year isn't on my resume. I cleared the written exams and sat several SSBs. I wasn't recommended, but that year built my discipline, time management, team play and leadership.",
    receipts: ['ssb'],
  },
  {
    id: 'stuck',
    keywords: ['stuck', 'how do you think', 'problem solving', 'approach', 'debug', 'root cause'],
    answer:
      'Root cause first, never the symptom. Pen and paper, think out loud, then build. Cheap first, expensive later — and plan the MVP before writing code. Then I write the lesson down so it never repeats.',
    receipts: ['seniorsays', 'legal-sarthi'],
  },
  {
    id: 'why-growth',
    keywords: ['why growth', 'growth', 'marketing', 'distribution', 'developer in growth', 'outreach'],
    answer:
      "My best moments weren't writing code — they were getting things in front of people. Electrothon partnerships and brand were growth work; I just didn't call it that. My weekly cold-email pipeline for internships was my first growth funnel.",
    receipts: ['electrothon-8', 'electrothon-7'],
  },
  {
    id: 'why-wispr',
    keywords: ['why wispr', 'wispr', 'flow', 'voice', 'why this company', 'dictation'],
    answer:
      "I built a Hinglish voice assistant myself, so I know how hard Indian accents are for voice tech. India is a voice-note country — we already talk to our phones; Wispr turns that talking into work. This whole site was built by voice.",
    receipts: ['nova', 'raw-tape'],
  },
  {
    id: 'day-one',
    keywords: ['day one', 'first week', 'what would you do', 'plan', 'electrothon 9', 'partner', 'campus'],
    answer:
      'Day one: as Developer Relations Lead at SPEC I can bring Wispr Flow to Electrothon 9.0 as a partner — a national hackathon full of student builders, exactly the people who would love building by voice. College tech societies are an untapped channel, and I already have a foot in that door.',
    receipts: ['spec', 'electrothon-8'],
  },
  {
    id: 'dsa',
    keywords: ['dsa', 'leetcode', 'problems', 'competitive', 'gfg', 'geeksforgeeks'],
    answer: '600+ problems across LeetCode and GeeksforGeeks. Lesson learned the hard way: solve with a timer, not without one.',
    receipts: ['codolio', 'dsa-sheet'],
  },
  {
    id: 'cgpa',
    keywords: ['cgpa', 'grades', 'marks', 'gpa', 'academics'],
    answer: 'My CGPA is 8.94 at NIT Hamirpur. That one is self-reported — no public link, but the transcript is available on request.',
    receipts: ['cgpa'],
  },
  {
    id: 'cant-do',
    keywords: ['cant do', "can't do", "can't you do", 'cannot do', 'not yet', 'weakness', 'weak', 'not good at', 'learn next', 'video editing', 'stock'],
    answer:
      "Things I can't do yet: stock-market investing, video editing and design, and any foreign language — I speak Hindi and English. I have no receipts for paid ads or owning a marketing channel, so I won't claim them.",
    receipts: [],
  },
  {
    id: 'languages',
    keywords: ['language', 'languages', 'speak', 'hindi', 'english', 'bhasha'],
    answer: 'Hindi and English. I want to pick up a foreign language in the summer holidays — no receipt for that yet.',
    receipts: [],
  },
  {
    id: 'grant',
    keywords: ['3000', '3,000', 'grant', 'setup', 'macbook', 'laptop'],
    answer: 'A proper setup in my hostel room — a new laptop like a MacBook and a bigger screen.',
    receipts: [],
  },
  {
    id: 'hometown',
    keywords: ['hometown', 'where are you from', 'bijnor', 'family', 'kahan se'],
    answer: "I was born and brought up in Bijnor, Uttar Pradesh. College is in Hamirpur, Himachal Pradesh.",
    receipts: [],
  },
  {
    id: 'this-site',
    keywords: ['this site', 'built this', 'how was this made', 'portfolio', 'receipts'],
    answer:
      'Every part of this site was spoken, not typed — Wispr Flow dictating into Claude Code. The raw takes, mis-hearings included, are further down the page.',
    receipts: ['raw-tape', 'this-repo'],
  },
  {
    id: 'skills',
    keywords: ['skills', 'skill', 'tech stack', 'stack', 'technologies', 'languages do you know', 'tools', 'react', 'python', 'fastapi', 'backend', 'frontend', 'full stack', 'aws', 'docker'],
    answer:
      "Full-stack. Languages: C++, Python, JavaScript, SQL, and Kotlin for NOVA. Frontend: React, Redux Toolkit, Tailwind. Backend: FastAPI, Node, Express, PostgreSQL with SQLAlchemy and Alembic, JWT auth. Cloud: AWS EC2 and Secrets Manager, Docker, GitHub Actions, Vercel. AI: Groq/Llama, OpenAI API, sentence-transformers, Claude Code.",
    receipts: ['github', 'legal-sarthi', 'seniorsays', 'nova'],
  },
  {
    id: 'projects',
    keywords: ['projects', 'project', 'built', 'build', 'made', 'portfolio projects', 'kya banaya'],
    answer:
      'NOVA, my Hinglish Android voice assistant. Legal Sarthi, an AI assistant for lawyers. SeniorSays, a placement-prep platform for juniors. Kin, an Alexa+ MCP server for parents who live alone. MeterMind, an agent that reads meters from photos. Ask me about any one of them.',
    receipts: ['nova', 'legal-sarthi', 'seniorsays', 'kin', 'metermind'],
  },
  {
    id: 'experience',
    keywords: ['experience', 'worked', 'work experience', 'job', 'jobs', 'roles', 'companies'],
    answer:
      "I'm a Full Stack Engineer Intern at Carboledger, building React screens for the Smart Balance revamp. At SPEC, NIT Hamirpur, I'm Developer Relations Lead: speakers and judges for Electrothon 7.0 and 8.0, a dashboard 500+ participants used, and a 27-member team I trained.",
    receipts: ['carboledger', 'spec', 'electrothon-8', 'linkedin'],
  },
  {
    id: 'education',
    keywords: ['college', 'education', 'study', 'studying', 'university', 'degree', 'nit', 'hamirpur', 'btech', 'b.tech', 'year'],
    answer:
      "Third-year B.Tech in Electronics & Communication at NIT Hamirpur, batch 2024–28, CGPA 8.94. I got in after a second drop for JEE — 99th percentile.",
    receipts: ['cgpa', 'jee'],
  },
  {
    id: 'hackathons',
    keywords: ['hackathons', 'hackathon', 'sih', 'smart india', 'competitions', 'won'],
    answer:
      'Top 13 of ~100 teams in the Smart India Hackathon internal round. I helped organise Electrothon 7.0 and 8.0. And in October 2026 I ran four at once: Kin for Amazon, MeterMind for Build With AI and OpenCV, and a team entry for Meta due 4 Nov.',
    receipts: ['sih', 'electrothon-8', 'kin', 'metermind'],
  },
  {
    id: 'why-hire',
    keywords: ['why hire', 'why should we hire', 'hire you', 'why you', 'stand out', 'fit', 'tumhe kyu'],
    answer:
      "Because I ship and I don't oversell it. I built a Hinglish voice assistant, so I know voice in India firsthand; I've already done partnerships and brand for a national hackathon; and I built this whole site by voice in one night. On day one I can bring Wispr to Electrothon 9.0.",
    receipts: ['nova', 'electrothon-8', 'this-repo'],
  },
  {
    id: 'strengths',
    keywords: ['strength', 'strengths', 'good at', 'best quality', 'superpower'],
    answer:
      'Ownership and root-cause thinking. I ran four hackathons alongside an internship and classes, and when SeniorSays users complained I fixed the cause — a live slug check — not the error message. My NDA year gave me the discipline for it.',
    receipts: ['kin', 'seniorsays', 'ssb'],
  },
  {
    id: 'ai',
    keywords: ['ai', 'llm', 'llms', 'machine learning', 'ml', 'gpt', 'claude', 'embeddings', 'agent', 'agents'],
    answer:
      "Legal Sarthi uses Llama-3.3-70B on Groq with a two-tier pipeline — local embeddings first, the LLM only when it's ambiguous. NOVA answers through Claude. SeniorSays has an OpenAI writing assistant. Kin is an Alexa+ MCP server. And you're talking to an AI twin right now.",
    receipts: ['legal-sarthi', 'nova', 'seniorsays', 'kin'],
  },
  {
    id: 'leadership',
    keywords: ['leadership', 'lead', 'team', 'teamwork', 'manage people', 'mentor'],
    answer:
      "I trained a 27-member team on DSA and full-stack at SPEC, I'm Co-Coordinator of the Alumni Cell, and Legal Sarthi was a team build — that's where I learned rebase vs merge the hard way. The NDA year taught me to be a team player first.",
    receipts: ['spec', 'legal-sarthi', 'ssb'],
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'reach you', 'linkedin', 'phone'],
    answer: 'arpittyag246@gmail.com, or LinkedIn. I reply fast.',
    receipts: ['linkedin', 'github'],
  },
];

export const NO_RECEIPT_TOPICS: readonly string[] = [
  'paid ads',
  'meta ads',
  'google ads',
  'facebook ads',
  'influencer',
  'seo',
  'performance marketing',
  'german',
  'french',
  'spanish',
  'japanese',
  'expert',
  'manager',
  'startup founder',
];

export const UNKNOWN_ANSWER =
  "That one isn't on record yet — I only answer from things I've actually said. Try my projects, skills, biggest risk, mistakes or why growth.";

export const NO_RECEIPT_ANSWER =
  "I can't back that up — there's no receipt for it, so I won't claim it. Ask me about NOVA, Legal Sarthi, Electrothon or why I want growth — those I can prove.";
