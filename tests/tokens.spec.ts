import { test, expect } from '@playwright/test';

test.describe('Foundations & Tokens', () => {
  test('Asserts key computed styles and tokens against audit data', async ({ page }) => {
    await page.goto('/');

    const bodyBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    // Supports either legacy or Nitaara palette (#22211f = rgb(34, 33, 31))
    expect(['rgb(7, 11, 20)', 'rgb(34, 33, 31)']).toContain(bodyBg);

    const bodyColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).color;
    });
    expect(['rgb(244, 239, 230)', 'rgb(255, 255, 255)']).toContain(bodyColor);

    const wordmarkFont = await page.evaluate(() => {
      const el = document.querySelector('.word');
      return el ? window.getComputedStyle(el).fontFamily : '';
    });
    expect(wordmarkFont.toLowerCase()).toMatch(/cormorant garamond|cinzel|tw cen mt|twcenmt|roboto/);

    const ctaBg = await page.evaluate(() => {
      const el = document.querySelector('.nav .cta');
      return el ? window.getComputedStyle(el).backgroundColor : '';
    });
    expect(['rgb(244, 239, 230)', 'rgb(197, 155, 60)', 'rgb(255, 255, 255)']).toContain(ctaBg);
  });
});
