import React from 'react';
import type { 
  EventItem, 
  Client, 
  Supplier, 
  EventCrewMember, 
  EventStageConfig 
} from '../../types/metodicah';
import { useSidebarAnalytics } from './hooks/useSidebarAnalytics';
import { RightSidebarHeader } from './RightSidebarHeader';
import { RightSidebarCollapsed } from './RightSidebarCollapsed';
import { RightSidebarFooter } from './RightSidebarFooter';
import { EventContextAnalytics } from './cards/EventContextAnalytics';
import { DashboardAnalytics } from './cards/DashboardAnalytics';
import { EventsCatalogAnalytics } from './cards/EventsCatalogAnalytics';
import { ClientsAnalytics } from './cards/ClientsAnalytics';
import { SuppliersAnalytics } from './cards/SuppliersAnalytics';
import { CrewAnalytics } from './cards/CrewAnalytics';
import { SettingsAnalytics } from './cards/SettingsAnalytics';

import { useEventsStore, useClientsStore, useSuppliersStore, useCrewStore, useSettingsStore } from '../../stores';

export interface RightSidebarProps {
  activeTab: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  selectedEvent?: EventItem | null;
  events?: EventItem[];
  clients?: Client[];
  suppliers?: Supplier[];
  crewMembers?: EventCrewMember[];
  stages?: EventStageConfig[];
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  activeTab,
  isCollapsed,
  onToggleCollapse,
  selectedEvent: propSelectedEvent,
  events: propEvents,
  clients: propClients,
  suppliers: propSuppliers,
  crewMembers: propCrewMembers,
  stages: propStages,
  isMobileOpen,
  onCloseMobile
}) => {
  const storeEvent = useEventsStore(s => s.selectedEvent);
  const storeEvents = useEventsStore(s => s.events);
  const storeClients = useClientsStore(s => s.clients);
  const storeSuppliers = useSuppliersStore(s => s.suppliers);
  const storeCrew = useCrewStore(s => s.crewMembers);
  const storeStages = useSettingsStore(s => s.stages);

  const selectedEvent = propSelectedEvent !== undefined ? propSelectedEvent : storeEvent;
  const events = propEvents ?? storeEvents;
  const clients = propClients ?? storeClients;
  const suppliers = propSuppliers ?? storeSuppliers;
  const crewMembers = propCrewMembers ?? storeCrew;
  const stages = propStages ?? storeStages;
  const effectiveCollapsed = isMobileOpen ? false : isCollapsed;

  const {
    activeTabLabel,
    totalAttendees,
    activeEventsCount,
    corporateClientsCount,
    individualClientsCount,
    currentYear,
    eventsThisYear,
    staffCrewCount,
    freelanceCrewCount,
    activeStagesList,
    upcomingEvent,
    selectedEventStage
  } = useSidebarAnalytics({
    activeTab,
    selectedEvent,
    events,
    clients,
    suppliers,
    crewMembers,
    stages
  });

  return (
    <aside
      className={`right-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
      style={{
        width: effectiveCollapsed ? '68px' : '240px',
        background: 'var(--bg-sidebar)',
        borderLeft: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: 40,
        transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: effectiveCollapsed ? '20px 10px' : '20px 14px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Top Header */}
      <RightSidebarHeader 
        isCollapsed={effectiveCollapsed} 
        onToggleCollapse={onToggleCollapse} 
        onCloseMobile={onCloseMobile}
      />

      {/* Main Content Area */}
      {effectiveCollapsed ? (
        <RightSidebarCollapsed
          totalEventsCount={events.length}
          activeEventsCount={activeEventsCount}
          totalClientsCount={clients.length}
          totalCrewCount={crewMembers.length}
          totalSuppliersCount={suppliers.length}
          onExpand={onToggleCollapse}
        />
      ) : (
        <div 
          style={{ 
            marginTop: '16px', 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingRight: '2px'
          }}
          className="custom-scrollbar"
        >
          {/* Active Context Header Badge */}
          <div 
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              background: selectedEvent ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.03)',
              border: selectedEvent ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span 
                style={{ 
                  fontSize: '0.62rem', 
                  fontWeight: 700, 
                  color: selectedEvent ? '#f59e0b' : 'var(--text-dim)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em' 
                }}
              >
                {selectedEvent ? 'Ficha de Evento' : 'Vista Actual'}
              </span>
              {selectedEvent && (
                <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                  {selectedEvent.code}
                </span>
              )}
            </div>
            <p 
              style={{ 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                color: '#fff', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                margin: 0
              }}
              title={selectedEvent ? selectedEvent.title : activeTabLabel}
            >
              {selectedEvent ? selectedEvent.title : activeTabLabel}
            </p>
          </div>

          {/* Dynamic Metric Cards Based on Context */}
          {selectedEvent ? (
            <EventContextAnalytics 
              event={selectedEvent} 
              stageInfo={selectedEventStage} 
            />
          ) : activeTab === 'dashboard' ? (
            <DashboardAnalytics
              totalEventsCount={events.length}
              activeEventsCount={activeEventsCount}
              totalAttendees={totalAttendees}
              upcomingEvent={upcomingEvent}
            />
          ) : activeTab === 'events' ? (
            <EventsCatalogAnalytics
              totalEventsCount={events.length}
              eventsThisYear={eventsThisYear}
              currentYear={currentYear}
              activeStagesList={activeStagesList}
            />
          ) : activeTab === 'clients' ? (
            <ClientsAnalytics
              totalClientsCount={clients.length}
              corporateClientsCount={corporateClientsCount}
              individualClientsCount={individualClientsCount}
            />
          ) : activeTab === 'suppliers' ? (
            <SuppliersAnalytics suppliers={suppliers} />
          ) : activeTab === 'crew' ? (
            <CrewAnalytics
              totalCrewCount={crewMembers.length}
              staffCrewCount={staffCrewCount}
              freelanceCrewCount={freelanceCrewCount}
            />
          ) : (
            <SettingsAnalytics stages={stages} />
          )}
        </div>
      )}

      {/* Footer with Status & Shortcut */}
      <RightSidebarFooter isCollapsed={isCollapsed} />
    </aside>
  );
};
