import React from 'react';
import type { EventItem } from '@/types/metodicah';
import { Clock } from 'lucide-react';
import { AnalyticsMetricCard } from './AnalyticsMetricCard';
import { useDateFormat } from '@/hooks/useDateFormat';

export interface DashboardAnalyticsProps {
  totalEventsCount: number;
  activeEventsCount: number;
  totalAttendees: number;
  upcomingEvent: EventItem | null;
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  totalEventsCount,
  activeEventsCount,
  totalAttendees,
  upcomingEvent
}) => {
  const { formatDate } = useDateFormat();
  const percentage = totalEventsCount > 0 ? Math.round((activeEventsCount / totalEventsCount) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Active Productions */}
      <AnalyticsMetricCard
        label="Producciones Activas"
        topRightContent={
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#f59e0b' }}>
            {percentage}%
          </span>
        }
        value={
          <>
            {activeEventsCount}
            <span style={{ fontSize: '0.74rem', fontWeight: 400, color: 'var(--text-dim)', marginLeft: '4px' }}>
              / {totalEventsCount} totales
            </span>
          </>
        }
        progressBar={{ percentage, color: '#f59e0b' }}
      />

      {/* Global Attendees */}
      <AnalyticsMetricCard
        label="Convocatoria Global"
        value={totalAttendees.toLocaleString('es-AR')}
        valueColor="#38bdf8"
        subtitle="Aforo estimado total en cartelera"
      />

      {/* Upcoming Event */}
      {upcomingEvent && (
        <AnalyticsMetricCard
          label="Próxima Fecha"
          icon={<Clock size={12} />}
          iconColor="#10b981"
          value={
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {upcomingEvent.title}
            </p>
          }
          subtitle={upcomingEvent.date ? formatDate(upcomingEvent.date) : 'Fecha sin confirmar'}
        />
      )}
    </div>
  );
};
