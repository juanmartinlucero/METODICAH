import React from 'react';

export interface FilterOption<T = string> {
  id: T;
  label: string;
  count?: number;
}

interface FilterPillsProps<T = string> {
  options: FilterOption<T>[];
  selectedId: T;
  onSelect: (id: T) => void;
  style?: React.CSSProperties;
}

export function FilterPills<T = string>({
  options,
  selectedId,
  onSelect,
  style
}: FilterPillsProps<T>) {
  return (
    <div 
      style={{ 
        display: 'flex', 
        gap: '6px', 
        overflowX: 'auto', 
        paddingBottom: '4px',
        ...style 
      }}
    >
      {options.map((opt) => {
        const isSelected = selectedId === opt.id;
        return (
          <button
            key={String(opt.id)}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={isSelected ? 'btn-secondary' : 'btn-ghost'}
            style={{
              fontSize: '0.78rem',
              padding: '6px 12px',
              borderRadius: '6px',
              border: isSelected ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
              color: isSelected ? '#f59e0b' : 'var(--text-muted)',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {opt.label}
            {typeof opt.count === 'number' && ` (${opt.count})`}
          </button>
        );
      })}
    </div>
  );
}
