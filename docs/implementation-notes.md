# Implementation Notes: The Solenne Recreation

## Architecture & Technology Decisions

### 1. Framework & Rendering Strategy
- **React 18 + TypeScript + Vite**: Chosen per the brief's default recommendation and modern engineering practices.
- **Direct GPU Plane Transforms**: To maintain 60fps performance identical to the reference, the 3 principal photographic layers (`towerPlane`, `unitPlane`, `roomPlane`) operate on fixed `5504 × 3072` (16:9) coordinate canvases, transformed via hardware-accelerated CSS `translate3d` and `scale`.
- **Zero-Latency Video Playback**: All MP4 video transition clips are fetched into browser memory Blob URLs (`URL.createObjectURL(blob)`) ahead of interaction, preventing any network stutter or buffering when a user enters a floor or room.
- **Lead Camera Matrix Interpolation**: The reference's tracked camera motion (`lead: [[scale, dx, dy], ...]`) was reverse-engineered and fully integrated. When entering a floor, the static photography moves with the drone camera trajectory while dissolving with a cubic smoothstep ($x^2 \times (3 - 2x)$), eliminating lighting pops between floors.

### 2. Verified Data Model
- **30 SVG Floor Bands**: Precisely positioned along the Biscayne Bay tower facade (X range: 2218 to 3282, Y range: 247 down to 2453).
- **Residences**:
  - Floors 4 to 29: Residence A (2 Bed · 2 Bath · 1,450 SF), Base price $1.29M + $18k/floor.
  - Floors 30 to 33: Corner Penthouse (3 Bed · 3.5 Bath · 3,200 SF), Base price $5.4M + $600k/floor. Floor 33 custom label "Sky Penthouse".
- **Deterministic Availability Algorithm**: Preserved exact formula `(floor * 2654435761) % 97` producing identical 'Available', 'Reserved', and 'Sold' allocations.

### 3. Responsive Adaptations
- **Desktop (1440 & 1280)**: Fixed floating floor tag anchored to the right tower facade border, right-side sliding residence card, floating bottom hint, custom difference-blend circular cursor.
- **Tablet (1024 & 768)**: Fluid scaling with safe-area considerations.
- **Mobile (390 & 360)**:
  - Header links collapsed, retaining Brand mark and compact Private Tour CTA.
  - Floor Tag transformed into an elegant bottom sheet card with an explicit "Enter floor N" button.
  - First tap selects floor, second tap (or button tap) launches drone dive.
  - Hint text automatically changes to "Tap a floor to explore".
  - Residence details and room chips re-stack horizontally for thumb reachability.
  - Zero horizontal overflow (`scrollWidth <= clientWidth` on all screens).

### 4. Accessibility
- All interactive controls have semantic roles, accessible labels, visible gold `:focus-visible` rings, and keyboard Escape support to return to previous views.
- Full support for `prefers-reduced-motion: reduce`.

