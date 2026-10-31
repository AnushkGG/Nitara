# Solenne Tower Website Recreation — Complete Implementation Brief

## 1. Project Overview

**Project:** Independent, high-fidelity recreation of the Solenne Tower website  
**Reference URL:** https://solenne-tower-demo.vercel.app/  
**Goal:** Rebuild the website as a responsive, interactive frontend that closely matches the reference in layout, typography, imagery, colors, spacing, transitions, and behavior.

This is a reference-driven recreation—not a generic luxury real-estate landing page. The agent must inspect the live website before making design decisions. It should implement the observed page structure and interactions, then compare screenshots and refine the implementation.

### Scope

Included:
- Full-page visual recreation
- Desktop, tablet, and mobile layouts
- Navigation and all observed interactive controls
- Animations and transitions that appear in the reference
- Tower/floor/residence exploration, if present in the reference
- Residence details and floor-plan interactions, if present
- Gallery, modals, and enquiry forms, if present
- Accessibility, performance, testing, and documentation

Not included for now:
- Hosting or deployment
- Production domain setup
- Real CRM integration or a production backend unless specifically required later
- Unobserved features invented for the sake of adding functionality

## 2. Core Principle: Inspect Before Implementing

The reference website is the source of truth. Do not infer its design from the project name or create a conventional real-estate template.

Reference:
https://solenne-tower-demo.vercel.app/

Before coding, open the reference in a browser and inspect the entire experience. Record verified observations separately from assumptions. If browser access is unavailable, state that limitation and request screenshots or use screenshots supplied by the project owner. Do not claim to have inspected interactions that were not accessible.

## 3. Recommended Technology Stack

Use this stack unless inspection reveals a clear technical reason to change it.

| Area | Technology | Purpose |
|---|---|---|
| UI framework | React | Component-based interface |
| Language | TypeScript | Safer state and component contracts |
| Build tooling | Vite | Fast local development and production build |
| Styling | CSS Modules or organized CSS with custom properties | Precise layout and design tokens |
| Animation | Framer Motion (`framer-motion`) | UI transitions and scroll/entry animations when observed |
| Icons | `lucide-react` | Fallback icons only when original icons are unavailable |
| Browser tests | Playwright (`@playwright/test`) | Verify behavior and responsive states |
| 3D rendering | Three.js, only if justified | Use only if the original requires genuine interactive 3D |
| 2D building interaction | SVG + React state, if suitable | Lightweight interactive tower/floor representation |
| Source control | Git | Track implementation changes locally |

### Technical guidelines

- Prefer the simplest implementation that faithfully reproduces the reference.
- Do not add Three.js just to display a static building image.
- If the tower is represented as a 2D illustration in the reference, use SVG, image layers, or CSS rather than an unnecessary 3D scene.
- If the reference uses an actual 3D viewer, assess whether a lightweight 3D implementation is required.
- Keep property/residence data separate from presentational components.
- Avoid large component files and unnecessary dependencies.
- Do not introduce arbitrary gradients, glassmorphism, oversized rounded cards, or generic template styling unless the reference actually uses them.

## 4. Local Setup

Prerequisites:
- Node.js LTS
- npm
- Cursor or another editor with an AI coding agent
- A browser capable of viewing the reference and local application

Create the project:

```bash
npm create vite@latest solenne-recreation -- --template react-ts
cd solenne-recreation
npm install
npm install lucide-react framer-motion
npm install -D @playwright/test
npx playwright install chromium
```

Open the `solenne-recreation` directory in Cursor, or launch Claude Code from that directory.

Run the development server:

```bash
npm run dev
```

Open the local URL printed in the terminal, usually `http://localhost:5173`.

Build locally:

```bash
npm run build
```

Optional preview of the built app:

```bash
npm run preview
```

These commands are for local development and validation only. Hosting and deployment are explicitly out of scope for this document.

## 5. Reference Audit Checklist

Before implementation, inspect the reference at these viewport sizes:

- Desktop: 1440 × 900
- Laptop: 1280 × 800
- Tablet: 768 × 1024
- Mobile: 390 × 844

Also test responsive widths of 360, 390, 768, 1024, 1280, and 1440 CSS pixels.

