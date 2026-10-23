import React, { useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { FormattedDate } from '@/components/common/FormattedDate';
import { useDateFormat } from '@/hooks/useDateFormat';
import { DynamicCalendarIcon } from './DynamicCalendarIcon';

export interface SidebarDateWidgetProps {
  isCollapsed: boolean;
}

export const SidebarDateWidget: React.FC<SidebarDateWidgetProps> = ({ isCollapsed }) => {
  const { formatDate } = useDateFormat();
  const today = useMemo(() => new Date(), []);
  const weekday = today.toLocaleDateString('es-AR', { weekday: 'long' });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const dayNumber = String(today.getDate()).padStart(2, '0');

  return (
    <div 
      title={`Hoy es ${capitalizedWeekday}, ${formatDate(today, 'DD de MMMM de YYYY')}`}
      style={{
        marginTop: 'auto',
        marginBottom: '6px',
        padding: isCollapsed ? '8px 0' : '6px 12px',
        background: 'transparent',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: '12px',
        userSelect: 'none',
        cursor: 'default',
        opacity: 0.85,
        transition: 'opacity 0.15s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '0.85';
      }}
    >
      {isCollapsed ? (
        <DynamicCalendarIcon 
          day={dayNumber} 
          size={18} 
          frameColor="var(--text-muted)" 
          numberColor="var(--text-main)" 
        />
      ) : (
        <Calendar size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
      )}

      {!isCollapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, flex: 1 }}>
          <span style={{ 
            fontSize: '0.64rem', 
            color: 'var(--text-dim)', 
            fontWeight: 600, 
            textTransform: 'uppercase', 
            letterSpacing: '0.04em', 
            lineHeight: 1.2 
          }}>
            {capitalizedWeekday}
          </span>
          <span style={{ 
            fontSize: '0.78rem', 
            fontWeight: 500, 
            color: 'var(--text-muted)', 
            lineHeight: 1.3, 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis' 
          }}>
            <FormattedDate date={today} format="DD de MMMM de YYYY" />
          </span>
        </div>
      )}
    </div>
  );
};
