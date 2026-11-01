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
    await expect(page).toHaveTitle(/Nitaara Tower/);

    // Check header brand - logo image for Nitaara Tower
    const brand = page.locator('.brand');
    await expect(brand).toBeVisible();
    const logoImg = brand.locator('img[alt="Nitaara Tower"]');
    await expect(logoImg).toBeVisible();

    // Check navigation
    const nav = page.locator('nav.nav');
    await expect(nav).toBeVisible();
    await expect(nav.locator('.cta')).toHaveText('Request Site Visit');
    await expect(nav).toContainText('Overview');
    await expect(nav).toContainText('Amenities');
    await expect(nav).toContainText('Floor Plans');

    // Check tower image and svg bands
    const towerImg = page.locator('#towerImg');
    await expect(towerImg).toBeVisible();

    const bands = page.locator('#bands .band');
    await expect(bands).toHaveCount(25);

    // Check disclaimer with MahaRERA
    const disclaimer = page.locator('.disclaimer');
    await expect(disclaimer).toContainText('MahaRERA');
    await expect(disclaimer).toContainText('P52100050692');

    // Check landing sections exist
    await expect(page.locator('#highlights')).toBeAttached();
    await expect(page.locator('#about')).toBeAttached();
    await expect(page.locator('#configurations')).toBeAttached();
    await expect(page.locator('#floorplans')).toBeAttached();
    await expect(page.locator('#amenities')).toBeAttached();
    await expect(page.locator('#location')).toBeAttached();

    // Check footer
    const footer = page.locator('.nitaara-footer');
    await expect(footer).toBeAttached();

    // Verify no unexpected console errors
    expect(consoleErrors).toEqual([]);
  });
});
