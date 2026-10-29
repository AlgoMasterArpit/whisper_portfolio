import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const html = read('index.html');

describe('index.html', () => {
  it('loads nothing from third-party hosts', () => {
    const urls = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]!);
    expect(urls.filter((u) => /^https?:/.test(u) && !u.startsWith('https://whisper-portfolio.vercel.app'))).toEqual([]);
  });

  it('points every local asset at a file that exists', () => {
    const local = [...html.matchAll(/(?:href|src)="(\/[^"]+)"/g)].map((m) => m[1]!).filter((u) => !u.startsWith('/src/'));
    expect(local.length).toBeGreaterThan(3);
    for (const path of local) expect(existsSync(new URL(`../public${path}`, import.meta.url)), path).toBe(true);
  });

  it('has a full social preview', () => {
    for (const tag of ['og:title', 'og:description', 'og:image', 'og:url', 'twitter:card']) expect(html).toContain(tag);
  });
});

describe('vercel.json', () => {
  const config = JSON.parse(read('vercel.json')) as { headers: { source: string; headers: { key: string; value: string }[] }[] };
  const global = config.headers.find((h) => h.source === '/(.*)')!.headers;
  const header = (key: string) => global.find((h) => h.key === key)?.value ?? '';

  it('locks scripts, connections and fonts to this origin', () => {
    const csp = header('Content-Security-Policy');
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("connect-src 'self'");
    expect(csp).toContain("font-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).not.toMatch(/https?:\/\//);
  });

  it('allows the microphone for this page only', () => {
    expect(header('Permissions-Policy')).toContain('microphone=(self)');
  });

  it('caches hashed assets forever', () => {
    const assets = config.headers.find((h) => h.source === '/assets/(.*)')!.headers;
    expect(assets[0]!.value).toContain('immutable');
  });
});

describe('public files', () => {
  it('ships a sitemap that robots.txt points to', () => {
    expect(read('public/robots.txt')).toContain('/sitemap.xml');
    expect(read('public/sitemap.xml')).toContain('<loc>https://whisper-portfolio.vercel.app/</loc>');
  });

  it('has a 404 page that stays on brand', () => {
    expect(read('public/404.html')).toContain('NO RECEIPT');
  });

  it('lists only icons that exist in the manifest', () => {
    const manifest = JSON.parse(read('public/site.webmanifest')) as { icons: { src: string }[] };
    for (const icon of manifest.icons) expect(existsSync(new URL(`../public${icon.src}`, import.meta.url)), icon.src).toBe(true);
  });
});
