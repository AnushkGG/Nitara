import React from 'react';

const highlights = [
  { icon: '🏙️', value: 'G + 25 Floors', sub: '+ Sky Terrace' },
  { icon: '🏠', value: '3 BHK & 4 BHK', sub: 'Residences' },
  { icon: '📍', value: '0.57 Acres', sub: 'Nigdi Pradhikaran' },
  { icon: '🗓️', value: 'Possession', sub: 'Mar 2028' },
];

export const HighlightsSection: React.FC = () => {
  return (
    <div
      style={{
        background: '#1a1918',
        padding: '64px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}
      >
        {highlights.map((h, i) => (
          <div
            key={i}
            style={{
              background: '#22211f',
              border: '1px solid rgba(197, 155, 60, 0.35)',
              borderTop: '3px solid #c59b3c',
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '40px' }}>{h.icon}</span>
            <strong
              style={{
                fontFamily: '"Tw Cen MT", Georgia, serif',
                fontSize: '22px',
                color: '#ffffff',
                lineHeight: 1.2,
              }}
            >
              {h.value}
            </strong>
            <span
              style={{
                fontSize: '13px',
                color: '#c59b3c',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {h.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
