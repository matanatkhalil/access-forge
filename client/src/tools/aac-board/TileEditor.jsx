import React, { useState } from 'react';
import { Check, X, Trash2 } from 'lucide-react';

const TileEditor = ({ tile, onSave, onCancel, onDelete }) => {
  const [label, setLabel] = useState(tile.label);
  const [iconName, setIconName] = useState(tile.setIconName);
  const [color, setColor] = useState(tile.color);

  const handleSave = () => {
    onSave({ label, iconName, color });
  };

  return (
    <div className="tile-editor">
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Tile label"
        aria-label="Tile label"
      />

      <div className="tile-editor-actions">
        <button type="button" onClick={handleSave} aria-label="Save tile">
          <Check size={18} aria-hidden="true" />
        </button>
        <button type="button" onClick={onCancel} aria-label="Cancel editing">
          <X size={18} aria-hidden="true" />
        </button>
        <button type="button" onClick={onDelete} aria-label="Delete tile">
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default TileEditor;
