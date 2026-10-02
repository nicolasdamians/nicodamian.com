import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const run = async (page: Page, command: string) => {
  await page.locator('#term-input').fill(command);
  await page.keyboard.press('Enter');
};

test.describe('hero terminal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('help lists the commands', async ({ page }) => {
    await run(page, 'help');
    const output = page.locator('[data-terminal-output]');
    await expect(output).toContainText('navigation');
    await expect(output).toContainText('cd <section>');
  });

  test('ls lists sections and files', async ({ page }) => {
    await run(page, 'ls');
    const output = page.locator('[data-terminal-output]');
    await expect(output).toContainText('projects/');
    await expect(output).toContainText('certs.txt');
  });

  test('cd projects moves focus to the section', async ({ page }) => {
    await run(page, 'cd projects');
    await expect(page.locator('#projects')).toBeFocused();
    await expect(page.locator('#projects')).toBeInViewport();
  });

  test('cat certs.txt prints the certifications', async ({ page }) => {
    await run(page, 'cat certs.txt');
    await expect(page.locator('[data-terminal-output]')).toContainText('OSCP+');
  });

  test('an unknown command says so', async ({ page }) => {
    await run(page, 'frobnicate');
    await expect(page.locator('[data-terminal-output]')).toContainText('frobnicate: command not found');
  });

  test('cat constructor does not throw', async ({ page }) => {
    await run(page, 'cat constructor');
    await expect(page.locator('[data-terminal-output]')).toContainText('cat: constructor: No such file');
    await run(page, 'cat __proto__');
    await expect(page.locator('[data-terminal-output]')).toContainText('cat: __proto__: No such file');
  });

  test('ArrowUp walks the history', async ({ page }) => {
    await run(page, 'pwd');
    await run(page, 'whoami');
    const input = page.locator('#term-input');
    await input.press('ArrowUp');
    await expect(input).toHaveValue('whoami');
    await input.press('ArrowUp');
    await expect(input).toHaveValue('pwd');
    await input.press('ArrowDown');
    await expect(input).toHaveValue('whoami');
  });
});
