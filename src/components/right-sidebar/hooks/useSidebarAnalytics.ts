import { useMemo } from 'react';
import type { 
  EventItem, 
  Client, 
  Supplier, 
  EventCrewMember, 
  EventStageConfig 
} from '../../../types/metodicah';
import { parseDateSafe } from '../../../utils/dateUtils';

export interface UseSidebarAnalyticsParams {
  activeTab: string;
  selectedEvent: EventItem | null;
  events: EventItem[];
  clients: Client[];
  suppliers: Supplier[];
  crewMembers: EventCrewMember[];
  stages?: EventStageConfig[];
}

export function useSidebarAnalytics({
  activeTab,
  selectedEvent,
  events,
  clients,
  suppliers: _suppliers,
  crewMembers,
  stages = []
}: UseSidebarAnalyticsParams) {
  // Tab Title helper
  const tabTitles: Record<string, string> = {
    dashboard: 'Dashboard General',
    events: 'Eventos & Producción',
    clients: 'Directorio de Clientes',
    suppliers: 'Red de Proveedores',
    crew: 'Equipo & Crew',
    workflow: 'Workflows & Procesos',
    settings: 'Configuración',
    profile: 'Perfil de Usuario'
  };

  const activeTabLabel = tabTitles[activeTab] || 'Sección Activa';

  const totalAttendees = useMemo(() => {
    return events.reduce((sum, e) => sum + (e.attendeesCount || 0), 0);
  }, [events]);

  const activeEventsCount = useMemo(() => {
    return events.filter(e => e.stageId !== 'post_production').length;
  }, [events]);

  const corporateClientsCount = useMemo(() => {
    return clients.filter(c => c.clientType !== 'persona').length;
  }, [clients]);

  const individualClientsCount = useMemo(() => {
    return clients.filter(c => c.clientType === 'persona').length;
  }, [clients]);

  const currentYear = new Date().getFullYear();
  const eventsThisYear = useMemo(() => {
    return events.filter(e => {
      const parsed = parseDateSafe(e.date);
      if (!parsed) return false;
      return parsed.getFullYear() === currentYear;
    }).length;
  }, [events, currentYear]);

  const staffCrewCount = useMemo(() => {
    return crewMembers.filter(m => m.type === 'staff_interno').length;
  }, [crewMembers]);

  const freelanceCrewCount = useMemo(() => {
    return crewMembers.filter(m => m.type === 'freelancer').length;
  }, [crewMembers]);

  const activeStagesList = useMemo(() => {
    const countsMap = new Map<string, number>();
    events.forEach(e => {
      countsMap.set(e.stageId, (countsMap.get(e.stageId) || 0) + 1);
    });
    return stages.map(s => ({
      ...s,
      count: countsMap.get(s.id) || 0
    }));
  }, [events, stages]);

  const upcomingEvent = useMemo(() => {
    const now = new Date().getTime();
    const sortedFuture = [...events]
      .filter(e => {
        const parsed = parseDateSafe(e.date);
        return parsed !== null && parsed.getTime() >= now - 86400000;
      })
      .sort((a, b) => (parseDateSafe(a.date)?.getTime() ?? 0) - (parseDateSafe(b.date)?.getTime() ?? 0));
    return sortedFuture[0] || events[0] || null;
  }, [events]);

  const selectedEventStage = useMemo(() => {
    if (!selectedEvent) return null;
    return stages.find(s => s.id === selectedEvent.stageId) || {
      label: selectedEvent.stageId,
      color: '#f59e0b'
    };
  }, [selectedEvent, stages]);

  return {
    activeTabLabel,
    totalAttendees,
    activeEventsCount,
    corporateClientsCount,
    individualClientsCount,
    currentYear,
    eventsThisYear,
    staffCrewCount,
    freelanceCrewCount,
    activeStagesList,
    upcomingEvent,
    selectedEventStage
  };
}
