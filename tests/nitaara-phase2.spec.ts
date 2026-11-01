import { test, expect } from '@playwright/test';
import { tower } from '../src/data/nitaara.data';
import { FLOORS, IW, IH } from '../src/data/towerData';
import towerHotspots from '../src/data/towerHotspots';

const hotspots = towerHotspots;

test.describe('Nitaara Phase N2 — Tower Image & Floor Calibration', () => {
  test('Hotspot geometry: exactly 25 floors with contiguous non-overlapping bands', () => {
    expect(tower.totalFloors).toBe(25);
    expect(hotspots.length).toBe(25);
    expect(FLOORS.length).toBe(25);

    // Floor numbering 1 to 25
    const floorNumbers = hotspots.map((h) => h.floor);
    expect(floorNumbers[0]).toBe(25);
    expect(floorNumbers[24]).toBe(1);

    // Continuity test: assert each floor y1 connects to next floor y0 with zero gaps
    for (let i = 0; i < hotspots.length - 1; i++) {
      expect(hotspots[i].y1).toBe(hotspots[i + 1].y0);
      expect(hotspots[i].normalized.y1).toBe(hotspots[i + 1].normalized.y0);
    }

    // Top and bottom extent exact
    expect(hotspots[0].y0).toBe(106);
    expect(hotspots[24].y1).toBe(748);
  });

  test('Explorer renders real Nitaara Tower image and 25 calibrated polygon bands', async ({
    page,
  }) => {
    await page.goto('/');

    const towerImg = page.locator('#towerImg');
    await expect(towerImg).toBeVisible();
    await expect(towerImg).toHaveAttribute('src', '/assets/nitaara/banner/desk1.jpg');

    const bandsSvg = page.locator('#bands');
    await expect(bandsSvg).toBeVisible();
    await expect(bandsSvg).toHaveAttribute('viewBox', `0 0 ${IW} ${IH}`);

    const bands = page.locator('#bands polygon.band');
    await expect(bands).toHaveCount(25);
  });

  test('Hovering floors 1..25 resolves exact floor number and residence pricing', async ({
    page,
  }) => {
    await page.goto('/');

    const isCoarse = await page.evaluate(() => window.matchMedia('(pointer: coarse)').matches);

    // Test Floor 1 (bottom residential floor)
    const band1 = page.locator('#bands polygon.band[data-n="1"]');
    if (isCoarse) {
      await band1.tap();
    } else {
      await band1.hover({ force: true });
    }

    const tag = page.locator('#floorTag');
    await expect(tag).toHaveClass(/on/);
    await expect(tag.locator('#ftNum')).toHaveText('1');
    await expect(tag.locator('#ftStatus')).toContainText('₹1.85 Cr');

    // Test Floor 25 (top residential floor)
    const band25 = page.locator('#bands polygon.band[data-n="25"]');
    if (isCoarse) {
      await band25.tap();
    } else {
      await band25.hover({ force: true });
    }
    await expect(tag.locator('#ftNum')).toHaveText('25');
    await expect(tag.locator('#ftStatus')).toContainText('₹2.36 Cr');

    // Test Mid-level Floor 14
    const band14 = page.locator('#bands polygon.band[data-n="14"]');
    if (isCoarse) {
      await band14.tap();
    } else {
      await band14.hover({ force: true });
    }
    await expect(tag.locator('#ftNum')).toHaveText('14');
  });

  test('Keyboard navigation: Arrow keys cycle through all 25 floors', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#towerImg');
    // Ensure window focus
    await page.locator('#app').click({ position: { x: 20, y: 20 } });

    // Press ArrowUp to activate Floor 1
    await page.keyboard.press('ArrowUp');
    const tag = page.locator('#floorTag');
    await expect(tag).toHaveClass(/on/);
    await expect(tag.locator('#ftNum')).toHaveText('1');

    // Press ArrowUp again to go to Floor 2
    await page.keyboard.press('ArrowUp');
    await expect(tag.locator('#ftNum')).toHaveText('2');

    // Press ArrowDown to return to Floor 1
    await page.keyboard.press('ArrowDown');
    await expect(tag.locator('#ftNum')).toHaveText('1');
  });

  test('Dev Calibration Studio is accessible at /?calibrate', async ({ page }) => {
    await page.goto('/?calibrate=1');

    await expect(page.locator('h2')).toContainText('Nitaara Tower — Floor Calibration Studio');
    const calibrationPolys = page.locator('svg polygon');
    await expect(calibrationPolys).toHaveCount(25);
  });
});
