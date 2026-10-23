import React from 'react';
import { AnalyticsMetricCard } from './AnalyticsMetricCard';

export interface CrewAnalyticsProps {
  totalCrewCount: number;
  staffCrewCount: number;
  freelanceCrewCount: number;
}

export const CrewAnalytics: React.FC<CrewAnalyticsProps> = ({
  totalCrewCount,
  staffCrewCount,
  freelanceCrewCount
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <AnalyticsMetricCard
        label="Fuerza Operativa Total"
        value={totalCrewCount}
        subtitle="Técnicos y coordinadores registrados"
      />

      <AnalyticsMetricCard label="Modalidad de Trabajo">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Planta Fija (Staff)</span>
            <span style={{ fontWeight: 600, color: '#38bdf8' }}>{staffCrewCount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Freelance</span>
            <span style={{ fontWeight: 600, color: '#f59e0b' }}>{freelanceCrewCount}</span>
          </div>
        </div>
      </AnalyticsMetricCard>
    </div>
  );
};
