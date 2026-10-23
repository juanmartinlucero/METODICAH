import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { CrewFormData } from './crewSchema';
import { formatTaxId } from '@/utils/clientUtils';
import { Input } from '@/components/ui';

export const CrewIdentityFields: React.FC = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext<CrewFormData>();
  const taxId = watch('taxId') || '';

  const handleTaxIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTaxId(e.target.value);
    setValue('taxId', formatted, { shouldValidate: true });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h4 style={{ fontSize: '0.85rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, margin: 0 }}>
        1. Datos Personales & Documentación
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px' }}>
        <Input
          label="Nombre y Apellido"
          required
          placeholder="ej: Juan Martín"
          error={errors.userName?.message}
          {...register('userName')}
        />

        <Input
          label="DNI / Documento"
          placeholder="ej: 34.890.122"
          error={errors.documentNumber?.message}
          {...register('documentNumber')}
        />

        <Input
          label="CUIL"
          placeholder="20-34890122-3"
          value={taxId}
          onChange={handleTaxIdChange}
          error={errors.taxId?.message}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
        <Input
          label="Fecha de Nacimiento"
          type="date"
          error={errors.birthDate?.message}
          {...register('birthDate')}
        />

        <Input
          label="URL de Foto / Avatar"
          type="url"
          placeholder="https://images.unsplash.com/..."
          error={errors.avatarUrl?.message}
          {...register('avatarUrl')}
        />
      </div>
    </div>
  );
};
