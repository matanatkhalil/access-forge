import React, { useState } from 'react';
import {
  Utensils,
  GlassWater,
  Hand,
  Check,
  OctagonX,
  Volume2,
  Trash2,
  RotateCcw,
} from 'lucide-react';

import starterTiles from './starterTiles.json';
import { useSpeech } from './useSpeech';
import './AACBoard.css';

const ICON_MAP = {
  Utensils,
  GlassWater,
  Hand,
  Check,
  OctagonX,
};

const AACBoard = () => {
  // state for the sentence bar
  const [selectedWords, setSelectedWords] = useState([]);
  const { speak } = useSpeech();

  const handleSelectingTile = (label) => {
    setSelectedWords((prev) => {
      return [...prev, label];
    });
    speak(label);
  };

  const handleClear = () => {
    setSelectedWords([]);
  };

  const handleDeleteLast = () => {
    setSelectedWords((prev) => prev.slice(0, -1));
  };

  const handleRepeat = () => {
    speak(selectedWords.join(' '));
  };

  return (
    <section className="aac-board" aria-label="AAC Communication Board">
      {/* Sentence Bar */}
      <header className="sentence-bar-container">
        <div className="sentence-display" role="status" aria-live="polite">
          {selectedWords.length > 0 ? (
            selectedWords.join(' ')
          ) : (
            <span className="placeholder">Select tiles to build a sentence...</span>
          )}
        </div>

        <div className="sentence-controls">
          <button type="button" onClick={handleRepeat} disabled={selectedWords.length === 0}>
            <Volume2 aria-hidden="true" size={20} />
            <span>Repeat</span>
          </button>

          <button type="button" onClick={handleDeleteLast} disabled={selectedWords.length === 0}>
            <Trash2 aria-hidden="true" size={20} />
            <span>Delete Last</span>
          </button>

          <button type="button" onClick={handleClear} disabled={selectedWords.length === 0}>
            <RotateCcw aria-hidden="true" size={20} />
            <span>Clear</span>
          </button>
        </div>
      </header>

      {/* Tile Grid */}
      <main className="tiles-grid" aria-label="Communication Tiles">
        {starterTiles.map((tile) => {
          // Look up icon dynamically based on iconName string
          const IconComponent = ICON_MAP[tile.iconName];

          return (
            <button
              key={tile.id}
              type="button"
              className="tile-button"
              onClick={() => handleSelectingTile(tile.label)}
            >
              {IconComponent && (
                <IconComponent
                  className="tile-icon"
                  aria-hidden="true"
                  size={36}
                  color={tile.color}
                />
              )}
              <span className="tile-label">{tile.label}</span>
            </button>
          );
        })}
      </main>
    </section>
  );
};

export default AACBoard;
