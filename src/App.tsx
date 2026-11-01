import React, { useState, useEffect } from 'react';
import { NitaaraPage } from './components/NitaaraPage';
import { TowerCalibrator } from './components/TowerCalibrator';

export const App: React.FC = () => {
  const [showCalibrate, setShowCalibrate] = useState(
    window.location.pathname.includes('/calibrate') ||
      window.location.search.includes('calibrate')
  );

  useEffect(() => {
    const handlePopState = () => {
      setShowCalibrate(
        window.location.pathname.includes('/calibrate') ||
          window.location.search.includes('calibrate')
      );
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (showCalibrate) {
    return <TowerCalibrator onBackToApp={() => setShowCalibrate(false)} />;
  }

  return (
    <>
      <NitaaraPage />
      {/* Dev Mode Calibrate Button */}
      <button
        onClick={() => setShowCalibrate(true)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '12px',
          zIndex: 9999,
          background: 'rgba(34, 33, 31, 0.85)',
          color: '#c59b3c',
          border: '1px solid rgba(197, 155, 60, 0.4)',
          borderRadius: '20px',
          padding: '6px 14px',
          fontSize: '11px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)',
        }}
      >
        ✦ Dev: Calibrate Floors
      </button>
    </>
  );
};

export default App;
