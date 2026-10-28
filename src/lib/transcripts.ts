export interface Take {
  label: string;
  text: string;
}

export interface Question {
  id: string;
  title: string;
  takes: Take[];
}

export function parseBrainDump(markdown: string): Question[] {
  const questions: Question[] = [];
  let question: Question | undefined;
  let take: Take | undefined;

  for (const line of markdown.replace(/\r\n/g, '\n').split('\n')) {
    const q = line.match(/^## Q(\d+)\.\s*(.+)$/);
    if (q) {
      question = { id: `q${q[1]}`, title: q[2]!.trim(), takes: [] };
      questions.push(question);
      take = undefined;
      continue;
    }
    if (line.startsWith('## ')) {
      question = undefined;
      take = undefined;
      continue;
    }
    const t = line.match(/^### (.+)$/);
    if (t && question) {
      take = { label: t[1]!.trim(), text: '' };
      question.takes.push(take);
      continue;
    }
    if (take) take.text += `${line}\n`;
  }

  for (const q of questions) for (const t of q.takes) t.text = t.text.trim();
  return questions.filter((q) => q.takes.some((t) => t.text));
}

export function countWords(questions: readonly Question[]): number {
  let words = 0;
  for (const q of questions) for (const t of q.takes) words += t.text.split(/\s+/).filter(Boolean).length;
  return words;
}

export function firstSentences(text: string, max = 2): string {
  const sentences = text.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]+/g) ?? [text];
  return sentences.slice(0, max).join('').trim();
}
