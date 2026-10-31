import React from 'react';
import { ViewMode } from '../types';

interface HintProps {
  view: ViewMode;
  isCoarse: boolean;
}

export const Hint: React.FC<HintProps> = ({ view, isCoarse }) => {
  if (view !== 'tower') return null;

  return (
    <div id="hint" className="hint">
      <span className="hint-dot" aria-hidden="true" />
      <span id="hintText">
        {isCoarse ? 'Tap a floor to explore' : 'Hover a floor to explore'}
      </span>
    </div>
  );
};

