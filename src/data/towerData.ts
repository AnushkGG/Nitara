import { Floor, Unit, UnitKey, AvailabilityStatus, TransitionClip } from '../types';

export const IW = 5504;
export const IH = 3072;
export const TOWER_X0 = 2218;
export const TOWER_X1 = 3282;

// Floor slab lines measured off the tower photo, top to bottom (floor 32 roof line .. floor 4 base).
export const LINES = [
  429, 495, 581, 668, 747, 816, 885, 955, 1022, 1092, 1159, 1228, 1298, 1365,
  1435, 1503, 1572, 1640, 1708, 1777, 1843, 1913, 1979, 2048, 2115, 2185, 2252,
  2320, 2388, 2453
];
export const CROWN_TOP = 247;

export const UNITS: Record<UnitKey, Unit> = {
  A: {
    name: 'Residence A',
    short: 'Res. A',
    beds: 2,
    baths: '2',
    sf: '1,450',
    outdoor: '120 SF balcony',
    copy: 'A bay-facing two-bedroom with a full wall of glass, an open chef’s kitchen and a primary suite with a spa bath and walk-in closet.',
    img: '/assets/dh_A.jpg',
    base: 1290000,
    step: 18000,
    rooms: [
      { id: 'living', name: 'Living & Kitchen', x: 46.5, y: 40, img: '/assets/A_living.jpg' },
      { id: 'bed', name: 'Primary Bedroom', x: 24, y: 28, img: '/assets/A_bed.jpg' },
      { id: 'bath', name: 'Primary Bath', x: 27, y: 50, img: '/assets/A_bath.jpg' },
    ],
  },
  P: {
    name: 'Corner Penthouse',
    short: 'Penthouse',
    beds: 3,
    baths: '3.5',
    sf: '3,200',
    outdoor: '1,100 SF wraparound terrace',
    copy: 'A full corner of sky. Glass on two sides, a wraparound terrace, a chef’s kitchen in black marble and a primary suite with a soaking tub.',
    img: '/assets/dh_P.jpg',
    base: 5400000,
    step: 600000,
    rooms: [
      { id: 'great', name: 'Great Room', x: 52, y: 59, img: '/assets/P_great.jpg' },
      { id: 'kitchen', name: 'Chef’s Kitchen', x: 62.5, y: 43, img: '/assets/P_kitchen.jpg' },
      { id: 'suite', name: 'Primary Suite', x: 76, y: 31, img: '/assets/P_suite.jpg' },
      { id: 'bath', name: 'Spa Bath', x: 19.5, y: 51, img: '/assets/P_bath.jpg' },
    ],
  },
};

export const FLOORS: Floor[] = (() => {
  const list: Floor[] = [];
  list.push({ n: 33, y0: CROWN_TOP, y1: LINES[0], unit: 'P' });
  for (let i = 0; i < LINES.length - 1; i++) {
    const n = 32 - i;
    list.push({ n, y0: LINES[i], y1: LINES[i + 1], unit: n >= 30 ? 'P' : 'A' });
  }
  return list;
})();

export const getFloorStatus = (n: number): AvailabilityStatus => {
  const h = (n * 2654435761) % 97;
  return h < 18 ? 'sold' : h < 30 ? 'hold' : 'ok';
};

export const STATUS_TEXT: Record<AvailabilityStatus, string> = {
  ok: 'Available',
  hold: 'Reserved',
  sold: 'Sold',
};

export const formatPrice = (f: Floor): string => {
  const u = UNITS[f.unit];
  const steps = f.unit === 'P' ? f.n - 30 : f.n - 4;
  const v = u.base + steps * u.step;
  return v >= 1e6 ? `$${(v / 1e6).toFixed(2).replace(/0$/, '')}M` : `$${Math.round(v / 1e3)}K`;
};

