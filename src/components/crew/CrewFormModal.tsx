import React, { useEffect } from 'react';
import { useForm, FormProvider, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { EventCrewMember, CrewContractType, CrewSeniority } from '@/types/metodicah';
import { DEFAULT_CREW_SECTORS } from '@/utils/crewUtils';
import { UserCheck, Check } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { BaseModal } from '@/components/common/BaseModal';
import { Button } from '@/components/ui';
import {
  crewFormSchema,
  type CrewFormData,
  CrewIdentityFields,
  CrewRoleContractFields,
  CrewContactEmergencyFields,
  CrewSafetyBackstageFields,
  CrewAccessFields
} from './form';

interface CrewFormModalProps {
  isOpen: boolean;
  editingMember: EventCrewMember | null;
  onClose: () => void;
  onSubmit: (payload: Omit<EventCrewMember, 'id' | 'userId'> & { password?: string }) => void;
  sectors?: string[];
}

const getDefaultCrewValues = (
  editingMember: EventCrewMember | null,
  sectors: string[]
): CrewFormData => {
  if (editingMember) {
    const isSectorKnown = sectors.includes(editingMember.sector);
    return {
      userName: editingMember.userName || '',
      documentNumber: editingMember.documentNumber || '',
      taxId: editingMember.taxId || '',
      birthDate: editingMember.birthDate || '',
      avatarUrl: editingMember.avatarUrl || '',
      type: editingMember.type || 'staff_interno',
      sector: isSectorKnown ? editingMember.sector : 'otro',
      customSector: isSectorKnown ? '' : (editingMember.sector || ''),
      roleInEvent: editingMember.roleInEvent || '',
      seniority: editingMember.seniority || 'senior',
      userEmail: editingMember.userEmail || '',
      phone: editingMember.phone || '',
      emergencyContactName: editingMember.emergencyContactName || '',
      emergencyContactPhone: editingMember.emergencyContactPhone || '',
      city: editingMember.city || '',
      artInsurance: editingMember.artInsurance || '',
      clothingSize: editingMember.clothingSize || 'L',
      dietaryRestrictions: editingMember.dietaryRestrictions || 'Estándar',
      notes: editingMember.notes || '',
      hasSystemAccess: editingMember.hasSystemAccess ?? false,
      globalRole: editingMember.globalRole || 'team_member',
      password: ''
    };
  }

  return {
    userName: '',
    documentNumber: '',
    taxId: '',
    birthDate: '',
    avatarUrl: '',
    type: 'staff_interno',
    sector: sectors[0] || 'Producción General',
    customSector: '',
    roleInEvent: '',
    seniority: 'senior',
    userEmail: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    city: '',
    artInsurance: '',
    clothingSize: 'L',
    dietaryRestrictions: 'Estándar',
    notes: '',
    hasSystemAccess: false,
    globalRole: 'team_member',
    password: ''
  };
};

export const CrewFormModal: React.FC<CrewFormModalProps> = ({
  isOpen,
  editingMember,
  onClose,
  onSubmit,
  sectors = DEFAULT_CREW_SECTORS
}) => {
  const toast = useToast();

  const methods = useForm<CrewFormData>({
    resolver: zodResolver(crewFormSchema),
    defaultValues: getDefaultCrewValues(editingMember, sectors)
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultCrewValues(editingMember, sectors));
    }
  }, [isOpen, editingMember, sectors, reset]);

  if (!isOpen) return null;

  const onValidSubmit = (data: CrewFormData) => {
    const effectiveSector = data.sector === 'otro' && data.customSector?.trim()
      ? data.customSector.trim()
      : data.sector;

    onSubmit({
      userName: data.userName.trim(),
      documentNumber: data.documentNumber?.trim() || undefined,
      taxId: data.taxId?.trim() || undefined,
      birthDate: data.birthDate || undefined,
      avatarUrl: data.avatarUrl?.trim() || undefined,
      type: data.type as CrewContractType,
      sector: effectiveSector,
      roleInEvent: data.roleInEvent.trim(),
      seniority: data.seniority as CrewSeniority,
      userEmail: data.userEmail.trim(),
      phone: data.phone?.trim() || undefined,
      emergencyContactName: data.emergencyContactName?.trim() || undefined,
      emergencyContactPhone: data.emergencyContactPhone?.trim() || undefined,
      city: data.city?.trim() || undefined,
      artInsurance: data.artInsurance?.trim() || undefined,
      clothingSize: data.clothingSize,
      dietaryRestrictions: data.dietaryRestrictions,
      notes: data.notes?.trim() || undefined,
      activeEventsCount: editingMember ? editingMember.activeEventsCount : 0,
      hasSystemAccess: Boolean(data.hasSystemAccess),
      globalRole: data.hasSystemAccess ? data.globalRole : undefined,
      password: data.password?.trim() || undefined
    });
  };

  const onInvalidSubmit = (errors: FieldErrors<CrewFormData>) => {
    const firstKey = Object.keys(errors)[0] as keyof CrewFormData | undefined;
    if (firstKey && errors[firstKey]?.message) {
      toast.warning(String(errors[firstKey]?.message));
    } else {
      toast.warning('Por favor completa todos los campos obligatorios marcados con *');
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={editingMember ? 'Editar Miembro de Equipo' : 'Nuevo Miembro de Crew'}
      subtitle={editingMember ? `Modificando ficha de ${editingMember.userName}` : 'Alta de personal técnico, directores o colaboradores freelance'}
      icon={<UserCheck size={20} />}
      maxWidth="700px"
    >
      <FormProvider {...methods}>
        <form 
          onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} 
          style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <CrewIdentityFields />
          <CrewRoleContractFields sectors={sectors} />
          <CrewContactEmergencyFields />
          <CrewSafetyBackstageFields />
          <CrewAccessFields />

          {/* Footer Actions */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '10px', 
            borderTop: '1px solid var(--border-subtle)', 
            paddingTop: '16px',
            marginTop: '8px'
          }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" leftIcon={<Check size={16} />}>
              {editingMember ? 'Guardar Cambios' : 'Registrar Miembro'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseModal>
  );
};
