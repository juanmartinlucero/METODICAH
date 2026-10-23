import type { EventCrewMember } from '@/types/metodicah';
import type { ICrewRepository } from '../contracts/ICrewRepository';
import { db } from '@/services/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { syncCollectionWithBatch } from './firestoreBatchUtils';
import { cleanFirestorePayload } from '@/utils/cleanFirestorePayload';
import { formatFirebaseError } from '@/utils/firebaseErrors';

export class FirestoreCrewRepository implements ICrewRepository {
  private inMemoryCrew: EventCrewMember[] = [];

  async getCrewMembers(): Promise<EventCrewMember[]> {
    try {
      const col = collection(db, 'crew');
      const snapshot = await getDocs(col);
      if (!snapshot.empty) {
        const remoteCrew = snapshot.docs.map(docSnap => docSnap.data() as EventCrewMember);
        this.inMemoryCrew = remoteCrew;
        return remoteCrew;
      }
    } catch {
      // Fallback en memoria si falla la conexión de red
    }
    return this.inMemoryCrew;
  }

  subscribeCrewMembers(onData: (members: EventCrewMember[]) => void, onError?: (error: string) => void): () => void {
    try {
      const col = collection(db, 'crew');
      return onSnapshot(
        col,
        (snapshot) => {
          const remoteCrew = snapshot.docs.map(docSnap => docSnap.data() as EventCrewMember);
          this.inMemoryCrew = remoteCrew;
          onData(remoteCrew);
        },
        (error) => {
          onError?.(formatFirebaseError(error, 'Error en la suscripción de personal técnico en tiempo real.'));
        }
      );
    } catch {
      return () => {};
    }
  }

  async saveCrewMembers(members: EventCrewMember[]): Promise<void> {
    const previousCrew = this.inMemoryCrew;
    const knownIds = previousCrew.map(c => c.id);
    this.inMemoryCrew = members;
    try {
      const col = collection(db, 'crew');
      await syncCollectionWithBatch(db, col, members, knownIds);
    } catch (err) {
      this.inMemoryCrew = previousCrew;
      throw new Error(formatFirebaseError(err, 'Error al guardar el directorio de personal técnico.'));
    }
  }

  async saveCrewMember(member: EventCrewMember): Promise<EventCrewMember> {
    const previousCrew = this.inMemoryCrew;
    const index = previousCrew.findIndex(c => c.id === member.id);
    if (index >= 0) {
      const next = [...previousCrew];
      next[index] = member;
      this.inMemoryCrew = next;
    } else {
      this.inMemoryCrew = [member, ...previousCrew];
    }
    try {
      const col = collection(db, 'crew');
      await setDoc(doc(col, member.id), cleanFirestorePayload(member), { merge: true });
      return member;
    } catch (err) {
      this.inMemoryCrew = previousCrew;
      throw new Error(formatFirebaseError(err, 'Error al guardar el miembro del equipo en Firestore.'));
    }
  }

  async deleteCrewMember(id: string): Promise<void> {
    const previousCrew = this.inMemoryCrew;
    this.inMemoryCrew = previousCrew.filter(c => c.id !== id);
    try {
      const col = collection(db, 'crew');
      await deleteDoc(doc(col, id));
    } catch (err) {
      this.inMemoryCrew = previousCrew;
      throw new Error(formatFirebaseError(err, 'Error al eliminar el miembro del equipo en Firestore.'));
    }
  }
}
