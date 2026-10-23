import React from 'react';
import { PRESET_COLORS } from './settingsConstants';

interface SettingsColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  size?: number;
}

export const SettingsColorPicker: React.FC<SettingsColorPickerProps> = ({
  selectedColor,
  onSelectColor,
  size = 24
}) => {
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
      {PRESET_COLORS.map(c => {
        const isSelected = selectedColor === c;
        return (
          <button
            type="button"
            key={c}
            onClick={() => onSelectColor(c)}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              background: c,
              border: isSelected ? '2px solid #ffffff' : '1px solid transparent',
              cursor: 'pointer',
              transform: isSelected ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
              boxShadow: isSelected ? `0 0 8px ${c}88` : 'none',
              padding: 0
            }}
            title={c}
          />
        );
      })}
    </div>
  );
};
