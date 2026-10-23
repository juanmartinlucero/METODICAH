import type { WorkflowDefinition } from '@/types/metodicah';
import type { IWorkflowRepository } from '../contracts/IWorkflowRepository';
import { db } from '@/services/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { syncCollectionWithBatch } from './firestoreBatchUtils';
import { cleanFirestorePayload } from '@/utils/cleanFirestorePayload';
import { formatFirebaseError } from '@/utils/firebaseErrors';
import { getTodayLocalDateString } from '@/utils/dateUtils';

export class FirestoreWorkflowRepository implements IWorkflowRepository {
  private inMemoryWorkflows: WorkflowDefinition[] = [];

  async getWorkflows(accountId?: string): Promise<WorkflowDefinition[]> {
    try {
      const col = collection(db, 'workflows');
      const snapshot = await getDocs(col);
      if (!snapshot.empty) {
        const remoteWorkflows = snapshot.docs.map(docSnap => docSnap.data() as WorkflowDefinition);
        this.inMemoryWorkflows = remoteWorkflows;
        if (accountId) {
          return remoteWorkflows.filter(w => !w.accountId || w.accountId === accountId);
        }
        return remoteWorkflows;
      }
    } catch {
      // Fallback en memoria si falla la conexión de red
    }

    if (accountId) {
      return this.inMemoryWorkflows.filter(w => !w.accountId || w.accountId === accountId);
    }
    return this.inMemoryWorkflows;
  }

  subscribeWorkflows(onData: (workflows: WorkflowDefinition[]) => void, onError?: (error: string) => void): () => void {
    try {
      const col = collection(db, 'workflows');
      return onSnapshot(
        col,
        (snapshot) => {
          const remoteWorkflows = snapshot.docs.map(docSnap => docSnap.data() as WorkflowDefinition);
          this.inMemoryWorkflows = remoteWorkflows;
          onData(remoteWorkflows);
        },
        (error) => {
          onError?.(formatFirebaseError(error, 'Error en la suscripción de flujos de trabajo en tiempo real.'));
        }
      );
    } catch {
      return () => {};
    }
  }

  async saveWorkflows(workflows: WorkflowDefinition[]): Promise<void> {
    const previousWorkflows = this.inMemoryWorkflows;
    const knownIds = previousWorkflows.map(w => w.id);
    this.inMemoryWorkflows = workflows;
    try {
      const col = collection(db, 'workflows');
      await syncCollectionWithBatch(db, col, workflows, knownIds);
    } catch (err) {
      this.inMemoryWorkflows = previousWorkflows;
      throw new Error(formatFirebaseError(err, 'Error al guardar los flujos de trabajo en Firestore.'));
    }
  }

  async saveWorkflow(workflow: WorkflowDefinition): Promise<WorkflowDefinition> {
    const previousWorkflows = this.inMemoryWorkflows;
    const workflows = await this.getWorkflows();
    const index = workflows.findIndex(w => w.id === workflow.id);
    const updatedWorkflow: WorkflowDefinition = {
      ...workflow,
      updatedAt: getTodayLocalDateString()
    };

    let updatedList: WorkflowDefinition[];
    if (index >= 0) {
      updatedList = [...workflows];
      updatedList[index] = updatedWorkflow;
    } else {
      updatedList = [...workflows, updatedWorkflow];
    }
    this.inMemoryWorkflows = updatedList;

    try {
      const col = collection(db, 'workflows');
      await setDoc(doc(col, updatedWorkflow.id), cleanFirestorePayload(updatedWorkflow), { merge: true });
      return updatedWorkflow;
    } catch (err) {
      this.inMemoryWorkflows = previousWorkflows;
      throw new Error(formatFirebaseError(err, 'Error al guardar el flujo de trabajo en Firestore.'));
    }
  }

  async deleteWorkflow(id: string): Promise<void> {
    const previousWorkflows = this.inMemoryWorkflows;
    this.inMemoryWorkflows = previousWorkflows.filter(w => w.id !== id);
    try {
      const col = collection(db, 'workflows');
      await deleteDoc(doc(col, id));
    } catch (err) {
      this.inMemoryWorkflows = previousWorkflows;
      throw new Error(formatFirebaseError(err, 'Error al eliminar el flujo de trabajo en Firestore.'));
    }
  }
}
