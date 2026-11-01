import React, { useState, useRef, useEffect, useCallback } from 'react';
import initialStreetHotspots, { HotspotItem } from '../data/towerHotspots';
import initialPortraitHotspots from '../data/towerPortraitHotspots.json';
import { tower } from '../data/nitaara.data';

export type Hotspot = HotspotItem;

interface CalibratorView {
  id: 'portrait' | 'street' | 'sunset';
  label: string;
  src: string;
  w: number;
  h: number;
}

const VIEWS: CalibratorView[] = [
  {
    id: 'portrait',
    label: 'Portrait HQ Render (705×1024)',
    src: '/assets/nitaara/tower_portrait_hq.jpg',
    w: 705,
    h: 1024,
  },
  {
    id: 'street',
    label: 'Street Perspective (2000×857)',
    src: '/assets/nitaara/banner/desk1.jpg',
    w: 2000,
    h: 857,
  },
  {
    id: 'sunset',
    label: 'Sunset Highway Panorama (2000×857)',
    src: '/assets/nitaara/tower_landscape_sunset.jpg',
    w: 2000,
    h: 857,
  },
];

export const TowerCalibrator: React.FC<{ onBackToApp?: () => void }> = ({ onBackToApp }) => {
  const [selectedViewId, setSelectedViewId] = useState<'portrait' | 'street' | 'sunset'>('portrait');
  const currentView = VIEWS.find((v) => v.id === selectedViewId) || VIEWS[0];
  const { w: IW, h: IH } = currentView;

  // Dedicated hotspot state for portrait vs street
  const [portraitHotspots, setPortraitHotspots] = useState<Hotspot[]>(
    initialPortraitHotspots as Hotspot[]
  );
  const [streetHotspots, setStreetHotspots] = useState<Hotspot[]>(
    initialStreetHotspots as Hotspot[]
  );

  const hotspots = selectedViewId === 'portrait' ? portraitHotspots : streetHotspots;
  const setHotspots = selectedViewId === 'portrait' ? setPortraitHotspots : setStreetHotspots;

  const [activeFloor, setActiveFloor] = useState<number | null>(25);
  const [zoom, setZoom] = useState<number>(0.75);
  const [showAllOutlines, setShowAllOutlines] = useState<boolean>(false);
  const [keepContiguous, setKeepContiguous] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-fit image to screen on mount, view change, or resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const cw = containerRef.current.clientWidth - 48;
        const ch = containerRef.current.clientHeight - 48;
        if (cw > 100 && ch > 100) {
          const fit = Math.min(cw / IW, ch / IH);
          setZoom(Math.max(0.3, Math.min(fit, 1.25)));
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [IW, IH]);

  // Keyboard navigation for precision tuning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeFloor) return;
      if (e.key === 'ArrowUp' && !e.shiftKey) {
        e.preventDefault();
        setActiveFloor((f) => Math.min(25, (f ?? 24) + 1));
      } else if (e.key === 'ArrowDown' && !e.shiftKey) {
        e.preventDefault();
        setActiveFloor((f) => Math.max(1, (f ?? 2) - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFloor]);

  const activeHotspot = hotspots.find((h) => h.floor === activeFloor);

  const updateHotspot = useCallback(
    (floor: number, field: 'y0' | 'y1' | 'x0' | 'x1', delta: number) => {
      setHotspots((prev) => {
        const updated = prev.map((h) => {
          if (h.floor !== floor) return h;
          const nextVal = h[field] + delta;
          const u = { ...h, [field]: nextVal };
          const norm = {
            x0: Number((u.x0 / IW).toFixed(4)),
            y0: Number((u.y0 / IH).toFixed(4)),
            x1: Number((u.x1 / IW).toFixed(4)),
            y1: Number((u.y1 / IH).toFixed(4)),
          };
          return {
            ...u,
            normalized: norm,
            polygon: [
              [norm.x0, norm.y0],
              [norm.x1, norm.y0],
              [norm.x1, norm.y1],
              [norm.x0, norm.y1],
            ] as [number, number][],
          };
        });

        // If contiguous mode is active, sync adjacent floor boundary
        if (keepContiguous) {
          if (field === 'y1') {
            const nextFloor = floor - 1;
            const changedFloor = updated.find((x) => x.floor === floor);
            if (changedFloor) {
              const targetIdx = updated.findIndex((x) => x.floor === nextFloor);
              if (targetIdx !== -1) {
                const adj = { ...updated[targetIdx], y0: changedFloor.y1 };
                adj.normalized = {
                  ...adj.normalized,
                  y0: Number((adj.y0 / IH).toFixed(4)),
                };
                adj.polygon = [
                  [adj.normalized.x0, adj.normalized.y0],
                  [adj.normalized.x1, adj.normalized.y0],
                  [adj.normalized.x1, adj.normalized.y1],
                  [adj.normalized.x0, adj.normalized.y1],
                ];
                updated[targetIdx] = adj;
              }
            }
          } else if (field === 'y0') {
            const prevFloor = floor + 1;
            const changedFloor = updated.find((x) => x.floor === floor);
            if (changedFloor) {
              const targetIdx = updated.findIndex((x) => x.floor === prevFloor);
              if (targetIdx !== -1) {
                const adj = { ...updated[targetIdx], y1: changedFloor.y0 };
                adj.normalized = {
                  ...adj.normalized,
                  y1: Number((adj.y1 / IH).toFixed(4)),
                };
                adj.polygon = [
                  [adj.normalized.x0, adj.normalized.y0],
                  [adj.normalized.x1, adj.normalized.y0],
                  [adj.normalized.x1, adj.normalized.y1],
                  [adj.normalized.x0, adj.normalized.y1],
                ];
                updated[targetIdx] = adj;
              }
            }
          }
        }

        return updated;
      });
    },
    [IW, IH, keepContiguous, setHotspots]
  );

  // Auto-distribute slabs mathematically across crown to ground
  const handleAutoDistributeEvenly = () => {
    setHotspots((prev) => {
      const topFloor = prev.find((x) => x.floor === 25);
      const bottomFloor = prev.find((x) => x.floor === 1);
      const startY = topFloor ? topFloor.y0 : selectedViewId === 'portrait' ? 92 : 106;
      const endY = bottomFloor ? bottomFloor.y1 : selectedViewId === 'portrait' ? 885 : 748;
      const span = endY - startY;

      return prev.map((h, i) => {
        // i=0 is floor 25, i=24 is floor 1
        const y0 = Math.round(startY + i * (span / 25));
        const y1 = Math.round(startY + (i + 1) * (span / 25));
        const t = i / 24.0;

        let x0 = h.x0;
        let x1 = h.x1;
        if (selectedViewId === 'portrait') {
          x0 = 118;
          x1 = 548;
        } else {
          x0 = Math.round(1092 - 10 * t);
          x1 = Math.round(1408 + 5 * t);
        }

        const norm = {
          x0: Number((x0 / IW).toFixed(4)),
          y0: Number((y0 / IH).toFixed(4)),
          x1: Number((x1 / IW).toFixed(4)),
          y1: Number((y1 / IH).toFixed(4)),
        };

        return {
          ...h,
          y0,
          y1,
          x0,
          x1,
          normalized: norm,
          polygon: [
            [norm.x0, norm.y0],
            [norm.x1, norm.y0],
            [norm.x1, norm.y1],
            [norm.x0, norm.y1],
          ],
        };
      });
    });
  };

  const handleFitScreen = () => {
    if (containerRef.current) {
      const cw = containerRef.current.clientWidth - 48;
      const ch = containerRef.current.clientHeight - 48;
      const fit = Math.min(cw / IW, ch / IH);
      setZoom(Math.max(0.3, Math.min(fit, 1.25)));
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#1a1918',
        color: '#f0ede8',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 24px',
          background: '#242321',
          borderBottom: '1px solid rgba(197, 155, 60, 0.3)',
          gap: '12px',
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: '#c59b3c', fontSize: '1.25rem' }}>
            Nitaara Tower — Floor Calibration Studio
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#aaa' }}>
            {currentView.label} · Total Floors: {tower.totalFloors}
          </span>
        </div>

        {/* View / Zoom Controls & Exit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Base Image Switcher */}
          <select
            value={selectedViewId}
            onChange={(e) => setSelectedViewId(e.target.value as 'portrait' | 'street' | 'sunset')}
            style={{
              background: '#1a1918',
              border: '1px solid rgba(197, 155, 60, 0.4)',
              color: '#c59b3c',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {VIEWS.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>

          {/* Auto-Align Grid Button */}
          <button
            onClick={handleAutoDistributeEvenly}
            style={{
              background: 'linear-gradient(135deg, rgba(197, 155, 60, 0.25) 0%, rgba(197, 155, 60, 0.1) 100%)',
              border: '1px solid #c59b3c',
              color: '#f1d58d',
              padding: '7px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
            }}
            title="Calculate uniform architectural floor heights between crown and ground"
          >
            📐 Distribute Grid Evenly
          </button>

          {/* Zoom Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#1a1918',
              border: '1px solid rgba(197, 155, 60, 0.3)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))}
              style={{
                padding: '6px 12px',
                color: '#c59b3c',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                background: 'transparent',
                border: 'none',
              }}
              title="Zoom Out"
            >
              −
            </button>
            <span
              style={{
                padding: '6px 10px',
                fontSize: '12px',
                color: '#fff',
                minWidth: '50px',
                textAlign: 'center',
              }}
            >
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
              style={{
                padding: '6px 12px',
                color: '#c59b3c',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                background: 'transparent',
                border: 'none',
              }}
              title="Zoom In"
            >
              +
            </button>
          </div>

          <button
            onClick={handleFitScreen}
            style={{
              background: 'rgba(197, 155, 60, 0.15)',
              border: '1px solid #c59b3c',
              color: '#c59b3c',
              padding: '7px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
            }}
            title="Auto-fit image to screen"
          >
            Fit to Screen
          </button>

          <button
            onClick={() => setShowAllOutlines((v) => !v)}
            style={{
              background: showAllOutlines ? '#c59b3c' : 'transparent',
              border: '1px solid rgba(197, 155, 60, 0.4)',
              color: showAllOutlines ? '#22211f' : '#c59b3c',
              padding: '7px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
            }}
            title="Toggle visibility of all floor wireframe boxes"
          >
            {showAllOutlines ? 'Hide All Lines' : 'Show All Lines'}
          </button>

          {onBackToApp && (
            <button
              onClick={onBackToApp}
              style={{
                background: '#c59b3c',
                border: 'none',
                color: '#22211f',
                padding: '7px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '12px',
                marginLeft: '4px',
              }}
            >
              Exit to Main App
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Canvas & Overlay Viewport */}
        <div
          ref={containerRef}
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0d0d0c',
            padding: '24px',
          }}
        >
          {/* Scaled Wrapper to maintain layout sizing */}
          <div
            style={{
              width: `${IW * zoom}px`,
              height: `${IH * zoom}px`,
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: `${IW}px`,
                height: `${IH}px`,
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                position: 'relative',
                boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
              }}
            >
              <img
                src={currentView.src}
                alt={currentView.label}
                style={{ width: `${IW}px`, height: `${IH}px`, display: 'block', objectFit: 'contain' }}
                draggable={false}
              />
              <svg
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${IW}px`,
                  height: `${IH}px`,
                  cursor: 'crosshair',
                }}
                viewBox={`0 0 ${IW} ${IH}`}
              >
                {hotspots.map((h) => {
                  const isActive = h.floor === activeFloor;
                  const isVisible = isActive || showAllOutlines;
                  const points = `${h.x0},${h.y0} ${h.x1},${h.y0} ${h.x1},${h.y1} ${h.x0},${h.y1}`;

                  return (
                    <g key={h.floor}>
                      <polygon
                        points={points}
                        fill={
                          isActive
                            ? 'rgba(197, 155, 60, 0.42)'
                            : showAllOutlines
                              ? 'rgba(197, 155, 60, 0.08)'
                              : 'transparent'
                        }
                        stroke={
                          isActive
                            ? '#ffffff'
                            : showAllOutlines
                              ? 'rgba(197, 155, 60, 0.45)'
                              : 'transparent'
                        }
                        strokeWidth={isActive ? 2 : 1}
                        onMouseEnter={() => setActiveFloor(h.floor)}
                        onClick={() => setActiveFloor(h.floor)}
                        style={{ transition: 'fill 0.15s, stroke 0.15s', cursor: 'pointer' }}
                      />
                      {isVisible && (
                        <text
                          x={h.x1 + 10}
                          y={(h.y0 + h.y1) / 2 + 4}
                          fill={isActive ? '#ffffff' : '#c59b3c'}
                          fontSize={selectedViewId === 'portrait' ? '12' : '11'}
                          fontWeight="bold"
                        >
                          F{h.floor}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div
          style={{
            width: '360px',
            background: '#242321',
            borderLeft: '1px solid rgba(197, 155, 60, 0.25)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#c59b3c', fontSize: '1rem' }}>Floor Grid Inspector</h3>
            <label style={{ fontSize: '0.75rem', color: '#bbb', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={keepContiguous}
                onChange={(e) => setKeepContiguous(e.target.checked)}
              />
              Lock Slabs (No Gaps)
            </label>
          </div>

          {activeHotspot ? (
            <div
              style={{
                background: '#1a1918',
                padding: '16px',
                borderRadius: '6px',
                border: '1px solid rgba(197, 155, 60, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#c59b3c' }}>
                  Floor {activeHotspot.floor}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#d0c8b8', background: 'rgba(197,155,60,0.15)', padding: '2px 8px', borderRadius: '3px' }}>
                  Height: {activeHotspot.y1 - activeHotspot.y0}px · Width: {activeHotspot.x1 - activeHotspot.x0}px
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#e0deda' }}>
                3 Residences: Flat {activeHotspot.floor}01 (3 BHK), {activeHotspot.floor}02 (3 BHK), {activeHotspot.floor}03 (4 BHK)
              </div>

              {/* Boundary Precision Nudge Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Top Slab Y0 */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#aaa', marginBottom: '4px' }}>
                    <span>Top Slab (Y0):</span>
                    <strong style={{ color: '#fff' }}>{activeHotspot.y0}px</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => updateHotspot(activeHotspot.floor, 'y0', -5)} style={nudgeBtnStyle}>-5</button>
                    <button onClick={() => updateHotspot(activeHotspot.floor, 'y0', -1)} style={nudgeBtnStyle}>-1</button>
                    <button onClick={() => updateHotspot(activeHotspot.floor, 'y0', 1)} style={nudgeBtnStyle}>+1</button>
                    <button onClick={() => updateHotspot(activeHotspot.floor, 'y0', 5)} style={nudgeBtnStyle}>+5</button>
                  </div>
                </div>

                {/* Bottom Slab Y1 */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#aaa', marginBottom: '4px' }}>
                    <span>Bottom Slab (Y1):</span>
                    <strong style={{ color: '#fff' }}>{activeHotspot.y1}px</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => updateHotspot(activeHotspot.floor, 'y1', -5)} style={nudgeBtnStyle}>-5</button>
                    <button onClick={() => updateHotspot(activeHotspot.floor, 'y1', -1)} style={nudgeBtnStyle}>-1</button>
                    <button onClick={() => updateHotspot(activeHotspot.floor, 'y1', 1)} style={nudgeBtnStyle}>+1</button>
                    <button onClick={() => updateHotspot(activeHotspot.floor, 'y1', 5)} style={nudgeBtnStyle}>+5</button>
                  </div>
                </div>

                {/* Left Wall X0 */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#aaa', marginBottom: '4px' }}>
                    <span>Left Wall (X0):</span>
                    <strong style={{ color: '#fff' }}>{activeHotspot.x0}px</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => updateHotspot(activeHotspot.floor, 'x0', -5)} style={nudgeBtnStyle}>-5</button>
                    <button onClick={() => updateHotspot(activeHotspot.floor, 'x0', -1)} style={nudgeBtnStyle}>-1</button>
                    <button onClick={() => updateHotspot(activeHotspot.floor, 'x0', 1)} style={nudgeBtnStyle}>+1</button>
                    <button onClick={() => updateHotspot(activeHotspot.floor, 'x0', 5)} style={nudgeBtnStyle}>+5</button>
                  </div>
                </div>

                {/* Right Wall X1 */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#aaa', marginBottom: '4px' }}>
                    <span>Right Wall (X1):</span>
                    <strong style={{ color: '#fff' }}>{activeHotspot.x1}px</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => updateHotspot(activeHotspot.floor, 'x1', -5)} style={nudgeBtnStyle}>-5</button>
                    <button onClick={() => updateHotspot(activeHotspot.floor, 'x1', -1)} style={nudgeBtnStyle}>-1</button>
                    <button onClick={() => updateHotspot(activeHotspot.floor, 'x1', 1)} style={nudgeBtnStyle}>+1</button>
                    <button onClick={() => updateHotspot(activeHotspot.floor, 'x1', 5)} style={nudgeBtnStyle}>+5</button>
                  </div>
                </div>
              </div>

              {/* Normalized Data Preview */}
              <div style={{ fontSize: '0.75rem', color: '#888', background: '#111', padding: '8px', borderRadius: '4px', wordBreak: 'break-all' }}>
                Normalized: [{activeHotspot.normalized.x0}, {activeHotspot.normalized.y0}, {activeHotspot.normalized.x1}, {activeHotspot.normalized.y1}]
              </div>
            </div>
          ) : (
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Select or hover over any floor slab on the image to inspect.</p>
          )}

          {/* Quick Jump Floor Grid */}
          <div style={{ flex: 1, overflowY: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>Select Floor:</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginTop: '8px' }}>
              {hotspots.map((h) => (
                <button
                  key={h.floor}
                  onClick={() => setActiveFloor(h.floor)}
                  style={{
                    padding: '6px 0',
                    background: h.floor === activeFloor ? '#c59b3c' : '#333',
                    color: h.floor === activeFloor ? '#1a1918' : '#fff',
                    fontWeight: h.floor === activeFloor ? 700 : 400,
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  F{h.floor}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const nudgeBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: '6px 4px',
  background: '#2b2a27',
  color: '#c59b3c',
  border: '1px solid rgba(197, 155, 60, 0.3)',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '11px',
  fontWeight: 600,
};

export default TowerCalibrator;
