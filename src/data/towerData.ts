import { Floor, Unit, UnitKey, AvailabilityStatus, TransitionClip, FloorUnitDetail } from '../types';
import { tower } from './nitaara.data';
import towerHotspots from './towerHotspots';

export const IW = 2000;
export const IH = 857;
export const TOWER_X0 = 1085;
export const TOWER_X1 = 1412;
export const CROWN_TOP = 53;

// Map hotspot data to Floor objects
export const HOTSPOTS = towerHotspots;

export const getFloorUnits = (floorNum: number): FloorUnitDetail[] => [
  {
    unitNo: `${floorNum}01`,
    flatSuffix: '01',
    typeId: '3bhk-type-01',
    label: '3 BHK (Type 01)',
    config: '3 BHK',
    reraCarpetSqFt: 1058,
    balconySqFt: 189,
    totalSqFt: 1247,
    formedTerraceSqFt: floorNum === 1 ? 1519 : undefined,
    priceLabel: '₹1.85 Cr',
    priceNote: 'All inclusive',
    floorPlanSrc: '/assets/nitaara/floorplan/floor-plan1.jpg',
    availability: 'enquire',
    rooms: [
      { name: 'Living & Dining', dims: "19'0\" × 13'10\"" },
      { name: 'Open Balcony', dims: "15'0\" × 5'0\"" },
      { name: 'Kitchen & Utility', dims: "13'0\" × 8'5\" + 8'6\" × 4'0\"" },
      { name: 'Master Suite', dims: "11'5\" × 14'2\" + Bath 5'0\" × 7'10\"" },
      { name: 'Bedroom 2', dims: "12'4\" × 13'5\" + Balcony 7'0\" × 3'3\"" },
      { name: 'Bedroom 3', dims: "10'3\" × 14'0\"" },
    ],
  },
  {
    unitNo: `${floorNum}02`,
    flatSuffix: '02',
    typeId: '3bhk-type-02',
    label: '3 BHK (Type 02)',
    config: '3 BHK',
    reraCarpetSqFt: 1050,
    balconySqFt: 195,
    totalSqFt: 1245,
    formedTerraceSqFt: floorNum === 1 ? 126 : undefined,
    priceLabel: '₹1.85 Cr',
    priceNote: 'All inclusive',
    floorPlanSrc: '/assets/nitaara/floorplan/floor-plan2.jpg',
    availability: 'enquire',
    rooms: [
      { name: 'Living & Dining', dims: "19'0\" × 13'10\"" },
      { name: 'Open Balcony', dims: "15'0\" × 5'0\"" },
      { name: 'Kitchen & Utility', dims: "13'0\" × 8'5\" + 8'6\" × 4'0\"" },
      { name: 'Master Suite', dims: "11'5\" × 14'2\" + Bath 5'0\" × 7'10\"" },
      { name: 'Bedroom 2', dims: "12'4\" × 13'5\" + Balcony 7'0\" × 3'3\"" },
      { name: 'Bedroom 3', dims: "10'3\" × 14'0\"" },
    ],
  },
  {
    unitNo: `${floorNum}03`,
    flatSuffix: '03',
    typeId: '4bhk',
    label: '4 BHK',
    config: '4 BHK',
    reraCarpetSqFt: 1380,
    balconySqFt: 212,
    totalSqFt: 1592,
    formedTerraceSqFt: floorNum === 1 ? 1100 : undefined,
    priceLabel: '₹2.36 Cr',
    priceNote: 'All inclusive',
    floorPlanSrc: '/assets/nitaara/floorplan/floor-plan3.jpg',
    availability: 'enquire',
    rooms: [
      { name: 'Grand Living & Dining', dims: "14'9\" × 18'4\"" },
      { name: 'Private Balcony', dims: "14'7\" × 6'0\"" },
      { name: 'Dining Room', dims: "9'3\" × 11'4\"" },
      { name: 'Chef Kitchen & Utility', dims: "9'0\" × 9'11\" + 9'0\" × 4'0\"" },
      { name: 'Master Suite', dims: "18'0\" × 10'9\" + Bath 8'0\" × 5'0\"" },
      { name: 'Bedroom 2', dims: "18'0\" × 10'4\" + Bath 4'10\" × 8'0\"" },
      { name: 'Bedroom 3', dims: "10'3\" × 10'9\" + Bath 5'0\" × 8'0\"" },
      { name: 'Bedroom 4 / Study', dims: "10'3\" × 10'9\"" },
    ],
  },
];

