import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { SupplierFormData } from './supplierSchema';
import { Input, Textarea } from '@/components/ui';

export const SupplierOperationsFields: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<SupplierFormData>();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
      <h4 style={{ fontSize: '0.85rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, margin: 0 }}>
        3. Equipamiento Insignia & Datos Administrativos
      </h4>

      <Input
        label="Equipamiento Insignia / Marcas Destacadas"
        placeholder="ej: L-Acoustics K2/Kara, Consolas DiGiCo Quantum 338, Shure Axient Digital"
        error={errors.equipmentHighlights?.message}
        {...register('equipmentHighlights')}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        <Input
          label="Email de Facturación / Cobranzas"
          type="email"
          placeholder="facturacion@maxisound.com"
          error={errors.billingEmail?.message}
          {...register('billingEmail')}
        />

        <Input
          label="Condición de Pago Habitual"
          placeholder="ej: 50% anticipo, saldo a 15 días"
          error={errors.paymentTerms?.message}
          {...register('paymentTerms')}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px' }}>
        <Input
          label="Dirección / Depósito"
          placeholder="Av. Warnes 1520"
          error={errors.address?.message}
          {...register('address')}
        />

        <Input
          label="Ciudad"
          placeholder="Chacarita, CABA"
          error={errors.city?.message}
          {...register('city')}
        />

        <Input
          label="Código Postal"
          placeholder="C1414"
          error={errors.zipCode?.message}
          {...register('zipCode')}
        />
      </div>

      <Textarea
        label="Notas Técnicas & Criterios Operativos"
        rows={2}
        placeholder="Observaciones de puntualidad, personal asignado, certificaciones..."
        error={errors.notes?.message}
        {...register('notes')}
      />
    </div>
  );
};
