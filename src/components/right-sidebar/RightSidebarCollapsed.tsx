import React from 'react';
import { Activity, Calendar, Users, UserCheck, Truck } from 'lucide-react';

export interface RightSidebarCollapsedProps {
  totalEventsCount: number;
  activeEventsCount: number;
  totalClientsCount: number;
  totalCrewCount: number;
  totalSuppliersCount: number;
  onExpand: () => void;
}

export const RightSidebarCollapsed: React.FC<RightSidebarCollapsedProps> = ({
  totalEventsCount,
  activeEventsCount,
  totalClientsCount,
  totalCrewCount,
  totalSuppliersCount,
  onExpand
}) => {
  return (
    <div 
      style={{ 
        marginTop: '16px', 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '12px',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {/* Live Indicator Icon */}
      <div 
        title="Analítica en vivo activa (Clic para expandir)"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '9px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f59e0b',
          cursor: 'pointer'
        }}
        onClick={onExpand}
      >
        <Activity size={18} />
      </div>

      {/* Quick Glances with Tooltips */}
      <div 
        title={`Eventos: ${totalEventsCount} totales (${activeEventsCount} activos)`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          padding: '6px 0',
          width: '100%',
          borderRadius: '7px',
          color: 'var(--text-muted)'
        }}
      >
        <Calendar size={16} />
        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#fff' }}>
          {totalEventsCount}
        </span>
      </div>

      <div 
        title={`Clientes: ${totalClientsCount} registrados`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          padding: '6px 0',
          width: '100%',
          borderRadius: '7px',
          color: 'var(--text-muted)'
        }}
      >
        <Users size={16} />
        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#fff' }}>
          {totalClientsCount}
        </span>
      </div>

      <div 
        title={`Equipo / Crew: ${totalCrewCount} integrantes`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          padding: '6px 0',
          width: '100%',
          borderRadius: '7px',
          color: 'var(--text-muted)'
        }}
      >
        <UserCheck size={16} />
        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#fff' }}>
          {totalCrewCount}
        </span>
      </div>

      <div 
        title={`Proveedores: ${totalSuppliersCount} activos`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          padding: '6px 0',
          width: '100%',
          borderRadius: '7px',
          color: 'var(--text-muted)'
        }}
      >
        <Truck size={16} />
        <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#fff' }}>
          {totalSuppliersCount}
        </span>
      </div>
    </div>
  );
};
