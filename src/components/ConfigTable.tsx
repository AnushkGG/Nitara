import React from 'react';

interface ConfigTableProps {
  onEnquire: () => void;
}

const configs = [
  {
    type: '3 BHK (Type 01)',
    carpet: '1,058 sq ft',
    total: '1,247 sq ft',
    price: '₹1.85 Cr*',
  },
  {
    type: '3 BHK (Type 02)',
    carpet: '1,050 sq ft',
    total: '1,245 sq ft',
    price: '₹1.85 Cr*',
  },
  {
    type: '4 BHK',
    carpet: '1,380 sq ft',
    total: '1,592 sq ft',
    price: '₹2.36 Cr*',
  },
];

export const ConfigTable: React.FC<ConfigTableProps> = ({ onEnquire }) => {
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
          Configurations &amp; Pricing
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
          Find Your Home
        </h2>
        <div
          style={{
            width: '60px',
            height: '2px',
            background: '#c59b3c',
            margin: '16px 0 40px',
          }}
        />

        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '540px',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '2px solid #c59b3c',
                }}
              >
                {['Configuration', 'Carpet Area', 'Total Area', 'Price', ''].map(
                  (h, i) => (
                    <th
                      key={i}
                      style={{
                        padding: '14px 16px',
                        textAlign: i === 4 ? 'center' : 'left',
                        fontSize: '11px',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: '#c59b3c',
                        fontWeight: 600,
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {configs.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: '1px solid rgba(197, 155, 60, 0.15)',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLTableRowElement).style.background =
                      'rgba(197,155,60,0.06)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLTableRowElement).style.background =
                      'transparent')
                  }
                >
                  <td
                    style={{
                      padding: '18px 16px',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '15px',
                    }}
                  >
                    {row.type}
                  </td>
                  <td
                    style={{
                      padding: '18px 16px',
                      color: 'rgba(255,255,255,0.75)',
                      fontSize: '14px',
                    }}
                  >
                    {row.carpet}
                  </td>
                  <td
                    style={{
                      padding: '18px 16px',
                      color: 'rgba(255,255,255,0.75)',
                      fontSize: '14px',
                    }}
                  >
                    {row.total}
                  </td>
                  <td
                    style={{
                      padding: '18px 16px',
                      color: '#c59b3c',
                      fontWeight: 700,
                      fontSize: '16px',
                      fontFamily: '"Tw Cen MT", Georgia, serif',
                    }}
                  >
                    {row.price}
                  </td>
                  <td style={{ padding: '18px 16px', textAlign: 'center' }}>
                    <button
                      onClick={onEnquire}
                      style={{
                        background: 'transparent',
                        border: '1px solid #c59b3c',
                        color: '#c59b3c',
                        padding: '8px 16px',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease, color 0.2s ease',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#c59b3c';
                        (e.currentTarget as HTMLButtonElement).style.color = '#22211f';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        (e.currentTarget as HTMLButtonElement).style.color = '#c59b3c';
                      }}
                    >
                      Enquire Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p
          style={{
            marginTop: '20px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.04em',
            lineHeight: 1.6,
          }}
        >
          *All inclusive pricing. Subject to revision. Contact for exact quote.
        </p>
      </div>
    </div>
  );
};
