import fs from "node:fs";
import { chromium } from "@playwright/test";

async function measureFloorWidths() {
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

  const slabs = [
    106, 132, 159, 185, 212, 238, 264, 289, 317, 342,
    370, 396, 421, 448, 474, 500, 527, 553, 580, 606,
    632, 658, 685, 708, 727, 748
  ];

  const bounds = await page.evaluate((slabs) => {
    const img = document.getElementById('img');
    const canvas = document.getElementById('c');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const w = canvas.width;
    const h = canvas.height;
    const data = ctx.getImageData(0, 0, w, h).data;

    const isSky = (x, y) => {
      const idx = (y * w + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      return b > 190 && r < 190 && (b - r > 30);
    };

    const results = [];
    for (let i = 0; i < slabs.length - 1; i++) {
      const y0 = slabs[i];
      const y1 = slabs[i+1];
      const midY = Math.round((y0 + y1) / 2);

      let x0 = 1080;
      for (let x = 1000; x < 1200; x++) {
        if (!isSky(x, midY)) {
          x0 = x;
          break;
        }
      }

      let x1 = 1410;
      for (let x = 1450; x > 1350; x--) {
        if (!isSky(x, midY)) {
          x1 = x;
          break;
        }
      }

      const floorNum = 25 - i;
      results.push({ floor: floorNum, y0, y1, x0, x1 });
    }
    return results;
  }, slabs);

  console.table(bounds);
  fs.writeFileSync("src/data/measuredBands.json", JSON.stringify(bounds, null, 2));
  await browser.close();
}

measureFloorWidths();

