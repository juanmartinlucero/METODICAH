import React from 'react';
import type { ClientType } from '../../types/metodicah';
import { Layers, Building2, User } from 'lucide-react';

export interface ClientTypeFilterProps {
  typeFilter: 'all' | ClientType;
  onTypeFilterChange: (type: 'all' | ClientType) => void;
  counts: { total: number; empresas: number; personas: number };
}

export const ClientTypeFilter: React.FC<ClientTypeFilterProps> = ({
  typeFilter,
  onTypeFilterChange,
  counts
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
      {/* Todos los Clientes */}
      <button
        type="button"
        onClick={() => onTypeFilterChange('all')}
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
          borderColor: typeFilter === 'all' ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)',
          background: typeFilter === 'all' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0,0,0,0.25)',
          color: typeFilter === 'all' ? '#f59e0b' : 'var(--text-muted)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'all 0.15s ease'
        }}
      >
        <Layers size={14} />
        <span>Todos los Clientes</span>
        <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>({counts.total})</span>
      </button>

      {/* Empresas */}
      <button
        type="button"
        onClick={() => onTypeFilterChange('empresa')}
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
          borderColor: typeFilter === 'empresa' ? '#8b5cf6' : 'var(--border-subtle)',
          background: typeFilter === 'empresa' ? 'rgba(139, 92, 246, 0.18)' : 'rgba(0,0,0,0.25)',
          color: typeFilter === 'empresa' ? '#c4b5fd' : 'var(--text-muted)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'all 0.15s ease'
        }}
      >
        <Building2 size={14} color={typeFilter === 'empresa' ? '#c4b5fd' : 'currentColor'} />
        <span>Empresas</span>
        <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>({counts.empresas})</span>
      </button>

      {/* Personas */}
      <button
        type="button"
        onClick={() => onTypeFilterChange('persona')}
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
          borderColor: typeFilter === 'persona' ? '#10b981' : 'var(--border-subtle)',
          background: typeFilter === 'persona' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(0,0,0,0.25)',
          color: typeFilter === 'persona' ? '#6ee7b7' : 'var(--text-muted)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'all 0.15s ease'
        }}
      >
        <User size={14} color={typeFilter === 'persona' ? '#6ee7b7' : 'currentColor'} />
        <span>Personas</span>
        <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>({counts.personas})</span>
      </button>
    </div>
  );
};
