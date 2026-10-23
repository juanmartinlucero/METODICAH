import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastContext, type ToastType, type ToastItem } from './toastContextDef';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, title?: string, duration = 4000) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastItem = { id, type, message, title, duration };

    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message: string, title?: string, duration?: number) => {
    addToast('success', message, title, duration);
  }, [addToast]);

  const error = useCallback((message: string, title?: string, duration?: number) => {
    addToast('error', message, title, duration);
  }, [addToast]);

  const warning = useCallback((message: string, title?: string, duration?: number) => {
    addToast('warning', message, title, duration);
  }, [addToast]);

  const info = useCallback((message: string, title?: string, duration?: number) => {
    addToast('info', message, title, duration);
  }, [addToast]);

  const getToastColors = (type: ToastType) => {
    switch (type) {
      case 'success':
        return { color: '#10b981', border: 'rgba(16, 185, 129, 0.4)', bg: 'rgba(6, 78, 59, 0.25)', icon: CheckCircle2 };
      case 'error':
        return { color: '#ef4444', border: 'rgba(239, 68, 68, 0.4)', bg: 'rgba(127, 29, 29, 0.25)', icon: AlertCircle };
      case 'warning':
        return { color: '#f59e0b', border: 'rgba(245, 158, 11, 0.4)', bg: 'rgba(120, 53, 15, 0.25)', icon: AlertTriangle };
      case 'info':
      default:
        return { color: '#38bdf8', border: 'rgba(56, 189, 248, 0.4)', bg: 'rgba(12, 74, 110, 0.25)', icon: Info };
    }
  };

  const portalElement = typeof document !== 'undefined' ? document.body : null;

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      {portalElement && createPortal(
        <div
          role="region"
          aria-label="Notificaciones"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '420px',
            width: 'calc(100vw - 48px)',
            pointerEvents: 'none'
          }}
        >
          {toasts.map(toast => {
            const config = getToastColors(toast.type);
            const Icon = config.icon;

            return (
              <div
                key={toast.id}
                role="status"
                style={{
                  pointerEvents: 'auto',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 16px',
                  background: 'rgba(13, 18, 30, 0.92)',
                  backdropFilter: 'blur(16px)',
                  border: `1px solid ${config.border}`,
                  borderLeft: `4px solid ${config.color}`,
                  borderRadius: '10px',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.55)',
                  color: '#fff',
                  animation: 'toastSlideIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div style={{ color: config.color, marginTop: '2px', flexShrink: 0 }}>
                  <Icon size={18} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {toast.title && (
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>
                      {toast.title}
                    </h4>
                  )}
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.45, margin: 0, wordBreak: 'break-word' }}>
                    {toast.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  aria-label="Cerrar notificación"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim, #64748b)',
                    cursor: 'pointer',
                    padding: '2px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '1px'
                  }}
                >
                  <X size={15} />
                </button>
              </div>
            );
          })}
        </div>,
        portalElement
      )}
    </ToastContext.Provider>
  );
};
