import { describe, expect, it } from 'vitest';
import { SITE, attribute, elements, files, htmlFiles, read, readBytes, withExtension } from './helpers';

const TEXT = withExtension('.html', '.css', '.js', '.svg', '.xml', '.txt', '.json', '.webmanifest');

// XML namespace names are identifiers, not addresses: nothing is ever fetched from them.
const withoutNamespaces = (text: string): string =>
  text
    .replace(/\bxmlns(:[\w-]+)?\s*=\s*"http:\/\/[^"]*"/g, '')
    .replace(/http:\/\/www\.w3\.org\/(1998|1999|2000)\/[\w/#-]+/g, '');

const isLocal = (url: string): boolean => {
  if (/^(https?:)?\/\//i.test(url)) return url.startsWith(`${SITE}/`);
  return !/^[a-z][a-z0-9+.-]*:/i.test(url);
};

/** URLs the browser fetches while rendering: scripts, styles, images, fonts, media, frames. */
const subresources = (html: string): string[] => {
  const urls: string[] = [];
  for (const [tag] of html.matchAll(
    /<(script|img|source|video|audio|iframe|embed|object|track|input|use|image)\b[^>]*>/gi,
  )) {
    for (const name of ['src', 'data', 'poster', 'href', 'xlink:href']) {
      const value = attribute(tag.slice(1, -1), name);
      if (value !== undefined) urls.push(value);
    }
    const srcset = attribute(tag.slice(1, -1), 'srcset');
    if (srcset !== undefined) urls.push(...srcset.split(',').map((entry) => entry.trim().split(/\s+/)[0] ?? ''));
  }
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const rel = attribute(tag.slice(1, -1), 'rel') ?? '';
    const href = attribute(tag.slice(1, -1), 'href');
    if (
      href !== undefined &&
      /stylesheet|preload|modulepreload|prefetch|preconnect|dns-prefetch|icon|manifest/.test(rel)
    )
      urls.push(href);
  }
  return urls;
};

describe('build output', () => {
  it('contains no http:// URLs', () => {
    const hits = TEXT.flatMap((file) =>
      [...withoutNamespaces(read(file)).matchAll(/http:\/\/[^\s"'<>)]*/g)].map((match) => `${file}: ${match[0]}`),
    );
    expect(hits).toEqual([]);
  });

  it('loads no subresource from another origin', () => {
    const fromHtml = htmlFiles.flatMap((file) =>
      subresources(read(file))
        .filter((url) => !isLocal(url))
        .map((url) => `${file}: ${url}`),
    );
    const fromCss = [...withExtension('.css'), ...htmlFiles].flatMap((file) =>
      [...read(file).matchAll(/(?:url\(\s*|@import\s+)["']?([^"')\s]+)/g)]
        .map((match) => match[1] ?? '')
        .filter((url) => !isLocal(url))
        .map((url) => `${file}: ${url}`),
    );
    expect([...fromHtml, ...fromCss]).toEqual([]);
  });

  it('ships exactly two woff2 files and no other font format', () => {
    expect(withExtension('.woff2')).toHaveLength(2);
    expect(withExtension('.woff', '.ttf', '.otf', '.eot')).toEqual([]);
  });

  it('ships no source maps', () => {
    expect(withExtension('.map')).toEqual([]);
    const referenced = withExtension('.js', '.css').filter((file) => /sourceMappingURL=/.test(read(file)));
    expect(referenced).toEqual([]);
  });

  it('has no SVG containing a script element', () => {
    const inFiles = withExtension('.svg').filter((file) => /<script\b/i.test(read(file)));
    const inline = htmlFiles.filter((file) =>
      elements(read(file), 'svg').some((svg) => /<script\b/i.test(svg.content)),
    );
    expect([...inFiles, ...inline]).toEqual([]);
  });

  it('has a 1200x630 PNG as the social image', () => {
    const png = readBytes('og.png');
    expect(png.subarray(1, 4).toString('latin1')).toBe('PNG');
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
    expect(read('index.html')).toContain(`<meta property="og:image" content="${SITE}/og.png">`);
  });

  it('publishes .well-known/security.txt', () => {
    expect(files).toContain('.well-known/security.txt');
    const text = read('.well-known/security.txt');
    expect(text).toMatch(/^Contact: https:\/\//m);
    expect(text).toContain(`Canonical: ${SITE}/.well-known/security.txt`);
    const expires = /^Expires: (.+)$/m.exec(text)?.[1] ?? '';
    expect(new Date(expires).getTime()).toBeGreaterThan(Date.now());
  });
});
