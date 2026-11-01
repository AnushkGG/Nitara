import React from 'react';
import { Floor, Room } from '../types';
import { UNITS, getFloorUnits } from '../data/towerData';

interface RoomBarProps {
  floor: Floor | null;
  room: Room | null;
  activeUnitNo?: string;
  isOpen: boolean;
  onBack: () => void;
  onSelectRoom: (room: Room) => void;
  onSelectUnitNo?: (unitNo: string) => void;
  onInquire?: (unitInfo: { floor: number; unitNo: string; label: string; price: string }) => void;
}

export const RoomBar: React.FC<RoomBarProps> = ({
  floor,
  room,
  activeUnitNo,
  isOpen,
  onBack,
  onSelectRoom,
  onSelectUnitNo,
  onInquire,
}) => {
  if (!floor || !room) return null;

  const floorUnits = getFloorUnits(floor.n);
  const currentUnit =
    floorUnits.find((u) => u.unitNo === activeUnitNo) || floorUnits[0];
  const u = UNITS[floor.unit];

  const floorTitle = `Floor ${floor.n} · Flat ${currentUnit.unitNo} · ${currentUnit.label}`;

  const whatsappText = encodeURIComponent(
    `Hello Nitaara Tower! I am inspecting Floor ${floor.n} Flat ${currentUnit.unitNo} (${currentUnit.label}, ${currentUnit.totalSqFt} sq ft - ${currentUnit.priceLabel} All inclusive). Please share the official CAD floor plan brochure.`
  );

  return (
    <div
      id="roomBar"
      className={`room-bar ${isOpen ? 'on' : ''}`}
      aria-hidden={!isOpen}
      aria-label="Unit CAD Plan Inspection"
    >
      <button
        className="btn ghost"
        type="button"
        data-action="back"
        onClick={onBack}
        title="Return to floor overview"
      >
        Back to floor plan
      </button>

      <div className="rb-title">
        <span id="rbFloor">{floorTitle}</span>
        <strong id="rbRoom">
          {room.name} {room.dims ? `(${room.dims})` : ''}
        </strong>
      </div>

      {/* Quick Unit Switchers */}
      <div
        className="rb-unit-switchers"
        style={{
          display: 'flex',
          gap: '6px',
          margin: '0 8px',
        }}
      >
        {floorUnits.map((fu) => {
          const isCurrent = fu.unitNo === currentUnit.unitNo;
          return (
            <button
              key={fu.unitNo}
              type="button"
              onClick={() => onSelectUnitNo?.(fu.unitNo)}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                color: isCurrent ? '#c59b3c' : 'rgba(244, 239, 230, 0.6)',
                background: isCurrent ? 'rgba(197, 155, 60, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: isCurrent ? '1px solid #c59b3c' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '3px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Flat {fu.unitNo} ({fu.config})
            </button>
          );
        })}
      </div>

      {/* Room Spaces Chips */}
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

      {/* Action CTA */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          type="button"
          className="btn solid"
          onClick={() =>
            onInquire?.({
              floor: floor.n,
              unitNo: currentUnit.unitNo,
              label: currentUnit.label,
              price: currentUnit.priceLabel,
            })
          }
          style={{ padding: '8px 14px', fontSize: '10px' }}
        >
          Request Floor Plan
        </button>
        <a
          href={`https://wa.me/918600612808?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            background: '#25D366',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 600,
            borderRadius: '2px',
            textDecoration: 'none',
          }}
        >
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
