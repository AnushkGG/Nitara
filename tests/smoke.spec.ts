import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('Page loads cleanly with title, header, and tower layers', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // Check document title
    await expect(page).toHaveTitle(/Nitaara Tower|The Solenne/);

    // Check header brand
    const brand = page.locator('.brand');
    await expect(brand).toBeVisible();
    await expect(brand.locator('.mark')).toHaveText('S');
    await expect(brand.locator('.word')).toHaveText('THE SOLENNE');
    await expect(brand.locator('.sub')).toHaveText('Brickell Bay · Miami');

    // Check navigation
    const nav = page.locator('nav.nav');
    await expect(nav).toBeVisible();
    await expect(nav.locator('.cta')).toHaveText('Private Tour');

    // Check tower image and svg bands
    const towerImg = page.locator('#towerImg');
    await expect(towerImg).toBeVisible();

    const bands = page.locator('#bands rect.band');
    await expect(bands).toHaveCount(30);

    // Check disclaimer
    const disclaimer = page.locator('.disclaimer');
    await expect(disclaimer).toContainText('Concept demo by Lynam Up Media');

    // Verify no console errors
    expect(consoleErrors).toEqual([]);
  });
});

