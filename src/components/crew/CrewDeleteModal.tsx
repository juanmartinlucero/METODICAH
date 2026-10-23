import React from 'react';
import type { EventCrewMember } from '../../types/metodicah';
import { Trash2 } from 'lucide-react';
import { BaseModal } from '../common/BaseModal';
import { Button } from '../ui';

interface CrewDeleteModalProps {
  member: EventCrewMember | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const CrewDeleteModal: React.FC<CrewDeleteModalProps> = ({
  member,
  onClose,
  onConfirm
}) => {
  if (!member) return null;

  return (
    <BaseModal
      isOpen={!!member}
      onClose={onClose}
      title="Eliminar Miembro de Equipo"
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
            Eliminar Miembro
          </Button>
        </>
      }
    >
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
        ¿Estás seguro de que deseas eliminar a <strong style={{ color: '#fff' }}>{member.userName}</strong> ({member.roleInEvent}) del registro de equipo?
      </p>
    </BaseModal>
  );
};
