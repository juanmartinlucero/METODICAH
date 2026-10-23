import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

let openModalCount = 0;
let savedOverflow = '';
let savedPaddingRight = '';

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  customHeader?: React.ReactNode;
  maxWidth?: string;
  bodyPadding?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  ariaLabel?: string;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  customHeader,
  maxWidth = '720px',
  bodyPadding = '24px',
  children,
  footer,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  ariaLabel
}) => {
  const panelRef = useFocusTrap<HTMLDivElement>(isOpen);

  // 1. Listen for Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (closeOnEsc && e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    }
  }, [closeOnEsc, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // 2. Lock body scroll while open with scrollbar width compensation
  useEffect(() => {
    if (!isOpen) return;

    if (openModalCount === 0) {
      savedOverflow = document.body.style.overflow;
      savedPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }
    openModalCount += 1;

    return () => {
      openModalCount = Math.max(0, openModalCount - 1);
      if (openModalCount === 0) {
        document.body.style.overflow = savedOverflow;
        document.body.style.paddingRight = savedPaddingRight;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : ariaLabel || 'Modal'}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(4, 7, 12, 0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        boxSizing: 'border-box'
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '14px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'var(--bg-sidebar)',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        {customHeader ? (
          customHeader
        ) : (title || icon) ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-sidebar)',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {icon && (
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f59e0b',
                    flexShrink: 0
                  }}
                >
                  {icon}
                </div>
              )}
              <div>
                {title && (
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
              aria-label="Cerrar modal"
              style={{
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px'
              }}
            >
              <X size={18} />
            </button>
          </div>
        ) : null}

        {/* Scrollable Body */}
        <div
          style={{
            padding: bodyPadding,
            overflowY: 'auto',
            flex: 1,
            boxSizing: 'border-box'
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-sidebar)',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
