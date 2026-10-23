import React from 'react';
import type { DateFormatPattern } from '../../types/metodicah';
import { useDateFormat } from '../../hooks/useDateFormat';


export interface FormattedDateProps {
  date: Date | string | number | null | undefined;
  format?: DateFormatPattern;
  fallback?: string;
  includeTime?: boolean;
  relative?: boolean;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}

/**
 * Componente modular y reutilizable para parsear y renderizar fechas en todo METODICAH.
 * Adapta automáticamente la presentación al formato configurado en el sistema ('General').
 */
export const FormattedDate: React.FC<FormattedDateProps> = ({
  date,
  format,
  fallback = 'Sin fecha registrada',
  includeTime = false,
  relative = false,
  className,
  style,
  title
}) => {

  const { formatDate, formatRelativeDate } = useDateFormat();

  if (!date) {
    return (
      <span className={className} style={style}>
        {fallback}
      </span>
    );
  }

  const displayText = relative
    ? formatRelativeDate(date, fallback)
    : formatDate(date, format, { includeTime, fallback });

  return (
    <span 
      className={className} 
      style={style} 
      title={title}
    >
      {displayText}
    </span>
  );
};
