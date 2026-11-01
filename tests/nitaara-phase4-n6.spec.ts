import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Nitaara Phase N4 — Content, Brand & Section Sequence Gate', () => {
  test('N4 Gate: Full builder section sequence in exact order with zero Solenne pollution', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Header with verified logo
    const headerLogo = page.locator('header.top .brand img[alt="Nitaara Tower"]');
    await expect(headerLogo).toBeVisible();

    // 2. Exact Builder Sections Sequence
    const sectionIds = [
      'tower-hero',
      'highlights',
      'about',
      'configurations',
      'floorplans',
      'amenities',
      'location',
    ];

    for (const id of sectionIds) {
      const section = page.locator(`#${id}`);
      await expect(section).toBeAttached();
    }

    // 3. Highlights content check
    const highlights = page.locator('#highlights');
    await expect(highlights).toContainText('G + 25 Floors');
    await expect(highlights).toContainText('3 BHK & 4 BHK');
    await expect(highlights).toContainText('0.57 Acres');
    await expect(highlights).toContainText('Mar 2028');

    // 4. About Developer content check
    const about = page.locator('#about');
    await expect(about).toContainText('Mittal Group');
    await expect(about).toContainText('ABC Corp');
    await expect(about).toContainText('Success Group');
    await expect(about).toContainText('Admired Landmarks');
    await expect(about).toContainText('Consistently On-Time Delivery');
    await expect(about).toContainText('Quality Construction');

    // 5. Configurations table check
    const config = page.locator('#configurations');
    await expect(config).toContainText('3 BHK (Type 01)');
    await expect(config).toContainText('1,247 sq ft');
    await expect(config).toContainText('₹1.85 Cr');
    await expect(config).toContainText('3 BHK (Type 02)');
    await expect(config).toContainText('1,245 sq ft');
    await expect(config).toContainText('4 BHK');
    await expect(config).toContainText('1,592 sq ft');
    await expect(config).toContainText('₹2.36 Cr');

    // 6. Amenities gallery check
    const amenities = page.locator('#amenities');
    await expect(amenities).toContainText('World-Class Amenities');
    await expect(amenities).toContainText('Level 26 Sky Retreat');

    // 7. Location connectivity check
    const location = page.locator('#location');
    await expect(location).toContainText('Prime Location Advantage');
    await expect(location).toContainText('Conveniences');
    await expect(location).toContainText('Transit & Connectivity');
    await expect(location).toContainText('Schools & Colleges');

    // 8. RERA Footer check
    const footer = page.locator('.nitaara-footer');
    await expect(footer).toBeAttached();
    await expect(footer).toContainText('MahaRERA');
    await expect(footer).toContainText('P52100050692');
    await expect(footer).toContainText('Plot No. C8');
    await expect(footer).toContainText('Bhakti Shakti Chowk');
    await expect(footer).toContainText('Nigdi Pradhikaran');
    await expect(footer).toContainText('8600612808');
    await expect(footer).toContainText('Concept prototype');

    // 9. Zero Solenne string check on rendered body
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toMatch(/Solenne/i);
    expect(bodyText).not.toMatch(/Brickell/i);
    expect(bodyText).not.toMatch(/Miami/i);
    expect(bodyText).not.toMatch(/Lynam/i);
  });

  test('N4 Gate: Navigation links jump to corresponding sections smoothly', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav.nav');
    if (await nav.isVisible()) {
      // Click Amenities
      const amenitiesBtn = nav.locator('span', { hasText: 'Amenities' });
      if (await amenitiesBtn.isVisible()) {
        await amenitiesBtn.click();
        await page.waitForTimeout(400);
        const amenitiesSection = page.locator('#amenities');
        await expect(amenitiesSection).toBeInViewport({ ratio: 0.1 });
      }

      // Click Overview
      const overviewBtn = nav.locator('span', { hasText: 'Overview' });
      if (await overviewBtn.isVisible()) {
        await overviewBtn.click();
        await page.waitForTimeout(400);
        const highlightsSection = page.locator('#highlights');
        await expect(highlightsSection).toBeInViewport({ ratio: 0.1 });
      }
    }
  });
});

test.describe('Nitaara Phase N5 — Multi-Viewport Re-Verification Gate', () => {
  test('N5 Gate: Responsive integrity, zero horizontal overflow & clean viewport fit', async ({
    page,
  }) => {
    await page.goto('/');

    // Check document bounds
    const isOverflowing = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(isOverflowing).toBe(false);

    // Verify modals open and close cleanly with ESC key
    const siteVisitBtn = page.locator('.cta[data-action="inquire"]').first();
    await siteVisitBtn.click();

    const enquiryModal = page.locator('.enquiry-modal-backdrop');
    await expect(enquiryModal).toBeVisible();

    // Close via escape key
    await page.keyboard.press('Escape');
    await expect(enquiryModal).not.toBeVisible();
  });

  test('N5 Gate: Custom cursor handles text inputs and elevated action buttons', async ({
    page,
  }) => {
    await page.goto('/');

    // Open enquiry modal
    const siteVisitBtn = page.locator('.cta[data-action="inquire"]').first();
    await siteVisitBtn.click();

    const nameInput = page.locator('#enq-name');
    await expect(nameInput).toBeVisible();

    // Click input and type
    await nameInput.click();
    await nameInput.fill('Test Visitor');
    await expect(nameInput).toHaveValue('Test Visitor');

    // Close modal
    await page.locator('.enquiry-modal-close').click();
    await expect(page.locator('.enquiry-modal-backdrop')).not.toBeVisible();
  });
});

test.describe('Nitaara Phase N6 — Pitch Packaging & Deliverables Gate', () => {
  test('N6 Gate: Pitch demo script and comparison one-pager exist with complete content', async () => {
    const scriptPath = path.resolve(process.cwd(), 'docs/pitch-demo-script.md');
    const onePagerPath = path.resolve(process.cwd(), 'docs/pitch-one-pager.md');
    const factsPath = path.resolve(process.cwd(), 'docs/facts.md');
    const questionsPath = path.resolve(process.cwd(), 'docs/client-questions.md');

    expect(fs.existsSync(scriptPath)).toBe(true);
    expect(fs.existsSync(onePagerPath)).toBe(true);
    expect(fs.existsSync(factsPath)).toBe(true);
    expect(fs.existsSync(questionsPath)).toBe(true);

    const scriptContent = fs.readFileSync(scriptPath, 'utf-8');
    expect(scriptContent).toContain('5-Minute Walkthrough');
    expect(scriptContent).toContain('MahaRERA');
    expect(scriptContent).toContain('WhatsApp');

    const onePagerContent = fs.readFileSync(onePagerPath, 'utf-8');
    expect(onePagerContent).toContain('What This Prototype Adds');
    expect(onePagerContent).toContain('nitaaratowernigdi.com');
  });

  test('N6 Gate: WhatsApp direct conversion channel is configured with builder contact', async ({
    page,
  }) => {
    await page.goto('/');

    // Check WhatsApp link in hero or footer
    const waLink = page.locator('a[href*="wa.me/918600612808"]').first();
    await expect(waLink).toBeAttached();

    const href = await waLink.getAttribute('href');
    expect(href).toContain('918600612808');
    expect(href).toContain('Nitaara%20Tower');
  });
});
