import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { LogOut } from 'lucide-react';
import type { UserProfile } from '@/types/metodicah';
import { useAuthStore } from '@/stores';
import { useToast } from '@/hooks/useToast';

export interface SidebarProfileWidgetProps {
  user?: UserProfile;
  isCollapsed: boolean;
  isActive?: boolean;
  onSelectProfile?: () => void;
}

export const SidebarProfileWidget: React.FC<SidebarProfileWidgetProps> = ({
  user,
  isCollapsed,
  isActive: propIsActive,
  onSelectProfile
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const logout = useAuthStore(s => s.logout);

  const isActive = propIsActive !== undefined ? propIsActive : location.pathname === '/profile';

  const handleClickProfile = () => {
    if (onSelectProfile) {
      onSelectProfile();
    }
    navigate('/profile');
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await logout();
    toast.info('Sesión cerrada correctamente.');
    navigate('/login');
  };

  const userName = user?.name || 'Juan Martín';
  const userRole = user?.globalRole === 'admin' ? 'Administrador' : 'Miembro de Equipo';

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        width: '100%',
        marginTop: 0
      }}
    >
      <button
        type="button"
        onClick={handleClickProfile}
        title={isCollapsed ? `${userName} (${userRole}) - Ver Perfil` : 'Editar Mi Perfil'}
        style={{
          padding: isCollapsed ? '8px 0' : '8px 10px',
          borderRadius: '8px',
          borderTop: isCollapsed ? '1px solid var(--border-subtle)' : undefined,
          border: !isCollapsed ? (isActive ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255,255,255,0.06)') : 'none',
          background: isActive ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255,255,255,0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: '10px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          textAlign: 'left',
          flex: 1,
          minWidth: 0
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.background = 'rgba(245, 158, 11, 0.06)';
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
        }}
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={userName}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: isActive ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
              flexShrink: 0
            }}
          />
        ) : (
          <div 
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: isActive ? '#f59e0b' : 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: isActive ? '#000' : '#f59e0b',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.78rem',
              flexShrink: 0
            }}
          >
            {getInitials(userName)}
          </div>
        )}

        {!isCollapsed && (
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 500, color: isActive ? '#f59e0b' : '#fff', textOverflow: 'ellipsis', overflow: 'hidden', margin: 0 }}>
              {userName}
            </p>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 500 }}>
              {userRole} · Ver Perfil
            </span>
          </div>
        )}
      </button>

      {!isCollapsed && (
        <button
          type="button"
          onClick={handleLogout}
          title="Cerrar Sesión"
          className="btn-ghost"
          style={{
            padding: '8px',
            borderRadius: '6px',
            color: 'var(--text-dim)',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f87171';
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-dim)';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <LogOut size={16} />
        </button>
      )}
    </div>
  );
};

