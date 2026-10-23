import { describe, it, expect } from 'vitest';
import {
  parseDateSafe,
  formatDate,
  formatMonthYear,
  formatYear,
  formatRelativeDate,
  isValidDateFormat
} from './dateUtils';

describe('dateUtils', () => {
  describe('parseDateSafe', () => {
    it('returns null for null, undefined or empty string', () => {
      expect(parseDateSafe(null)).toBeNull();
      expect(parseDateSafe(undefined)).toBeNull();
      expect(parseDateSafe('')).toBeNull();
      expect(parseDateSafe('   ')).toBeNull();
    });

    it('correctly parses ISO YYYY-MM-DD format avoiding UTC shift', () => {
      const date = parseDateSafe('2026-10-15');
      expect(date).not.toBeNull();
      expect(date?.getFullYear()).toBe(2026);
      expect(date?.getMonth()).toBe(9); // 0-indexed: October is 9
      expect(date?.getDate()).toBe(15);
    });

    it('correctly parses DD/MM/YYYY format', () => {
      const date = parseDateSafe('25/12/2026');
      expect(date).not.toBeNull();
      expect(date?.getFullYear()).toBe(2026);
      expect(date?.getMonth()).toBe(11); // December
      expect(date?.getDate()).toBe(25);
    });

    it('handles numeric timestamp and Date objects', () => {
      const original = new Date(2026, 5, 20, 14, 30);
      expect(parseDateSafe(original)?.getTime()).toBe(original.getTime());
      expect(parseDateSafe(original.getTime())?.getTime()).toBe(original.getTime());
    });
  });

  describe('formatDate', () => {
    it('formats DD/MM/YYYY as default', () => {
      expect(formatDate('2026-08-25')).toBe('25/08/2026');
    });

    it('formats YYYY-MM-DD', () => {
      expect(formatDate('2026-08-25', 'YYYY-MM-DD')).toBe('2026-08-25');
    });

    it('formats MM/DD/YYYY', () => {
      expect(formatDate('2026-08-25', 'MM/DD/YYYY')).toBe('08/25/2026');
    });

    it('formats readable Spanish formats', () => {
      expect(formatDate('2026-08-25', 'DD MMM YYYY')).toBe('25 ago 2026');
      expect(formatDate('2026-08-25', 'DD de MMMM de YYYY')).toBe('25 de agosto de 2026');
    });

    it('handles fallback for invalid or empty inputs', () => {
      expect(formatDate(null, 'DD/MM/YYYY', { fallback: 'Sin fecha' })).toBe('Sin fecha');
      expect(formatDate('invalid-date', 'DD/MM/YYYY')).toBe('-');
    });
  });

  describe('formatMonthYear and formatYear', () => {
    it('formats month and year in Spanish title case', () => {
      expect(formatMonthYear('2026-05-10')).toBe('Mayo 2026');
    });

    it('formats year string', () => {
      expect(formatYear('2026-05-10')).toBe('2026');
    });
  });

  describe('formatRelativeDate', () => {
    it('identifies today correctly', () => {
      const now = new Date();
      expect(formatRelativeDate(now)).toBe('Hoy');
    });

    it('identifies tomorrow and yesterday correctly', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(formatRelativeDate(tomorrow)).toBe('Mañana');

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(formatRelativeDate(yesterday)).toBe('Ayer');
    });
  });

  describe('isValidDateFormat', () => {
    it('validates supported date formats', () => {
      expect(isValidDateFormat('DD/MM/YYYY')).toBe(true);
      expect(isValidDateFormat('YYYY-MM-DD')).toBe(true);
      expect(isValidDateFormat('INVALID_FORMAT')).toBe(false);
      expect(isValidDateFormat(123)).toBe(false);
    });
  });
});
