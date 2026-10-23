import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export interface AuthAlertProps {
  message: string | null;
  type?: 'error' | 'success' | 'info';
  onClose?: () => void;
}

export const AuthAlert: React.FC<AuthAlertProps> = ({
  message,
  type = 'error',
  onClose
}) => {
  if (!message) return null;

  const config = {
    error: {
      bg: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.35)',
      color: '#f87171',
      icon: <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0 }} />
    },
    success: {
      bg: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.35)',
      color: '#34d399',
      icon: <CheckCircle2 size={16} color="#34d399" style={{ flexShrink: 0 }} />
    },
    info: {
      bg: 'rgba(59, 130, 246, 0.12)',
      border: 'rgba(59, 130, 246, 0.35)',
      color: '#60a5fa',
      icon: <Info size={16} color="#60a5fa" style={{ flexShrink: 0 }} />
    }
  }[type];

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        padding: '10px 14px',
        borderRadius: '8px',
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
        fontSize: '0.82rem',
        marginBottom: '16px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
        {config.icon}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar aviso"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            opacity: 0.8
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
