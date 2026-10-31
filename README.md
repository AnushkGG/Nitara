# The Solenne · Brickell Bay Residences (Recreation)

An exact, pixel-faithful, behavior-faithful recreation of [The Solenne Tower Demo](https://solenne-tower-demo.vercel.app/).

Built with **React 18 + TypeScript + Vite**, featuring direct hardware-accelerated 2D transforms on a 5504×3072 coordinate canvas, drone fly-through video transitions with per-frame camera lead tracking, interactive SVG hit-test floor bands, dollhouse room exploration, and full responsive design across desktop, tablet, and mobile.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start the local development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production
```bash
npm run build
```

### 4. Run Playwright End-to-End Tests
```bash
npm run test
```
Runs 24 automated tests across all 6 project viewports:
- Desktop 1440×900
- Desktop 1280×800
- Tablet Landscape 1024×768
- Tablet Portrait 768×1024
- Mobile 390×844
- Mobile 360×800

### 5. Run Visual Regression / Snapshot Captures
```bash
npm run test:visual
```
Outputs baseline screenshots into `tests/visual/captures/`.

---

## Key Features & Architecture

1. **3-Level Drill-Down Experience:**
   - **Tower Explorer:** 30 interactive SVG floor slabs overlaid on the Biscayne Bay tower photography with dynamic hover indicators, pricing, and availability.
   - **Floor / Dollhouse View:** High-res dollhouse floor plans (`Residence A` and `Corner Penthouse`) with pulsating room pins that counter-scale to remain crisp at any viewport.
   - **Room Interiors:** Full-bleed room photography (`Living & Kitchen`, `Primary Bedroom`, `Primary Bath`, `Great Room`, `Chef's Kitchen`, `Spa Bath`) with smooth chip navigation.

2. **Cinematic Drone Transitions with Lead Camera Tracking:**
   - Pre-warmed HTML5 video layer playing 24fps drone fly-through clips.
   - Multi-frame matrix tracking (`lead: [[scale, dx, dy], ...]`) interpolates and dissolves the static tower photo over the video clip with cubic smoothstep easing, eliminating lighting seams between floors.
   - Reverse transitions when stepping back to floor plans or returning to the tower.

3. **Complete Responsive Architecture:**
   - Desktop: floating dynamic floor tag card, right-aligned residence info sheet, difference-mode custom cursor.
   - Mobile: compact header, thumb-friendly bottom sheet card, tap-to-select with dedicated "Enter floor" button, horizontal room chips.
   - Verified $0\text{px}$ horizontal overflow (`scrollWidth <= clientWidth`) across all screen sizes.

4. **Accessibility & Motion Preferences:**
   - Visible gold `:focus-visible` rings on all interactive elements.
   - Full keyboard navigation with `Escape` to traverse backward.
   - Instant transitions and animation disabling for users with `prefers-reduced-motion: reduce`.

---

## Project Structure

```
├── docs/
│   ├── reference-audit.md       # Measured design tokens, typography, hit-test data
│   ├── asset-log.md             # Harvest log of all 29 media assets
│   ├── motion-comparison.md     # Animation durations and easing curves
│   ├── implementation-notes.md  # Architectural details and technical decisions
│   └── progress.md              # Phase-by-phase completion scorecard
├── public/
│   └── assets/                  # 29 harvested images and mp4 transition clips
├── src/
│   ├── components/
│   │   ├── TowerExplorer.tsx    # Primary canvas container and layer coordinator
│   │   ├── Header.tsx           # Brand wordmark, navigation links, and CTA
│   │   ├── FloorTag.tsx         # Hover tag and mobile bottom sheet card
│   │   ├── Hint.tsx             # Interactive exploration prompt
│   │   ├── UnitPanel.tsx        # Residence specifications, pricing, and room list
│   │   ├── RoomBar.tsx          # Bottom room navigation bar and chips
│   │   ├── Cursor.tsx           # Custom difference-blend cursor
│   │   └── Toast.tsx            # Demonstration notification
│   ├── data/
│   │   └── towerData.ts         # Slabs, pricing rules, and transition lead matrices
│   ├── styles/
│   │   ├── tokens.css           # Measured CSS custom properties
│   │   └── global.css           # Global layout and responsive styling
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── utils/
│   │   └── geometry.ts          # 5504x3072 coordinate math and transform functions
│   ├── App.tsx                  # Root application component
│   └── main.tsx                 # React entry point
└── tests/
    ├── smoke.spec.ts            # Page load, layers, and console error checks
    ├── tokens.spec.ts           # Computed styles and design tokens validation
    ├── interactions.spec.ts     # Drill-down and reverse navigation tests
    ├── responsive.spec.ts       # Horizontal overflow and viewport checks
    └── visual.spec.ts           # Visual screenshot snapshot runner
```

