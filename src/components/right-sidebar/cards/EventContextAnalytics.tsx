import React from 'react';
import type { EventItem } from '../../../types/metodicah';
import { Users, UserCheck, Layers, MapPin } from 'lucide-react';
import { AnalyticsMetricCard } from './AnalyticsMetricCard';
import { useDateFormat } from '../../../hooks/useDateFormat';

export interface EventContextAnalyticsProps {
  event: EventItem;
  stageInfo: { label: string; color: string } | null;
}

export const EventContextAnalytics: React.FC<EventContextAnalyticsProps> = ({
  event,
  stageInfo
}) => {
  const { formatDate } = useDateFormat();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Stage Status */}
      <AnalyticsMetricCard
        label="Etapa de Producción"
        statusDotColor={stageInfo?.color || '#f59e0b'}
        value={
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
            {stageInfo?.label || event.stageId}
          </span>
        }
        subtitle={event.date ? formatDate(event.date) : 'Sin fecha asignada'}
      />

      {/* Attendees & Venue */}
      <AnalyticsMetricCard
        label="Convocatoria"
        icon={<Users size={13} />}
        iconColor="#38bdf8"
        value={
          <>
            {event.attendeesCount ? event.attendeesCount.toLocaleString('es-AR') : '0'}
            <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '4px' }}>
              asistentes
            </span>
          </>
        }
        subtitle={
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <MapPin size={11} style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {event.venue || event.location || 'Locación a definir'}
            </span>
          </div>
        }
      />

      {/* Assigned Crew */}
      <AnalyticsMetricCard
        label="Equipo Asignado"
        icon={<UserCheck size={13} />}
        iconColor="#10b981"
        value={
          <>
            {event.crewIds?.length || 0}
            <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '4px' }}>
              profesionales
            </span>
          </>
        }
        subtitle={
          event.crewIds?.length 
            ? 'Staff activo en producción' 
            : 'Aún no se ha asignado personal'
        }
      />

      {/* Technical Scope & Requirements */}
      <AnalyticsMetricCard
        label="Disciplinas Técnicas"
        icon={<Layers size={13} />}
        iconColor="#a78bfa"
        value={
          <>
            {event.scope?.length || 0}
            <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '4px' }}>
              rubros cubiertos
            </span>
          </>
        }
        subtitle={`Cliente: ${event.clientName || 'Sin cliente asignado'}`}
      />
    </div>
  );
};
