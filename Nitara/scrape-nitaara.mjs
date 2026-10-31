// scripts/scrape-nitaara.mjs
// Run locally:  node scripts/scrape-nitaara.mjs
// Requires Node 18+ (built-in fetch). No dependencies.
//
// Downloads the public images/text of https://nitaaratowernigdi.com/ into
// public/assets/nitaara/ and writes a manifest (dimensions unknown here; size + sha256 + type).
// Polite by design: sequential requests, small delay, identifying User-Agent.
// Use ONLY for the client pitch/prototype; get the builder's written permission before publishing.

import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const ORIGIN = "https://nitaaratowernigdi.com";
const OUT = "public/assets/nitaara";
const DELAY_MS = 400;
const UA = "Mozilla/5.0 (compatible; ClientPrototypeBot/1.0; +pitch-prototype)";

// URLs verified from the live page's HTML (see brief §1).
const KNOWN = [
  "images/logo-white2.png",
  "images/banner/desk1.jpg", "images/banner/desk2.jpg", "images/banner/desk3.jpg", "images/banner/desk4.jpg",
  "images/banner/mob1.jpg", "images/banner/mob2.jpg", "images/banner/mob3.jpg",
  "images/about.jpg", "images/map.jpg",
  "images/amenities/co working space.jpg", "images/amenities/GYM.jpg", "images/amenities/Indoor games.jpg",
  "images/amenities/Kids play area.jpg", "images/amenities/lobby.jpg",
  "images/amenities/Senior citizen sitout area.jpg", "images/amenities/Yoga deck.jpg",
  "images/floorplan/Floor Plan1.jpg", "images/floorplan/Floor Plan2.jpg", "images/floorplan/Floor Plan3.jpg",
  "images/floorplan/Floor Plan4.png", "images/floorplan/Floor Plan5.png", "images/floorplan/Master Plan.jpg",
  "images/QR1.jpg", "images/rera.png", "images/landmark.png", "images/delivery.png",
  "images/construction.png", "images/project-by.png",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const toUrl = (p) => (p.startsWith("http") ? p : `${ORIGIN}/${p.replace(/^\/+/, "")}`.replace(/ /g, "%20"));

async function get(url, asText = false) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return asText ? res.text() : Buffer.from(await res.arrayBuffer());
}

// Discover any additional image references in HTML + linked CSS/JS (hidden slides, sprites, etc.)
async function discover() {
  const found = new Set();
  const html = await get(ORIGIN + "/", true);
  await writeFile("docs/nitaara-source.html", html).catch(() => {});
  const grab = (txt) => {
    for (const m of txt.matchAll(/["'(]\s*((?:https?:\/\/nitaaratowernigdi\.com)?\/?(?:\.\.\/)*images\/[^"')\s>]+?\.(?:jpe?g|png|webp|svg|gif|mp4))/gi)) {
      found.add(decodeURIComponent(m[1]).replace(ORIGIN, "").replace(/^\/+/, "").replace(/^(\.\.\/)+/, ""));
    }
  };
  grab(html);
  const assets = [...html.matchAll(/(?:href|src)=["']([^"']+\.(?:css|js)(?:\?[^"']*)?)["']/gi)].map((m) => m[1]);
  for (const a of assets) {
    if (/^https?:\/\//.test(a) && !a.startsWith(ORIGIN)) continue;
    try { grab(await get(toUrl(a), true)); } catch {}
    await sleep(DELAY_MS);
  }
  return [...found];
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await mkdir("docs", { recursive: true });
  let discovered = [];
  try { discovered = await discover(); } catch (e) { console.warn("Discovery skipped:", e.message); }
  const all = [...new Set([...KNOWN, ...discovered])];
  console.log(`Downloading ${all.length} files (${discovered.length} discovered from HTML/CSS/JS)`);

  const manifest = [];
  for (const rel of all) {
    const url = toUrl(rel);
    const dest = path.join(OUT, rel.replace(/^images\//, "").replace(/ /g, "-").toLowerCase());
    try {
      const buf = await get(url);
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, buf);
      manifest.push({ source: url, file: dest, bytes: buf.length, sha256: createHash("sha256").update(buf).digest("hex") });
      console.log("OK  ", rel);
    } catch (e) {
      manifest.push({ source: url, file: null, error: e.message });
      console.warn("FAIL", rel, e.message);
    }
    await sleep(DELAY_MS);
  }
  await writeFile(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Done. Manifest: ${OUT}/manifest.json  (check for FAIL entries)`);
}
main();
