// Builds must exist. Runs Lighthouse (mobile and desktop) against `astro preview` with Playwright's chromium.
// Exit code 1 if any category scores below the threshold.
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { preview } from 'astro';
import { launch } from 'chrome-launcher';
import lighthouse, { desktopConfig } from 'lighthouse';

const THRESHOLD = 95;
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
const PORT = 4393;
const OUT = '.lighthouse';
// Lighthouse downloads robots.txt from inside the page, which the site's own `connect-src 'none'` blocks, so the
// audit can only ever report a fetch error here. tests/build/seo.test.ts checks the file instead.
const SKIPPED = ['robots-txt'];

const url = `http://localhost:${PORT}/`;
const server = await preview({ logLevel: 'silent', server: { port: PORT } });
const chrome = await launch({
  chromePath: chromium.executablePath(),
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
});
const failures = [];
console.log(`skipped audits: ${SKIPPED.join(', ')} (blocked by the site CSP, covered by test:dist)`);

try {
  mkdirSync(OUT, { recursive: true });
  for (const [name, config] of [
    ['mobile', undefined],
    ['desktop', desktopConfig],
  ]) {
    const result = await lighthouse(
      url,
      { port: chrome.port, output: 'html', logLevel: 'error', onlyCategories: CATEGORIES, skipAudits: SKIPPED },
      config,
    );
    if (!result) throw new Error(`Lighthouse returned no result for ${name}`);
    writeFileSync(`${OUT}/${name}.html`, result.report);
    if (result.lhr.runtimeError) failures.push(`${name}: ${result.lhr.runtimeError.message}`);
    const scores = CATEGORIES.map((id) => {
      const raw = result.lhr.categories[id]?.score;
      const score = typeof raw === 'number' ? Math.round(raw * 100) : null;
      if (score === null || score < THRESHOLD)
        failures.push(`${name}: ${id} is ${score ?? 'missing'}, needs ${THRESHOLD}`);
      return `${id} ${score ?? 'n/a'}`;
    });
    console.log(`${name.padEnd(8)}${scores.join('  ')}`);
    // Name what cost points, so a failing run says why.
    for (const id of CATEGORIES) {
      for (const ref of result.lhr.categories[id]?.auditRefs ?? []) {
        const audit = result.lhr.audits[ref.id];
        if (ref.weight > 0 && audit && typeof audit.score === 'number' && audit.score < 0.9)
          console.log(`  ${id}: ${audit.id} (${audit.displayValue ?? audit.score})`);
      }
    }
  }
} finally {
  chrome.kill();
  await server.stop();
}

console.log(failures.length ? failures.join('\n') : `ok: every category is at least ${THRESHOLD} (reports in ${OUT}/)`);
process.exit(failures.length ? 1 : 0);
