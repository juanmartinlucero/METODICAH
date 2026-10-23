import { useState, useMemo, useEffect, useRef } from 'react';

export interface UsePaginationOptions<T> {
  items: T[];
  pageSize?: number;
  initialPage?: number;
  resetTriggers?: unknown[];
}

export interface UsePaginationReturn<T> {
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  paginatedItems: T[];
  startIndex: number;
  endIndex: number;
}

/**
 * Hook reutilizable para paginación de listas en METODICAH.
 * Por defecto pagina hasta 10 elementos por página y resetea a la página 1
 * cuando cambian los disparadores (búsqueda, filtros, ordenamiento).
 */
export function usePagination<T>({
  items,
  pageSize = 10,
  initialPage = 1,
  resetTriggers = []
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const isFirstRender = useRef(true);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Resetea a la página 1 cuando cambian los filtros / búsqueda / orden
  const serializedTriggers = JSON.stringify(resetTriggers);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setCurrentPage(1);
  }, [serializedTriggers]);

  // Ajusta la página si la cantidad de páginas disminuye por debajo de la actual
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const paginatedItems = useMemo(() => {
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, startIndex, pageSize]);

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    totalItems,
    paginatedItems,
    startIndex,
    endIndex
  };
}
