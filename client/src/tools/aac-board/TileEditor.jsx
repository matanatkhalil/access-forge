import React, { useState } from 'react';
import { Check, X, Trash2 } from 'lucide-react';
import { ICON_OPTIONS as ICON_MAP } from './iconOptions';
import './TileEditor.css';

const COLOR_PRESETS = [
  '#dc2626',
  '#ea580c',
  '#16a34a',
  '#2563eb',
  '#7c3aed',
  '#db2777',
  '#b45309',
  '#0f766e',
];

const TileEditor = ({ tile, onSave, onCancel, onDelete }) => {
  const [label, setLabel] = useState(tile.label);
  const [iconName, setIconName] = useState(tile.iconName);
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

      <div className="icon-picker" role="group" aria-label="Choose an icon">
        {Object.entries(ICON_MAP).map(([name, IconComponent]) => (
          <button
            key={name}
            type="button"
            className={`icon-option ${iconName === name ? 'selected' : ''}`}
            onClick={() => setIconName(name)}
            aria-label={name}
            aria-pressed={iconName === name}
          >
            <IconComponent size={20} aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="color-picker" role="group" aria-label="Choose a color">
        {COLOR_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`color-swatch ${color === preset ? 'selected' : ''}`}
            style={{ backgroundColor: preset }}
            onClick={() => setColor(preset)}
            aria-label={`Color ${preset}`}
            aria-pressed={color === preset}
          />
        ))}
      </div>

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