export const CLIPS: Record<string, TransitionClip> = {
  A_enter: {
    src: '/assets/clips/A_enter.mp4',
    rev: '/assets/clips/A_enter_rev.mp4',
    rate: 1.25,
    from: [22],
    fps: 24,
    w: 1600,
    lead: [
      [1.0, 0.0, -0.0],
      [1.0002, -0.2, -0.1],
      [1.0015, -1.1, -0.8],
      [1.003, -2.3, -1.4],
      [1.0047, -3.7, -2.2],
      [1.0062, -4.9, -2.8],
      [1.0079, -6.2, -3.6],
      [1.0094, -7.4, -4.4],
      [1.011, -8.8, -5.0],
      [1.0128, -10.2, -5.9],
      [1.0146, -11.8, -6.4],
      [1.0159, -12.7, -7.4],
      [1.0173, -13.9, -7.6],
      [1.0196, -15.5, -9.0],
      [1.0212, -16.9, -9.7],
      [1.0234, -18.9, -10.5],
      [1.0248, -19.7, -11.2],
      [1.0266, -21.3, -12.2],
      [1.0284, -22.5, -13.1],
      [1.0302, -24.1, -13.8],
      [1.0319, -25.4, -14.5],
      [1.0336, -26.7, -15.4],
      [1.0356, -28.3, -16.1],
      [1.0373, -29.8, -17.0],
      [1.0389, -31.0, -17.9],
      [1.0408, -32.6, -18.5],
      [1.0427, -34.4, -19.0],
      [1.0446, -35.6, -20.4],
      [1.0463, -37.4, -20.2],
      [1.0483, -38.6, -22.2],
      [1.0504, -40.3, -23.1],
      [1.052, -41.8, -23.2],
      [1.0535, -42.5, -24.4],
      [1.056, -44.6, -26.1],
      [1.0576, -46.2, -25.8],
      [1.0599, -48.2, -27.0],
      [1.0617, -49.1, -28.6],
    ],
  },
  P_enter: {
    src: '/assets/clips/P_enter.mp4',
    rev: '/assets/clips/P_enter_rev.mp4',
    rate: 1.25,
    from: [30, 31, 32, 33],
    fps: 24,
    w: 1600,
    lead: [
      [1.0, 0.0, 0.0],
      [1.0002, -0.2, -0.1],
      [1.0012, -1.0, -0.4],
      [1.0024, -1.9, -0.8],
      [1.0038, -3.0, -1.3],
      [1.0053, -4.2, -1.6],
      [1.0072, -5.7, -2.2],
      [1.0092, -7.3, -2.8],
      [1.0115, -9.2, -3.5],
      [1.0142, -11.3, -4.2],
      [1.0171, -13.6, -5.2],
      [1.0201, -15.9, -6.0],
      [1.0236, -18.8, -6.9],
      [1.0276, -22.3, -7.9],
      [1.0306, -24.5, -8.6],
      [1.036, -28.7, -10.2],
      [1.0406, -32.5, -11.4],
      [1.0455, -36.4, -12.7],
      [1.0521, -41.7, -14.6],
      [1.0573, -45.8, -15.9],
      [1.0629, -50.2, -17.4],
      [1.0688, -54.8, -19.0],
      [1.0753, -60.1, -20.6],
      [1.0816, -65.1, -22.0],
      [1.0882, -70.4, -24.0],
      [1.0953, -75.7, -26.3],
      [1.1044, -83.1, -28.4],
      [1.1122, -89.1, -30.7],
      [1.1205, -96.0, -32.4],
      [1.1305, -104.1, -34.2],
      [1.1412, -112.8, -36.6],
      [1.15, -119.5, -39.6],
      [1.1633, -130.7, -41.4],
      [1.1728, -137.0, -45.8],
      [1.1872, -149.7, -47.7],
      [1.1972, -156.9, -51.3],
      [1.2077, -165.2, -54.7],
    ],
  },
  A_bed: { src: '/assets/clips/A_bed.mp4', rev: '/assets/clips/A_bed_rev.mp4', rate: 1.2 },
  A_bath: { src: '/assets/clips/A_bath.mp4', rev: '/assets/clips/A_bath_rev.mp4', rate: 1.2 },
  P_kitchen: { src: '/assets/clips/P_kitchen.mp4', rev: '/assets/clips/P_kitchen_rev.mp4', rate: 1.2 },
  P_suite: { src: '/assets/clips/P_suite.mp4', rev: '/assets/clips/P_suite_rev.mp4', rate: 1.2 },
  A_living: { src: '/assets/clips/A_living.mp4', rev: '/assets/clips/A_living_rev.mp4', rate: 1.2 },
  P_great: { src: '/assets/clips/P_great.mp4', rev: '/assets/clips/P_great_rev.mp4', rate: 1.2 },
  P_bath: { src: '/assets/clips/P_bath.mp4', rev: '/assets/clips/P_bath_rev.mp4', rate: 1.2 },
};

