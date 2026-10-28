export interface Mishear {
  said: string;
  shipped: string;
  question: string;
}

export const MISHEARS: readonly Mishear[] = [
  { said: 'have you heard about Java?', shipped: 'have you heard about Jarvis?', question: 'q2' },
  { said: 'Electrothon Mindpointo', shipped: 'Electrothon 9.0', question: 'q7' },
  { said: 'for the strength builders', shipped: 'for student builders', question: 'q7' },
  { said: 'Carbolager', shipped: 'Carboledger', question: 'q1' },
  { said: "I've been a part of 7.2 and 8.2", shipped: "I've been part of Electrothon 7.0 and 8.0", question: 'q1' },
  { said: 'Grok Java API keys', shipped: 'Groq API keys', question: 'q2' },
  { said: 'a second drop of CHED', shipped: 'a second drop for JEE', question: 'q3' },
  { said: 'National School of Technology', shipped: 'National Institute of Technology', question: 'q3' },
  { said: 'My current CGPA is 9.84', shipped: 'My current CGPA is 8.94', question: 'q1' },
  { said: 'a 3 ms debouncing condition', shipped: 'a 300 ms debounce', question: 'q6' },
];
