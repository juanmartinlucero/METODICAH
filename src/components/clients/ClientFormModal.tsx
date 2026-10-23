import React, { useEffect } from 'react';
import { useForm, FormProvider, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Client, ClientType } from '@/types/metodicah';
import { Building2, User, Check, Lock } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { BaseModal } from '@/components/common/BaseModal';
import { Button, Badge } from '@/components/ui';
import { 
  clientFormSchema, 
  type ClientFormData,
  ClientCompanyFields, 
  ClientIndividualFields,
  INDUSTRY_OPTIONS,
  TAX_CONDITIONS_EMPRESA,
  TAX_CONDITIONS_PERSONA,
  EVENT_TYPES_PERSONA
} from './form';

interface ClientFormModalProps {
  isOpen: boolean;
  editingClient: Client | null;
  onClose: () => void;
  onSubmit: (clientData: Omit<Client, 'id' | 'createdAt'>) => void;
}

const getDefaultValues = (client: Client | null): ClientFormData => {
  if (client) {
    const type = client.clientType || (client.company ? 'empresa' : 'persona');
    return {
      clientType: type,
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      taxId: client.taxId || '',
      taxCondition: client.taxCondition || (type === 'empresa' ? TAX_CONDITIONS_EMPRESA[0] : TAX_CONDITIONS_PERSONA[0]),
      address: client.address || '',
      city: client.city || '',
      state: client.state || '',
      zipCode: client.zipCode || '',
      notes: client.notes || '',

      // Empresa
      company: client.company || '',
      fantasyName: client.fantasyName || '',
      contactRole: client.contactRole || '',
      industry: client.industry || INDUSTRY_OPTIONS[0],
      website: client.website || '',
      billingContactName: client.billingContactName || '',
      billingContactEmail: client.billingContactEmail || '',
      paymentTerms: client.paymentTerms || '',
      supplierRequirements: client.supplierRequirements || '',

      // Persona
      documentNumber: client.documentNumber || '',
      birthDate: client.birthDate || '',
      frequentEventType: client.frequentEventType || EVENT_TYPES_PERSONA[0],
      preferences: client.preferences || ''
    };
  }

  return {
    clientType: 'empresa',
    name: '',
    email: '',
    phone: '',
    taxId: '',
    taxCondition: TAX_CONDITIONS_EMPRESA[0],
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
    company: '',
    fantasyName: '',
    contactRole: '',
    industry: INDUSTRY_OPTIONS[0],
    website: '',
    billingContactName: '',
    billingContactEmail: '',
    paymentTerms: '',
    supplierRequirements: '',
    documentNumber: '',
    birthDate: '',
    frequentEventType: EVENT_TYPES_PERSONA[0],
    preferences: ''
  };
};

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  editingClient,
  onClose,
  onSubmit
}) => {
  const toast = useToast();

  const methods = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: getDefaultValues(editingClient)
  });

  const { handleSubmit, reset, watch, setValue } = methods;
  const activeTab = watch('clientType');

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultValues(editingClient));
    }
  }, [isOpen, editingClient, reset]);

  if (!isOpen) return null;

  const handleTabSwitch = (newType: ClientType) => {
    setValue('clientType', newType);
    const currentTaxCondition = watch('taxCondition');
    if (!currentTaxCondition) {
      setValue('taxCondition', newType === 'empresa' ? TAX_CONDITIONS_EMPRESA[0] : TAX_CONDITIONS_PERSONA[0]);
    }
  };

  const onValidSubmit = (data: ClientFormData) => {
    const payload: Omit<Client, 'id' | 'createdAt'> = {
      clientType: data.clientType,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      taxId: data.taxId?.trim() || undefined,
      taxCondition: data.taxCondition?.trim() || undefined,
      address: data.address?.trim() || undefined,
      city: data.city?.trim() || undefined,
      state: data.state?.trim() || undefined,
      zipCode: data.zipCode?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
      activeEventsCount: editingClient ? editingClient.activeEventsCount : 0,

      // Empresa specific
      company: data.clientType === 'empresa' ? data.company?.trim() : undefined,
      fantasyName: data.clientType === 'empresa' ? (data.fantasyName?.trim() || undefined) : undefined,
      contactRole: data.clientType === 'empresa' ? (data.contactRole?.trim() || undefined) : undefined,
      industry: data.clientType === 'empresa' ? (data.industry?.trim() || undefined) : undefined,
      website: data.clientType === 'empresa' ? (data.website?.trim() || undefined) : undefined,
      billingContactName: data.clientType === 'empresa' ? (data.billingContactName?.trim() || undefined) : undefined,
      billingContactEmail: data.clientType === 'empresa' ? (data.billingContactEmail?.trim() || undefined) : undefined,
      paymentTerms: data.clientType === 'empresa' ? (data.paymentTerms?.trim() || undefined) : undefined,
      supplierRequirements: data.clientType === 'empresa' ? (data.supplierRequirements?.trim() || undefined) : undefined,

      // Persona specific
      documentNumber: data.clientType === 'persona' ? (data.documentNumber?.trim() || undefined) : undefined,
      birthDate: data.clientType === 'persona' ? (data.birthDate || undefined) : undefined,
      frequentEventType: data.clientType === 'persona' ? (data.frequentEventType?.trim() || undefined) : undefined,
      preferences: data.clientType === 'persona' ? (data.preferences?.trim() || undefined) : undefined,
    };

    onSubmit(payload);
  };

  const onInvalidSubmit = (errors: FieldErrors<ClientFormData>) => {
    const firstKey = Object.keys(errors)[0] as keyof ClientFormData | undefined;
    if (firstKey && errors[firstKey]?.message) {
      toast.warning(String(errors[firstKey]?.message));
    } else {
      toast.warning('Por favor verifica los campos marcados en rojo.');
    }
  };

  return (
    <BaseModal
      isOpen={true}
      onClose={onClose}
      title={editingClient ? 'Editar Ficha de Cliente' : 'Registrar Nuevo Cliente'}
      subtitle={editingClient ? 'Modifica la información del cliente.' : 'Selecciona el tipo de cliente para personalizar el formulario.'}
      icon={activeTab === 'empresa' ? <Building2 size={20} /> : <User size={20} />}
      maxWidth="720px"
      bodyPadding="0"
    >
      {/* TAB SELECTOR / LOCKED TYPE BANNER */}
      <div style={{ padding: '14px 24px 0 24px', background: 'rgba(0,0,0,0.15)' }}>
        {editingClient ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            borderRadius: '8px',
            background: activeTab === 'empresa' ? 'rgba(139, 92, 246, 0.12)' : 'rgba(16, 185, 129, 0.12)',
            border: activeTab === 'empresa' ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {activeTab === 'empresa' ? <Building2 size={18} color="#c4b5fd" /> : <User size={18} color="#6ee7b7" />}
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: activeTab === 'empresa' ? '#c4b5fd' : '#6ee7b7' }}>
                {activeTab === 'empresa' ? '🏢 Editando Empresa (Persona Jurídica)' : '👤 Editando Persona (Particular)'}
              </span>
            </div>
            <Badge variant="default" size="sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={12} />
              <span>Tipo no modificable</span>
            </Badge>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <button
              type="button"
              onClick={() => handleTabSwitch('empresa')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                border: activeTab === 'empresa' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid var(--border-subtle)',
                background: activeTab === 'empresa' ? 'rgba(139, 92, 246, 0.18)' : 'rgba(255,255,255,0.02)',
                color: activeTab === 'empresa' ? '#c4b5fd' : 'var(--text-muted)'
              }}
            >
              <Building2 size={18} />
              <span>🏢 Empresa (Corporativo / B2B)</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('persona')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                border: activeTab === 'persona' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                background: activeTab === 'persona' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255,255,255,0.02)',
                color: activeTab === 'persona' ? '#6ee7b7' : 'var(--text-muted)'
              }}
            >
              <User size={18} />
              <span>👤 Persona (Particular / B2C)</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal Form Content */}
      <FormProvider {...methods}>
        <form 
          onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} 
          style={{ overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          {activeTab === 'empresa' ? <ClientCompanyFields /> : <ClientIndividualFields />}

          {/* Modal Actions Footer */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '12px', 
            marginTop: '10px',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px'
          }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" leftIcon={<Check size={16} />}>
              {editingClient ? 'Guardar Cambios' : 'Registrar Cliente'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseModal>
  );
};
