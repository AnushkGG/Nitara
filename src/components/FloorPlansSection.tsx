import React from 'react';

interface FloorPlansSectionProps {
  onOpenModal: () => void;
}

const plans = [
  {
    title: '3 BHK — Type 01',
    carpet: '1,058 sq ft',
    balcony: '189 sq ft',
    total: '1,247 sq ft',
    src: '/assets/nitaara/floorplan/floor-plan1.jpg',
    tag: 'Wing Plan',
  },
  {
    title: '3 BHK — Type 02',
    carpet: '1,050 sq ft',
    balcony: '195 sq ft',
    total: '1,245 sq ft',
    src: '/assets/nitaara/floorplan/floor-plan2.jpg',
    tag: 'Wing Plan',
  },
  {
    title: '4 BHK — Luxury',
    carpet: '1,380 sq ft',
    balcony: '212 sq ft',
    total: '1,592 sq ft',
    src: '/assets/nitaara/floorplan/floor-plan3.jpg',
    tag: 'Wing Plan',
  },
  {
    title: 'First Floor Key Plan',
    carpet: 'Master Layout',
    balcony: 'Podium Terrace',
    total: 'Floor 1',
    src: '/assets/nitaara/floorplan/master-plan.jpg',
    tag: 'Site Plan',
  },
];

export const FloorPlansSection: React.FC<FloorPlansSectionProps> = ({ onOpenModal }) => {
  return (
    <div
      style={{
        background: '#1a1918',
        padding: '80px 24px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '40px',
            gap: '20px',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '12px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#c59b3c',
                marginBottom: '8px',
              }}
            >
              Architectural Layouts
            </p>
            <h2
              style={{
                fontFamily: '"Tw Cen MT", Georgia, serif',
                fontSize: 'clamp(28px, 4vw, 48px)',
                color: '#ffffff',
                marginBottom: '8px',
                letterSpacing: '0.02em',
              }}
            >
              Floor Plans &amp; Wings
            </h2>
            <div
              style={{
                width: '60px',
                height: '2px',
                background: '#c59b3c',
                margin: '16px 0 0',
              }}
            />
          </div>

          <button
            onClick={onOpenModal}
            style={{
              background: '#c59b3c',
              border: '1px solid #c59b3c',
              color: '#22211f',
              padding: '12px 24px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background 0.2s ease, transform 0.2s ease',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#d4af37';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#c59b3c';
              (e.currentTarget as HTMLButtonElement).style.transform = 'none';
            }}
          >
            <span>📐 Fullscreen Gallery &amp; Zoom</span>
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {plans.map((p, idx) => (
            <div
              key={idx}
              onClick={onOpenModal}
              role="button"
              tabIndex={0}
              style={{
                background: '#22211f',
                border: '1px solid rgba(197, 155, 60, 0.25)',
                borderRadius: '4px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(197, 155, 60, 0.7)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 12px 28px rgba(0, 0, 0, 0.5)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  'rgba(197, 155, 60, 0.25)';
                (e.currentTarget as HTMLDivElement).style.transform = 'none';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              {/* Plan Thumbnail */}
              <div
                style={{
                  height: '220px',
                  background: '#11100e',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                }}
              >
                <img
                  src={p.src}
                  alt={p.title}
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    filter: 'contrast(1.05)',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(34, 33, 31, 0.85)',
                    border: '1px solid rgba(197, 155, 60, 0.4)',
                    color: '#c59b3c',
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '2px',
                  }}
                >
                  {p.tag}
                </span>
              </div>

              {/* Card Meta */}
              <div style={{ padding: '20px' }}>
                <h3
                  style={{
                    fontFamily: '"Tw Cen MT", Georgia, serif',
                    fontSize: '20px',
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}
                >
                  {p.title}
                </h3>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.65)',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(197, 155, 60, 0.15)',
                  }}
                >
                  <span>Carpet: {p.carpet}</span>
                  <strong style={{ color: '#c59b3c', fontWeight: 600 }}>Total: {p.total}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

