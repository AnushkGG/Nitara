import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { unitTypes, images } from '../src/data/nitaara.data';
import { getFloorUnits } from '../src/data/towerData';

test.describe('Nitaara Phase N3 — Floor Plans & Unit Model', () => {
  test('N3 Gate: All unit types map to verified CAD plan images with exact builder specifications', async () => {
    // 1. Verify unitTypes array has exactly 3 residential unit types
    expect(unitTypes).toHaveLength(3);

    const type01 = unitTypes.find((u) => u.id === '3bhk-type-01');
    const type02 = unitTypes.find((u) => u.id === '3bhk-type-02');
    const type03 = unitTypes.find((u) => u.id === '4bhk-type-01');

    expect(type01).toBeDefined();
    expect(type02).toBeDefined();
    expect(type03).toBeDefined();

    // 2. Assert exact areas from builder's schedule
    // Flat X01 (3 BHK Type 01): Carpet 1,058 + Balcony 189 = 1,247 sq ft
    expect(type01!.reraCarpetSqFt).toBe(1058);
    expect(type01!.balconySqFt).toBe(189);
    expect(type01!.totalSqFt).toBe(1247);
    expect(type01!.priceLabel).toBe('₹1.85 Cr');
    expect(type01!.priceNote).toBe('All inclusive');
    expect(type01!.floorPlanSrc).toBe('/assets/nitaara/floorplan/floor-plan1.jpg');
    expect(type01!.formedTerraceFirstFloorSqFt).toBe(1519);

    // Flat X02 (3 BHK Type 02): Carpet 1,050 + Balcony 195 = 1,245 sq ft
    expect(type02!.reraCarpetSqFt).toBe(1050);
    expect(type02!.balconySqFt).toBe(195);
    expect(type02!.totalSqFt).toBe(1245);
    expect(type02!.priceLabel).toBe('₹1.85 Cr');
    expect(type02!.priceNote).toBe('All inclusive');
    expect(type02!.floorPlanSrc).toBe('/assets/nitaara/floorplan/floor-plan2.jpg');
    expect(type02!.formedTerraceFirstFloorSqFt).toBe(126);

    // Flat X03 (4 BHK): Carpet 1,380 + Balcony 212 = 1,592 sq ft
    expect(type03!.reraCarpetSqFt).toBe(1380);
    expect(type03!.balconySqFt).toBe(212);
    expect(type03!.totalSqFt).toBe(1592);
    expect(type03!.priceLabel).toBe('₹2.36 Cr');
    expect(type03!.priceNote).toBe('All inclusive');
    expect(type03!.floorPlanSrc).toBe('/assets/nitaara/floorplan/floor-plan3.jpg');
    expect(type03!.formedTerraceFirstFloorSqFt).toBe(1100);

    // 3. Verify all plan files exist on disk
    const planPaths = [
      type01!.floorPlanSrc,
      type02!.floorPlanSrc,
      type03!.floorPlanSrc,
      images.masterPlan,
    ];

    for (const p of planPaths) {
      const filePath = path.join('public', p.replace(/^\//, ''));
      expect(fs.existsSync(filePath), `Plan file ${filePath} must exist`).toBe(true);
      const stat = fs.statSync(filePath);
      expect(stat.size).toBeGreaterThan(10000);
    }
  });

  test('Level 2 Floor View: Displays 3 units per floor with all-inclusive pricing and terrace callouts', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForSelector('#towerImg');

    // Click on Floor 12
    const floor12Band = page.locator('#bands [data-n="12"]');
    await floor12Band.click({ force: true });

    // Handle touch/portrait toggle if necessary
    const unitPanel = page.locator('#unitPanel');
    const isEntered = await unitPanel.isVisible().catch(() => false);
    if (!isEntered) {
      const enterBtn = page.locator('#ftEnter');
      if (await enterBtn.isVisible().catch(() => false)) {
        await enterBtn.click({ force: true });
      } else {
        await floor12Band.click({ force: true });
      }
    }

    await expect(unitPanel).toHaveClass(/on/, { timeout: 15000 });
    await expect(unitPanel.locator('#pEyebrow')).toContainText('Floor 12');
    await expect(unitPanel.locator('#pTitle')).toContainText('3 & 4 BHK');

    // Assert 3 unit selector tabs exist for Floor 12 (Flat 1201, 1202, 1203)
    const unitTabs = unitPanel.locator('.p-unit-tabs button');
    await expect(unitTabs).toHaveCount(3);
    await expect(unitTabs.nth(0)).toContainText('Flat 1201 (3 BHK)');
    await expect(unitTabs.nth(1)).toContainText('Flat 1202 (3 BHK)');
    await expect(unitTabs.nth(2)).toContainText('Flat 1203 (4 BHK)');

    // Price must show all-inclusive without fabricated floor rise
    await expect(unitPanel.locator('#pPrice')).toHaveText('₹1.85 Cr');
    await expect(unitPanel.locator('.p-price')).toContainText('All inclusive');

    // Switch to 4 BHK (Flat 1203) and verify price updates to ₹2.36 Cr
    await unitTabs.nth(2).click();
    await expect(unitPanel.locator('#pPrice')).toHaveText('₹2.36 Cr');
    await expect(unitPanel.locator('#pSpecs strong').first()).toHaveText('4');

    // Return to tower
    await unitPanel.locator('button[data-action="back"]').click();
    await expect(page.locator('#app')).toHaveAttribute('data-view', 'tower', { timeout: 10000 });

    // Verify Floor 1 has special terrace callout
    const floor1Band = page.locator('#bands [data-n="1"]');
    await floor1Band.click({ force: true });
    const isFloor1Entered = await unitPanel.isVisible().catch(() => false);
    if (!isFloor1Entered) {
      const enterBtn = page.locator('#ftEnter');
      if (await enterBtn.isVisible().catch(() => false)) {
        await enterBtn.click({ force: true });
      } else {
        await floor1Band.click({ force: true });
      }
    }

    await expect(unitPanel).toHaveClass(/on/, { timeout: 15000 });
    await expect(unitPanel.locator('#pCopy')).toContainText('private podium terrace');
  });

  test('Level 3 Drill-down: Unit floor plan viewer with Pan & Zoom controls, caption and unit switching', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForSelector('#towerImg');

    // Enter Floor 14
    const floor14Band = page.locator('#bands [data-n="14"]');
    await floor14Band.click({ force: true });
    const unitPanel = page.locator('#unitPanel');
    const isEntered = await unitPanel.isVisible().catch(() => false);
    if (!isEntered) {
      const enterBtn = page.locator('#ftEnter');
      if (await enterBtn.isVisible().catch(() => false)) {
        await enterBtn.click({ force: true });
      } else {
        await floor14Band.click({ force: true });
      }
    }
    await expect(unitPanel).toHaveClass(/on/, { timeout: 15000 });

    // Click first room (Living & Dining) to drill down to Level 3
    const roomButtons = unitPanel.locator('#pRooms button');
    await roomButtons.first().click();

    // Verify Level 3 is active
    const app = page.locator('#app');
    await expect(app).toHaveAttribute('data-view', 'room', { timeout: 10000 });

    // Check CAD floor plan image is loaded
    const roomImg = page.locator('#roomImg');
    await expect(roomImg).toBeVisible();
    const imgSrc = await roomImg.getAttribute('src');
    expect(imgSrc).toContain('floor-plan1.jpg');

    // Check Level 3 caption badge
    const captionBadge = page.locator('.cad-caption-badge');
    await expect(captionBadge).toBeVisible();
    await expect(captionBadge).toContainText('Floor 14');
    await expect(captionBadge).toContainText('Flat 1401');
    await expect(captionBadge).toContainText('1,247 sq ft');
    await expect(captionBadge).toContainText('₹1.85 Cr All inclusive');

    // Check Zoom Controls
    const zoomControls = page.locator('.cad-zoom-controls');
    await expect(zoomControls).toBeVisible();
    const zoomInBtn = zoomControls.locator('button', { hasText: '+' });
    const zoomResetBtn = zoomControls.locator('button', { hasText: 'Reset' });
    await zoomInBtn.click();
    await expect(zoomResetBtn).toContainText('125%');

    // Check Bottom Bar unit switcher chips
    const roomBar = page.locator('#roomBar');
    await expect(roomBar).toHaveClass(/on/, { timeout: 10000 });
    await expect(roomBar.locator('#rbRoom')).toContainText(/Living/);

    // Switch to 4 BHK (Flat 1403) from inside Level 3
    const flat1403Btn = roomBar.locator('.rb-unit-switchers button', { hasText: 'Flat 1403' });
    await flat1403Btn.click();

    // Image must dynamically switch to floor-plan3.jpg
    await expect(roomImg).toHaveAttribute('src', /floor-plan3\.jpg/);
    await expect(captionBadge).toContainText('Flat 1403');
    await expect(captionBadge).toContainText('1,592 sq ft');

    // Back button returns to Level 2
    await roomBar.locator('button[data-action="back"]').click();
    await expect(app).toHaveAttribute('data-view', 'unit', { timeout: 10000 });
    await expect(unitPanel).toHaveClass(/on/);
  });

  test('Builder Plans Modal: All / Site Plan / Wing Plan tabs & Master Plan Lightbox', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForSelector('#towerImg');

    // Click "Floor Plans & Layout" floating pill
    const plansPill = page.locator('.floating-nav-pills button', { hasText: 'Floor Plans & Layout' });
    await plansPill.click({ force: true });

    // Modal should be visible
    const modal = page.locator('.floor-plans-modal-backdrop');
    await expect(modal).toBeVisible();

    // Check tabs: All, Site Plan, Wing Plan
    const tabAll = modal.locator('.plan-tabs button[data-tab="all"]');
    const tabSite = modal.locator('.plan-tabs button[data-tab="site"]');
    const tabWing = modal.locator('.plan-tabs button[data-tab="wing"]');

    await expect(tabAll).toBeVisible();
    await expect(tabSite).toBeVisible();
    await expect(tabWing).toBeVisible();

    // "All" tab shows 4 cards
    const planCards = modal.locator('[data-plan-id]');
    await expect(planCards).toHaveCount(4);

    // Switch to "Site Plan" -> shows 1 card (First Floor Plan & Key Layout)
    await tabSite.click();
    await expect(modal.locator('[data-plan-id]')).toHaveCount(1);
    await expect(modal.locator('[data-plan-id="master-plan"]')).toBeVisible();

    // Switch to "Wing Plan" -> shows 3 unit plan cards
    await tabWing.click();
    await expect(modal.locator('[data-plan-id]')).toHaveCount(3);

    // Open Lightbox for 3 BHK Type 01
    const inspectBtn = modal.locator('[data-plan-id="3bhk-type-01"] button', { hasText: 'View Plan' });
    await inspectBtn.click();

    // Lightbox overlay should be visible with zoom controls
    const lightbox = modal.locator('.plan-lightbox-overlay');
    await expect(lightbox).toBeVisible();
    await expect(lightbox.locator('h2')).toContainText('3 BHK (Type 01)');

    // Close Lightbox
    const closeLightboxBtn = lightbox.locator('button', { hasText: 'Close' });
    await closeLightboxBtn.click();
    await expect(lightbox).not.toBeVisible();

    // Close Plans Modal via Escape key
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('Enquiry & Site Visit Flow: Prefilled residence details and WhatsApp deep link', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForSelector('#towerImg');

    // Click "Request Site Visit" floating pill
    const siteVisitPill = page.locator('.floating-nav-pills button', { hasText: 'Request Site Visit' });
    await siteVisitPill.click({ force: true });

    const enquiryModal = page.locator('.enquiry-modal-backdrop');
    await expect(enquiryModal).toBeVisible();
    await expect(enquiryModal.locator('.enquiry-modal-card')).toBeVisible();

    // Verify WhatsApp deep link contains official builder phone +91 8600612808
    const waLink = enquiryModal.locator('a[href*="wa.me"]');
    await expect(waLink).toBeVisible();
    const href = await waLink.getAttribute('href');
    expect(href).toContain('918600612808');
    expect(href).toContain('Nitaara%20Tower');

    // Fill form and submit
    await enquiryModal.locator('input[type="text"]').fill('Amit Deshmukh');
    await enquiryModal.locator('input[type="tel"]').fill('+91 98220 12345');
    await enquiryModal.locator('button[type="submit"]').click();

    // Assert instantaneous confirmation state
    await expect(enquiryModal.locator('h3')).toContainText('Enquiry Received Successfully');
    await expect(enquiryModal.locator('.enquiry-modal-card')).toContainText('Amit Deshmukh');

    // Close modal
    await enquiryModal.locator('button', { hasText: 'Close' }).click();
    await expect(enquiryModal).not.toBeVisible();
  });
});
