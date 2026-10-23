import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Clock, Check } from 'lucide-react';
import { BaseModal } from '../common/BaseModal';
import type { TimingItem } from '../../types/metodicah';
import { timingFormSchema, type TimingFormData } from './timingSchema';

interface TimingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTimingItem: (newItem: Omit<TimingItem, 'id' | 'eventId'>) => void;
  nextOrder: number;
}

export const TimingFormModal: React.FC<TimingFormModalProps> = ({
  isOpen,
  onClose,
  onAddTimingItem,
  nextOrder
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TimingFormData>({
    resolver: zodResolver(timingFormSchema),
    defaultValues: {
      timeStart: '14:00',
      timeEnd: '15:00',
      title: '',
      sector: 'Audio',
      responsible: 'Técnico FOH'
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        timeStart: '14:00',
        timeEnd: '15:00',
        title: '',
        sector: 'Audio',
        responsible: 'Técnico FOH'
      });
    }
  }, [isOpen, reset]);

  const onSubmit = (data: TimingFormData) => {
    onAddTimingItem({
      timeStart: data.timeStart,
      timeEnd: data.timeEnd,
      title: data.title.trim(),
      sector: data.sector.trim(),
      responsible: data.responsible.trim(),
      status: 'pending',
      order: nextOrder
    });
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Agregar Ítem al Cronograma / Timing"
      subtitle="Define el rango horario, sector y responsable de este hito técnico."
      maxWidth="520px"
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Time range row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <Clock size={13} color="var(--text-dim)" />
              <span>Hora Inicio *</span>
            </label>
            <input
              type="time"
              {...register('timeStart')}
              className="form-input"
              style={{ borderColor: errors.timeStart ? '#ef4444' : undefined }}
            />
            {errors.timeStart && (
              <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={11} /> {errors.timeStart.message}
              </span>
            )}
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              <Clock size={13} color="var(--text-dim)" />
              <span>Hora Fin *</span>
            </label>
            <input
              type="time"
              {...register('timeEnd')}
              className="form-input"
              style={{ borderColor: errors.timeEnd ? '#ef4444' : undefined }}
            />
            {errors.timeEnd && (
              <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={11} /> {errors.timeEnd.message}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Título de la Tarea / Hito *
          </label>
          <input
            type="text"
            placeholder="Ej: Prueba de Sonido Banda Principal"
            {...register('title')}
            className="form-input"
            style={{ borderColor: errors.title ? '#ef4444' : undefined }}
            autoFocus
          />
          {errors.title && (
            <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={11} /> {errors.title.message}
            </span>
          )}
        </div>

        {/* Sector and Responsible */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Sector *
            </label>
            <input
              type="text"
              placeholder="Ej: Audio, Luces, Video, Escenario"
              {...register('sector')}
              className="form-input"
              style={{ borderColor: errors.sector ? '#ef4444' : undefined }}
            />
            {errors.sector && (
              <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={11} /> {errors.sector.message}
              </span>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Responsable *
            </label>
            <input
              type="text"
              placeholder="Ej: Juan Martín / Operador FOH"
              {...register('responsible')}
              className="form-input"
              style={{ borderColor: errors.responsible ? '#ef4444' : undefined }}
            />
            {errors.responsible && (
              <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={11} /> {errors.responsible.message}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={16} />
            <span>Guardar en Timing</span>
          </button>
        </div>

      </form>
    </BaseModal>
  );
};
