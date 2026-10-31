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

export const TowerExplorer: React.FC = () => {
  const [view, setView] = useState<ViewMode>('tower');
  const [hoverFloor, setHoverFloor] = useState<Floor | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [tagPos, setTagPos] = useState<{ left: number; top: number } | null>(null);
  const [hotRoom, setHotRoom] = useState<Room | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [portrait, setPortrait] = useState(isPortrait());

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
    const x = TOWER_X1 * t.s + t.tx + 6;
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
    setHoverFloor(null);
    setView('zoom');
    viewRef.current = 'zoom';

    const u = UNITS[f.unit];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Preload unit image & room images
    const imgEl = unitImgRef.current;
    const imgReady = new Promise<void>((res) => {
      if (!imgEl) return res();
      if (imgEl.getAttribute('src') === u.img && imgEl.complete) return res();
      imgEl.onload = () => res();
      imgEl.onerror = () => res();
      imgEl.src = u.img;
    });

    u.rooms.forEach((r) => {
      const im = new Image();
      im.src = r.img;
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

    // 2) Transition clip or dive
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

    // Move dollhouse to rest position
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

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Preload reverse clip
    warmVideo(CLIPS[`${f.unit}_${r.id}`]?.rev);

    // Hide dots and panel
    if (dotsContainerRef.current) {
      Array.from(dotsContainerRef.current.children).forEach((d) => d.classList.remove('on'));
    }
    syncDotsScale();

    const roomImgEl = roomImgRef.current;
    const imgReady = new Promise<void>((res) => {
      if (!roomImgEl) return res();
      if (roomImgEl.getAttribute('src') === r.img && roomImgEl.complete) return res();
      roomImgEl.onload = () => res();
      roomImgEl.onerror = () => res();
      roomImgEl.src = r.img;
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

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    // Set 5504x3072 plane dimensions
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

  const handleInquire = () => {
    setToastMsg('Demo: this opens the private tour / floor plan request form.');
  };

  const handleNavClick = (section: string) => {
    if (section === 'residences') {
      const f = FLOORS.find((x) => x.unit === 'A');
      if (f) enterFloor(f);
    } else if (section === 'penthouses') {
      const f = FLOORS.find((x) => x.unit === 'P');
      if (f) enterFloor(f);
    } else {
      setToastMsg(`Demo: navigating to ${section}.`);
    }
  };

  const isCoarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  return (
    <div id="app" ref={appRef} data-view={view}>
      {/* TOWER LAYER */}
      <section className="layer" id="towerLayer" ref={towerLayerRef}>
        <div className="plane" id="towerPlane" ref={towerPlaneRef}>
          <img
            id="towerImg"
            ref={towerImgRef}
            src="/assets/tower.jpg"
            srcSet="/assets/tower_sm.jpg 1920w, /assets/tower.jpg 3840w"
            sizes="(max-width: 900px) 1920px, 3840px"
            alt="The Solenne tower at dusk on Biscayne Bay"
            draggable={false}
          />
          <svg
            id="bands"
            ref={bandsSvgRef}
            viewBox="0 0 5504 3072"
            preserveAspectRatio="none"
            aria-label="Tower Floors"
            onPointerMove={(e) => {
              if (view !== 'tower' || isBusyRef.current || e.pointerType === 'touch') return;
              const target = e.target as SVGElement;
              const n = Number(target.dataset?.n);
              handleFloorHover(n ? FLOORS.find((f) => f.n === n) || null : null);
            }}
            onPointerLeave={(e) => {
              if (e.pointerType !== 'touch' && view === 'tower') {
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
              if (isCoarse && hoverFloor !== f) {
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
              return (
                <rect
                  key={f.n}
                  x={TOWER_X0}
                  width={TOWER_X1 - TOWER_X0}
                  y={f.y0 + 2}
                  height={f.y1 - f.y0 - 4}
                  className={className}
                  data-n={f.n}
                />
              );
            })}
          </svg>
        </div>
      </section>

      {/* UNIT (DOLLHOUSE) LAYER */}
      <section className="layer hidden" id="unitLayer" ref={unitLayerRef}>
        <div className="plane" id="unitPlane" ref={unitPlaneRef}>
          <img id="unitImg" ref={unitImgRef} alt="Dollhouse floor plan" draggable={false} />
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
                      aria-label={`Go to ${r.name}`}
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

      {/* ROOM LAYER */}
      <section className="layer hidden" id="roomLayer" ref={roomLayerRef}>
        <div className="plane" id="roomPlane" ref={roomPlaneRef}>
          <img id="roomImg" ref={roomImgRef} alt="Room interior" draggable={false} />
        </div>
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
      <Header onInquire={handleInquire} onNavigate={handleNavClick} />

      <FloorTag
        floor={hoverFloor}
        position={tagPos}
        onEnter={enterFloor}
        isPortrait={portrait}
      />

      <Hint view={view} isCoarse={isCoarse} />

      <UnitPanel
        floor={selectedFloor}
        isOpen={view === 'unit'}
        onBack={handleBack}
        onInquire={handleInquire}
        onSelectRoom={(r) => enterRoom(r)}
        onRoomHover={setHotRoom}
      />

      <RoomBar
        floor={selectedFloor}
        room={selectedRoom}
        isOpen={view === 'room'}
        onBack={handleBack}
        onSelectRoom={(r) => enterRoom(r, true)}
      />

      <Cursor />

      <Toast message={toastMsg} onClose={() => setToastMsg(null)} />

      <div className="disclaimer">
        Concept demo by Lynam Up Media. The Solenne is fictional; all imagery is AI-generated.
      </div>
    </div>
  );
};
