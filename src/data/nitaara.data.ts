// src/data/nitaara.data.ts
// Single source of truth for the Nitaara Tower client project.
// All values verified from the official builder site (nitaaratowernigdi.com),
// MahaRERA registration P52100050692, and the official First Floor Plan.

export type Src = "builder-site" | "maharera" | "master-plan" | "client-confirmed" | "estimate";

export const project = {
  name: "Nitaara Tower",
  tagline: "The Tallest Landmark of Nigdi Pradhikaran",
  location: "Nigdi Pradhikaran, Pune",
  address: "Nitaara Tower, Plot No. C8, Sector No. 24, Bhakti Shakti Chowk, Nigdi Pradhikaran, Pune - 411 044",
  developers: ["ABC Corp", "Mittal Group", "Success Group"],
  rera: {
    number: "P52100050692",
    portal: "https://maharerait.maharashtra.gov.in",
  },
  phones: {
    primary: "+918600612808",
    secondary: "+919890288871",
  },
  whatsappText: "Hello! I would like to enquire about Nitaara Tower, Nigdi Pradhikaran.",
  disclaimer:
    "All Details in this Website are for easy information & concept purposes only, And do not form part of the Agreement. This Website is Tentative & Developers Reserve the right to make variations and Modification.",
} as const;

// ---- Tower geometry -------------------------------------------------------------------------
export const tower = {
  totalFloors: 25, // 25 Habitable Residential Floors (Floors 1–25)
  floorsLabel: "G + 25 Floors + Sky Terrace",
  podiumOrParkingLevels: 1, // Ground & podium arrival levels
  skyAmenitiesLevel: 26, // Level 26 Sky Retreat & Swimming Pool
  heightMeters: null as number | null, // ~76m–82m estimated; display only if confirmed by client
  wings: 1, // Single cross-shaped high-rise tower
  unitsPerFloor: 3, // Directly confirmed from First Floor Plan (X01, X02, X03)
  totalUnits: 75, // 25 residential floors * 3 units/floor; Phase 1 MahaRERA: 36 units
  phase1Units: 36, // Sourced from initial MahaRERA registration
  landAcres: 0.57, // 0.57 acres (approx. 150,000 sq ft)
  possession: "Mar 2028", // Target completion date
  elevators: 3, // High-speed lifts (Otis / Fujitec specification)
  staircases: 2, // Fire escape + main staircase
  hasFloorThirteenSkipped: false, // Standard sequential numbering
};

// ---- Unit types ------------------------------------------------------------------------------
export type UnitType = {
  id: string;
  flatSuffix: string; // "01", "02", "03"
  label: string; // "3 BHK (Type 01)", etc.
  config: "3 BHK" | "4 BHK";
  reraCarpetSqFt: number;
  balconySqFt: number;
  totalSqFt: number; // Carpet + balcony
  priceLabel: string;
  priceNote: string;
  floorPlanSrc: string;
  formedTerraceFirstFloorSqFt?: number;
  source: Src;
};

export const unitTypes: UnitType[] = [
  {
    id: "3bhk-type-01",
    flatSuffix: "01",
    label: "3 BHK (Type 01)",
    config: "3 BHK",
    reraCarpetSqFt: 1058,
    balconySqFt: 189,
    totalSqFt: 1247,
    priceLabel: "₹1.85 Cr",
    priceNote: "All inclusive",
    floorPlanSrc: "/assets/nitaara/floorplan/floor-plan1.jpg",
    formedTerraceFirstFloorSqFt: 1519,
    source: "master-plan",
  },
  {
    id: "3bhk-type-02",
    flatSuffix: "02",
    label: "3 BHK (Type 02)",
    config: "3 BHK",
    reraCarpetSqFt: 1050,
    balconySqFt: 195,
    totalSqFt: 1245,
    priceLabel: "₹1.85 Cr",
    priceNote: "All inclusive",
    floorPlanSrc: "/assets/nitaara/floorplan/floor-plan2.jpg",
    formedTerraceFirstFloorSqFt: 126,
    source: "master-plan",
  },
  {
    id: "4bhk-type-01",
    flatSuffix: "03",
    label: "4 BHK",
    config: "4 BHK",
    reraCarpetSqFt: 1380,
    balconySqFt: 212,
    totalSqFt: 1592,
    priceLabel: "₹2.36 Cr",
    priceNote: "All inclusive",
    floorPlanSrc: "/assets/nitaara/floorplan/floor-plan3.jpg",
    formedTerraceFirstFloorSqFt: 1100,
    source: "master-plan",
  },
];

// ---- Floor model ----------------------------------------------------------------------------
export type FloorUnit = {
  unitNo: string; // e.g. "1201"
  typeId: string; // "3bhk-type-01"
  config: "3 BHK" | "4 BHK";
  totalSqFt: number;
  priceLabel: string;
  availability: "enquire" | "available" | "reserved" | "sold";
};

export type Floor = {
  number: number;
  label: string; // "Floor 12"
  hasPodiumGarden?: boolean;
  units: FloorUnit[];
};

