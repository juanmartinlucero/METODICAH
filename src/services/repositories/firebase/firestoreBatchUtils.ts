import { 
  type Firestore, 
  type DocumentReference, 
  type CollectionReference,
  type DocumentData,
  writeBatch, 
  doc, 
  getDocs 
} from 'firebase/firestore';
import { cleanFirestorePayload } from '@/utils/cleanFirestorePayload';

export type BatchOperation =
  | { type: 'set'; ref: DocumentReference<DocumentData, DocumentData>; data: Record<string, unknown>; merge?: boolean }
  | { type: 'delete'; ref: DocumentReference<DocumentData, DocumentData> };

/**
 * Ejecuta una lista de operaciones de escritura por lotes en chunks de hasta 450 operaciones
 * (por debajo del límite duro de 500 operaciones por writeBatch en Firestore),
 * aplicando sanitización recursiva contra valores `undefined`.
 */
export async function commitBatchInChunks(
  db: Firestore, 
  operations: BatchOperation[], 
  chunkSize: number = 450
): Promise<void> {
  if (operations.length === 0) return;

  for (let i = 0; i < operations.length; i += chunkSize) {
    const chunk = operations.slice(i, i + chunkSize);
    const batch = writeBatch(db);
    for (const op of chunk) {
      if (op.type === 'set') {
        batch.set(op.ref, cleanFirestorePayload(op.data), { merge: op.merge ?? true });
      } else if (op.type === 'delete') {
        batch.delete(op.ref);
      }
    }
    await batch.commit();
  }
}

/**
 * Sincroniza un array de ítems con una colección de Firestore mediante batches atómicos:
 * - Inserta o actualiza los ítems presentes en el array entrante.
 * - Detecta y elimina documentos huérfanos que fueron removidos.
 */
export async function syncCollectionWithBatch<T extends { id: string }>(
  db: Firestore,
  collectionRef: CollectionReference<DocumentData, DocumentData>,
  incomingItems: T[],
  knownExistingIds?: Set<string> | string[]
): Promise<string[]> {
  const incomingIds = new Set(incomingItems.map(item => item.id));
  let idsToDelete: string[] = [];

  if (knownExistingIds) {
    const existingSet = Array.isArray(knownExistingIds) 
      ? new Set(knownExistingIds) 
      : knownExistingIds;
    idsToDelete = Array.from(existingSet).filter(id => !incomingIds.has(id));
  } else {
    try {
      const snapshot = await getDocs(collectionRef);
      idsToDelete = snapshot.docs
        .map(d => d.id)
        .filter(id => !incomingIds.has(id));
    } catch {
      idsToDelete = [];
    }
  }

  const operations: BatchOperation[] = [];

  // 1. Eliminar documentos removidos para evitar orfandad
  for (const id of idsToDelete) {
    operations.push({
      type: 'delete',
      ref: doc(collectionRef, id)
    });
  }

  // 2. Upsert de todos los ítems entrantes
  for (const item of incomingItems) {
    operations.push({
      type: 'set',
      ref: doc(collectionRef, item.id),
      data: cleanFirestorePayload(item as unknown as Record<string, unknown>),
      merge: true
    });
  }

  await commitBatchInChunks(db, operations);

  return incomingItems.map(item => item.id);
}
