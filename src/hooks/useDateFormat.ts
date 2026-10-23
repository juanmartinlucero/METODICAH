import { useContext } from 'react';
import { DateFormatContext, type DateFormatContextType } from '../context/dateFormatContextDef';
import { useSettingsStore } from '@/stores';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { 
  DEFAULT_DATE_FORMAT, 
  formatDate as formatFn, 
  parseDateSafe, 
  formatMonthYear as formatMonthYearFn, 
  formatYear as formatYearFn, 
  formatRelativeDate as formatRelativeDateFn 
} from '../utils/dateUtils';
import type { DateFormatPattern } from '../types/metodicah';

export const useDateFormat = (): DateFormatContextType => {
  const context = useContext(DateFormatContext);
  const storeDateFormat = useSettingsStore(s => s.dateFormat);
  const storeUpdateDateFormat = useSettingsStore(s => s.updateDateFormat);

  if (context) {
    return context;
  }

  // Respaldo reactivo directo desde Zustand y catálogo centralizado de almacenamiento
  const saved = typeof window !== 'undefined' 
    ? (localStorage.getItem(STORAGE_KEYS.SETTINGS.DATE_FORMAT) as DateFormatPattern | null)
    : null;
  const currentFormat = storeDateFormat || saved || DEFAULT_DATE_FORMAT;

  return {
    dateFormat: currentFormat,
    setDateFormat: storeUpdateDateFormat,
    formatDate: (d, fmt, opts) => formatFn(d, fmt || currentFormat, opts),
    parseDate: parseDateSafe,
    formatMonthYear: formatMonthYearFn,
    formatYear: formatYearFn,
    formatRelativeDate: formatRelativeDateFn
  };
};