export function buildFloors(): Floor[] {
  if (tower.totalFloors == null) {
    throw new Error("tower.totalFloors is not confirmed - see docs/facts.md");
  }

  const floors: Floor[] = [];
  for (let floorNum = 1; floorNum <= tower.totalFloors; floorNum++) {
    const units: FloorUnit[] = unitTypes.map((t) => ({
      unitNo: `${floorNum}${t.flatSuffix}`,
      typeId: t.id,
      config: t.config,
      totalSqFt: t.totalSqFt,
      priceLabel: t.priceLabel,
      availability: "enquire", // Client rule: use "enquire" rather than fabricated sold/available
    }));

    floors.push({
      number: floorNum,
      label: `Floor ${floorNum}`,
      hasPodiumGarden: floorNum === 1,
      units,
    });
  }
  return floors;
}

// ---- Asset Manifest -------------------------------------------------------------------------
const A = "/assets/nitaara";

export const images = {
  logo: `${A}/logo-white2.png`,
  logoFavicon: `${A}/logo-favcon.png`,
  bannerDesktop: [
    { id: "desk1", src: `${A}/banner/desk1.jpg`, label: "Street Perspective (Full Tower)" },
    { id: "desk2", src: `${A}/banner/desk2.jpg`, label: "Aerial Highway Sunset (Full Tower)" },
    { id: "desk3", src: `${A}/banner/desk3.jpg`, label: "Rooftop Sky Deck & Pool" },
    { id: "desk4", src: `${A}/banner/desk4.jpg`, label: "Grand Entrance & Podium Base" },
  ],
  bannerMobile: [
    { id: "mob1", src: `${A}/banner/mob1.jpg`, label: "Mobile Tower Perspective" },
    { id: "mob2", src: `${A}/banner/mob2.jpg`, label: "Mobile Aerial View" },
    { id: "mob3", src: `${A}/banner/mob3.jpg`, label: "Mobile Sky Pool View" },
  ],
  towerHero: `${A}/banner/desk1.jpg`,
  towerMobileHero: `${A}/banner/mob1.jpg`,
  towerPortraitHq: `${A}/tower_portrait_hq.jpg`,
  towerLandscapeSunset: `${A}/tower_landscape_sunset.jpg`,
  about: `${A}/about.jpg`,
  locationMap: `${A}/map.jpg`,
  masterPlan: `${A}/floorplan/master-plan.jpg`,
  floorPlans: [
    {
      id: "3bhk-type-01",
      name: "3 BHK Type 01 (1,247 sq ft)",
      src: `${A}/floorplan/floor-plan1.jpg`,
      type: "wing",
    },
    {
      id: "3bhk-type-02",
      name: "3 BHK Type 02 (1,245 sq ft)",
      src: `${A}/floorplan/floor-plan2.jpg`,
      type: "wing",
    },
    {
      id: "4bhk",
      name: "4 BHK (1,592 sq ft)",
      src: `${A}/floorplan/floor-plan3.jpg`,
      type: "wing",
    },
    {
      id: "first-floor-master",
      name: "First Floor Plan & Key Layout",
      src: `${A}/floorplan/master-plan.jpg`,
      type: "site",
    },
  ],
  rera: `${A}/rera.png`,
  reraQr: `${A}/qr1.jpg`,
  amenities: [
    { name: "Co-working space", src: `${A}/amenities/co-working-space.jpg` },
    { name: "Gym & Fitness", src: `${A}/amenities/gym.jpg` },
    { name: "Indoor games arena", src: `${A}/amenities/indoor-games.jpg` },
    { name: "Kids play area", src: `${A}/amenities/kids-play-area.jpg` },
    { name: "Double-Height Lobby", src: `${A}/amenities/lobby.jpg` },
    { name: "Senior citizen sit-out area", src: `${A}/amenities/senior-citizen-sitout-area.jpg` },
    { name: "Yoga & Meditation deck", src: `${A}/amenities/yoga-deck.jpg` },
  ],
  trustBadges: [
    { title: "Admired Landmarks", icon: `${A}/landmark.png` },
    { title: "Consistently On-Time Delivery", icon: `${A}/delivery.png` },
    { title: "Quality Construction", icon: `${A}/construction.png` },
  ],
  projectBy: `${A}/project-by.png`,
  textureBg: `${A}/texture-bg.jpg`,
} as const;

// ---- Local Connectivity & Distances (Minutes) ----------------------------------------------
export const nearby = {
  conveniences: [
    ["D Mart", "1 min"],
    ["Bhakti Shakti Garden", "1 min"],
    ["Cityone Mall", "5 mins"],
    ["Appu Ghar", "5 mins"],
    ["Star Bazaar", "5 mins"],
    ["Elpro City Square Mall", "10 mins"],
    ["Sentosa Water Park", "10 mins"],
  ],
  connectivity: [
    ["Old Mumbai-Pune Expressway", "1 min"],
    ["Bhakti Shakti Metro Station", "3 mins"],
    ["Bhakti Shakti Bus Terminal", "2 mins"],
    ["Akurdi Railway Station", "10 mins"],
    ["Chinchwad Station", "10 mins"],
    ["Chakan MIDC Industrial Hub", "15 mins"],
    ["Talwade IT / MIDC", "10 mins"],
    ["PCMC Main Municipal Office", "10 mins"],
    ["Pimpri Central Market", "12 mins"],
  ],
  education: [
    ["Dnyan Prabodhini School", "5 mins"],
    ["City Pride School", "5 mins"],
    ["St. Ursula High School", "6 mins"],
    ["SB Patil College", "10 mins"],
    ["PCCOE Engineering College", "10 mins"],
    ["DY Patil College Campus", "10 mins"],
    ["Elpro International School", "10 mins"],
    ["Kamal Nayan Bajaj School", "10 mins"],
  ],
} as const;
