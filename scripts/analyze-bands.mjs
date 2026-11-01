import fs from "node:fs";
import { chromium } from "@playwright/test";

async function analyzeBands() {
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

  const res = await page.evaluate(() => {
    const img = document.getElementById('img');
    const canvas = document.getElementById('c');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const w = canvas.width;
    const h = canvas.height;
    const data = ctx.getImageData(0, 0, w, h).data;

    // In desk1.jpg (2000x857), let's inspect the right edge column (x: 1375 to 1400)
    // where window frames are very sharp and repetitive.
    // Let's compute vertical gradient (difference between y+1 and y-1)
    const grads = [];
    for (let y = 60; y < 730; y++) {
      let diff = 0;
      for (let x = 1375; x <= 1395; x++) {
        const i1 = ((y - 1) * w + x) * 4;
        const i2 = ((y + 1) * w + x) * 4;
        const lum1 = data[i1] * 0.299 + data[i1+1] * 0.587 + data[i1+2] * 0.114;
        const lum2 = data[i2] * 0.299 + data[i2+1] * 0.587 + data[i2+2] * 0.114;
        diff += Math.abs(lum2 - lum1);
      }
      grads.push({ y, diff });
    }

    return grads;
  });

  // Find local maxima with minimum distance of ~20px
  const peaks = [];
  for (let i = 2; i < res.length - 2; i++) {
    const cur = res[i].diff;
    if (cur > res[i-1].diff && cur > res[i-2].diff && cur > res[i+1].diff && cur > res[i+2].diff && cur > 150) {
      if (peaks.length === 0 || res[i].y - peaks[peaks.length - 1].y > 18) {
        peaks.push(res[i]);
      }
    }
  }

  console.log(`Detected ${peaks.length} slab transitions:`, peaks.map(p => p.y));
  await browser.close();
}

analyzeBands();

