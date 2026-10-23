import React from 'react';
import type { Supplier } from '../../../types/metodicah';
import { AnalyticsMetricCard } from './AnalyticsMetricCard';

export interface SuppliersAnalyticsProps {
  suppliers: Supplier[];
}

export const SuppliersAnalytics: React.FC<SuppliersAnalyticsProps> = ({ suppliers }) => {
  const distinctCategoriesCount = new Set(suppliers.map(s => s.category)).size;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <AnalyticsMetricCard
        label="Red de Proveedores"
        value={suppliers.length}
        subtitle="Suministros y servicios técnicos"
      />

      <AnalyticsMetricCard
        label="Rubros Activos"
        value={distinctCategoriesCount}
        valueColor="#10b981"
        subtitle="Especialidades técnicas homologadas"
      />
    </div>
  );
};
