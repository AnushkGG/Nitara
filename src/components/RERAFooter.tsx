import React from 'react';

export const RERAFooter: React.FC = () => {
  return (
    <footer
      className="nitaara-footer"
      style={{
        background: '#111110',
        borderTop: '1px solid rgba(197, 155, 60, 0.25)',
        padding: '32px 24px 24px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top row: address, phones, RERA icons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '24px',
            alignItems: 'flex-start',
            marginBottom: '24px',
          }}
        >
          {/* Address & contact */}
          <div style={{ flex: '1 1 300px' }}>
            <p
              style={{
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#c59b3c',
                fontWeight: 600,
                marginBottom: '8px',
              }}
            >
              Nitaara Tower
            </p>
            <p
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.65,
                marginBottom: '10px',
              }}
            >
              Plot No. C8, Sector No. 24, Bhakti Shakti Chowk,
              <br />
              Nigdi Pradhikaran, Pune - 411 044
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginBottom: '2px' }}>
              <a
                href="tel:+918600612808"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                +91 8600612808
              </a>
              {' '}|{' '}
              <a
                href="tel:+919890288871"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                +91 9890288871
              </a>
            </p>
            <div style={{ marginTop: '8px' }}>
              <a
                href="https://wa.me/918600612808?text=Hello%20Nitaara%20Tower%20Sales%20Team%2C%20I%20would%20like%20to%20enquire%20about%20residences."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#25D366',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                }}
              >
                <span>💬 Chat on WhatsApp: +91 8600612808</span>
              </a>
            </div>
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.45)',
                marginTop: '6px',
                letterSpacing: '0.06em',
              }}
            >
              MahaRERA: P52100050692
            </p>
          </div>

          {/* RERA + QR */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0,
            }}
          >
            <img
              src="/assets/nitaara/rera.png"
              alt="MahaRERA Registered"
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'contain',
              }}
            />
            <img
              src="/assets/nitaara/qr1.jpg"
              alt="MahaRERA QR Code"
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
          </div>
        </div>

        {/* Disclaimer */}
        <p
          style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.35)',
            lineHeight: 1.65,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '16px',
            marginBottom: '12px',
          }}
        >
          All Details in this Website are for easy information &amp; concept purposes only, and do
          not form part of the Agreement. This Website is Tentative &amp; Developers Reserve the
          right to make variations and Modification. | Concept prototype — not an official website.
        </p>

        {/* Copyright */}
        <p
          style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.06em',
          }}
        >
          © 2024 Nitaara Tower. MahaRERA P52100050692.
        </p>
      </div>
    </footer>
  );
};
