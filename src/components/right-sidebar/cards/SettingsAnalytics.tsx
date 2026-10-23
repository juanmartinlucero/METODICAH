import React from 'react';
import type { EventStageConfig } from '../../../types/metodicah';
import { AnalyticsMetricCard } from './AnalyticsMetricCard';
import { useDateFormat } from '../../../hooks/useDateFormat';

export interface SettingsAnalyticsProps {
  stages: EventStageConfig[];
}

export const SettingsAnalytics: React.FC<SettingsAnalyticsProps> = ({ stages }) => {
  const { dateFormat } = useDateFormat();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <AnalyticsMetricCard
        label="Formato Regional"
        value={<span style={{ fontSize: '0.92rem' }}>{dateFormat}</span>}
        subtitle="Configuración horaria y fechas"
      />

      <AnalyticsMetricCard
        label="Pipeline Operativo"
        value={<span style={{ fontSize: '0.92rem', color: '#10b981' }}>{stages.length} etapas activas</span>}
        subtitle="Flujo maestro de trabajo"
      />
    </div>
  );
};
