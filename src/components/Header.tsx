import React from 'react';

interface HeaderProps {
  onInquire: () => void;
  onNavigate?: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onInquire, onNavigate }) => {
  return (
    <header className="top" role="banner">
      <div className="brand">
        <span className="mark" aria-hidden="true">
          S
        </span>
        <span className="word">THE SOLENNE</span>
        <span className="sub">Brickell Bay · Miami</span>
      </div>
      <nav className="nav" aria-label="Main Navigation">
        <span
          role="button"
          tabIndex={0}
          onClick={() => onNavigate?.('residences')}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate?.('residences')}
        >
          Residences
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={() => onNavigate?.('penthouses')}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate?.('penthouses')}
        >
          Penthouses
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={() => onNavigate?.('amenities')}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate?.('amenities')}
        >
          Amenities
        </span>
        <a
          className="cta"
          href="#tour"
          data-action="inquire"
          onClick={(e) => {
            e.preventDefault();
            onInquire();
          }}
        >
          Private Tour
        </a>
      </nav>
    </header>
  );
};

