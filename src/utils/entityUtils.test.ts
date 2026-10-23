import { describe, it, expect, vi } from 'vitest';
import { formatTaxId, validateTaxId, getWhatsAppLink, exportClientsToCSV } from './clientUtils';
import { getSupplierCategoryLabel, getSupplierCategoryColor, getSupplierWhatsAppLink, exportSuppliersToCSV } from './supplierUtils';
import type { Client, Supplier } from '../types/metodicah';

describe('clientUtils', () => {
  describe('formatTaxId', () => {
    it('formats 11-digit CUIT into XX-XXXXXXXX-X', () => {
      expect(formatTaxId('20301234567')).toBe('20-30123456-7');
    });

    it('handles short or partial values gracefully', () => {
      expect(formatTaxId('20')).toBe('20');
      expect(formatTaxId('203')).toBe('20-3');
      expect(formatTaxId('')).toBe('');
    });
  });

  describe('validateTaxId (Modulo 11)', () => {
    it('validates a real valid CUIT', () => {
      // 20-30123456-7 -> let's test a valid standard Argentina test CUIT
      // 20-12345678-5: 2*5 + 0*4 + 1*3 + 2*2 + 3*7 + 4*6 + 5*5 + 6*4 + 7*3 + 8*2 = 10+0+3+4+21+24+25+24+21+16 = 148. 148%11 = 5. 11-5 = 6.
      // Valid CUIT: 30-71111111-1
      expect(validateTaxId('')).toBe(true); // Empty is optional
      // 20-22222222-3: (2*5 + 0*4) + (2*3 + 2*2 + 2*7 + 2*6 + 2*5 + 2*4 + 2*3 + 2*2) = 10 + 2*(3+2+7+6+5+4+3+2) = 10 + 2*32 = 74. 74%11 = 8. 11-8 = 3.
      expect(validateTaxId('20222222223')).toBe(true);
      expect(validateTaxId('20-22222222-3')).toBe(true);
    });

    it('rejects invalid CUITs', () => {
      expect(validateTaxId('20222222224')).toBe(false); // Wrong verifier digit
      expect(validateTaxId('11111111111')).toBe(false); // Invalid prefix
      expect(validateTaxId('123')).toBe(false); // Too short
    });
  });

  describe('getWhatsAppLink', () => {
    it('builds a valid wa.me link with greeting', () => {
      const link = getWhatsAppLink('1155550199', 'Juan');
      expect(link).toContain('https://wa.me/5491155550199');
      expect(link).toContain('te%20contactamos%20desde%20el%20equipo%20de%20producci%C3%B3n%20de%20METODICAH');
    });

    it('returns empty string if phone is empty', () => {
      expect(getWhatsAppLink('')).toBe('');
    });
  });

  describe('exportClientsToCSV', () => {
    it('creates and clicks a downloadable blob anchor', () => {
      const mockClients: Client[] = [
        {
          id: 'c1',
          name: 'Empresa Test',
          email: 'test@empresa.com',
          phone: '1155550000',
          clientType: 'empresa',
          company: 'Empresa SA',
          createdAt: '2026-01-01'
        }
      ];

      const createObjectURLMock = vi.fn(() => 'blob:mock-url');
      const revokeObjectURLMock = vi.fn();
      globalThis.URL.createObjectURL = createObjectURLMock;
      globalThis.URL.revokeObjectURL = revokeObjectURLMock;

      const clickMock = vi.fn();
      vi.spyOn(document, 'createElement').mockReturnValue({
        setAttribute: vi.fn(),
        click: clickMock
      } as unknown as HTMLElement);
      vi.spyOn(document.body, 'appendChild').mockReturnValue({} as unknown as Node);
      vi.spyOn(document.body, 'removeChild').mockReturnValue({} as unknown as Node);

      exportClientsToCSV(mockClients);

      expect(createObjectURLMock).toHaveBeenCalled();
      expect(clickMock).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url');
    });
  });
});

describe('supplierUtils', () => {
  describe('categories helpers', () => {
    it('resolves category label and fallback', () => {
      expect(getSupplierCategoryLabel('audio')).toBe('Audio & Sonido FOH');
      expect(getSupplierCategoryLabel('lighting')).toBe('Iluminación & FX');
      expect(getSupplierCategoryLabel('non_existent')).toBe('non_existent');
    });

    it('resolves category color and fallback', () => {
      expect(getSupplierCategoryColor('audio')).toBe('#f59e0b');
      expect(getSupplierCategoryColor('non_existent')).toBe('#94a3b8');
    });
  });

  describe('getSupplierWhatsAppLink', () => {
    it('builds valid supplier link with contact name', () => {
      const link = getSupplierWhatsAppLink('1144445555', 'Carlos');
      expect(link).toContain('https://wa.me/5491144445555');
      expect(link).toContain('Carlos');
    });

    it('returns null if phone is missing or too short', () => {
      expect(getSupplierWhatsAppLink('')).toBeNull();
      expect(getSupplierWhatsAppLink('123')).toBeNull();
    });
  });

  describe('exportSuppliersToCSV', () => {
    it('creates CSV download without error', () => {
      const mockSuppliers: Supplier[] = [
        {
          id: 's1',
          name: 'Sonido Master',
          company: 'Sonido Master SRL',
          category: 'audio',
          email: 'contacto@sonidomaster.com',
          phone: '1144440000',
          createdAt: '2026-01-01'
        }
      ];

      const createObjectURLMock = vi.fn(() => 'blob:mock-url');
      const revokeObjectURLMock = vi.fn();
      globalThis.URL.createObjectURL = createObjectURLMock;
      globalThis.URL.revokeObjectURL = revokeObjectURLMock;

      const clickMock = vi.fn();
      vi.spyOn(document, 'createElement').mockReturnValue({
        setAttribute: vi.fn(),
        click: clickMock
      } as unknown as HTMLElement);
      vi.spyOn(document.body, 'appendChild').mockReturnValue({} as unknown as Node);
      vi.spyOn(document.body, 'removeChild').mockReturnValue({} as unknown as Node);

      exportSuppliersToCSV(mockSuppliers);

      expect(createObjectURLMock).toHaveBeenCalled();
      expect(clickMock).toHaveBeenCalled();
    });
  });
});
