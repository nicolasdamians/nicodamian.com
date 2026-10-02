// Blocks private hostnames, IP literals, secrets and stray emails from reaching the public repo or the build.
// Runs as part of `npm run build`. Exit code 1 on any hit.
import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { RULES, denylistRules, scanLine } from './leak-rules.mjs';

const DENYLIST = '.leak-denylist.local';
const SKIP =
  /(^|[\\/])(node_modules|\.git|\.astro|package-lock\.json|test-results|screenshots)([\\/]|$)|\.(png|jpg|webp|woff2|ico)$|leak-rules\.mjs$|leaks\.test\.ts$/;

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (SKIP.test(path)) return [];
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const sourceFiles = () => {
  try {
    // -z keeps unusual file names intact instead of quoting them.
    const out = execSync('git ls-files -z --cached --others --exclude-standard', { encoding: 'utf8' });
    return out.split('\0').filter((file) => file && !SKIP.test(file) && existsSync(file));
  } catch (error) {
    console.warn(`leak scan: git unavailable (${error.message.split('\n')[0]}), walking the directory instead`);
    return walk('.');
  }
};

const rules = existsSync(DENYLIST) ? [...RULES, ...denylistRules(readFileSync(DENYLIST, 'utf8'))] : RULES;
if (!existsSync(DENYLIST)) console.warn(`leak scan: no ${DENYLIST} found, owner-specific terms are not checked`);

const files = [...sourceFiles(), ...(existsSync('dist') ? walk('dist') : [])];
const hits = files.flatMap((file) =>
  readFileSync(file, 'utf8')
    .split('\n')
    .flatMap((line, i) => scanLine(line, rules).map((hit) => `${file}:${i + 1}  ${hit.name}: ${hit.text}`)),
);

console.log(hits.length ? hits.join('\n') : `leak scan clean (${files.length} files)`);
process.exit(hits.length ? 1 : 0);
