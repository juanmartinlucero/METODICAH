import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit2, Trash2, AlertCircle } from 'lucide-react';
import { useToast } from '../../../hooks/useToast';
import { crewDepartmentSchema, type CrewDepartmentFormData } from '../settingsSchemas';

interface CrewDepartmentItemProps {
  name: string;
  index: number;
  isEditing: boolean;
  isAdmin: boolean;
  existingNames: string[];
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: (newName: string) => void;
  onDelete: () => void;
}

export const CrewDepartmentItem: React.FC<CrewDepartmentItemProps> = ({
  name,
  index,
  isEditing,
  isAdmin,
  existingNames,
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
  } = useForm<CrewDepartmentFormData>({
    resolver: zodResolver(crewDepartmentSchema),
    defaultValues: {
      name
    }
  });

  useEffect(() => {
    if (isEditing) {
      reset({ name });
    }
  }, [isEditing, name, reset]);

  const onValidSubmit = (data: CrewDepartmentFormData) => {
    const trimmed = data.name.trim();
    if (existingNames.some((s, i) => i !== index && s.toLowerCase() === trimmed.toLowerCase())) {
      toast.warning('Ya existe otro departamento con este nombre.');
      return;
    }

    onSaveEdit(trimmed);
  };

  if (isEditing) {
    return (
      <form
        onSubmit={handleSubmit(onValidSubmit)}
        style={{
          gridColumn: '1 / -1',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          padding: '10px 14px',
          background: 'rgba(14, 19, 31, 0.95)',
          border: '1px solid #f59e0b',
          borderRadius: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="text"
            {...register('name')}
            className="form-input"
            style={{ height: '32px', fontSize: '0.84rem', flex: 1, borderColor: errors.name ? '#ef4444' : undefined }}
            autoFocus
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onCancelEdit}
            className="btn-ghost"
            style={{ padding: '6px 10px', fontSize: '0.78rem' }}
          >
            Cancelar
          </button>
        </div>
        {errors.name && (
          <span style={{ fontSize: '0.72rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={11} /> {errors.name.message}
          </span>
        )}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#38bdf8',
          flexShrink: 0
        }} />
        <span style={{
          fontSize: '0.84rem',
          fontWeight: 500,
          color: '#fff',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {name}
        </span>
      </div>

      {isAdmin && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={onStartEdit}
            className="btn-ghost"
            style={{ padding: '4px', color: 'var(--text-dim)' }}
            title="Editar departamento"
          >
            <Edit2 size={13} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="btn-ghost"
            style={{ padding: '4px', color: '#ef4444' }}
            title="Eliminar departamento"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
};
