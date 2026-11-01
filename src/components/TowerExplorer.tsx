import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ViewMode, Floor, Room, Transform } from '../types';
import {
  IW,
  IH,
  TOWER_X0,
  TOWER_X1,
  FLOORS,
  UNITS,
  CLIPS,
  getFloorUnits,
} from '../data/towerData';
import {
  isPortrait,
  frameRect,
  towerRest,
  floorCrop,
  fitRect,
  roomFit,
  unitRest,
  applyTransform,
  FULL_IMAGE_RECT,
} from '../utils/geometry';
import { Header } from './Header';
import { FloorTag } from './FloorTag';
import { Hint } from './Hint';
import { UnitPanel } from './UnitPanel';
import { RoomBar } from './RoomBar';
import { Toast } from './Toast';
import { Cursor } from './Cursor';
import { EnquiryModal, EnquiryPrefill } from './EnquiryModal';
import { FloorPlansModal, PlanTab } from './FloorPlansModal';

interface TowerExplorerProps {
  onGlobalEnquire?: () => void;
}

export const TowerExplorer: React.FC<TowerExplorerProps> = ({ onGlobalEnquire: _onGlobalEnquire }) => {
  const [view, setView] = useState<ViewMode>('tower');
  const [hoverFloor, setHoverFloor] = useState<Floor | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeUnitNo, setActiveUnitNo] = useState<string>('101');
  const [tagPos, setTagPos] = useState<{ left: number; top: number } | null>(null);
  const [hotRoom, setHotRoom] = useState<Room | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [portrait, setPortrait] = useState(isPortrait());

  // Modals state
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryMode, setEnquiryMode] = useState<'floorplan' | 'sitevisit'>('floorplan');
  const [enquiryPrefill, setEnquiryPrefill] = useState<EnquiryPrefill | null>(null);
  const [floorPlansOpen, setFloorPlansOpen] = useState(false);
  const [floorPlansTab, setFloorPlansTab] = useState<PlanTab>('all');

  // CAD Pan & Zoom state for Level 3
  const [cadZoom, setCadZoom] = useState(1);
  const [cadPan, setCadPan] = useState({ x: 0, y: 0 });
  const [isCadDragging, setIsCadDragging] = useState(false);
  const [cadDragStart, setCadDragStart] = useState({ x: 0, y: 0 });

  const appRef = useRef<HTMLDivElement>(null);
  const towerLayerRef = useRef<HTMLElement>(null);
  const towerPlaneRef = useRef<HTMLDivElement>(null);
  const towerImgRef = useRef<HTMLImageElement>(null);
  const bandsSvgRef = useRef<SVGSVGElement>(null);

  const unitLayerRef = useRef<HTMLElement>(null);
  const unitPlaneRef = useRef<HTMLDivElement>(null);
  const unitImgRef = useRef<HTMLImageElement>(null);
  const dotsContainerRef = useRef<HTMLDivElement>(null);

  const roomLayerRef = useRef<HTMLElement>(null);
  const roomPlaneRef = useRef<HTMLDivElement>(null);
  const roomImgRef = useRef<HTMLImageElement>(null);

  const videoClipRef = useRef<HTMLVideoElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const currentTowerRef = useRef<Transform>(towerRest());
  const isBusyRef = useRef(false);
  const viewRef = useRef<ViewMode>('tower');
  viewRef.current = view;

  const floorRef = useRef<Floor | null>(null);
  floorRef.current = selectedFloor;

  const roomRef = useRef<Room | null>(null);
  roomRef.current = selectedRoom;

  // Blob cache for videos
  const blobsRef = useRef<Map<string, Promise<string>>>(new Map());

  const warmVideo = useCallback((src?: string): Promise<string> | null => {
    if (!src) return null;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return null;
    if (!blobsRef.current.has(src)) {
      const p = fetch(src)
        .then((r) => r.blob())
        .then((b) => URL.createObjectURL(b))
        .catch(() => src);
      blobsRef.current.set(src, p);
    }
    return blobsRef.current.get(src)!;
  }, []);

  const warmUnitClips = useCallback(
    (unitKey: 'A' | 'P') => {
      warmVideo(CLIPS[`${unitKey}_enter`]?.rev);
      UNITS[unitKey].rooms.forEach((r) => {
        warmVideo(CLIPS[`${unitKey}_${r.id}`]?.src);
      });
    },
    [warmVideo]
  );

  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const placeClip = () => {
    const clipEl = videoClipRef.current;
    if (!clipEl) return;
    const fr = frameRect();
    Object.assign(clipEl.style, {
      left: `${fr.x}px`,
      top: `${fr.y}px`,
      width: `${fr.w}px`,
      height: `${fr.h}px`,
      inset: 'auto',
      objectFit: 'fill',
    });
  };

  const playVideoClip = async (
    src?: string,
    rate = 1.2,
    onPlay?: () => void
  ): Promise<boolean> => {
    const clipEl = videoClipRef.current;
    if (!src || !clipEl) return false;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return false;

    placeClip();
    const resolvedUrl = (await warmVideo(src)) || src;
    clipEl.src = resolvedUrl;
    clipEl.playbackRate = rate;
    clipEl.defaultPlaybackRate = rate;

    try {
      await new Promise<void>((res, rej) => {
        clipEl.oncanplay = () => res();
        clipEl.onerror = () => rej();
        clipEl.load();
      });
      clipEl.currentTime = 0;
      await clipEl.play();
    } catch {
      return false;
    }

    clipEl.classList.remove('hidden');
    onPlay?.();

    await new Promise<void>((res) => {
      clipEl.onended = () => res();
    });
    return true;
  };

  const endClip = () => {
    const clipEl = videoClipRef.current;
    if (clipEl) {
      clipEl.classList.add('hidden');
      clipEl.pause();
    }
  };

  const towerBlend = (
    c: any,
    t0: Transform,
    reverse: boolean,
    n0: number
  ) => {
    const clipEl = videoClipRef.current;
    const towerL = towerLayerRef.current;
    const towerP = towerPlaneRef.current;
    if (!c?.lead || c.from?.includes(n0) || !clipEl || !towerL || !towerP) return;

    const fr = frameRect();
    const k = fr.w / c.w;
    const n = c.lead.length - 1;
    const fade = Math.min(n, 30);
    const smooth = (x: number) => {
      x = Math.min(Math.max(x, 0), 1);
      return x * x * (3 - 2 * x);
    };

    towerL.style.zIndex = '2';

    const draw = (time: number) => {
      const vf = time * c.fps;
      const f = Math.min(reverse ? clipEl.duration * c.fps - 1 - vf : vf, n);
      if (f < 0 || f > n) return;
      const i = Math.floor(f);
      const a = f - i;
      const A = c.lead[i];
      const B = c.lead[Math.min(i + 1, n)];
      const s = A[0] + (B[0] - A[0]) * a;
      const dx = A[1] + (B[1] - A[1]) * a;
      const dy = A[2] + (B[2] - A[2]) * a;
      applyTransform(towerP, {
        s: t0.s * s,
        tx: fr.x + s * (t0.tx - fr.x) + dx * k,
        ty: fr.y + s * (t0.ty - fr.y) + dy * k,
      });
      towerL.style.opacity = `${1 - smooth(f / fade)}`;
    };

    let over = false;
    const done = () => {
      if (over) return;
      over = true;
      towerL.style.zIndex = '';
      towerL.style.opacity = '';
      if (!reverse) applyTransform(towerP, t0);
    };

    draw(clipEl.currentTime);

    const tick = (_now: number, meta?: any) => {
      draw(meta ? meta.mediaTime : clipEl.currentTime);
      if (clipEl.ended || clipEl.paused) return done();
      if (!reverse && clipEl.currentTime * c.fps > n) return done();
      if ('requestVideoFrameCallback' in clipEl) {
        (clipEl as any).requestVideoFrameCallback(tick);
      } else {
        requestAnimationFrame((t) => tick(t));
      }
    };

    clipEl.addEventListener('ended', done, { once: true });
    tick(0);
  };

  const syncDotsScale = () => {
    const dotsEl = dotsContainerRef.current;
    if (!dotsEl) return;
    const t = viewRef.current === 'zoom' ? fitRect(FULL_IMAGE_RECT, frameRect()) : unitRest();
    dotsEl.style.setProperty('--inv', `${1 / t.s}`);
  };

  const updateTagPosition = useCallback((f: Floor | null) => {
    if (!f || isPortrait()) {
      setTagPos(null);
      return;
    }
    const t = currentTowerRef.current;
    const rightX = f.x1 ?? TOWER_X1;
    const x = rightX * t.s + t.tx + 12;
    const y = ((f.y0 + f.y1) / 2) * t.s + t.ty;
    setTagPos({ left: x, top: y });
  }, []);

  const handleFloorHover = useCallback(
    (f: Floor | null) => {
      if (viewRef.current !== 'tower' || isBusyRef.current) return;
      setHoverFloor(f);
      updateTagPosition(f);
    },
    [updateTagPosition]
  );

  const enterFloor = async (f: Floor) => {
    if (isBusyRef.current) return;
    isBusyRef.current = true;
    setSelectedFloor(f);
    setActiveUnitNo(`${f.n}01`);
    setHoverFloor(null);
    setView('zoom');
    viewRef.current = 'zoom';

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Preload First Floor Plan / Master Key Layout for Level 2
    const imgEl = unitImgRef.current;
    const layoutSrc = '/assets/nitaara/floorplan/master-plan.jpg';
    const imgReady = new Promise<void>((res) => {
      if (!imgEl) return res();
      if (imgEl.getAttribute('src') === layoutSrc && imgEl.complete) return res();
      imgEl.onload = () => res();
      imgEl.onerror = () => res();
      imgEl.src = layoutSrc;
    });

    warmUnitClips(f.unit);

    // 1) Push camera into floor crop
    const targetCrop = fitRect(floorCrop(f), frameRect());
    currentTowerRef.current = targetCrop;
    applyTransform(towerPlaneRef.current, targetCrop, reduce ? 0 : 1100);

    await wait(reduce ? 0 : 1050);
    await imgReady;

    // Position unitPlane at full frame
    applyTransform(unitPlaneRef.current, fitRect(FULL_IMAGE_RECT, frameRect()));

    // 2) Transition dive
    const ec = CLIPS[`${f.unit}_enter`];
    const played = await playVideoClip(ec?.src, ec?.rate, () =>
      towerBlend(ec, targetCrop, false, f.n)
    );

    if (played) {
      if (unitLayerRef.current) {
        unitLayerRef.current.classList.remove('hidden');
        unitLayerRef.current.style.opacity = '1';
      }
      towerLayerRef.current?.classList.add('hidden');
      endClip();
    } else {
      const fr = frameRect();
      const base = fitRect(FULL_IMAGE_RECT, fr);
      const from = {
        s: base.s * 1.18,
        tx: base.tx - IW * base.s * 0.09,
        ty: base.ty - IH * base.s * 0.09,
      };
      if (unitPlaneRef.current && unitLayerRef.current) {
        applyTransform(unitPlaneRef.current, from);
        unitLayerRef.current.style.transition = 'none';
        unitLayerRef.current.style.opacity = '0';
        unitLayerRef.current.classList.remove('hidden');
        unitLayerRef.current.getBoundingClientRect();
        unitLayerRef.current.style.transition = 'opacity .7s ease';
        unitLayerRef.current.style.opacity = '1';
        applyTransform(unitPlaneRef.current, base, reduce ? 0 : 1300, 'var(--ease-out)');
        await wait(reduce ? 0 : 900);
        towerLayerRef.current?.classList.add('hidden');
      }
    }

    // Move floor layout to rest position
    const rest = unitRest();
    applyTransform(unitPlaneRef.current, rest, reduce ? 0 : 900, 'var(--ease)');
    dotsContainerRef.current?.style.setProperty('--inv', `${1 / rest.s}`);

    setView('unit');
    viewRef.current = 'unit';

    // Stagger dots
    if (dotsContainerRef.current) {
      const children = Array.from(dotsContainerRef.current.children);
      children.forEach((dot, idx) => {
        setTimeout(() => {
          dot.classList.add('on');
        }, 120 * idx);
      });
    }

    isBusyRef.current = false;
  };

  const enterRoom = async (r: Room, fromRoom = false) => {
    if (isBusyRef.current || !floorRef.current) return;
    isBusyRef.current = true;
    const f = floorRef.current;
    setSelectedRoom(r);
    setCadZoom(1);
    setCadPan({ x: 0, y: 0 });

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Determine correct unit CAD plan based on active flat
    const suffix = activeUnitNo.slice(-2);
    let planSrc = '/assets/nitaara/floorplan/floor-plan1.jpg';
    if (suffix === '02') planSrc = '/assets/nitaara/floorplan/floor-plan2.jpg';
    else if (suffix === '03') planSrc = '/assets/nitaara/floorplan/floor-plan3.jpg';

    // Preload reverse clip
    warmVideo(CLIPS[`${f.unit}_${r.id}`]?.rev);

    // Hide dots
    if (dotsContainerRef.current) {
      Array.from(dotsContainerRef.current.children).forEach((d) => d.classList.remove('on'));
    }
    syncDotsScale();

    const roomImgEl = roomImgRef.current;
    const imgReady = new Promise<void>((res) => {
      if (!roomImgEl) return res();
      if (roomImgEl.getAttribute('src') === planSrc && roomImgEl.complete) return res();
      roomImgEl.onload = () => res();
      roomImgEl.onerror = () => res();
      roomImgEl.src = planSrc;
    });

    if (fromRoom) {
      flashRef.current?.classList.add('on');
      await wait(350);
      await imgReady;
      applyTransform(roomPlaneRef.current, roomFit());
      flashRef.current?.classList.remove('on');
    } else {
      await imgReady;
      const rc = CLIPS[`${f.unit}_${r.id}`];
      const src = rc?.src;
      if (src && !reduce) {
        applyTransform(unitPlaneRef.current, fitRect(FULL_IMAGE_RECT, frameRect()));
        if (unitPlaneRef.current) {
          unitPlaneRef.current.style.transition = 'transform .6s var(--ease)';
        }
        await wait(600);
      }

      const played = await playVideoClip(src, rc?.rate);
      if (played) {
        applyTransform(roomPlaneRef.current, fitRect(FULL_IMAGE_RECT, frameRect()));
        if (roomLayerRef.current) {
          roomLayerRef.current.style.transition = 'none';
          roomLayerRef.current.style.opacity = '1';
          roomLayerRef.current.classList.remove('hidden');
        }
        unitLayerRef.current?.classList.add('hidden');
        endClip();
        roomPlaneRef.current?.getBoundingClientRect();
        applyTransform(roomPlaneRef.current, roomFit(), 700, 'var(--ease-out)');
      } else {
        const base = unitRest();
        const k = 2.6;
        const px = (r.x / 100) * IW;
        const py = (r.y / 100) * IH;
        const z = {
          s: base.s * k,
          tx: window.innerWidth / 2 - px * base.s * k,
          ty: window.innerHeight / 2 - py * base.s * k,
        };
        applyTransform(unitPlaneRef.current, z, reduce ? 0 : 1000);
        const rf = roomFit();
        applyTransform(roomPlaneRef.current, {
          s: rf.s * 1.12,
          tx: rf.tx - IW * rf.s * 0.06,
          ty: rf.ty - IH * rf.s * 0.06,
        });
        await wait(reduce ? 0 : 550);
        if (roomLayerRef.current) {
          roomLayerRef.current.style.transition = 'opacity .6s ease';
          roomLayerRef.current.style.opacity = '0';
          roomLayerRef.current.classList.remove('hidden');
          roomLayerRef.current.getBoundingClientRect();
          roomLayerRef.current.style.opacity = '1';
        }
        applyTransform(roomPlaneRef.current, rf, reduce ? 0 : 1400, 'var(--ease-out)');
        await wait(reduce ? 0 : 650);
        unitLayerRef.current?.classList.add('hidden');
        applyTransform(unitPlaneRef.current, unitRest());
      }
    }

    setView('room');
    viewRef.current = 'room';
    isBusyRef.current = false;
  };

  const handleSelectUnitNo = (unitNo: string) => {
    setActiveUnitNo(unitNo);
    const suffix = unitNo.slice(-2);
    let planSrc = '/assets/nitaara/floorplan/floor-plan1.jpg';
    if (suffix === '02') planSrc = '/assets/nitaara/floorplan/floor-plan2.jpg';
    else if (suffix === '03') planSrc = '/assets/nitaara/floorplan/floor-plan3.jpg';

    if (roomImgRef.current) {
      roomImgRef.current.src = planSrc;
    }
    setCadZoom(1);
    setCadPan({ x: 0, y: 0 });
  };

  const handleBack = async () => {
    if (isBusyRef.current) return;
    isBusyRef.current = true;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (viewRef.current === 'room') {
      const f = floorRef.current!;
      const r = roomRef.current!;
      const rev = CLIPS[`${f.unit}_${r.id}`]?.rev;

      if (rev && !reduce) {
        applyTransform(unitPlaneRef.current, fitRect(FULL_IMAGE_RECT, frameRect()));
        applyTransform(roomPlaneRef.current, fitRect(FULL_IMAGE_RECT, frameRect()), 500);
        await wait(480);
        if (await playVideoClip(rev, 1.5)) {
          unitLayerRef.current?.classList.remove('hidden');
          roomLayerRef.current?.classList.add('hidden');
          endClip();
        } else {
          unitLayerRef.current?.classList.remove('hidden');
          roomLayerRef.current?.classList.add('hidden');
        }
        applyTransform(unitPlaneRef.current, unitRest());
        if (unitPlaneRef.current) {
          unitPlaneRef.current.style.transition = 'transform .9s var(--ease)';
        }
      } else {
        applyTransform(unitPlaneRef.current, unitRest());
        if (unitLayerRef.current && roomLayerRef.current) {
          unitLayerRef.current.style.transition = 'none';
          unitLayerRef.current.style.opacity = '1';
          unitLayerRef.current.classList.remove('hidden');
          roomLayerRef.current.style.transition = 'opacity .6s ease';
          roomLayerRef.current.style.opacity = '0';
          await wait(600);
          roomLayerRef.current.classList.add('hidden');
        }
      }

      setView('unit');
      viewRef.current = 'unit';
      setSelectedRoom(null);

      // Stagger dots in
      if (dotsContainerRef.current) {
        const dots = Array.from(dotsContainerRef.current.children);
        dots.forEach((d, i) => {
          setTimeout(() => {
            d.classList.add('on');
            syncDotsScale();
          }, 100 * i);
        });
      }
    } else if (viewRef.current === 'unit') {
      const f = floorRef.current!;
      if (dotsContainerRef.current) {
        Array.from(dotsContainerRef.current.children).forEach((d) => d.classList.remove('on'));
      }
      const ec = CLIPS[`${f.unit}_enter`];
      const rev = ec?.rev;

      if (rev && !reduce) {
        applyTransform(unitPlaneRef.current, fitRect(FULL_IMAGE_RECT, frameRect()), 700);
        await wait(700);
      }

      currentTowerRef.current = fitRect(floorCrop(f), frameRect());
      applyTransform(towerPlaneRef.current, currentTowerRef.current);

      if (rev && !reduce && towerLayerRef.current) {
        towerLayerRef.current.style.opacity = '0';
      }
      towerLayerRef.current?.classList.remove('hidden');

      const played =
        rev &&
        (await playVideoClip(rev, 1.5, () =>
          towerBlend(ec, currentTowerRef.current, true, f.n)
        ));

      if (towerLayerRef.current) {
        towerLayerRef.current.style.opacity = '';
      }

      if (played) {
        unitLayerRef.current?.classList.add('hidden');
        endClip();
      } else {
        if (unitLayerRef.current) {
          unitLayerRef.current.style.transition = 'opacity .6s ease';
          unitLayerRef.current.style.opacity = '0';
          await wait(600);
          unitLayerRef.current.classList.add('hidden');
        }
      }

      currentTowerRef.current = towerRest();
      applyTransform(towerPlaneRef.current, currentTowerRef.current, reduce ? 0 : 1200);
      await wait(reduce ? 0 : 1200);

      setView('tower');
      viewRef.current = 'tower';
      setSelectedFloor(null);
    }

    isBusyRef.current = false;
  };

  // Keyboard navigation & escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (enquiryOpen) {
          setEnquiryOpen(false);
          return;
        }
        if (floorPlansOpen) {
          setFloorPlansOpen(false);
          return;
        }
        handleBack();
        return;
      }

      if (viewRef.current === 'tower' && !isBusyRef.current) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
          e.preventDefault();
          setHoverFloor((prev) => {
            const nextNum = prev ? Math.min(prev.n + 1, FLOORS[0].n) : 1;
            const nextFloor = FLOORS.find((f) => f.n === nextNum) || null;
            updateTagPosition(nextFloor);
            return nextFloor;
          });
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
          e.preventDefault();
          setHoverFloor((prev) => {
            const nextNum = prev ? Math.max(prev.n - 1, 1) : FLOORS[0].n;
            const nextFloor = FLOORS.find((f) => f.n === nextNum) || null;
            updateTagPosition(nextFloor);
            return nextFloor;
          });
        } else if (e.key === 'Enter' && hoverFloor) {
          e.preventDefault();
          enterFloor(hoverFloor);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hoverFloor, updateTagPosition, enquiryOpen, floorPlansOpen]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setPortrait(isPortrait());
      if (viewRef.current === 'tower') {
        currentTowerRef.current = towerRest();
        applyTransform(towerPlaneRef.current, currentTowerRef.current);
      } else if (floorRef.current) {
        currentTowerRef.current = fitRect(floorCrop(floorRef.current), frameRect());
        applyTransform(towerPlaneRef.current, currentTowerRef.current);
      }
      applyTransform(unitPlaneRef.current, unitRest());
      syncDotsScale();
      if (viewRef.current === 'room') {
        applyTransform(roomPlaneRef.current, roomFit());
      }
      if (hoverFloor) {
        updateTagPosition(hoverFloor);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hoverFloor, updateTagPosition]);

  // Initial setup & Intro sequence
  useEffect(() => {
    [towerPlaneRef.current, unitPlaneRef.current, roomPlaneRef.current].forEach((plane) => {
      if (plane) {
        plane.style.width = `${IW}px`;
        plane.style.height = `${IH}px`;
      }
    });

    currentTowerRef.current = towerRest();
    applyTransform(towerPlaneRef.current, currentTowerRef.current);
    applyTransform(unitPlaneRef.current, unitRest());

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const runIntro = async () => {
      if (reduce) return;
      const t = towerRest();
      applyTransform(towerPlaneRef.current, {
        s: t.s * 1.06,
        tx: t.tx - IW * t.s * 0.03,
        ty: t.ty - IH * t.s * 0.05,
      });
      towerPlaneRef.current?.getBoundingClientRect();
      applyTransform(towerPlaneRef.current, t, 2600, 'var(--ease-out)');
      await wait(1600);

      // Bottom-to-top light scan
      const order = [...FLOORS].reverse();
      order.forEach((f, idx) => {
        setTimeout(() => {
          if (hoverFloor || viewRef.current !== 'tower') return;
          const bandEl = bandsSvgRef.current?.querySelector(`[data-n="${f.n}"]`);
          bandEl?.classList.add('scan');
          setTimeout(() => bandEl?.classList.remove('scan'), 260);
        }, idx * 38);
      });
    };

    const img = towerImgRef.current;
    if (img?.complete) {
      runIntro();
    } else if (img) {
      img.onload = runIntro;
    }
  }, []);

  const handleInquire = (unitInfo?: { floor?: number; unitNo?: string; label?: string; price?: string }) => {
    if (unitInfo) {
      setEnquiryPrefill(unitInfo);
      setEnquiryMode('floorplan');
      setEnquiryOpen(true);
    } else if (selectedFloor) {
      const units = getFloorUnits(selectedFloor.n);
      const curr = units.find((u) => u.unitNo === activeUnitNo) || units[0];
      setEnquiryPrefill({
        floor: selectedFloor.n,
        unitNo: curr.unitNo,
        label: curr.label,
        price: curr.priceLabel,
      });
      setEnquiryMode('floorplan');
      setEnquiryOpen(true);
    }
  };

  const handleSiteVisit = () => {
    if (selectedFloor) {
      const units = getFloorUnits(selectedFloor.n);
      const curr = units.find((u) => u.unitNo === activeUnitNo) || units[0];
      setEnquiryPrefill({
        floor: selectedFloor.n,
        unitNo: curr.unitNo,
        label: curr.label,
        price: curr.priceLabel,
      });
    } else {
      setEnquiryPrefill({
        label: '3 & 4 BHK Luxury Residences',
        price: 'From ₹1.85 Cr All inclusive',
      });
    }
    setEnquiryMode('sitevisit');
    setEnquiryOpen(true);
  };

  const handleNavClick = (section: string) => {
    if (section === 'floorplans' || section === 'layout') {
      setFloorPlansTab('all');
      setFloorPlansOpen(true);
    } else if (section === 'amenities') {
      const el = document.getElementById('amenities');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        setToastMsg('Level 26 Rooftop Sky Retreat & Infinity Pool — 7 Luxury Lifestyle Amenities.');
      }
    } else if (section === 'overview' || section === 'configurations' || section === 'residences') {
      const el = document.getElementById('highlights') || document.getElementById('configurations');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        const f = FLOORS.find((x) => x.n === 12) || FLOORS[0];
        if (f) enterFloor(f);
      }
    } else {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        setToastMsg(`Navigating to ${section}.`);
      }
    }
  };

  const isTouch =
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches ||
      isPortrait() ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0);

  // Active unit details for Level 3 caption
  const activeUnitDetails = selectedFloor
    ? getFloorUnits(selectedFloor.n).find((u) => u.unitNo === activeUnitNo) ||
      getFloorUnits(selectedFloor.n)[0]
    : null;

  return (
    <div id="app" ref={appRef} data-view={view}>
      {/* TOWER LAYER */}
      <section className="layer" id="towerLayer" ref={towerLayerRef}>
        <div className="plane" id="towerPlane" ref={towerPlaneRef}>
          <img
            id="towerImg"
            ref={towerImgRef}
            src="/assets/nitaara/banner/desk1.jpg"
            alt="Nitaara Tower Nigdi Pradhikaran"
            draggable={false}
          />
          <svg
            id="bands"
            ref={bandsSvgRef}
            viewBox={`0 0 ${IW} ${IH}`}
            preserveAspectRatio="none"
            aria-label="Tower Floors"
            onPointerMove={(e) => {
              if (view !== 'tower' || isBusyRef.current || e.pointerType === 'touch') return;
              const target = e.target as SVGElement;
              const n = Number(target.dataset?.n);
              handleFloorHover(n ? FLOORS.find((f) => f.n === n) || null : null);
            }}
            onPointerLeave={(e) => {
              if (!isTouch && e.pointerType !== 'touch' && view === 'tower') {
                handleFloorHover(null);
              }
            }}
            onClick={(e) => {
              if (view !== 'tower' || isBusyRef.current) return;
              const target = e.target as SVGElement;
              const n = Number(target.dataset?.n);
              const f = FLOORS.find((x) => x.n === n);
              if (!f) {
                handleFloorHover(null);
                return;
              }
              if (isTouch && hoverFloor !== f) {
                handleFloorHover(f);
                return;
              }
              enterFloor(f);
            }}
          >
            {FLOORS.map((f) => {
              const isPh = f.unit === 'P';
              const isHovered = hoverFloor?.n === f.n;
              const className = `band${isPh ? ' ph' : ''}${isHovered ? ' on' : ''}`;
              const x0 = f.x0 ?? TOWER_X0;
              const x1 = f.x1 ?? TOWER_X1;
              const points = `${x0},${f.y0 + 1} ${x1},${f.y0 + 1} ${x1},${f.y1 - 1} ${x0},${f.y1 - 1}`;
              return (
                <polygon
                  key={f.n}
                  points={points}
                  className={className}
                  data-n={f.n}
                />
              );
            })}
          </svg>
        </div>
      </section>

      {/* UNIT (FLOOR KEY LAYOUT) LAYER */}
      <section className="layer hidden" id="unitLayer" ref={unitLayerRef}>
        <div className="plane" id="unitPlane" ref={unitPlaneRef}>
          <img
            id="unitImg"
            ref={unitImgRef}
            src="/assets/nitaara/floorplan/master-plan.jpg"
            alt="First Floor Plan & Key Layout"
            draggable={false}
          />
          <div id="dots" ref={dotsContainerRef}>
            {selectedFloor &&
              UNITS[selectedFloor.unit].rooms.map((r) => {
                const isHot = hotRoom?.id === r.id;
                return (
                  <div
                    key={r.id}
                    className={`dot ${isHot ? 'hot' : ''}`}
                    style={{
                      left: `${(r.x / 100) * IW}px`,
                      top: `${(r.y / 100) * IH}px`,
                    }}
                  >
                    <button
                      type="button"
                      aria-label={`Inspect ${r.name}`}
                      onClick={() => enterRoom(r)}
                    >
                      <i />
                    </button>
                    <span className="dl">{r.name}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* ROOM / LEVEL 3 UNIT CAD FLOOR PLAN LAYER WITH PAN & ZOOM */}
      <section
        className="layer hidden"
        id="roomLayer"
        ref={roomLayerRef}
        onPointerDown={(e) => {
          if (view !== 'room') return;
          setIsCadDragging(true);
          setCadDragStart({ x: e.clientX - cadPan.x, y: e.clientY - cadPan.y });
        }}
        onPointerMove={(e) => {
          if (!isCadDragging || view !== 'room') return;
          setCadPan({
            x: e.clientX - cadDragStart.x,
            y: e.clientY - cadDragStart.y,
          });
        }}
        onPointerUp={() => setIsCadDragging(false)}
        onPointerCancel={() => setIsCadDragging(false)}
        onWheel={(e) => {
          if (view !== 'room') return;
          const delta = e.deltaY < 0 ? 0.15 : -0.15;
          setCadZoom((z) => Math.min(Math.max(0.7, z + delta), 3.5));
        }}
      >
        <div
          className="plane"
          id="roomPlane"
          ref={roomPlaneRef}
          style={{
            transform: `translate(${cadPan.x}px, ${cadPan.y}px) scale(${cadZoom})`,
            transformOrigin: 'center center',
            transition: isCadDragging ? 'none' : 'transform 0.12s ease-out',
            cursor: isCadDragging ? 'grabbing' : 'grab',
          }}
        >
          <img
            id="roomImg"
            ref={roomImgRef}
            src="/assets/nitaara/floorplan/floor-plan1.jpg"
            alt="Unit CAD Floor Plan"
            draggable={false}
          />
        </div>

        {/* Level 3 Floating CAD Info & Zoom Controls */}
        {view === 'room' && selectedFloor && activeUnitDetails && (
          <>
            <div
              className="cad-caption-badge"
              style={{
                position: 'absolute',
                top: '72px',
                left: '32px',
                zIndex: 20,
                background: 'rgba(20, 20, 20, 0.88)',
                border: '1px solid rgba(197, 155, 60, 0.4)',
                borderRadius: '6px',
                padding: '8px 16px',
                color: '#f4efe6',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                pointerEvents: 'none',
              }}
            >
              <div style={{ fontSize: '10px', color: '#c59b3c', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}>
                Level 3 · Interactive CAD Floor Plan Drill-down
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>
                Floor {selectedFloor.n} · Flat {activeUnitNo} · {activeUnitDetails.label} ({activeUnitDetails.totalSqFt.toLocaleString()} sq ft)
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(244, 239, 230, 0.7)' }}>
                RERA Carpet: {activeUnitDetails.reraCarpetSqFt.toLocaleString()} SF + Balcony: {activeUnitDetails.balconySqFt.toLocaleString()} SF · {activeUnitDetails.priceLabel} All inclusive
              </div>
            </div>

            <div
              className="cad-zoom-controls"
              style={{
                position: 'absolute',
                top: '72px',
                right: '32px',
                zIndex: 20,
                display: 'flex',
                gap: '6px',
                background: 'rgba(20, 20, 20, 0.85)',
                border: '1px solid rgba(197, 155, 60, 0.3)',
                borderRadius: '6px',
                padding: '4px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <button
                type="button"
                onClick={() => setCadZoom((z) => Math.min(3.5, z + 0.25))}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
                title="Zoom In (+)"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setCadZoom((z) => Math.max(0.7, z - 0.25))}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
                title="Zoom Out (-)"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => {
                  setCadZoom(1);
                  setCadPan({ x: 0, y: 0 });
                }}
                style={{
                  padding: '6px 10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
                title="Reset Zoom to 100%"
              >
                Reset ({Math.round(cadZoom * 100)}%)
              </button>
            </div>
          </>
        )}
      </section>

      {/* VIDEO CLIP & FLASH LAYERS */}
      <video
        id="clip"
        ref={videoClipRef}
        className="layer hidden"
        muted
        playsInline
        preload="auto"
      />
      <div id="flash" ref={flashRef} className="layer" />

      {/* CHROME */}
      <Header
        onInquire={() => (_onGlobalEnquire ? _onGlobalEnquire() : handleSiteVisit())}
        onNavigate={handleNavClick}
      />

      <FloorTag
        floor={hoverFloor}
        position={tagPos}
        onEnter={enterFloor}
        isPortrait={portrait}
      />

      <Hint view={view} isCoarse={isTouch} />

      <UnitPanel
        floor={selectedFloor}
        isOpen={view === 'unit'}
        onBack={handleBack}
        onInquire={(info) => handleInquire(info)}
        onSiteVisit={handleSiteVisit}
        onSelectRoom={(r) => enterRoom(r)}
        onRoomHover={setHotRoom}
        onSelectUnitType={(typeId) => {
          if (typeId === '3bhk-type-01' && selectedFloor) setActiveUnitNo(`${selectedFloor.n}01`);
          else if (typeId === '3bhk-type-02' && selectedFloor) setActiveUnitNo(`${selectedFloor.n}02`);
          else if (typeId === '4bhk' && selectedFloor) setActiveUnitNo(`${selectedFloor.n}03`);
        }}
      />

      <RoomBar
        floor={selectedFloor}
        room={selectedRoom}
        activeUnitNo={activeUnitNo}
        isOpen={view === 'room'}
        onBack={handleBack}
        onSelectRoom={(r) => enterRoom(r, true)}
        onSelectUnitNo={handleSelectUnitNo}
        onInquire={(info) => handleInquire(info)}
      />

      {/* Floating Action Buttons */}
      {view === 'tower' && (
        <div
          className="floating-nav-pills"
          style={{
            position: 'fixed',
            bottom: '16px',
            left: '24px',
            zIndex: 9990,
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setFloorPlansTab('all');
              setFloorPlansOpen(true);
            }}
            style={{
              background: 'rgba(34, 33, 31, 0.9)',
              border: '1px solid rgba(197, 155, 60, 0.4)',
              color: '#c59b3c',
              borderRadius: '20px',
              padding: '7px 14px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Open Builder Floor Plans Gallery & Master Plan Lightbox"
          >
            <span>📐 Floor Plans & Layout</span>
          </button>

          <button
            type="button"
            onClick={handleSiteVisit}
            style={{
              background: 'rgba(34, 33, 31, 0.9)',
              border: '1px solid rgba(197, 155, 60, 0.4)',
              color: '#f4efe6',
              borderRadius: '20px',
              padding: '7px 14px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Request for Site Visit at Bhakti Shakti Chowk, Nigdi Pradhikaran"
          >
            <span>📍 Request Site Visit</span>
          </button>
        </div>
      )}

      {/* Sky Retreat Ambient Card */}
      {view === 'tower' && (
        <div
          className="sky-retreat-ambient"
          onClick={() => {
            const el = document.getElementById('amenities');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else setToastMsg('Level 26 Rooftop Sky Retreat & Pool — Nigdi Pradhikaran');
          }}
          role="button"
          tabIndex={0}
          title="Explore Level 26 Rooftop Sky Retreat & Pool"
        >
          <img src="/assets/nitaara/banner/desk3.jpg" alt="Level 26 Sky Retreat" />
          <div className="sky-retreat-ambient-label">
            Level 26 — Sky Retreat
            <div className="sky-retreat-ambient-sublabel">Infinity Pool · Rooftop Deck</div>
          </div>
        </div>
      )}

      {/* Hero Scroll Cue */}
      {view === 'tower' && (
        <div
          className="hero-scroll-cue"
          role="button"
          tabIndex={0}
          style={{ cursor: 'pointer', pointerEvents: 'auto' }}
          onClick={() => document.getElementById('highlights')?.scrollIntoView({ behavior: 'smooth' })}
          title="Scroll down to explore"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          <span>Explore</span>
        </div>
      )}

      <Cursor />

      <Toast message={toastMsg} onClose={() => setToastMsg(null)} />

      {/* Modals */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        initialMode={enquiryMode}
        prefill={enquiryPrefill}
      />

      <FloorPlansModal
        isOpen={floorPlansOpen}
        onClose={() => setFloorPlansOpen(false)}
        initialTab={floorPlansTab}
        onOpenEnquiry={(info) => {
          setFloorPlansOpen(false);
          handleInquire(info);
        }}
      />

      <div className="disclaimer">
        Concept prototype — not an official website. All details are tentative and subject to revision. MahaRERA&nbsp;P52100050692.
      </div>
    </div>
  );
};
