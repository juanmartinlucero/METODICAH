import { useState, useMemo, useCallback } from 'react';
import { usePagination } from './usePagination';

export interface UseEntityListOptions<T, S extends string = string, F extends string = string> {
  items: T[];
  storagePrefix: string;
  defaultSort: S;
  defaultFilter?: F;
  defaultViewMode?: 'default' | 'compact';
  defaultGrouped?: boolean;
  pageSize?: number;
  filterPredicate?: (item: T, filterValue: F) => boolean;
  searchPredicate: (item: T, searchQuery: string) => boolean;
  sortComparator: (a: T, b: T, sortBy: S) => number;
}

export interface UseEntityListReturn<T, S extends string = string, F extends string = string> {
  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterValue: F;
  setFilterValue: (filter: F) => void;
  hasActiveFilters: boolean;
  resetFilters: () => void;

  // Sorting
  sortBy: S;
  handleSortChange: (newSort: S) => void;

  // Grouping
  isGrouped: boolean;
  toggleGrouping: () => void;
  setIsGrouped: (grouped: boolean) => void;

  // View Mode
  viewMode: 'default' | 'compact';
  handleViewModeChange: (mode: 'default' | 'compact') => void;

  // Pagination & Collections
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  filteredItems: T[];
  sortedItems: T[];
  paginatedItems: T[];
  startIndex: number;
  endIndex: number;

  // Modal States
  showFormModal: boolean;
  setShowFormModal: (show: boolean) => void;
  editingItem: T | null;
  setEditingItem: (item: T | null) => void;
  viewingItem: T | null;
  setViewingItem: (item: T | null) => void;
  itemToDelete: T | null;
  setItemToDelete: (item: T | null) => void;

  // Modal Action Handlers
  handleOpenCreateModal: () => void;
  handleOpenEditModal: (item: T) => void;
  handleCloseFormModal: () => void;
  handleOpenViewModal: (item: T) => void;
  handleCloseViewModal: () => void;
  handleOpenDeleteModal: (item: T) => void;
  handleCloseDeleteModal: () => void;
}

/**
 * Hook genérico reusable para listados de entidades (Clientes, Proveedores, Crew, etc.)
 * Gestiona estados de modales (alta, edición, detalle, eliminación),
 * búsqueda, filtros por categoría/tipo, ordenamiento con persistencia en localStorage,
 * modo de vista (default/compact), agrupación y paginación sincronizada.
 */
export function useEntityList<T, S extends string = string, F extends string = string>({
  items,
  storagePrefix,
  defaultSort,
  defaultFilter = ('all' as F),
  defaultViewMode = 'default',
  defaultGrouped = false,
  pageSize = 10,
  filterPredicate,
  searchPredicate,
  sortComparator
}: UseEntityListOptions<T, S, F>): UseEntityListReturn<T, S, F> {
  // Modal States
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [viewingItem, setViewingItem] = useState<T | null>(null);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState<F>(defaultFilter);

  // Sort State with LocalStorage Persistence
  const [sortBy, setSortBy] = useState<S>(() => {
    return (localStorage.getItem(`${storagePrefix}_sort_by`) as S) || defaultSort;
  });

  // Grouping State with LocalStorage Persistence
  const [isGrouped, setIsGrouped] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${storagePrefix}_group_by`);
    return saved !== null ? saved === 'true' : defaultGrouped;
  });

  // View Mode State with LocalStorage Persistence
  const [viewMode, setViewMode] = useState<'default' | 'compact'>(() => {
    return (localStorage.getItem(`${storagePrefix}_view_mode`) as 'default' | 'compact') || defaultViewMode;
  });

  // Action Handlers for Preferences
  const handleSortChange = useCallback((newSort: S) => {
    setSortBy(newSort);
    localStorage.setItem(`${storagePrefix}_sort_by`, newSort);
  }, [storagePrefix]);

  const toggleGrouping = useCallback(() => {
    setIsGrouped(prev => {
      const next = !prev;
      localStorage.setItem(`${storagePrefix}_group_by`, String(next));
      return next;
    });
  }, [storagePrefix]);

  const handleViewModeChange = useCallback((mode: 'default' | 'compact') => {
    setViewMode(mode);
    localStorage.setItem(`${storagePrefix}_view_mode`, mode);
  }, [storagePrefix]);

  // Modal Handlers
  const handleOpenCreateModal = useCallback(() => {
    setEditingItem(null);
    setShowFormModal(true);
  }, []);

  const handleOpenEditModal = useCallback((item: T) => {
    setEditingItem(item);
    setShowFormModal(true);
  }, []);

  const handleCloseFormModal = useCallback(() => {
    setShowFormModal(false);
    setEditingItem(null);
  }, []);

  const handleOpenViewModal = useCallback((item: T) => {
    setViewingItem(item);
  }, []);

  const handleCloseViewModal = useCallback(() => {
    setViewingItem(null);
  }, []);

  const handleOpenDeleteModal = useCallback((item: T) => {
    setItemToDelete(item);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setItemToDelete(null);
  }, []);

  // Filter & Search Logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (filterPredicate && !filterPredicate(item, filterValue)) {
        return false;
      }
      if (searchQuery.trim() && !searchPredicate(item, searchQuery.trim())) {
        return false;
      }
      return true;
    });
  }, [items, filterValue, searchQuery, filterPredicate, searchPredicate]);

  // Sort Logic
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => sortComparator(a, b, sortBy));
  }, [filteredItems, sortBy, sortComparator]);

  // Pagination Logic
  const pagination = usePagination<T>({
    items: sortedItems,
    pageSize,
    resetTriggers: [searchQuery, filterValue, sortBy, isGrouped]
  });

  const hasActiveFilters = useMemo(() => {
    return searchQuery.trim() !== '' || filterValue !== defaultFilter;
  }, [searchQuery, filterValue, defaultFilter]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilterValue(defaultFilter);
  }, [defaultFilter]);

  return {
    searchQuery,
    setSearchQuery,
    filterValue,
    setFilterValue,
    hasActiveFilters,
    resetFilters,
    sortBy,
    handleSortChange,
    isGrouped,
    toggleGrouping,
    setIsGrouped,
    viewMode,
    handleViewModeChange,
    currentPage: pagination.currentPage,
    setCurrentPage: pagination.setCurrentPage,
    pageSize: pagination.pageSize,
    totalPages: pagination.totalPages,
    totalItems: pagination.totalItems,
    filteredItems,
    sortedItems,
    paginatedItems: pagination.paginatedItems,
    startIndex: pagination.startIndex,
    endIndex: pagination.endIndex,
    showFormModal,
    setShowFormModal,
    editingItem,
    setEditingItem,
    viewingItem,
    setViewingItem,
    itemToDelete,
    setItemToDelete,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseFormModal,
    handleOpenViewModal,
    handleCloseViewModal,
    handleOpenDeleteModal,
    handleCloseDeleteModal
  };
}
