import React from 'react';

interface HeaderProps {
  onInquire: () => void;
  onNavigate?: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onInquire, onNavigate }) => {
  return (
    <header className="top" role="banner">
      <div className="brand">
        <img
          src="/assets/nitaara/logo-white2.png"
          alt="Nitaara Tower"
          style={{ height: '36px', width: 'auto', display: 'block' }}
        />
      </div>
      <nav className="nav" aria-label="Main Navigation">
        <span
          role="button"
          tabIndex={0}
          onClick={() => onNavigate?.('overview')}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate?.('overview')}
        >
          Overview
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={() => onNavigate?.('configurations')}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate?.('configurations')}
        >
          Configurations
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={() => onNavigate?.('floorplans')}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate?.('floorplans')}
        >
          Floor Plans
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={() => onNavigate?.('amenities')}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate?.('amenities')}
        >
          Amenities
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={() => onNavigate?.('location')}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate?.('location')}
        >
          Location
        </span>
        <a
          className="cta"
          href="#contact"
          data-action="inquire"
          onClick={(e) => {
            e.preventDefault();
            onInquire();
          }}
        >
          Request Site Visit
        </a>
      </nav>
    </header>
  );
};
