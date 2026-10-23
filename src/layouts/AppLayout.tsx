import React, { lazy, Suspense, useEffect } from 'react';
import { Outlet } from 'react-router';
import { Menu, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Sidebar } from '../components/sidebar';
import { RightSidebar } from '../components/right-sidebar';
import { LoadingFallback } from '../components/common/LoadingFallback';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { useNavigation } from '../hooks/useNavigation';
import {
  useEventsStore,
  useClientsStore,
  useSuppliersStore,
  useCrewStore,
  useWorkflowStore
} from '../stores';

const NewEventModal = lazy(() => 
  import('../components/NewEventModal').then(m => ({ default: m.NewEventModal }))
);

export const AppLayout: React.FC = () => {
  const {
    activeTab,
    isSidebarCollapsed,
    toggleSidebar,
    isRightSidebarCollapsed,
    toggleRightSidebar,
    isMobileNavOpen,
    toggleMobileNav,
    closeMobileNav,
    isMobileAnalyticsOpen,
    toggleMobileAnalytics,
    closeMobileAnalytics
  } = useNavigation();

  const isNewEventModalOpen = useEventsStore(s => s.isNewEventModalOpen);
  const closeNewEventModal = useEventsStore(s => s.closeNewEventModal);

  useEffect(() => {
    const unsubEvents = useEventsStore.getState().subscribeEvents();
    const unsubClients = useClientsStore.getState().subscribeClients();
    const unsubSuppliers = useSuppliersStore.getState().subscribeSuppliers();
    const unsubCrew = useCrewStore.getState().subscribeCrewMembers();
    const unsubWorkflows = useWorkflowStore.getState().subscribeWorkflows();

    return () => {
      unsubEvents();
      unsubClients();
      unsubSuppliers();
      unsubCrew();
      unsubWorkflows();
    };
  }, []);

  const isDashboard = activeTab === 'dashboard';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Mobile Sticky Topbar */}
      <header className="mobile-topbar">
        <button
          onClick={toggleMobileNav}
          className="btn-ghost"
          aria-label={isMobileNavOpen ? 'Cerrar navegación' : 'Abrir navegación'}
          style={{ padding: '8px', borderRadius: '8px', color: '#fff' }}
        >
          {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b'
            }}
          >
            <Sparkles size={15} />
          </div>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.04em', color: '#fff' }}>
            METODICAH
          </span>
        </div>

        <button
          onClick={toggleMobileAnalytics}
          className="btn-ghost"
          aria-label={isMobileAnalyticsOpen ? 'Cerrar analítica' : 'Abrir analítica'}
          style={{
            padding: '8px',
            borderRadius: '8px',
            color: isMobileAnalyticsOpen ? '#f59e0b' : 'var(--text-muted)'
          }}
        >
          <SlidersHorizontal size={18} />
        </button>
      </header>

      {/* Backdrop overlay for mobile drawers */}
      {(isMobileNavOpen || isMobileAnalyticsOpen) && (
        <div
          className="sidebar-backdrop"
          onClick={() => {
            closeMobileNav();
            closeMobileAnalytics();
          }}
          aria-hidden="true"
        />
      )}

      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={closeMobileNav}
      />

      {/* Main Content Layout Container */}
      <div
        className="app-content-wrapper"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: isSidebarCollapsed ? '68px' : '240px',
          paddingRight: isRightSidebarCollapsed ? '68px' : '240px',
          minWidth: 0,
          width: '100%',
          maxWidth: '100vw',
          boxSizing: 'border-box',
          transition: 'padding-left 0.22s cubic-bezier(0.4, 0, 0.2, 1), padding-right 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowX: 'hidden'
        }}
      >
        <main
          className="app-main-content"
          style={{
            padding: isDashboard ? '20px' : '32px 36px',
            flex: 1,
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            boxSizing: 'border-box'
          }}
        >
          <ErrorBoundary moduleName={activeTab}>
            <Suspense fallback={<LoadingFallback message="Cargando módulo..." />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>

      {/* Right Sidebar (Analytics & Context Data) */}
      <RightSidebar
        activeTab={activeTab}
        isCollapsed={isRightSidebarCollapsed}
        onToggleCollapse={toggleRightSidebar}
        isMobileOpen={isMobileAnalyticsOpen}
        onCloseMobile={closeMobileAnalytics}
      />

      {/* Modal for creating a new event */}
      {isNewEventModalOpen && (
        <Suspense fallback={null}>
          <NewEventModal
            isOpen={isNewEventModalOpen}
            onClose={closeNewEventModal}
          />
        </Suspense>
      )}
    </div>
  );
};
