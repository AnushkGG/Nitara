import React, { useState, useEffect } from 'react';
import { images } from '../data/nitaara.data';

export type PlanTab = 'all' | 'site' | 'wing';

interface FloorPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEnquiry: (unitInfo?: { floor?: number; unitNo?: string; label?: string; price?: string }) => void;
  initialTab?: PlanTab;
}

interface PlanItem {
  id: string;
  name: string;
  subtitle: string;
  src: string;
  type: 'site' | 'wing';
  config: string;
  carpetArea: string;
  balconyArea: string;
  totalArea: string;
  price: string;
  terraceNote?: string;
}

const PLANS: PlanItem[] = [
  {
    id: '3bhk-type-01',
    name: '3 BHK (Type 01)',
    subtitle: 'Flat X01 (Floors 1 to 25)',
    src: '/assets/nitaara/floorplan/floor-plan1.jpg',
    type: 'wing',
    config: '3 BHK',
    carpetArea: '1,058 sq ft',
    balconyArea: '189 sq ft',
    totalArea: '1,247 sq ft',
    price: '₹1.85 Cr All inclusive',
    terraceNote: 'Floor 1 includes 1,519 sq ft private podium terrace',
  },
  {
    id: '3bhk-type-02',
    name: '3 BHK (Type 02)',
    subtitle: 'Flat X02 (Floors 1 to 25)',
    src: '/assets/nitaara/floorplan/floor-plan2.jpg',
    type: 'wing',
    config: '3 BHK',
    carpetArea: '1,050 sq ft',
    balconyArea: '195 sq ft',
    totalArea: '1,245 sq ft',
    price: '₹1.85 Cr All inclusive',
    terraceNote: 'Floor 1 includes 126 sq ft private terrace',
  },
  {
    id: '4bhk',
    name: '4 BHK Grand Luxury',
    subtitle: 'Flat X03 (Floors 1 to 25)',
    src: '/assets/nitaara/floorplan/floor-plan3.jpg',
    type: 'wing',
    config: '4 BHK',
    carpetArea: '1,380 sq ft',
    balconyArea: '212 sq ft',
    totalArea: '1,592 sq ft',
    price: '₹2.36 Cr All inclusive',
    terraceNote: 'Floor 1 includes 1,100 sq ft private podium terrace',
  },
  {
    id: 'master-plan',
    name: 'First Floor Plan & Key Layout',
    subtitle: 'Wing Layout & Master Core Schedule',
    src: '/assets/nitaara/floorplan/master-plan.jpg',
    type: 'site',
    config: 'Wing & Core',
    carpetArea: 'All 3 Flats',
    balconyArea: '3 High-Speed Lifts',
    totalArea: 'G + 25 Residential Slabs',
    price: 'Key Layout Schedule',
    terraceNote: 'Depicts architectural layout, 2 fire staircases, and podium gardens',
  },
];

