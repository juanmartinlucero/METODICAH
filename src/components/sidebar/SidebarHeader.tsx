import React from 'react';
import { PanelLeftClose, PanelLeftOpen, Sparkles, X } from 'lucide-react';

export interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  companyLogo?: string | null;
  onCloseMobile?: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
  companyLogo,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt="Company Logo" 
                style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '6px' }} 
              />
            ) : (
              <div style={{
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
              }}>
                <Sparkles size={18} />
              </div>
            )}
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <h1 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.04em', color: '#fff' }}>
                METODICAH
              </h1>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 500, letterSpacing: '0.06em' }}>
                STUDIO CONTROL
              </p>
            </div>
          </div>

          <button
            onClick={onToggleCollapse}
            className="btn-ghost desktop-only-btn"
            title="Contraer sidebar (Ctrl+B)"
            style={{ padding: '6px', borderRadius: '6px', flexShrink: 0 }}
          >
            <PanelLeftClose size={17} />
          </button>

          <button
            onClick={onCloseMobile || onToggleCollapse}
            className="btn-ghost mobile-only-btn"
            title="Cerrar navegación"
            style={{ padding: '6px', borderRadius: '6px', flexShrink: 0 }}
          >
            <X size={18} />
          </button>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onToggleCollapse}
            className="btn-ghost"
            title="Expandir sidebar (Ctrl+B)"
            style={{ padding: '6px', borderRadius: '6px' }}
          >
            <PanelLeftOpen size={17} />
          </button>
        </div>
      )}
    </div>
  );
};
