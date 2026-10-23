import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { ClientFormData } from './clientSchema';
import { INDUSTRY_OPTIONS, TAX_CONDITIONS_EMPRESA } from './clientSchema';
import { formatTaxId } from '@/utils/clientUtils';
import { Input, Textarea, Select } from '@/components/ui';

export const ClientCompanyFields: React.FC = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext<ClientFormData>();
  const taxId = watch('taxId') || '';

  const handleTaxIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTaxId(e.target.value);
    setValue('taxId', formatted, { shouldValidate: true });
  };

  return (
    <>
      {/* SECCIÓN 1: Identidad Corporativa */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          1. Identidad Corporativa & Fiscal
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          <Input
            label="Razón Social"
            required
            placeholder="Ej: Obras Music & Entertainment S.A."
            error={errors.company?.message}
            {...register('company')}
          />

          <Input
            label="Nombre Comercial / Marca (Fantasía)"
            placeholder="Ej: Estadio Obras / Red Bull"
            error={errors.fantasyName?.message}
            {...register('fantasyName')}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <Input
            label="CUIT / Tax ID"
            placeholder="30-71458921-9"
            value={taxId}
            onChange={handleTaxIdChange}
            error={errors.taxId?.message}
          />

          <Select
            label="Condición Fiscal"
            error={errors.taxCondition?.message}
            {...register('taxCondition')}
          >
            {TAX_CONDITIONS_EMPRESA.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>

          <Select
            label="Rubro / Industria"
            error={errors.industry?.message}
            {...register('industry')}
          >
            {INDUSTRY_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>
        </div>

        <Input
          label="Sitio Web / LinkedIn"
          type="url"
          placeholder="https://empresa.com"
          error={errors.website?.message}
          {...register('website')}
        />
      </div>

      {/* SECCIÓN 2: Contacto Principal (Lead) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          2. Contacto Principal (Interlocutor del Evento)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          <Input
            label="Nombre del Contacto"
            required
            placeholder="Ej: Esteban Di Meglio"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Cargo / Puesto en la empresa"
            placeholder="Ej: Director de Operaciones / Brand Manager"
            error={errors.contactRole?.message}
            {...register('contactRole')}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          <Input
            label="Email Directo"
            required
            type="email"
            placeholder="contacto@obrasmusic.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Teléfono Móvil / WhatsApp"
            required
            placeholder="+54 11 4700-1234"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>
      </div>

      {/* SECCIÓN 3: Facturación & Domicilio Fiscal */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          3. Administración, Facturación & Domicilio Fiscal
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          <Input
            label="Contacto de Facturación / Finanzas"
            placeholder="Nombre del responsable de pagos"
            error={errors.billingContactName?.message}
            {...register('billingContactName')}
          />

          <Input
            label="Email para Facturas / OCs"
            type="email"
            placeholder="facturacion@empresa.com"
            error={errors.billingContactEmail?.message}
            {...register('billingContactEmail')}
          />
        </div>

        <Input
          label="Condición / Términos de Pago Habituales"
          placeholder="Ej: 50% anticipo + saldo 48hs antes, o 30 días fecha factura"
          error={errors.paymentTerms?.message}
          {...register('paymentTerms')}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px' }}>
          <Input
            label="Dirección Fiscal"
            placeholder="Av. del Libertador 7395"
            error={errors.address?.message}
            {...register('address')}
          />
          <Input
            label="Ciudad"
            placeholder="CABA"
            error={errors.city?.message}
            {...register('city')}
          />
          <Input
            label="Provincia"
            placeholder="Buenos Aires"
            error={errors.state?.message}
            {...register('state')}
          />
          <Input
            label="C.P."
            placeholder="C1429"
            error={errors.zipCode?.message}
            {...register('zipCode')}
          />
        </div>
      </div>

      {/* SECCIÓN 4: Requisitos Operativos & Criterios */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          4. Requisitos de Proveedores & Notas Técnicas
        </div>

        <Input
          label="Requisitos de Ingreso de Proveedores / Staff"
          placeholder="Ej: ART obligatoria con cláusula de no repetición, Seguros RC vigentes, EPP"
          error={errors.supplierRequirements?.message}
          {...register('supplierRequirements')}
        />

        <Textarea
          label="Notas Técnicas / Criterios de la Marca"
          rows={3}
          placeholder="Observaciones generales, requerimientos escenográficos o de seguridad..."
          error={errors.notes?.message}
          {...register('notes')}
        />
      </div>
    </>
  );
};
