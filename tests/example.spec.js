import { test, expect } from '@playwright/test';

test('Home page test', async ({ page }) => {
  await page.goto('https://rokomari.com/');
  await expect(page).toHaveTitle("Rokomari.com - Online Book, Electronics & Super Shop in Bangladesh");
});
