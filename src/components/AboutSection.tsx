import React from 'react';

const badges = [
  { src: '/assets/nitaara/landmark.png', label: 'Admired Landmarks' },
  { src: '/assets/nitaara/delivery.png', label: 'Consistently On-Time Delivery' },
  { src: '/assets/nitaara/construction.png', label: 'Quality Construction' },
];

export const AboutSection: React.FC = () => {
  return (
    <div
      style={{
        background: '#1a1918',
        padding: '80px 24px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p
          style={{
            fontSize: '12px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#c59b3c',
            marginBottom: '8px',
          }}
        >
          Developer
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
          About the Developer
        </h2>
        <div
          style={{
            width: '60px',
            height: '2px',
            background: '#c59b3c',
            margin: '16px 0 40px',
          }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '48px',
            alignItems: 'center',
            marginBottom: '56px',
          }}
          className="about-layout"
        >
          <img
            src="/assets/nitaara/project-by.png"
            alt="Project By – ABC Corp, Mittal Group & Success Group"
            style={{
              maxWidth: '220px',
              width: '100%',
              objectFit: 'contain',
            }}
          />
          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.75)',
              maxWidth: '540px',
            }}
          >
            A joint venture by <strong style={{ color: '#ffffff' }}>ABC Corp</strong>,{' '}
            <strong style={{ color: '#ffffff' }}>Mittal Group</strong> &amp;{' '}
            <strong style={{ color: '#ffffff' }}>Success Group</strong> — Pune's most trusted
            real estate developers with decades of experience and consistently on-time delivery.
          </p>
        </div>

        {/* Trust badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '24px',
          }}
        >
          {badges.map((b, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '28px 20px',
                background: '#22211f',
                border: '1px solid rgba(197, 155, 60, 0.2)',
                borderRadius: '4px',
                gap: '14px',
              }}
            >
              <img
                src={b.src}
                alt={b.label}
                style={{ width: '60px', height: '60px', objectFit: 'contain' }}
              />
              <p
                style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.8)',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  lineHeight: 1.4,
                  margin: 0,
                }}
              >
                {b.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
