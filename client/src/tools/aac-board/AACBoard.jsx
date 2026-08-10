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
  Copy,
  Pencil,
  LayoutGrid,
  ChevronDown,
  User,
  LogIn,
  LogOut,
} from 'lucide-react';

import starterTiles from './starterTiles.json';
import { useSpeech } from './useSpeech';
import { useScanner } from './useScanner';
import './AACBoard.css';
import AuthModal from '../../components/AuthModal';
import BoardBuilder from './BoardBuilder';

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
  const [user, setUser] = useState('');
  const [board, setBoard] = useState('');
  const [isBuilderMode, setIsBuilderMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // for opening the menu to choose a board
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // this can be login or signup
  const [authError, setAuthError] = useState(null); // clear past errors
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [boardError, setBoardError] = useState(null);

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

  const openAuthModal = (mode = 'login') => {
    setAuthError(null); // clean any past errors
    setAuthMode(mode); // Always default to login view when opened from header
    setIsAuthModalOpen(true);

    // prevent scrolling on the background while the modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleCopyBoard = () => {
    // code
  };

  const handleSaveBoard = () => {
    // code
  };

  const handleCancelEdit = () => {
    // code
  };

  const handleDeleteBoard = () => {
    // code
  };

  const handleCreateBoard = async (title, tiles) => {
    setBoardError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('api/aac/boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, tiles }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to create board');
      }

      const data = await response.json();
      setIsCreatingBoard(false);
    } catch (err) {
      setBoardError(err.message);
    }
  };

  return (
    <section className="aac-board" aria-label="AAC Communication Board">
      <header className="header-section">
        <button type="button" className="board-options">
          <LayoutGrid size={18} aria-hidden="true" />
          <span>Starter Board</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        <button type="button" className="board-creation" onClick={() => setIsCreatingBoard(true)}>
          <Plus size={18} aria-hidden="true" />
          <span>New Board</span>
        </button>
        {isLoggedIn ? (
          <button type="button" className="user-profile-btn">
            <User size={18} aria-hidden="true" />
            <span>{user?.name || 'Account'}</span>
          </button>
        ) : (
          <button type="button" className="login-btn" onClick={() => openAuthModal('login')}>
            <LogIn size={18} aria-hidden="true" />
            <span>Log In</span>
          </button>
        )}
      </header>

      {/* Sentence Bar */}
      <div className="sentence-bar-container">
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
      </div>

      {/* Switch Access & Scanning Toolbar */}
      <div className="scanner-toolbar">
        <div className="scan-controls-group">
          <button
            type="button"
            className={`scan-toggle-btn ${isScanning ? 'active' : ''}`}
            onClick={() => setIsScanning((prev) => !prev)}
          >
            {isScanning ? (
              <Pause size={18} aria-hidden="true" />
            ) : (
              <Play size={18} aria-hidden="true" />
            )}
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

        {board.isDefault ? (
          <button type="button" className="copy-btn" onClick={handleCopyBoard}>
            <Copy size={18} aria-hidden="true" />
            <span>Make a Copy to Edit</span>
          </button>
        ) : isBuilderMode ? (
          <div className="builder-active-actions">
            <button type="button" className="save-btn" onClick={handleSaveBoard}>
              <Check size={18} aria-hidden="true" />
              <span>Save Changes</span>
            </button>

            <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
              <X size={18} aria-hidden="true" />
              <span>Cancel</span>
            </button>
          </div>
        ) : (
          <div className="board-action-btns">
            <button type="button" className="edit-btn" onClick={() => setIsBuilderMode(true)}>
              <Pencil size={18} aria-hidden="true" />
              <span>Edit Board</span>
            </button>
            <button type="button" className="delete-board-btn" onClick={handleDeleteBoard}>
              <Trash2 size={18} aria-hidden="true" />
              <span>Delete Board</span>
            </button>
          </div>
        )}
      </div>

      {/* Tile Grid */}
      {isCreatingBoard ? (
        <BoardBuilder
          onCancel={() => setIsCreatingBoard(false)}
          onSave={(title, tiles) => {
            handleCreateBoard(title, tiles); // existing POST endpoint
            setIsCreatingBoard(false);
          }}
        />
      ) : (
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
      )}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onLoginSuccess={(userData) => {
          setUser(userData);
          setIsLoggedIn(true);
        }}
      />
    </section>
  );
};

export default AACBoard;
