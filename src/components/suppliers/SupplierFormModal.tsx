import React, { useEffect } from 'react';
import { useForm, FormProvider, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Supplier, SupplierCategory, SupplierCategoryConfig } from '@/types/metodicah';
import { DEFAULT_SUPPLIER_CATEGORIES } from '@/utils/supplierUtils';
import { Building2, Check } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { BaseModal } from '@/components/common/BaseModal';
import { Button } from '@/components/ui';
import {
  supplierFormSchema,
  type SupplierFormData,
  SupplierIdentityFields,
  SupplierContactFields,
  SupplierOperationsFields
} from './form';

interface SupplierFormModalProps {
  isOpen: boolean;
  editingSupplier: Supplier | null;
  onClose: () => void;
  onSubmit: (payload: Omit<Supplier, 'id' | 'createdAt'>) => void;
  categories?: SupplierCategoryConfig[];
}

const getDefaultSupplierValues = (
  editingSupplier: Supplier | null,
  categories: SupplierCategoryConfig[]
): SupplierFormData => {
  if (editingSupplier) {
    return {
      name: editingSupplier.name || '',
      company: editingSupplier.company || '',
      category: editingSupplier.category || categories[0]?.id || 'audio',
      taxId: editingSupplier.taxId || '',
      taxCondition: editingSupplier.taxCondition || 'Responsable Inscripto',
      contactName: editingSupplier.contactName || '',
      contactRole: editingSupplier.contactRole || '',
      email: editingSupplier.email || '',
      phone: editingSupplier.phone || '',
      emergencyPhone: editingSupplier.emergencyPhone || '',
      website: editingSupplier.website || '',
      equipmentHighlights: editingSupplier.equipmentHighlights || '',
      billingEmail: editingSupplier.billingEmail || '',
      paymentTerms: editingSupplier.paymentTerms || '',
      address: editingSupplier.address || '',
      city: editingSupplier.city || '',
      state: editingSupplier.state || 'Buenos Aires',
      zipCode: editingSupplier.zipCode || '',
      notes: editingSupplier.notes || ''
    };
  }

  return {
    name: '',
    company: '',
    category: categories[0]?.id || 'audio',
    taxId: '',
    taxCondition: 'Responsable Inscripto',
    contactName: '',
    contactRole: '',
    email: '',
    phone: '',
    emergencyPhone: '',
    website: '',
    equipmentHighlights: '',
    billingEmail: '',
    paymentTerms: '',
    address: '',
    city: '',
    state: 'Buenos Aires',
    zipCode: '',
    notes: ''
  };
};

export const SupplierFormModal: React.FC<SupplierFormModalProps> = ({
  isOpen,
  editingSupplier,
  onClose,
  onSubmit,
  categories = DEFAULT_SUPPLIER_CATEGORIES
}) => {
  const toast = useToast();

  const methods = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: getDefaultSupplierValues(editingSupplier, categories)
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultSupplierValues(editingSupplier, categories));
    }
  }, [isOpen, editingSupplier, categories, reset]);

  if (!isOpen) return null;

  const onValidSubmit = (data: SupplierFormData) => {
    onSubmit({
      name: data.name.trim(),
      company: data.company?.trim() || data.name.trim(),
      category: data.category as SupplierCategory,
      taxId: data.taxId?.trim() || undefined,
      taxCondition: data.taxCondition,
      contactName: data.contactName?.trim() || undefined,
      contactRole: data.contactRole?.trim() || undefined,
      email: data.email.trim(),
      phone: data.phone.trim(),
      emergencyPhone: data.emergencyPhone?.trim() || undefined,
      website: data.website?.trim() || undefined,
      equipmentHighlights: data.equipmentHighlights?.trim() || undefined,
      billingEmail: data.billingEmail?.trim() || undefined,
      paymentTerms: data.paymentTerms?.trim() || undefined,
      address: data.address?.trim() || undefined,
      city: data.city?.trim() || undefined,
      state: data.state || 'Buenos Aires',
      zipCode: data.zipCode?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
      activeEventsCount: editingSupplier ? editingSupplier.activeEventsCount : 0
    });
  };

  const onInvalidSubmit = (errors: FieldErrors<SupplierFormData>) => {
    const firstKey = Object.keys(errors)[0] as keyof SupplierFormData | undefined;
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
      title={editingSupplier ? 'Editar Proveedor Técnico' : 'Registrar Nuevo Proveedor'}
      subtitle={editingSupplier ? `Modificando los datos de ${editingSupplier.name}` : 'Nuevo partner técnico especializado para eventos'}
      icon={<Building2 size={20} />}
      maxWidth="700px"
    >
      <FormProvider {...methods}>
        <form 
          onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} 
          style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <SupplierIdentityFields categories={categories} />
          <SupplierContactFields />
          <SupplierOperationsFields />

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
              {editingSupplier ? 'Guardar Cambios' : 'Registrar Proveedor'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseModal>
  );
};
