import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { SupplierCategoryConfig } from '@/types/metodicah';
import type { SupplierFormData } from './supplierSchema';
import { TAX_CONDITIONS_SUPPLIER } from './supplierSchema';
import { formatTaxId } from '@/utils/clientUtils';
import { Input, Select } from '@/components/ui';

interface SupplierIdentityFieldsProps {
  categories: SupplierCategoryConfig[];
}

export const SupplierIdentityFields: React.FC<SupplierIdentityFieldsProps> = ({ categories }) => {
  const { register, watch, setValue, formState: { errors } } = useFormContext<SupplierFormData>();
  const taxId = watch('taxId') || '';

  const handleTaxIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTaxId(e.target.value);
    setValue('taxId', formatted, { shouldValidate: true });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <h4 style={{ fontSize: '0.85rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, margin: 0 }}>
          1. Identidad Comercial & Rubro
        </h4>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        <Input
          label="Nombre Comercial / Fantasía"
          required
          placeholder="ej: MaxiSound Pro"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Razón Social / Empresa"
          placeholder="ej: MaxiSound Audio Systems S.R.L."
          error={errors.company?.message}
          {...register('company')}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <Select
          label="Rubro Técnico"
          required
          error={errors.category?.message}
          {...register('category')}
        >
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </Select>

        <Input
          label="CUIT"
          placeholder="30-71122334-9"
          value={taxId}
          onChange={handleTaxIdChange}
          error={errors.taxId?.message}
        />

        <Select
          label="Condición IVA"
          error={errors.taxCondition?.message}
          {...register('taxCondition')}
        >
          {TAX_CONDITIONS_SUPPLIER.map(cond => (
            <option key={cond} value={cond}>{cond}</option>
          ))}
        </Select>
      </div>
    </div>
  );
};
