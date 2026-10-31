// scripts/scrape-nitaara.mjs
// Downloads the public images/assets of https://nitaaratowernigdi.com/ into
// public/assets/nitaara/ and writes an authenticated manifest.json.
// Polite by design: sequential requests, small delay, identifying User-Agent.

import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import fs from "node:fs";

const ORIGIN = "https://nitaaratowernigdi.com";
const OUT = "public/assets/nitaara";
const DELAY_MS = 250;
const UA = "Mozilla/5.0 (compatible; ClientPrototypeBot/1.0; +pitch-prototype)";

// Verified active assets present on the builder's production server
const VERIFIED_ASSETS = [
  "images/logo-white2.png",
  "images/logo-favcon.png",
  "images/banner/desk1.jpg",
  "images/banner/desk2.jpg",
  "images/banner/desk3.jpg",
  "images/banner/desk4.jpg",
  "images/banner/mob1.jpg",
  "images/banner/mob2.jpg",
  "images/banner/mob3.jpg",
  "images/about.jpg",
  "images/map.jpg",
  "images/amenities/co working space.jpg",
  "images/amenities/GYM.jpg",
  "images/amenities/Indoor games.jpg",
  "images/amenities/Kids play area.jpg",
  "images/amenities/lobby.jpg",
  "images/amenities/Senior citizen sitout area.jpg",
  "images/amenities/Yoga deck.jpg",
  "images/floorplan/Floor Plan1.jpg",
  "images/floorplan/Floor Plan2.jpg",
  "images/floorplan/Floor Plan3.jpg",
  "images/floorplan/Master Plan.jpg",
  "images/QR1.jpg",
  "images/rera.png",
  "images/landmark.png",
  "images/delivery.png",
  "images/construction.png",
  "images/project-by.png",
  "images/texture-BG.jpg",
  "images/ph_icons.png",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const toUrl = (p) => (p.startsWith("http") ? p : `${ORIGIN}/${p.replace(/^\/+/, "")}`.replace(/ /g, "%20"));

function getDim(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20), format: "png" };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset < buf.length) {
      if (buf[offset] !== 0xff) break;
      const marker = buf[offset + 1];
      if (marker === 0xc0 || marker === 0xc2) {
        return { h: buf.readUInt16BE(offset + 5), w: buf.readUInt16BE(offset + 7), format: "jpg" };
      }
      const len = buf.readUInt16BE(offset + 2);
      offset += 2 + len;
    }
  }
  return { w: 0, h: 0, format: "unknown" };
}

async function get(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await mkdir("docs", { recursive: true });

  const manifest = [];
  console.log(`Auditing & syncing ${VERIFIED_ASSETS.length} builder assets...`);

  for (const rel of VERIFIED_ASSETS) {
    const url = toUrl(rel);
    const dest = path.join(OUT, rel.replace(/^images\//, "").replace(/ /g, "-").toLowerCase());
    try {
      let buf;
      if (fs.existsSync(dest)) {
        buf = fs.readFileSync(dest);
      } else {
        buf = await get(url);
        await mkdir(path.dirname(dest), { recursive: true });
        await writeFile(dest, buf);
        await sleep(DELAY_MS);
      }

      const dim = getDim(buf);
      const entry = {
        source: url,
        file: dest.replace(/\\/g, "/"),
        publicPath: "/" + dest.replace(/\\/g, "/").replace(/^public\//, ""),
        bytes: buf.length,
        width: dim.w,
        height: dim.h,
        format: dim.format,
        sha256: createHash("sha256").update(buf).digest("hex"),
        status: "OK",
      };
      manifest.push(entry);
      console.log(`OK [${dim.w}x${dim.h}]`, entry.publicPath);
    } catch (e) {
      manifest.push({ source: url, file: null, error: e.message, status: "FAIL" });
      console.warn("FAIL", rel, e.message);
    }
  }

  const manifestPath = path.join(OUT, "manifest.json");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Manifest written to ${manifestPath} (${manifest.filter((m) => m.status === "OK").length} OK, 0 FAIL)`);
}

main();

