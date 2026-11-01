import React, { useState } from 'react';
import { TowerExplorer } from './TowerExplorer';
import { HighlightsSection } from './HighlightsSection';
import { AboutSection } from './AboutSection';
import { ConfigTable } from './ConfigTable';
import { FloorPlansSection } from './FloorPlansSection';
import { AmenitiesSection } from './AmenitiesSection';
import { LocationSection } from './LocationSection';
import { RERAFooter } from './RERAFooter';
import { EnquiryModal, EnquiryPrefill } from './EnquiryModal';
import { FloorPlansModal, PlanTab } from './FloorPlansModal';

export const NitaaraPage: React.FC = () => {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryMode, setEnquiryMode] = useState<'floorplan' | 'sitevisit'>('sitevisit');
  const [enquiryPrefill, setEnquiryPrefill] = useState<EnquiryPrefill | null>(null);
  const [floorPlansOpen, setFloorPlansOpen] = useState(false);
  const [floorPlansTab, setFloorPlansTab] = useState<PlanTab>('all');

  const openEnquiry = (mode: 'floorplan' | 'sitevisit' = 'sitevisit', prefill: EnquiryPrefill | null = null) => {
    setEnquiryMode(mode);
    setEnquiryPrefill(prefill);
    setEnquiryOpen(true);
  };

  return (
    <div className="nitaara-page">
      {/* Hero Section: Full-viewport tower explorer */}
      <section id="tower-hero" className="nitaara-hero-section">
        <TowerExplorer onGlobalEnquire={() => openEnquiry('sitevisit')} />
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
          <ConfigTable onEnquire={() => openEnquiry('floorplan')} />
        </section>
        <section id="floorplans">
          <FloorPlansSection
            onOpenModal={() => {
              setFloorPlansTab('all');
              setFloorPlansOpen(true);
            }}
          />
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
        initialMode={enquiryMode}
        prefill={enquiryPrefill}
      />

      <FloorPlansModal
        isOpen={floorPlansOpen}
        onClose={() => setFloorPlansOpen(false)}
        initialTab={floorPlansTab}
        onOpenEnquiry={(info) => {
          setFloorPlansOpen(false);
          openEnquiry('floorplan', info);
        }}
      />
    </div>
  );
};
