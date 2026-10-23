import React from 'react';
import { AnalyticsMetricCard } from './AnalyticsMetricCard';

export interface ClientsAnalyticsProps {
  totalClientsCount: number;
  corporateClientsCount: number;
  individualClientsCount: number;
}

export const ClientsAnalytics: React.FC<ClientsAnalyticsProps> = ({
  totalClientsCount,
  corporateClientsCount,
  individualClientsCount
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <AnalyticsMetricCard
        label="Total de Clientes"
        value={totalClientsCount}
        subtitle="Cartera activa de cuentas"
      />

      <AnalyticsMetricCard label="Distribución de Tipo">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Empresas / Corporativo</span>
            <span style={{ fontWeight: 600, color: '#38bdf8' }}>{corporateClientsCount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Personas / Particulares</span>
            <span style={{ fontWeight: 600, color: '#f59e0b' }}>{individualClientsCount}</span>
          </div>
        </div>
      </AnalyticsMetricCard>
    </div>
  );
};
