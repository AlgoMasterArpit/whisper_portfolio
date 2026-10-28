import { describe, expect, it, vi } from 'vitest';
import { AskError, askArpit } from '../src/lib/askClient';

const reply = (body: unknown, status = 200) => vi.fn(async () => new Response(JSON.stringify(body), { status }));

describe('askArpit', () => {
  it('returns the server answer', async () => {
    const answer = { text: 'Hi', receipts: [], verdict: 'no-receipt', source: 'twin' };
    expect(await askArpit('hi', reply(answer))).toEqual(answer);
  });

  it('posts the question as json', async () => {
    const fetchImpl = reply({ text: 'x', receipts: [], verdict: 'no-receipt', source: 'twin' });
    await askArpit('why growth?', fetchImpl);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/ask');
    expect(JSON.parse(init.body as string)).toEqual({ question: 'why growth?' });
  });

  it('answers offline when the api is missing or broken', async () => {
    const offline = vi.fn(async () => {
      throw new TypeError('offline');
    });
    expect((await askArpit('What is NOVA?', offline)).source).toBe('offline');
    expect((await askArpit('What is NOVA?', reply('nope', 404))).source).toBe('offline');
    expect((await askArpit('What is NOVA?', reply({ weird: true }))).source).toBe('offline');
  });

  it('surfaces validation and rate-limit messages', async () => {
    await expect(askArpit('', reply({ error: 'Ask me something first.' }, 400))).rejects.toThrow(AskError);
    await expect(askArpit('hi', reply({ error: 'Too many' }, 429))).rejects.toThrow('Too many');
  });
});
