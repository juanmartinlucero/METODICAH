import React from 'react';
import { ShieldCheck, Users, Eye } from 'lucide-react';
import { Badge, Card } from '@/components/ui';

export const RoleInfoCards: React.FC = () => {
  const roles = [
    {
      title: 'Admin (Productor Lead)',
      desc: 'Control total de la productora. Gestión de presupuestos, configuración, branding, equipo y auditorías.',
      color: '#f59e0b',
      icon: ShieldCheck,
      badge: 'Acceso Total'
    },
    {
      title: 'Team Member (Crew & Staff)',
      desc: 'Operación activa de eventos. Creación y edición de producciones, gestión de tareas técnicas y timelines.',
      color: '#38bdf8',
      icon: Users,
      badge: 'Operativo'
    },
    {
      title: 'Guest (Proveedor / Cliente)',
      desc: 'Visualización de avances, seguimiento de hitos clave, cronogramas de montaje y descarga de documentación.',
      color: '#10b981',
      icon: Eye,
      badge: 'Solo Lectura'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '12px'
    }}>
      {roles.map((r) => {
        const Icon = r.icon;
        return (
          <Card
            key={r.title}
            variant="glass"
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: `${r.color}15`,
                  border: `1px solid ${r.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: r.color
                }}>
                  <Icon size={16} />
                </div>
                <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#fff' }}>
                  {r.title}
                </span>
              </div>
              <Badge color={r.color} size="sm">
                {r.badge}
              </Badge>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
              {r.desc}
            </p>
          </Card>
        );
      })}
    </div>
  );
};
