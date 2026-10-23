import type { Supplier } from '@/types/metodicah';
import type { ISuppliersRepository } from '../contracts/ISuppliersRepository';
import { db } from '@/services/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { syncCollectionWithBatch } from './firestoreBatchUtils';
import { cleanFirestorePayload } from '@/utils/cleanFirestorePayload';
import { formatFirebaseError } from '@/utils/firebaseErrors';

export class FirestoreSuppliersRepository implements ISuppliersRepository {
  private inMemorySuppliers: Supplier[] = [];

  async getSuppliers(): Promise<Supplier[]> {
    try {
      const col = collection(db, 'suppliers');
      const snapshot = await getDocs(col);
      if (!snapshot.empty) {
        const remoteSuppliers = snapshot.docs.map(docSnap => docSnap.data() as Supplier);
        this.inMemorySuppliers = remoteSuppliers;
        return remoteSuppliers;
      }
    } catch {
      // Fallback en memoria si falla la conexión de red
    }
    return this.inMemorySuppliers;
  }

  subscribeSuppliers(onData: (suppliers: Supplier[]) => void, onError?: (error: string) => void): () => void {
    try {
      const col = collection(db, 'suppliers');
      return onSnapshot(
        col,
        (snapshot) => {
          const remoteSuppliers = snapshot.docs.map(docSnap => docSnap.data() as Supplier);
          this.inMemorySuppliers = remoteSuppliers;
          onData(remoteSuppliers);
        },
        (error) => {
          onError?.(formatFirebaseError(error, 'Error en la suscripción de proveedores en tiempo real.'));
        }
      );
    } catch {
      return () => {};
    }
  }

  async saveSuppliers(suppliers: Supplier[]): Promise<void> {
    const previousSuppliers = this.inMemorySuppliers;
    const knownIds = previousSuppliers.map(s => s.id);
    this.inMemorySuppliers = suppliers;
    try {
      const col = collection(db, 'suppliers');
      await syncCollectionWithBatch(db, col, suppliers, knownIds);
    } catch (err) {
      this.inMemorySuppliers = previousSuppliers;
      throw new Error(formatFirebaseError(err, 'Error al guardar la red de proveedores.'));
    }
  }

  async saveSupplier(supplier: Supplier): Promise<Supplier> {
    const previousSuppliers = this.inMemorySuppliers;
    const index = previousSuppliers.findIndex(s => s.id === supplier.id);
    if (index >= 0) {
      const next = [...previousSuppliers];
      next[index] = supplier;
      this.inMemorySuppliers = next;
    } else {
      this.inMemorySuppliers = [supplier, ...previousSuppliers];
    }
    try {
      const col = collection(db, 'suppliers');
      await setDoc(doc(col, supplier.id), cleanFirestorePayload(supplier), { merge: true });
      return supplier;
    } catch (err) {
      this.inMemorySuppliers = previousSuppliers;
      throw new Error(formatFirebaseError(err, 'Error al guardar el proveedor en Firestore.'));
    }
  }

  async deleteSupplier(id: string): Promise<void> {
    const previousSuppliers = this.inMemorySuppliers;
    this.inMemorySuppliers = previousSuppliers.filter(s => s.id !== id);
    try {
      const col = collection(db, 'suppliers');
      await deleteDoc(doc(col, id));
    } catch (err) {
      this.inMemorySuppliers = previousSuppliers;
      throw new Error(formatFirebaseError(err, 'Error al eliminar el proveedor en Firestore.'));
    }
  }
}
