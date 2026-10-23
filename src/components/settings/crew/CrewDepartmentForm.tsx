import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, AlertCircle } from 'lucide-react';
import { useToast } from '../../../hooks/useToast';
import { crewDepartmentSchema, type CrewDepartmentFormData } from '../settingsSchemas';

interface CrewDepartmentFormProps {
  onSubmit: (name: string) => void;
  existingNames: string[];
}

export const CrewDepartmentForm: React.FC<CrewDepartmentFormProps> = ({
  onSubmit,
  existingNames
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
      name: ''
    }
  });

  const onValidSubmit = (data: CrewDepartmentFormData) => {
    const trimmed = data.name.trim();
    if (existingNames.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.warning('Ya existe un departamento con este nombre.');
      return;
    }

    onSubmit(trimmed);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Ej: Maquillaje & Caracterización, Trámites & Permisos..."
          {...register('name')}
          className="form-input"
          style={{ flex: 1, height: '38px', fontSize: '0.84rem', borderColor: errors.name ? '#ef4444' : undefined }}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
          style={{ fontSize: '0.82rem', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={14} />
          <span>Agregar Departamento</span>
        </button>
      </div>
      {errors.name && (
        <span style={{ fontSize: '0.72rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <AlertCircle size={11} /> {errors.name.message}
        </span>
      )}
    </form>
  );
};
