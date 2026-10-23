import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { Client } from '@/types/metodicah';
import type { EventFormData } from './eventSchema';
import { Input, Select } from '@/components/ui';

interface EventIdentityFieldsProps {
  clients: Client[];
}

export const EventIdentityFields: React.FC<EventIdentityFieldsProps> = ({ clients }) => {
  const { register, formState: { errors } } = useFormContext<EventFormData>();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        1. Identidad & Cliente
      </div>

      <Input 
        label="Título del Evento / Show"
        required
        placeholder="Ej: Tour Internacional Rock & Sound Arena 2026"
        error={errors.title?.message}
        {...register('title')}
      />

      <Select
        label="Cliente / Organizador"
        required
        error={errors.clientId?.message}
        {...register('clientId')}
      >
        {clients.map(c => {
          const label = c.clientType === 'persona' 
            ? `${c.name} (Particular)` 
            : `${c.fantasyName || c.company || c.name}${c.name ? ` - Contacto: ${c.name}` : ''}`;
          return (
            <option key={c.id} value={c.id}>{label}</option>
          );
        })}
      </Select>

      <Input 
        label="Concepto Creativo / Temática del Evento"
        placeholder="Ej: Experiencia escénica inmersiva con tecnología visual 360°"
        error={errors.concept?.message}
        {...register('concept')}
      />
    </div>
  );
};
