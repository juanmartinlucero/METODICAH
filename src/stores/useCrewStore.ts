import { create } from 'zustand';
import type { EventCrewMember } from '../types/metodicah';
import { crewRepository } from '../services/repositories';
import { generateId } from '@/utils/idUtils';
import { getTodayLocalDateString } from '@/utils/dateUtils';
import { formatFirebaseError } from '@/utils/firebaseErrors';

interface CrewState {
  crewMembers: EventCrewMember[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;

  // Actions
  loadCrewMembers: () => Promise<void>;
  subscribeCrewMembers: () => () => void;
  addCrewMember: (newMemberData: Omit<EventCrewMember, 'id' | 'userId'>) => EventCrewMember;
  addCrewMembersBulk: (newMembersList: Omit<EventCrewMember, 'id' | 'userId'>[]) => void;
  updateCrewMember: (updatedMember: EventCrewMember) => void;
  deleteCrewMember: (memberId: string) => void;
  getCrewMemberById: (memberId: string) => EventCrewMember | undefined;
}

export const useCrewStore = create<CrewState>((set, get) => ({
  crewMembers: [],
  isLoading: false,
  isSyncing: false,
  error: null,

  loadCrewMembers: async () => {
    set({ isLoading: true, error: null });
    try {
      const crewMembers = await crewRepository.getCrewMembers();
      set({ crewMembers, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: formatFirebaseError(err, 'Error al cargar equipo') });
    }
  },

  subscribeCrewMembers: () => {
    if (!crewRepository.subscribeCrewMembers) return () => {};
    return crewRepository.subscribeCrewMembers(
      (crewMembers) => {
        if (!get().isSyncing) {
          set({ crewMembers, isLoading: false });
        }
      },
      (errorMsg) => {
        set({ error: errorMsg, isLoading: false });
      }
    );
  },

  addCrewMember: (newMemberData) => {
    const previous = get().crewMembers;
    const newId = generateId('crew');
    const newUserId = generateId('usr');
    const newMember: EventCrewMember = {
      ...newMemberData,
      id: newId,
      userId: newUserId,
      createdAt: newMemberData.createdAt || getTodayLocalDateString()
    };
    const updated = [newMember, ...previous];
    set({ crewMembers: updated, isSyncing: true, error: null });

    crewRepository.saveCrewMembers(updated)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({ 
        crewMembers: previous, 
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al guardar miembro')
      }));

    return newMember;
  },

  addCrewMembersBulk: (newMembersList) => {
    const previous = get().crewMembers;
    const now = getTodayLocalDateString();
    const newMembers: EventCrewMember[] = newMembersList.map(m => ({
      ...m,
      id: generateId('crew'),
      userId: generateId('usr'),
      createdAt: m.createdAt || now
    }));
    const updated = [...newMembers, ...previous];
    set({ crewMembers: updated, isSyncing: true, error: null });

    crewRepository.saveCrewMembers(updated)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({ 
        crewMembers: previous, 
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al importar equipo')
      }));
  },

  updateCrewMember: (updatedMember) => {
    const previous = get().crewMembers;
    const updated = previous.map(c => c.id === updatedMember.id ? {
      ...updatedMember,
      createdAt: updatedMember.createdAt || c.createdAt
    } : c);
    set({ crewMembers: updated, isSyncing: true, error: null });

    crewRepository.saveCrewMembers(updated)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({ 
        crewMembers: previous, 
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al actualizar miembro')
      }));
  },

  deleteCrewMember: (memberId) => {
    const previous = get().crewMembers;
    const updated = previous.filter(c => c.id !== memberId);
    set({ crewMembers: updated, isSyncing: true, error: null });

    crewRepository.saveCrewMembers(updated)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({ 
        crewMembers: previous, 
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al eliminar miembro')
      }));
  },

  getCrewMemberById: (memberId) => {
    return get().crewMembers.find(c => c.id === memberId);
  }
}));

// Hydrate from repository on startup
void useCrewStore.getState().loadCrewMembers();
