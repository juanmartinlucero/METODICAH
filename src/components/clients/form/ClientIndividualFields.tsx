import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { ClientFormData } from './clientSchema';
import { TAX_CONDITIONS_PERSONA, EVENT_TYPES_PERSONA } from './clientSchema';
import { formatTaxId } from '@/utils/clientUtils';
import { Input, Textarea, Select } from '@/components/ui';

export const ClientIndividualFields: React.FC = () => {
  const { register, setValue, watch, formState: { errors } } = useFormContext<ClientFormData>();
  const taxId = watch('taxId') || '';

  const handleTaxIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTaxId(e.target.value);
    setValue('taxId', formatted, { shouldValidate: true });
  };

  return (
    <>
      {/* SECCIÓN 1: Datos Personales & Documentación */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          1. Datos Personales & Documentación
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          <Input
            label="Nombre y Apellido"
            required
            placeholder="Ej: Mariana Rossi / Juan Carlos Pérez"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="DNI / Pasaporte / Documento"
            placeholder="34.890.122"
            error={errors.documentNumber?.message}
            {...register('documentNumber')}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <Input
            label="CUIL / CUIT (Opcional)"
            placeholder="27-34890122-3"
            value={taxId}
            onChange={handleTaxIdChange}
            error={errors.taxId?.message}
          />

          <Select
            label="Condición Fiscal"
            error={errors.taxCondition?.message}
            {...register('taxCondition')}
          >
            {TAX_CONDITIONS_PERSONA.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>

          <Input
            label="Fecha de Nacimiento / Aniversario"
            type="date"
            error={errors.birthDate?.message}
            {...register('birthDate')}
          />
        </div>
      </div>

      {/* SECCIÓN 2: Contacto & Domicilio */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          2. Contacto & Domicilio
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          <Input
            label="Email Principal"
            required
            type="email"
            placeholder="mariana.rossi@gmail.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Teléfono Móvil / WhatsApp"
            required
            placeholder="+54 9 11 6789-0123"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '10px' }}>
          <Input
            label="Dirección / Domicilio"
            placeholder="Av. Alvear 1890, Piso 5"
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
            placeholder="C1014"
            error={errors.zipCode?.message}
            {...register('zipCode')}
          />
        </div>
      </div>

      {/* SECCIÓN 3: Perfil del Evento & Preferencias */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          3. Perfil de Eventos & Preferencias
        </div>

        <Select
          label="Tipo de Evento Frecuente"
          error={errors.frequentEventType?.message}
          {...register('frequentEventType')}
        >
          {EVENT_TYPES_PERSONA.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </Select>

        <Input
          label="Preferencias Especiales / Estilo"
          placeholder="Ej: Diseños minimalistas, preferencia por iluminación cálida, sin pirotecnia"
          error={errors.preferences?.message}
          {...register('preferences')}
        />

        <Textarea
          label="Notas Particulares"
          rows={3}
          placeholder="Observaciones de trato, recomendaciones, referencias o detalles familiares..."
          error={errors.notes?.message}
          {...register('notes')}
        />
      </div>
    </>
  );
};
