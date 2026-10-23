import React from 'react';
import { NavLink } from 'react-router';
import { SIDEBAR_MENU_ITEMS } from './sidebar.constants';

export interface SidebarNavProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isCollapsed: boolean;
  onItemClick?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  isCollapsed,
  onItemClick
}) => {
  return (
    <nav 
      style={{ 
        marginTop: '16px', 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '4px',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {SIDEBAR_MENU_ITEMS.map((item) => {
        const Icon = item.icon;
        
        return (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={onItemClick}
            className={({ isActive }) => `btn-ghost ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '12px',
              padding: isCollapsed ? '10px 0' : '10px 14px',
              width: '100%',
              borderRadius: '8px',
              color: isActive ? '#f59e0b' : 'var(--text-muted)',
              background: isActive ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
              border: isActive ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid transparent',
              transition: 'all 0.15s ease',
              textDecoration: 'none',
              boxSizing: 'border-box'
            })}
            title={isCollapsed ? item.label : undefined}
          >
            <Icon size={18} style={{ flexShrink: 0 }} />
            {!isCollapsed && (
              <span 
                style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {item.label}
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};
