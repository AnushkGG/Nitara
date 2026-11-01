import React, { useState, useRef, useEffect } from 'react';
import initialHotspots, { HotspotItem } from '../data/towerHotspots';
import { tower } from '../data/nitaara.data';

export type Hotspot = HotspotItem;

interface CalibratorView {
  id: 'portrait' | 'sunset' | 'street';
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
    id: 'sunset',
    label: 'Sunset Highway Panorama (2000×857)',
    src: '/assets/nitaara/tower_landscape_sunset.jpg',
    w: 2000,
    h: 857,
  },
  {
    id: 'street',
    label: 'Street Perspective (2000×857)',
    src: '/assets/nitaara/banner/desk1.jpg',
    w: 2000,
    h: 857,
  },
];

export const TowerCalibrator: React.FC<{ onBackToApp?: () => void }> = ({ onBackToApp }) => {
  const [selectedViewId, setSelectedViewId] = useState<'portrait' | 'sunset' | 'street'>('portrait');
  const currentView = VIEWS.find((v) => v.id === selectedViewId) || VIEWS[0];
  const { w: IW, h: IH } = currentView;

  const [hotspots, setHotspots] = useState<Hotspot[]>(initialHotspots as Hotspot[]);
  const [activeFloor, setActiveFloor] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number>(0.75);
  const [showAllOutlines, setShowAllOutlines] = useState<boolean>(false);
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

  const activeHotspot = hotspots.find((h) => h.floor === activeFloor);

  const updateHotspot = (floor: number, field: 'y0' | 'y1' | 'x0' | 'x1', delta: number) => {
    setHotspots((prev) =>
      prev.map((h) => {
        if (h.floor !== floor) return h;
        const updated = { ...h, [field]: h[field] + delta };
        const norm = {
          x0: Number((updated.x0 / IW).toFixed(4)),
          y0: Number((updated.y0 / IH).toFixed(4)),
          x1: Number((updated.x1 / IW).toFixed(4)),
          y1: Number((updated.y1 / IH).toFixed(4)),
        };
        const poly: [number, number][] = [
          [norm.x0, norm.y0],
          [norm.x1, norm.y0],
          [norm.x1, norm.y1],
          [norm.x0, norm.y1],
        ];
        return {
          ...updated,
          normalized: norm,
          polygon: poly,
        };
      })
    );
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
            onChange={(e) => setSelectedViewId(e.target.value as 'portrait' | 'sunset' | 'street')}
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
            onClick={() => setZoom(1.0)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'rgba(255, 255, 255, 0.7)',
              padding: '7px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Actual Size (100%)"
          >
            100%
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
            {showAllOutlines ? 'Hide Wireframes' : 'Show Wireframes'}
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
                  // If viewing portrait (705x1024), scale hotspots proportionally for preview
                  const scaleX = selectedViewId === 'portrait' ? 705 / 2000 : 1;
                  const scaleY = selectedViewId === 'portrait' ? 1024 / 857 : 1;
                  const x0 = h.x0 * scaleX;
                  const x1 = h.x1 * scaleX;
                  const y0 = h.y0 * scaleY;
                  const y1 = h.y1 * scaleY;
                  const points = `${x0},${y0} ${x1},${y0} ${x1},${y1} ${x0},${y1}`;

                  return (
                    <g key={h.floor}>
                      <polygon
                        points={points}
                        fill={
                          isActive
                            ? 'rgba(197, 155, 60, 0.45)'
                            : showAllOutlines
                              ? 'rgba(197, 155, 60, 0.12)'
                              : 'transparent'
                        }
                        stroke={
                          isActive
                            ? '#ffffff'
                            : showAllOutlines
                              ? 'rgba(197, 155, 60, 0.5)'
                              : 'transparent'
                        }
                        strokeWidth={isActive ? 2 : 1}
                        onMouseEnter={() => setActiveFloor(h.floor)}
                        style={{ transition: 'fill 0.15s, stroke 0.15s' }}
                      />
                      {isVisible && (
                        <text
                          x={x1 + 12}
                          y={(y0 + y1) / 2 + 4}
                          fill={isActive ? '#ffffff' : '#c59b3c'}
                          fontSize="11"
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
            width: '340px',
            background: '#242321',
            borderLeft: '1px solid rgba(197, 155, 60, 0.25)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto',
          }}
        >
          <h3 style={{ margin: 0, color: '#c59b3c', fontSize: '1rem' }}>Selected Floor Inspector</h3>

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
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#c59b3c' }}>
                  Floor {activeHotspot.floor}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#aaa' }}>
                  Height: {activeHotspot.y1 - activeHotspot.y0}px
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#e0deda' }}>
                Units on Floor: 3 (Flat {activeHotspot.floor}01, {activeHotspot.floor}02, {activeHotspot.floor}03)
              </div>

              {/* Boundary Nudge Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Top (Y0): {activeHotspot.y0}px</label>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    <button
                      onClick={() => updateHotspot(activeHotspot.floor, 'y0', -1)}
                      style={{ flex: 1, padding: '4px' }}
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => updateHotspot(activeHotspot.floor, 'y0', 1)}
                      style={{ flex: 1, padding: '4px' }}
                    >
                      ▼
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Bottom (Y1): {activeHotspot.y1}px</label>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    <button
                      onClick={() => updateHotspot(activeHotspot.floor, 'y1', -1)}
                      style={{ flex: 1, padding: '4px' }}
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => updateHotspot(activeHotspot.floor, 'y1', 1)}
                      style={{ flex: 1, padding: '4px' }}
                    >
                      ▼
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Left (X0): {activeHotspot.x0}px</label>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    <button
                      onClick={() => updateHotspot(activeHotspot.floor, 'x0', -1)}
                      style={{ flex: 1, padding: '4px' }}
                    >
                      ◄
                    </button>
                    <button
                      onClick={() => updateHotspot(activeHotspot.floor, 'x0', 1)}
                      style={{ flex: 1, padding: '4px' }}
                    >
                      ►
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Right (X1): {activeHotspot.x1}px</label>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    <button
                      onClick={() => updateHotspot(activeHotspot.floor, 'x1', -1)}
                      style={{ flex: 1, padding: '4px' }}
                    >
                      ◄
                    </button>
                    <button
                      onClick={() => updateHotspot(activeHotspot.floor, 'x1', 1)}
                      style={{ flex: 1, padding: '4px' }}
                    >
                      ►
                    </button>
                  </div>
                </div>
              </div>

              {/* Normalized Data Preview */}
              <div style={{ fontSize: '0.75rem', color: '#888', background: '#111', padding: '8px', borderRadius: '4px' }}>
                Normalized: [{activeHotspot.normalized.x0}, {activeHotspot.normalized.y0}, {activeHotspot.normalized.x1},{' '}
                {activeHotspot.normalized.y1}]
              </div>
            </div>
          ) : (
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Hover over any floor slab on the image to inspect.</p>
          )}

          {/* Quick Jump List */}
          <div style={{ flex: 1, overflowY: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>Quick Jump to Floor:</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginTop: '8px' }}>
              {hotspots.map((h) => (
                <button
                  key={h.floor}
                  onClick={() => setActiveFloor(h.floor)}
                  style={{
                    padding: '6px 0',
                    background: h.floor === activeFloor ? '#c59b3c' : '#333',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  {h.floor}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
