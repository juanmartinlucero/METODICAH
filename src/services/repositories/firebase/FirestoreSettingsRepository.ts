import type { 
  EventStageConfig, 
  SupplierCategoryConfig, 
  UserProfile, 
  DateFormatPattern,
  RolePermissionConfig
} from '@/types/metodicah';
import { 
  DEFAULT_EVENT_STAGES, 
  DEFAULT_CONFIGURED_SCOPES, 
  INITIAL_USER,
  DEFAULT_ROLE_PERMISSIONS
} from '@/services/mockData';
import { DEFAULT_SUPPLIER_CATEGORIES } from '@/utils/supplierUtils';
import { DEFAULT_CREW_SECTORS } from '@/utils/crewUtils';
import { DEFAULT_DATE_FORMAT } from '@/utils/dateUtils';
import type { ISettingsRepository } from '../contracts/ISettingsRepository';
import { db } from '@/services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { cleanFirestorePayload } from '@/utils/cleanFirestorePayload';
import { formatFirebaseError } from '@/utils/firebaseErrors';

export class FirestoreSettingsRepository implements ISettingsRepository {
  private inMemoryLogo: string | null = null;
  private inMemoryStages: EventStageConfig[] = DEFAULT_EVENT_STAGES;
  private inMemoryScopes: string[] = DEFAULT_CONFIGURED_SCOPES;
  private inMemorySupplierCategories: SupplierCategoryConfig[] = DEFAULT_SUPPLIER_CATEGORIES;
  private inMemoryCrewSectors: string[] = DEFAULT_CREW_SECTORS;
  private inMemoryUserProfile: UserProfile = INITIAL_USER;
  private inMemoryDateFormat: DateFormatPattern = DEFAULT_DATE_FORMAT;
  private inMemoryPermissions: RolePermissionConfig[] = DEFAULT_ROLE_PERMISSIONS;

  async getCompanyLogo(): Promise<string | null> {
    try {
      const snap = await getDoc(doc(db, 'settings', 'companyLogo'));
      if (snap.exists() && snap.data()?.logo !== undefined) {
        this.inMemoryLogo = snap.data().logo;
      }
    } catch {
      // Fallback en memoria
    }
    return this.inMemoryLogo;
  }

  async saveCompanyLogo(logo: string | null): Promise<void> {
    const previous = this.inMemoryLogo;
    this.inMemoryLogo = logo;
    try {
      await this.syncDoc('companyLogo', { logo });
    } catch (err) {
      this.inMemoryLogo = previous;
      throw err;
    }
  }

  async getStages(): Promise<EventStageConfig[]> {
    try {
      const snap = await getDoc(doc(db, 'settings', 'eventStages'));
      if (snap.exists() && Array.isArray(snap.data()?.stages)) {
        this.inMemoryStages = snap.data().stages;
      }
    } catch {
      // Fallback en memoria
    }
    return this.inMemoryStages;
  }

  async saveStages(stages: EventStageConfig[]): Promise<void> {
    const previous = this.inMemoryStages;
    this.inMemoryStages = stages;
    try {
      await this.syncDoc('eventStages', { stages });
    } catch (err) {
      this.inMemoryStages = previous;
      throw err;
    }
  }

  async getConfiguredScopes(): Promise<string[]> {
    try {
      const snap = await getDoc(doc(db, 'settings', 'configuredScopes'));
      if (snap.exists() && Array.isArray(snap.data()?.scopes)) {
        this.inMemoryScopes = snap.data().scopes;
      }
    } catch {
      // Fallback en memoria
    }
    return this.inMemoryScopes;
  }

  async saveConfiguredScopes(scopes: string[]): Promise<void> {
    const previous = this.inMemoryScopes;
    this.inMemoryScopes = scopes;
    try {
      await this.syncDoc('configuredScopes', { scopes });
    } catch (err) {
      this.inMemoryScopes = previous;
      throw err;
    }
  }

