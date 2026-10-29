export const SECTIONS = ['top', 'ask', 'ledger', 'museum', 'growth', 'game', 'tape'] as const;
export type SectionId = (typeof SECTIONS)[number];

export type Command =
  | { type: 'goto'; section: SectionId }
  | { type: 'raw'; on: boolean }
  | { type: 'motion'; on: boolean }
  | { type: 'speak'; on: boolean }
  | { type: 'ask'; question: string }
  | { type: 'help' };

export const COMMAND_HELP: readonly { say: string; does: string }[] = [
  { say: '“ask why growth?” · “pucho NOVA kya hai”', does: 'asks the twin' },
  { say: '“mistakes dikhao” · “museum”', does: 'opens the Mistake Museum' },
  { say: '“growth lab” · “campaign”', does: 'jumps to the Growth Lab' },
  { say: '“projects” · “work”', does: 'opens the ledger' },
  { say: '“play” · “khel”', does: 'starts Spot the Fake' },
  { say: '“raw mode on / off”', does: 'shows what I actually said' },
  { say: '“bolke sunao” · “read aloud off”', does: 'the twin speaks its answers' },
  { say: '“animation band karo”', does: 'reduces motion' },
  { say: '“upar” · “top”', does: 'back to the top' },
];

const hindi = (...stems: string[]) => new RegExp(`(^|\\s)(${stems.join('|')})`, 'u');

const GOTO: readonly [SectionId, RegExp, RegExp][] = [
  ['museum', /\b(museum|mistakes?|galti|galtiyan|story|risks?)\b/, hindi('गलत', 'म्यूज़ियम', 'म्यूजियम', 'कहानी')],
  ['growth', /\b(growth|lab|campaign|experiment)\b/, hindi('ग्रोथ', 'लैब')],
  ['ledger', /\b(ledger|projects?|work|resume|kaam)\b/, hindi('प्रोजेक्ट', 'काम')],
  ['game', /\b(game|play|khel|khelo|spot the fake|fake)\b/, hindi('खेल')],
  ['tape', /\b(tape|transcripts?|takes?)\b/, hindi('टेप')],
  ['ask', /\b(ask|twin|chat|sawal|interview)\b/, hindi('सवाल')],
  ['top', /\b(top|upar|home|start|shuru)\b/, hindi('ऊपर', 'शुरू')],
];

const NAV_VERB = /\b(open|show|go|take me|jump|scroll|talk|dikhao|dikha|kholo|jao|chalo|le chalo)\b/;
const NAV_VERB_HI = /(दिखाओ|खोलो|जाओ|चलो)/u;

export function parseCommand(input: string): Command | null {
  const text = input
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s?']/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return null;

  const ask = text.match(/^(?:ask|pucho|puchho|poocho|question|पूछो)\s+(.+)$/u);
  if (ask?.[1]) return { type: 'ask', question: ask[1] };

  if (/\braw\b/.test(text)) {
    return { type: 'raw', on: !/\b(off|band|hide|hatao|stop)\b/.test(text) };
  }
  if (/\bshipped\b/.test(text)) return { type: 'raw', on: false };

  if (/\b(aloud|sunao|mute|unmute)\b/.test(text)) {
    return { type: 'speak', on: /\bunmute\b/.test(text) || !/\b(off|band|stop|mute|chup)\b/.test(text) };
  }

  if (/\b(animations?|motion)\b/.test(text)) {
    return { type: 'motion', on: !/\b(off|band|stop|reduce|kam|less)\b/.test(text) };
  }

  if (/\b(help|commands|madad)\b|what can i say|kya bol/.test(text)) return { type: 'help' };

  const navigation = text.split(' ').length <= 3 || NAV_VERB.test(text) || NAV_VERB_HI.test(text);
  if (!navigation) return null;

  for (const [section, latin, devanagari] of GOTO) {
    if (latin.test(text) || devanagari.test(text)) return { type: 'goto', section };
  }
  return null;
}

export function looksLikeQuestion(text: string): boolean {
  const t = text.trim().toLowerCase();
  return (
    /\?$/.test(t) ||
    t.split(/\s+/).length >= 3 ||
    /^(what|why|how|who|when|where|which|tell|do|did|are|is|can|kya|kaise|kyu|kyun|kab|kaun|kahan|sabse)\b/.test(t) ||
    /^(क्या|कैसे|क्यों|कब|कौन|कहाँ|सबसे)(\s|$)/u.test(t)
  );
}
