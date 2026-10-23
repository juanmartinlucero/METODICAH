import type { DateFormatPattern, DateFormatOption } from '../types/metodicah';

export const DEFAULT_DATE_FORMAT: DateFormatPattern = 'DD/MM/YYYY';

export const DATE_FORMAT_OPTIONS: DateFormatOption[] = [
  {
    value: 'DD/MM/YYYY',
    label: 'DD/MM/YYYY',
    example: '25/08/2026',
    description: 'Estándar para Argentina, España y Latinoamérica (Día/Mes/Año)'
  },
  {
    value: 'YYYY-MM-DD',
    label: 'YYYY-MM-DD',
    example: '2026-08-25',
    description: 'Estándar internacional ISO 8601'
  },
  {
    value: 'MM/DD/YYYY',
    label: 'MM/DD/YYYY',
    example: '08/25/2026',
    description: 'Estándar Anglo / Estados Unidos (Mes/Día/Año)'
  },
  {
    value: 'DD MMM YYYY',
    label: 'DD MMM YYYY',
    example: '25 ago 2026',
    description: 'Formato legible abreviado con mes en texto'
  },
  {
    value: 'DD de MMMM de YYYY',
    label: 'DD de MMMM de YYYY',
    example: '25 de agosto de 2026',
    description: 'Formato extendido y protocolar'
  },
  {
    value: 'dddd DD de MMMM de YYYY',
    label: 'dddd DD de MMMM de YYYY',
    example: 'Domingo 6 de septiembre de 2026',
    description: 'Formato completo con nombre del día de la semana, fecha y año'
  }
];

export const VALID_DATE_FORMATS: DateFormatPattern[] = [
  'DD/MM/YYYY',
  'YYYY-MM-DD',
  'MM/DD/YYYY',
  'DD MMM YYYY',
  'DD de MMMM de YYYY',
  'dddd DD de MMMM de YYYY'
];

export function isValidDateFormat(format: unknown): format is DateFormatPattern {
  return typeof format === 'string' && (
    VALID_DATE_FORMATS.includes(format as DateFormatPattern) ||
    format === 'dddd D de MMMM de YYYY'
  );
}

const WEEKDAYS_LONG_ES = [
  'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'
];

const MONTHS_SHORT_ES = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
];

const MONTHS_LONG_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

/**
 * Parsea de forma segura cualquier string, Date o número a un objeto Date.
 * Previene el problema clásico de JavaScript donde 'YYYY-MM-DD' se parsea en UTC
 * y en zonas horarias negativas (ej: Argentina UTC-3) retrocede un día.
 */
export function parseDateSafe(input: string | Date | number | null | undefined): Date | null {
  if (input === null || input === undefined) return null;

  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }

  if (typeof input === 'number') {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Caso 1: Formato YYYY-MM-DD (con hora opcional)
    const ymdMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/);
    if (ymdMatch) {
      const year = parseInt(ymdMatch[1], 10);
      const monthIndex = parseInt(ymdMatch[2], 10) - 1;
      const day = parseInt(ymdMatch[3], 10);
      const hours = ymdMatch[4] !== undefined ? parseInt(ymdMatch[4], 10) : 12;
      const minutes = ymdMatch[5] !== undefined ? parseInt(ymdMatch[5], 10) : 0;
      const seconds = ymdMatch[6] !== undefined ? parseInt(ymdMatch[6], 10) : 0;

      const dateObj = new Date(year, monthIndex, day, hours, minutes, seconds);
      return isNaN(dateObj.getTime()) ? null : dateObj;
    }

    // Caso 2: Formato DD/MM/YYYY (con hora opcional)
    const dmyMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[T\s](\d{2}):(\d{2}))?/);
    if (dmyMatch) {
      const day = parseInt(dmyMatch[1], 10);
      const monthIndex = parseInt(dmyMatch[2], 10) - 1;
      const year = parseInt(dmyMatch[3], 10);
      const hours = dmyMatch[4] !== undefined ? parseInt(dmyMatch[4], 10) : 12;
      const minutes = dmyMatch[5] !== undefined ? parseInt(dmyMatch[5], 10) : 0;

      const dateObj = new Date(year, monthIndex, day, hours, minutes, 0);
      return isNaN(dateObj.getTime()) ? null : dateObj;
    }

    // Fallback nativo
    const parsed = new Date(trimmed);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

