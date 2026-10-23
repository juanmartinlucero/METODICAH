import React from 'react';
import { useNavigate } from 'react-router';
import type { EventItem, Client, Supplier, GlobalRole, EventStageConfig } from '@/types/metodicah';
import { DashboardWelcome } from '@/components/dashboard/DashboardWelcome';
import { DashboardSearchBar } from '@/components/dashboard/DashboardSearchBar';
import { DashboardKPIs } from '@/components/dashboard/DashboardKPIs';
import { DashboardNextEvent } from '@/components/dashboard/DashboardNextEvent';
import { useEventsStore, useSettingsStore } from '@/stores';

export interface DashboardViewProps {
  events?: EventItem[];
  stages?: EventStageConfig[];
  clients?: Client[];
  suppliers?: Supplier[];
  userRole?: GlobalRole;
  userName?: string;
  companyLogo?: string | null;
  onSelectEvent?: (event: EventItem) => void;
  onOpenNewEvent?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  events: propEvents,
  stages: propStages,
  userRole: propUserRole,
  userName: propUserName,
  companyLogo: propCompanyLogo,
  onSelectEvent: propOnSelectEvent,
  onOpenNewEvent: propOnOpenNewEvent
}) => {
  const navigate = useNavigate();

  const storeEvents = useEventsStore(s => s.events);
  const storeSelectEvent = useEventsStore(s => s.selectEvent);
  const storeOpenNewEvent = useEventsStore(s => s.openNewEventModal);
  const storeStages = useSettingsStore(s => s.stages);
  const storeLogo = useSettingsStore(s => s.companyLogo);
  const storeUser = useSettingsStore(s => s.currentUser);

  const events = propEvents ?? storeEvents;
  const stages = propStages ?? storeStages;
  const userRole = propUserRole ?? storeUser.globalRole ?? 'admin';
  const userName = propUserName ?? storeUser.name ?? 'Juan Martín';
  const companyLogo = propCompanyLogo !== undefined ? propCompanyLogo : storeLogo;
  const onOpenNewEvent = propOnOpenNewEvent ?? storeOpenNewEvent;

  const handleSelectEvent = (event: EventItem) => {
    if (propOnSelectEvent) {
      propOnSelectEvent(event);
    } else {
      storeSelectEvent(event);
    }
    navigate(`/events/${event.id}`);
  };

  return (
    <div style={{
      maxWidth: '1080px',
      margin: '0 auto',
      padding: '40px 20px 80px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '85vh',
      justifyContent: 'center',
      gap: '36px'
    }}>
      {/* 1. Cabecera de Bienvenida */}
      <DashboardWelcome
        userName={userName}
        companyLogo={companyLogo}
      />

      {/* 2. Barra de Búsqueda con Atajos y Comandos */}
      <DashboardSearchBar
        events={events}
        stages={stages}
        onSelectEvent={handleSelectEvent}
        onOpenNewEvent={onOpenNewEvent}
      />

      {/* 3. Próximo Hito / Producción en Agenda */}
      <DashboardNextEvent
        events={events}
        stages={stages}
        onSelectEvent={handleSelectEvent}
      />

      {/* 4. Indicadores Clave de Producción (KPIs) */}
      <DashboardKPIs
        events={events}
        userRole={userRole}
      />
    </div>
  );
};
