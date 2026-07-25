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
  Plus,
  Heart,
  Smile,
  X,
  ArrowRight,
  ThumbsUp,
  HeartHandshake,
  Play,
  Pause,
  Gauge,
} from 'lucide-react';

import starterTiles from './starterTiles.json';
import { useSpeech } from './useSpeech';
import { useScanner } from './useScanner';
import './AACBoard.css';

const ICON_MAP = {
  Utensils,
  GlassWater,
  Hand,
  Check,
  OctagonX,
  Plus,
  Heart,
  Smile,
  X,
  ArrowRight,
  HeartHandshake,
  ThumbsUp,
};

const AACBoard = () => {
  // state for the sentence bar
  const [selectedWords, setSelectedWords] = useState([]);
  const { speak, stop } = useSpeech();

  // Load saved scan speed from localStorage (default: 1500ms = 1.5s)
  const [scanSpeed, setScanSpeed] = useState(() => {
    const saved = localStorage.getItem('aac_scan_speed');
    return saved ? Number(saved) : 1500;
  });

  const handleSelectingTile = (label) => {
    setSelectedWords((prev) => {
      return [...prev, label];
    });
    speak(label);
  };

  // Connect useScanner hook
  const { isScanning, setIsScanning, mode, columns, activeRowIndex, activeTileIndex } = useScanner({
    totalItems: starterTiles.length,
    scanSpeed,
    onSelectTile: (selectedIndex) => {
      const tile = starterTiles[selectedIndex];
      if (tile) {
        handleSelectingTile(tile.label);
      }
    },
  });

  const handleSpeedChange = (e) => {
    const newSpeed = Number(e.target.value);
    setScanSpeed(newSpeed);
    localStorage.setItem('aac_scan_speed', newSpeed.toString());
  };

  const handleClear = () => {
    stop();
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

      {/* Switch Access & Scanning Toolbar */}
      <div className="scanner-toolbar">
        <button
          type="button"
          className={`scan-toggle-btn ${isScanning ? 'active' : ''}`}
          onClick={() => setIsScanning((prev) => !prev)}
        >
          {isScanning ? <Pause size={18} /> : <Play size={18} />}
          <span>{isScanning ? 'Pause Auto-Scan' : 'Start Auto-Scan'}</span>
        </button>

        <div className="speed-selector">
          <Gauge size={18} aria-hidden="true" />
          <label htmlFor="scan-speed-select">Speed:</label>
          <select id="scan-speed-select" value={scanSpeed} onChange={handleSpeedChange}>
            <option value={3000}>3.0s (Slow)</option>
            <option value={2000}>2.0s (Medium)</option>
            <option value={1500}>1.5s (Default)</option>
            <option value={1000}>1.0s (Fast)</option>
          </select>
        </div>
      </div>

      {/* Tile Grid */}
      <main className="tiles-grid" aria-label="Communication Tiles">
        {starterTiles.map((tile, index) => {
          // Look up icon dynamically based on iconName string
          const IconComponent = ICON_MAP[tile.iconName];

          // Calculate grid coordinates for scanning indicators
          const tileRow = Math.floor(index / columns);
          const tileCol = index % columns;

          const isRowActive = isScanning && tileRow === activeRowIndex;
          const isTileActive =
            isScanning && mode === 'TILE' && isRowActive && tileCol === activeTileIndex;

          return (
            <button
              key={tile.id}
              type="button"
              className={`tile-button ${isRowActive ? 'is-row-active' : ''} ${
                isTileActive ? 'is-tile-active' : ''
              }`}
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
