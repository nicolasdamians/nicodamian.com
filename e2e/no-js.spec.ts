import { site } from '../src/data/site';
import { expect, test } from './fixtures';

// Runs in the "no-js" project, where JavaScript is disabled.
test.describe('without JavaScript', () => {
  test('the email stays readable', async ({ page }) => {
    await page.goto('/');
    const holder = page.locator('[data-mail]');
    await expect(holder.locator('a')).toHaveCount(0);
    const user = (await holder.getAttribute('data-u')) ?? '';
    expect(user).not.toBe('');
    await expect(holder).toBeVisible();
    await expect(holder).toContainText(`${user} [at] `);
    await expect(holder).toContainText(' [dot] ');
  });

  test('the markup ships dark, whatever the system prefers', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('all content is visible', async ({ page }) => {
    await page.goto('/');
    const blocks = page.locator('main :is(section, .reveal, h1, h2, h3, h4, p, li, dd)');
    expect(await page.locator('.reveal').count()).toBeGreaterThan(0);
    for (const block of await blocks.all()) {
      const classes = (await block.getAttribute('class')) ?? '';
      if (classes.includes('sr-only')) continue;
      await expect(block).toBeVisible();
      await expect(block).toHaveCSS('opacity', '1');
    }
    for (const { id } of site.nav) await expect(page.locator(`#${id}-title`)).toBeVisible();
  });
});
