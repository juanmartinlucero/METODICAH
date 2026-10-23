import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import type { EventItem } from '@/types/metodicah';
import { EventsStageFilter } from '@/components/events/EventsStageFilter';
import { EventCard } from '@/components/EventCard';
import { EmptyState } from '@/components/EmptyState';
import { EventsToolbar, type SortOption, type ViewMode, type EventGroupMode } from '@/components/events/EventsToolbar';
import { EventsMonthHeader } from '@/components/events/EventsMonthHeader';
import { EventsYearHeader } from '@/components/events/EventsYearHeader';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/ui';
import { usePagination } from '@/hooks/usePagination';
import { Calendar, Plus, RotateCcw } from 'lucide-react';
import { formatMonthYear, formatYear, parseDateSafe } from '@/utils/dateUtils';
import { matchesSearch } from '@/utils/searchUtils';
import { useEventsStore, useSettingsStore } from '@/stores';
import { STORAGE_KEYS } from '@/constants/storageKeys';

export interface EventsViewProps {
  // Vista principal de Eventos: Smart Container conectado a Zustand y React Router
}

export const EventsView: React.FC<EventsViewProps> = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const events = useEventsStore(s => s.events);
  const onSelectEvent = useEventsStore(s => s.selectEvent);
  const onOpenNewEvent = useEventsStore(s => s.openNewEventModal);
  const stages = useSettingsStore(s => s.stages);

  const initialSearch = searchParams.get('q') || '';
  const initialStage = searchParams.get('stage') || 'all';

  const [search, setSearchState] = useState(initialSearch);
  const [selectedStage, setSelectedStageState] = useState<string>(initialStage);
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    return (localStorage.getItem(STORAGE_KEYS.VIEW_PREFERENCES.EVENTS_SORT_BY) as SortOption) || 'date_asc';
  });
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem(STORAGE_KEYS.VIEW_PREFERENCES.EVENTS_VIEW_MODE) as ViewMode) || 'default';
  });
  const [groupMode, setGroupMode] = useState<EventGroupMode>(() => {
    const savedMode = localStorage.getItem(STORAGE_KEYS.VIEW_PREFERENCES.EVENTS_GROUP_MODE) as EventGroupMode | null;
    if (savedMode === 'month' || savedMode === 'year' || savedMode === 'none') {
      return savedMode;
    }
    const savedMonth = localStorage.getItem(STORAGE_KEYS.VIEW_PREFERENCES.EVENTS_GROUP_BY_MONTH);
    if (savedMonth !== null) {
      return savedMonth === 'true' ? 'month' : 'none';
    }
    return 'month';
  });

  const groupByMonth = groupMode === 'month';
  const groupByYear = groupMode === 'year';

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    localStorage.setItem(STORAGE_KEYS.VIEW_PREFERENCES.EVENTS_SORT_BY, newSort);
  };

  const handleToggleGroupByMonth = () => {
    setGroupMode(prev => {
      const next: EventGroupMode = prev === 'month' ? 'none' : 'month';
      localStorage.setItem(STORAGE_KEYS.VIEW_PREFERENCES.EVENTS_GROUP_MODE, next);
      localStorage.setItem(STORAGE_KEYS.VIEW_PREFERENCES.EVENTS_GROUP_BY_MONTH, String(next === 'month'));
      return next;
    });
  };

  const handleToggleGroupByYear = () => {
    setGroupMode(prev => {
      const next: EventGroupMode = prev === 'year' ? 'none' : 'year';
      localStorage.setItem(STORAGE_KEYS.VIEW_PREFERENCES.EVENTS_GROUP_MODE, next);
      localStorage.setItem(STORAGE_KEYS.VIEW_PREFERENCES.EVENTS_GROUP_BY_MONTH, 'false');
      return next;
    });
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(STORAGE_KEYS.VIEW_PREFERENCES.EVENTS_VIEW_MODE, mode);
  };

  // Filter events
  const filtered = useMemo(() => {
    return events.filter((evt) => {
      const isMatch = matchesSearch(
        [evt.title, evt.code, evt.clientName, evt.location, evt.venue],
        search
      );
      const matchesStage = selectedStage === 'all' || evt.stageId === selectedStage;
      return isMatch && matchesStage;
    });
  }, [events, search, selectedStage]);

  // Sort events
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === 'date_asc') {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return (parseDateSafe(a.date)?.getTime() ?? 0) - (parseDateSafe(b.date)?.getTime() ?? 0);
      }
      if (sortBy === 'date_desc') {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return (parseDateSafe(b.date)?.getTime() ?? 0) - (parseDateSafe(a.date)?.getTime() ?? 0);
      }
      if (sortBy === 'updated_desc') {
        const aUp = a.updatedAt || a.createdAt || '';
        const bUp = b.updatedAt || b.createdAt || '';
        return bUp.localeCompare(aUp);
      }
      if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'client_asc') {
        return a.clientName.localeCompare(b.clientName);
      }
      return 0;
    });
  }, [filtered, sortBy]);

  // Grouping helpers
  const getMonthYearKey = (dateStr?: string) => formatMonthYear(dateStr, 'Sin fecha programada');
  const getYearKey = (dateStr?: string) => formatYear(dateStr, 'Sin fecha programada');

  // Pagination: hasta 10 producciones por página
  const {
    currentPage,
    setCurrentPage,
    paginatedItems: paginatedEvents
  } = usePagination({
    items: sorted,
    pageSize: 10,
    resetTriggers: [search, selectedStage, sortBy, groupMode]
  });

  const isDateSorted = sortBy === 'date_asc' || sortBy === 'date_desc';

  // Grouped structure
  const groupedEvents = useMemo(() => {
    if (!isDateSorted || groupMode === 'none') {
      return null;
    }

    const groups: { key: string; items: EventItem[] }[] = [];
    const groupMap = new Map<string, EventItem[]>();

    paginatedEvents.forEach((evt) => {
      const key = groupMode === 'year' ? getYearKey(evt.date) : getMonthYearKey(evt.date);
      if (!groupMap.has(key)) {
        groupMap.set(key, []);
      }
      groupMap.get(key)?.push(evt);
    });

    groupMap.forEach((items, key) => {
      groups.push({ key, items });
    });

    return groups;
  }, [paginatedEvents, groupMode, isDateSorted]);

  const hasActiveFilters = search.trim() !== '' || selectedStage !== 'all';

  const setSearch = (newSearch: string) => {
    setSearchState(newSearch);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (newSearch.trim()) {
        next.set('q', newSearch.trim());
      } else {
        next.delete('q');
      }
      return next;
    }, { replace: true });
  };

  const setSelectedStage = (stage: string) => {
    setSelectedStageState(stage);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (stage && stage !== 'all') {
        next.set('stage', stage);
      } else {
        next.delete('stage');
      }
      return next;
    }, { replace: true });
  };

  const handleResetFilters = () => {
    setSearchState('');
    setSelectedStageState('all');
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('q');
      next.delete('stage');
      return next;
    }, { replace: true });
  };

  const handleSelectEvent = (evt: EventItem) => {
    onSelectEvent(evt);
    navigate(`/events/${evt.id}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      
      {/* 1. Header & Primary Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', width: '100%' }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
            Eventos & Producción
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px', marginBottom: 0, lineHeight: 1.4 }}>
            Directorio maestro de producciones, cronogramas y fichas técnicas.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus size={18} />}
          onClick={() => onOpenNewEvent()}
        >
          Nuevo Evento
        </Button>
      </div>

      {/* 2. Stage Filter Pills */}
      <EventsStageFilter
        stages={stages}
        selectedStage={selectedStage}
        onSelectStage={setSelectedStage}
        totalCount={events.length}
        getStageCount={(stageId) => events.filter(e => e.stageId === stageId).length}
      />

      {/* 3. Controls Toolbar: Contador, Orden, Agrupación, Buscador predictivo & Switch de Vista */}
      <EventsToolbar
        searchQuery={search}
        onSearchChange={setSearch}
        totalCount={events.length}
        filteredCount={sorted.length}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        groupByMonth={groupByMonth}
        onToggleGroupByMonth={handleToggleGroupByMonth}
        groupByYear={groupByYear}
        onToggleGroupByYear={handleToggleGroupByYear}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      {/* 4. Events Catalog List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sorted.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No se encontraron producciones"
            description="No hay eventos que coincidan con la búsqueda o etapa seleccionada."
            actionLabel={hasActiveFilters ? 'Restablecer Filtros' : undefined}
            onAction={hasActiveFilters ? handleResetFilters : undefined}
            actionIcon={RotateCcw}
          />
        ) : groupedEvents ? (
          /* Render grouped by month or year */
          groupedEvents.map((group) => (
            <div key={group.key} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              {groupMode === 'year' ? (
                <EventsYearHeader
                  yearKey={group.key}
                  count={group.items.length}
                />
              ) : (
                <EventsMonthHeader
                  monthKey={group.key}
                  count={group.items.length}
                />
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: viewMode === 'compact' ? '6px' : '10px' }}>
                {group.items.map((evt) => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    stages={stages}
                    variant={viewMode}
                    onClick={handleSelectEvent}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          /* Render flat sorted list */
          <div style={{ display: 'flex', flexDirection: 'column', gap: viewMode === 'compact' ? '6px' : '10px' }}>
            {paginatedEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                stages={stages}
                variant={viewMode}
                onClick={handleSelectEvent}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. Pagination */}
      {sorted.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={sorted.length}
          pageSize={10}
          onPageChange={setCurrentPage}
          itemLabel={{ singular: 'producción', plural: 'producciones' }}
        />
      )}

    </div>
  );
};
