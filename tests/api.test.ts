import { beforeEach, describe, expect, it, vi } from 'vitest';

const post = (body: string, ip = '1.1.1.1') =>
  new Request('http://localhost/api/ask', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body,
  });

describe('POST /api/ask', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('LLM_API_KEY', '');
  });

  it('answers a valid question offline when no key is configured', async () => {
    const { POST } = await import('../api/ask');
    const res = await POST(post(JSON.stringify({ question: 'What is NOVA?' })));
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(await res.json()).toMatchObject({ source: 'offline', verdict: 'verified' });
  });

  it('rejects malformed json', async () => {
    const { POST } = await import('../api/ask');
    expect((await POST(post('{nope'))).status).toBe(400);
  });

  it('rejects an empty question', async () => {
    const { POST } = await import('../api/ask');
    const res = await POST(post(JSON.stringify({ question: ' ' })));
    expect(res.status).toBe(400);
    expect(await res.json()).toHaveProperty('error');
  });

  it('rate limits a noisy client without blocking others', async () => {
    const { POST } = await import('../api/ask');
    const body = JSON.stringify({ question: 'hi' });
    for (let i = 0; i < 20; i++) await POST(post(body, '9.9.9.9'));
    expect((await POST(post(body, '9.9.9.9'))).status).toBe(429);
    expect((await POST(post(body, '8.8.8.8'))).status).toBe(200);
  });
});
