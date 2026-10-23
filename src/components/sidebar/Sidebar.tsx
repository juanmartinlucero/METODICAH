import React from 'react';
import type { UserProfile } from '../../types/metodicah';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNav } from './SidebarNav';
import { SidebarDateWidget } from './SidebarDateWidget';
import { SidebarProfileWidget } from './SidebarProfileWidget';

import { useSettingsStore } from '../../stores';

export interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  companyLogo?: string | null;
  user?: UserProfile;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  isCollapsed,
  onToggleCollapse,
  companyLogo: propCompanyLogo,
  user: propUser,
  isMobileOpen,
  onCloseMobile
}) => {
  const storeLogo = useSettingsStore(s => s.companyLogo);
  const storeUser = useSettingsStore(s => s.currentUser);

  const companyLogo = propCompanyLogo !== undefined ? propCompanyLogo : storeLogo;
  const user = propUser ?? storeUser;
  const effectiveCollapsed = isMobileOpen ? false : isCollapsed;

  return (
    <aside 
      className={`app-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
      style={{
        width: effectiveCollapsed ? '68px' : '240px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 40,
        padding: effectiveCollapsed ? '20px 10px' : '20px 14px',
        transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowX: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. Header with brand & toggle */}
      <SidebarHeader 
        isCollapsed={effectiveCollapsed} 
        onToggleCollapse={onToggleCollapse} 
        companyLogo={companyLogo} 
        onCloseMobile={onCloseMobile}
      />

      {/* 2. Main Navigation items */}
      <SidebarNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={effectiveCollapsed} 
        onItemClick={onCloseMobile}
      />

      {/* 3. Ambient current date indicator */}
      <SidebarDateWidget 
        isCollapsed={effectiveCollapsed} 
      />

      {/* 4. Interactive user profile trigger */}
      <SidebarProfileWidget 
        user={user} 
        isCollapsed={effectiveCollapsed} 
        isActive={activeTab === 'profile'} 
        onSelectProfile={setActiveTab ? () => {
          setActiveTab('profile');
          onCloseMobile?.();
        } : undefined} 
      />
    </aside>
  );
};
