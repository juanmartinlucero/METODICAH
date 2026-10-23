import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { SettingsColorPicker } from '../SettingsColorPicker';
import { PRESET_COLORS } from '../settingsConstants';
import { useToast } from '../../../hooks/useToast';
import { eventStageSchema, type EventStageFormData } from '../settingsSchemas';

interface EventStageFormProps {
  onSubmit: (label: string, color: string) => void;
  onCancel: () => void;
  existingLabels?: string[];
}

export const EventStageForm: React.FC<EventStageFormProps> = ({
  onSubmit,
  onCancel,
  existingLabels = []
}) => {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<EventStageFormData>({
    resolver: zodResolver(eventStageSchema),
    defaultValues: {
      label: '',
      color: PRESET_COLORS[0]
    }
  });

  const selectedColor = watch('color');

  const onValidSubmit = (data: EventStageFormData) => {
    const trimmed = data.label.trim();
    if (existingLabels.some(l => l.toLowerCase() === trimmed.toLowerCase())) {
      toast.warning('Ya existe una etapa con este nombre.');
      return;
    }

    onSubmit(trimmed, data.color);
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} style={{
      padding: '16px 20px',
      background: 'rgba(14, 19, 31, 0.95)',
      border: '1px solid var(--border-accent)',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
        Crear Nueva Etapa
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '14px', alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
            Nombre de la Etapa *
          </label>
          <input
            type="text"
            placeholder="Ej: Casting, En Revisión Legal, etc."
            {...register('label')}
            className="form-input"
            style={{ height: '36px', fontSize: '0.85rem', borderColor: errors.label ? '#ef4444' : undefined }}
            autoFocus
          />
          {errors.label && (
            <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={11} /> {errors.label.message}
            </span>
          )}
        </div>

        <div>
          <label style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
            Color Identificador
          </label>
          <SettingsColorPicker
            selectedColor={selectedColor}
            onSelectColor={(c) => setValue('color', c, { shouldValidate: true })}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button 
          type="button" 
          onClick={onCancel} 
          className="btn-ghost" 
          style={{ fontSize: '0.8rem' }}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="btn-primary" 
          style={{ fontSize: '0.8rem', padding: '6px 14px' }}
        >
          Guardar Etapa
        </button>
      </div>
    </form>
  );
};