export const UNITS: Record<UnitKey, Unit> = {
  A: {
    name: '3 BHK Luxury Residence',
    short: '3 BHK',
    beds: 3,
    baths: '3',
    sf: '1,247',
    outdoor: '189 SF Balcony',
    copy: 'A meticulously designed 3 BHK residence with 3-side open ventilation, grand living & dining spaces, expansive balcony, and premium fixtures.',
    img: '/assets/nitaara/floorplan/floor-plan1.jpg',
    base: 18500000,
    step: 0,
    rooms: [
      {
        id: 'living',
        name: 'Living & Dining',
        dims: "19'0\" × 13'10\"",
        x: 48,
        y: 44,
        img: '/assets/nitaara/floorplan/floor-plan1.jpg',
      },
      {
        id: 'balcony',
        name: 'Open Balcony',
        dims: "15'0\" × 5'0\"",
        x: 65,
        y: 42,
        img: '/assets/nitaara/floorplan/floor-plan1.jpg',
      },
      {
        id: 'bed',
        name: 'Master Suite',
        dims: "11'5\" × 14'2\"",
        x: 20,
        y: 35,
        img: '/assets/nitaara/floorplan/floor-plan1.jpg',
      },
      {
        id: 'kitchen',
        name: 'Kitchen & Utility',
        dims: "13'0\" × 8'5\"",
        x: 52,
        y: 65,
        img: '/assets/nitaara/floorplan/floor-plan1.jpg',
      },
    ],
  },
  P: {
    name: '4 BHK Grand Residence',
    short: '4 BHK',
    beds: 4,
    baths: '4',
    sf: '1,592',
    outdoor: '212 SF Balcony',
    copy: 'An expansive 4 BHK luxury home featuring a palatial master suite, private outdoor balconies, dedicated servant/utility area, and panoramic Nigdi skyline views.',
    img: '/assets/nitaara/floorplan/floor-plan3.jpg',
    base: 23600000,
    step: 0,
    rooms: [
      {
        id: 'great',
        name: 'Grand Living & Dining',
        dims: "14'9\" × 18'4\"",
        x: 50,
        y: 50,
        img: '/assets/nitaara/floorplan/floor-plan3.jpg',
      },
      {
        id: 'balcony',
        name: 'Private Balcony',
        dims: "14'7\" × 6'0\"",
        x: 68,
        y: 48,
        img: '/assets/nitaara/floorplan/floor-plan3.jpg',
      },
      {
        id: 'suite',
        name: 'Master Suite',
        dims: "18'0\" × 10'9\"",
        x: 75,
        y: 32,
        img: '/assets/nitaara/floorplan/floor-plan3.jpg',
      },
      {
        id: 'kitchen',
        name: 'Chef Kitchen & Utility',
        dims: "9'0\" × 9'11\"",
        x: 35,
        y: 62,
        img: '/assets/nitaara/floorplan/floor-plan3.jpg',
      },
    ],
  },
};

// Floors dynamically generated from tower.totalFloors and calibrated hotspots
export const FLOORS: Floor[] = (() => {
  if (!tower.totalFloors) {
    throw new Error('tower.totalFloors must be defined');
  }

  return HOTSPOTS.map((h) => {
    const isUpper = h.floor >= 18;
    return {
      n: h.floor,
      y0: h.y0,
      y1: h.y1,
      x0: h.x0,
      x1: h.x1,
      polygon: h.polygon as [number, number][],
      label: h.label,
      unit: isUpper ? ('P' as UnitKey) : ('A' as UnitKey),
    };
  });
})();

export const getFloorStatus = (_n: number): AvailabilityStatus => {
  return 'ok';
};

export const STATUS_TEXT: Record<AvailabilityStatus, string> = {
  ok: 'Available on Enquiry',
  hold: 'Enquire for Status',
  sold: 'Enquire for Status',
};

export const formatPrice = (f: Floor): string => {
  return f.unit === 'P' ? '₹2.36 Cr' : '₹1.85 Cr';
};

// Transition clips: gracefully empty to bypass missing video files and use smooth CSS camera zoom
export const CLIPS: Record<string, TransitionClip> = {};
