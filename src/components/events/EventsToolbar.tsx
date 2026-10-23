import React from 'react';
import { 
  ArrowUpDown, 
  RotateCcw, 
  CalendarRange, 
  Calendar,
  LayoutList, 
  Rows, 
  Search, 
  X 
} from 'lucide-react';

export type SortOption = 'date_asc' | 'date_desc' | 'updated_desc' | 'title_asc' | 'client_asc';
export type ViewMode = 'default' | 'compact';
export type EventGroupMode = 'month' | 'year' | 'none';

export interface EventsToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalCount?: number;
  filteredCount?: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  groupByMonth: boolean;
  onToggleGroupByMonth: () => void;
  groupByYear?: boolean;
  onToggleGroupByYear?: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const EventsToolbar: React.FC<EventsToolbarProps> = ({
  searchQuery,
  onSearchChange,
  hasActiveFilters,
  onResetFilters,
  sortBy,
  onSortChange,
  groupByMonth,
  onToggleGroupByMonth,
  groupByYear = false,
  onToggleGroupByYear = () => {},
  viewMode,
  onViewModeChange
}) => {
  return (
    <div 
      className="glass-panel"
      style={{
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box'
      }}
    >
      {/* Zona Izquierda: Reset, Ordenamiento y Agrupación */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="btn-ghost"
            style={{
              fontSize: '0.76rem',
              padding: '3px 8px',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              borderRadius: '4px'
            }}
            title="Restablecer filtros y búsqueda"
          >
            <RotateCcw size={12} />
            <span>Limpiar filtros</span>
          </button>
        )}

        {/* Sorting Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowUpDown size={14} color="var(--text-dim)" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            style={{
              background: 'rgba(12, 17, 28, 0.8)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              padding: '4px 8px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="date_asc">Fecha más próxima</option>
            <option value="date_desc">Fecha más lejana</option>
            <option value="updated_desc">Última actualización</option>
            <option value="title_asc">Título (A - Z)</option>
            <option value="client_asc">Cliente (A - Z)</option>
          </select>
        </div>

        {/* Group by Month Toggle (only available on date sorting) */}
        {(sortBy === 'date_asc' || sortBy === 'date_desc') && (
          <button
            type="button"
            onClick={onToggleGroupByMonth}
            title={groupByMonth ? 'Desactivar agrupación mensual' : 'Agrupar eventos por mes'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.76rem',
              background: groupByMonth ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
              border: groupByMonth ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-subtle)',
              color: groupByMonth ? '#f59e0b' : 'var(--text-dim)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <CalendarRange size={13} />
            <span>Por Mes</span>
          </button>
        )}

        {/* Group by Year Toggle (only available on date sorting) */}
        {(sortBy === 'date_asc' || sortBy === 'date_desc') && (
          <button
            type="button"
            onClick={onToggleGroupByYear}
            title={groupByYear ? 'Desactivar agrupación anual' : 'Agrupar eventos por año'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.76rem',
              background: groupByYear ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
              border: groupByYear ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-subtle)',
              color: groupByYear ? '#f59e0b' : 'var(--text-dim)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Calendar size={13} />
            <span>Por Año</span>
          </button>
        )}
      </div>

      {/* Zona Derecha: Buscador predictivo, Divider y Selector de Vista */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 340px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        
        {/* Buscador predictivo en tiempo real */}
        <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 200px', maxWidth: '320px' }}>
          <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Buscar por título, código, cliente, venue..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '34px', paddingRight: searchQuery ? '30px' : '10px', height: '36px', fontSize: '0.82rem' }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              title="Limpiar búsqueda"
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)' }} />

        {/* Switch de Modo de Vista (Tarjetas / Compacto) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.35)',
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            type="button"
            onClick={() => onViewModeChange('default')}
            title="Vista Detallada (Tarjetas)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              background: viewMode === 'default' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: viewMode === 'default' ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.15s ease'
            }}
          >
            <LayoutList size={15} />
            <span style={{ fontSize: '0.74rem', fontWeight: 500 }}>Tarjetas</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('compact')}
            title="Vista Compacta (Filas)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
              background: viewMode === 'compact' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: viewMode === 'compact' ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.15s ease'
            }}
          >
            <Rows size={15} />
            <span style={{ fontSize: '0.74rem', fontWeight: 500 }}>Compacto</span>
          </button>
        </div>

      </div>
    </div>
  );
};
