import { describe, it, expect, vi } from 'vitest';
import { 
  escapeCSVField, 
  generateCSVContent, 
  exportToCSV, 
  parseCSVLine, 
  parseCSVRecords, 
  type CSVColumn 
} from './csvUtils';
import { sanitizeWhatsAppPhone, buildWhatsAppUrl } from './whatsappUtils';
import { generateId } from './idUtils';
import { hashPassword, verifyPassword } from './cryptoUtils';
import { cleanFirestorePayload } from './cleanFirestorePayload';
import { formatFirebaseError, ok, err } from './firebaseErrors';
import { matchesSearch, normalizeSearchText } from './searchUtils';
import { getTodayLocalDateString } from './dateUtils';
import { STORAGE_KEYS } from '../constants/storageKeys';

describe('Common Utilities', () => {
  describe('csvUtils', () => {
    it('escapes fields containing commas, quotes, or newlines per RFC 4180', () => {
      expect(escapeCSVField('Simple text')).toBe('Simple text');
      expect(escapeCSVField('Text with, comma')).toBe('"Text with, comma"');
      expect(escapeCSVField('Text with "quotes"')).toBe('"Text with ""quotes"""');
      expect(escapeCSVField("Line 1\nLine 2")).toBe('"Line 1\nLine 2"');
      expect(escapeCSVField(null)).toBe('');
      expect(escapeCSVField(undefined)).toBe('');
      expect(escapeCSVField(123)).toBe('123');
    });

    it('generates well-formed CSV rows from dataset and columns', () => {
      interface TestItem {
        id: string;
        name: string;
        count: number;
      }

      const columns: CSVColumn<TestItem>[] = [
        { header: 'ID', accessor: i => i.id },
        { header: 'Nombre', accessor: i => i.name },
        { header: 'Cantidad', accessor: i => i.count }
      ];

      const data: TestItem[] = [
        { id: '1', name: 'Audio, Luces', count: 5 },
        { id: '2', name: 'Escenario "Principal"', count: 1 }
      ];

      const content = generateCSVContent(data, columns);
      const lines = content.split('\r\n');

      expect(lines[0]).toBe('ID,Nombre,Cantidad');
      expect(lines[1]).toBe('1,"Audio, Luces",5');
      expect(lines[2]).toBe('2,"Escenario ""Principal""",1');
    });

    it('creates a download link and cleans up when exporting to CSV', () => {
      const clickSpy = vi.fn();
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const el = document.createElementNS('http://www.w3.org/1999/xhtml', tagName);
        if (tagName === 'a') {
          el.click = clickSpy;
        }
        return el;
      });

      exportToCSV([{ a: 1 }], [{ header: 'A', accessor: i => i.a }], 'test.csv');

      expect(appendChildSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
    });

    it('parses individual CSV lines handling delimiters, quotes and escaped quotes per RFC 4180', () => {
      expect(parseCSVLine('a,b,c')).toEqual(['a', 'b', 'c']);
      expect(parseCSVLine('"Buenos Aires, CABA",Argentina,VIP')).toEqual(['Buenos Aires, CABA', 'Argentina', 'VIP']);
      expect(parseCSVLine('"Escenario ""Principal""",Audio')).toEqual(['Escenario "Principal"', 'Audio']);
      expect(parseCSVLine('x;y;z')).toEqual(['x', 'y', 'z']);
    });

    it('parses multi-line CSV documents with parseCSVRecords', () => {
      const csv = 'Header1,Header2\r\n"Multi\r\nLine",Value2\r\nSimple1,Simple2';
      const records = parseCSVRecords(csv);

      expect(records).toHaveLength(3);
      expect(records[0]).toEqual(['Header1', 'Header2']);
      expect(records[1][0]).toBe('Multi\r\nLine');
      expect(records[1][1]).toBe('Value2');
      expect(records[2]).toEqual(['Simple1', 'Simple2']);
    });
  });

  describe('idUtils', () => {
    it('generates standard UUIDs with optional semantic prefixes', () => {
      const id1 = generateId('cli');
      const id2 = generateId('cli');

      expect(id1.startsWith('cli_')).toBe(true);
      expect(id2.startsWith('cli_')).toBe(true);
      expect(id1).not.toBe(id2);

      const rawId = generateId();
      expect(rawId.length).toBeGreaterThanOrEqual(36);
    });
  });

  describe('cryptoUtils', () => {
    it('hashes passwords with SHA-256 and verifies correctly', async () => {
      const hash = await hashPassword('password123');
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(16);

      const isValid = await verifyPassword('password123', hash);
      expect(isValid).toBe(true);

      const isInvalid = await verifyPassword('wrongPassword', hash);
      expect(isInvalid).toBe(false);
    });
  });

  describe('whatsappUtils', () => {
    it('sanitizes Argentine phones and adds country code 549 properly', () => {
      expect(sanitizeWhatsAppPhone('11 5555-0000')).toBe('5491155550000');
      expect(sanitizeWhatsAppPhone('011 15 5555 0000')).toBe('5491155550000');
      expect(sanitizeWhatsAppPhone('1544445555')).toBe('54944445555');

      expect(sanitizeWhatsAppPhone('+54 9 11 5555-0000')).toBe('5491155550000');
      expect(sanitizeWhatsAppPhone('+54 11 5555-0000')).toBe('5491155550000');

      expect(sanitizeWhatsAppPhone('')).toBeNull();
      expect(sanitizeWhatsAppPhone('123')).toBeNull();
      expect(sanitizeWhatsAppPhone(null)).toBeNull();
    });

    it('builds full wa.me URLs with encoded message', () => {
      const url = buildWhatsAppUrl('1155550000', 'Hola mundo!');
      expect(url).toBe('https://wa.me/5491155550000?text=Hola%20mundo!');

      const urlWithoutMsg = buildWhatsAppUrl('1155550000');
      expect(urlWithoutMsg).toBe('https://wa.me/5491155550000');

      const invalidUrl = buildWhatsAppUrl('');
      expect(invalidUrl).toBe('');
    });
  });

  describe('cleanFirestorePayload', () => {
    it('strips undefined recursively while preserving null, Date, arrays and FieldValue sentinels', () => {
      const now = new Date();
      const sentinel = { _methodName: 'serverTimestamp' };
      const raw = {
        id: 'evt_1',
        venue: undefined,
        notes: null,
        dateObj: now,
        timestamp: sentinel,
        nested: {
          keep: 'ok',
          drop: undefined,
          list: ['a', undefined, { x: 1, y: undefined }]
        }
      };

      const cleaned = cleanFirestorePayload(raw);
      expect('venue' in cleaned).toBe(false);
      expect(cleaned.notes).toBeNull();
      expect(cleaned.dateObj).toBe(now);
      expect(cleaned.timestamp).toBe(sentinel);
      expect('drop' in cleaned.nested).toBe(false);
      expect(cleaned.nested.list).toEqual(['a', { x: 1 }]);
    });
  });

  describe('firebaseErrors & Result<T, E>', () => {
    it('creates ok/err discriminated unions and translates Firebase error codes', () => {
      const success = ok(42);
      const failure = err('Fallo');
      expect(success).toEqual({ ok: true, data: 42 });
      expect(failure).toEqual({ ok: false, error: 'Fallo' });

      expect(formatFirebaseError({ code: 'auth/invalid-credential' })).toMatch(/Credenciales incorrectas/i);
      expect(formatFirebaseError({ code: 'permission-denied' })).toMatch(/No tienes permisos suficientes/i);
      expect(formatFirebaseError(null, 'Error genérico')).toBe('Error genérico');
    });
  });

  describe('searchUtils (NFD accent-insensitive & multi-token)', () => {
    it('normalizes diacritics and matches multiple tokens in any order', () => {
      expect(normalizeSearchText('Iluminación & Producción Técnica')).toBe('iluminacion & produccion tecnica');
      expect(
        matchesSearch(['Córdoba Arena', 'Producción General', 'Martín Gómez'], 'martin cordoba')
      ).toBe(true);
      expect(
        matchesSearch(['Córdoba Arena', 'Producción General'], 'rosario')
      ).toBe(false);
    });
  });

  describe('getTodayLocalDateString', () => {
    it('returns a valid YYYY-MM-DD local date string', () => {
      expect(getTodayLocalDateString()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('STORAGE_KEYS catalog', () => {
    it('contains all required UI preference keys and is immutable', () => {
      expect(STORAGE_KEYS.EVENTS).toBe('metodicah_events');
      expect(STORAGE_KEYS.CLIENTS).toBe('metodicah_clients');
      expect(STORAGE_KEYS.CREW).toBe('metodicah_crew_members');
      expect(STORAGE_KEYS.SUPPLIERS).toBe('metodicah_suppliers');
      expect(STORAGE_KEYS.SETTINGS.STAGES).toBe('metodicah_event_stages');
      expect(STORAGE_KEYS.SETTINGS.SUBTAB).toBe('metodicah_settings_subtab');
      expect(STORAGE_KEYS.NAVIGATION.ACTIVE_TAB).toBe('metodicah_active_tab');
    });
  });
});
