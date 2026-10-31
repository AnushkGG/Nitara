# Nitaara Tower — Scraped Asset Review & Visual Audit

**Phase:** N1 — Harvest Assets & Content  
**Status:** Complete (30 of 30 assets harvested, 0 FAIL)  
**Manifest Path:** `public/assets/nitaara/manifest.json`  

---

## 1. Banner Renders & Tower Suitability Analysis

The builder site features 4 desktop banner visuals (`desk1`–`desk4`) and 3 mobile portrait visuals (`mob1`–`mob3`). Each was visually inspected to determine tower visibility and floor count:

| Asset | Dimensions | Bytes | Depiction | Visible Floor Count | Suitable for Interactive Tower Explorer? |
|---|---|---|---|---|---|
| `banner/desk1.jpg` | 2000 × 857 | 110,304 | **Primary Street Perspective (Full Tower)**. Ground-level street view showing the entire vertical extent of the high-rise against a clear blue daytime sky. Features trees and arrival road at base, 25 habitable residential floors, and architectural orange crown terrace at the summit. | **25 Residential Floors** clearly delineated by window/balcony slabs + Level 26 Rooftop Sky Crown. | **YES — Primary Choice.** Clean vertical orientation, sharp slab lines, and natural street-level viewpoint ideal for floor hover & selection. |
| `banner/desk2.jpg` | 2000 × 857 | 85,506 | **Aerial Highway Sunset (Full Tower)**. Elevated sunset drone view showing the expressway flyover in the foreground and the full tower from the opposite side. | **25 Residential Floors** + Level 26 Sky Terrace. | **Alternative / Hero Visual.** Elevated perspective makes bottom podium hit-areas slightly angled, but excellent for architectural beauty shots. |
| `banner/desk3.jpg` | 2000 × 857 | 164,139 | **Rooftop Sky Deck & Swimming Pool**. Aerial top-down view looking down onto Level 26 ("Leisure Beyond the Azure Expanse"). Shows infinity-edge swimming pool, wooden sun deck, landscaped lawn, lounge cabanas, and children's water play zone. | Top terrace (Level 26) only. | **YES — Sky Amenities Hero.** Perfect for level 26 hover or modal inspection. |
| `banner/desk4.jpg` | 2000 × 857 | 162,036 | **Entrance Gate & Arrival Podium**. Ground-level eye view showing the security checkpoint, "NITAARA TOWER" signage wall, modern architectural canopy, palm trees, and arrival driveway. | Ground / Entrance level only. | **YES — Overview Section.** Illustrates ground arrival and security entry. |
| `banner/mob1.jpg` | 500 × 600 | 226,499 | **Mobile Portrait Street View**. Vertical crop of `desk1.jpg` centered on the tower with foreground driveway and sports car. | 25 Residential Floors + Crown. | **YES — Mobile Tower Explorer Base.** Matches mobile screen aspect ratio. |
| `banner/mob2.jpg` | 500 × 600 | 295,475 | **Mobile Portrait Aerial Sunset**. Vertical crop of `desk2.jpg` focusing on the tower glowing against the evening sky. | 25 Residential Floors + Crown. | **Alternative Mobile Hero.** |
| `banner/mob3.jpg` | 500 × 600 | 363,949 | **Mobile Rooftop Pool Top-Down**. Vertical crop of `desk3.jpg` showing the swimming pool and rooftop facilities. | Rooftop only. | **Mobile Amenities Section.** |

### Recommendation for Phase N2:
Use `banner/desk1.jpg` as the primary base for the desktop Tower Explorer, and `banner/mob1.jpg` for the mobile viewport. Both preserve the full 25 habitable floors from slab 1 to slab 25 without perspective warping or occluding highway barriers.

---

## 2. Floor Plan Schedule & Unit Layouts

All 4 floor plan assets were reviewed, and their embedded architectural schedules and labels were verified:

| Asset | Dimensions | Depiction | Red Label on Drawing | Flat Mapping | RERA Carpet | Balcony | Total Usable Area |
|---|---|---|---|---|---|---|---|
| `floorplan/floor-plan1.jpg` | 1000 × 543 | **3 BHK Unit Plan (Type 01)** | `3 BHK TYPE 01` | Flat X01 (e.g. 101, 201..2501) | 1,058 sq ft | 189 sq ft | **1,247 sq ft** |
| `floorplan/floor-plan2.jpg` | 1000 × 543 | **3 BHK Unit Plan (Type 02)** | `3 BHK TYPE 02` | Flat X02 (e.g. 102, 202..2502) | 1,050 sq ft | 195 sq ft | **1,245 sq ft** |
| `floorplan/floor-plan3.jpg` | 1000 × 543 | **4 BHK Unit Plan** | `4 BHK` | Flat X03 (e.g. 103, 203..2503) | 1,380 sq ft | 212 sq ft | **1,592 sq ft** |
| `floorplan/master-plan.jpg` | 1000 × 543 | **Official First Floor Plan & Schedule** | `FIRST FLOOR PLAN` | Complete Floor Wing Layout | All 3 units + Lift Core | - | Full Floor (3 flats/floor + 2 podium gardens) |

