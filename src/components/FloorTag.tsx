import React from 'react';
import { Floor } from '../types';
import { UNITS, formatPrice } from '../data/towerData';

interface FloorTagProps {
  floor: Floor | null;
  position: { left: number; top: number } | null;
  onEnter: (floor: Floor) => void;
  isPortrait: boolean;
}

export const FloorTag: React.FC<FloorTagProps> = ({
  floor,
  position,
  onEnter,
  isPortrait,
}) => {
  if (!floor) {
    return <div id="floorTag" className="floor-tag" aria-live="polite" />;
  }

  const u = UNITS[floor.unit];
  const typeText = floor.n >= 18 ? '4 BHK Luxury Residence' : '3 BHK Premium Residence';
  const specText = `${u.beds} BHK · ${u.sf} sq ft carpet`;
  const pillText = `Enquire · ${formatPrice(floor)} all inc.`;
  const pillClass = 'pill ok';

  const style: React.CSSProperties =
    !isPortrait && position
      ? {
          left: `${position.left}px`,
          top: `${position.top}px`,
        }
      : {};

  return (
    <div id="floorTag" className="floor-tag on" style={style} aria-live="polite">
      <div className="ft-line" />
      <div className="ft-card">
        <div className="ft-num">
          <span className="ft-label">Floor</span>
          <span id="ftNum">{floor.n}</span>
        </div>
        <div className="ft-meta">
          <div id="ftType" className="ft-type">
            {typeText}
          </div>
          <div id="ftSpec" className="ft-spec">
            {specText}
          </div>
          <div id="ftStatus" className={pillClass}>
            {pillText}
          </div>
        </div>
        <button
          id="ftEnter"
          className="ft-enter"
          type="button"
          onClick={() => onEnter(floor)}
        >
          Enter floor {floor.n}
        </button>
      </div>
    </div>
  );
};

