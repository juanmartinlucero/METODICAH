import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  itemLabel?: string | { singular: string; plural: string };
  hideOnSinglePage?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize = 10,
  onPageChange,
  itemLabel = { singular: 'elemento', plural: 'elementos' },
  hideOnSinglePage = false,
  className = '',
  style = {}
}) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // If no items, or single page and hideOnSinglePage is true, don't render pagination
  if (totalItems === 0 || (hideOnSinglePage && totalPages <= 1)) {
    return null;
  }

  const currentCount = totalItems === 0 
    ? 0 
    : Math.min(currentPage * pageSize, totalItems) - (currentPage - 1) * pageSize;

  const labelText = typeof itemLabel === 'string'
    ? itemLabel
    : (totalItems === 1 ? itemLabel.singular : itemLabel.plural);

  // Generate page numbers with ellipsis
  const getPageItems = (): (number | 'ellipsis-left' | 'ellipsis-right')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, 'ellipsis-right', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, 'ellipsis-left', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, 'ellipsis-left', currentPage - 1, currentPage, currentPage + 1, 'ellipsis-right', totalPages];
  };

  const pageItems = getPageItems();

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div
      className={`glass-panel ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '12px 18px',
        marginTop: '8px',
        borderRadius: '10px',
        boxSizing: 'border-box',
        width: '100%',
        ...style
      }}
      aria-label="Navegación de paginación"
    >
      {/* Información de elementos y página */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
        <span>
          Mostrando <strong style={{ color: '#fff', fontWeight: 600 }}>{currentCount}</strong> de{' '}
          <strong style={{ color: '#fff', fontWeight: 600 }}>{totalItems}</strong> {labelText}
        </span>
        <span style={{ color: 'var(--border-subtle)', margin: '0 2px' }}>•</span>
        <span style={{ color: 'var(--text-muted)' }}>
          Página <strong style={{ color: '#fff', fontWeight: 600 }}>{currentPage}</strong> de{' '}
          <strong style={{ color: '#fff', fontWeight: 600 }}>{totalPages}</strong>
        </span>
      </div>

      {/* Controles de navegación */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        {/* Ir a la primera página */}
        {totalPages > 4 && (
          <button
            type="button"
            onClick={() => handlePageClick(1)}
            disabled={currentPage === 1}
            title="Primera página"
            aria-label="Primera página"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              color: currentPage === 1 ? 'var(--text-dim)' : 'var(--text-muted)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.4 : 1,
              transition: 'all 0.15s ease'
            }}
          >
            <ChevronsLeft size={15} />
          </button>
        )}

        {/* Página anterior */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          title="Página anterior"
          aria-label="Página anterior"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '0 10px',
            height: '32px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            color: currentPage === 1 ? 'var(--text-dim)' : 'var(--text-main)',
            fontSize: '0.8rem',
            fontWeight: 500,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage === 1 ? 0.4 : 1,
            transition: 'all 0.15s ease'
          }}
        >
          <ChevronLeft size={15} />
          <span style={{ display: 'inline' }}>Ant</span>
        </button>

        {/* Botones numéricos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {pageItems.map((item, idx) => {
            if (typeof item !== 'number') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '32px',
                    color: 'var(--text-dim)',
                    fontSize: '0.8rem',
                    userSelect: 'none'
                  }}
                >
                  …
                </span>
              );
            }

            const isActive = item === currentPage;
            return (
              <button
                key={item}
                type="button"
                onClick={() => handlePageClick(item)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Página ${item}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '32px',
                  height: '32px',
                  padding: '0 6px',
                  borderRadius: '6px',
                  background: isActive ? '#f59e0b' : 'rgba(255, 255, 255, 0.03)',
                  border: isActive ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                  color: isActive ? '#000' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 600 : 450,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 0 10px rgba(245, 158, 11, 0.35)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Página siguiente */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Página siguiente"
          aria-label="Página siguiente"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            padding: '0 10px',
            height: '32px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            color: currentPage === totalPages ? 'var(--text-dim)' : 'var(--text-main)',
            fontSize: '0.8rem',
            fontWeight: 500,
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage === totalPages ? 0.4 : 1,
            transition: 'all 0.15s ease'
          }}
        >
          <span style={{ display: 'inline' }}>Sig</span>
          <ChevronRight size={15} />
        </button>

        {/* Ir a la última página */}
        {totalPages > 4 && (
          <button
            type="button"
            onClick={() => handlePageClick(totalPages)}
            disabled={currentPage === totalPages}
            title="Última página"
            aria-label="Última página"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              color: currentPage === totalPages ? 'var(--text-dim)' : 'var(--text-muted)',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.4 : 1,
              transition: 'all 0.15s ease'
            }}
          >
            <ChevronsRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
};
