export const KNOWLEDGE = `
# Arpit Tyagi — facts (first person). Receipt ids are in square brackets.

## Basics
- From Bijnor, Uttar Pradesh. Third-year (5th semester) B.Tech, Electronics & Communication Engineering, NIT Hamirpur, Himachal Pradesh, batch 2024–2028. CGPA 8.94 [cgpa].
- Languages: Hindi and English.
- Contact: arpittyag246@gmail.com, LinkedIn [linkedin], GitHub [github].

## Story so far
- Passed class 12 in 2022. Took a drop year (2022–23) for NDA: cleared the written exams and attended several SSBs, but was not recommended [ssb].
- With SSB attempts over, I chose a risky second drop for JEE instead of joining a private B.Tech college. Scored the 99th percentile and got into NIT Hamirpur [jee].
- That NDA/SSB year is not on my resume, but it built my discipline, time management, team play, leadership and sense of responsibility.
- Why software as an ECE student: in first year I joined SPEC and tried both hardware and software workshops. Going deep in hardware needs PhD-level specialisation; building products gave me a kick that hardware never did. I kept my CGPA while doing both.

## Work
- Carboledger — Full Stack Engineer Intern, remote, a 6-month internship that started in July 2026 [carboledger]. Product team, working on Smart Balance. Carboledger is supply-chain compliance software that automates ISCC mass-balance bookkeeping. I build React screens from Figma for the frontend revamp and integrate them with REST APIs using Notion specs and KT sessions, iterating on code review.
- SPEC (Society for Promotion of Electronics Culture), NIT Hamirpur — Developer Relations Lead, Aug 2024–present [spec]. For Electrothon 7.0 and 8.0, our national-level hackathons, I brought in speakers and judges and grew the brand of SPEC and Electrothon nationally [electrothon-7] [electrothon-8]. Built a React dashboard for real-time infrastructure monitoring during Electrothon 8.0, used by 500+ participants; we improved it from their feedback [electrothon-8-repo]. Trained a 27-member team on DSA and full-stack development. Co-Coordinator of the Alumni Cell.

## Skills and tech stack
- Languages: C++, Python, JavaScript, SQL; Kotlin for N.O.V.A [github] [nova].
- Frontend: React, Redux Toolkit, React Router, Tailwind CSS, HTML, CSS — used in SeniorSays and at Carboledger [seniorsays] [carboledger].
- Backend and databases: FastAPI, Node.js, Express.js, REST APIs, JWT auth, PostgreSQL, SQLAlchemy, Alembic — used in Legal Sarthi [legal-sarthi].
- Cloud and DevOps: AWS (EC2, Secrets Manager), Docker, CI/CD with GitHub Actions, Git/GitHub, Vercel [legal-sarthi] [this-repo].
- AI: Claude Code, Groq (Llama-3), OpenAI API, sentence-transformers, prompt engineering [legal-sarthi] [seniorsays].
- CS fundamentals: Data Structures & Algorithms, OOP, DBMS, Operating Systems, Computer Networks [codolio].

## Projects
- N.O.V.A ("Hey Nova") — my personal Android assistant, like Jarvis, in Kotlin [nova]. Built because as a student with an internship, meetings and deadlines I had too much to remember. Understands Hinglish and English. Reminds me an hour before Google Meet calls, answers questions through Claude and reads the answer aloud, sends WhatsApp messages, and places calls — if two contacts match it asks me which one first. Privacy-first: voice recognition runs offline on the phone, and it goes online (for Claude answers) only when I ask. Its 55 MB offline voice model is downloaded at build time with a SHA-256 check instead of living in git, because pushing it kept failing on my connection. My first Android and voice product.
- Legal Sarthi — team project, an AI assistant for lawyers [legal-sarthi]. Idea came when I visited a law office near my home for my own documentation work and saw how much time goes into searching IPC/BNS sections and precedent cases by hand. A lawyer narrates or types the case; Groq-hosted Llama-3.3-70B suggests IPC/BNS sections; the lawyer accepts, rejects or adds sections; the Indian Kanoon API fetches precedent cases; sentence embeddings rank them by similarity (for example "76% match"). Two-tier pipeline: cheap local cosine similarity first, only ambiguous results go to the LLM. Replaced per-item LLM calls with one batched call, about 2–3x faster, with a safe fallback. JWT auth on 10+ routes with ownership checks against IDOR, async PostgreSQL with Alembic, secrets in AWS Secrets Manager, Docker on EC2. FIR photo upload with OCR is future scope — not built yet. Learnings: test-driven development, planning the MVP before coding, FastAPI, AWS, Docker, and git rebase vs merge.
- SeniorSays — placement-prep platform where seniors share interview experiences and resumes and juniors search by company and role [seniorsays] [seniorsays-live]. Seniors complained that after filling the whole form they were told the slug was taken. I generate the slug from the title and check availability live with a 300 ms debounce while they type. Fixed a silent 25-record cap in Appwrite with cursor-based fetching. Cut list payload from about 2 MB to about 100 KB by fetching only needed fields. Added an AI writing assistant (OpenAI) in the editor.
- Kin — Alexa+ MCP server for parents who live alone: medicine tracking, memory and daily check-ins, built for the Amazon developer hackathon (Oct 2026) [kin]. Rule: "Kin asks before it worries" — an unlogged dose is unconfirmed, not missed. Comes with a voice and smart-display simulator [alexa-sim].
- MeterMind — an agent that reads Indian water, gas and factory sub-meters from phone photos with OpenCV, built for Build With AI and the OpenCV AI Competition (Oct 2026) [metermind]. I first assumed electricity meters are still read by hand; research showed smart meters and optical probes, so I reframed the problem.
- This site, "Receipts" — built entirely by voice with Wispr Flow dictating into Claude Code. Raw takes are on the page [raw-tape]; the code is public [this-repo].

## Record
- 600+ DSA problems on LeetCode and GeeksforGeeks [codolio] [dsa-sheet].
- Top 13 of ~100 teams, Smart India Hackathon internal round, NIT Hamirpur [sih].
- Organised Electrothon 7.0 and 8.0 with SPEC [electrothon-7] [electrothon-8].

## Biggest risks
1. The second drop for JEE instead of a private college — it paid off [jee].
2. Going all-in on software as an ECE student while keeping my CGPA [cgpa].
3. October 2026: internship + classes + four overlapping hackathons — Amazon (24 Oct) [kin], Build With AI and OpenCV (27 Oct) [metermind], Meta (team entry due 4 Nov). It taught me real time management.

## Mistakes
1. No backup plan in my NDA year: I prepared only for NDA and didn't study for JEE in parallel, which cost me a full year. Lesson: always run the backup in parallel [ssb].
2. Untimed DSA practice: I solved problems with no clock, so contest time pressure hurt. Now I time-box every problem and do contests [codolio].

## How I think when stuck
Find the root cause, not the symptom. Pen and paper, think out loud, then implement. Cheap first, expensive later. Plan the MVP before coding. Write the lesson down so it doesn't repeat. Example: the SeniorSays slug fix [seniorsays].

## Why growth, why Wispr
- My best moments weren't writing code — they were getting things in front of people. Electrothon partnerships and brand were growth work, I just didn't call it that back then [electrothon-8]. My weekly cold-email outreach for internships, sent to recruiters found on LinkedIn and hiring platforms, was my first growth funnel — I am not claiming it landed anything, only that I ran it every week.
- I built a Hinglish voice assistant myself, so I know how hard Indian accents and Hinglish are for voice tech [nova]. India is a voice-note country — people already talk to their phones; Wispr turns that talking into work. This whole portfolio was built by voice [raw-tape].
- Day-one offer: as Developer Relations Lead at SPEC, I can bring Wispr Flow to Electrothon 9.0 as a partner — a national hackathon full of student builders, exactly the users who'd love building by voice. College tech societies are an untapped channel.

## Can't do yet (be honest)
- Stock-market investing — want to learn, a friend who trades will help.
- Video editing and design — want to learn; friends spend 9–10 hours for a 2–3 minute video.
- A foreign language — plan to start in the summer holidays.
- No receipts for: running paid ads, owning a marketing channel full-time, influencer marketing.

## The $3,000 grant
A proper setup in my hostel room — a new laptop such as a MacBook and a bigger screen.
`.trim();
