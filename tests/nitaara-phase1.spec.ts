import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { project, tower, unitTypes, buildFloors, images } from '../src/data/nitaara.data';

test.describe('Nitaara Adaptation - Phase N0 & N1 Gates', () => {
  test('N0 Gate: Tower numbers and floors confirmed with cited facts', () => {
    expect(tower.totalFloors).toBe(25);
    expect(tower.floorsLabel).toContain('25');
    expect(tower.unitsPerFloor).toBe(3);
    expect(tower.wings).toBe(1);
    expect(project.rera.number).toBe('P52100050692');

    // buildFloors must construct exactly 25 floors without error
    const floors = buildFloors();
    expect(floors.length).toBe(25);
    expect(floors[0].number).toBe(1);
    expect(floors[24].number).toBe(25);

    // Each floor must have 3 units
    floors.forEach((f) => {
      expect(f.units.length).toBe(3);
      expect(f.units[0].config).toBe('3 BHK');
      expect(f.units[1].config).toBe('3 BHK');
      expect(f.units[2].config).toBe('4 BHK');
    });

    // Check facts.md and client-questions.md exist
    expect(fs.existsSync(path.resolve('docs/facts.md'))).toBe(true);
    expect(fs.existsSync(path.resolve('docs/client-questions.md'))).toBe(true);
  });

  test('N0 Gate: Unit types and pricing match builder specifications', () => {
    expect(unitTypes.length).toBe(3);
    
    const type1 = unitTypes.find(u => u.id === '3bhk-type-01');
    expect(type1?.totalSqFt).toBe(1247);
    expect(type1?.priceLabel).toBe('₹1.85 Cr');
    expect(fs.existsSync(path.join('public', type1!.floorPlanSrc))).toBe(true);

    const type2 = unitTypes.find(u => u.id === '3bhk-type-02');
    expect(type2?.totalSqFt).toBe(1245);
    expect(type2?.priceLabel).toBe('₹1.85 Cr');
    expect(fs.existsSync(path.join('public', type2!.floorPlanSrc))).toBe(true);

    const type3 = unitTypes.find(u => u.id === '4bhk-type-01');
    expect(type3?.totalSqFt).toBe(1592);
    expect(type3?.priceLabel).toBe('₹2.36 Cr');
    expect(fs.existsSync(path.join('public', type3!.floorPlanSrc))).toBe(true);
  });

  test('N1 Gate: Harvest manifest has 30 items with 0 FAIL and all files exist on disk', () => {
    const manifestPath = path.resolve('public/assets/nitaara/manifest.json');
    expect(fs.existsSync(manifestPath)).toBe(true);
    
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    expect(manifest.length).toBe(30);

    const failed = manifest.filter((m: any) => m.status === 'FAIL');
    expect(failed.length).toBe(0);

    // Every file must physically exist on disk and have non-zero size
    for (const item of manifest) {
      expect(fs.existsSync(path.resolve(item.file))).toBe(true);
      expect(item.bytes).toBeGreaterThan(100);
      expect(item.width).toBeGreaterThan(0);
      expect(item.height).toBeGreaterThan(0);
    }
  });

  test('N1 Gate: Tower base image and contact sheet are present and valid', () => {
    expect(fs.existsSync(path.join('public', images.towerHero.replace(/^\//, '')))).toBe(true);
    expect(fs.existsSync(path.join('public', images.towerMobileHero.replace(/^\//, '')))).toBe(true);
    expect(fs.existsSync(path.resolve('public/contact-sheet.html'))).toBe(true);
    expect(fs.existsSync(path.resolve('docs/asset-review.md'))).toBe(true);
    expect(fs.existsSync(path.resolve('docs/brand.md'))).toBe(true);
  });
});
