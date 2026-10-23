import React from 'react';
import { useNavigate } from 'react-router';
import { ShieldCheck, Users, ArrowRight } from 'lucide-react';
import { RoleInfoCards } from './RoleInfoCards';
import { PermissionsMatrixTable } from './PermissionsMatrixTable';
import { Button, Card } from '@/components/ui';
import { useAuthStore, useSettingsStore } from '@/stores';

export interface RolesPermissionsSettingsProps {
  isAdmin?: boolean;
}

export const RolesPermissionsSettings: React.FC<RolesPermissionsSettingsProps> = ({
  isAdmin: propIsAdmin
}) => {
  const navigate = useNavigate();
  const authUser = useAuthStore(s => s.user);
  const storeUser = useSettingsStore(s => s.currentUser);

  const currentUser = authUser ?? storeUser;
  const isAdmin = propIsAdmin !== undefined ? propIsAdmin : (currentUser.globalRole === 'admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Unified Crew & Staff Directory Callout Banner */}
      <Card
        variant="glass"
        style={{
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          borderLeft: '4px solid #38bdf8',
          background: 'rgba(56, 189, 248, 0.04)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', maxWidth: '700px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              flexShrink: 0
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', margin: 0 }}>
              Directorio Unificado de Crew y Accesos
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0, lineHeight: 1.4 }}>
              Las altas, bajas y asignación de credenciales de acceso a la plataforma para el personal técnico se gestionan de forma centralizada directamente desde la ficha de cada integrante en el <strong>Directorio de Crew</strong>.
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          rightIcon={<ArrowRight size={15} />}
          onClick={() => navigate('/crew')}
        >
          Ir a Directorio de Crew
        </Button>
      </Card>

      {/* 2. RBAC Reference & Interactive Matrix Section */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={22} color="#f59e0b" />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', margin: 0 }}>
              Roles y Matriz de Permisos (RBAC)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', marginBottom: 0 }}>
              {isAdmin 
                ? 'Control de acceso basado en roles: otorga o restringe permisos a los roles del sistema en tiempo real.' 
                : 'Visualiza la matriz de acceso y permisos asignados a cada nivel de usuario en METODICAH.'}
            </p>
          </div>
        </div>

        {/* Role Breakdown Cards */}
        <RoleInfoCards />

        {/* Permissions Matrix Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', margin: 0 }}>
            Matriz de Otorgamiento de Permisos
          </h4>
          <PermissionsMatrixTable isAdmin={isAdmin} />
        </div>
      </div>
    </div>
  );
};
