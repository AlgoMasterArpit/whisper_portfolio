export const SECTIONS = ['top', 'ask', 'ledger', 'museum', 'growth', 'game', 'tape'] as const;
export type SectionId = (typeof SECTIONS)[number];

export type Command =
  | { type: 'goto'; section: SectionId }
  | { type: 'raw'; on: boolean }
  | { type: 'motion'; on: boolean }
  | { type: 'ask'; question: string }
  | { type: 'help' };

export const COMMAND_HELP: readonly { say: string; does: string }[] = [
  { say: '“ask why growth?” · “pucho NOVA kya hai”', does: 'asks the twin' },
  { say: '“mistakes dikhao” · “museum”', does: 'opens the Mistake Museum' },
  { say: '“growth lab” · “campaign”', does: 'jumps to the Growth Lab' },
  { say: '“projects” · “work”', does: 'opens the ledger' },
  { say: '“play” · “khel”', does: 'starts Spot the Fake' },
  { say: '“raw mode on / off”', does: 'shows what I actually said' },
  { say: '“animation band karo”', does: 'reduces motion' },
  { say: '“upar” · “top”', does: 'back to the top' },
];

const GOTO: readonly [SectionId, RegExp][] = [
  ['museum', /\b(museum|mistakes?|galti|galtiyan|story|risks?)\b/],
  ['growth', /\b(growth|lab|campaign|experiment)\b/],
  ['ledger', /\b(ledger|projects?|work|resume|kaam)\b/],
  ['game', /\b(game|play|khel|khelo|spot the fake|fake)\b/],
  ['tape', /\b(tape|transcripts?|takes?)\b/],
  ['ask', /\b(ask|twin|chat|sawal|interview)\b/],
  ['top', /\b(top|upar|home|start|shuru)\b/],
];

export function parseCommand(input: string): Command | null {
  const text = input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s?']/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return null;

  const ask = text.match(/^(?:ask|pucho|puchho|poocho|question)\s+(.+)$/);
  if (ask?.[1]) return { type: 'ask', question: ask[1] };

  if (/\braw\b/.test(text)) {
    return { type: 'raw', on: !/\b(off|band|hide|hatao|stop)\b/.test(text) };
  }
  if (/\bshipped\b/.test(text)) return { type: 'raw', on: false };

  if (/\b(animations?|motion)\b/.test(text)) {
    return { type: 'motion', on: !/\b(off|band|stop|reduce|kam|less)\b/.test(text) };
  }

  if (/\b(help|commands|madad)\b|what can i say|kya bol/.test(text)) return { type: 'help' };

  for (const [section, pattern] of GOTO) {
    if (pattern.test(text)) return { type: 'goto', section };
  }
  return null;
}
