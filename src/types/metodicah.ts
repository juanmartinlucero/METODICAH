export type GlobalRole = 'admin' | 'team_member' | 'guest';

export interface EventStageConfig {
  id: string;
  label: string;
  color: string;
  isSystem?: boolean;
}

export type EventStage = string;

export interface SupplierCategoryConfig {
  id: string;
  label: string;
  color: string;
}

export type SupplierCategory = 
  | 'audio' 
  | 'lighting' 
  | 'video' 
  | 'catering' 
  | 'rigging' 
  | 'logistics' 
  | 'security' 
  | 'venue' 
  | 'other'
  | (string & {});

export type TimingStatus = 'pending' | 'in_progress' | 'completed' | 'delayed';

export type ProcessNodeStatus = 'pending' | 'active' | 'completed' | 'blocked';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  globalRole: GlobalRole;
  accountId?: string;
  companyName?: string;
  avatarUrl?: string;
  phone?: string;
  specialty?: string;
  bio?: string;
  location?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
}

export type ClientType = 'empresa' | 'persona';

export interface Client {
  id: string;
  clientType?: ClientType; // 'empresa' | 'persona' (defaults to 'empresa' for backwards compatibility)
  
  // Nombre del contacto principal (para Empresa) o Nombre completo (para Persona)
  name: string;
  
  // Específicos de Empresa
  company?: string; // Razón Social
  fantasyName?: string; // Nombre Comercial / Marca
  contactRole?: string; // Cargo del contacto (ej: Brand Manager)
  industry?: string; // Rubro / Industria (Tecnología, Moda, etc.)
  website?: string; // URL web o LinkedIn
  billingContactName?: string; // Contacto de Facturación / Administración
  billingContactEmail?: string; // Email para envío de facturas
  paymentTerms?: string; // Términos de pago habituales (ej: 30 días, 50% anticipo)
  supplierRequirements?: string; // Requisitos de ingreso de proveedores (ART, Seguros, EPP)
  
  // Específicos de Persona
  documentNumber?: string; // DNI / Pasaporte / Cédula
  birthDate?: string; // Fecha de Nacimiento / Aniversario
  frequentEventType?: string; // Tipo de evento frecuente (Bodas, Cumpleaños, Privados)
  preferences?: string; // Requerimientos y preferencias especiales (catering, VIP)
  
  // Datos Fiscales y Domicilio (Comunes a ambos)
  taxId?: string; // CUIT / CUIL / Tax ID
  taxCondition?: string; // Responsable Inscripto, Monotributista, Consumidor Final, Exento
  address?: string; // Calle, número, piso/depto
  city?: string; // Ciudad / Localidad
  state?: string; // Provincia / Estado
  zipCode?: string; // Código Postal
  
  // Contacto y Canales Comunes
  email: string;
  phone: string;
  
