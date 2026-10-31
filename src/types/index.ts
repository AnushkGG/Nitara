export type ViewMode = 'tower' | 'zoom' | 'unit' | 'room';

export type UnitKey = 'A' | 'P';

export type AvailabilityStatus = 'ok' | 'hold' | 'sold';

export interface Room {
  id: string;
  name: string;
  x: number;
  y: number;
  img: string;
}

export interface Unit {
  name: string;
  short: string;
  beds: number;
  baths: string;
  sf: string;
  outdoor: string;
  copy: string;
  img: string;
  base: number;
  step: number;
  rooms: Room[];
}

export interface Floor {
  n: number;
  y0: number;
  y1: number;
  unit: UnitKey;
}

export interface Transform {
  s: number;
  tx: number;
  ty: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface TransitionClip {
  src: string;
  rev?: string;
  rate?: number;
  from?: number[];
  fps?: number;
  w?: number;
  lead?: [number, number, number][];
}

