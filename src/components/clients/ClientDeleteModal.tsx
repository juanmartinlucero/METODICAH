import React from 'react';
import type { Client } from '../../types/metodicah';
import { Trash2 } from 'lucide-react';
import { BaseModal } from '../common/BaseModal';
import { Button } from '../ui';

interface ClientDeleteModalProps {
  client: Client | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ClientDeleteModal: React.FC<ClientDeleteModalProps> = ({
  client,
  onClose,
  onConfirm
}) => {
  if (!client) return null;

  const clientName = client.fantasyName || client.company || client.name;

  return (
    <BaseModal
      isOpen={!!client}
      onClose={onClose}
      title="Eliminar Cliente"
      icon={<Trash2 size={18} />}
      maxWidth="460px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            leftIcon={<Trash2 size={14} />}
          >
            Eliminar Cliente
          </Button>
        </>
      }
    >
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
        ¿Estás seguro de que deseas eliminar a <strong style={{ color: '#fff' }}>{clientName}</strong> del directorio?
      </p>
    </BaseModal>
  );
};
