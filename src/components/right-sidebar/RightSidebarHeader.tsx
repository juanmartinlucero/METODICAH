import React from 'react';
import { PanelRightClose, PanelRightOpen, Activity, X } from 'lucide-react';

export interface RightSidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile?: () => void;
}

export const RightSidebarHeader: React.FC<RightSidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
  onCloseMobile
}) => {
  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border-subtle)',
        minHeight: '48px'
      }}
    >
      {!isCollapsed ? (
        <>
          {/* Collapse button with correct right orientation pointing into panel */}
          <button
            onClick={onToggleCollapse}
            className="btn-ghost desktop-only-btn"
            title="Contraer analíticas (Ctrl+Alt+B)"
            style={{ 
              padding: '6px', 
              borderRadius: '6px', 
              flexShrink: 0,
              color: 'var(--text-muted)'
            }}
          >
            <PanelRightClose size={17} />
          </button>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile || onToggleCollapse}
            className="btn-ghost mobile-only-btn"
            title="Cerrar analítica"
            style={{ 
              padding: '6px', 
              borderRadius: '6px', 
              flexShrink: 0,
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>

          {/* Brand / Title Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', justifyContent: 'flex-end' }}>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textAlign: 'right' }}>
              <h1 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.04em', color: '#fff' }}>
                ANALÍTICA
              </h1>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 500, letterSpacing: '0.06em' }}>
                DATOS & INSIGHTS
              </p>
            </div>

            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b',
                flexShrink: 0
              }}
            >
              <Activity size={18} />
            </div>
          </div>
        </>
      ) : (
        /* Expand button when collapsed pointing out from right edge */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onToggleCollapse}
            className="btn-ghost"
            title="Expandir analíticas (Ctrl+Alt+B)"
            style={{ padding: '6px', borderRadius: '6px' }}
          >
            <PanelRightOpen size={17} />
          </button>
        </div>
      )}
    </div>
  );
};
