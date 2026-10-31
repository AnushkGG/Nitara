import { Rect, Transform, Floor } from '../types';
import { IW, IH, TOWER_X0, TOWER_X1, FLOORS } from '../data/towerData';

export const isPortrait = (): boolean => {
  return window.innerWidth / window.innerHeight < 1;
};

export const frameRect = (): Rect => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (isPortrait()) {
    const w = vw * 1.06;
    const h = (w * IH) / IW;
    return { x: (vw - w) / 2, y: Math.max(64, vh * 0.36 - h / 2), w, h };
  }
  const s = Math.max(vw / IW, vh / IH);
  return { x: (vw - IW * s) / 2, y: (vh - IH * s) / 2, w: IW * s, h: IH * s };
};

export const towerRest = (): Transform => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let s = Math.max(vw / IW, vh / IH);
  if (isPortrait()) {
    s = Math.max((vh * 0.98) / (IH - 120), vw / (TOWER_X1 - TOWER_X0 + 360));
  }
  const cx = (TOWER_X0 + TOWER_X1) / 2;
  const tx = vw / 2 - cx * s;
  const ty = isPortrait() ? vh / 2 - IH * 0.52 * s : (vh - IH * s) / 2;
  return { s, tx, ty };
};

export const floorCrop = (f: Floor): Rect => {
  const w = 1700;
  const h = (w * IH) / IW;
  const g = f.unit === 'P' ? FLOORS.find((x) => x.n === 31) || f : f;
  const cy = (g.y0 + g.y1) / 2;
  return {
    x: (TOWER_X0 + TOWER_X1) / 2 - w / 2,
    y: Math.max(0, cy - h / 2),
    w,
    h,
  };
};

export const fitRect = (r: Rect, fr: Rect): Transform => {
  const s = fr.w / r.w;
  return { s, tx: fr.x - r.x * s, ty: fr.y - r.y * s };
};

export const roomFit = (): Transform => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const s = Math.max(vw / IW, vh / IH);
  return { s, tx: (vw - IW * s) / 2, ty: (vh - IH * s) / 2 };
};

export const FULL_IMAGE_RECT: Rect = { x: 0, y: 0, w: IW, h: IH };

export const unitRest = (): Transform => {
  if (isPortrait()) {
    return fitRect(FULL_IMAGE_RECT, frameRect());
  }
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const panelW = 410;
  const aw = vw - panelW - 24;
  const ah = vh - 96;
  const s = Math.min(aw / (IW * 0.84), ah / (IH * 0.8));
  return {
    s,
    tx: 12 + aw / 2 - (IW / 2) * s,
    ty: 60 + ah / 2 - (IH / 2) * s,
  };
};

export const applyTransform = (
  el: HTMLElement | null,
  t: Transform,
  ms = 0,
  ease = 'var(--ease)'
) => {
  if (!el) return;
  el.style.transition = ms ? `transform ${ms}ms ${ease}` : 'none';
  el.style.transform = `translate3d(${t.tx}px, ${t.ty}px, 0) scale(${t.s})`;
};

