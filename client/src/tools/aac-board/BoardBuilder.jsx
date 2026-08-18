import React, { useState } from 'react';
import TileEditor from './TileEditor';
import { Plus, Trash2 } from 'lucide-react';
import './BoardBuilder.css';
import { ICON_OPTIONS } from './iconOptions';

const BoardBuilder = ({ onCancel, onSave }) => {
  const [title, setTitle] = useState('');
  const [draftTiles, setDraftTiles] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const addBlankTile = () => {
    setDraftTiles((prev) => {
      setEditingIndex(prev.length);
      return [...prev, { label: '', iconName: '', color: '#ffffff' }];
    });
  };

  const updateTile = (index, updatedTile) => {
    setDraftTiles((prev) => prev.map((t, i) => (i === index ? updatedTile : t)));
  };

  const removeTile = (index) => {
    setDraftTiles((prev) => prev.filter((_, i) => i !== index));
    setEditingIndex((prev) => (prev === index ? null : prev));
  };

  return (
    <div className="board-builder">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Board title"
        aria-label="Board title"
      />

      {editingIndex !== null && draftTiles[editingIndex] && (
        <TileEditor
          tile={draftTiles[editingIndex]}
          onSave={(updatedTile) => {
            updateTile(editingIndex, updatedTile);
            setEditingIndex(null);
          }}
          onCancel={() => setEditingIndex(null)}
          onDelete={() => removeTile(editingIndex)}
        />
      )}

      <div className="tiles-grid" aria-label="Board Builder Tiles">
        {draftTiles.map((tile, index) => {
          const IconComponent = ICON_OPTIONS[tile.iconName];
          return (
            <div key={index} className="tile-button-wrapper">
              <button
                type="button"
                className={`tile-button ${editingIndex === index ? 'is-editing' : ''}`}
                onClick={() => setEditingIndex(index)}
              >
                {IconComponent && <IconComponent size={36} color={tile.color} aria-hidden="true" />}
                <span className="tile-label-text">{tile.label || 'Untitled'}</span>
              </button>
              <button
                type="button"
                className="tile-delete-btn"
                onClick={() => removeTile(index)}
                aria-label={`Delete ${tile.label || 'tile'}`}
              >
                <Trash2 size={14} aria-hidden="true" />
              </button>
            </div>
          );
        })}
        <button type="button" className="tile-button add-tile-btn" onClick={addBlankTile}>
          <Plus size={36} aria-hidden="true" />
          <span>Add Tile</span>
        </button>
      </div>

      <div className="builder-actions">
        <button type="button" className="save-btn" onClick={() => onSave(title, draftTiles)}>
          Save Board
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BoardBuilder;
