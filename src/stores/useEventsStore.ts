import { create } from 'zustand';
import type { EventItem, TimingItem, AuditLog, EventStageConfig, ProcessNode, AccreditationItem } from '../types/metodicah';
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
  accreditationsMap: Record<string, AccreditationItem[]>;
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
  addAccreditation: (newItem: Omit<AccreditationItem, 'id' | 'createdAt' | 'updatedAt'>) => AccreditationItem;
  updateAccreditation: (item: AccreditationItem) => void;
  deleteAccreditation: (eventId: string, id: string) => void;
  toggleCheckIn: (eventId: string, id: string, operatorName?: string) => void;
  bulkAddAccreditations: (eventId: string, newItems: Omit<AccreditationItem, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
  updateProcessNode: (eventId: string, nodeId: string, updates: Partial<ProcessNode>) => void;
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  selectedEvent: null,
  isNewEventModalOpen: false,
  preselectedClientId: undefined,
  timingsMap: {},
  accreditationsMap: {},
  logs: [],
  processNodesMap: {},
  isLoading: false,
  isSyncing: false,
  error: null,

  loadEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const [events, timingsMap, accreditationsMap, logs, processNodesMap] = await Promise.all([
        eventsRepository.getEvents(),
        eventsRepository.getTimings(),
        eventsRepository.getAccreditations ? eventsRepository.getAccreditations() : Promise.resolve({}),
        eventsRepository.getLogs(),
        eventsRepository.getProcessNodes()
      ]);
      set({
        events,
        timingsMap,
        accreditationsMap,
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

  addAccreditation: (newItem) => {
    const { accreditationsMap } = get();
    const now = new Date().toISOString();
    const id = generateId('acc');
    const created: AccreditationItem = {
      ...newItem,
      id,
      qrCode: newItem.qrCode || `MET-${newItem.eventId.slice(-4).toUpperCase()}-${newItem.documentNumber.replace(/\D/g, '').slice(-8)}`,
      createdAt: now,
      updatedAt: now
    };

    const currentList = accreditationsMap[newItem.eventId] || [];
    const updatedMap = {
      ...accreditationsMap,
      [newItem.eventId]: [created, ...currentList]
    };

    const previousMap = accreditationsMap;
    set({ accreditationsMap: updatedMap, isSyncing: true, error: null });

    eventsRepository.saveAccreditations(updatedMap)
      .then(() => set({ isSyncing: false }))
      .catch((err) => set({
        accreditationsMap: previousMap,
        isSyncing: false,
        error: formatFirebaseError(err, 'Error al guardar la acreditación')
      }));

    return created;
  },

  updateAccreditation: (updatedItem) => {
    const { accreditationsMap } = get();
    const eventId = updatedItem.eventId;
    const currentList = accreditationsMap[eventId] || [];
    const now = new Date().toISOString();
    const updatedList = currentList.map(item =>
      item.id === updatedItem.id ? { ...updatedItem, updatedAt: now } : item
    );

    const updatedMap = {
      ...accreditationsMap,
      [eventId]: updatedList
    };

    const previousMap = accreditationsMap;
    set({ accreditationsMap: updatedMap, isSyncing: true, error: null });

    eventsRepository.saveAccreditations(updatedMap)
      .then(() => set({ isSyncing: false }))
      .catch((err) => set({
        accreditationsMap: previousMap,
        isSyncing: false,
        error: formatFirebaseError(err, 'Error al actualizar la acreditación')
      }));
  },

  deleteAccreditation: (eventId, id) => {
    const { accreditationsMap } = get();
    const currentList = accreditationsMap[eventId] || [];
    const updatedList = currentList.filter(item => item.id !== id);

    const updatedMap = {
      ...accreditationsMap,
      [eventId]: updatedList
    };

    const previousMap = accreditationsMap;
    set({ accreditationsMap: updatedMap, isSyncing: true, error: null });

    eventsRepository.saveAccreditations(updatedMap)
      .then(() => set({ isSyncing: false }))
      .catch((err) => set({
        accreditationsMap: previousMap,
        isSyncing: false,
        error: formatFirebaseError(err, 'Error al eliminar la acreditación')
      }));
  },

  toggleCheckIn: (eventId, id, operatorName = 'Producción') => {
    const { accreditationsMap, logs } = get();
    const currentList = accreditationsMap[eventId] || [];
    const item = currentList.find(i => i.id === id);
    if (!item) return;

    const isEntering = item.status !== 'en_sitio';
    const now = new Date().toISOString();

    const updatedItem: AccreditationItem = {
      ...item,
      status: isEntering ? 'en_sitio' : 'aprobada',
      checkInAt: isEntering ? now : null,
      checkInBy: isEntering ? operatorName : null,
      updatedAt: now
    };

    const updatedList = currentList.map(i => i.id === id ? updatedItem : i);
    const updatedMap = {
      ...accreditationsMap,
      [eventId]: updatedList
    };

    const newLog: AuditLog = {
      id: generateId('log'),
      eventId,
      userId: 'usr_01',
      userName: operatorName,
      action: isEntering ? 'ACCREDITATION_CHECK_IN' : 'ACCREDITATION_CHECK_OUT',
      details: `${isEntering ? 'Ingreso registrado (En Sitio)' : 'Salida registrada'} para ${item.firstName} ${item.lastName} [${item.accessLevel} - ${item.company}]`,
      timestamp: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedLogs = [newLog, ...logs];
    const previousMap = accreditationsMap;
    const previousLogs = logs;

    set({
      accreditationsMap: updatedMap,
      logs: updatedLogs,
      isSyncing: true,
      error: null
    });

    Promise.all([
      eventsRepository.saveAccreditations(updatedMap),
      eventsRepository.saveLogs(updatedLogs)
    ])
      .then(() => set({ isSyncing: false }))
      .catch((err) => set({
        accreditationsMap: previousMap,
        logs: previousLogs,
        isSyncing: false,
        error: formatFirebaseError(err, 'Error al registrar check-in')
      }));
  },

  bulkAddAccreditations: (eventId, newItems) => {
    const { accreditationsMap } = get();
    const currentList = accreditationsMap[eventId] || [];
    const now = new Date().toISOString();

    const createdItems: AccreditationItem[] = newItems.map(item => ({
      ...item,
      id: generateId('acc'),
      eventId,
      qrCode: item.qrCode || `MET-${eventId.slice(-4).toUpperCase()}-${item.documentNumber.replace(/\D/g, '').slice(-8)}`,
      createdAt: now,
      updatedAt: now
    }));

    const updatedMap = {
      ...accreditationsMap,
      [eventId]: [...createdItems, ...currentList]
    };

    const previousMap = accreditationsMap;
    set({ accreditationsMap: updatedMap, isSyncing: true, error: null });

    eventsRepository.saveAccreditations(updatedMap)
      .then(() => set({ isSyncing: false }))
      .catch((err) => set({
        accreditationsMap: previousMap,
        isSyncing: false,
        error: formatFirebaseError(err, 'Error al importar acreditaciones')
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
