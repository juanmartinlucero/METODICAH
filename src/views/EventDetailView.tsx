import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { EventHeader, type EventSubTab } from '@/components/event-detail/EventHeader';
import { EventOverviewTab } from '@/components/event-detail/EventOverviewTab';
import { EventTimingTab } from '@/components/event-detail/EventTimingTab';
import { EventAccreditationsTab } from '@/components/event-detail/accreditations/EventAccreditationsTab';
import { EventLogsTab } from '@/components/event-detail/EventLogsTab';
import { NotFoundView } from '@/components/common/NotFoundView';
import { useDateFormat } from '@/hooks/useDateFormat';
import { useEventsStore, useSettingsStore, useCrewStore, useClientsStore } from '@/stores';

export interface EventDetailViewProps {
  // Vista de Detalle de Evento: Smart Container conectado a Zustand y React Router
}

export const EventDetailView: React.FC<EventDetailViewProps> = () => {
  const { eventId, subTab } = useParams<{ eventId: string; subTab?: string }>();
  const navigate = useNavigate();
  const { formatDate } = useDateFormat();

  // Stores
  const events = useEventsStore(s => s.events);
  const selectedEvent = useEventsStore(s => s.selectedEvent);
  const selectEvent = useEventsStore(s => s.selectEvent);
  const onUpdateTimingStatus = useEventsStore(s => s.updateTimingStatus);
  const onAddTimingItem = useEventsStore(s => s.addTimingItem);
  const onUpdateEventStage = useEventsStore(s => s.updateEventStage);
  const onUpdateEvent = useEventsStore(s => s.updateEvent);
  const timingsMap = useEventsStore(s => s.timingsMap);
  const accreditationsMap = useEventsStore(s => s.accreditationsMap);
  const storeLogs = useEventsStore(s => s.logs);

  const stages = useSettingsStore(s => s.stages);
  const configuredScopes = useSettingsStore(s => s.configuredScopes);
  const storeCrew = useCrewStore(s => s.crewMembers);
  const clients = useClientsStore(s => s.clients);

  // Resolve event from params or store
  const event = eventId
    ? (events.find(e => e.id === eventId) || (selectedEvent?.id === eventId ? selectedEvent : null))
    : selectedEvent;

  // Sync selectedEvent in store
  useEffect(() => {
    if (event && selectedEvent?.id !== event.id) {
      selectEvent(event);
    }
  }, [event, selectedEvent, selectEvent]);

  const activeSubTab: EventSubTab = (
    subTab === 'timing' || subTab === 'logs' || subTab === 'accreditations'
      ? subTab
      : 'overview'
  );

  const handleSubTabChange = (tab: EventSubTab) => {
    if (!event) return;
    if (tab === 'overview') {
      navigate(`/events/${event.id}`);
    } else {
      navigate(`/events/${event.id}/${tab}`);
    }
  };

  const onBack = () => {
    selectEvent(null);
    navigate('/events');
  };

  if (!event) {
    return (
      <NotFoundView
        title="Producción o Evento no encontrado"
        description={eventId ? `El evento con identificador "${eventId}" no existe en el catálogo local o fue eliminado.` : 'No se seleccionó ningún evento para visualizar.'}
        redirectPath="/events"
        actionLabel="Volver a Producciones"
      />
    );
  }

  const crewMembers = storeCrew;
  const timings = timingsMap[event.id] || [];
  const accreditations = accreditationsMap[event.id] || [];
  const logs = storeLogs.filter(l => l.eventId === event.id);

  // PDF Export for Timings (dynamically imported on demand)
  const handleExportPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`METODICAH - TIMING OFICIAL`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Evento: ${event.title} (${event.code})`, 14, 28);
    doc.text(`Fecha: ${formatDate(event.date)} | Horario: ${event.timeRange?.startTime || ''} a ${event.timeRange?.endTime || ''}`, 14, 34);

    doc.text(`Venue: ${event.venue} - ${event.location}`, 14, 40);
    doc.text(`----------------------------------------------------------------------------------`, 14, 46);

    let yPosition = 55;
    timings.forEach((t) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFontSize(10);
      doc.text(`${t.timeStart} - ${t.timeEnd} | [${t.sector}] ${t.title}`, 14, yPosition);
      doc.setFontSize(9);
      doc.text(`   Resp: ${t.responsible} | Estado: ${t.status.toUpperCase()}`, 14, yPosition + 5);
      yPosition += 12;
    });

    doc.save(`Timing_${event.code}.pdf`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1120px', margin: '0 auto' }}>
      
      {/* 1. Header & Navigation */}
      <EventHeader
        event={event}
        stages={stages}
        activeSubTab={activeSubTab}
        setActiveSubTab={handleSubTabChange}
        onBack={onBack}
        onExportPDF={handleExportPDF}
        onUpdateEventStage={onUpdateEventStage}
        timingsCount={timings.length}
        accreditationsCount={accreditations.length}
        logsCount={logs.length}
      />

      {/* 2. Sub-Tab Content */}
      {activeSubTab === 'overview' && (
        <EventOverviewTab
          event={event}
          crewMembers={crewMembers}
          clients={clients}
          configuredScopes={configuredScopes}
          onUpdateEvent={onUpdateEvent}
        />
      )}

      {activeSubTab === 'timing' && (
        <EventTimingTab
          timings={timings}
          onUpdateTimingStatus={onUpdateTimingStatus}
          onAddTimingItem={onAddTimingItem}
        />
      )}

      {activeSubTab === 'accreditations' && (
        <EventAccreditationsTab
          event={event}
        />
      )}

      {activeSubTab === 'logs' && (
        <EventLogsTab
          logs={logs}
        />
      )}

    </div>
  );
};
