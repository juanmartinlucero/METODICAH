import React from 'react';
import type { EventStageConfig } from '../../../types/metodicah';
import { AnalyticsMetricCard } from './AnalyticsMetricCard';

export interface EventsCatalogAnalyticsProps {
  totalEventsCount: number;
  eventsThisYear: number;
  currentYear: number;
  activeStagesList: (EventStageConfig & { count: number })[];
}

export const EventsCatalogAnalytics: React.FC<EventsCatalogAnalyticsProps> = ({
  totalEventsCount,
  eventsThisYear,
  currentYear,
  activeStagesList
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <AnalyticsMetricCard
        label="Producciones Registradas"
        value={totalEventsCount}
        subtitle={`${eventsThisYear} agendadas para el año ${currentYear}`}
      />

      {/* Stage Breakdown Card */}
      <AnalyticsMetricCard label="Desglose por Etapas">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
          {activeStagesList.map(st => (
            <div key={st.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: st.color || '#f59e0b' }} />
                <span style={{ color: 'var(--text-muted)' }}>{st.label}</span>
              </div>
              <span style={{ fontWeight: 600, color: '#fff' }}>{st.count}</span>
            </div>
          ))}
        </div>
      </AnalyticsMetricCard>
    </div>
  );
};
