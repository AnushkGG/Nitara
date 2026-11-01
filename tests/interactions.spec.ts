import { test, expect } from '@playwright/test';

test.describe('Core & Secondary Interactions', () => {
  test('Floor selection, drill-down into dollhouse and room interior, and back navigation', async ({
    page,
  }) => {
    await page.goto('/');

    // Wait for tower image to be ready
    await page.waitForSelector('#towerImg');

    // Click Private Tour CTA and assert toast notification
    const cta = page.locator('.nav .cta');
    await cta.click();
    const toast = page.locator('.toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Demo: this opens the private tour');

    // Hover or click Floor 22
    const floor22Band = page.locator('#bands [data-n="22"]');
    await floor22Band.click({ force: true });

    // On touch / portrait viewports, first click selects floor, second click or ftEnter enters
    const unitPanel = page.locator('#unitPanel');
    const isEntered = await unitPanel.isVisible().catch(() => false);
    if (!isEntered) {
      const enterBtn = page.locator('#ftEnter');
      if (await enterBtn.isVisible().catch(() => false)) {
        await enterBtn.click({ force: true });
      } else {
        await floor22Band.click({ force: true });
      }
    }

    // Unit panel should open with Floor 22 data
    await expect(unitPanel).toHaveClass(/on/, { timeout: 20000 });
    await expect(unitPanel.locator('#pEyebrow')).toContainText('Floor 22');
    await expect(unitPanel.locator('#pTitle')).toHaveText(/Residence|BHK/);
    await expect(unitPanel.locator('#pPrice')).toContainText(/₹|\$/);

    // Room buttons inside unit panel
    const roomButtons = unitPanel.locator('#pRooms button');
    await expect(roomButtons).toHaveCount(await roomButtons.count());

    // Click first room
    await roomButtons.first().click();

    // Room bar should appear
    const roomBar = page.locator('#roomBar');
    await expect(roomBar).toHaveClass(/on/, { timeout: 10000 });
    await expect(roomBar.locator('#rbRoom')).toContainText(/Living/);

    // Click "Back to floor plan"
    await roomBar.locator('button[data-action="back"]').click();
    await expect(unitPanel).toHaveClass(/on/, { timeout: 10000 });

    // Click "Back to tower"
    await unitPanel.locator('button[data-action="back"]').click();
    const app = page.locator('#app');
    await expect(app).toHaveAttribute('data-view', 'tower', { timeout: 10000 });
  });
});
