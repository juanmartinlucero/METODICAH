import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseModal } from '../common/BaseModal';
import { Plus, Network } from 'lucide-react';
import type { ProcessNode } from '@/types/metodicah';
import { useWorkflowStore } from '@/stores';
import { useToast } from '@/hooks/useToast';
import { Input, Button, Select } from '@/components/ui';
import { addWorkflowNodeSchema, type AddWorkflowNodeFormData } from '@/schemas/workflowSchema';
import { NODE_CATEGORIES } from '@/utils/workflowUtils';

interface AddWorkflowNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflowId: string;
  existingNodes: ProcessNode[];
}

export const AddWorkflowNodeModal: React.FC<AddWorkflowNodeModalProps> = ({
  isOpen,
  onClose,
  workflowId,
  existingNodes
}) => {
  const addNodeToWorkflow = useWorkflowStore(s => s.addNodeToWorkflow);
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<AddWorkflowNodeFormData>({
    resolver: zodResolver(addWorkflowNodeSchema),
    defaultValues: {
      label: '',
      category: NODE_CATEGORIES[0],
      assignedTo: 'Equipo de Producción',
      estimatedHours: 4,
      status: 'pending',
      predecessorId: ''
    }
  });

  const onSubmit = async (data: AddWorkflowNodeFormData) => {
    setError(null);

    try {
      await addNodeToWorkflow(workflowId, {
        label: data.label,
        category: data.category,
        assignedTo: data.assignedTo || 'Equipo de Producción',
        estimatedHours: data.estimatedHours,
        status: data.status,
        predecessorIds: data.predecessorId ? [data.predecessorId] : [],
        successorIds: []
      });

      toast.success(`Hito "${data.label}" agregado al flujo`);
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar nodo');
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Agregar Hito / Nodo al Flujo"
      subtitle="Define un nuevo paso operativo y sus dependencias secuenciales"
      icon={<Network size={20} className="text-amber-500" />}
      maxWidth="580px"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {error && (
          <div style={{
            padding: '10px 14px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '6px',
            color: '#f87171',
            fontSize: '0.84rem'
          }}>
            {error}
          </div>
        )}

        <Input
          label="Nombre de la Tarea / Hito"
          placeholder="Ej: Montaje de Estructura Layher Escenario"
          required
          autoFocus
          error={errors.label?.message}
          {...register('label')}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Select
            label="Categoría Técnica"
            required
            error={errors.category?.message}
            {...register('category')}
          >
            {NODE_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>

          <Input
            label="Responsable / Proveedor"
            placeholder="Ej: Rigging Pro SRL o Jefe de Campo"
            error={errors.assignedTo?.message}
            {...register('assignedTo')}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input
            type="number"
            label="Horas Estimadas (Duración)"
            min="1"
            max="200"
            error={errors.estimatedHours?.message}
            {...register('estimatedHours', { valueAsNumber: true })}
          />

          <Select
            label="Estado Inicial"
            error={errors.status?.message}
            {...register('status')}
          >
            <option value="pending">Pendiente</option>
            <option value="active">En Progreso</option>
            <option value="completed">Completado</option>
            <option value="blocked">Bloqueado</option>
          </Select>
        </div>

        <Select
          label="Dependencia / Nodo Predecesor (Opcional)"
          helperText="Si seleccionas un predecesor, el canvas conectará automáticamente una arista secuencial orientada."
          {...register('predecessorId')}
        >
          <option value="">Sin predecesor (Nodo raíz o inicio de rama)</option>
          {existingNodes.map(n => (
            <option key={n.id} value={n.id}>
              {n.label} ({n.category})
            </option>
          ))}
        </Select>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Plus size={15} />}
          >
            Agregar Hito al Flujo
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
