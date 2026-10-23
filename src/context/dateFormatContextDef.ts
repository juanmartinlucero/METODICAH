import { createContext } from 'react';
import type { DateFormatPattern } from '../types/metodicah';
import type { FormatDateOptions } from '../utils/dateUtils';

export interface DateFormatContextType {
  dateFormat: DateFormatPattern;
  setDateFormat: (format: DateFormatPattern) => void;
  formatDate: (
    date: Date | string | number | null | undefined, 
    formatOverride?: DateFormatPattern,
    options?: FormatDateOptions
  ) => string;
  parseDate: (input: string | Date | number | null | undefined) => Date | null;
  formatMonthYear: (date: string | Date | number | null | undefined, fallback?: string) => string;
  formatYear: (date: string | Date | number | null | undefined, fallback?: string) => string;
  formatRelativeDate: (date: string | Date | number | null | undefined, fallback?: string) => string;
}

export const DateFormatContext = createContext<DateFormatContextType | null>(null);
