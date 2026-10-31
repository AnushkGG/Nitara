import { test, expect } from '@playwright/test';

test.describe('Responsive & Viewport Matrix', () => {
  test('Zero horizontal overflow across all viewports', async ({ page }) => {
    await page.goto('/');

    const hasHorizontalOverflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth > document.documentElement.clientWidth ||
        document.body.scrollWidth > document.body.clientWidth
      );
    });

    expect(hasHorizontalOverflow).toBe(false);
  });
});

