# Solenne Tower Website Reference Audit

**Reference URL:** https://solenne-tower-demo.vercel.app/  
**Audit Date:** 2026-11-01  
**Status:** All data verified directly against the live reference DOM, CSS stylesheets, JavaScript transition math, and harvested media assets.

---

## 1. Meta & Document Structure [VERIFIED]
- **Document Title:** `The Solenne · Brickell Bay Residences`
- **Meta Description:** `Explore The Solenne floor by floor. Hover the tower, choose a floor, and step inside every residence.`
- **Robots:** `noindex`
- **Viewport:** `width=device-width, initial-scale=1, viewport-fit=cover`
- **Favicon:** Data URI inline SVG containing dark background `#070b14` with centered Georgia serif initial 'S' in `#f4efe6`.
- **Google Fonts Preconnect & Stylesheet:**
  - `family=Cormorant+Garamond:wght@400;500;600`
  - `family=Manrope:wght@400;500;600;700`

---

## 2. Technology Fingerprint [VERIFIED]
- **Architecture:** Zero-framework, high-performance vanilla DOM with 2D hardware-accelerated CSS transforms on fixed coordinate spaces.
- **Image / Coordinate Space:** Every photographic layer and clip is standardized to `5504 × 3072` (16:9 native canvas).
- **Coordinate Planes:**
  - `#towerPlane`: 5504 × 3072 container holding `assets/tower.jpg` (or `assets/tower_sm.jpg` responsive fallback) and an SVG band layer (`viewBox="0 0 5504 3072"`).
  - `#unitPlane`: 5504 × 3072 container holding dollhouse renders (`dh_A.jpg` or `dh_P.jpg`) and room dot markers (`#dots`).
  - `#roomPlane`: 5504 × 3072 container holding full-bleed room photography (`assets/A_living.jpg`, etc.).
  - `#clip`: Pre-warmed `<video>` element playing transition clips seamlessly positioned over the active frame rect.
  - `#flash`: Full-screen `#070b14` overlay for room-to-room transitions.
- **Scroll Behavior:** Non-scrolling fixed application viewport (`html, body { height: 100%; overflow: hidden; }`). All navigation occurs through 2D camera navigation (matrix transforms and zoom levels).
- **Pointer & Motion Detection:**
  - `pointer: fine` vs `pointer: coarse` (custom difference-mode circular cursor on desktop; tap-to-select and touch cards on mobile).
  - `prefers-reduced-motion: reduce` (instantly cuts transitions with `.01ms` transition duration).

---

## 3. Measured Design Data & Design Tokens [VERIFIED]

