import React, { useState } from 'react';
import { Floor, Room } from '../types';
import { UNITS, getFloorUnits } from '../data/towerData';

interface UnitPanelProps {
  floor: Floor | null;
  isOpen: boolean;
  onBack: () => void;
  onInquire: (unitInfo?: { floor: number; unitNo: string; label: string; price: string }) => void;
  onSiteVisit?: () => void;
  onSelectRoom: (room: Room) => void;
  onRoomHover?: (room: Room | null) => void;
  onSelectUnitType?: (unitTypeId: string) => void;
}

export const UnitPanel: React.FC<UnitPanelProps> = ({
  floor,
  isOpen,
  onBack,
  onInquire,
  onSiteVisit,
  onSelectRoom,
  onRoomHover,
  onSelectUnitType,
}) => {
  const [selectedFlatIndex, setSelectedFlatIndex] = useState(0);

  if (!floor) return null;

  const floorUnits = getFloorUnits(floor.n);
  const activeUnit = floorUnits[selectedFlatIndex] || floorUnits[0];
  const u = UNITS[floor.unit];

  const eyebrow = `Floor ${floor.n} · 3 Exclusive Residences Per Floor`;
  const title = `Floor ${floor.n} · 3 & 4 BHK Luxury Residences`;

  const handleFlatChange = (idx: number) => {
    setSelectedFlatIndex(idx);
    const unit = floorUnits[idx];
    onSelectUnitType?.(unit.typeId);
  };

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

      {/* Unit Selector Chips */}
      <div
        className="p-unit-tabs"
        style={{
          display: 'flex',
          gap: '6px',
          margin: '10px 0 14px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        {floorUnits.map((fu, idx) => {
          const isSelected = idx === selectedFlatIndex;
          return (
            <button
              key={fu.unitNo}
              type="button"
              onClick={() => handleFlatChange(idx)}
              style={{
                flex: 1,
                padding: '6px 8px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                background: isSelected ? 'rgba(197, 155, 60, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: isSelected ? '1px solid #c59b3c' : '1px solid rgba(255, 255, 255, 0.1)',
                color: isSelected ? '#c59b3c' : 'rgba(244, 239, 230, 0.7)',
                borderRadius: '4px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              Flat {fu.unitNo} ({fu.config})
            </button>
          );
        })}
      </div>

      <div className="p-specs" id="pSpecs">
        <div>
          <strong>{activeUnit.config.split(' ')[0]}</strong>
          <span>Bedrooms</span>
        </div>
        <div>
          <strong>{activeUnit.config === '4 BHK' ? '4' : '3'}</strong>
          <span>Baths</span>
        </div>
        <div>
          <strong>{activeUnit.totalSqFt.toLocaleString()}</strong>
          <span>Sq Ft Usable</span>
        </div>
      </div>

      <div className="p-price">
        <span>All inclusive</span>
        <strong id="pPrice">{activeUnit.priceLabel}</strong>
      </div>

      <p className="p-copy" id="pCopy">
        <strong>Flat {activeUnit.unitNo} ({activeUnit.label}):</strong> RERA Carpet {activeUnit.reraCarpetSqFt} sq ft + Balcony {activeUnit.balconySqFt} sq ft = {activeUnit.totalSqFt} sq ft total.
        {activeUnit.formedTerraceSqFt && (
          <span style={{ display: 'block', color: '#c59b3c', marginTop: '4px' }}>
            ✦ Includes {activeUnit.formedTerraceSqFt} sq ft private podium terrace!
          </span>
        )}
      </p>

      {/* Room Spaces / Level 3 CAD Drilldown */}
      <div className="p-rooms" id="pRooms">
        {u.rooms.map((room) => (
          <button
            key={room.id}
            type="button"
            onClick={() => onSelectRoom(room)}
            onPointerEnter={() => onRoomHover?.(room)}
            onPointerLeave={() => onRoomHover?.(null)}
          >
            <span>{room.name}</span>
            {room.dims && (
              <span style={{ fontSize: '11px', color: 'rgba(244, 239, 230, 0.5)', marginLeft: '6px' }}>
                ({room.dims})
              </span>
            )}
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
          onClick={() =>
            onInquire({
              floor: floor.n,
              unitNo: activeUnit.unitNo,
              label: activeUnit.label,
              price: activeUnit.priceLabel,
            })
          }
        >
          Request floor plan
        </button>
      </div>

      {onSiteVisit && (
        <button
          type="button"
          onClick={onSiteVisit}
          style={{
            width: '100%',
            marginTop: '8px',
            padding: '8px',
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: '#c59b3c',
            border: '1px solid rgba(197, 155, 60, 0.3)',
            borderRadius: '2px',
            background: 'rgba(197, 155, 60, 0.05)',
            cursor: 'pointer',
          }}
        >
          📍 Request for Site Visit
        </button>
      )}
    </aside>
  );
};