export interface FormatDateOptions {
  includeTime?: boolean;
  fallback?: string;
}

/**
 * Formatea una fecha según el patrón especificado.
 */
export function formatDate(
  input: string | Date | number | null | undefined,
  pattern: DateFormatPattern = DEFAULT_DATE_FORMAT,
  options: FormatDateOptions = {}
): string {
  const { includeTime = false, fallback = '-' } = options;
  const date = parseDateSafe(input);

  if (!date) {
    return fallback;
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  const monthShort = MONTHS_SHORT_ES[date.getMonth()] || '';
  const monthLong = MONTHS_LONG_ES[date.getMonth()] || '';
  const weekdayName = WEEKDAYS_LONG_ES[date.getDay()] || '';
  const weekdayCapitalized = weekdayName ? weekdayName.charAt(0).toUpperCase() + weekdayName.slice(1) : '';

  let datePart = '';
  switch (pattern) {
    case 'DD/MM/YYYY':
      datePart = `${day}/${month}/${year}`;
      break;
    case 'YYYY-MM-DD':
      datePart = `${year}-${month}-${day}`;
      break;
    case 'MM/DD/YYYY':
      datePart = `${month}/${day}/${year}`;
      break;
    case 'DD MMM YYYY':
      datePart = `${day} ${monthShort} ${year}`;
      break;
    case 'DD de MMMM de YYYY':
      datePart = `${date.getDate()} de ${monthLong} de ${year}`;
      break;
    case 'dddd DD de MMMM de YYYY':
    case 'dddd D de MMMM de YYYY' as DateFormatPattern:
      datePart = `${weekdayCapitalized} ${date.getDate()} de ${monthLong} de ${year}`;
      break;
    default:
      datePart = `${day}/${month}/${year}`;
      break;
  }

  if (includeTime) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${datePart} ${hours}:${minutes} hs`;
  }

  return datePart;
}

/**
 * Formatea mes y año para títulos de agrupamiento (ej: "Agosto 2026").
 */
export function formatMonthYear(
  input: string | Date | number | null | undefined,
  fallback: string = 'Sin fecha programada'
): string {
  const date = parseDateSafe(input);
  if (!date) return fallback;

  const monthLong = MONTHS_LONG_ES[date.getMonth()] || '';
  const year = date.getFullYear();

  if (!monthLong) return fallback;
  return `${monthLong.charAt(0).toUpperCase() + monthLong.slice(1)} ${year}`;
}

/**
 * Formatea año para títulos de agrupamiento (ej: "2026").
 */
export function formatYear(
  input: string | Date | number | null | undefined,
  fallback: string = 'Sin fecha programada'
): string {
  const date = parseDateSafe(input);
  if (!date) return fallback;
  return String(date.getFullYear());
}

/**
 * Formato relativo amigable ("Hoy", "Mañana", "Ayer", "En X días", "Hace X días").
 */
export function formatRelativeDate(
  input: string | Date | number | null | undefined,
  fallback: string = '-'
): string {
  const date = parseDateSafe(input);
  if (!date) return fallback;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Mañana';
  if (diffDays === -1) return 'Ayer';
  if (diffDays > 1 && diffDays <= 7) return `En ${diffDays} días`;
  if (diffDays < -1 && diffDays >= -7) return `Hace ${Math.abs(diffDays)} días`;

  return formatDate(date);
}

/**
 * Obtiene la fecha actual en zona horaria local en formato ISO corto (YYYY-MM-DD),
 * evitando el desfase de día que produce `new Date().toISOString().split('T')[0]` en UTC-3.
 */
export function getTodayLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

