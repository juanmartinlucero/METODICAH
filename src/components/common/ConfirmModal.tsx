import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { BaseModal } from './BaseModal';
import { Button } from '../ui';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'danger'
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={<AlertTriangle size={18} />}
      maxWidth="440px"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
        {description}
      </p>
    </BaseModal>
  );
};
