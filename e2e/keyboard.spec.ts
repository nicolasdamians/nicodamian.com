import { expect, test } from './fixtures';

test.describe('keyboard', () => {
  test('the skip link is the first focus stop and works', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
    // The next focus stop is inside the main content, not back in the status line.
    await page.keyboard.press('Tab');
    const insideMain = await page.evaluate(() => document.activeElement?.closest('main')?.id === 'main');
    expect(insideMain).toBe(true);
  });

  test('focus is visible', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const outlines = [];
    for (let stop = 0; stop < 8; stop += 1) {
      await page.keyboard.press('Tab');
      outlines.push(
        await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          const style = getComputedStyle(el);
          return { tag: el.tagName, style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
        }),
      );
    }
    for (const outline of outlines) {
      expect(outline).not.toBeNull();
      expect(outline?.style, outline?.tag).not.toBe('none');
      expect(outline?.width, outline?.tag).toBeGreaterThanOrEqual(2);
    }
  });

  test('the terminal prompt shows focus on its wrapper', async ({ page }) => {
    await page.goto('/');
    await page.locator('#term-input').focus();
    const outline = await page.locator('[data-terminal-form]').evaluate((el) => {
      const style = getComputedStyle(el);
      return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
    });
    expect(outline.style).not.toBe('none');
    expect(outline.width).toBeGreaterThanOrEqual(2);
  });
});
