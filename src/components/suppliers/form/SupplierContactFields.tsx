import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { SupplierFormData } from './supplierSchema';
import { Input } from '@/components/ui';

export const SupplierContactFields: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<SupplierFormData>();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
      <h4 style={{ fontSize: '0.85rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, margin: 0 }}>
        2. Contacto Operativo & Urgencias
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        <Input
          label="Nombre de Contacto"
          placeholder="ej: Maximiliano Rossi"
          error={errors.contactName?.message}
          {...register('contactName')}
        />

        <Input
          label="Cargo / Función"
          placeholder="ej: Director Técnico / Ventas"
          error={errors.contactRole?.message}
          {...register('contactRole')}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <Input
          label="Email Operativo"
          required
          type="email"
          placeholder="tecnica@maxisound.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Teléfono / WhatsApp"
          required
          placeholder="+54 9 11 4411-2233"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Teléfono Urgencias / Guardia"
          placeholder="+54 9 11 4411-2200"
          error={errors.emergencyPhone?.message}
          {...register('emergencyPhone')}
        />
      </div>

      <Input
        label="Sitio Web / Portfolio"
        placeholder="https://maxisound.com.ar"
        error={errors.website?.message}
        {...register('website')}
      />
    </div>
  );
};
