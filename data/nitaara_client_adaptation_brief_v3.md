# Nitaara Tower — Client Adaptation Brief (v3)

**What this is:** Track B of the Solenne project. You already have the Solenne tower-explorer site (tower image → hover a floor → floor/residence → inside view). This brief converts it into a **pitch prototype for the builder of Nitaara Tower** (https://nitaaratowernigdi.com/), keeping Solenne's functionality and swapping in the builder's real tower image, floor plans, amenities, content and numbers.

**Companion files**
- `scrape-nitaara.mjs` → `scripts/scrape-nitaara.mjs` (downloads the builder's public images; run locally)
- `nitaara.data.ts` → `src/data/nitaara.data.ts` (single data source; every unknown is `null`)

Operating rules from v2 still apply (verify before claiming, stop at gates, update `docs/progress.md`, tag each phase).

---

## 0. Read first: what I could and could not verify

I read the builder's page text and a listing aggregator. I could **not** download images or view pixels from here (my network access to that domain is blocked, and I cannot see rendered images), so:

| Needed for the replica | Status |
|---|---|
| Tower image | Banner files exist (`banner/desk1–4.jpg`, `mob1–3.jpg`). **Which one shows the full tower, and how many floors it shows, is unknown until someone looks at them.** |
| Floor plan images | 5 floor plans + 1 master plan exist (URLs below). **What each plan depicts (typical floor? unit plan? 3 BHK vs 4 BHK?) is unknown.** |
| **Number of floors** | **Not on the builder's site. Not reliably available anywhere.** See §0.1. |
| **Tower height** | **Not published anywhere I found.** Do not invent. |
| Which unit is on which floor, per-floor availability, floor-wise pricing | **Not published.** |
| Fonts, colors, brand style | Not extracted (needs browser/DevTools). |

### 0.1 Floors: what the evidence actually says
- Builder site: no floor count. Hero says "The Tallest Landmark of Nigdi Pradhikaran".
- Square Yards (aggregator): **single building, 36 units, 0.57 acres, cross-shaped footprint**, possession Mar 2028. Its registry table lists **"Floor 13, Unit 1301"** → the tower has **at least 13 floors**.
- Other aggregators list "5–6 floors" for similarly named sibling listings ("Mittal 6/8 Nitaara Tower", different RERA IDs P52100050701, plot C6). Those appear to be **different or mislabeled records — do not use them.**
- The reliable sources are, in order: **(1) the builder/client**, **(2) the MahaRERA project page (reg. P52100050692, https://maharerait.maharashtra.gov.in/project/view/40321)** which lists building details and floors, **(3) the brochure**.

**Decision for the agent:** `tower.totalFloors` in `nitaara.data.ts` is `null` and `buildFloors()` throws until it's filled. The whole explorer is driven by that number, so **filling it is Gate N0**. Since you are pitching to the builder, simply asking them ("how many floors, tower height, and flats per floor?") is also a legitimate first meeting question.

---

## 1. Verified data from the builder's site

- Title: *Nitaara Tower | 3 & 4 BHK Luxury Flats in Nigdi Pradhikaran, Pune*
- Hero: **The Tallest Landmark of Nigdi Pradhikaran**; **3 BHK ₹1.85 Cr all inc. & 4 BHK ₹2.36 Cr all inc.**
- Highlights: Prime Location Advantage · 3 & 4 BHK Premium Layouts · Lifestyle Amenities · Modern Architecture & Design
- About: collaboration of **ABC Corp, Mittal Group and Success Group**
- Configuration: 3 BHK carpet **1245–1247 sq ft**; 4 BHK **1592 sq ft**
- Amenities ("Ground Floor + Top Terrace"): Co-working space, Gym, Indoor games, Kids play area, Lobby, Senior citizen sit-out area, Yoga deck, "& More"
- Floor Plans tabs: **All / Site Plan / Wing Plan** (5 floor plans + Master Plan)
- Location lists: Key Conveniences, Connectivity, Education (full list in `nitaara.data.ts`)
- Address: Plot No. C8, Sector 24, Bhakti Shakti Chowk, Nigdi Pradhikaran, Pune 411 044
- **Maha-RERA P52100050692** (+ RERA badge and QR image)
- Phones: 8600612808 (header, WhatsApp) and 9890288871 (enquiry area): confirm which is primary
- Sections/anchors: Home, Overview, Amenities, Layout, Features(location), Contact Us; "Download Brochure" (link is `#`, no PDF available)
- Developer trust blocks: Admired Landmarks · Consistently On-Time Delivery · Quality Construction
- Disclaimer text (must be kept)

---

## 2. Rules specific to this client project

1. **Permission.** The builder's images, copy and logos belong to the builder. Using them in a private pitch prototype is common practice, but: keep it unpublished/unindexed, mark it as a concept, and **get written approval before any public hosting**. Scraped assets live in `public/assets/nitaara/` with the manifest and source URLs.
2. **RERA compliance.** Maharashtra requires the RERA number on project marketing. Always render P52100050692 (+ the builder's RERA badge/QR) and the disclaimer.
3. **No invented facts.** No floor counts, heights, per-floor prices, "available/sold" flags, interior renders or unit allocations unless sourced from the builder/RERA. UI must show "Enquire" instead of fabricated availability.
4. **Solenne is the interaction template, not the content.** Remove every Solenne string, price, and image from the build (grep for `Solenne`, `Brickell`, `Lynam`, `$`, `tower.jpg`).
5. **Level-3 mapping.** Solenne's third level shows interior renders ("Living & Kitchen"). The builder publishes **no interior renders**. Use the **unit floor plan** as the third level (zoom/pan). Do **not** generate AI interiors unless the client approves, and then label them "illustrative".

---

## 3. Phases (Track B)

| Phase | Name | Gate |
|---|---|---|
| N0 | Confirm numbers (floors, height, units/floor) | `tower.totalFloors` filled with a cited source |
| N1 | Harvest assets & content | Manifest with 0 FAIL; contact sheet reviewed |
| N2 | Pick tower image & calibrate floor hit-areas | Every floor 1..N hoverable and correct on the real image |
| N3 | Floor plans & unit model | Each unit type shows the right plan; Site/Wing/Master plans viewable |
| N4 | Content, brand & section swap | No Solenne leftovers; all builder sections present |
| N5 | Responsive, motion, a11y re-verification | Same gates as v2 Phases 6–8 on new content |
| N6 | Pitch packaging | Demo script, "concept" labelling, handoff notes |

### N0 — Confirm numbers
**Tasks:** Open the MahaRERA page (P52100050692) and record: total floors/storeys, building/wing count, units, sanctioned height if listed, carpet areas. Cross-check with the typical floor plan image. If a value can't be found, **ask the client**; record it in `docs/client-questions.md` with the exact question.
Questions to ask: total floors (G+?) and podium/parking levels; units per floor and their mix; floor numbering (is 13 skipped?); sanctioned/architectural height in metres (only if they want it shown); availability policy for a public site; which phone is primary; permission to use their images in the pitch.
**Gate:** `docs/facts.md` lists each number with source; `tower.totalFloors` set (and `floorsLabel`, e.g. "G + N").
**Prompt**
```text
Execute N0 only. Do not code. Using nitaara.data.ts as the schema, find tower.totalFloors,
building/wing count, units and height from the MahaRERA project page for P52100050692 and
the builder's floor plans. Record every value with a source URL in docs/facts.md. Anything
you cannot verify goes into docs/client-questions.md as a precise question. Do not use
listings for sibling projects ("Mittal 6/8 Nitaara Tower"). Stop and report.
```

### N1 — Harvest assets & content
**Tasks**
1. Copy `scrape-nitaara.mjs` to `scripts/`, run `node scripts/scrape-nitaara.mjs` **on your own machine** (it downloads the known image URLs and also discovers extra ones from the HTML/CSS/JS).
2. Review `public/assets/nitaara/manifest.json` (no FAIL rows). If files are blocked, download them manually from the browser Network tab.
3. Generate a contact sheet and **look at every image**; write `docs/asset-review.md`: dimensions, what each depicts, and for banners: "full tower? close-up? number of visible floors?". Same for the 5 floor plans and master plan.
4. Capture the builder site screenshots (desktop/mobile) plus computed fonts and colors via DevTools into `docs/brand.md` (logo colors, accent, typefaces). Reuse its brand tokens, not Solenne's.
5. If banner images are low resolution or heavily compressed, note it; ask the client for originals.
**Gate:** all images present and described.

### N2 — Tower image & floor calibration *(the core of "same tower, same number of floors")*
**Tasks**
1. Choose the tower image that best shows the **whole building** (probably a `desk*.jpg`); keep the original aspect ratio and focal point. Do not crop floors away.
2. Replace Solenne's `tower.jpg` and its floor hit-regions. Floor count comes from `tower.totalFloors`. **Never hard-code the count in components.**
3. Build a **dev-only calibration page** (`/dev/calibrate`): load the tower image, click the building's floor boundaries top→bottom (ground, podium, each slab, terrace), export `src/data/towerHotspots.json` as normalized coordinates (0–1) so they scale with any viewport. For perspective renders use polygons (4 points per floor band), not rectangles; for the cross-shaped footprint with several visible faces, define bands for the dominant face and keep hit areas contiguous.
4. Floor heights are **not uniform** (ground/podium and terrace differ). Do not divide height equally; use the clicked boundaries.
5. Wire the existing hover → floor indicator → summary card flow to the new hotspots. Keep Solenne's keyboard and touch behavior (arrow keys, tap-to-select on mobile).
6. Tower height: show a numeric height **only if confirmed** in N0. Otherwise scale only visually.
**Tests:** for every floor 1..N, hovering its band shows that floor number; first and last floor exact; no gaps/overlaps (assert each point of the building's vertical extent maps to exactly one floor); keyboard cycles through all N floors.
**Gate:** screenshot of every floor state reviewed against the image by a human.
**Prompt**
```text
Execute N2 only. Replace the Solenne tower image with the builder's full-tower render from
public/assets/nitaara (the one chosen in docs/asset-review.md). Read tower.totalFloors from
src/data/nitaara.data.ts; never hard-code the floor count. Build the dev-only calibration
page that exports normalized polygons per floor to src/data/towerHotspots.json, then wire
hover, keyboard and touch selection to them. Add Playwright tests proving floors 1..N each
resolve correctly and every point on the building maps to exactly one floor. Stop and report
with screenshots.
```

### N3 — Floor plans & unit model
**Tasks**
1. From `docs/asset-review.md`, map each plan image to what it is: typical floor plan, 3 BHK unit(s) (1245 / 1247 sq ft), 4 BHK unit (1592 sq ft), site plan, wing plan, master plan. Fill `floorPlanSrc` in `unitTypes`.
2. Level 2 (floor view): show the floor number, the units on that floor (from the typical floor plan, once N0 confirms units/floor), area, and "All inclusive ₹1.85 Cr / ₹2.36 Cr" from the builder. **No per-floor price differences, no "Available/Sold" unless supplied**; use "Enquire".
3. Level 3 (replaces interior views): the unit floor plan with zoom/pan (pinch on touch), caption e.g. "Floor 12 · 3 BHK · 1,245 sq ft carpet".
4. Provide the builder's **All / Site Plan / Wing Plan** tabs plus Master Plan viewer (lightbox) as a separate section, as on the builder's site.
5. "Request floor plan" → enquiry dialog prefilled with floor and unit; "Private Tour" → "Request for Site Visit" (builder's wording). Simulated submit unless the client provides an endpoint; WhatsApp deep link `https://wa.me/918600612808?text=…` is real and works without a backend (confirm number).
**Gate:** every unit type renders the correct plan; unit specs match the builder's table exactly.

### N4 — Content, brand & section swap
- Replace header: logo (`logo-white2.png`, it is a white logo, so keep it on dark/transparent header or request a dark version), nav: Home, Overview, Amenities, Layout, Features, Contact Us (use the builder's labels, but dedupe: their markup repeats Overview/Amenities/Layout for desktop and mobile).
- Sections in builder order, restyled with Solenne's interaction patterns: Hero (tagline + prices) → Highlights → About (ABC Corp · Mittal Group · Success Group) → Configuration table → Amenities gallery with lightbox → Floor Plans (tabs) → Location (map.jpg + three lists) → Developer trust blocks → Contact (address, phone, QR, RERA) → Enquire Now/Site Visit → Disclaimer.
- Brand tokens come from N1 `docs/brand.md`. Do not keep Solenne's palette unless the client wants it.
- Meta tags: use the builder's title/description; keep `noindex` for the prototype.
- Footer: replace "Concept demo by …" line with "Concept prototype. Not an official website. All details tentative, subject to the developer's disclaimer."
**Gate:** `grep -ri "solenne\|brickell\|lynam\|miami"` returns nothing in `src/`, `public/`, `index.html`.

### N5 — Re-verification
Re-run v2 Phases 6–8 checks on the new content: pixel-diff tower states against the saved screenshots, responsive at 360/390/768/1024/1280/1440, touch behavior for the tower (hover doesn't exist on phones), reduced-motion, keyboard, console errors, Lighthouse. Check large floor-plan images are lazy-loaded and compressed (they will be heavy).

### N6 — Pitch packaging
Prepare: a 5-minute demo script (tower hover → floor → unit plan → enquiry/WhatsApp), a one-page "what this adds over your current site" (explorable tower, floor plans per unit, mobile-first, enquiry flow), the open-questions list from N0, and clear "prototype/concept" labelling. Host privately (password or unlisted) until the builder agrees.

---

## 4. Final acceptance checklist (Track B)
- [ ] `tower.totalFloors` sourced; UI shows exactly that many floors; no hard-coded counts
- [ ] Tower image is the builder's; each floor hoverable/tappable/keyboard-selectable and correct
- [ ] Floor plans, master/site/wing plans from the builder, correctly labelled
- [ ] 3 BHK (1245/1247 sq ft, ₹1.85 Cr) and 4 BHK (1592 sq ft, ₹2.36 Cr) shown exactly as the builder states
- [ ] No invented availability, floor-wise pricing, height, or interiors
- [ ] RERA number, QR/badge and disclaimer present
- [ ] No Solenne/Miami/Lynam leftovers
- [ ] All asset sources and permission status logged
- [ ] Desktop + mobile verified, build/tests run with real output
