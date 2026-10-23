import { create } from 'zustand';
import type { EventItem, TimingItem, AuditLog, EventStageConfig, ProcessNode } from '../types/metodicah';
import { useSettingsStore } from './useSettingsStore';
import { eventsRepository } from '../services/repositories';
import { generateId } from '@/utils/idUtils';
import { getTodayLocalDateString } from '@/utils/dateUtils';
import { formatFirebaseError } from '@/utils/firebaseErrors';

interface EventsState {
  events: EventItem[];
  selectedEvent: EventItem | null;
  isNewEventModalOpen: boolean;
  preselectedClientId: string | undefined;
  timingsMap: Record<string, TimingItem[]>;
  logs: AuditLog[];
  processNodesMap: Record<string, ProcessNode[]>;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;

  // Actions
  loadEvents: () => Promise<void>;
  subscribeEvents: () => () => void;
  selectEvent: (event: EventItem | null) => void;
  openNewEventModal: (clientId?: string) => void;
  closeNewEventModal: () => void;
  createEvent: (newEventData: Omit<EventItem, 'id' | 'code' | 'createdAt' | 'updatedAt'>) => EventItem;
  updateEventStage: (eventId: string, newStageId: string, stagesOverride?: EventStageConfig[]) => void;
  updateEvent: (updatedEvent: EventItem) => void;
  deleteEvent: (eventId: string) => void;
  updateTimingStatus: (timingId: string, newStatus: TimingItem['status']) => void;
  addTimingItem: (newItem: Omit<TimingItem, 'id' | 'eventId'>) => void;
  updateProcessNode: (eventId: string, nodeId: string, updates: Partial<ProcessNode>) => void;
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  selectedEvent: null,
  isNewEventModalOpen: false,
  preselectedClientId: undefined,
  timingsMap: {},
  logs: [],
  processNodesMap: {},
  isLoading: false,
  isSyncing: false,
  error: null,

  loadEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const [events, timingsMap, logs, processNodesMap] = await Promise.all([
        eventsRepository.getEvents(),
        eventsRepository.getTimings(),
        eventsRepository.getLogs(),
        eventsRepository.getProcessNodes()
      ]);
      set({
        events,
        timingsMap,
        logs,
        processNodesMap,
        isLoading: false
      });
    } catch (err) {
      set({
        error: formatFirebaseError(err, 'Error al cargar eventos'),
        isLoading: false
      });
    }
  },

  subscribeEvents: () => {
    if (!eventsRepository.subscribeEvents) return () => {};
    return eventsRepository.subscribeEvents(
      (events) => {
        if (!get().isSyncing) {
          set({ events, isLoading: false });
        }
      },
      (errorMsg) => {
        set({ error: errorMsg, isLoading: false });
      }
    );
  },

  selectEvent: (event) => {
    set({ selectedEvent: event });
  },

  openNewEventModal: (clientId) => {
    set({
      preselectedClientId: clientId,
      isNewEventModalOpen: true
    });
  },

  closeNewEventModal: () => {
    set({
      isNewEventModalOpen: false,
      preselectedClientId: undefined
    });
  },

  createEvent: (newEventData) => {
    const { events, timingsMap, logs, selectedEvent } = get();
    const previousEvents = events;
    const previousTimings = timingsMap;
    const previousLogs = logs;
    const previousSelected = selectedEvent;

    const newId = generateId('evt');
    const newCode = `MET-2026-00${events.length + 1}`;
    const now = getTodayLocalDateString();

    const createdEvent: EventItem = {
      ...newEventData,
      id: newId,
      code: newCode,
      createdAt: now,
      updatedAt: now
    };

    const updatedEvents = [createdEvent, ...events];

    const initialTiming: TimingItem = {
      id: generateId('time'),
      eventId: newId,
      timeStart: newEventData.timeRange?.startTime || '08:00',
      timeEnd: newEventData.timeRange?.endTime || '10:00',
      title: 'Apertura de instalaciones y verificación técnica',
      sector: 'Producción',
      responsible: 'Juan Martín',
      status: 'pending',
      order: 1
    };

    const updatedTimings = {
      ...timingsMap,
      [newId]: [initialTiming]
    };

    const newLog: AuditLog = {
      id: generateId('log'),
      eventId: newId,
      userId: 'usr_01',
      userName: 'Juan Martín',
      action: 'CREACION_EVENTO',
      details: `Creado nuevo evento ${createdEvent.title} (${createdEvent.code})`,
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedLogs = [newLog, ...logs];

    set({
      events: updatedEvents,
      timingsMap: updatedTimings,
      logs: updatedLogs,
      selectedEvent: createdEvent,
      isNewEventModalOpen: false,
      preselectedClientId: undefined,
      isSyncing: true,
      error: null
    });

    Promise.all([
      eventsRepository.saveEvents(updatedEvents),
      eventsRepository.saveTimings(updatedTimings),
      eventsRepository.saveLogs(updatedLogs)
    ])
      .then(() => set({ isSyncing: false }))
      .catch((err) => {
        set({ 
          events: previousEvents,
          timingsMap: previousTimings,
          logs: previousLogs,
          selectedEvent: previousSelected,
          isSyncing: false, 
          error: formatFirebaseError(err, 'Error al persistir evento')
        });
      });

    return createdEvent;
  },

  updateEventStage: (eventId, newStageId, stagesOverride) => {
    const { events, selectedEvent, logs } = get();
    const previousEvents = events;
    const previousSelected = selectedEvent;
    const previousLogs = logs;
    const now = getTodayLocalDateString();

    const updatedEvents = events.map(evt => 
      evt.id === eventId ? { ...evt, stageId: newStageId, updatedAt: now } : evt
    );

    const updatedSelected = selectedEvent && selectedEvent.id === eventId
      ? { ...selectedEvent, stageId: newStageId, updatedAt: now }
      : selectedEvent;

    const stagesList = stagesOverride || useSettingsStore.getState().stages;
    const stageObj = stagesList.find(s => s.id === newStageId);

    const newLog: AuditLog = {
      id: generateId('log'),
      eventId,
      userId: 'usr_01',
      userName: 'Juan Martín',
      action: 'EVENT_STAGE_UPDATE',
      details: `Etapa actualizada a: ${stageObj ? stageObj.label : newStageId}`,
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedLogs = [newLog, ...logs];

    set({
      events: updatedEvents,
      selectedEvent: updatedSelected,
      logs: updatedLogs,
      isSyncing: true,
      error: null
    });

    Promise.all([
      eventsRepository.saveEvents(updatedEvents),
      eventsRepository.saveLogs(updatedLogs)
    ])
      .then(() => set({ isSyncing: false }))
      .catch((err) => set({ 
        events: previousEvents,
        selectedEvent: previousSelected,
        logs: previousLogs,
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al guardar etapa')
      }));
  },

  updateEvent: (updatedEvent) => {
    const { events, selectedEvent, logs } = get();
    const previousEvents = events;
    const previousSelected = selectedEvent;
    const previousLogs = logs;
    const now = getTodayLocalDateString();
    const eventWithTimestamp: EventItem = {
      ...updatedEvent,
      updatedAt: now
    };

    const updatedEvents = events.map(evt => 
      evt.id === eventWithTimestamp.id ? eventWithTimestamp : evt
    );

    const updatedSelected = selectedEvent && selectedEvent.id === eventWithTimestamp.id 
      ? eventWithTimestamp 
      : selectedEvent;

    const newLog: AuditLog = {
      id: generateId('log'),
      eventId: eventWithTimestamp.id,
      userId: 'usr_01',
      userName: 'Juan Martín',
      action: 'EDICION_FICHA_TECNICA',
      details: `Ficha técnica actualizada para ${eventWithTimestamp.title}`,
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedLogs = [newLog, ...logs];

    set({
      events: updatedEvents,
      selectedEvent: updatedSelected,
      logs: updatedLogs,
      isSyncing: true,
      error: null
    });

    Promise.all([
      eventsRepository.saveEvents(updatedEvents),
      eventsRepository.saveLogs(updatedLogs)
    ])
      .then(() => set({ isSyncing: false }))
      .catch((err) => set({ 
        events: previousEvents,
        selectedEvent: previousSelected,
        logs: previousLogs,
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al guardar evento')
      }));
  },

  deleteEvent: (eventId: string) => {
    const { events, selectedEvent, timingsMap, logs } = get();
    const previousEvents = events;
    const previousSelected = selectedEvent;
    const previousTimings = timingsMap;
    const previousLogs = logs;

    const updatedEvents = events.filter(e => e.id !== eventId);
    const updatedTimings = { ...timingsMap };
    delete updatedTimings[eventId];

    const newLog: AuditLog = {
      id: generateId('log'),
      eventId,
      userId: 'usr_01',
      userName: 'Juan Martín',
      action: 'ELIMINACION_EVENTO',
      details: `Evento eliminado (ID: ${eventId})`,
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    };
    const updatedLogs = [newLog, ...logs];

    set({
      events: updatedEvents,
      selectedEvent: selectedEvent?.id === eventId ? null : selectedEvent,
      timingsMap: updatedTimings,
      logs: updatedLogs,
      isSyncing: true,
      error: null
    });

    Promise.all([
      eventsRepository.saveEvents(updatedEvents),
      eventsRepository.saveTimings(updatedTimings),
      eventsRepository.saveLogs(updatedLogs)
    ])
      .then(() => set({ isSyncing: false }))
      .catch((err) => set({ 
        events: previousEvents,
        selectedEvent: previousSelected,
        timingsMap: previousTimings,
        logs: previousLogs,
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al eliminar evento')
      }));
  },

  updateTimingStatus: (timingId, newStatus) => {
    const { selectedEvent, timingsMap, logs } = get();
    if (!selectedEvent) return;
    const previousTimings = timingsMap;
    const previousLogs = logs;

    const currentTimings = timingsMap[selectedEvent.id] || [];
    const updated = currentTimings.map(t => t.id === timingId ? { ...t, status: newStatus } : t);
    const updatedMap = {
      ...timingsMap,
      [selectedEvent.id]: updated
    };

    const newLog: AuditLog = {
      id: generateId('log'),
      eventId: selectedEvent.id,
      userId: 'usr_01',
      userName: 'Juan Martín',
      action: 'TIMING_STATUS_UPDATE',
      details: `Cambió estado de item del timing a: ${newStatus.toUpperCase()}`,
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedLogs = [newLog, ...logs];

    set({
      timingsMap: updatedMap,
      logs: updatedLogs,
      isSyncing: true,
      error: null
    });

    Promise.all([
      eventsRepository.saveTimings(updatedMap),
      eventsRepository.saveLogs(updatedLogs)
    ])
      .then(() => set({ isSyncing: false }))
      .catch((err) => set({ 
        timingsMap: previousTimings,
        logs: previousLogs,
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al actualizar timing')
      }));
  },

  addTimingItem: (newItem) => {
    const { selectedEvent, timingsMap } = get();
    if (!selectedEvent) return;
    const previousTimings = timingsMap;

    const created: TimingItem = {
      ...newItem,
      id: generateId('time'),
      eventId: selectedEvent.id
    };

    const currentTimings = timingsMap[selectedEvent.id] || [];
    const updatedMap = {
      ...timingsMap,
      [selectedEvent.id]: [...currentTimings, created]
    };

    set({ timingsMap: updatedMap, isSyncing: true, error: null });

    eventsRepository.saveTimings(updatedMap)
      .then(() => set({ isSyncing: false }))
      .catch((err) => set({ 
        timingsMap: previousTimings,
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al agregar timing')
      }));
  },

  updateProcessNode: (eventId, nodeId, updates) => {
    const { processNodesMap } = get();
    const previousNodes = processNodesMap;

    const currentNodes = processNodesMap[eventId] || [];
    const updatedNodes = currentNodes.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    );

    const updatedMap = {
      ...processNodesMap,
      [eventId]: updatedNodes
    };

    set({ processNodesMap: updatedMap, isSyncing: true, error: null });

    eventsRepository.saveProcessNodes(updatedMap)
      .then(() => set({ isSyncing: false }))
      .catch((err) => set({ 
        processNodesMap: previousNodes,
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al guardar nodo de proceso')
      }));
  }
}));

// Hydrate from repository on startup
void useEventsStore.getState().loadEvents();
