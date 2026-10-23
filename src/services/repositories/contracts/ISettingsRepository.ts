import type { 
  EventStageConfig, 
  SupplierCategoryConfig, 
  UserProfile, 
  DateFormatPattern,
  RolePermissionConfig
} from '@/types/metodicah';

export interface ISettingsRepository {
  getCompanyLogo(): Promise<string | null>;
  saveCompanyLogo(logo: string | null): Promise<void>;
  getStages(): Promise<EventStageConfig[]>;
  saveStages(stages: EventStageConfig[]): Promise<void>;
  getConfiguredScopes(): Promise<string[]>;
  saveConfiguredScopes(scopes: string[]): Promise<void>;
  getSupplierCategories(): Promise<SupplierCategoryConfig[]>;
  saveSupplierCategories(categories: SupplierCategoryConfig[]): Promise<void>;
  getCrewSectors(): Promise<string[]>;
  saveCrewSectors(sectors: string[]): Promise<void>;
  getUserProfile(): Promise<UserProfile>;
  saveUserProfile(user: UserProfile): Promise<void>;
  getDateFormat(): Promise<DateFormatPattern>;
  saveDateFormat(format: DateFormatPattern): Promise<void>;
  getRolePermissions(): Promise<RolePermissionConfig[]>;
  saveRolePermissions(permissions: RolePermissionConfig[]): Promise<void>;
}
