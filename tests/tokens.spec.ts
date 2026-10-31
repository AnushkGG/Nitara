import { test, expect } from '@playwright/test';

test.describe('Foundations & Tokens', () => {
  test('Asserts key computed styles and tokens against audit data', async ({ page }) => {
    await page.goto('/');

    const bodyBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    // #070b14 is rgb(7, 11, 20)
    expect(bodyBg).toBe('rgb(7, 11, 20)');

    const bodyColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).color;
    });
    // #f4efe6 is rgb(244, 239, 230)
    expect(bodyColor).toBe('rgb(244, 239, 230)');

    const wordmarkFont = await page.evaluate(() => {
      const el = document.querySelector('.word');
      return el ? window.getComputedStyle(el).fontFamily : '';
    });
    expect(wordmarkFont.toLowerCase()).toContain('cormorant garamond');

    const ctaBg = await page.evaluate(() => {
      const el = document.querySelector('.nav .cta');
      return el ? window.getComputedStyle(el).backgroundColor : '';
    });
    expect(ctaBg).toBe('rgb(244, 239, 230)');
  });
});

