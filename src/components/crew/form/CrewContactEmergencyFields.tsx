import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { CrewFormData } from './crewSchema';
import { Input } from '@/components/ui';

export const CrewContactEmergencyFields: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<CrewFormData>();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
      <h4 style={{ fontSize: '0.85rem', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, margin: 0 }}>
        3. Contacto & Urgencias
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <Input
          label="Email Operativo"
          required
          type="email"
          placeholder="nombre@metodicah.com"
          error={errors.userEmail?.message}
          {...register('userEmail')}
        />

        <Input
          label="Teléfono / WhatsApp"
          placeholder="+54 9 11 5555-0199"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Ciudad / Residencia"
          placeholder="ej: Palermo, CABA"
          error={errors.city?.message}
          {...register('city')}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        <Input
          label="Contacto de Urgencia (Nombre)"
          placeholder="ej: María Rossi (Madre / Pareja)"
          error={errors.emergencyContactName?.message}
          {...register('emergencyContactName')}
        />

        <Input
          label="Teléfono de Urgencia"
          placeholder="+54 9 11 5555-0198"
          error={errors.emergencyContactPhone?.message}
          {...register('emergencyContactPhone')}
        />
      </div>
    </div>
  );
};