  // Metadatos
  notes?: string;
  activeEventsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Supplier {
  id: string;
  name: string; // Nombre Comercial / Fantasía
  company: string; // Razón Social
  category: SupplierCategory;
  
  // Datos Fiscales & Ubicación
  taxId?: string; // CUIT
  taxCondition?: string; // Condición IVA
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  
  // Contacto Directo & Canales
  contactName?: string;
  contactRole?: string;
  email: string;
  phone: string;
  emergencyPhone?: string;
  website?: string;
  
  // Técnica & Equipamiento
  equipmentHighlights?: string; // Marcas y equipamiento insignia (ej: L-Acoustics, GrandMA3, Layher)
  
  // Facturación & Términos
  billingEmail?: string;
  paymentTerms?: string;
  
  // Metadatos
  notes?: string;
  activeEventsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export type CrewContractType = 'staff_interno' | 'freelancer';
export type CrewSeniority = 'lead' | 'senior' | 'semi_senior' | 'junior';

export interface EventCrewMember {
  id: string;
  userId: string;
  userName: string;
  
  // Identificación
  documentNumber?: string; // DNI / Pasaporte
  taxId?: string; // CUIL
  birthDate?: string;
  avatarUrl?: string;
  
  // Perfil Técnico & Contratación
  type?: CrewContractType;
  sector: string;
  roleInEvent: string;
  seniority?: CrewSeniority;
  
  // Canales de Contacto & Emergencia
  userEmail: string;
  phone?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  city?: string;
  
  // Seguridad & Backstage
  artInsurance?: string; // Aseguradora ART / Seguro de Accidentes
  clothingSize?: string; // Talle indumentaria (S, M, L, XL, XXL)
  dietaryRestrictions?: string; // Restricciones alimentarias (Celíaco, Vegano, etc.)
  
  // Metadatos & Trazabilidad
  notes?: string;
  activeEventsCount?: number;
  hasSystemAccess?: boolean;
  globalRole?: GlobalRole;
  createdAt?: string;
}

export interface EventItem {
  id: string;
  code: string;
  
  // 1. Título*
  title: string;
  
  // 2. Fecha del evento*
  date: string;
  
  // 3. Venue*
  venue: string;
  
  // 4. Ubicación*
  location: string;
  
  // 5. Cliente*
  clientId: string;
  clientName: string;
  
  // 6. Rango horario del evento*
  timeRange: {
    startTime: string; // ej: "18:00"
    endTime: string;   // ej: "23:30"
  };
  
  // 7. Cantidad de asistentes
  attendeesCount?: number;
  
  // 8. Fecha de scouting (visita técnica)
  scoutingDate?: string;
  
  // 9. Fecha de deploy (envío de presupuesto al cliente)
  deployDate?: string;
  
  // 10. Scope
  scope?: string[];
  
  // 11. Crew (IDs de los miembros de equipo)
  crewIds?: string[];
  
  // 12. Resumen del proyecto
  summary?: string;
  
  // 13. Third Parties Involved (viñetas de terceros)
  thirdPartiesInvolved?: string[];
  
  // 14. Client Preferences (viñetas de requerimientos y preferencias)
  clientPreferences?: string[];
  
  // 15. Concepto
  concept?: string;

  // Etapa del Evento (Configurable)
  stageId: string;
  
  // Metadatos
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimingItem {
  id: string;
  eventId: string;
  timeStart: string; // HH:mm format
  timeEnd: string;   // HH:mm format
  title: string;
  sector: string;
  responsible: string;
  supplierId?: string;
  supplierName?: string;
  status: TimingStatus;
  notes?: string;
  order: number;
}

export type AccreditationStatus = 'solicitada' | 'aprobada' | 'impresa' | 'en_sitio' | 'revocada';

export type AccreditationAccessLevel = 'ALL ACCESS' | 'STAFF' | 'GUEST';

export interface AccreditationItem {
  id: string;
  eventId: string;
  firstName: string;
  lastName: string;
  documentNumber: string; // DNI / Pasaporte
  role: string;          // ej. Iluminador, Sonidista, Rigger, Seguridad
  company: string;       // Empresa o Proveedor
  accessLevel: AccreditationAccessLevel;
  status: AccreditationStatus;
  qrCode: string;        // Hash único de verificación
  checkInAt?: string | null;  // ISO string de ingreso al predio
  checkOutAt?: string | null; // ISO string de salida
  checkInBy?: string | null;  // Nombre o ID de quien registró el ingreso
  insuranceVerified?: boolean; // ART / Seguro validado
  emergencyPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccreditationStats {
  total: number;
  enSitioCount: number;
  headcountPercentage: number;
  aprobadasCount: number;
  solicitadasCount: number;
  allAccessCount: number;
  staffCount: number;
  guestCount: number;
  artVerificadaCount: number;
  artFaltanteCount: number;
}

export interface ProcessNode {
  id: string;
  eventId?: string;
  workflowId?: string;
  label: string;
  category: string;
  predecessorIds: string[];
  successorIds: string[];
  status: ProcessNodeStatus;
  estimatedHours: number;
  assignedTo: string;
  position?: { x: number; y: number };
}

export interface AuditLog {
  id: string;
  eventId?: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export type DateFormatPattern = 
  | 'DD/MM/YYYY'
  | 'YYYY-MM-DD'
  | 'MM/DD/YYYY'
  | 'DD MMM YYYY'
  | 'DD de MMMM de YYYY'
  | 'dddd DD de MMMM de YYYY';

export interface DateFormatOption {
  value: DateFormatPattern;
  label: string;
  example: string;
  description: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  companyName: string;
  name: string;
  email: string;
  password?: string;
  specialty?: string;
  globalRole?: GlobalRole;
  phone?: string;
}

export interface RolePermissionConfig {
  id: string;
  permission: string;
  category: string;
  admin: boolean;
  team: boolean;
  guest: boolean;
}

export interface CreateTeamMemberData {
  name: string;
  email: string;
  password: string;
  globalRole: GlobalRole;
  specialty?: string;
  phone?: string;
}

export interface AuthSession {
  user: UserProfile;
  token?: string;
  expiresAt?: string;
}

export interface WorkflowDefinition {
  id: string;
  accountId?: string;
  name: string;
  description?: string;
  category?: string;
  isDefault?: boolean;
  nodes: ProcessNode[];
  createdAt: string;
  updatedAt: string;
}

export type CreateWorkflowData = Omit<WorkflowDefinition, 'id' | 'createdAt' | 'updatedAt'>;

