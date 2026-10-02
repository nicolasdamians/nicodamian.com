// Builds must exist. Takes screenshots and fails on console errors, CSP violations, third-party requests or overflow.
import { chromium } from '@playwright/test';
import { preview } from 'astro';
const out = process.argv[2] ?? 'test-results';
const origin = 'http://localhost:4391';
const server = await preview({ logLevel: 'silent', server: { port: 4391 } });
const browser = await chromium.launch();
const issues = [];
const shots = [
  ['desktop-dark', 1280, 900, 'dark', true],
  ['desktop-dark-top', 1280, 900, 'dark', false],
  ['desktop-light-top', 1280, 900, 'light', false],
  ['mobile-dark-top', 360, 780, 'dark', false],
  ['mobile-dark', 360, 780, 'dark', true],
];
for (const [name, width, height, theme, full] of shots) {
  const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: theme, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('console', (m) => m.type() === 'error' && issues.push(`${name}: ${m.text()}`));
  page.on('pageerror', (e) => issues.push(`${name}: ${e.message}`));
  page.on('request', (r) => { if (!r.url().startsWith(origin)) issues.push(`${name}: third-party ${r.url()}`); });
  await page.goto(`${origin}/`, { waitUntil: 'networkidle' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) issues.push(`${name}: horizontal overflow ${overflow}px`);
  if (name === 'desktop-dark-top') {
    await page.fill('#term-input', 'help');
    await page.keyboard.press('Enter');
    await page.fill('#term-input', 'cat certs.txt');
    await page.keyboard.press('Enter');
    const text = await page.locator('[data-terminal-output]').innerText();
    if (!text.includes('OSCP+') || !text.includes('navigation')) issues.push('terminal: commands did not print expected output');
    const mail = await page.locator('[data-mail] a').getAttribute('href');
    if (!(await page.locator('#contact').innerText()).includes('print(email)')) issues.push('contact: info.py block missing');
    if (!mail?.startsWith('mailto:')) issues.push('contact: email link not assembled');
  }
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: full });
  await ctx.close();
}
await browser.close();
await server.stop();
console.log(issues.length ? issues.join('\n') : 'ok: no console errors, no CSP violations, no third-party requests, no overflow, terminal and email work');
process.exit(issues.length ? 1 : 0);
