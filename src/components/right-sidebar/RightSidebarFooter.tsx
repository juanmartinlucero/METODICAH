import React from 'react';

export interface RightSidebarFooterProps {
  isCollapsed: boolean;
}

export const RightSidebarFooter: React.FC<RightSidebarFooterProps> = ({ isCollapsed }) => {
  return (
    <div 
      style={{
        marginTop: 'auto',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      {!isCollapsed ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Live Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div 
              style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                background: '#10b981',
                boxShadow: '0 0 6px #10b981'
              }} 
            />
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 500 }}>
              En vivo
            </span>
          </div>

          {/* Keyboard Shortcut Pill */}
          <span 
            style={{ 
              fontSize: '0.65rem', 
              color: 'var(--text-dim)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-subtle)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}
            title="Atajo de teclado para alternar este panel"
          >
            Ctrl+Alt+B
          </span>
        </div>
      ) : (
        <div 
          title="Analítica activa (Ctrl+Alt+B)"
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '4px 0' 
          }}
        >
          <div 
            style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              background: '#10b981',
              boxShadow: '0 0 6px #10b981'
            }} 
          />
        </div>
      )}
    </div>
  );
};