### Inspect the full page

Record every section in order, from the top of the page to the footer. For each section, note:

- Section purpose and content
- Approximate height and width
- Background color or image
- Text placement and alignment
- Font family, size, weight, line height, and letter spacing
- Image dimensions, crop, focal point, and overlays
- Padding, margins, gaps, and column proportions
- Borders, dividers, shadows, and other visual details
- Entry animations and scroll-triggered behavior
- Mobile layout changes

### Inspect navigation and controls

Test every visible control, including whichever items actually exist in the reference:

- Logo and header links
- Sticky or transparent header behavior
- Mobile menu
- Hero CTA buttons
- Section links and anchor scrolling
- Tower and floor selectors
- Residence cards and details
- Floor-plan navigation
- Gallery controls and lightbox
- Tabs, accordions, dropdowns, and sliders
- Contact/private-tour dialogs
- Forms and validation states
- Footer links

For each control, record:
1. Initial state
2. Hover/focus state
3. Click/tap result
4. State changes
5. Dismissal or reset behavior
6. Keyboard behavior
7. Mobile-specific behavior

### Inspect assets

Identify:
- Logo and branding assets
- Architectural images and renders
- Gallery photographs
- Floor-plan images
- Fonts
- Icons and SVGs
- Background textures and video assets, if any

Use publicly accessible assets only where access and reuse are permitted. Do not attempt to access private source code, credentials, restricted APIs, or private storage. Do not present fabricated imagery as original source material. If an original asset cannot be obtained, use a suitable replacement and document that limitation.

### Audit deliverable

Create `docs/reference-audit.md` before coding. It should include:
- Section-by-section page inventory
- Design observations
- Interaction inventory
- Asset inventory and source paths
- Responsive differences
- Animation notes
- Verified facts versus assumptions
- Unknowns and blockers

## 6. Reference Architecture

Use a component architecture that is small enough to understand and flexible enough to refine. Adjust the suggested components to match the real reference; do not add irrelevant sections just because they appear below.

Suggested structure:

```text
solenne-recreation/
├── public/
│   └── assets/
│       ├── images/
│       ├── floor-plans/
│       ├── fonts/
│       └── icons/
├── docs/
│   ├── reference-audit.md
│   └── implementation-notes.md
├── src/
│   ├── app/
│   │   └── App.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── MobileNavigation.tsx
│   │   ├── Hero.tsx
│   │   ├── TowerExplorer.tsx
│   │   ├── FloorSelector.tsx
│   │   ├── ResidenceDetails.tsx
│   │   ├── FloorPlan.tsx
│   │   ├── Gallery.tsx
│   │   ├── ContactDialog.tsx
│   │   ├── SectionRenderer.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   ├── navigation.ts
│   │   └── residences.ts
│   ├── hooks/
│   │   ├── useMediaQuery.ts
│   │   └── useReducedMotion.ts
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── global.css
│   │   └── components.css
│   ├── utils/
│   │   └── formatters.ts
│   ├── main.tsx
│   └── vite-env.d.ts
├── tests/
│   ├── navigation.spec.ts
│   ├── responsive.spec.ts
│   └── interactions.spec.ts
├── index.html
├── package.json
├── tsconfig.json
└── README.md
```

This is a reference architecture, not a requirement to create every file. Use only components that map to actual reference features. If a section is simple, it may not need its own component.

### Component responsibilities

- **App:** Composes the page sections and owns only the state that genuinely needs to be shared.
- **Header:** Logo, desktop navigation, scroll-dependent appearance, and CTA behavior.
- **MobileNavigation:** Accessible mobile menu with correct open/close and navigation behavior.
- **Hero:** Main hero content, background media, overlays, and CTA.
- **TowerExplorer:** Overall building visualization and coordination of floor/residence selection, if present.
- **FloorSelector:** Floor selection UI and active-state styling, if present.
- **ResidenceDetails:** Details for the currently selected residence, if present.
- **FloorPlan:** Floor-plan display and controls, if present.
- **Gallery:** Image navigation and lightbox behavior, if present.
- **ContactDialog:** Accessible contact or private-tour form, if present.
- **Footer:** Actual footer content and links.
- **Data modules:** Keep residence records and navigation definitions out of the layout components.

