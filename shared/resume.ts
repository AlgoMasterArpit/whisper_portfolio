export const RESUME = `
# Arpit Tyagi — resume

arpittyag246@gmail.com · [LinkedIn](https://www.linkedin.com/in/arpit-tyagi-526b33277) · [GitHub](https://github.com/AlgoMasterArpit) · [Codolio](https://codolio.com/profile/AlgoMasterArpit)

Full-Stack Developer · Python, React, SQL, AWS · AI-integrated web applications

## Education

**National Institute of Technology, Hamirpur** — Hamirpur, HP, India
B.Tech, Electronics & Communication Engineering — CGPA 8.94/10 · Aug 2024 – Jun 2028 (expected)

## Technical skills

- **Languages:** C++, Python, JavaScript, SQL
- **Frontend:** React, Redux Toolkit, React Router, Tailwind CSS, HTML, CSS
- **Backend & databases:** FastAPI, Node.js, Express.js, REST APIs, JWT auth, PostgreSQL, SQLAlchemy, Alembic
- **Cloud & DevOps:** AWS (EC2, Secrets Manager), Docker, CI/CD (GitHub Actions), Git/GitHub, Vercel
- **AI tools:** Claude Code, Groq (Llama-3), OpenAI API, sentence-transformers, prompt engineering
- **CS fundamentals:** Data Structures & Algorithms, OOP, DBMS, Operating Systems, Computer Networks

## Experience

**Carboledger** — Full Stack Engineer Intern · Remote · July 2026 – present (6-month internship)
- Contributed to the React frontend revamp of the core product, building UI screens from Figma designs under the guidance of senior engineers.
- Integrated screens with backend REST APIs using Notion specs and knowledge-transfer (KT) sessions, iterating on code-review feedback in an agile team.

**SPEC (Society for Promotion of Electronics Culture), NIT Hamirpur** — Developer Relations Lead · Aug 2024 – present
- Built a React dashboard for real-time infrastructure monitoring during Electrothon 8.0, used by 500+ participants.
- Trained a 27-member team on DSA and full-stack web development through hands-on sessions.

## Projects

**LegalAI (Legal Sarthi)** — Python, FastAPI, PostgreSQL, Groq LLM, NLP embeddings, Docker, AWS
- Built an AI legal-research backend: an LLM extracts applicable IPC/BNS sections from a case, and similar Indian Kanoon judgments are ranked by AI similarity score.
- Designed a two-tier NLP ranking pipeline — local sentence-embedding cosine similarity first; only ambiguous results go to the Groq LLM (Llama-3.3-70B).
- Replaced per-item LLM calls with one batched call (O(n) → O(1)), making precedent retrieval ~2–3x faster, with a safe fallback when the call fails.
- Secured 10+ routes with JWT authentication (bcrypt, HS256) via one reusable dependency, plus ownership checks to block IDOR.
- Built an async PostgreSQL layer with Alembic migrations; loaded secrets from AWS Secrets Manager; deployed with Docker on AWS EC2.

**SeniorSays** — React, Redux Toolkit, Tailwind CSS, Appwrite, OpenAI API, Vercel
- Built a placement-prep platform where seniors share interview experiences and resumes, and juniors search and browse them by company and role.
- Fixed a silent 25-record cap in Appwrite using cursor-based fetching and a reusable pagination component, so search covers all posts.
- Cut list-page payload from ~2 MB to ~100 KB (est.) by fetching only needed fields; built a custom React hook reused across 3 pages.
- Added an AI writing assistant (OpenAI API) inside the editor to fix grammar, summarize or rephrase text.

## Achievements & responsibilities

- Top 13 among ~100 teams in the Smart India Hackathon (SIH) internal round, NIT Hamirpur.
- Solved 600+ DSA problems on LeetCode and GeeksforGeeks.
- Organised national-level hackathons Electrothon 7.0 and 8.0 as part of the SPEC team.
- Co-Coordinator, Alumni Cell, NIT Hamirpur.
`.trim();
