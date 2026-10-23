import React from 'react';
import type { EventStageConfig } from '../../types/metodicah';
import { Layers } from 'lucide-react';

export interface EventsStageFilterProps {
  stages: EventStageConfig[];
  selectedStage: string;
  onSelectStage: (stageId: string) => void;
  totalCount: number;
  getStageCount: (stageId: string) => number;
}

export const EventsStageFilter: React.FC<EventsStageFilterProps> = ({
  stages,
  selectedStage,
  onSelectStage,
  totalCount,
  getStageCount
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
        onClick={() => onSelectStage('all')}
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
          borderColor: selectedStage === 'all' ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)',
          background: selectedStage === 'all' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0,0,0,0.25)',
          color: selectedStage === 'all' ? '#f59e0b' : 'var(--text-muted)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'all 0.15s ease'
        }}
      >
        <Layers size={14} />
        <span>Todas las Etapas</span>
        <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>({totalCount})</span>
      </button>

      {stages.map(st => {
        const count = getStageCount(st.id);
        const isSelected = selectedStage === st.id;
        const color = st.color || '#f59e0b';
        return (
          <button
            key={st.id}
            type="button"
            onClick={() => onSelectStage(st.id)}
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
              borderColor: isSelected ? color : 'var(--border-subtle)',
              background: isSelected ? `${color}22` : 'rgba(0,0,0,0.25)',
              color: isSelected ? color : 'var(--text-muted)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.15s ease'
            }}
          >
            <span>{st.label}</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>({count})</span>
          </button>
        );
      })}
    </div>
  );
};