export const FloorPlansModal: React.FC<FloorPlansModalProps> = ({
  isOpen,
  onClose,
  onOpenEnquiry,
  initialTab = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<PlanTab>(initialTab);
  const [lightboxPlan, setLightboxPlan] = useState<PlanItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setActiveTab(initialTab);
    setLightboxPlan(null);
  }, [initialTab, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxPlan) {
          setLightboxPlan(null);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, lightboxPlan, onClose]);

  if (!isOpen) return null;

  const filteredPlans =
    activeTab === 'all'
      ? PLANS
      : activeTab === 'site'
      ? PLANS.filter((p) => p.type === 'site')
      : PLANS.filter((p) => p.type === 'wing');

  const openLightbox = (plan: PlanItem) => {
    setLightboxPlan(plan);
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(0.8, prev + delta), 3.0));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPos({ x: 0, y: 0 });
  };

  return (
    <div
      className="floor-plans-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99990,
        background: 'rgba(10, 12, 22, 0.94)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        color: '#f4efe6',
        fontFamily: 'Tw Cen MT, Roboto, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Top Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 28px',
          borderBottom: '1px solid rgba(197, 155, 60, 0.25)',
          background: 'rgba(24, 23, 21, 0.85)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src={images.logo}
            alt="Nitaara Tower"
            style={{ height: '32px', width: 'auto' }}
          />
          <div>
            <div
              style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#c59b3c',
                fontWeight: 600,
              }}
            >
              Architectural Plans & Layouts
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600 }}>
              Nitaara Tower — Nigdi Pradhikaran
            </div>
          </div>
        </div>

        {/* Builder Filter Tabs: All / Site Plan / Wing Plan */}
        <div
          className="plan-tabs"
          style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '3px',
          }}
        >
          <button
            type="button"
            data-tab="all"
            onClick={() => setActiveTab('all')}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              background: activeTab === 'all' ? '#c59b3c' : 'none',
              color: activeTab === 'all' ? '#22211f' : '#f4efe6',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            All Plans
          </button>
          <button
            type="button"
            data-tab="site"
            onClick={() => setActiveTab('site')}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              background: activeTab === 'site' ? '#c59b3c' : 'none',
              color: activeTab === 'site' ? '#22211f' : '#f4efe6',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Site Plan
          </button>
          <button
            type="button"
            data-tab="wing"
            onClick={() => setActiveTab('wing')}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              background: activeTab === 'wing' ? '#c59b3c' : 'none',
              color: activeTab === 'wing' ? '#22211f' : '#f4efe6',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Wing Plan
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close plans viewer"
          style={{
            padding: '8px 16px',
            background: 'none',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: '#f4efe6',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>✕ Close</span>
        </button>
      </header>

      {/* Main Grid Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignContent: 'start',
        }}
      >
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            data-plan-id={plan.id}
            style={{
              background: 'rgba(34, 33, 31, 0.85)',
              border: '1px solid rgba(197, 155, 60, 0.3)',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
            }}
          >
            {/* Thumbnail with overlay on hover */}
            <div
              style={{
                position: 'relative',
                background: '#0d101d',
                cursor: 'pointer',
                aspectRatio: '16/9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
              onClick={() => openLightbox(plan)}
            >
              <img
                src={plan.src}
                alt={plan.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '8px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.9,
                  transition: 'opacity 0.2s ease',
                }}
              >
                <span
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(34, 33, 31, 0.9)',
                    border: '1px solid #c59b3c',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#c59b3c',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  🔍 Inspect CAD Plan
                </span>
              </div>
            </div>

            {/* Details */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#c59b3c',
                  marginBottom: '4px',
                }}
              >
                {plan.subtitle}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>
                {plan.name}
              </h3>

              {/* Specs Box */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '10px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginBottom: '14px',
                }}
              >
                <div>
                  <span style={{ color: 'rgba(244, 239, 230, 0.5)', display: 'block', fontSize: '10px' }}>
                    CARPET AREA
                  </span>
                  <strong>{plan.carpetArea}</strong>
                </div>
                <div>
                  <span style={{ color: 'rgba(244, 239, 230, 0.5)', display: 'block', fontSize: '10px' }}>
                    BALCONY / AMENITY
                  </span>
                  <strong>{plan.balconyArea}</strong>
                </div>
                <div style={{ gridColumn: 'span 2', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '6px' }}>
                  <span style={{ color: 'rgba(244, 239, 230, 0.5)', display: 'block', fontSize: '10px' }}>
                    TOTAL USABLE AREA
                  </span>
                  <strong style={{ color: '#c59b3c' }}>{plan.totalArea}</strong>
                </div>
              </div>

              {plan.terraceNote && (
                <div
                  style={{
                    fontSize: '11px',
                    color: 'rgba(244, 239, 230, 0.7)',
                    fontStyle: 'italic',
                    marginBottom: '14px',
                  }}
                >
                  ✦ {plan.terraceNote}
                </div>
              )}

              {/* Price & CTA */}
              <div
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: '14px',
                }}
              >
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'rgba(244, 239, 230, 0.5)' }}>
                    PRICING
                  </div>
                  <strong style={{ fontSize: '16px', color: '#f4efe6' }}>{plan.price}</strong>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => openLightbox(plan)}
                    style={{
                      padding: '8px 12px',
                      background: 'none',
                      border: '1px solid rgba(197, 155, 60, 0.4)',
                      borderRadius: '4px',
                      color: '#c59b3c',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    View Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenEnquiry({
                        label: plan.name,
                        price: plan.price,
                      });
                    }}
                    style={{
                      padding: '8px 14px',
                      background: '#c59b3c',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#22211f',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Enquire
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Master Plan / Unit Plan Lightbox */}
      {lightboxPlan && (
        <div
          className="plan-lightbox-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(6, 8, 16, 0.98)',
            display: 'flex',
            flexDirection: 'column',
          }}
          onPointerUp={() => setIsDragging(false)}
        >
          {/* Lightbox Toolbar */}
          <div
            style={{
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(20, 20, 20, 0.9)',
              borderBottom: '1px solid rgba(197, 155, 60, 0.3)',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: '#c59b3c', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                CAD Floor Plan Lightbox
              </span>
              <h2 style={{ fontSize: '18px', margin: 0, fontWeight: 600 }}>
                {lightboxPlan.name} · {lightboxPlan.totalArea} ({lightboxPlan.price})
              </h2>
            </div>

            {/* Pan/Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleZoom(0.25)}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => handleZoom(-0.25)}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
                title="Zoom Out"
              >
                -
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
                title="Reset Zoom to 100%"
              >
                Reset ({Math.round(zoomLevel * 100)}%)
              </button>

              <button
                type="button"
                onClick={() =>
                  onOpenEnquiry({
                    label: lightboxPlan.name,
                    price: lightboxPlan.price,
                  })
                }
                style={{
                  padding: '6px 16px',
                  background: '#c59b3c',
                  border: 'none',
                  color: '#22211f',
                  fontWeight: 700,
                  fontSize: '11px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginLeft: '8px',
                }}
              >
                Request Floor Plan
              </button>

              <button
                type="button"
                onClick={() => setLightboxPlan(null)}
                style={{
                  padding: '6px 14px',
                  background: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginLeft: '12px',
                }}
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Interactive Pan/Zoom Canvas */}
          <div
            style={{
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
            }}
            onPointerDown={(e) => {
              setIsDragging(true);
              setDragStart({ x: e.clientX - panPos.x, y: e.clientY - panPos.y });
            }}
            onPointerMove={(e) => {
              if (!isDragging) return;
              setPanPos({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
              });
            }}
            onWheel={(e) => {
              e.preventDefault();
              const delta = e.deltaY < 0 ? 0.15 : -0.15;
              handleZoom(delta);
            }}
          >
            <img
              src={lightboxPlan.src}
              alt={lightboxPlan.name}
              draggable={false}
              style={{
                maxWidth: '90%',
                maxHeight: '85vh',
                objectFit: 'contain',
                transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${zoomLevel})`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.75)',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '11px',
                color: 'rgba(244, 239, 230, 0.7)',
                pointerEvents: 'none',
              }}
            >
              Click & drag to pan · Mouse wheel or buttons to zoom
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

