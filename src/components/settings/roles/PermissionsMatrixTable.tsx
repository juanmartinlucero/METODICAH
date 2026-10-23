import React from 'react';
import { Check, Minus, RotateCcw, Edit3, Lock } from 'lucide-react';
import { useSettingsStore } from '@/stores';
import { DEFAULT_ROLE_PERMISSIONS } from '@/services/mockData';
import { Button } from '@/components/ui';
import { useToast } from '@/hooks/useToast';

export interface PermissionsMatrixTableProps {
  isAdmin?: boolean;
}

export const PermissionsMatrixTable: React.FC<PermissionsMatrixTableProps> = ({
  isAdmin: propIsAdmin
}) => {
  const storeUser = useSettingsStore(s => s.currentUser);
  const rolePermissions = useSettingsStore(s => s.rolePermissions);
  const updateRolePermission = useSettingsStore(s => s.updateRolePermission);
  const resetRolePermissions = useSettingsStore(s => s.resetRolePermissions);
  const toast = useToast();

  const isAdmin = propIsAdmin !== undefined ? propIsAdmin : (storeUser.globalRole === 'admin');
  const permissions = rolePermissions && rolePermissions.length > 0 ? rolePermissions : DEFAULT_ROLE_PERMISSIONS;

  const handleReset = () => {
    resetRolePermissions();
    toast.info('Permisos restablecidos a los valores predeterminados de la productora.');
  };

  const renderCell = (
    permissionId: string,
    permissionName: string,
    role: 'admin' | 'team' | 'guest',
    value: boolean
  ) => {
    if (isAdmin) {
      return (
        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            padding: '4px 6px',
            borderRadius: '6px',
            background: value ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
            userSelect: 'none'
          }}
        >
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => updateRolePermission(permissionId, role, e.target.checked)}
            aria-label={`Permiso ${permissionName} para rol ${role}`}
            style={{
              width: '16px',
              height: '16px',
              cursor: 'pointer',
              accentColor: role === 'admin' ? '#f59e0b' : role === 'team' ? '#38bdf8' : '#10b981'
            }}
          />
          <span
            style={{
              fontSize: '0.76rem',
              fontWeight: 500,
              color: value ? '#10b981' : 'var(--text-dim)'
            }}
          >
            {value ? 'Permitido' : 'Restringido'}
          </span>
        </label>
      );
    }

    return value ? (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
        <Check size={16} />
        <span style={{ fontSize: '0.76rem', fontWeight: 500 }}>Permitido</span>
      </div>
    ) : (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)' }}>
        <Minus size={15} />
        <span style={{ fontSize: '0.76rem' }}>—</span>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Control Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {isAdmin ? (
            <>
              <Edit3 size={14} color="#f59e0b" />
              <span>Modo interactivo: activa o desactiva permisos por rol. Los cambios se guardan automáticamente.</span>
            </>
          ) : (
            <>
              <Lock size={14} color="var(--text-dim)" />
              <span>Modo de solo lectura informativo. Solo administradores pueden modificar la asignación de permisos.</span>
            </>
          )}
        </div>

        {isAdmin && (
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<RotateCcw size={13} />}
            onClick={handleReset}
            title="Restablecer matriz a los valores de fábrica"
          >
            Restablecer Valores por Defecto
          </Button>
        )}
      </div>

      {/* Permissions Matrix Table */}
      <div
        style={{
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          overflowX: 'auto',
          background: 'rgba(9, 13, 22, 0.4)'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem', minWidth: '640px' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '12px 16px', color: '#fff', fontWeight: 600 }}>Módulo / Permiso</th>
              <th style={{ padding: '12px 16px', color: '#f59e0b', fontWeight: 600 }}>Admin (Productor Lead)</th>
              <th style={{ padding: '12px 16px', color: '#38bdf8', fontWeight: 600 }}>Team Member (Crew)</th>
              <th style={{ padding: '12px 16px', color: '#10b981', fontWeight: 600 }}>Guest (Proveedor / Cliente)</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((p, idx) => {
              const isLast = idx === permissions.length - 1;
              return (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)'
                  }}
                >
                  <td style={{ padding: '12px 16px', color: 'var(--text-main)', fontWeight: 500 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span>{p.permission}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{p.category}</span>
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    {renderCell(p.id, p.permission, 'admin', p.admin)}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    {renderCell(p.id, p.permission, 'team', p.team)}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    {renderCell(p.id, p.permission, 'guest', p.guest)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