### Detailed Room Dimensions from Unit Plans:
- **3 BHK Type 01 (1,247 sq ft):**
  - Living & Dining: 19'0" × 13'10"
  - Open Balcony: 15'0" × 5'0"
  - Kitchen: 13'0" × 8'5" + Utility: 8'6" × 4'0"
  - Primary Bedroom: 11'5" × 14'2" + Walk-in Closet: 6'9" × 7'6" + Ensuite Bath: 5'0" × 7'10"
  - Bedroom 2: 12'4" × 13'5" + Private Balcony: 7'0" × 3'3"
  - Bedroom 3: 10'3" × 14'0" + Ensuite Bath: 5'0" × 8'0"
  - Common Bathroom: 6'5" × 4'10"
  - Foyer / Entrance: 4' wide private entry
- **3 BHK Type 02 (1,245 sq ft):**
  - Living & Dining: 19'0" × 13'10"
  - Open Balcony: 15'0" × 5'0"
  - Kitchen: 13'0" × 8'5" + Utility: 8'6" × 4'0"
  - Primary Bedroom: 11'5" × 14'2" + Walk-in Closet: 6'9" × 7'6" + Ensuite Bath: 5'0" × 7'10"
  - Bedroom 2: 12'4" × 13'5" + Private Balcony: 7'0" × 3'3"
  - Bedroom 3: 10'3" × 14'0" + Ensuite Bath: 5'0" × 8'0"
  - Common Bathroom: 6'5" × 4'10"
- **4 BHK (1,592 sq ft):**
  - Living: 14'9" × 18'4" + Open Balcony: 14'7" × 6'0"
  - Dining: 9'3" × 11'4"
  - Kitchen: 9'0" × 9'11" + Utility: 9'0" × 4'0"
  - Master Bedroom: 18'0" × 10'9" + Balcony: 8'0" × 3'6" + Ensuite Bath: 8'0" × 5'0"
  - Bedroom 2: 18'0" × 10'4" + Ensuite Bath: 4'10" × 8'0"
  - Bedroom 3: 10'3" × 10'9" + Ensuite Bath: 5'0" × 8'0"
  - Bedroom 4 / Study: 10'3" × 10'9" + Common Bath: 4'9" × 8'0"
  - Entrance: 4' wide entry gallery

---

## 3. Amenities Asset Review

All 7 amenity images are 1000 × 543 JPEGs depicting the builder's lifestyle amenities:

1. `amenities/co-working-space.jpg`: Modern shared work pods, ergonomic seating, warm ambient task lighting.
2. `amenities/gym.jpg`: State-of-the-art fitness center with cardio equipment, weights, and mirrored walls.
3. `amenities/indoor-games.jpg`: Games lounge featuring table tennis, billiards, and board game zones.
4. `amenities/kids-play-area.jpg`: Soft-fall safety surface, slide structures, and vibrant play equipment.
5. `amenities/lobby.jpg`: Double-height air-conditioned entrance lobby with marble cladding and reception desk.
6. `amenities/senior-citizen-sitout-area.jpg`: Landscaped garden benches under pergola shade with walking paths.
7. `amenities/yoga-deck.jpg`: Wooden open-air deck surrounded by planters for morning yoga & meditation.

---

## 4. Brand & Authority Assets

- `logo-white2.png` (1000 × 500 PNG): Official Nitaara Tower brand mark in crisp white, containing tower emblem and tagline *"The Tallest Landmark of Nigdi Pradhikaran"*.
- `logo-favcon.png` (100 × 100 PNG): Square icon version for browser tabs and mobile bookmarks.
- `rera.png` (150 × 150 PNG): MahaRERA registration badge with registered number `P52100050692`.
- `qr1.jpg` (100 × 100 JPG): Official MahaRERA QR code scannable directly to the Maharashtra RERA project certificate.
- `landmark.png`, `delivery.png`, `construction.png`: Circular icons for builder trust points (*Admired Landmarks*, *Consistently On-Time Delivery*, *Quality Construction*).
- `project-by.png`: Developer joint venture lockup (ABC Corp, Mittal Group, Success Group).
- `map.jpg` (1500 × 1052 JPG): Detailed vicinity roadmap showing connectivity to Expressway, Metro, Akurdi Station, and PCMC.
- `texture-bg.jpg` (2000 × 1012 JPG): Subtle textured background pattern used in developer sections.