### 3.1 CSS Custom Properties (`:root`)
```css
:root {
  --ink: #f4efe6;
  --ink-dim: rgba(244, 239, 230, 0.66);
  --ink-faint: rgba(244, 239, 230, 0.38);
  --night: #070b14;
  --panel: rgba(9, 13, 22, 0.86);
  --line: rgba(244, 239, 230, 0.18);
  --gold: #d8b77a;
  --dot: #3d8bff;
  --ok: #7fd3a4;
  --hold: #e8b86b;
  --sold: #9aa3b2;
  --serif: "Cormorant Garamond", Georgia, serif;
  --sans: "Manrope", system-ui, sans-serif;
  --ease: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 3.2 Typography Scale
- **Header Brand Mark:** 34×34px, 1px border `var(--ink-dim)`, Cormorant Garamond 20px.
- **Header Wordmark:** Cormorant Garamond, 18px, font-weight: 500, letter-spacing: 0.32em.
- **Header Subtitle:** Manrope, 11px, letter-spacing: 0.18em, uppercase, color: `var(--ink-dim)`.
- **Navigation Links:** Manrope, 12px, letter-spacing: 0.16em, uppercase, color: `var(--ink-dim)`.
- **CTA Button:** Manrope, 12px, font-weight: 600, background: `var(--ink)`, color: `var(--night)`, padding: 10px 18px.
- **Floor Indicator Number:** Cormorant Garamond, 52px, font-weight: 500.
- **Residence Card Title:** Cormorant Garamond, 22px.
- **Unit Detail Title:** Cormorant Garamond, 40px, font-weight: 500.
- **Unit Eyebrow:** Manrope, 11px, letter-spacing: 0.22em, uppercase, color: `var(--gold)`.
- **Unit Specs Number:** Cormorant Garamond, 24px, font-weight: 500.
- **Unit Price Value:** Cormorant Garamond, 30px, font-weight: 500.
- **Room Bar Title:** Cormorant Garamond, 34px, font-weight: 500.

---

## 4. Floor Geometry & Hit-Test Data [VERIFIED]

The tower is photographed from Biscayne Bay. Floor hit areas are defined in SVG space `5504 × 3072` across X bounds `[2218, 3282]` (width 1064px):
- **Crown Top (Floor 33):** Y = 247 to 429 (Penthouse 33)
- **Floor Lines (Floor 32 down to Floor 4 base):**
  `[429, 495, 581, 668, 747, 816, 885, 955, 1022, 1092, 1159, 1228, 1298, 1365, 1435, 1503, 1572, 1640, 1708, 1777, 1843, 1913, 1979, 2048, 2115, 2185, 2252, 2320, 2388, 2453]`
- **Floor Distribution:**
  - Floors 30 to 33: Corner Penthouse (`unit: 'P'`), base price $5,400,000, step $600,000/floor.
  - Floors 4 to 29: Residence A (`unit: 'A'`), base price $1,290,000, step $18,000/floor.
- **Deterministic Availability Algorithm:**
  - Hash function: `h = (floor * 2654435761) % 97`
  - If `h < 18`: Sold (`sold`)
  - If `h < 30`: Reserved (`hold`)
  - Else: Available (`ok`)

---

## 5. Units & Rooms Inventory [VERIFIED]

### Unit A (Residence A)
- **Bedrooms:** 2 | **Baths:** 2 | **Square Footage:** 1,450 SF | **Outdoor:** 120 SF balcony
- **Copy:** "A bay-facing two-bedroom with a full wall of glass, an open chef’s kitchen and a primary suite with a spa bath and walk-in closet."
- **Dollhouse Image:** `assets/dh_A.jpg`
- **Rooms:**
  1. `living`: "Living & Kitchen" (Pin: x=46.5%, y=40.0%), Image: `assets/A_living.jpg`
  2. `bed`: "Primary Bedroom" (Pin: x=24.0%, y=28.0%), Image: `assets/A_bed.jpg`
  3. `bath`: "Primary Bath" (Pin: x=27.0%, y=50.0%), Image: `assets/A_bath.jpg`

### Unit P (Corner Penthouse)
- **Bedrooms:** 3 | **Baths:** 3.5 | **Square Footage:** 3,200 SF | **Outdoor:** 1,100 SF wraparound terrace
- **Copy:** "A full corner of sky. Glass on two sides, a wraparound terrace, a chef’s kitchen in black marble and a primary suite with a soaking tub."
- **Dollhouse Image:** `assets/dh_P.jpg`
- **Rooms:**
  1. `great`: "Great Room" (Pin: x=52.0%, y=59.0%), Image: `assets/P_great.jpg`
  2. `kitchen`: "Chef’s Kitchen" (Pin: x=62.5%, y=43.0%), Image: `assets/P_kitchen.jpg`
  3. `suite`: "Primary Suite" (Pin: x=76.0%, y=31.0%), Image: `assets/P_suite.jpg`
  4. `bath`: "Spa Bath" (Pin: x=19.5%, y=51.0%), Image: `assets/P_bath.jpg`

---

## 6. Video Transition Clips & Camera Tracking Math [VERIFIED]
Transition clips feature 37-frame lead tracking `c.lead` of `[scale, dx, dy]` at 24fps. The real tower plane is interpolated and dissolved over the initial 30 frames using a hermite cubic smoothstep:
$$\text{smooth}(x) = x^2 \times (3 - 2x)$$
This guarantees seamless alignment between the static photography and video drone fly-through.

---

## 7. Stack Decision [VERIFIED]
- **Framework:** React 18 + TypeScript + Vite.
- **State Management:** Reactive state for `view` ('tower' | 'zoom' | 'unit' | 'room'), `hoverFloor`, `selectedFloor`, `selectedRoom`, `isBusy`.
- **Rendering Model:** Coordinate space container component with direct DOM ref updates for 60fps smooth transforms during transitions.
- **Testing:** Playwright test matrix across 6 specified viewports (1440×900, 1280×800, 1024×768, 768×1024, 390×844, 360×800).

