import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingFallbackProps {
  message?: string;
}

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = 'Cargando módulo...' 
}) => {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        width: '100%',
        gap: '14px',
        color: 'var(--text-muted, #94a3b8)'
      }}
    >
      <Loader2 
        size={32} 
        style={{ 
          color: '#f59e0b', 
          animation: 'spin 1s linear infinite' 
        }} 
      />
      <span style={{ fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.02em' }}>
        {message}
      </span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
