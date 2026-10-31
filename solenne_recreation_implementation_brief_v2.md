# Solenne Tower Website Recreation — Phased Implementation Brief (v2)

**Reference URL:** https://solenne-tower-demo.vercel.app/
**Goal:** A pixel-faithful, behavior-faithful local recreation of the reference site (layout, typography, imagery, color, spacing, motion, interactions, responsive behavior).
**Executor:** Antigravity (agent-first IDE with an integrated browser agent). Also works with Cursor / Claude Code.

---

## 0. What changed from v1 (read this first)

v1 was a solid *process* document but was written as if the site had never been seen: nearly every requirement is "if present in the reference". For an **exact** replica that is the main weakness. Changes in v2:

| # | Issue in v1 | Fix in v2 |
|---|---|---|
| 1 | Stack was fixed up front (React + Framer Motion, Three.js "only if justified") before the site was analyzed. | Stack is **decided at the end of Phase 1** from evidence (detected framework, animation libs, 3D, fonts). Defaults remain React + TS + Vite. |
| 2 | Audit was visual/manual only ("note font size…"). | Audit now extracts **measured data**: computed styles via DevTools, network asset list, font files, scroll-trigger positions, framework/library fingerprinting. |
| 3 | Smooth-scroll and scroll-linked animation not mentioned. Demo sites like this very often use Lenis/GSAP/ScrollTrigger-style behavior, which changes the feel entirely. | Added explicit detection and replication step for scroll behavior (Phase 1, Phase 6). |
| 4 | Visual comparison was "eyeball and list 5 mismatches". | Added **automated pixel-diff** (Playwright + pixelmatch) with per-section thresholds, deterministic capture rules, and a numeric fidelity target. |
| 5 | Animations compared by description only. | Added **frame-by-frame capture** (timed screenshots / video) of every animation for timing and easing matching. |
| 6 | One giant master prompt; long agent runs drift and lose context. | Work split into **9 phases**, each with its own prompt, deliverables, **exit gate**, and a handoff file (`docs/progress.md`). Agent must stop at each gate. |
| 7 | Suggested file tree assumed a tower explorer, floor selector, floor plans, etc. | Tree is now **generated from the audit**. Listed components are examples, not a checklist. |
| 8 | "Honest success state" for forms could conflict with exact replication. | Resolved with an explicit rule (see §6.5). |
| 9 | Asset/IP stance was vague. | Clear rule: replicate the *design and behavior*; reuse original assets only if permitted; otherwise placeholders at identical dimensions/crops, logged in `docs/asset-log.md`. |
| 10 | Browser inspection was "if available". | Antigravity has a browser agent, so inspection is **mandatory**. Fallback is a defined protocol (screenshots/recordings from the owner), not guessing. |
| 11 | Missing tooling: no Playwright viewport matrix config, no lint/format gate, no git strategy. | Added in Phase 0. |
| 12 | Acceptance checklist was generic. | Acceptance criteria are now per phase plus a final fidelity scorecard. |

> **Source of the pre-seeded findings below:** a text-only fetch of the reference page. It returned page text and structure but **no CSS, no JavaScript, no rendered pixels and no interaction behavior**. So §0.1 lists what is verified from the text, and everything visual (fonts, colors, spacing, motion, how the views transition) is still **unverified** and must come from Phase 1 in the agent's browser.

### 0.1 Pre-seeded findings (from the reference's text content)

**[VERIFIED from page text]**
- Title: `The Solenne · Brickell Bay Residences`; meta description: "Explore The Solenne floor by floor. Hover the tower, choose a floor, and step inside every residence."; `meta-robots: noindex`; viewport meta includes `viewport-fit=cover` (so safe-area insets matter on mobile).
- Single page. Hero/main image is a local asset: `/assets/tower.jpg` (tower at dusk on Biscayne Bay).
- Header: logo mark "S" + wordmark **THE SOLENNE**, location line **Brickell Bay · Miami**; nav links **Residences**, **Penthouses**, **Amenities**; a **Private Tour** button (href `#`).
- **Floor indicator** showing a floor number (default text shows `Floor 22`).
- **Residence summary card**: "Residence A", "2 Bed · 2 Bath · 1,450 SF", status "Available", CTA **Enter floor**.
- Hint text: **Hover a floor to explore**.
- **Floor view**: label "Floor 22", heading **Residence A**, price "From **$1.69M**", buttons **Back to tower** and **Request floor plan**.
- **Interior view**: button **Back to floor plan**; caption "Floor 22 · Residence A — **Living & Kitchen**".
- Footer line: "Concept demo by Lynam Up Media. The Solenne is fictional; all imagery is AI-generated."

