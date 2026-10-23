import type { Client } from '@/types/metodicah';
import type { IClientsRepository } from '../contracts/IClientsRepository';
import { db } from '@/services/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { syncCollectionWithBatch } from './firestoreBatchUtils';
import { cleanFirestorePayload } from '@/utils/cleanFirestorePayload';
import { formatFirebaseError } from '@/utils/firebaseErrors';

export class FirestoreClientsRepository implements IClientsRepository {
  private inMemoryClients: Client[] = [];

  async getClients(): Promise<Client[]> {
    try {
      const clientsCol = collection(db, 'clients');
      const snapshot = await getDocs(clientsCol);
      if (!snapshot.empty) {
        const remoteClients = snapshot.docs.map(docSnap => docSnap.data() as Client);
        this.inMemoryClients = remoteClients;
        return remoteClients;
      }
    } catch {
      // Fallback en memoria si falla la conexión de red
    }
    return this.inMemoryClients;
  }

  subscribeClients(onData: (clients: Client[]) => void, onError?: (error: string) => void): () => void {
    try {
      const clientsCol = collection(db, 'clients');
      return onSnapshot(
        clientsCol,
        (snapshot) => {
          const remoteClients = snapshot.docs.map(docSnap => docSnap.data() as Client);
          this.inMemoryClients = remoteClients;
          onData(remoteClients);
        },
        (error) => {
          onError?.(formatFirebaseError(error, 'Error en la suscripción de clientes en tiempo real.'));
        }
      );
    } catch {
      return () => {};
    }
  }

  async saveClients(clients: Client[]): Promise<void> {
    const previousClients = this.inMemoryClients;
    const knownIds = previousClients.map(c => c.id);
    this.inMemoryClients = clients;
    try {
      const clientsCol = collection(db, 'clients');
      await syncCollectionWithBatch(db, clientsCol, clients, knownIds);
    } catch (err) {
      this.inMemoryClients = previousClients;
      throw new Error(formatFirebaseError(err, 'Error al guardar el directorio de clientes.'));
    }
  }

  async saveClient(client: Client): Promise<Client> {
    const previousClients = this.inMemoryClients;
    const index = previousClients.findIndex(c => c.id === client.id);
    if (index >= 0) {
      const next = [...previousClients];
      next[index] = client;
      this.inMemoryClients = next;
    } else {
      this.inMemoryClients = [client, ...previousClients];
    }
    try {
      const clientsCol = collection(db, 'clients');
      await setDoc(doc(clientsCol, client.id), cleanFirestorePayload(client), { merge: true });
      return client;
    } catch (err) {
      this.inMemoryClients = previousClients;
      throw new Error(formatFirebaseError(err, 'Error al guardar el cliente en Firestore.'));
    }
  }

  async deleteClient(id: string): Promise<void> {
    const previousClients = this.inMemoryClients;
    this.inMemoryClients = previousClients.filter(c => c.id !== id);
    try {
      const clientsCol = collection(db, 'clients');
      await deleteDoc(doc(clientsCol, id));
    } catch (err) {
      this.inMemoryClients = previousClients;
      throw new Error(formatFirebaseError(err, 'Error al eliminar el cliente en Firestore.'));
    }
  }
}
