import { describe, it, expect } from 'vitest';
import { 
  clientFormSchema, 
  supplierFormSchema, 
  crewFormSchema, 
  eventFormSchema, 
  supplierCategorySchema, 
  crewDepartmentSchema, 
  eventScopeSchema, 
  eventStageSchema 
} from './index';
import { timingFormSchema } from '../components/event-detail/timingSchema';
import { profileFormSchema } from '../components/profile/profileSchema';

describe('Zod Schemas Validation (Canonical Schemas Layer)', () => {
  describe('clientFormSchema', () => {
    it('validates a valid client', () => {
      const result = clientFormSchema.safeParse({
        clientType: 'empresa',
        name: 'Martín Contacto',
        company: 'Empresa SA',
        email: 'contacto@empresa.com',
        phone: '1155550000'
      });
      expect(result.success).toBe(true);
    });

    it('fails when email is invalid or required fields are missing', () => {
      const result = clientFormSchema.safeParse({
        clientType: 'empresa',
        name: '',
        email: 'invalid-email',
        phone: ''
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.format();
        expect(errors.name?._errors.length).toBeGreaterThan(0);
        expect(errors.email?._errors.length).toBeGreaterThan(0);
      }
    });

    it('requires company name when clientType is empresa', () => {
      const result = clientFormSchema.safeParse({
        clientType: 'empresa',
        name: 'Carlos',
        email: 'carlos@empresa.com',
        phone: '123456',
        company: ''
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('company'))).toBe(true);
      }
    });
  });

  describe('supplierFormSchema', () => {
    it('validates a complete and correct supplier', () => {
      const result = supplierFormSchema.safeParse({
        name: 'Audio Pro SRL',
        category: 'Sonido',
        taxId: '',
        taxCondition: 'Responsable Inscripto',
        email: 'ventas@audiopro.com',
        phone: '1144445555',
        state: 'Buenos Aires'
      });
      expect(result.success).toBe(true);
    });

    it('rejects when name, category, or email are invalid', () => {
      const result = supplierFormSchema.safeParse({
        name: '',
        category: '',
        taxId: '',
        taxCondition: 'Monotributo',
        email: 'not-an-email',
        phone: '',
        state: 'CABA'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('crewFormSchema', () => {
    it('validates a correct crew member', () => {
      const result = crewFormSchema.safeParse({
        userName: 'Martín Stagehand',
        type: 'freelancer',
        sector: 'Iluminación',
        taxId: '',
        roleInEvent: 'Operador Móviles',
        seniority: 'senior',
        userEmail: 'martin@crew.com',
        clothingSize: 'L',
        dietaryRestrictions: 'Ninguna'
      });
      expect(result.success).toBe(true);
    });

    it('requires customSector when sector is otro', () => {
      const invalid = crewFormSchema.safeParse({
        userName: 'Técnico Especial',
        type: 'freelancer',
        sector: 'otro',
        customSector: '',
        taxId: '',
        roleInEvent: 'Especialista Láser',
        seniority: 'senior',
        userEmail: 'laser@crew.com',
        clothingSize: 'M',
        dietaryRestrictions: 'Vegetariano'
      });
      expect(invalid.success).toBe(false);

      const valid = crewFormSchema.safeParse({
        userName: 'Técnico Especial',
        type: 'freelancer',
        sector: 'otro',
        customSector: 'Efectos Especiales Láser',
        taxId: '',
        roleInEvent: 'Especialista Láser',
        seniority: 'senior',
        userEmail: 'laser@crew.com',
        clothingSize: 'M',
        dietaryRestrictions: 'Vegetariano'
      });
      expect(valid.success).toBe(true);
    });

    it('validates crew member with system access enabled and globalRole', () => {
      const valid = crewFormSchema.safeParse({
        userName: 'Santiago Director',
        type: 'staff_interno',
        sector: 'Producción',
        roleInEvent: 'Director Técnico',
        userEmail: 'santiago@crew.com',
        hasSystemAccess: true,
        globalRole: 'team_member',
        password: 'SecurePassword123'
      });
      expect(valid.success).toBe(true);
    });

    it('fails when system access is enabled and password has fewer than 6 characters', () => {
      const invalid = crewFormSchema.safeParse({
        userName: 'Santiago Director',
        type: 'staff_interno',
        sector: 'Producción',
        roleInEvent: 'Director Técnico',
        userEmail: 'santiago@crew.com',
        hasSystemAccess: true,
        globalRole: 'team_member',
        password: '123'
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe('eventFormSchema', () => {
    it('validates a complete event', () => {
      const result = eventFormSchema.safeParse({
        title: 'Festival Primavera 2026',
        clientId: 'cli_1',
        venue: 'Parque de la Ciudad',
        location: 'Buenos Aires',
        date: '2026-09-21',
        startTime: '14:00',
        endTime: '23:00',
        scope: ['Audio', 'Luces'],
        crewIds: ['usr_1'],
        thirdParties: [],
        clientPreferences: []
      });
      expect(result.success).toBe(true);
    });

    it('fails when title or date are missing', () => {
      const result = eventFormSchema.safeParse({
        title: '',
        clientId: '',
        venue: '',
        location: '',
        date: '',
        startTime: '',
        endTime: '',
        scope: [],
        crewIds: [],
        thirdParties: [],
        clientPreferences: []
      });
      expect(result.success).toBe(false);
    });
  });

  describe('timingFormSchema', () => {
    it('validates valid timing entry with correct hour range', () => {
      const result = timingFormSchema.safeParse({
        timeStart: '14:00',
        timeEnd: '15:30',
        title: 'Prueba FOH',
        sector: 'Audio',
        responsible: 'Juan Operador'
      });
      expect(result.success).toBe(true);
    });

    it('rejects when timeEnd is earlier than timeStart', () => {
      const result = timingFormSchema.safeParse({
        timeStart: '18:00',
        timeEnd: '16:00',
        title: 'Hito inválido',
        sector: 'Audio',
        responsible: 'Juan Operador'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.message.includes('igual o posterior'))).toBe(true);
      }
    });
  });

  describe('profileFormSchema', () => {
    it('validates user profile data', () => {
      const result = profileFormSchema.safeParse({
        name: 'Juan Martín',
        email: 'juan@metodicah.com',
        phone: '+5491155550199',
        specialty: 'Director Técnico'
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email address', () => {
      const result = profileFormSchema.safeParse({
        name: 'Juan Martín',
        email: 'not-an-email'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('settingsSchemas', () => {
    it('validates supplier category schema', () => {
      expect(supplierCategorySchema.safeParse({ label: 'Audio', color: '#ff0000' }).success).toBe(true);
      expect(supplierCategorySchema.safeParse({ label: '', color: '#ff0000' }).success).toBe(false);
    });

    it('validates crew department schema', () => {
      expect(crewDepartmentSchema.safeParse({ name: 'Dirección' }).success).toBe(true);
      expect(crewDepartmentSchema.safeParse({ name: '' }).success).toBe(false);
    });

    it('validates event scope schema', () => {
      expect(eventScopeSchema.safeParse({ name: 'Streaming 4K' }).success).toBe(true);
      expect(eventScopeSchema.safeParse({ name: '   ' }).success).toBe(false);
    });

    it('validates event stage schema', () => {
      expect(eventStageSchema.safeParse({ label: 'Post-Producción', color: '#10b981' }).success).toBe(true);
      expect(eventStageSchema.safeParse({ label: '', color: '' }).success).toBe(false);
    });
  });
});
