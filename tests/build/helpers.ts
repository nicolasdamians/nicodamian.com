import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SITE = 'https://nicodamian.com';
export const DIST = fileURLToPath(new URL('../../dist', import.meta.url));

if (!existsSync(join(DIST, 'index.html'))) throw new Error('dist/ is missing: run "npm run build" first');

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

/** Every file in dist, as forward-slash paths relative to it. */
export const files: readonly string[] = walk(DIST).map((path) => relative(DIST, path).replaceAll('\\', '/'));
export const withExtension = (...extensions: string[]): string[] =>
  files.filter((file) => extensions.some((extension) => file.endsWith(extension)));

export const read = (file: string): string => readFileSync(join(DIST, file), 'utf8');
export const readBytes = (file: string): Buffer => readFileSync(join(DIST, file));

export const htmlFiles = withExtension('.html');

export interface InlineElement {
  attributes: string;
  content: string;
}

/** Elements with a body, e.g. every <script> or <style>. The build output is machine-written, so a regex is enough. */
export const elements = (html: string, tag: 'script' | 'style' | 'svg'): InlineElement[] =>
  [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)</${tag}>`, 'gi'))].map((match) => ({
    attributes: match[1] ?? '',
    content: match[2] ?? '',
  }));

export const attribute = (attributes: string, name: string): string | undefined =>
  new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i')
    .exec(attributes)
    ?.slice(1)
    .find((value) => value !== undefined);

export const csp = (html: string): string | undefined => {
  const meta = /<meta\b[^>]*http-equiv\s*=\s*"?content-security-policy"?[^>]*>/i.exec(html)?.[0];
  return meta === undefined ? undefined : attribute(meta.slice(5, -1), 'content');
};

export const sha256 = (text: string): string => `sha256-${createHash('sha256').update(text, 'utf8').digest('base64')}`;
