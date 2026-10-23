import React from 'react';
import type { SupplierCategoryConfig } from '../../types/metodicah';
import { DEFAULT_SUPPLIER_CATEGORIES } from '../../utils/supplierUtils';
import { Layers } from 'lucide-react';

export interface SupplierCategoryFilterProps {
  categoryFilter: string;
  onCategoryFilterChange: (cat: string) => void;
  categoryCounts: Record<string, number>;
  totalCount: number;
  categories?: SupplierCategoryConfig[];
}

export const SupplierCategoryFilter: React.FC<SupplierCategoryFilterProps> = ({
  categoryFilter,
  onCategoryFilterChange,
  categoryCounts,
  totalCount,
  categories = DEFAULT_SUPPLIER_CATEGORIES
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
        onClick={() => onCategoryFilterChange('todos')}
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
          borderColor: categoryFilter === 'todos' ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-subtle)',
          background: categoryFilter === 'todos' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0,0,0,0.25)',
          color: categoryFilter === 'todos' ? '#fbbf24' : 'var(--text-muted)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'all 0.15s ease'
        }}
      >
        <Layers size={14} />
        <span>Todos los Rubros</span>
        <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>({totalCount})</span>
      </button>

      {categories.map(cat => {
        const count = categoryCounts[cat.id] || 0;
        const isSelected = categoryFilter === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryFilterChange(cat.id)}
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
              borderColor: isSelected ? cat.color : 'var(--border-subtle)',
              background: isSelected ? `${cat.color}22` : 'rgba(0,0,0,0.25)',
              color: isSelected ? cat.color : 'var(--text-muted)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.15s ease'
            }}
          >
            <span>{cat.label}</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>({count})</span>
          </button>
        );
      })}
    </div>
  );
};
