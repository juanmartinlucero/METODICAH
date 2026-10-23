import React from 'react';
import { DEFAULT_CREW_SECTORS } from '../../utils/crewUtils';
import { Layers } from 'lucide-react';

export interface CrewDepartmentFilterProps {
  sectorFilter: string;
  onSectorFilterChange: (sec: string) => void;
  sectorCounts: Record<string, number>;
  totalCount: number;
  sectors?: string[];
}

export const CrewDepartmentFilter: React.FC<CrewDepartmentFilterProps> = ({
  sectorFilter,
  onSectorFilterChange,
  sectorCounts,
  totalCount,
  sectors = DEFAULT_CREW_SECTORS
}) => {
  return (
    <div 
      style={{ 
        display: 'flex', 
        gap: '6px', 
        overflowX: 'auto', 
        paddingBottom: '4px', 
        maxWidth: '100%', 
        width: '100%', 
        minWidth: 0, 
        scrollbarWidth: 'thin' 
      }}
    >
      <button
        type="button"
        onClick={() => onSectorFilterChange('todos')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 13px',
          borderRadius: '8px',
          fontSize: '0.8rem',
          fontWeight: 500,
          cursor: 'pointer',
          border: '1px solid',
          borderColor: sectorFilter === 'todos' ? 'rgba(56, 189, 248, 0.4)' : 'var(--border-subtle)',
          background: sectorFilter === 'todos' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0,0,0,0.25)',
          color: sectorFilter === 'todos' ? '#38bdf8' : 'var(--text-muted)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'all 0.15s ease'
        }}
      >
        <Layers size={14} />
        <span>Todos los Departamentos</span>
        <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>({totalCount})</span>
      </button>

      {sectors.map(sec => {
        const count = sectorCounts[sec] || 0;
        const isSelected = sectorFilter === sec;
        return (
          <button
            key={sec}
            type="button"
            onClick={() => onSectorFilterChange(sec)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 13px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: isSelected ? '#38bdf8' : 'var(--border-subtle)',
              background: isSelected ? 'rgba(56, 189, 248, 0.18)' : 'rgba(0,0,0,0.25)',
              color: isSelected ? '#38bdf8' : 'var(--text-muted)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.15s ease'
            }}
          >
            <span>{sec}</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>({count})</span>
          </button>
        );
      })}
    </div>
  );
};
