import type { Client } from '@/types/metodicah';

export interface IClientsRepository {
  getClients(): Promise<Client[]>;
  saveClients(clients: Client[]): Promise<void>;
  saveClient?(client: Client): Promise<Client>;
  deleteClient?(id: string): Promise<void>;
  subscribeClients?(onData: (clients: Client[]) => void, onError?: (error: string) => void): () => void;
}