**Implied structure [ASSUMED until seen in browser]:** a three-level drill-down — **Tower (hover/select floor) → Floor plan (residences on that floor) → Residence interior (room views such as "Living & Kitchen")**. The text only shows the strings; whether these are separate screens, overlays or one animated scene, and how many floors/residences/rooms exist, is unknown.

**Consequences for the plan**
- The "tower explorer" **does exist**, so Phase 4 is not optional. It is the heart of the site.
- Hover interaction on the tower means a **hit-test layer** (SVG regions, image map, or canvas) over `tower.jpg`. Phase 1 must determine which, and extract the floor regions.
- Touch devices have no hover; Phase 1/7 must observe what the reference does on mobile (tap to select? a slider?).
- Dynamic strings ("Floor 22", "Residence A", "Available", price) are clearly data-driven: the per-floor/per-residence data table must be **captured by actually hovering/clicking every floor** and recording each value.
- "From $1.69M", "Available" and the specs are fictional demo data. Copying them is fine for a replica, but they must remain labeled as demo data (the site itself says it is fictional).
- Assets are AI-generated and the demo is credited to **Lynam Up Media**. Confirm you are allowed to reuse the images/copy (or that you are the author/owner) before copying them; otherwise use placeholders per the asset rule below.

---

## 1. Operating Rules for the Agent (apply to every phase)

