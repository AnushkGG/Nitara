import React from 'react';

const amenities = [
  { src: '/assets/nitaara/amenities/co-working-space.jpg', label: 'Co-working Space' },
  { src: '/assets/nitaara/amenities/gym.jpg', label: 'Gym & Fitness' },
  { src: '/assets/nitaara/amenities/indoor-games.jpg', label: 'Indoor Games Arena' },
  { src: '/assets/nitaara/amenities/kids-play-area.jpg', label: 'Kids Play Area' },
  { src: '/assets/nitaara/amenities/lobby.jpg', label: 'Grand Double-Height Lobby' },
  { src: '/assets/nitaara/amenities/senior-citizen-sitout-area.jpg', label: 'Senior Citizen Sit-out' },
  { src: '/assets/nitaara/amenities/yoga-deck.jpg', label: 'Yoga & Meditation Deck' },
];

export const AmenitiesSection: React.FC = () => {
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
          Lifestyle
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
          World-Class Amenities
        </h2>
        <p
          style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Designed for every lifestyle
        </p>
        <div
          style={{
            width: '60px',
            height: '2px',
            background: '#c59b3c',
            margin: '16px 0 40px',
          }}
        />

        {/* Grid of amenity images */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {amenities.map((a, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '4px',
                aspectRatio: '4/3',
                background: '#2a2926',
              }}
            >
              <img
                src={a.src}
                alt={a.label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')
                }
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '28px 16px 14px',
                  background: 'linear-gradient(transparent, rgba(15,14,12,0.85))',
                  pointerEvents: 'none',
                }}
              >
                <p
                  style={{
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    margin: 0,
                  }}
                >
                  {a.label}
                </p>
              </div>
            </div>
          ))}

          {/* Sky Retreat card */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '4px',
              aspectRatio: '4/3',
              background: '#2a2926',
              border: '1px solid rgba(197, 155, 60, 0.5)',
            }}
          >
            <img
              src="/assets/nitaara/banner/desk3.jpg"
              alt="Level 26 Sky Retreat"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')
              }
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '28px 16px 14px',
                background: 'linear-gradient(transparent, rgba(15,14,12,0.88))',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: '#c59b3c',
                  color: '#22211f',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  marginBottom: '6px',
                }}
              >
                Exclusive
              </span>
              <p
                style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  margin: 0,
                }}
              >
                Level 26 Sky Retreat
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
