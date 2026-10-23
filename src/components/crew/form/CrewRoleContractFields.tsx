import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { CrewFormData } from './crewSchema';
import { Input, Select } from '@/components/ui';

interface CrewRoleContractFieldsProps {
  sectors: string[];
}

export const CrewRoleContractFields: React.FC<CrewRoleContractFieldsProps> = ({ sectors }) => {
  const { register, watch, formState: { errors } } = useFormContext<CrewFormData>();
  const sector = watch('sector');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
      <h4 style={{ fontSize: '0.85rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, margin: 0 }}>
        2. Perfil Técnico & Contratación
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <Select
          label="Tipo de Contrato"
          error={errors.type?.message}
          {...register('type')}
        >
          <option value="staff_interno">Staff Interno (Fijo)</option>
          <option value="freelancer">Freelancer (Por Evento)</option>
        </Select>

        <Select
          label="Sector Técnico"
          required
          error={errors.sector?.message}
          {...register('sector')}
        >
          {sectors.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
          <option value="otro">Otro sector...</option>
        </Select>

        <Select
          label="Seniority"
          error={errors.seniority?.message}
          {...register('seniority')}
        >
          <option value="lead">Lead / Responsable</option>
          <option value="senior">Senior</option>
          <option value="semi_senior">Semi Senior</option>
          <option value="junior">Junior / Asistente</option>
        </Select>
      </div>

      {sector === 'otro' && (
        <Input
          label="Especificar Sector"
          required
          placeholder="ej: Escenografía Especial"
          error={errors.customSector?.message}
          {...register('customSector')}
        />
      )}

      <Input
        label="Rol Habitual en Producciones"
        required
        placeholder="ej: Productor General / Lead, Operador FOH, Rigger Certificado..."
        error={errors.roleInEvent?.message}
        {...register('roleInEvent')}
      />
    </div>
  );
};