1. **The reference is the source of truth.** Never design from the name "Solenne Tower" or from real-estate conventions.
2. **Verified vs. assumed.** Every fact in docs is tagged `[VERIFIED]` (observed in browser/DevTools/network) or `[ASSUMED]`. Assumptions must be resolved or flagged before the phase gate.
3. **Do not invent.** No unobserved features, copy, prices, availability, or sections.
4. **Stop at gates.** At the end of each phase: update `docs/progress.md`, run that phase's checks, commit, tag (`phase-N-complete`), then **stop and report**. Do not start the next phase until told to.
5. **Report honestly.** Say which commands/tests were actually run and their real output. Never claim a test passed or a visual match that was not measured.
6. **Small diffs, one concern per commit.** Conventional messages (`feat:`, `fix:`, `style:`, `test:`, `docs:`).
7. **If blocked** (site unreachable, asset gated, behavior can't be observed): write it to `docs/blockers.md` and ask the owner for screenshots/screen recordings. Do not fabricate.
8. **Legal/asset rule.** Only reuse assets (images, fonts, video, copy) the owner is permitted to reuse. Do not access private source, credentials, or restricted APIs. Where an original asset can't be used, create a placeholder with **identical dimensions, aspect ratio, crop and focal point** and log it.

### Handoff file: `docs/progress.md`

Keep this updated at the end of every phase so a fresh agent session can resume:

```md
## Current phase: N
## Completed phases: …
## Decisions made (with evidence links to audit sections)
## Open questions / blockers
## Known visual diffs (section → % pixel diff @ viewport)
## Commands to run (dev / build / test / visual-diff)
```

---

## 2. Phase Overview

| Phase | Name | Output | Gate (must be true to proceed) |
|---|---|---|---|
| 0 | Workspace & tooling | Running skeleton, test + diff tooling, git | `npm run dev/build/lint` succeed; Playwright runs a smoke test |
| 1 | Reference audit & asset harvest | `docs/reference-audit.md`, `docs/asset-log.md`, reference screenshot baseline | Owner reviews audit; stack decision recorded |
| 2 | Foundations | Tokens, fonts, global CSS, layout shell, smooth-scroll, router/anchors | Tokens match measured values; fonts render identically |
| 3 | Static sections (desktop) | Every section built top→bottom at 1440 | Per-section pixel diff ≤ threshold at 1440 (static state) |
| 4 | Core interactive module | The signature interaction(s) (e.g., tower/floor explorer if it exists) | Behavior matches interaction inventory |
| 5 | Secondary interactions | Menus, gallery, dialogs, forms, tabs, hover/focus states | All inventory rows pass |
| 6 | Motion & scroll behavior | Entry/scroll/hover animations, smooth scroll, loader if any | Timing/easing within tolerance vs. captured frames |
| 7 | Responsive (tablet & mobile) | 1024 / 768 / 390 / 360 layouts | Pixel diff within threshold at all viewports, no overflow |
| 8 | Fidelity pass, a11y, perf, QA, docs | Final scorecard, README, test suite | Final acceptance checklist (§9) passes |

Rule of thumb for order: **structure → static fidelity → behavior → motion → responsive → polish.** Desktop static accuracy first, because everything else depends on it.

---

## 3. Recommended Stack (defaults — confirm in Phase 1)

| Area | Default | Switch when… |
|---|---|---|
| Framework | React + TypeScript + Vite | Reference is clearly Next.js with SSR-dependent behavior you must mimic (rare for a visual clone). Keep Vite unless there's a concrete reason. |
| Styling | CSS Modules + CSS custom properties | Reference uses Tailwind and you can recognize utility patterns; Tailwind is acceptable if it speeds exact reproduction. Pick **one** approach. |
| Animation | Framer Motion (`framer-motion`) for UI transitions | Reference uses GSAP/ScrollTrigger-style scroll-scrubbed timelines → use `gsap` (+ `ScrollTrigger`). Don't force Framer Motion onto scrubbed animation. |
| Smooth scroll | None | Reference has inertial/eased scrolling → `lenis`. Verify by scrolling with mouse wheel and checking for scroll-hijacking. |
| 3D | None | Reference renders on `<canvas>` with WebGL / has orbit-drag 3D → Three.js (`three`, optionally `@react-three/fiber`). A tower drawn as layered images/SVG does **not** need 3D. |
| Icons | Inline SVG copied from reference | Use `lucide-react` only for icons that cannot be extracted. |
| Tests | Playwright + `pixelmatch` + `pngjs` | — |
| Lint/format | ESLint (from Vite template) + Prettier | — |

Add dependencies **only** when Phase 1 evidence calls for them.

---

## PHASE 0 — Workspace & Tooling

**Goal:** A clean, testable skeleton before any design work.

**Tasks**
1. Create project:
   ```bash
   npm create vite@latest solenne-recreation -- --template react-ts
   cd solenne-recreation
   npm install
   npm install -D @playwright/test pixelmatch pngjs prettier
   npx playwright install chromium
   git init && git add -A && git commit -m "chore: scaffold"
   ```
2. Remove Vite demo content (default `App.tsx` markup, `App.css`, logo assets).
3. Create folders: `docs/`, `public/assets/{images,video,fonts,icons}`, `src/{components,data,hooks,styles,utils}`, `tests/`, `tests/visual/`, `reference/` (baseline screenshots).
4. Playwright config with a **viewport project matrix**: 1440×900, 1280×800, 1024×768, 768×1024, 390×844, 360×800. Set `reducedMotion: 'no-preference'`, fixed `deviceScaleFactor: 1`, and `webServer` pointing to `npm run dev`.
5. Add npm scripts: `lint`, `format`, `test`, `test:visual`, `capture:reference`.
6. Add a smoke test (page loads, no console errors).
7. Create `docs/progress.md`, `docs/blockers.md`, `docs/asset-log.md` (empty templates).

**Exit gate:** `npm run dev`, `npm run build`, `npm run lint`, `npx playwright test` all run successfully; first commit tagged `phase-0-complete`.

**Agent prompt**
```text
Execute Phase 0 of the Solenne recreation brief only. Set up the Vite React-TS
workspace, folders, Playwright viewport matrix, pixelmatch tooling, lint/format,
and docs templates. Run dev, build, lint and the smoke test and report real output.
Update docs/progress.md, commit, tag phase-0-complete, then STOP.
```

---

## PHASE 1 — Reference Audit & Asset Harvest  *(most important phase)*

**Goal:** Turn the live site into measurable data and a baseline for diffing. No app code in this phase.

### 1.1 Capture baselines
For each viewport (1440×900, 1280×800, 1024×768, 768×1024, 390×844, 360×800):
- Full-page screenshot of the reference → `reference/<viewport>/full.png`.
- Per-section screenshots (scroll to each section, wait for animations to settle) → `reference/<viewport>/<section-id>.png`.
- Record how long each section waits before it is "settled".

> Capture rules for determinism: same viewport, `deviceScaleFactor: 1`, wait for fonts and images, no cursor hovering, disable nothing on the reference that would change what a visitor sees. Record what you did.

### 1.2 Section inventory (top → bottom)
For each section: purpose, exact visible copy, height/width at each viewport, background (color/image/video/gradient), text alignment, column grid, padding/margins/gaps, borders/dividers/shadows, z-index/overlap, sticky/fixed behavior.

### 1.3 Measured design data (from DevTools, not by eye)
Using computed styles on representative elements, record:
- Colors (text, backgrounds, borders, overlays with alpha), exact hex/rgba.
- Font family, weight, size, line-height, letter-spacing, text-transform, per heading level and per breakpoint.
- Container max-widths, page gutters, section spacing, gaps.
- Border radius, shadows, opacity values, blend modes, backdrop filters.
- Breakpoints at which layout changes (find by resizing and noting the exact px width).
- CSS custom properties defined on `:root` (copy them verbatim).

### 1.4 Technology fingerprint
Identify and record: framework (Next.js/React/Vue/etc.), CSS approach, animation libraries (GSAP, Framer Motion, Lenis, Lottie, Three.js), whether there's a `<canvas>`, video elements, and any scroll-hijacking. Evidence source for each (script names in Network tab, DOM attributes, globals).

### 1.5 Interaction inventory
For **every** interactive element: initial state, hover, focus, active, click/tap result, state changes, dismissal/reset, keyboard behavior, mobile behavior. Include cursor changes, custom cursors, drag/scroll interactions, and anything triggered purely by scroll position (with the scroll offsets at which triggers fire).

### 1.6 Animation inventory
For each animation: trigger (load / scroll position / hover / click), duration, delay, easing (estimate from frame capture), properties animated, stagger, whether it replays. Record with timed screenshots or screen recording at fixed intervals (e.g., every 50 ms).

### 1.7 Asset harvest
From the Network tab list: images (with intrinsic and rendered dimensions, crop/focal point), video, SVGs, fonts (family, weights, file format, source — self-hosted or Google/Adobe), favicon/meta tags/OG image. Download only what you're permitted to reuse; log everything in `docs/asset-log.md` with: path, source URL, dimensions, permission status (`reusable` / `placeholder-needed`).

### 1.8 Meta
Page `<title>`, meta description, favicon, language attribute, 404/other routes (check whether the site is single-page or has more routes).

### 1.8b Drill-down state map (add for this site)
Document every state and transition of the tower → floor plan → interior flow: how many floors are hoverable, the polygon/rectangle coordinates of each floor hit area (at each viewport), what each floor's data is (floor number, residences, specs, price, availability), which floors are unavailable or non-interactive, how "Enter floor", "Back to tower", "Request floor plan" and "Back to floor plan" behave, how many interior room views exist per residence and how they are switched, what "Request floor plan" opens (dialog? form? nothing), what "Private Tour" and the nav links (Residences, Penthouses, Amenities) do (they may be `#` placeholders — record that), and URL/hash changes if any. Record the data for **every** floor and residence.

### 1.9 Stack decision
At the end, add a "Stack decision" section to the audit: final choices for styling, animation, scroll, 3D, with the evidence for each.

**Deliverables:** `docs/reference-audit.md`, `docs/asset-log.md`, `reference/**` screenshots, updated `docs/progress.md`.

**Exit gate:** Owner reviews the audit. Nothing marked `[ASSUMED]` that affects layout or core interactions without an agreed plan. Stack decision recorded.

**Agent prompt**
```text
Execute Phase 1 only: audit https://solenne-tower-demo.vercel.app/ using your
browser. Do not write app code. Produce docs/reference-audit.md following §1.1–1.9
of the brief, capture baseline screenshots into reference/, build docs/asset-log.md,
and record the stack decision. Extract measurements from computed styles rather than
estimating by eye. Tag every claim [VERIFIED] or [ASSUMED]. If the browser can't reach
the site or any state, record it in docs/blockers.md and ask me for screenshots or a
screen recording — do not guess. Update docs/progress.md, commit, tag
phase-1-complete, then STOP.
```

---

## PHASE 2 — Foundations

**Goal:** Everything shared that sections depend on.

**Tasks**
1. `src/styles/tokens.css` — real values from the audit (colors, type scale per breakpoint, spacing, widths, radii, shadows, transition durations/easings). **No placeholder comments.**
2. Fonts: self-host in `public/assets/fonts` with `@font-face` + `font-display` matching the reference behavior; verify no FOUT difference vs. reference where visible. If a licensed font cannot be reused, pick the closest substitute, log it, and match metrics (size-adjust / line-height) so wrapping stays identical.
3. `global.css`: reset, base typography, selection color, scrollbar styling (if the reference customizes it), focus-visible baseline.
4. Layout primitives: `Section`, `Container`, grid helpers as used by the reference.
5. Smooth scrolling (Lenis or native) exactly per the audit; anchor-link offset for any sticky header.
6. `index.html`: title, meta, favicon, lang, OG tags, font preloads.
7. Data modules scaffold in `src/data/` (navigation, content, residences/etc. as the audit dictates).

**Exit gate:** A test page rendering the type scale and color swatches matches the audit values (assert computed styles in a Playwright test). Build and lint pass.

**Agent prompt**
```text
Execute Phase 2 only, based on docs/reference-audit.md. Implement tokens, fonts,
global styles, layout primitives, scroll behavior and index.html metadata using
measured values. Add a Playwright test asserting key computed styles against the
audit. Run build, lint, tests; report real output. Update progress.md, commit,
tag phase-2-complete, then STOP.
```

---

## PHASE 3 — Static Sections (Desktop 1440)

**Goal:** Every section present, in order, matching the baseline in its **resting/static state** at 1440×900 (and 1280).

**Method — repeat per section, top to bottom**
1. Build the section markup and styles (semantic HTML, correct heading hierarchy).
2. Use exact copy, exact asset (or logged placeholder with identical dimensions/crop).
3. Render at 1440, screenshot the same region, **pixel-diff against `reference/1440x900/<section>.png`**.
4. Fix until the diff is under the threshold, then move on.

**Fidelity thresholds (static state):** ≤ 1.0% differing pixels per section at 1440 (pixelmatch threshold 0.1, anti-aliasing ignored), and **identical line wrapping** for all text blocks. Document any section that can't meet this and why (e.g., video poster frame, dynamic content).

**Do not** add animations or responsive rules yet, except what is needed to avoid breaking the layout.

**Exit gate:** All sections exist in order; diff report committed (`tests/visual/report.md`); 1280 spot-check passes.

**Agent prompt**
```text
Execute Phase 3 only. Build every section top to bottom at 1440px in its static
state, diffing each section against reference/1440x900/. Fix mismatches until
each section is within the threshold in §PHASE 3, keeping the five largest
mismatches in mind first. No animations or mobile work yet. Write the diff report,
update progress.md, commit, tag phase-3-complete, then STOP.
```

---

## PHASE 4 — Core Interactive Module (Tower → Floor → Residence Interior)

**Goal:** The signature interaction: hover/select a floor on the tower, enter the floor to see the residence, and step inside to the interior views. Verified strings from the reference ("Hover a floor to explore", "Enter floor", "Back to tower", "Request floor plan", "Back to floor plan", "Living & Kitchen") confirm this flow exists; its exact mechanics come from the Phase 1 state map (§1.8b).

**Tasks**
- Build the floor hit-test layer over `tower.jpg` from the extracted floor regions (§1.8b); hover highlights a floor and updates the floor indicator and summary card.
- Model data first (types + data module), with one source of truth for selection state.
- Reproduce every state in the interaction inventory: initial state, hover, selected, transitions between states, and detail panel / floor plan updates.
- Selection by mouse, touch, **and keyboard** (roving tabindex / arrow keys as appropriate).
- Handle empty/unavailable data without crashing.
- Representation technique chosen from evidence: layered images, SVG overlay, canvas or WebGL — whichever the reference actually uses.
- Illustrative values (area, price, availability) must be copied from the reference when shown there; do **not** invent new ones. If you must fill gaps, label them as demo data in code comments and `docs/`.

**Tests:** Playwright test per inventory row (select X → expect Y).

**Exit gate:** Interaction inventory rows for this module all pass; pixel diff of each selected state ≤ threshold.

**Agent prompt**
```text
Execute Phase 4 only. Implement the core interactive module exactly per the
interaction inventory in docs/reference-audit.md. Separate data from presentation,
support mouse/touch/keyboard, and write one Playwright test per inventory row.
Pixel-diff each selectable state against reference captures. Report real results.
Update progress.md, commit, tag phase-4-complete, then STOP.
```

---

## PHASE 5 — Secondary Interactions

**Goal:** Everything else that responds to the user.

**Scope (only what the audit lists)**
- Header behavior (transparent → solid on scroll, hide/show, active link state).
- Mobile menu logic (structure now, final mobile styling in Phase 7).
- Hero/section CTAs and anchor scrolling.
- Gallery/slider/lightbox, tabs, accordions, dropdowns.
- Contact / enquiry / private-tour dialogs and forms.
- Hover, focus, active, disabled states for all controls; custom cursor if present.

**Dialog & form requirements (accessibility)**
- `role="dialog"`, `aria-modal`, labelled title, focus trap, Escape to close, focus returns to opener, background inert/scroll-locked.
- Validation: visible + programmatic (`aria-invalid`, `aria-describedby`) errors, matching the reference's rules and message copy.

**Exit gate:** Every row of the interaction inventory (excluding motion timing and mobile-specific parts) has a passing Playwright test. No dead buttons.

**Agent prompt**
```text
Execute Phase 5 only. Implement all remaining interactions from the audit
(header, menus, CTAs, gallery, dialogs, forms, hover/focus states) with full
keyboard and a11y support. Write Playwright tests for each. Do not add features
not in the audit. Report real results, update progress.md, commit,
tag phase-5-complete, then STOP.
```

---

## PHASE 6 — Motion & Scroll Behavior

**Goal:** Match how it *moves*, not just how it looks.

**Tasks**
1. Replicate each item in the animation inventory: trigger, duration, delay, easing, stagger, replay behavior.
2. Match scroll-linked effects (parallax, pinning, scrubbed timelines) using the library identified in Phase 1.
3. Page-load sequence / preloader if one exists.
4. Page and component transitions.
5. `prefers-reduced-motion`: provide reduced alternatives (fades or none) without breaking layout. This is an *addition* to the original, required for accessibility.
6. Ensure animations never cause layout shift or block interaction.

**Verification:** Capture the same frame sequence as in Phase 1 (same intervals) from the local build and compare: positions/opacity at each timestamp within a tolerance (e.g., ±2% of travel distance, ±50 ms on timing). Record easing curves used.

**Exit gate:** Animation inventory 100% implemented; frame comparison table committed to `docs/motion-comparison.md`.

**Agent prompt**
```text
Execute Phase 6 only. Implement every animation and scroll behavior from the audit
using the libraries chosen in Phase 1. Capture matching frame sequences locally and
compare against the reference captures; write docs/motion-comparison.md with real
numbers. Add reduced-motion support. Update progress.md, commit,
tag phase-6-complete, then STOP.
```

---

## PHASE 7 — Responsive (Tablet & Mobile)

**Goal:** Match the reference at 1024, 768, 390, 360 — using the *reference's* breakpoints, not guessed ones.

**Tasks**
- Implement layout changes at the exact breakpoint widths recorded in the audit.
- Mobile navigation final styling and behavior (open/close, closes on navigate, focus handling).
- Reorder/stack content exactly as the reference does (don't assume desktop order).
- Touch-friendly hit areas; check dialogs and forms with a mobile viewport and keyboard.
- Re-run pixel diffs per section per viewport using the baselines from Phase 1.

**Checks:** no horizontal overflow (assert `scrollWidth <= clientWidth` at every viewport), no clipped/overlapping text, images keep correct crop/focal point, interactions work by touch.

**Thresholds:** ≤ 1.5% differing pixels per section at 1024/768/390/360 (slightly looser due to text rasterization differences), identical line wrapping where feasible.

**Exit gate:** Responsive tests pass at all six viewports; diff report updated.

**Agent prompt**
```text
Execute Phase 7 only. Implement tablet and mobile layouts at the breakpoints
recorded in the audit and finalize the mobile menu. Run pixel diffs per section at
1024, 768, 390 and 360 and fix the largest mismatches first. Add overflow and
touch-interaction tests. Report real results, update progress.md, commit,
tag phase-7-complete, then STOP.
```

---

## PHASE 8 — Fidelity Pass, Accessibility, Performance, QA & Docs

**Tasks**
1. **Fidelity pass:** re-run all diffs at all viewports; list the top 5 remaining mismatches overall; fix; repeat until the scorecard (below) is met or limits are documented.
2. **Accessibility:** heading hierarchy, landmarks, alt text, accessible names for icon buttons, color contrast (record where the *original* itself fails contrast — match it, but note it), visible focus states, keyboard-only walkthrough.
3. **Performance:** lazy-load below-the-fold images, responsive `srcset`/sizes, no layout shift (CLS ≈ 0), no unnecessary render loops. Compare against the reference's Lighthouse numbers if available — aim to match or beat.
4. **Cleanup:** remove unused code/deps/assets, tighten TypeScript types, consolidate duplicate components.
5. **Docs:** `README.md` (setup, structure, scripts, how visual diff works), `docs/implementation-notes.md` (decisions, deviations, remaining differences), final `docs/asset-log.md`.
6. **Console & network:** no errors/warnings, no broken asset paths.

### Final fidelity scorecard (fill in with real numbers)

| Viewport | Sections within threshold | Worst section (% diff) | Line-wrap matches | Overflow |
|---|---|---|---|---|
| 1440×900 | _/_ | | | |
| 1280×800 | _/_ | | | |
| 1024×768 | _/_ | | | |
| 768×1024 | _/_ | | | |
| 390×844 | _/_ | | | |
| 360×800 | _/_ | | | |

**Exit gate:** §9 acceptance checklist passes.

**Agent prompt**
```text
Execute Phase 8 only. Run a final fidelity pass across all viewports and fill in
the scorecard with real measurements. Fix the five largest remaining mismatches,
then audit accessibility, performance, console errors and code quality. Update
README.md and docs/implementation-notes.md. Run build, lint, all tests and the
visual-diff suite, and report actual results and every remaining limitation.
Commit, tag phase-8-complete.
```

---

## 4. Visual Diff Method (used from Phase 3 onward)

1. `npm run capture:reference` stores baselines in `reference/<viewport>/` (done once in Phase 1; re-run only if the reference changes).
2. Local capture uses the same viewport, scale factor, scroll position, and wait conditions (fonts loaded, images decoded, animations settled or frozen to their end state for static diffs).
3. Compare with `pixelmatch` (threshold 0.1, `includeAA: false`), output diff images to `tests/visual/diffs/`, and log % differing pixels per section.
4. Prioritize fixes by: **structure/geometry → hero image crop → typography & wrapping → header position → spacing → everything else.**
5. Do not claim "pixel-perfect". Report the measured numbers.

Known sources of unavoidable noise (document, don't chase): font rasterization differences across machines, video frames, and anything time-dependent.

---

## 5. Design System Guidance

- Tokens come from **measured** values only (Phase 1.3). The CSS must contain real values, never comment placeholders.
- Avoid adding gradients, glass effects, rounded cards, or shadows that aren't on the reference.
- Match image `object-fit` / `object-position`; preserve aspect ratios; reserve space to prevent layout shift.
- Prefer inline SVG for logos/icons copied from the reference.

---

## 6. Interaction, Data & Forms Guidance

### 6.1 Data separation
Keep content and records in `src/data/`. Components receive typed props. Example shape if a residence explorer exists (adapt to what the reference actually displays):

```ts
export type Residence = {
  id: string;
  floor: number;
  name: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  priceLabel?: string;
  floorPlanSrc?: string;
  availabilityLabel?: string;
};
```

### 6.2 State
One source of truth per feature (e.g., selected floor/residence). Derive everything else. Provide a sensible initial selection identical to the reference's initial state.

### 6.3 Navigation
All links and anchors reach the right target. Scroll offsets account for sticky headers. Smooth-scroll behavior matches the reference and respects reduced motion.

### 6.4 Keyboard
Every control reachable and operable by keyboard with visible focus (match the reference's focus style if it has one; otherwise add an accessible one that doesn't alter the resting look).

### 6.5 Form submission (decision rule)
- Replicate the reference's validation rules, error copy and success UI.
- This is a frontend-only build with no backend, so the submission is simulated. If the reference's success message says something like "Your enquiry has been sent", keep the same **visual** state but add a clearly labeled demo notice (e.g., a small "Demo — no message was sent" line) **unless the owner explicitly says the replica is for visual comparison only and the notice must be omitted**. Record the owner's decision in `docs/progress.md`.
- Never collect or transmit real personal data without a real backend and the owner's go-ahead.

---

## 7. Responsive Requirements

Test widths: 360, 390, 768, 1024, 1280, 1440. Use CSS Grid/Flexbox and `clamp()` where the reference's fluid behavior calls for it. Use the reference's real breakpoints. Check: no horizontal scroll, no overlap/clipping, readable type, touch-friendly targets, dialogs fit the viewport, forms usable with the on-screen keyboard.

---

## 8. Accessibility & Performance Requirements

Semantic HTML, logical headings, landmarks, keyboard support, visible focus, accessible names on icon buttons, useful alt text, dialog semantics and focus management, contrast awareness, reduced-motion support, lazy-loading, responsive images, no layout shift, no needless render loops, zero console errors and React warnings.

Accessibility and performance must not be sacrificed for superficial similarity; where the original is less accessible, match its **appearance** and improve the underlying semantics.

---

## 9. Final Acceptance Checklist

- [ ] `docs/reference-audit.md` complete; stack decision recorded; no unresolved `[ASSUMED]` items that affect layout/behavior.
- [ ] Every section present in the correct order with the exact copy.
- [ ] Hero composition, crop, and overlay match the baseline.
- [ ] Typography and line wrapping match; fonts load correctly.
- [ ] Header/navigation behave as in the reference (including sticky/transparent states).
- [ ] Every interaction in the inventory works (mouse, touch, keyboard) and is covered by a Playwright test.
- [ ] Core interactive module (tower/floor/residence explorer if present) matches all states.
- [ ] Animations and scroll behavior match recorded timing/easing within tolerance.
- [ ] Dialogs and forms behave and fail accessibly; submission handling follows §6.5.
- [ ] Layouts verified at 1440, 1280, 1024, 768, 390, 360 with no horizontal overflow.
- [ ] Pixel-diff scorecard filled with real numbers and within thresholds (or deviations documented).
- [ ] Reduced-motion supported; focus states visible; keyboard walkthrough passes.
- [ ] No console errors, no broken assets.
- [ ] `npm run build`, `npm run lint`, `npx playwright test` all executed with real results reported.
- [ ] `docs/asset-log.md` lists every asset with source and permission status.
- [ ] README and `docs/implementation-notes.md` updated with remaining differences.

**Success criterion:** A complete, interactive, responsive local implementation whose measured visual and behavioral fidelity to the reference is demonstrated with data — not just a similar-looking landing page.

---

## 10. Quick Start for Antigravity

1. Open an empty folder in Antigravity and add this file as `BRIEF.md`.
2. Paste the **Phase 0 prompt**. When the agent reports and stops, review, then paste the next phase's prompt.
3. After **Phase 1**, read the audit yourself before approving — it's the foundation for every later phase.
4. If the agent says it can't reach the site or a state, send it screenshots or a screen recording instead of letting it guess.
5. Keep each phase in a fresh agent session if context gets long; `docs/progress.md` is the handoff.
6. Not in scope for now: hosting, deployment, domains, real CRM/backend.
