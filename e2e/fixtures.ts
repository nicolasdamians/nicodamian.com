import { expect, test as base } from '@playwright/test';

declare global {
  interface Window {
    cspViolations?: string[];
  }
}

/**
 * Every test gets a page that is watched for console errors, uncaught exceptions, CSP violations and
 * requests to any other origin. The test fails at teardown if one was seen.
 */
export const test = base.extend<{ watch: undefined }>({
  watch: [
    async ({ page, baseURL }, use) => {
      const issues: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') issues.push(`console: ${message.text()}`);
      });
      page.on('pageerror', (error) => issues.push(`exception: ${error.message}`));
      page.on('request', (request) => {
        if (!request.url().startsWith(`${baseURL}/`)) issues.push(`other origin: ${request.url()}`);
      });
      await page.addInitScript(() => {
        window.cspViolations = [];
        document.addEventListener('securitypolicyviolation', (event) => {
          window.cspViolations?.push(`${event.violatedDirective} ${event.blockedURI}`);
        });
      });
      await use(undefined);
      // With JavaScript disabled the init script never runs; the console listener still reports violations.
      const violations = await page.evaluate(() => window.cspViolations ?? []).catch(() => []);
      expect([...issues, ...violations.map((violation) => `csp: ${violation}`)]).toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export const VIEWPORTS = [
  { width: 360, height: 780 },
  { width: 768, height: 1024 },
  { width: 1280, height: 900 },
] as const;
