import { VIEWPORTS, expect, test } from './fixtures';

test('loads without console errors, CSP violations or third-party requests', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('h1')).toBeVisible();
  // Scroll through the page so lazy content and observers get a chance to misbehave.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator('#contact')).toBeInViewport();
});

for (const viewport of VIEWPORTS) {
  test(`no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const path of ['/', '/404.html']) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${path} overflows`).toBeLessThanOrEqual(0);
    }
  });
}

for (const path of ['/', '/404.html']) {
  test(`every external link on ${path} opts out of opener and referrer`, async ({ page, baseURL }) => {
    await page.goto(path);
    const links = await page
      .locator('a[href]')
      .evaluateAll((anchors) =>
        anchors.map((a) => ({ href: (a as HTMLAnchorElement).href, rel: a.getAttribute('rel') })),
      );
    const external = links.filter((link) => /^https?:/.test(link.href) && !link.href.startsWith(`${baseURL}/`));
    expect(external.length).toBeGreaterThan(0);
    for (const link of external) {
      const rel = (link.rel ?? '').split(/\s+/);
      expect(rel, link.href).toEqual(expect.arrayContaining(['noopener', 'noreferrer']));
    }
  });
}

test('email is assembled into a mailto link', async ({ page }) => {
  await page.goto('/');
  const holder = page.locator('[data-mail]');
  const user = await holder.getAttribute('data-u');
  const domain = await holder.getAttribute('data-d');
  expect(user).toBeTruthy();
  expect(domain).toBeTruthy();
  const address = [user, domain].join('@');
  const link = holder.locator('a');
  await expect(link).toHaveAttribute('href', `mailto:${address}`);
  await expect(link).toHaveText(address);
});
