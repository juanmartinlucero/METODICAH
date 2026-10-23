import { create } from 'zustand';
import type { 
  EventStageConfig, 
  SupplierCategoryConfig, 
  UserProfile, 
  DateFormatPattern,
  RolePermissionConfig
} from '../types/metodicah';
import { settingsRepository } from '../services/repositories';
import { 
  DEFAULT_EVENT_STAGES, 
  DEFAULT_CONFIGURED_SCOPES, 
  INITIAL_USER,
  DEFAULT_ROLE_PERMISSIONS
} from '../services/mockData';
import { DEFAULT_SUPPLIER_CATEGORIES } from '../utils/supplierUtils';
import { DEFAULT_CREW_SECTORS } from '../utils/crewUtils';
import { DEFAULT_DATE_FORMAT } from '../utils/dateUtils';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { formatFirebaseError } from '@/utils/firebaseErrors';

interface SettingsState {
  companyLogo: string | null;
  stages: EventStageConfig[];
  configuredScopes: string[];
  supplierCategories: SupplierCategoryConfig[];
  crewSectors: string[];
  currentUser: UserProfile;
  dateFormat: DateFormatPattern;
  rolePermissions: RolePermissionConfig[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;

  // Actions
  loadSettings: () => Promise<void>;
  updateCompanyLogo: (logoUrl: string | null) => void;
  updateStages: (newStages: EventStageConfig[]) => void;
  updateConfiguredScopes: (newScopes: string[]) => void;
  updateSupplierCategories: (newCategories: SupplierCategoryConfig[]) => void;
  updateCrewSectors: (newSectors: string[]) => void;
  updateUserProfile: (updatedUser: Partial<UserProfile>) => void;
  updateDateFormat: (newFormat: DateFormatPattern) => void;
  updateRolePermission: (permissionId: string, role: 'admin' | 'team' | 'guest', value: boolean) => void;
  resetRolePermissions: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  companyLogo: null,
  stages: DEFAULT_EVENT_STAGES,
  configuredScopes: DEFAULT_CONFIGURED_SCOPES,
  supplierCategories: DEFAULT_SUPPLIER_CATEGORIES,
  crewSectors: DEFAULT_CREW_SECTORS,
  currentUser: INITIAL_USER,
  dateFormat: DEFAULT_DATE_FORMAT,
  rolePermissions: DEFAULT_ROLE_PERMISSIONS,
  isLoading: false,
  isSyncing: false,
  error: null,

  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const [
        companyLogo,
        stages,
        configuredScopes,
        supplierCategories,
        crewSectors,
        currentUser,
        dateFormat,
        rolePermissions
      ] = await Promise.all([
        settingsRepository.getCompanyLogo(),
        settingsRepository.getStages(),
        settingsRepository.getConfiguredScopes(),
        settingsRepository.getSupplierCategories(),
        settingsRepository.getCrewSectors(),
        settingsRepository.getUserProfile(),
        settingsRepository.getDateFormat(),
        settingsRepository.getRolePermissions()
      ]);

      set({
        companyLogo,
        stages,
        configuredScopes,
        supplierCategories,
        crewSectors,
        currentUser,
        dateFormat,
        rolePermissions,
        isLoading: false
      });
    } catch (err) {
      set({ isLoading: false, error: formatFirebaseError(err, 'Error al cargar configuraciones') });
    }
  },

  updateCompanyLogo: (logoUrl) => {
    const previous = get().companyLogo;
    set({ companyLogo: logoUrl, isSyncing: true, error: null });
    settingsRepository.saveCompanyLogo(logoUrl)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({
        companyLogo: previous,
        isSyncing: false,
        error: formatFirebaseError(err, 'Error al guardar logo')
      }));
  },

  updateStages: (newStages) => {
    const previous = get().stages;
    set({ stages: newStages, isSyncing: true, error: null });
    settingsRepository.saveStages(newStages)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({
        stages: previous,
        isSyncing: false,
        error: formatFirebaseError(err, 'Error al guardar etapas')
      }));
  },

  updateConfiguredScopes: (newScopes) => {
    const previous = get().configuredScopes;
    set({ configuredScopes: newScopes, isSyncing: true, error: null });
    settingsRepository.saveConfiguredScopes(newScopes)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({
        configuredScopes: previous,
        isSyncing: false,
        error: formatFirebaseError(err, 'Error al guardar scopes')
      }));
  },

  updateSupplierCategories: (newCategories) => {
    const previous = get().supplierCategories;
    set({ supplierCategories: newCategories, isSyncing: true, error: null });
    settingsRepository.saveSupplierCategories(newCategories)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({
        supplierCategories: previous,
        isSyncing: false,
        error: formatFirebaseError(err, 'Error al guardar rubros')
      }));
  },

  updateCrewSectors: (newSectors) => {
    const previous = get().crewSectors;
    set({ crewSectors: newSectors, isSyncing: true, error: null });
    settingsRepository.saveCrewSectors(newSectors)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({
        crewSectors: previous,
        isSyncing: false,
        error: formatFirebaseError(err, 'Error al guardar sectores')
      }));
  },

  updateUserProfile: (updatedUser) => {
    const previous = get().currentUser;
    const merged = { ...previous, ...updatedUser };
    set({ currentUser: merged, isSyncing: true, error: null });
    settingsRepository.saveUserProfile(merged)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({
        currentUser: previous,
        isSyncing: false,
        error: formatFirebaseError(err, 'Error al guardar perfil')
      }));
  },

  updateDateFormat: (newFormat) => {
    const previous = get().dateFormat;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.SETTINGS.DATE_FORMAT, newFormat);
    }
    set({ dateFormat: newFormat, isSyncing: true, error: null });
    settingsRepository.saveDateFormat(newFormat)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({
        dateFormat: previous,
        isSyncing: false,
        error: formatFirebaseError(err, 'Error al guardar formato fecha')
      }));
  },

  updateRolePermission: (permissionId, role, value) => {
    const previous = get().rolePermissions;
    const updated = previous.map(p => {
      if (p.id === permissionId) {
        return { ...p, [role]: value };
      }
      return p;
    });
    set({ rolePermissions: updated, isSyncing: true, error: null });
    settingsRepository.saveRolePermissions(updated)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({
        rolePermissions: previous,
        isSyncing: false,
        error: formatFirebaseError(err, 'Error al guardar permisos')
      }));
  },

  resetRolePermissions: () => {
    const previous = get().rolePermissions;
    set({ rolePermissions: DEFAULT_ROLE_PERMISSIONS, isSyncing: true, error: null });
    settingsRepository.saveRolePermissions(DEFAULT_ROLE_PERMISSIONS)
      .then(() => set({ isSyncing: false }))
      .catch(err => set({
        rolePermissions: previous,
        isSyncing: false,
        error: formatFirebaseError(err, 'Error al restablecer permisos')
      }));
  }
}));

// Hydrate from repository on startup
void useSettingsStore.getState().loadSettings();
