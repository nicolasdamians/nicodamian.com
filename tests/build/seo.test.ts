import { describe, expect, it } from 'vitest';
import { SITE, files, read } from './helpers';

const locations = (xml: string): string[] => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1] ?? '');

describe('search engine files', () => {
  it('has the home page as its own canonical URL', () => {
    const canonicals = [...read('index.html').matchAll(/<link rel="canonical" href="([^"]+)">/g)].map((m) => m[1]);
    expect(canonicals).toEqual([`${SITE}/`]);
    expect(read('index.html')).toContain(`<meta property="og:url" content="${SITE}/">`);
  });

  it('keeps the 404 page out of the index', () => {
    expect(read('404.html')).toContain('<meta name="robots" content="noindex">');
    expect(read('index.html')).not.toContain('noindex');
  });

  it('has a sitemap that lists the home page and nothing else', () => {
    expect(locations(read('sitemap-index.xml'))).toEqual([`${SITE}/sitemap-0.xml`]);
    expect(locations(read('sitemap-0.xml'))).toEqual([`${SITE}/`]);
    expect(files.filter((file) => /^sitemap.*\.xml$/.test(file))).toHaveLength(2);
    expect(read('index.html')).toContain('<link rel="sitemap" href="/sitemap-index.xml">');
  });

  it('has a robots.txt that allows crawling and points at the sitemap', () => {
    const lines = read('robots.txt')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    expect(lines).toContain('User-agent: *');
    expect(lines).toContain(`Sitemap: ${SITE}/sitemap-index.xml`);
    expect(lines.filter((line) => /^Disallow:\s*\S/i.test(line))).toEqual([]);
  });
});
