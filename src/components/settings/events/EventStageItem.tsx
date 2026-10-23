import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { EventStageConfig } from '../../../types/metodicah';
import { Edit2, Trash2, AlertCircle } from 'lucide-react';
import { SettingsColorPicker } from '../SettingsColorPicker';
import { useToast } from '../../../hooks/useToast';
import { eventStageSchema, type EventStageFormData } from '../settingsSchemas';

interface EventStageItemProps {
  stage: EventStageConfig;
  isEditing: boolean;
  isAdmin: boolean;
  existingLabels?: string[];
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: (label: string, color: string) => void;
  onDelete: () => void;
}

export const EventStageItem: React.FC<EventStageItemProps> = ({
  stage,
  isEditing,
  isAdmin,
  existingLabels = [],
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete
}) => {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<EventStageFormData>({
    resolver: zodResolver(eventStageSchema),
    defaultValues: {
      label: stage.label,
      color: stage.color
    }
  });

  const selectedColor = watch('color');

  useEffect(() => {
    if (isEditing) {
      reset({
        label: stage.label,
        color: stage.color
      });
    }
  }, [isEditing, stage.label, stage.color, reset]);

  const onValidSubmit = (data: EventStageFormData) => {
    const trimmed = data.label.trim();
    if (existingLabels.some(l => l.toLowerCase() === trimmed.toLowerCase() && l.toLowerCase() !== stage.label.toLowerCase())) {
      toast.warning('Ya existe otra etapa con este nombre.');
      return;
    }

    onSaveEdit(trimmed, data.color);
  };

  if (isEditing) {
    return (
      <form 
        onSubmit={handleSubmit(onValidSubmit)}
        style={{
          gridColumn: '1 / -1',
          padding: '14px 18px',
          background: 'rgba(14, 19, 31, 0.98)',
          borderRadius: '8px',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f59e0b' }}>
          Editar Etapa: {stage.label}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'center' }}>
          <div>
            <input
              type="text"
              {...register('label')}
              className="form-input"
              style={{ height: '34px', fontSize: '0.84rem', borderColor: errors.label ? '#ef4444' : undefined }}
              autoFocus
            />
            {errors.label && (
              <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={11} /> {errors.label.message}
              </span>
            )}
          </div>

          <SettingsColorPicker
            selectedColor={selectedColor}
            onSelectColor={(c) => setValue('color', c, { shouldValidate: true })}
            size={22}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button 
            type="button" 
            onClick={onCancelEdit} 
            className="btn-ghost" 
            style={{ fontSize: '0.78rem' }}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-primary" 
            style={{ fontSize: '0.78rem', padding: '5px 12px' }}
          >
            Actualizar Etapa
          </button>
        </div>
      </form>
    );
  }

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        background: 'rgba(9, 13, 22, 0.5)',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)',
        gap: '10px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: stage.color,
          boxShadow: `0 0 8px ${stage.color}66`
        }} />
        <span style={{
          fontSize: '0.84rem',
          fontWeight: 500,
          color: '#fff'
        }}>
          {stage.label}
        </span>
      </div>

      {isAdmin && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={onStartEdit}
            className="btn-ghost"
            style={{ padding: '4px', color: 'var(--text-dim)' }}
            title="Editar nombre y color de la etapa"
          >
            <Edit2 size={13} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="btn-ghost"
            style={{ padding: '4px', color: '#ef4444' }}
            title="Eliminar etapa"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
};
