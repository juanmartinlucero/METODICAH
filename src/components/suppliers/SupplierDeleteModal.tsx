import React from 'react';
import type { Supplier } from '../../types/metodicah';
import { Trash2 } from 'lucide-react';
import { BaseModal } from '../common/BaseModal';
import { Button } from '../ui';

interface SupplierDeleteModalProps {
  supplier: Supplier | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const SupplierDeleteModal: React.FC<SupplierDeleteModalProps> = ({
  supplier,
  onClose,
  onConfirm
}) => {
  if (!supplier) return null;

  return (
    <BaseModal
      isOpen={!!supplier}
      onClose={onClose}
      title="Eliminar Proveedor"
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
            Eliminar Proveedor
          </Button>
        </>
      }
    >
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
        ¿Estás seguro de que deseas eliminar a <strong style={{ color: '#fff' }}>{supplier.name}</strong> ({supplier.company}) de la red de proveedores?
      </p>
    </BaseModal>
  );
};
