import React, { useState, useRef } from 'react';
import initialHotspots, { HotspotItem } from '../data/towerHotspots';
import { tower } from '../data/nitaara.data';

export type Hotspot = HotspotItem;

const IW = 2000;
const IH = 857;

export const TowerCalibrator: React.FC<{ onBackToApp?: () => void }> = ({ onBackToApp }) => {
  const [hotspots, setHotspots] = useState<Hotspot[]>(initialHotspots as Hotspot[]);
  const [activeFloor, setActiveFloor] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(hotspots, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 24px',
          background: '#242321',
          borderBottom: '1px solid rgba(197, 155, 60, 0.3)',
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: '#c59b3c', fontSize: '1.25rem' }}>
            Nitaara Tower — Floor Calibration Studio
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#aaa' }}>
            Base Image: /assets/nitaara/banner/desk1.jpg (2000×857) · Floors: {tower.totalFloors}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={copyJson}
            style={{
              background: '#c59b3c',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {copied ? 'Copied JSON!' : 'Copy Hotspots JSON'}
          </button>
          {onBackToApp && (
            <button
              onClick={onBackToApp}
              style={{
                background: 'transparent',
                border: '1px solid #c59b3c',
                color: '#c59b3c',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
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
          }}
        >
          <div style={{ position: 'relative', width: `${IW}px`, height: `${IH}px` }}>
            <img
              src="/assets/nitaara/banner/desk1.jpg"
              alt="Nitaara Tower base"
              style={{ width: `${IW}px`, height: `${IH}px`, display: 'block' }}
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
                const points = `${h.x0},${h.y0} ${h.x1},${h.y0} ${h.x1},${h.y1} ${h.x0},${h.y1}`;
                return (
                  <g key={h.floor}>
                    <polygon
                      points={points}
                      fill={isActive ? 'rgba(197, 155, 60, 0.45)' : 'rgba(197, 155, 60, 0.15)'}
                      stroke={isActive ? '#fff' : '#c59b3c'}
                      strokeWidth={isActive ? 2 : 1}
                      onMouseEnter={() => setActiveFloor(h.floor)}
                      style={{ transition: 'fill 0.15s, stroke 0.15s' }}
                    />
                    <text
                      x={h.x1 + 12}
                      y={(h.y0 + h.y1) / 2 + 4}
                      fill={isActive ? '#fff' : '#c59b3c'}
                      fontSize="11"
                      fontWeight="bold"
                    >
                      F{h.floor}
                    </text>
                  </g>
                );
              })}
            </svg>
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
