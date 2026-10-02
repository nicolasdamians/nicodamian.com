import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa'];

for (const theme of ['dark', 'light'] as const) {
  for (const width of [360, 1280]) {
    for (const path of ['/', '/404.html']) {
      test(`axe: ${path} ${theme} at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        // Reduced motion shows every block at once, so axe checks the contrast of all of them.
        await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
        await page.goto(path);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
        const summary = results.violations.map(
          (violation) => `${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`,
        );
        expect(summary).toEqual([]);
      });
    }
  }
}
