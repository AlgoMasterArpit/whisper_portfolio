import { expect, test, type Page } from '@playwright/test';
import { SCENES } from '../src/data/story';

const errorsOn = (page: Page) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  return errors;
};

test('loads with the headline and no errors', async ({ page }) => {
  const errors = errorsOn(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Don’t trust my resume.');
  await expect(page.locator('.hero__receipt')).toContainText('CGPA 8.94');
  expect(errors.filter((e) => !e.includes('/api/ask'))).toEqual([]);
});

test('prints a stamped answer for a suggested question', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'How much have you spent on Meta ads?' }).click();
  const answer = page.locator('.answer').first();
  await expect(answer).toContainText('Q: How much have you spent on Meta ads?');
  await expect(answer.locator('.stamp')).toHaveText('No receipt');
});

test('answers a typed question with receipts', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Your question').fill('What is NOVA?');
  await page.getByRole('button', { name: 'Print' }).click();
  const answer = page.locator('.answer').first();
  await expect(answer.locator('.stamp')).toHaveText('Verified');
  await expect(answer.getByRole('link', { name: /N\.O\.V\.A repo/ })).toHaveAttribute('href', /github\.com\/AlgoMasterArpit\/N\.O\.V\.A/);
});

test('raw mode shows the spoken takes behind each section', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.raw-strip')).toHaveCount(0);
  await page.getByRole('button', { name: /shipped/i }).click();
  await expect(page.locator('.raw-strip').first()).toContainText('hello everyone');
});

test('the museum walk ends with a score', async ({ page }) => {
  await page.goto('/#museum');
  const museum = page.locator('#museum');
  for (let i = 0; i < SCENES.length; i++) {
    await museum.locator('.option').first().click();
    await museum.getByRole('button', { name: /next exhibit|see how you did/i }).click();
  }
  await expect(museum.getByRole('heading', { level: 3 })).toContainText('calls the way I did');
});

test('spot the fake reveals the claim without a receipt', async ({ page }) => {
  await page.goto('/#game');
  await page.getByRole('button', { name: /Meta ads for Electrothon/ }).click();
  await expect(page.getByText('Caught it.')).toBeVisible();
});

test('never scrolls sideways', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /shipped/i }).click();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('respects reduced motion', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await context.close();
});

test('skip link is the first thing keyboard users reach', async ({ page, isMobile }) => {
  test.skip(isMobile, 'no tab key on phones');
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to the twin' })).toBeFocused();
});