## 7. Design System and Visual Fidelity

After the audit, define design tokens in `src/styles/tokens.css`. Do not choose values arbitrarily before inspecting the original.

Example token structure (replace the placeholder values with values measured or estimated from the reference):

```css
:root {
  --color-background: /* measured reference color */;
  --color-foreground: /* measured reference color */;
  --color-muted: /* measured reference color */;
  --color-accent: /* measured reference color */;

  --font-body: /* observed font family */;
  --font-display: /* observed display font family */;

  --text-small: /* measured size */;
  --text-body: /* measured size */;
  --text-heading: /* measured size */;
  --text-display: /* measured size */;

  --page-gutter: /* measured page gutter */;
  --section-space: /* measured section spacing */;
  --content-max-width: /* measured maximum width */;

  --border-subtle: /* observed border color */;
  --transition-fast: /* observed transition duration */;
  --transition-standard: /* observed transition duration */;
}
```

The final CSS must contain valid values rather than comments. The example above illustrates the organization only.

### Visual priorities

Match these in descending order of impact:

1. Overall section structure and geometry
2. Main hero image, crop, focal point, and overlay
3. Typography and line wrapping
4. Header and navigation placement
5. Section spacing and content width
6. Tower/floor visualization and selection states, if present
7. Cards, buttons, and image galleries
8. Animation timing and easing
9. Small borders, shadows, icons, and decorative details

### Images and typography

- Prefer original public assets if access and reuse are permitted.
- Store local project-owned assets under `public/assets/` when appropriate.
- Avoid unstable external image URLs and broken hotlinks.
- Preserve image aspect ratio and focal point.
- Use `object-fit` and `object-position` intentionally.
- Use responsive images and lazy-load noncritical below-the-fold content.
- Load appropriate fonts only where licensing permits.
- Do not approximate the visual identity with arbitrary stock imagery if the original assets are accessible.

## 8. Interactions and State Management

Derive the final interaction list from the reference audit. Implement only observed behaviors.

### Navigation

- All links must navigate to the correct destination or section.
- Smooth scrolling should match the reference and respect reduced-motion settings.
- Sticky header changes should trigger at the appropriate scroll position.
- The mobile menu must open and close, close after navigation when appropriate, and support keyboard use.

### Tower and residence exploration

If the reference contains a tower/floor explorer:

- Represent available floors and residences as structured data.
- Maintain a single clear source of truth for the selected floor and residence.
- Highlight the active floor/residence.
- Update details and floor-plan content when selection changes.
- Make selection work by mouse, touch, and keyboard.
- Provide a sensible initial selection.
- Handle missing or unavailable residence data without crashing.
- Ensure the mobile experience remains usable.

Use an interactive SVG or layered illustration if that matches the reference. Use actual 3D rendering only if needed to reproduce the observed experience.

Example data shape:

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

Populate the data with verified public-facing information where available. Clearly mark illustrative demo values in the UI or documentation. Do not invent actual availability, prices, or other factual property claims.

### Forms and dialogs

If present in the reference:
- Validate required fields.
- Provide visible and accessible error messages.
- Support Escape-to-close where appropriate.
- Return focus to the element that opened a dialog.
- Prevent accidental background interaction when a modal is active.
- Display an honest success state.

Do not claim that an enquiry was sent if no backend or form provider is connected. In a frontend-only demo, state clearly that the submission is simulated.

### Animations

- Use Framer Motion only where it improves fidelity to observed behavior.
- Match duration, easing, and sequence as closely as possible.
- Avoid unnecessary movement and continuous animation.
- Support `prefers-reduced-motion`.
- Do not let animations block interaction or cause layout shifts.
- Keep animation logic reusable and consistent.

## 9. Responsive Design

The site must be intentionally adapted for desktop, tablet, and mobile rather than merely scaled down.

Test at:
- 360 px
- 390 px
- 768 px
- 1024 px
- 1280 px
- 1440 px

