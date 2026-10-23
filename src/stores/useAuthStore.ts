import { create } from 'zustand';
import type { LoginCredentials, RegisterData, UserProfile, CreateTeamMemberData } from '@/types/metodicah';
import { authRepository } from '@/services/repositories';
import { useSettingsStore } from './useSettingsStore';
import { formatFirebaseError } from '@/utils/firebaseErrors';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Multi-user Team state
  teamMembers: UserProfile[];
  isLoadingMembers: boolean;

  // Actions
  checkAuth: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: UserProfile | null) => void;

  // Team Actions
  loadTeamMembers: () => Promise<void>;
  addTeamMember: (data: CreateTeamMemberData) => Promise<boolean>;
  updateTeamMember: (memberId: string, data: Partial<UserProfile>) => Promise<boolean>;
  removeTeamMember: (memberId: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  teamMembers: [],
  isLoadingMembers: false,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: Boolean(user),
      isLoading: false
    });
    if (user) {
      useSettingsStore.getState().updateUserProfile(user);
      if (user.accountId) {
        void get().loadTeamMembers();
      }
    } else {
      set({ teamMembers: [] });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await authRepository.getCurrentUser();
      get().setUser(user);
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: formatFirebaseError(err, 'Error al verificar sesión')
      });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authRepository.login(credentials);
      get().setUser(user);
      return true;
    } catch (err) {
      set({
        isLoading: false,
        error: formatFirebaseError(err, 'Error al iniciar sesión')
      });
      return false;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authRepository.register(data);
      get().setUser(user);
      return true;
    } catch (err) {
      set({
        isLoading: false,
        error: formatFirebaseError(err, 'Error al registrar productora')
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authRepository.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        teamMembers: []
      });
    } catch (err) {
      set({
        isLoading: false,
        error: formatFirebaseError(err, 'Error al cerrar sesión')
      });
    }
  },

  clearError: () => set({ error: null }),

  // Team Management
  loadTeamMembers: async () => {
    const accountId = get().user?.accountId;
    if (!accountId) return;

    set({ isLoadingMembers: true });
    try {
      const members = await authRepository.getTeamMembers(accountId);
      set({ teamMembers: members, isLoadingMembers: false });
    } catch (err) {
      console.warn('[useAuthStore] Error cargando integrantes del equipo:', err);
      set({ isLoadingMembers: false });
    }
  },

  addTeamMember: async (data: CreateTeamMemberData) => {
    const accountId = get().user?.accountId;
    if (!accountId) {
      set({ error: 'No se encontró la cuenta de productora asociada.' });
      return false;
    }

    set({ isLoadingMembers: true, error: null });
    try {
      await authRepository.addTeamMember(accountId, data);
      await get().loadTeamMembers();
      return true;
    } catch (err) {
      set({
        isLoadingMembers: false,
        error: formatFirebaseError(err, 'Error al dar de alta integrante')
      });
      return false;
    }
  },

  updateTeamMember: async (memberId: string, data: Partial<UserProfile>) => {
    const accountId = get().user?.accountId;
    if (!accountId) return false;

    set({ isLoadingMembers: true, error: null });
    try {
      await authRepository.updateTeamMember(accountId, memberId, data);
      await get().loadTeamMembers();
      return true;
    } catch (err) {
      set({
        isLoadingMembers: false,
        error: formatFirebaseError(err, 'Error al actualizar integrante')
      });
      return false;
    }
  },

  removeTeamMember: async (memberId: string) => {
    const accountId = get().user?.accountId;
    if (!accountId) return false;

    set({ isLoadingMembers: true, error: null });
    try {
      await authRepository.removeTeamMember(accountId, memberId);
      await get().loadTeamMembers();
      return true;
    } catch (err) {
      set({
        isLoadingMembers: false,
        error: formatFirebaseError(err, 'Error al dar de baja integrante')
      });
      return false;
    }
  }
}));

// Escuchar cambios de autenticación del repositorio Firebase
authRepository.onAuthStateChanged((user) => {
  useAuthStore.getState().setUser(user);
});
