import { describe, expect, it } from 'vitest';
import { attribute, csp, elements, htmlFiles, read, sha256 } from './helpers';

const directive = (policy: string, name: string): string[] =>
  policy
    .split(';')
    .map((part) => part.trim().split(/\s+/))
    .find(([key]) => key === name)
    ?.slice(1) ?? [];

const isDataBlock = (attributes: string): boolean => attribute(attributes, 'type') === 'application/ld+json';

describe.each(htmlFiles)('content security policy in %s', (file) => {
  const html = read(file);
  const policy = csp(html) ?? '';

  it('has a CSP meta tag', () => {
    expect(csp(html)).toBeDefined();
    expect(policy).toContain("default-src 'none'");
  });

  it('allows neither unsafe-inline nor unsafe-eval', () => {
    expect(policy).not.toContain('unsafe-inline');
    expect(policy).not.toContain('unsafe-eval');
    expect(policy).not.toContain('unsafe-hashes');
  });

  it('only allows this origin and hashes', () => {
    for (const name of ['script-src', 'style-src', 'img-src', 'font-src']) {
      const sources = directive(policy, name);
      expect(sources.length, name).toBeGreaterThan(0);
      for (const source of sources) expect(source, name).toMatch(/^'(self|none|sha256-[A-Za-z0-9+/=]+)'$/);
    }
  });

  it('lists the hash of every inline script', () => {
    const allowed = directive(policy, 'script-src');
    const inline = elements(html, 'script').filter(
      (script) => attribute(script.attributes, 'src') === undefined && !isDataBlock(script.attributes),
    );
    for (const script of inline) expect(allowed, script.content.slice(0, 60)).toContain(`'${sha256(script.content)}'`);
  });

  it('lists the hash of every inline style element', () => {
    const allowed = directive(policy, 'style-src');
    const styles = elements(html, 'style');
    for (const style of styles) expect(allowed, style.content.slice(0, 60)).toContain(`'${sha256(style.content)}'`);
  });

  it('has no style attributes and no inline event handlers', () => {
    const tags = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '').match(/<[a-z][^>]*>/gi) ?? [];
    expect(tags.filter((tag) => /\sstyle\s*=/i.test(tag))).toEqual([]);
    expect(tags.filter((tag) => /\son[a-z]+\s*=/i.test(tag))).toEqual([]);
  });
});