Verify:
- No unintended horizontal scrolling
- No overlapping or clipped text
- Appropriate image crop and focal point
- Usable mobile navigation
- Readable type sizes and line lengths
- Touch-friendly controls
- Dialogs that fit within the viewport
- Forms usable with the mobile keyboard
- Tower/floor interaction that remains usable on touch screens
- Correct responsive spacing and column changes

Use CSS Grid, Flexbox, and `clamp()` where appropriate. Match observed responsive breakpoints when they can be identified. Do not assume that every desktop element should remain in the same order on mobile.

## 10. Accessibility and Performance

Implement:
- Semantic HTML and a logical heading hierarchy
- Keyboard navigation and visible focus indicators
- Accessible names for icon-only buttons
- Useful alt text for informative images
- Correct dialog semantics and focus management
- Sufficient text/background contrast
- Reduced-motion support
- Lazy loading for noncritical images
- Responsive image sizing
- No avoidable layout shifts
- No unnecessary continuous render loops
- No console errors or avoidable React warnings

Accessibility and performance must not be sacrificed for superficial visual similarity.

## 11. Testing Strategy

Use Playwright where available.

### Functional tests

Test the features that actually exist in the reference:
- Desktop navigation
- Mobile navigation
- Anchor navigation
- Sticky header behavior
- Floor/residence selection
- Correct details updating after selection
- Gallery/lightbox behavior
- Dialog opening and closing
- Form validation and demo submission state
- Keyboard interaction
- Escape-to-close behavior

### Responsive tests

At the required viewport widths:
- Check horizontal overflow
- Check that key sections render
- Check that menus and dialogs fit
- Check that key controls are visible and operable
- Capture screenshots for comparison

### Build and runtime checks

Run:

```bash
npm run build
npx playwright test
```

Run tests only after the relevant test files and configuration exist. Report actual results and failures. Do not claim that a test passed if it was not run.

## 12. Screenshot-Based Visual Refinement

A functioning page is not necessarily a faithful recreation. Visual refinement is mandatory.

For each important viewport:

1. Capture the reference screenshot.
2. Capture the local implementation screenshot at the same dimensions.
3. Compare section boundaries, hero composition, typography, spacing, alignment, and image crops.
4. Identify the five largest visual mismatches.
5. Fix those mismatches before polishing minor details.
6. Repeat the comparison.
7. Exercise the interactions again after visual changes.

Use full-page screenshots to compare page structure and viewport screenshots to compare detailed alignment. Keep a list of remaining differences in `docs/implementation-notes.md`.

If the original page cannot be accessed in the browser, document the limitation and compare against any screenshots supplied by the project owner. Do not claim pixel-perfect equivalence without evidence.

## 13. Master Coding-Agent Prompt

Paste the following prompt into Cursor Agent or Claude Code after opening the project directory.

---

**ROLE**

Act as a senior frontend engineer, UI reverse-engineering specialist, interaction designer, and browser-testing engineer.

**REFERENCE**

https://solenne-tower-demo.vercel.app/

**MISSION**

Create an independent, high-fidelity recreation of the complete reference website. Reproduce its actual sections, styling, interactions, animations, and responsive behavior. Do not replace the reference with a generic luxury real-estate design.

**MANDATORY SEQUENCE**

### Step 1: Inspect

- Open the reference URL in a browser.
- Explore the complete page and all accessible interaction states.
- Inspect desktop, tablet, and mobile layouts.
- Record sections, typography, colors, spacing, imagery, transitions, and responsive changes.
- Identify publicly accessible assets where reuse is permitted.
- Create `docs/reference-audit.md`.
- Distinguish observed facts from assumptions.
- If browser access fails, state what could not be inspected and request or use screenshots instead of inventing details.

### Step 2: Plan

- Select a component structure based on the actual reference.
- Define design tokens from observations.
- Identify required assets and their sources.
- List all interactions and the state each interaction changes.
- Decide whether the building representation needs SVG, layered images, or true 3D.
- Record any technical constraints in `docs/implementation-notes.md`.

### Step 3: Implement

Use React, TypeScript, Vite, CSS, Framer Motion, and Lucide React where appropriate. Use Playwright for tests. Add Three.js only if the reference genuinely requires 3D rendering.

Build all observed page sections and interactions. Keep content and data separate from presentation. Use real public-facing copy and permitted assets when available. Use clearly identified illustrative values for information that cannot be verified.

