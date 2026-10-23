import type { EventItem, TimingItem, AuditLog, ProcessNode } from '@/types/metodicah';
import type { IEventsRepository } from '../contracts/IEventsRepository';
import { db } from '@/services/firebase';
import { collection, doc, getDocs, onSnapshot, setDoc } from 'firebase/firestore';
import { syncCollectionWithBatch, commitBatchInChunks, type BatchOperation } from './firestoreBatchUtils';
import { cleanFirestorePayload } from '@/utils/cleanFirestorePayload';
import { formatFirebaseError } from '@/utils/firebaseErrors';

export class FirestoreEventsRepository implements IEventsRepository {
  private inMemoryEvents: EventItem[] = [];
  private inMemoryTimings: Record<string, TimingItem[]> = {};
  private inMemoryLogs: AuditLog[] = [];
  private inMemoryProcessNodes: Record<string, ProcessNode[]> = {};

  // --- EVENTS ---

  async getEvents(): Promise<EventItem[]> {
    try {
      const eventsCol = collection(db, 'events');
      const snapshot = await getDocs(eventsCol);
      if (!snapshot.empty) {
        const remoteEvents = snapshot.docs.map(d => d.data() as EventItem);
        this.inMemoryEvents = remoteEvents;
        return remoteEvents;
      }
    } catch {
      // Fallback en memoria si falla la conexión de red
    }
    return this.inMemoryEvents;
  }

  subscribeEvents(onData: (events: EventItem[]) => void, onError?: (error: string) => void): () => void {
    try {
      const eventsCol = collection(db, 'events');
      return onSnapshot(
        eventsCol,
        (snapshot) => {
          const remoteEvents = snapshot.docs.map(d => d.data() as EventItem);
          this.inMemoryEvents = remoteEvents;
          onData(remoteEvents);
        },
        (error) => {
          onError?.(formatFirebaseError(error, 'Error en la suscripción de eventos en tiempo real.'));
        }
      );
    } catch {
      return () => {};
    }
  }

  async saveEvents(events: EventItem[]): Promise<void> {
    const previousEvents = this.inMemoryEvents;
    const knownIds = previousEvents.map(e => e.id);
    this.inMemoryEvents = events;
    try {
      const eventsCol = collection(db, 'events');
      await syncCollectionWithBatch(db, eventsCol, events, knownIds);
    } catch (err) {
      this.inMemoryEvents = previousEvents;
      throw new Error(formatFirebaseError(err, 'Error al guardar los eventos en Firestore.'));
    }
  }

  async saveEvent(event: EventItem): Promise<EventItem> {
    const previousEvents = this.inMemoryEvents;
    const index = previousEvents.findIndex(e => e.id === event.id);
    if (index >= 0) {
      const next = [...previousEvents];
      next[index] = event;
      this.inMemoryEvents = next;
    } else {
      this.inMemoryEvents = [event, ...previousEvents];
    }
    try {
      const eventsCol = collection(db, 'events');
      await setDoc(doc(eventsCol, event.id), cleanFirestorePayload(event), { merge: true });
      return event;
    } catch (err) {
      this.inMemoryEvents = previousEvents;
      throw new Error(formatFirebaseError(err, 'Error al guardar el evento en Firestore.'));
    }
  }

  async deleteEvent(id: string): Promise<void> {
    const previousEvents = this.inMemoryEvents;
    const previousTimings = { ...this.inMemoryTimings };
    const previousNodes = { ...this.inMemoryProcessNodes };

    this.inMemoryEvents = previousEvents.filter(e => e.id !== id);
    delete this.inMemoryTimings[id];
    delete this.inMemoryProcessNodes[id];

    try {
      const ops: BatchOperation[] = [
        { type: 'delete', ref: doc(collection(db, 'events'), id) },
        { type: 'delete', ref: doc(collection(db, 'timings'), id) },
        { type: 'delete', ref: doc(collection(db, 'process_nodes'), id) }
      ];
      await commitBatchInChunks(db, ops);
    } catch (err) {
      this.inMemoryEvents = previousEvents;
      this.inMemoryTimings = previousTimings;
      this.inMemoryProcessNodes = previousNodes;
      throw new Error(formatFirebaseError(err, 'Error al eliminar el evento en cascada.'));
    }
  }

  // --- TIMINGS ---

