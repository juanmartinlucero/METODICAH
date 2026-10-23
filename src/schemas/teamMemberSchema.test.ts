import { describe, it, expect } from 'vitest';
import { teamMemberSchema } from './teamMemberSchema';

describe('teamMemberSchema Validation Suite', () => {
  it('valida datos correctos para dar de alta un integrante de equipo', () => {
    const validData = {
      name: 'Lucas Iluminador',
      email: 'lucas@productora.com',
      globalRole: 'team_member' as const,
      specialty: 'Operador de Consola GrandMA3',
      phone: '+54 9 11 5555-0100',
      password: 'password123'
    };

    const result = teamMemberSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('permite rol guest (invitado/solo lectura)', () => {
    const validData = {
      name: 'Mariana Cliente',
      email: 'mariana@cliente.com',
      globalRole: 'guest' as const,
      specialty: 'Coordinación Externa',
      password: 'password123'
    };

    const result = teamMemberSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('falla si el nombre es menor a 2 caracteres o el email no es válido', () => {
    const invalidData = {
      name: 'A',
      email: 'correo-invalido',
      globalRole: 'team_member' as const,
      specialty: 'Sonido',
      password: 'password123'
    };

    const result = teamMemberSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('name'))).toBe(true);
      expect(result.error.issues.some(i => i.path.includes('email'))).toBe(true);
    }
  });

  it('falla si la contraseña provisional tiene menos de 6 caracteres', () => {
    const invalidData = {
      name: 'Martín Staff',
      email: 'martin@staff.com',
      globalRole: 'team_member' as const,
      specialty: 'Video LED',
      password: '123'
    };

    const result = teamMemberSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('password'))).toBe(true);
    }
  });
});
