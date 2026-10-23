import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from './authSchema';

describe('Auth Schemas Validation Suite', () => {
  describe('loginSchema', () => {
    it('debe validar credenciales correctas', () => {
      const valid = {
        email: 'juan@metodicah.com',
        password: 'password123',
        rememberMe: true
      };
      const result = loginSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('juan@metodicah.com');
        expect(result.data.rememberMe).toBe(true);
      }
    });

    it('debe fallar si el email está vacío o tiene formato inválido', () => {
      const emptyResult = loginSchema.safeParse({ email: '', password: 'password123' });
      expect(emptyResult.success).toBe(false);

      const invalidEmail = loginSchema.safeParse({ email: 'no-es-un-email', password: 'password123' });
      expect(invalidEmail.success).toBe(false);
    });

    it('debe fallar si la contraseña tiene menos de 6 caracteres', () => {
      const result = loginSchema.safeParse({
        email: 'juan@metodicah.com',
        password: '123'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('password'))).toBe(true);
      }
    });

    it('admite rememberMe como opcional', () => {
      const result = loginSchema.safeParse({
        email: 'operador@audio.com',
        password: 'password123'
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.rememberMe).toBeUndefined();
      }
    });
  });

  describe('registerSchema', () => {
    it('debe validar un registro de productora completo y válido', () => {
      const validData = {
        companyName: 'Sonido & Escenarios S.A.',
        name: 'Carlos Sonido',
        email: 'carlos@sonido.com',
        specialty: 'FOH Audio & Procesamiento',
        password: 'mypassword123',
        confirmPassword: 'mypassword123',
        terms: true
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('debe fallar si el nombre de la productora está vacío', () => {
      const result = registerSchema.safeParse({
        companyName: '',
        name: 'Carlos Sonido',
        email: 'carlos@sonido.com',
        password: 'mypassword123',
        confirmPassword: 'mypassword123',
        terms: true
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('companyName'))).toBe(true);
      }
    });

    it('debe fallar si el nombre tiene menos de 2 caracteres', () => {
      const result = registerSchema.safeParse({
        companyName: 'Sonido Pro',
        name: 'A',
        email: 'carlos@sonido.com',
        password: 'mypassword123',
        confirmPassword: 'mypassword123',
        terms: true
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('name'))).toBe(true);
      }
    });

    it('debe fallar si las contraseñas no coinciden', () => {
      const result = registerSchema.safeParse({
        companyName: 'Sonido Pro',
        name: 'Carlos Sonido',
        email: 'carlos@sonido.com',
        password: 'mypassword123',
        confirmPassword: 'otraContraseñaDistinta',
        terms: true
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.message.includes('no coinciden'))).toBe(true);
      }
    });

    it('debe fallar si no se aceptan los términos y condiciones', () => {
      const result = registerSchema.safeParse({
        companyName: 'Sonido Pro',
        name: 'Carlos Sonido',
        email: 'carlos@sonido.com',
        password: 'mypassword123',
        confirmPassword: 'mypassword123',
        terms: false
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.path.includes('terms'))).toBe(true);
      }
    });
  });
});
