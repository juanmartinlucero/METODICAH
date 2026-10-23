import React from 'react';
import type { EventItem, GlobalRole } from '@/types/metodicah';
import { KPICard } from '@/components/KPICard';
import { Calendar, Radio, Clock, Send } from 'lucide-react';
import { Badge } from '@/components/ui';

interface DashboardKPIsProps {
  events: EventItem[];
  userRole?: GlobalRole;
  onFilterClick?: (stageFilter: string) => void;
}

export const DashboardKPIs: React.FC<DashboardKPIsProps> = ({
  events,
  userRole = 'admin'
}) => {
  // Production metrics calculations
  const activeEvents = events.filter(e => e.stageId !== 'post_prod' && e.stageId !== 'rejected');
  const liveStageEvents = events.filter(e => e.stageId === 'prod' || e.stageId === 'pre_prod');
  const preProdEvents = events.filter(e => e.stageId === 'backlog' || e.stageId === 'meeting' || e.stageId === 'deploy' || e.stageId === 'approved');
  const deployPendingEvents = events.filter(e => e.stageId === 'deploy' || (e.deployDate && e.stageId === 'backlog'));

  return (
    <div style={{ width: '100%', maxWidth: '880px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        padding: '0 4px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Indicadores de Producción
        </span>
        <Badge variant="amber" size="sm">
          Vista {userRole === 'admin' ? 'Administrador' : userRole === 'team_member' ? 'Equipo' : 'Invitado'}
        </Badge>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px'
      }}>
        
        {/* KPI 1: Eventos Activos */}
        <KPICard
          title="Eventos Activos"
          value={activeEvents.length}
          subtitle={`${events.length} producciones en total`}
          icon={Calendar}
          valueColor="#ffffff"
          iconColor="var(--text-dim)"
        />

        {/* KPI 2: Montaje / En Vivo */}
        <KPICard
          title="Montaje & En Vivo"
          value={liveStageEvents.length}
          subtitle="Operación técnica en tiempo real"
          icon={Radio}
          valueColor="#10b981"
          iconColor="#10b981"
        />

        {/* KPI 3: En Planificación */}
        <KPICard
          title="En Planificación"
          value={preProdEvents.length}
          subtitle="Backlog, reuniones & diseño"
          icon={Clock}
          valueColor="#ffffff"
          iconColor="var(--text-dim)"
        />

        {/* KPI 4: Deploys de Presupuesto */}
        <KPICard
          title="Cotizaciones / Deploy"
          value={deployPendingEvents.length}
          subtitle="Envío de presupuestos"
          icon={Send}
          valueColor="#f59e0b"
          iconColor="#f59e0b"
        />

      </div>
    </div>
  );
};
