import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { CrewFormData } from './crewSchema';
import { CREW_CLOTHING_SIZES, CREW_DIETARY_OPTIONS } from '@/utils/crewUtils';
import { Input, Textarea, Select } from '@/components/ui';

export const CrewSafetyBackstageFields: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<CrewFormData>();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
      <h4 style={{ fontSize: '0.85rem', color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, margin: 0 }}>
        4. Seguridad & Logística de Backstage
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <Input
          label="Aseguradora ART / Seguro"
          placeholder="ej: La Segunda ART"
          error={errors.artInsurance?.message}
          {...register('artInsurance')}
        />

        <Select
          label="Talle Indumentaria"
          error={errors.clothingSize?.message}
          {...register('clothingSize')}
        >
          {CREW_CLOTHING_SIZES.map(sz => (
            <option key={sz} value={sz}>{sz}</option>
          ))}
        </Select>

        <Select
          label="Restricción Alimentaria"
          error={errors.dietaryRestrictions?.message}
          {...register('dietaryRestrictions')}
        >
          {CREW_DIETARY_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </Select>
      </div>

      <Textarea
        label="Notas Técnicas & Criterios"
        rows={2}
        placeholder="Disponibilidad para giras, certificaciones técnicas, consolas que opera..."
        error={errors.notes?.message}
        {...register('notes')}
      />
    </div>
  );
};
