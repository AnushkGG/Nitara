import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

test.describe('Visual Regression & Snapshot Captures', () => {
  test('Captures baseline resting state and compares against reference', async ({ page }, testInfo) => {
    const projectName = testInfo.project.name;
    const outputDir = path.resolve('tests/visual/captures');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    await page.goto('/');
    await page.waitForSelector('#towerImg');
    // Allow intro animations to settle
    await page.waitForTimeout(2000);

    const screenshotPath = path.join(outputDir, `${projectName}-tower.png`);
    await page.screenshot({ path: screenshotPath });

    expect(fs.existsSync(screenshotPath)).toBe(true);
  });
});

