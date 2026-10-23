import React from 'react';
import type { ClientType } from '../../types/metodicah';
import { ClientTypeFilter } from './ClientTypeFilter';
import { ClientActionBar, type ClientSortOption } from './ClientActionBar';

export { ClientTypeFilter } from './ClientTypeFilter';
export { ClientActionBar, type ClientSortOption } from './ClientActionBar';

export interface ClientsToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  typeFilter: 'all' | ClientType;
  onTypeFilterChange: (type: 'all' | ClientType) => void;
  counts: { total: number; empresas: number; personas: number };
  filteredCount?: number;
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
  sortBy?: ClientSortOption;
  onSortChange?: (sort: ClientSortOption) => void;
  groupByType?: boolean;
  onToggleGroupByType?: () => void;
  viewMode: 'default' | 'compact';
  onViewModeChange: (mode: 'default' | 'compact') => void;
  onExportCSV: () => void;
  onImportCSV: (file: File) => void;
}

export const ClientsToolbar: React.FC<ClientsToolbarProps> = ({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  counts,
  filteredCount,
  hasActiveFilters = false,
  onResetFilters = () => {},
  sortBy = 'name_asc',
  onSortChange = () => {},
  groupByType = false,
  onToggleGroupByType = () => {},
  viewMode,
  onViewModeChange,
  onExportCSV,
  onImportCSV
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 1. Type Filter Pills */}
      <ClientTypeFilter
        typeFilter={typeFilter}
        onTypeFilterChange={onTypeFilterChange}
        counts={counts}
      />

      {/* 2. Buscador predictivo, CSV & Selector de Vista */}
      <ClientActionBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        totalCount={counts.total}
        filteredCount={filteredCount ?? counts.total}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
        sortBy={sortBy}
        onSortChange={onSortChange}
        groupByType={groupByType}
        onToggleGroupByType={onToggleGroupByType}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onExportCSV={onExportCSV}
        onImportCSV={onImportCSV}
      />
    </div>
  );
};
