# Receipts

**Don't trust my resume. Check my receipts.**

My portfolio for the Wispr Flow 7-day challenge, built entirely by voice. I spoke every answer, fix and instruction into [Wispr Flow](https://wisprflow.ai), mostly in Hinglish, and built the site with Claude Code.

Every claim on the page links to proof. If a claim has no proof, the page says so and stamps it **NO RECEIPT**.

---

## What's on the page

| Section | What it does |
|---|---|
| **Hero** | A live ridgeline of your voice. Press *Talk to this page* and your mic's spectrum scrolls across the screen. Spoken commands also work here: "mistakes dikhao", "ask why growth?". |
| **Ask** | An AI twin of me. Ask by voice or text, in English or Hinglish. Each answer prints as a receipt with links to proof and a stamp: *verified*, *self-reported* or *no receipt*. |
| **Ledger** | My work as an itemised receipt. Tap any line to see the proof behind it. |
| **Mistake Museum** | Real decisions from my projects as a choose-your-own-path game. You make the call first, then see what I did, how it turned out and what I learned. Your cursor is a torch in a dark room. |
| **Growth Lab** | Growth work I did with my team before I called it growth, an idea I'd explore, and a live experiment logged daily, flops included. |
| **Spot the Fake** | Four claims about me, one of them false. Can you find the claim with no receipt? |
| **The Tape** | Raw → shipped: the unedited voice takes behind the page and the mis-hearings Wispr made along the way. |

Turn on **Raw mode** (nav switch or the <kbd>R</kbd> key) and every section shows the raw take it came from.

## Voice, everywhere

- **Voice commands** use the browser's Web Speech API (`en-IN`), so Hinglish works: "museum", "growth lab", "khel", "raw mode on", "animation band karo", "upar". Press <kbd>?</kbd> for the full list and <kbd>V</kbd> to toggle the mic.
- **Live spectrum:** the Web Audio `AnalyserNode` feeds the hero's canvas ridgeline. There's no audio library, and nothing is recorded or uploaded.
- Spoken Hindi that comes back in Devanagari works too: "गलतियाँ दिखाओ", "ऊपर जाओ", "पूछो …".
- **The twin talks back — in Troy's voice.** Switch on *Read answers aloud* (or say "bolke sunao") and answers are spoken by Orpheus (`canopylabs/orpheus-v1-english`, voice *troy*) through `/api/speak`. Long answers are split into sentences, generated in parallel and stitched into one WAV, because Orpheus stops after ~18 s per request. Audio is cached on the server and in the browser, and if the free quota runs out the page falls back to the most natural voice the browser has.
- In browsers without speech recognition (Firefox), the waveform still reacts to your voice and typing works everywhere.

## How the twin stays honest

```
question ──► /api/ask ──► LLM (any OpenAI-compatible API, Groq by default)
                │            │  answers only from shared/knowledge.ts
                │            ▼  returns { answer, receipts: [ids] }
                │      server keeps only receipt ids that exist,
                │      then computes the verdict itself
                │
                └─ no key / LLM down / bad JSON ──► offline matcher (shared/matcher.ts)
```

- The model never decides the stamp. `verdictFor()` does: any public link → **verified**, only self-reported proof → **self-reported**, nothing → **no receipt**.
- Topics I have no proof for (paid ads, foreign languages and so on) skip the model entirely and return **no receipt**.
- The question is sent as data, never as instructions. Requests are rate-limited, size-capped and time out after 12 s.
- Only the knowledge sections a question needs go into the prompt (`shared/context.ts`), repeat questions come from an in-memory cache, and a rate-limited model hands over to the next one in the chain — so Groq's free tier holds up when judges click every chip.
- With no API key configured, the site still works fully on the offline matcher.

## Run it

```bash
npm install
cp .env.example .env     # optional: add LLM_API_KEY for the AI twin
npm run dev              # http://localhost:5173 (serves /api/ask locally too)
npm test                 # vitest: logic, API and UI
npm run e2e              # playwright: real chromium, desktop + phone, against a production build
npm run build            # typecheck + production build
```

| Env var | Default | |
|---|---|---|
| `LLM_API_KEY` | — | Leave empty to use offline mode |
| `LLM_BASE_URL` | `https://api.groq.com/openai/v1` | Any OpenAI-compatible endpoint |
| `TTS_VOICE` | `troy` | Orpheus voice: austin, daniel, troy, autumn, diana, hannah |
| `LLM_MODEL` | `openai/gpt-oss-120b,openai/gpt-oss-20b,qwen/qwen3.8-27b` | Comma-separated chain; the next model takes over when one hits its rate limit |

**Deploy:** import the repo in Vercel and set the env vars. Vite is detected automatically, and `api/ask.ts` becomes a serverless function.

## Structure

```
api/ask.ts            serverless endpoint (validation, rate limit)
api/speak.ts          text-to-speech endpoint (Orpheus, chunked, cached)
shared/               used by both server and browser
  knowledge.ts        facts the twin may use, each tagged with receipt ids
  receipts.ts         the proof catalog + verdict rules
  faq.ts, matcher.ts  offline answers
  ask.ts              LLM call, reply sanitising, fallbacks
content/brain-dump.md raw Wispr Flow transcripts (the source of everything)
src/
  components/         one file per section
  data/               museum scenes, game rounds, ledger, campaign log, mis-hearings
  lib/                voice hook, command parser, ridgeline math, transcript parser
tests/                222 unit tests: logic, API, UI, contrast and config
e2e/                  Playwright specs, run in CI on every push
```

## Updating the growth experiment

Add a row to `CAMPAIGN.days` in [`src/data/campaign.ts`](src/data/campaign.ts) each day:

```ts
{ date: '2026-10-30', reach: 140, installs: 6, note: 'first reel in 3 campus groups' }
```

The tiles, chart and table update on their own. A test checks that the log stays in order and that installs never exceed reach.

## Accessibility

Checked with axe-core in every interactive state (zero violations). Every text colour meets WCAG AA 4.5:1, and a test reads the tokens straight from the stylesheet so it stays that way. Keyboard shortcuts are ignored while you're typing, focus moves to each new museum exhibit, and there's a skip link, `aria-live` regions for printed answers and voice feedback, a native `<dialog>` for help, and a table view for the chart. Motion is reduced automatically when `prefers-reduced-motion` is set, and there's also a toggle in the footer.

## Security and performance

- Strict Content-Security-Policy: scripts, fonts and API calls are same-origin only, and the microphone is allowed for this page alone (`vercel.json`).
- Fonts are self-hosted, so no request goes to Google when someone visits.
- Hashed assets are cached for a year, off-screen sections skip rendering (`content-visibility`), and the hero canvas stops completely once it scrolls out of view.

---

Built by Arpit Tyagi, ECE at NIT Hamirpur. arpittyag246@gmail.com · [LinkedIn](https://www.linkedin.com/in/arpit-tyagi-526b33277)
