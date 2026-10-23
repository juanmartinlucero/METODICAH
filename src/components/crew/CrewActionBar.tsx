import React, { useRef } from 'react';
import { 
  Search, 
  X, 
  Briefcase, 
  LayoutList, 
  Rows, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import { Button } from '../ui';

export type CrewSortOption = 'name_asc' | 'name_desc' | 'seniority_desc' | 'created_desc' | 'created_asc';

export interface CrewActionBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalCount?: number;
  filteredCount?: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  sortBy: CrewSortOption;
  onSortChange: (sort: CrewSortOption) => void;
  groupByContract: boolean;
  onToggleGroupByContract: () => void;
  viewMode: 'default' | 'compact';
  onViewModeChange: (mode: 'default' | 'compact') => void;
  onExportCSV: () => void;
  onImportCSV: (file: File) => void;
}

export const CrewActionBar: React.FC<CrewActionBarProps> = ({
  searchQuery,
  onSearchChange,
  hasActiveFilters,
  onResetFilters,
  sortBy,
  onSortChange,
  groupByContract,
  onToggleGroupByContract,
  viewMode,
  onViewModeChange,
  onExportCSV,
  onImportCSV
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportCSV(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            leftIcon={<RotateCcw size={12} />}
            title="Restablecer filtros y búsqueda"
            style={{ color: '#f59e0b', fontSize: '0.76rem', padding: '3px 8px' }}
          >
            Limpiar filtros
          </Button>
        )}

        {/* Selector de Ordenamiento */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowUpDown size={14} color="var(--text-dim)" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as CrewSortOption)}
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
            <option value="name_asc">Nombre (A - Z)</option>
            <option value="name_desc">Nombre (Z - A)</option>
            <option value="seniority_desc">Jerarquía (Lead → Jr)</option>
            <option value="created_desc">Más recientes</option>
            <option value="created_asc">Más antiguos</option>
          </select>
        </div>

        {/* Botón de Agrupación por Tipo de Contrato */}
        <button
          type="button"
          onClick={onToggleGroupByContract}
          title={groupByContract ? 'Desactivar agrupación por contrato' : 'Agrupar equipo por tipo de contrato'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '0.76rem',
            background: groupByContract ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
            border: groupByContract ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid var(--border-subtle)',
            color: groupByContract ? '#38bdf8' : 'var(--text-dim)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Briefcase size={13} />
          <span>Por Contrato</span>
        </button>
      </div>

      {/* 2. Right Actions: Buscador predictivo, CSV & Selector de Vista */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 340px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        
        {/* Buscador predictivo en tiempo real */}
        <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 200px', maxWidth: '320px' }}>
          <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Buscar por nombre, rol, DNI, sector..."
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

        {/* Botones de Importación y Exportación CSV */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".csv" 
            style={{ display: 'none' }} 
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            title="Importar Equipo desde CSV (Entrada al sistema)"
            leftIcon={<ArrowDownToLine size={15} />}
            style={{ padding: '6px 9px' }}
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={onExportCSV}
            title="Exportar Equipo a CSV (Salida del sistema)"
            leftIcon={<ArrowUpFromLine size={15} />}
            style={{ padding: '6px 9px' }}
          />
        </div>

        <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)' }} />

        {/* Switch de Modo de Vista (Tarjetas / Compacto) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.35)',
          padding: '3px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          gap: '2px'
        }}>
          <Button
            variant={viewMode === 'default' ? 'glass' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('default')}
            title="Vista Detallada (Tarjetas)"
            leftIcon={<LayoutList size={14} />}
            style={{
              padding: '4px 8px',
              fontSize: '0.74rem',
              background: viewMode === 'default' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: viewMode === 'default' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Tarjetas
          </Button>

          <Button
            variant={viewMode === 'compact' ? 'glass' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('compact')}
            title="Vista Compacta (Filas)"
            leftIcon={<Rows size={14} />}
            style={{
              padding: '4px 8px',
              fontSize: '0.74rem',
              background: viewMode === 'compact' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: viewMode === 'compact' ? '#fff' : 'var(--text-muted)'
            }}
          >
            Compacto
          </Button>
        </div>

      </div>

    </div>
  );
};
