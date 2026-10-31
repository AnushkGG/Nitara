# Nitaara Tower — Brand Style & Design Tokens

**Sourced From:** https://nitaaratowernigdi.com/ (Computed styles & CSS extraction)  
**Target:** Pitch Prototype (Track B)  

---

## 1. Color Palette

The builder's visual identity balances warm architectural gold with high-contrast obsidian charcoal and crisp architectural whites:

### Primary Palette
| Token Name | Hex Code | Usage | Role in UI |
|---|---|---|---|
| `--color-accent-gold` | `#c59b3c` | Primary CTAs, active highlights, badges, borders, prices | Primary Brand Accent |
| `--color-accent-gold-hover` | `#d4af37` | Hover states, glowing outlines, active tab indicators | Interactive Glow |
| `--color-accent-gold-dark` | `#9c7728` | Shadow tints, pressed button states, subdued text | Low-emphasis Gold |
| `--color-bg-dark` | `#22211f` | Hero backgrounds, primary cards, modals, navigation bar | Canvas Dark Base |
| `--color-bg-surface` | `#2b2a28` | Secondary cards, floor selector drawer, unit specs panel | Surface Elevation 1 |
| `--color-bg-surface-elevated` | `#363532` | Hovered floor cards, table header strips, tooltips | Surface Elevation 2 |

### Neutral & Contrast Palette
| Token Name | Hex Code | Usage |
|---|---|---|
| `--color-text-primary` | `#ffffff` | Primary headings, tower tags, key values |
| `--color-text-secondary` | `#e0deda` | Subheadings, descriptions, carpet specs |
| `--color-text-muted` | `#aaaaaa` | Disclaimers, footer notes, minute labels |
| `--color-border-subtle` | `rgba(197, 155, 60, 0.2)` | Card borders, table dividers, divider lines |
| `--color-border-active` | `rgba(197, 155, 60, 0.8)` | Focused elements, selected floor bands |
| `--color-bg-light` | `#f7f7f7` | Alternative light section background (disclaimer/specs) |

---

## 2. Typography

The builder site relies on a classic architectural display typeface (`Tw Cen MT`) paired with a clean geometric sans-serif (`Roboto`):

```css
:root {
  --font-display: 'Tw Cen MT', 'TwCenMT', 'Cinzel', serif, sans-serif;
  --font-sans: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', monospace;
}
```

### Type Scale & Hierarchy
- **Tower Headline / Hero Tagline:** `font-family: var(--font-display); font-size: 2.25rem (36px); font-weight: 700; letter-spacing: 0.05em; color: var(--color-accent-gold);`
- **Section Titles:** `font-family: var(--font-display); font-size: 1.75rem (28px); font-weight: 600; text-transform: uppercase;`
- **Floor & Unit Numbers:** `font-family: var(--font-display); font-size: 1.5rem (24px); font-weight: 700;`
- **Body & Specs:** `font-family: var(--font-sans); font-size: 0.9375rem (15px); line-height: 1.6; font-weight: 400;`
- **Pricing & Highlights:** `font-family: var(--font-sans); font-size: 1.25rem (20px); font-weight: 700; color: var(--color-accent-gold);`
- **Legal & Disclaimers:** `font-family: var(--font-sans); font-size: 0.75rem (12px); color: var(--color-text-muted);`

---

## 3. UI Component Patterns

### CTAs & Buttons
- **Primary CTA ("Request Site Visit" / "Enquire Now"):**
  - Background: `#c59b3c`
  - Color: `#ffffff`
  - Padding: `12px 24px`
  - Border-Radius: `4px`
  - Hover: Background `#d4af37`, transform `translateY(-1px)`
- **Secondary CTA ("Floor Plans" / "WhatsApp"):**
  - Background: `transparent`
  - Border: `1px solid #c59b3c`
  - Color: `#c59b3c`
  - Hover: Background `rgba(197, 155, 60, 0.15)`

### RERA Compliance Badge
- Always render MahaRERA badge with `P52100050692` in header, unit enquiry drawer, and footer.
- QR Code thumbnail links directly to the Maharashtra RERA official verification portal.

### Legal Concept Stamp
- Prototype header / footer explicitly carries:
  *"Concept Pitch Prototype. Not an official website. All details tentative, subject to the developer's disclaimer."*

