import fs from "node:fs";
import { chromium } from "@playwright/test";

async function measureTower() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 2000, height: 1000 } });
  
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body>
      <img id="img" src="data:image/jpeg;base64,${fs.readFileSync("public/assets/nitaara/banner/desk1.jpg").toString("base64")}" />
      <canvas id="c"></canvas>
    </body>
    </html>
  `);

  const metrics = await page.evaluate(() => {
    const img = document.getElementById('img');
    const canvas = document.getElementById('c');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Let's sample a few horizontal slices across the tower
    // In desk1 (2000x857), tower is around middle-right
    // Let's find columns where building contrast differs from the blue sky
    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    const skyColor = (x, y) => {
      // Sky in desk1 is light blue (r: ~130-180, g: ~190-225, b: ~245-255)
      const idx = (y * w + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      return b > 200 && r < 200 && g > 150 && (b - r > 40);
    };

    // Scan horizontal line at y = 300 (mid-tower)
    let leftX = 0, rightX = 0;
    for (let x = 800; x < 1800; x++) {
      if (!skyColor(x, 300) && leftX === 0) leftX = x;
      if (leftX !== 0 && skyColor(x, 300)) {
        rightX = x;
        break;
      }
    }

    // Scan vertical line at x = 1250 (tower center)
    let topY = 0, bottomY = 0;
    for (let y = 10; y < 800; y++) {
      if (!skyColor(1250, y) && topY === 0) topY = y;
    }

    return { w, h, midSlice: { leftX, rightX }, topY };
  });

  console.log("Tower metrics in desk1.jpg:", metrics);
  await browser.close();
}

measureTower();

