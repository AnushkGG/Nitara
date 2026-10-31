import { chromium } from "@playwright/test";
import fs from "node:fs";

async function cropTower() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 2000, height: 1000 } });
  
  // Create an HTML page loading desk1.jpg and desk2.jpg
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <body style="margin:0; background:black;">
      <canvas id="c"></canvas>
    </body>
    </html>
  `);

  const crop = async (imgSrc, outName, sx, sy, sw, sh) => {
    await page.evaluate(async ({ imgSrc, sx, sy, sw, sh }) => {
      const img = new Image();
      img.src = imgSrc;
      await new Promise(r => img.onload = r);
      const canvas = document.getElementById('c');
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    }, { imgSrc, sx, sy, sw, sh });

    const dataUrl = await page.evaluate(() => document.getElementById('c').toDataURL('image/png'));
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(outName, Buffer.from(base64Data, 'base64'));
    console.log(`Saved ${outName}`);
  };

  const desk1Data = "data:image/jpeg;base64," + fs.readFileSync("public/assets/nitaara/banner/desk1.jpg").toString("base64");
  const desk2Data = "data:image/jpeg;base64," + fs.readFileSync("public/assets/nitaara/banner/desk2.jpg").toString("base64");

  // In desk1 (2000x857), tower is roughly x: 1050 to 1450, y: 30 to 720
  await crop(desk1Data, "public/assets/nitaara/tower_desk1_crop.png", 1050, 30, 400, 700);
  // In desk2 (2000x857), tower is roughly x: 550 to 950, y: 150 to 750
  await crop(desk2Data, "public/assets/nitaara/tower_desk2_crop.png", 550, 180, 400, 580);

  await browser.close();
}

cropTower();

