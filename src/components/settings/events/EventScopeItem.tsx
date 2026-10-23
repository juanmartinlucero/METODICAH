import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit2, Trash2, AlertCircle } from 'lucide-react';
import { eventScopeSchema, type EventScopeFormData } from '../settingsSchemas';
import { useToast } from '../../../hooks/useToast';

interface EventScopeItemProps {
  scope: string;
  index: number;
  isEditing: boolean;
  isAdmin: boolean;
  existingScopes?: string[];
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: (newText: string) => void;
  onDelete: () => void;
}

export const EventScopeItem: React.FC<EventScopeItemProps> = ({
  scope,
  index,
  isEditing,
  isAdmin,
  existingScopes = [],
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete
}) => {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EventScopeFormData>({
    resolver: zodResolver(eventScopeSchema),
    defaultValues: {
      name: scope
    }
  });

  useEffect(() => {
    if (isEditing) {
      reset({ name: scope });
    }
  }, [isEditing, scope, reset]);

  const onValidSubmit = (data: EventScopeFormData) => {
    const trimmed = data.name.trim();
    if (existingScopes.some((s, i) => i !== index && s.toLowerCase() === trimmed.toLowerCase())) {
      toast.warning('Ya existe otro alcance con este nombre.');
      return;
    }
    onSaveEdit(trimmed);
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleSubmit(onValidSubmit)}
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          gap: '4px',
          padding: '4px 8px',
          background: 'rgba(14, 19, 31, 0.95)',
          border: '1px solid #f59e0b',
          borderRadius: '6px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="text"
            {...register('name')}
            className="form-input"
            style={{ height: '28px', fontSize: '0.78rem', width: '180px', borderColor: errors.name ? '#ef4444' : undefined }}
            autoFocus
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ padding: '4px 8px', fontSize: '0.72rem' }}
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onCancelEdit}
            className="btn-ghost"
            style={{ padding: '4px 6px', fontSize: '0.72rem' }}
          >
            Cancelar
          </button>
        </div>
        {errors.name && (
          <span style={{ fontSize: '0.7rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={10} /> {errors.name.message}
          </span>
        )}
      </form>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        borderRadius: '6px',
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        color: '#f59e0b',
        fontSize: '0.8rem',
        fontWeight: 500
      }}
    >
      <span>{scope}</span>
      {isAdmin && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={onStartEdit}
            style={{ background: 'transparent', border: 'none', color: '#f59e0b', cursor: 'pointer', padding: '0 2px' }}
            title="Editar nombre del alcance"
          >
            <Edit2 size={12} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 2px' }}
            title="Eliminar alcance"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </div>
  );
};
