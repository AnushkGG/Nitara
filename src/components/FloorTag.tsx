import React from 'react';
import { Floor } from '../types';
import { UNITS, getFloorStatus, STATUS_TEXT, formatPrice } from '../data/towerData';

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
  const st = getFloorStatus(floor.n);
  const typeText = floor.n === 33 ? 'Sky Penthouse' : u.name;
  const specText = `${u.beds} Bed · ${u.baths} Bath · ${u.sf} SF`;
  const pillText = st === 'sold' ? 'Sold' : `${STATUS_TEXT[st]} · from ${formatPrice(floor)}`;
  const pillClass = 'pill' + (st === 'ok' ? '' : ' ' + st);

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

