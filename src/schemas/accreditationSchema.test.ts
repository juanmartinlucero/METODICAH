import { describe, it, expect } from 'vitest';
import { accreditationSchema } from './accreditationSchema';

describe('Accreditation Schema Validation', () => {
  const validData = {
    firstName: 'Santiago',
    lastName: 'Del Solar',
    documentNumber: '35123987',
    role: 'Técnico de Sonido',
    company: 'Sonar Live',
    accessLevel: 'STAFF',
    status: 'aprobada',
    insuranceVerified: true,
    emergencyPhone: '+54 9 11 5555-1234',
    notes: 'Ingreso por portón 2 con equipamiento'
  };

  it('valida exitosamente un payload completo y correcto', () => {
    const result = accreditationSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.firstName).toBe('Santiago');
      expect(result.data.accessLevel).toBe('STAFF');
    }
  });

  it('permite únicamente los 3 niveles de acceso solicitados: ALL ACCESS, STAFF, GUEST', () => {
    const allAccessResult = accreditationSchema.safeParse({ ...validData, accessLevel: 'ALL ACCESS' });
    const staffResult = accreditationSchema.safeParse({ ...validData, accessLevel: 'STAFF' });
    const guestResult = accreditationSchema.safeParse({ ...validData, accessLevel: 'GUEST' });
    const invalidResult = accreditationSchema.safeParse({ ...validData, accessLevel: 'VIP_UNAUTHORIZED' });

    expect(allAccessResult.success).toBe(true);
    expect(staffResult.success).toBe(true);
    expect(guestResult.success).toBe(true);
    expect(invalidResult.success).toBe(false);
  });

  it('rechaza registros con nombre o apellido demasiado cortos', () => {
    const invalidName = accreditationSchema.safeParse({ ...validData, firstName: 'A' });
    expect(invalidName.success).toBe(false);
    if (!invalidName.success) {
      expect(invalidName.error.issues[0].message).toContain('al menos 2 caracteres');
    }
  });

  it('rechaza documentos vacíos o con formato inválido', () => {
    const emptyDoc = accreditationSchema.safeParse({ ...validData, documentNumber: '' });
    expect(emptyDoc.success).toBe(false);

    const invalidDoc = accreditationSchema.safeParse({ ...validData, documentNumber: '123$!%' });
    expect(invalidDoc.success).toBe(false);
  });
});
