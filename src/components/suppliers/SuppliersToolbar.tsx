import React from 'react';
import { SupplierCategoryFilter } from './SupplierCategoryFilter';
import { SupplierActionBar, type SupplierSortOption } from './SupplierActionBar';

export { SupplierCategoryFilter } from './SupplierCategoryFilter';
export { SupplierActionBar, type SupplierSortOption } from './SupplierActionBar';

export interface SuppliersToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (cat: string) => void;
  categoryCounts: Record<string, number>;
  totalCount: number;
  filteredCount?: number;
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
  sortBy?: SupplierSortOption;
  onSortChange?: (sort: SupplierSortOption) => void;
  groupByCategory?: boolean;
  onToggleGroupByCategory?: () => void;
  viewMode: 'default' | 'compact';
  onViewModeChange: (mode: 'default' | 'compact') => void;
  onExportCSV: () => void;
  onImportCSV: (file: File) => void;
}

export const SuppliersToolbar: React.FC<SuppliersToolbarProps> = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  categoryCounts,
  totalCount,
  filteredCount,
  hasActiveFilters = false,
  onResetFilters = () => {},
  sortBy = 'name_asc',
  onSortChange = () => {},
  groupByCategory = false,
  onToggleGroupByCategory = () => {},
  viewMode,
  onViewModeChange,
  onExportCSV,
  onImportCSV
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 1. Category / Rubros Filter Pills */}
      <SupplierCategoryFilter
        categoryFilter={categoryFilter}
        onCategoryFilterChange={onCategoryFilterChange}
        categoryCounts={categoryCounts}
        totalCount={totalCount}
      />

      {/* 2. Buscador predictivo, CSV & Selector de Vista */}
      <SupplierActionBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        totalCount={totalCount}
        filteredCount={filteredCount ?? totalCount}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
        sortBy={sortBy}
        onSortChange={onSortChange}
        groupByCategory={groupByCategory}
        onToggleGroupByCategory={onToggleGroupByCategory}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onExportCSV={onExportCSV}
        onImportCSV={onImportCSV}
      />
    </div>
  );
};
