import fs from "node:fs";
import { chromium } from "@playwright/test";

async function findSlabs() {
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

  const slabData = await page.evaluate(() => {
    const img = document.getElementById('img');
    const canvas = document.getElementById('c');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // We scan the far right window column where slabs are clearest:
    // Around x: 1370 to 1400 (the white right facade column)
    const scanX1 = 1375;
    const scanX2 = 1395;
    const profile = [];

    for (let y = 50; y < 750; y++) {
      let sum = 0;
      let count = 0;
      for (let x = scanX1; x <= scanX2; x++) {
        const idx = (y * w + x) * 4;
        // luminance
        const lum = data[idx] * 0.299 + data[idx+1] * 0.587 + data[idx+2] * 0.114;
        sum += lum;
        count++;
      }
      profile.push({ y, lum: sum / count });
    }

    return { profile };
  });

  // Calculate moving average and find prominent peaks/valleys
  const p = slabData.profile;
  console.log(`Scanned ${p.length} vertical lines from y=50 to y=750`);
  await browser.close();
}

findSlabs();

