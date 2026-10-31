import React from 'react';
import { Floor, Room } from '../types';
import { UNITS, getFloorStatus, STATUS_TEXT, formatPrice } from '../data/towerData';

interface UnitPanelProps {
  floor: Floor | null;
  isOpen: boolean;
  onBack: () => void;
  onInquire: () => void;
  onSelectRoom: (room: Room) => void;
  onRoomHover?: (room: Room | null) => void;
}

export const UnitPanel: React.FC<UnitPanelProps> = ({
  floor,
  isOpen,
  onBack,
  onInquire,
  onSelectRoom,
  onRoomHover,
}) => {
  if (!floor) return null;

  const u = UNITS[floor.unit];
  const st = getFloorStatus(floor.n);
  const eyebrow = `Floor ${floor.n} · ${STATUS_TEXT[st]}`;
  const title = floor.n === 33 ? 'Sky Penthouse' : u.name;
  const price = formatPrice(floor);
  const copy = `${u.copy} Plus ${u.outdoor}.`;

  return (
    <aside
      id="unitPanel"
      className={`panel ${isOpen ? 'on' : ''}`}
      aria-hidden={!isOpen}
      aria-label="Residence Details"
    >
      <div className="p-eyebrow" id="pEyebrow">
        {eyebrow}
      </div>
      <h1 className="p-title" id="pTitle">
        {title}
      </h1>

      <div className="p-specs" id="pSpecs">
        <div>
          <strong>{u.beds}</strong>
          <span>Bedrooms</span>
        </div>
        <div>
          <strong>{u.baths}</strong>
          <span>Baths</span>
        </div>
        <div>
          <strong>{u.sf}</strong>
          <span>Sq Ft</span>
        </div>
      </div>

      <div className="p-price">
        <span>From</span>
        <strong id="pPrice">{price}</strong>
      </div>

      <p className="p-copy" id="pCopy">
        {copy}
      </p>

      <div className="p-rooms" id="pRooms">
        {u.rooms.map((room) => (
          <button
            key={room.id}
            type="button"
            onClick={() => onSelectRoom(room)}
            onPointerEnter={() => onRoomHover?.(room)}
            onPointerLeave={() => onRoomHover?.(null)}
          >
            {room.name}
          </button>
        ))}
      </div>

      <div className="p-actions">
        <button
          className="btn ghost"
          type="button"
          data-action="back"
          onClick={onBack}
        >
          Back to tower
        </button>
        <button
          className="btn solid"
          type="button"
          data-action="inquire"
          onClick={onInquire}
        >
          Request floor plan
        </button>
      </div>
    </aside>
  );
};

