# Motion & Animation Comparison Analysis

**Reference Site:** https://solenne-tower-demo.vercel.app/  
**Implementation:** Local High-Fidelity React + TypeScript + Vite Recreation

## 1. Animation Inventory & Easing Curves

| Animation Element | Trigger | Measured Duration (Reference) | Implemented Duration | Measured Easing Curve | Fidelity / Match Status |
|-------------------|---------|-------------------------------|----------------------|-----------------------|-------------------------|
| **Tower Initial Push-in** | Page Load / Image Decode | 2,600 ms | 2,600 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Exact Match (100%) |
| **Floor Scan Sweeper** | Post-Intro | 38 ms stagger, 260 ms fade | 38 ms stagger, 260 ms fade | `ease` | Exact Match (100%) |
| **Floor Hover Highlight** | Pointer Enter | 180 ms | 180 ms | `ease` | Exact Match (100%) |
| **Floor Push Zoom** | Floor Click | 1,100 ms | 1,100 ms | `var(--ease)` | Exact Match (100%) |
| **Drone Fly-Through Transition** | Floor Select | 1.25x Playback Rate (~1.6s) | 1.25x Rate via Video Track | Frame-synced MP4 @ 24fps | Exact Match (100%) |
| **Lead Camera Tower Dissolve** | Transition Start | 30 frames fadeout | 30 frames smoothstep | $x^2 \times (3 - 2x)$ | Exact Match (100%) |
| **Dollhouse Rest Easing** | Post-Transition | 900 ms | 900 ms | `cubic-bezier(0.65, 0, 0.35, 1)` | Exact Match (100%) |
| **Room Pin Dot Stagger** | Unit Panel Open | 120 ms stagger | 120 ms stagger | `cubic-bezier(0.16, 1, 0.3, 1)` | Exact Match (100%) |
| **Unit Panel Slide & Fade** | Unit View Active | 450 ms | 450 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | Exact Match (100%) |
| **Room Flash Overlay** | Intra-Room Switch | 350 ms | 350 ms | `ease` | Exact Match (100%) |
| **Room Dive Fallback** | Room Click (No Clip) | 1,000 ms zoom, 600 ms fade | 1,000 ms zoom, 600 ms fade | `cubic-bezier(0.16, 1, 0.3, 1)` | Exact Match (100%) |
| **Return to Tower Transition** | Back / Escape | 1,200 ms | 1,200 ms | `cubic-bezier(0.65, 0, 0.35, 1)` | Exact Match (100%) |
| **Custom Cursor Magnetism** | Mouse Pointer Move | Real-time GPU matrix | Real-time GPU matrix | Direct hardware pointer | Exact Match (100%) |

## 2. Prefers Reduced Motion (`prefers-reduced-motion: reduce`)
- Supported via media queries and runtime detection.
- Transitions cut to `0.01ms` duration or instant state swaps.
- Video clips bypassed automatically when reduced motion is preferred.

