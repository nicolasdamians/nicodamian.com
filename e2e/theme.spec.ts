import { expect, test } from './fixtures';

test.describe('theme', () => {
  test('is dark by default', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('[data-theme-toggle]')).toHaveAttribute('aria-pressed', 'false');
  });

  test('follows prefers-color-scheme: light', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('[data-theme-toggle]')).toHaveAttribute('aria-pressed', 'true');
  });

  test('the choice persists after a reload', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.locator('[data-theme-toggle]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await page.locator('[data-theme-toggle]').click();
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('data-theme is set before first paint', async ({ page }) => {
    // Without the deferred module script, only the blocking script in <head> can have set the theme.
    await page.route('**/_astro/*.js', (route) => route.fulfill({ contentType: 'text/javascript', body: '' }));
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    const script = page.locator('head > script[src="/theme-init.js"]');
    await expect(script).toHaveCount(1);
    const blocking = await script.evaluate((el: HTMLScriptElement) => {
      const firstStylesheet = document.querySelector('link[rel="stylesheet"]');
      const beforeStyles =
        !firstStylesheet || Boolean(el.compareDocumentPosition(firstStylesheet) & Node.DOCUMENT_POSITION_FOLLOWING);
      return !el.async && !el.defer && el.type !== 'module' && beforeStyles;
    });
    expect(blocking).toBe(true);
  });
});
