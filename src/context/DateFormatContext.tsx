import React, { useMemo, useCallback } from 'react';
import type { DateFormatPattern } from '../types/metodicah';
import { 
  formatDate as formatFn, 
  parseDateSafe, 
  formatMonthYear as formatMonthYearFn,
  formatYear as formatYearFn,
  formatRelativeDate as formatRelativeDateFn,
  type FormatDateOptions 
} from '../utils/dateUtils';
import { DateFormatContext, type DateFormatContextType } from './dateFormatContextDef';

export interface DateFormatProviderProps {
  dateFormat: DateFormatPattern;
  setDateFormat: (format: DateFormatPattern) => void;
  children: React.ReactNode;
}

export const DateFormatProvider: React.FC<DateFormatProviderProps> = ({
  dateFormat,
  setDateFormat,
  children
}) => {
  const formatDate = useCallback(
    (
      date: Date | string | number | null | undefined, 
      formatOverride?: DateFormatPattern,
      options?: FormatDateOptions
    ) => {
      return formatFn(date, formatOverride || dateFormat, options);
    },
    [dateFormat]
  );

  const formatMonthYear = useCallback(
    (date: string | Date | number | null | undefined, fallback?: string) => {
      return formatMonthYearFn(date, fallback);
    },
    []
  );

  const formatYear = useCallback(
    (date: string | Date | number | null | undefined, fallback?: string) => {
      return formatYearFn(date, fallback);
    },
    []
  );

  const formatRelativeDate = useCallback(
    (date: string | Date | number | null | undefined, fallback?: string) => {
      return formatRelativeDateFn(date, fallback);
    },
    []
  );

  const value = useMemo<DateFormatContextType>(() => ({
    dateFormat,
    setDateFormat,
    formatDate,
    parseDate: parseDateSafe,
    formatMonthYear,
    formatYear,
    formatRelativeDate
  }), [dateFormat, setDateFormat, formatDate, formatMonthYear, formatYear, formatRelativeDate]);

  return (
    <DateFormatContext.Provider value={value}>
      {children}
    </DateFormatContext.Provider>
  );
};