Every visible control must work. Do not add irrelevant features or use placeholder buttons with no outcome. Implement responsive layouts and accessible keyboard interactions.

### Step 4: Validate

- Run the development server.
- Open the local site in a browser.
- Compare reference and local screenshots at matching sizes.
- Test every observed interaction.
- Check responsive behavior, console errors, broken assets, and accessibility.
- Run the production build and available Playwright tests.
- Fix major visual discrepancies iteratively.

Do not stop after producing a plan or a basic first render. Continue until the implementation is complete or a clearly documented external limitation prevents further progress.

### Step 5: Report

Provide:
1. Implemented sections and features
2. Project structure
3. Local setup and run commands
4. Tests actually executed and their outcomes
5. Missing assets or unavailable reference behavior
6. Remaining visual discrepancies
7. Any backend or external configuration still needed

**DEFINITION OF DONE**

The complete page is implemented; observed interactions work; desktop and mobile layouts have been checked; major visual mismatches have been iteratively addressed; the production build succeeds; and remaining limitations are documented honestly.

**Begin by inspecting the reference and creating the audit. Then implement, run, test, compare screenshots, and refine the website directly in the workspace.**

---

## 14. Follow-Up Prompts for Iteration

Use these only after the previous stage is complete.

### Follow-up A — Audit only

```text
Inspect the reference website and complete docs/reference-audit.md.
Do not code yet. Record the page sections, exact visible copy where
possible, typography, colors, image crops, interaction states, animations,
and mobile differences. Clearly distinguish verified observations from
assumptions and list anything you could not access.
```

### Follow-up B — Implement the audited design

```text
Implement the complete website based on docs/reference-audit.md.
Build every observed section and interaction, use the correct assets where
available, and match the reference's visual hierarchy and spacing.
Make responsive behavior and accessibility part of the implementation.
Run the local app and production build. Do not claim visual fidelity
without comparing the rendered result against the reference.
```

### Follow-up C — Fix visual differences

```text
Compare screenshots of the original and local implementation at identical
viewport dimensions. Identify and fix the five most visually significant
differences first. Focus on section geometry, typography, image crops,
hero composition, navigation alignment, and spacing. Repeat at desktop
and mobile sizes. Preserve the reference design rather than redesigning it.
```

### Follow-up D — Verify interactions

```text
Audit every visible interactive element against the reference. Test
navigation, mobile menu, selection controls, residence details, gallery,
dialogs, forms, and keyboard behavior wherever those features exist.
Fix nonfunctional controls, incorrect state updates, console errors, and
responsive bugs. Run available Playwright tests and report the actual
results.
```

### Follow-up E — Final code review

```text
Review the entire implementation for duplicate components, unnecessary
dependencies, poor TypeScript types, broken asset paths, layout shifts,
accessibility problems, unused code, and inconsistent design tokens.
Fix the issues, run npm run build, run available tests, and update the
README and docs/implementation-notes.md. Report remaining limitations
without claiming unverified success.
```

## 15. Final Acceptance Checklist

Use this checklist before considering the local recreation complete.

- [ ] Reference audit is complete.
- [ ] Every section is present in the correct order.
- [ ] Hero composition and imagery are close to the reference.
- [ ] Typography, text wrapping, and spacing have been compared.
- [ ] Header and navigation behave correctly.
- [ ] All observed interactions are functional.
- [ ] Tower/floor/residence selection works if present in the reference.
- [ ] Forms and dialogs behave honestly and accessibly.
- [ ] Mobile and tablet layouts have been checked.
- [ ] No unintended horizontal overflow exists.
- [ ] Images and fonts load correctly.
- [ ] Reduced-motion preferences are supported.
- [ ] Keyboard navigation and focus states work.
- [ ] Browser console has no critical errors.
- [ ] Production build succeeds.
- [ ] Available automated tests have been run.
- [ ] Screenshots have been compared at matching viewport sizes.
- [ ] Remaining visual or technical differences are documented.
- [ ] README explains local development and project structure.

**Success criterion:** A complete, interactive, responsive local implementation that closely follows the observed reference—not merely a similar-looking landing page.
