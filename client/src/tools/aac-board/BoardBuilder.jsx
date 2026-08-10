import React, { useState } from 'react';
import TileEditor from './TileEditor';
import { Plus } from 'lucide-react';

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

      <div className="tiles-grid" aria-label="Board Builder Tiles">
        {draftTiles.map((tile, index) =>
          editingIndex === index ? (
            <TileEditor
              key={index}
              tile={tile}
              onSave={(updatedTile) => {
                updateTile(index, updatedTile);
                setEditingIndex(null);
              }}
              onCancel={() => setEditingIndex(null)}
              onDelete={() => {
                removeTile(index);
                setEditingIndex(null);
              }}
            />
          ) : (
            <button
              key={index}
              type="button"
              className="tile-button"
              onClick={() => setEditingIndex(index)}
            >
              <span>{tile.label || 'Untitled'}</span>
            </button>
          )
        )}
        <button type="button" className="tile-button add-tile-btn" onClick={addBlankTile}>
          <Plus size={36} aria-hidden="true" />
          <span>Add Tile</span>
        </button>
      </div>
      <div className="builder-actions">
        <button type="button" className="save-btn" onClick={() => onSave(title, draftTiles)}>
          Save
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BoardBuilder;
