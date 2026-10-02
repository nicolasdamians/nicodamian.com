import { site } from '../src/data/site';
import { expect, test } from './fixtures';

test.describe('404 page', () => {
  test('is served for unknown paths', async ({ request }) => {
    const response = await request.get('/no-such-page');
    expect(response.status()).toBe(404);
    expect(await response.text()).toContain('No such file or directory');
  });

  test('renders', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('No such file or directory');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await page.getByRole('link', { name: 'cd ~' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('#hero-title')).toBeVisible();
  });

  for (const { id } of site.nav) {
    test(`navigation leads back to #${id}`, async ({ page }) => {
      await page.goto('/404.html');
      await page.locator(`[data-nav-link][href$="#${id}"]`).click();
      await expect(page).toHaveURL(new RegExp(`/#${id}$`));
      await expect(page.locator(`section#${id}`)).toBeInViewport();
    });
  }
});
