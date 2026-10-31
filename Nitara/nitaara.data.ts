// src/data/nitaara.data.ts
// Single source of truth for the client project. Replaces the Solenne data module.
// RULE: every `null` below is UNKNOWN. Do not guess. Get it from the builder / MahaRERA / brochure
// and then fill it in. Each value carries a `source` so QA can trace it.

export type Src = "builder-site" | "aggregator" | "client-confirmed" | "unknown";

export const project = {
  name: "Nitaara Tower",
  tagline: "The Tallest Landmark of Nigdi Pradhikaran", // builder-site hero
  location: "Nigdi Pradhikaran, Pune",
  address:
    "Nitaara Tower, Plot No. C8, Sector No. 24, Bhakti Shakti Chowk, Nigdi Pradhikaran, Pune - 411 044", // builder-site
  developers: ["ABC Corp", "Mittal Group", "Success Group"], // builder-site "About"
  rera: { number: "P52100050692", portal: "https://maharera.mahaonline.gov.in" }, // builder-site; MUST be shown (RERA)
  phones: ["+918600612808", "9890288871"], // both appear on builder site: confirm primary with client
  whatsappText: "Hello! I would like to visit your project.",
  disclaimer:
    "All Details in this Website are for easy information & concept purposes only, And do not form part of the Agreement. This Website is Tentative & Developers Reserve the right to make variations and Modification.",
} as const;

// ---- Tower geometry: the numbers that drive the explorer -------------------------------------
// Builder's site does NOT state floors or height. Aggregators conflict (sibling projects list 5-6
// floors; a registry entry shows a "Floor 13, Unit 1301", so the tower has AT LEAST 13 floors).
// => Must be confirmed. Until then the app should refuse to render a floor count it can't source.
export const tower = {
  totalFloors: null as number | null,        // e.g. "G+N" from MahaRERA building details / brochure
  floorsLabel: null as string | null,        // exact wording, e.g. "G + 3P + 18" if that is what they use
  podiumOrParkingLevels: null as number | null,
  heightMeters: null as number | null,       // show in UI ONLY if confirmed; never estimate in copy
  wings: 1,                                  // aggregator: single building, cross-shaped footprint [aggregator]
  totalUnits: 36,                            // [aggregator: Square Yards] confirm with client
  landAcres: 0.57,                           // [aggregator] confirm
  possession: "Mar 2028",                    // [aggregator / RERA listings] confirm
  hasFloorTwelveSkipped: null as boolean | null, // some towers skip 13: confirm numbering
};

// ---- Unit types (from builder site "Configuration" table) -------------------------------------
export type UnitType = {
  id: string;
  label: string;           // "3 BHK"
  carpetSqFt: number;
  priceLabel: string;      // builder shows all-inclusive prices
  priceNote: string;
  floorPlanSrc: string | null; // map after viewing Floor Plan1..5 (see brief N3)
  source: Src;
};

export const unitTypes: UnitType[] = [
  { id: "3bhk-1245", label: "3 BHK", carpetSqFt: 1245, priceLabel: "₹1.85 Cr", priceNote: "All inclusive", floorPlanSrc: null, source: "builder-site" },
  { id: "3bhk-1247", label: "3 BHK", carpetSqFt: 1247, priceLabel: "₹1.85 Cr", priceNote: "All inclusive", floorPlanSrc: null, source: "builder-site" },
  { id: "4bhk-1592", label: "4 BHK", carpetSqFt: 1592, priceLabel: "₹2.36 Cr", priceNote: "All inclusive", floorPlanSrc: null, source: "builder-site" },
];
// NOTE: the builder gives ONE price per type, not per floor. Do not invent floor-rise pricing.

// ---- Which unit sits on which floor: UNKNOWN until the typical-floor plan / brochure is read ----
export type FloorUnit = { unitNo: string; typeId: string; availability: "available" | "sold" | "enquire" };
export type Floor = { number: number; units: FloorUnit[] | null };
export function buildFloors(): Floor[] {
  if (tower.totalFloors == null) throw new Error("tower.totalFloors is not confirmed - see brief N0");
  return Array.from({ length: tower.totalFloors }, (_, i) => ({ number: i + 1, units: null }));
}

// ---- Images (after running scripts/scrape-nitaara.mjs) ----------------------------------------
const A = "/assets/nitaara";
export const images = {
  logo: `${A}/logo-white2.png`,
  bannerDesktop: [1, 2, 3, 4].map((n) => `${A}/banner/desk${n}.jpg`), // which one is the full-tower render? decide in N2
  bannerMobile: [1, 2, 3].map((n) => `${A}/banner/mob${n}.jpg`),
  about: `${A}/about.jpg`,
  locationMap: `${A}/map.jpg`,
  masterPlan: `${A}/floorplan/master-plan.jpg`,
  floorPlans: [
    `${A}/floorplan/floor-plan1.jpg`, `${A}/floorplan/floor-plan2.jpg`, `${A}/floorplan/floor-plan3.jpg`,
    `${A}/floorplan/floor-plan4.png`, `${A}/floorplan/floor-plan5.png`,
  ],
  rera: `${A}/rera.png`,
  reraQr: `${A}/qr1.jpg`,
  amenities: [
    { name: "Co-working space", src: `${A}/amenities/co-working-space.jpg` },
    { name: "Gym", src: `${A}/amenities/gym.jpg` },
    { name: "Indoor games", src: `${A}/amenities/indoor-games.jpg` },
    { name: "Kids play area", src: `${A}/amenities/kids-play-area.jpg` },
    { name: "Lobby", src: `${A}/amenities/lobby.jpg` },
    { name: "Senior citizen sit-out area", src: `${A}/amenities/senior-citizen-sitout-area.jpg` },
    { name: "Yoga deck", src: `${A}/amenities/yoga-deck.jpg` },
  ],
};

// ---- Connectivity (verbatim from builder site, minutes) ----------------------------------------
export const nearby = {
  conveniences: [["D Mart", 1], ["Elpro mall", 10], ["Akurdi railway station", 10], ["Star bazaar", 5], ["Appu ghar", 5], ["Sentosa water park", 10], ["Bhakti shakti garden", 1], ["Cityone mall", 5]],
  connectivity: [["Old Mumbai Pune expressway", 1], ["Bhakti shakti metro", 3], ["Bhakti shakti bus stop", 2], ["Akurdi railway station", 10], ["Chinchwad station", 10], ["Chakan MIDC", 15], ["Talwade MIDC", 10], ["PCMC main building", 10], ["Pimpri market", 12]],
  education: [["Dnyan prabhodhani school", 5], ["DY Patil College", 10], ["St Ursula school", 6], ["City pride School", 5], ["SB Patil College", 10], ["Pratibha jr clg", 5], ["PCCOE college", 10], ["Elpro international school", 10], ["Kamal Nayan Bajaj school", 10]],
} as const;
