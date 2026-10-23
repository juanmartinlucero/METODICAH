import { create } from 'zustand';
import type { Client } from '../types/metodicah';
import { clientsRepository } from '../services/repositories';
import { generateId } from '@/utils/idUtils';
import { getTodayLocalDateString } from '@/utils/dateUtils';
import { formatFirebaseError } from '@/utils/firebaseErrors';

interface ClientsState {
  clients: Client[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;

  // Actions
  loadClients: () => Promise<void>;
  subscribeClients: () => () => void;
  addClient: (newClient: Omit<Client, 'id' | 'createdAt'>) => Client;
  addClientsBulk: (newClientsList: Omit<Client, 'id' | 'createdAt'>[]) => void;
  updateClient: (updatedClient: Client) => void;
  deleteClient: (clientId: string) => void;
  getClientById: (clientId: string) => Client | undefined;
}

export const useClientsStore = create<ClientsState>((set, get) => ({
  clients: [],
  isLoading: false,
  isSyncing: false,
  error: null,

  loadClients: async () => {
    set({ isLoading: true, error: null });
    try {
      const clients = await clientsRepository.getClients();
      set({ clients, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: formatFirebaseError(err, 'Error al cargar clientes') });
    }
  },

  subscribeClients: () => {
    if (!clientsRepository.subscribeClients) return () => {};
    return clientsRepository.subscribeClients(
      (clients) => {
        if (!get().isSyncing) {
          set({ clients, isLoading: false });
        }
      },
      (errorMsg) => {
        set({ error: errorMsg, isLoading: false });
      }
    );
  },

  addClient: (newClient) => {
    const previous = get().clients;
    const client: Client = {
      ...newClient,
      id: generateId('cli'),
      createdAt: getTodayLocalDateString()
    };
    const updated = [client, ...previous];
    set({ clients: updated, isSyncing: true, error: null });

    clientsRepository.saveClients(updated)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({ 
        clients: previous, 
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al guardar cliente')
      }));

    return client;
  },

  addClientsBulk: (newClientsList) => {
    const previous = get().clients;
    const now = getTodayLocalDateString();
    const newClients: Client[] = newClientsList.map(c => ({
      ...c,
      id: generateId('cli'),
      createdAt: now
    }));
    const updated = [...newClients, ...previous];
    set({ clients: updated, isSyncing: true, error: null });

    clientsRepository.saveClients(updated)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({ 
        clients: previous, 
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al importar clientes')
      }));
  },

  updateClient: (updatedClient) => {
    const previous = get().clients;
    const updated = previous.map(c => 
      c.id === updatedClient.id ? { ...updatedClient, updatedAt: getTodayLocalDateString() } : c
    );
    set({ clients: updated, isSyncing: true, error: null });

    clientsRepository.saveClients(updated)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({ 
        clients: previous, 
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al actualizar cliente')
      }));
  },

  deleteClient: (clientId) => {
    const previous = get().clients;
    const updated = previous.filter(c => c.id !== clientId);
    set({ clients: updated, isSyncing: true, error: null });

    clientsRepository.saveClients(updated)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({ 
        clients: previous, 
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al eliminar cliente')
      }));
  },

  getClientById: (clientId) => {
    return get().clients.find(c => c.id === clientId);
  }
}));

// Hydrate from repository on startup
void useClientsStore.getState().loadClients();
