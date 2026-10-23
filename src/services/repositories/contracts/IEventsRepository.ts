import type { EventItem, TimingItem, AuditLog, ProcessNode } from '@/types/metodicah';

export interface IEventsRepository {
  getEvents(): Promise<EventItem[]>;
  saveEvents(events: EventItem[]): Promise<void>;
  saveEvent?(event: EventItem): Promise<EventItem>;
  deleteEvent?(id: string): Promise<void>;
  subscribeEvents?(onData: (events: EventItem[]) => void, onError?: (error: string) => void): () => void;

  getTimings(): Promise<Record<string, TimingItem[]>>;
  saveTimings(timings: Record<string, TimingItem[]>): Promise<void>;

  getLogs(): Promise<AuditLog[]>;
  saveLogs(logs: AuditLog[]): Promise<void>;

  getProcessNodes(): Promise<Record<string, ProcessNode[]>>;
  saveProcessNodes(nodes: Record<string, ProcessNode[]>): Promise<void>;
}
