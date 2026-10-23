import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { EventFormData } from './eventSchema';
import { Input } from '@/components/ui';

export const EventDatesFields: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<EventFormData>();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        2. Lugar & Cronograma de Sitio
      </div>

      {/* Venue y Ubicación */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        <Input 
          label="Venue (Recinto / Salón)"
          required
          placeholder="Ej: Estadio Obras Sanitarias"
          error={errors.venue?.message}
          {...register('venue')}
        />

        <Input 
          label="Ubicación (Dirección / Ciudad)"
          required
          placeholder="Ej: Av. del Libertador 7395, CABA"
          error={errors.location?.message}
          {...register('location')}
        />
      </div>

      {/* Fecha del evento y Rango horario */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        <Input 
          label="Fecha del Evento"
          required
          type="date"
          error={errors.date?.message}
          {...register('date')}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.80rem', fontWeight: 500, color: (errors.startTime || errors.endTime) ? '#f87171' : 'var(--text-muted)' }}>
            Rango Horario del Evento <span style={{ color: '#f59e0b' }}>*</span>
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="time" 
              {...register('startTime')} 
              className="form-input" 
              style={{ flex: 1, borderColor: errors.startTime ? 'rgba(239, 68, 68, 0.5)' : undefined }} 
            />
            <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>a</span>
            <input 
              type="time" 
              {...register('endTime')} 
              className="form-input" 
              style={{ flex: 1, borderColor: errors.endTime ? 'rgba(239, 68, 68, 0.5)' : undefined }} 
            />
          </div>
          {(errors.startTime || errors.endTime) && (
            <span style={{ fontSize: '0.74rem', color: '#f87171', marginTop: '2px' }}>
              Horario de inicio y fin requerido
            </span>
          )}
        </div>
      </div>

      {/* Asistentes, Scouting, Deploy */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <Input 
          label="Cantidad de Asistentes"
          type="number" 
          min="0"
          placeholder="Ej: 15000"
          error={errors.attendeesCount?.message}
          {...register('attendeesCount')}
        />

        <Input 
          label="Fecha de Scouting"
          type="date"
          error={errors.scoutingDate?.message}
          {...register('scoutingDate')}
        />

        <Input 
          label="Fecha de Deploy (Envío Presupuesto)"
          type="date"
          error={errors.deployDate?.message}
          {...register('deployDate')}
        />
      </div>
    </div>
  );
};
