import React from 'react';

const conveniences = [
  { label: 'D Mart', time: '1 min' },
  { label: 'Bhakti Shakti Garden', time: '1 min' },
  { label: 'Cityone Mall', time: '5 mins' },
  { label: 'Appu Ghar', time: '5 mins' },
  { label: 'Star Bazaar', time: '5 mins' },
  { label: 'Elpro City Square Mall', time: '10 mins' },
  { label: 'Sentosa Water Park', time: '10 mins' },
];

const transit = [
  { label: 'Old Mumbai-Pune Expressway', time: '1 min' },
  { label: 'Bhakti Shakti Metro Station', time: '3 mins' },
  { label: 'Bhakti Shakti Bus Terminal', time: '2 mins' },
  { label: 'Akurdi Railway Station', time: '10 mins' },
  { label: 'Chinchwad Station', time: '10 mins' },
  { label: 'Chakan MIDC', time: '15 mins' },
  { label: 'Talwade IT/MIDC', time: '10 mins' },
];

const schools = [
  { label: 'Dnyan Prabodhini School', time: '5 mins' },
  { label: 'City Pride School', time: '5 mins' },
  { label: 'St. Ursula High School', time: '6 mins' },
  { label: 'SB Patil College', time: '10 mins' },
  { label: 'PCCOE Engineering College', time: '10 mins' },
  { label: 'DY Patil College Campus', time: '10 mins' },
  { label: 'Elpro International School', time: '10 mins' },
];

interface LocCategory {
  title: string;
  icon: string;
  items: { label: string; time: string }[];
}

const categories: LocCategory[] = [
  { title: 'Conveniences', icon: '🛒', items: conveniences },
  { title: 'Transit & Connectivity', icon: '🚇', items: transit },
  { title: 'Schools & Colleges', icon: '🎓', items: schools },
];

export const LocationSection: React.FC = () => {
  return (
    <div
      style={{
        background: '#22211f',
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
          Location
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
          Prime Location Advantage
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
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)',
            gap: '48px',
            alignItems: 'start',
          }}
          className="location-layout"
        >
          {/* Map image */}
          <div>
            <img
              src="/assets/nitaara/map.jpg"
              alt="Nitaara Tower Location Map – Nigdi Pradhikaran, Pune"
              style={{
                width: '100%',
                borderRadius: '8px',
                border: '1px solid rgba(197, 155, 60, 0.25)',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Connectivity columns */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '32px',
            }}
          >
            {categories.map((cat) => (
              <div key={cat.title}>
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#c59b3c',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{cat.icon}</span> {cat.title}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {cat.items.map((item, j) => (
                    <li
                      key={j}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        padding: '7px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '13px',
                          color: 'rgba(255,255,255,0.75)',
                          flex: 1,
                        }}
                      >
                        {item.label}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#c59b3c',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
