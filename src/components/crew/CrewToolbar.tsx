import React from 'react';
import { CrewDepartmentFilter } from './CrewDepartmentFilter';
import { CrewActionBar } from './CrewActionBar';
import type { CrewSortOption } from './CrewActionBar';

export { CrewDepartmentFilter } from './CrewDepartmentFilter';
export { CrewActionBar } from './CrewActionBar';
export type { CrewSortOption } from './CrewActionBar';

export interface CrewToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalCount: number;
  filteredCount: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  sortBy: CrewSortOption;
  onSortChange: (sort: CrewSortOption) => void;
  groupByContract: boolean;
  onToggleGroupByContract: () => void;
  sectorFilter: string;
  onSectorFilterChange: (sec: string) => void;
  sectorCounts: Record<string, number>;
  viewMode: 'default' | 'compact';
  onViewModeChange: (mode: 'default' | 'compact') => void;
  onExportCSV: () => void;
  onImportCSV: (file: File) => void;
}

export const CrewToolbar: React.FC<CrewToolbarProps> = ({
  searchQuery,
  onSearchChange,
  totalCount,
  filteredCount,
  hasActiveFilters,
  onResetFilters,
  sortBy,
  onSortChange,
  groupByContract,
  onToggleGroupByContract,
  sectorFilter,
  onSectorFilterChange,
  sectorCounts,
  viewMode,
  onViewModeChange,
  onExportCSV,
  onImportCSV
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 1. Sector/Department Filter Pills */}
      <CrewDepartmentFilter
        sectorFilter={sectorFilter}
        onSectorFilterChange={onSectorFilterChange}
        sectorCounts={sectorCounts}
        totalCount={totalCount}
      />

      {/* 2. Actions Toolbar */}
      <CrewActionBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        totalCount={totalCount}
        filteredCount={filteredCount}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
        sortBy={sortBy}
        onSortChange={onSortChange}
        groupByContract={groupByContract}
        onToggleGroupByContract={onToggleGroupByContract}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onExportCSV={onExportCSV}
        onImportCSV={onImportCSV}
      />
    </div>
  );
};