  async getSupplierCategories(): Promise<SupplierCategoryConfig[]> {
    try {
      const snap = await getDoc(doc(db, 'settings', 'supplierCategories'));
      if (snap.exists() && Array.isArray(snap.data()?.categories)) {
        this.inMemorySupplierCategories = snap.data().categories;
      }
    } catch {
      // Fallback en memoria
    }
    return this.inMemorySupplierCategories;
  }

  async saveSupplierCategories(categories: SupplierCategoryConfig[]): Promise<void> {
    const previous = this.inMemorySupplierCategories;
    this.inMemorySupplierCategories = categories;
    try {
      await this.syncDoc('supplierCategories', { categories });
    } catch (err) {
      this.inMemorySupplierCategories = previous;
      throw err;
    }
  }

  async getCrewSectors(): Promise<string[]> {
    try {
      const snap = await getDoc(doc(db, 'settings', 'crewSectors'));
      if (snap.exists() && Array.isArray(snap.data()?.sectors)) {
        this.inMemoryCrewSectors = snap.data().sectors;
      }
    } catch {
      // Fallback en memoria
    }
    return this.inMemoryCrewSectors;
  }

  async saveCrewSectors(sectors: string[]): Promise<void> {
    const previous = this.inMemoryCrewSectors;
    this.inMemoryCrewSectors = sectors;
    try {
      await this.syncDoc('crewSectors', { sectors });
    } catch (err) {
      this.inMemoryCrewSectors = previous;
      throw err;
    }
  }

  async getUserProfile(): Promise<UserProfile> {
    try {
      const snap = await getDoc(doc(db, 'settings', 'userProfile'));
      if (snap.exists() && snap.data()) {
        this.inMemoryUserProfile = snap.data() as UserProfile;
      }
    } catch {
      // Fallback en memoria
    }
    return this.inMemoryUserProfile;
  }

  async saveUserProfile(user: UserProfile): Promise<void> {
    const previous = this.inMemoryUserProfile;
    this.inMemoryUserProfile = user;
    try {
      await this.syncDoc('userProfile', user);
    } catch (err) {
      this.inMemoryUserProfile = previous;
      throw err;
    }
  }

  async getDateFormat(): Promise<DateFormatPattern> {
    try {
      const snap = await getDoc(doc(db, 'settings', 'dateFormat'));
      if (snap.exists() && snap.data()?.format) {
        this.inMemoryDateFormat = snap.data().format;
      }
    } catch {
      // Fallback en memoria
    }
    return this.inMemoryDateFormat;
  }

  async saveDateFormat(format: DateFormatPattern): Promise<void> {
    const previous = this.inMemoryDateFormat;
    this.inMemoryDateFormat = format;
    try {
      await this.syncDoc('dateFormat', { format });
    } catch (err) {
      this.inMemoryDateFormat = previous;
      throw err;
    }
  }

  async getRolePermissions(): Promise<RolePermissionConfig[]> {
    try {
      const snap = await getDoc(doc(db, 'settings', 'rolePermissions'));
      if (snap.exists() && Array.isArray(snap.data()?.permissions)) {
        this.inMemoryPermissions = snap.data().permissions;
      }
    } catch {
      // Fallback en memoria
    }
    return this.inMemoryPermissions;
  }

  async saveRolePermissions(permissions: RolePermissionConfig[]): Promise<void> {
    const previous = this.inMemoryPermissions;
    this.inMemoryPermissions = permissions;
    try {
      await this.syncDoc('rolePermissions', { permissions });
    } catch (err) {
      this.inMemoryPermissions = previous;
      throw err;
    }
  }

  private async syncDoc(docId: string, data: object): Promise<void> {
    try {
      await setDoc(doc(db, 'settings', docId), cleanFirestorePayload(data), { merge: true });
    } catch (err) {
      throw new Error(formatFirebaseError(err, 'Error al sincronizar la configuración en Firestore.'));
    }
  }
}
