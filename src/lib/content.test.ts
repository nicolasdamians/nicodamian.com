import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { experience } from '../data/experience';
import { projects } from '../data/projects';
import { credentials } from '../data/credentials';
import { contact } from '../data/beyond';
import { formatRange } from './dates';
import { isTodo, todo } from './todo';

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
const lum = (c: string) => {
  const [r, g, b] = hex(c).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)) as [
    number,
    number,
    number,
  ];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
};

describe('todo markers', () => {
  it('round-trips', () => expect(isTodo(todo('x'))).toBe(true));
  it('ignores normal text', () => expect(isTodo('Zurich')).toBe(false));
});

describe('content integrity', () => {
  it('has unique ids', () => {
    for (const list of [experience, projects, credentials]) {
      const ids = list.map((item) => item.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
  it('has valid, descending experience dates', () => {
    const starts = experience.map((job) => job.start);
    experience.forEach((job) => expect(() => formatRange(job.start, job.end)).not.toThrow());
    expect([...starts].sort().reverse()).toEqual(starts);
  });
  it('only links over https', () => {
    const urls = [
      ...projects.flatMap((p) => (p.link ? [p.link.href] : [])),
      ...credentials.flatMap((c) => (c.verifyUrl ? [c.verifyUrl] : [])),
      ...contact.channels.map((c) => c.href),
    ];
    urls.forEach((url) => expect(new URL(url).protocol).toBe('https:'));
  });
});

describe('colour contrast (WCAG AA)', () => {
  // Read the tokens from the stylesheet that ships, so the test cannot drift from the real palette.
  const css = readFileSync(new URL('../styles/global.css', import.meta.url), 'utf8');
  const tokensOf = (selector: string): Record<string, string> => {
    const start = css.indexOf(`${selector} {`);
    if (start === -1) throw new Error(`No "${selector}" block in global.css`);
    const block = css.slice(start, css.indexOf('}', start));
    return Object.fromEntries([...block.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6})/g)].map((m) => [m[1], m[2]]));
  };
  const themes = { dark: tokensOf(':root'), light: tokensOf("[data-theme='light']") };
  const colour = (tokens: Record<string, string>, name: string): string => {
    const value = tokens[name];
    if (!value) throw new Error(`Token --${name} missing`);
    return value;
  };

  for (const [name, tokens] of Object.entries(themes)) {
    it(`${name}: text on background and surface is at least 4.5:1`, () => {
      for (const back of ['bg', 'surface']) {
        for (const front of ['fg', 'muted', 'faint', 'accent', 'warn']) {
          expect(ratio(colour(tokens, front), colour(tokens, back)), `${front} on ${back}`).toBeGreaterThanOrEqual(4.5);
        }
      }
      expect(ratio(colour(tokens, 'on-accent'), colour(tokens, 'accent'))).toBeGreaterThanOrEqual(4.5);
    });
    it(`${name}: control borders are at least 3:1`, () => {
      expect(ratio(colour(tokens, 'line-strong'), colour(tokens, 'bg'))).toBeGreaterThanOrEqual(3);
    });
  }
});