  async getTimings(): Promise<Record<string, TimingItem[]>> {
    try {
      const timingsCol = collection(db, 'timings');
      const snapshot = await getDocs(timingsCol);
      if (!snapshot.empty) {
        const remoteMap: Record<string, TimingItem[]> = {};
        snapshot.docs.forEach(d => {
          const data = d.data();
          if (data && Array.isArray(data.items)) {
            remoteMap[d.id] = data.items;
          }
        });
        this.inMemoryTimings = remoteMap;
        return remoteMap;
      }
    } catch {
      // Fallback en memoria si falla la conexión de red
    }
    return this.inMemoryTimings;
  }

  async saveTimings(timings: Record<string, TimingItem[]>): Promise<void> {
    const previousTimings = this.inMemoryTimings;
    const previousKeys = Object.keys(previousTimings);
    const incomingKeys = new Set(Object.keys(timings));
    const keysToDelete = previousKeys.filter(k => !incomingKeys.has(k));

    this.inMemoryTimings = timings;

    try {
      const timingsCol = collection(db, 'timings');
      const ops: BatchOperation[] = [];

      for (const key of keysToDelete) {
        ops.push({ type: 'delete', ref: doc(timingsCol, key) });
      }

      for (const [eventId, items] of Object.entries(timings)) {
        ops.push({
          type: 'set',
          ref: doc(timingsCol, eventId),
          data: cleanFirestorePayload({ items }),
          merge: true
        });
      }

      await commitBatchInChunks(db, ops);
    } catch (err) {
      this.inMemoryTimings = previousTimings;
      throw new Error(formatFirebaseError(err, 'Error al guardar el cronograma de timings.'));
    }
  }

  // --- AUDIT LOGS ---

  async getLogs(): Promise<AuditLog[]> {
    try {
      const logsCol = collection(db, 'audit_logs');
      const snapshot = await getDocs(logsCol);
      if (!snapshot.empty) {
        const remoteLogs = snapshot.docs.map(d => d.data() as AuditLog);
        this.inMemoryLogs = remoteLogs;
        return remoteLogs;
      }
    } catch {
      // Fallback en memoria si falla la conexión de red
    }
    return this.inMemoryLogs;
  }

  async saveLogs(logs: AuditLog[]): Promise<void> {
    const previousLogs = this.inMemoryLogs;
    this.inMemoryLogs = logs;
    try {
      const logsCol = collection(db, 'audit_logs');
      const ops: BatchOperation[] = logs.map(log => ({
        type: 'set',
        ref: doc(logsCol, log.id),
        data: cleanFirestorePayload(log as unknown as Record<string, unknown>),
        merge: true
      }));
      await commitBatchInChunks(db, ops);
    } catch (err) {
      this.inMemoryLogs = previousLogs;
      throw new Error(formatFirebaseError(err, 'Error al guardar la bitácora de auditoría.'));
    }
  }

  // --- PROCESS NODES ---

  async getProcessNodes(): Promise<Record<string, ProcessNode[]>> {
    try {
      const col = collection(db, 'process_nodes');
      const snapshot = await getDocs(col);
      if (!snapshot.empty) {
        const remoteMap: Record<string, ProcessNode[]> = {};
        snapshot.docs.forEach(d => {
          const data = d.data();
          if (data && Array.isArray(data.items)) {
            remoteMap[d.id] = data.items;
          }
        });
        this.inMemoryProcessNodes = remoteMap;
        return remoteMap;
      }
    } catch {
      // Fallback en memoria si falla la conexión de red
    }
    return this.inMemoryProcessNodes;
  }

  async saveProcessNodes(nodes: Record<string, ProcessNode[]>): Promise<void> {
    const previousNodes = this.inMemoryProcessNodes;
    const previousKeys = Object.keys(previousNodes);
    const incomingKeys = new Set(Object.keys(nodes));
    const keysToDelete = previousKeys.filter(k => !incomingKeys.has(k));

    this.inMemoryProcessNodes = nodes;

    try {
      const col = collection(db, 'process_nodes');
      const ops: BatchOperation[] = [];

      for (const key of keysToDelete) {
        ops.push({ type: 'delete', ref: doc(col, key) });
      }

      for (const [eventId, items] of Object.entries(nodes)) {
        ops.push({
          type: 'set',
          ref: doc(col, eventId),
          data: cleanFirestorePayload({ items }),
          merge: true
        });
      }

      await commitBatchInChunks(db, ops);
    } catch (err) {
      this.inMemoryProcessNodes = previousNodes;
      throw new Error(formatFirebaseError(err, 'Error al guardar los nodos de proceso.'));
    }
  }
}
