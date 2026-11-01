import React, { useState } from 'react';
import { TowerExplorer } from './TowerExplorer';
import { HighlightsSection } from './HighlightsSection';
import { AboutSection } from './AboutSection';
import { ConfigTable } from './ConfigTable';
import { AmenitiesSection } from './AmenitiesSection';
import { LocationSection } from './LocationSection';
import { RERAFooter } from './RERAFooter';
import { EnquiryModal } from './EnquiryModal';

export const NitaaraPage: React.FC = () => {
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  return (
    <div className="nitaara-page">
      {/* Hero Section: Full-viewport tower explorer */}
      <section id="tower-hero" className="nitaara-hero-section">
        <TowerExplorer onGlobalEnquire={() => setEnquiryOpen(true)} />
      </section>

      {/* Content sections below hero */}
      <main className="nitaara-content">
        <section id="highlights">
          <HighlightsSection />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <section id="configurations">
          <ConfigTable onEnquire={() => setEnquiryOpen(true)} />
        </section>
        <section id="amenities">
          <AmenitiesSection />
        </section>
        <section id="location">
          <LocationSection />
        </section>
      </main>

      <RERAFooter />

      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        initialMode="sitevisit"
        prefill={null}
      />
    </div>
  );
};
