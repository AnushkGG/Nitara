import React from 'react';
import { Floor, Room } from '../types';
import { UNITS } from '../data/towerData';

interface RoomBarProps {
  floor: Floor | null;
  room: Room | null;
  isOpen: boolean;
  onBack: () => void;
  onSelectRoom: (room: Room) => void;
}

export const RoomBar: React.FC<RoomBarProps> = ({
  floor,
  room,
  isOpen,
  onBack,
  onSelectRoom,
}) => {
  if (!floor || !room) return null;

  const u = UNITS[floor.unit];
  const floorTitle = `Floor ${floor.n} · ${floor.n === 33 ? 'Sky Penthouse' : u.name}`;

  return (
    <div
      id="roomBar"
      className={`room-bar ${isOpen ? 'on' : ''}`}
      aria-hidden={!isOpen}
      aria-label="Room Navigation"
    >
      <button
        className="btn ghost"
        type="button"
        data-action="back"
        onClick={onBack}
      >
        Back to floor plan
      </button>

      <div className="rb-title">
        <span id="rbFloor">{floorTitle}</span>
        <strong id="rbRoom">{room.name}</strong>
      </div>

      <div className="rb-chips" id="rbChips">
        {u.rooms.map((r) => {
          const isCurrent = r.id === room.id;
          return (
            <button
              key={r.id}
              type="button"
              aria-current={isCurrent ? 'true' : undefined}
              onClick={() => !isCurrent && onSelectRoom(r)}
            >
              {r.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

