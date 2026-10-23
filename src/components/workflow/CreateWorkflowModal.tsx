import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseModal } from '../common/BaseModal';
import { Workflow, Sparkles } from 'lucide-react';
import type { ProcessNode } from '@/types/metodicah';
import { useWorkflowStore } from '@/stores';
import { useToast } from '@/hooks/useToast';
import { Input, Textarea, Button, Select } from '@/components/ui';
import { createWorkflowSchema, type CreateWorkflowFormData } from '@/schemas/workflowSchema';
import { WORKFLOW_CATEGORIES, generateNodeId } from '@/utils/workflowUtils';

interface CreateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkflowCreated?: (id: string) => void;
}

export const CreateWorkflowModal: React.FC<CreateWorkflowModalProps> = ({ 
  isOpen, 
  onClose,
  onWorkflowCreated
}) => {
  const createWorkflow = useWorkflowStore(s => s.createWorkflow);
  const workflows = useWorkflowStore(s => s.workflows);
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateWorkflowFormData>({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: {
      name: '',
      description: '',
      category: WORKFLOW_CATEGORIES[0],
      templateId: 'blank'
    }
  });

  const onSubmit = async (data: CreateWorkflowFormData) => {
    setError(null);

    try {
      // Si se seleccionó plantilla, clonamos los nodos de ese flujo con IDs nuevos
      let initialNodes: ProcessNode[] = [];
      if (data.templateId && data.templateId !== 'blank') {
        const sourceWorkflow = workflows.find(w => w.id === data.templateId);
        if (sourceWorkflow) {
          initialNodes = sourceWorkflow.nodes.map(n => ({
            ...n,
            id: generateNodeId(),
            status: 'pending' as const
          }));
        }
      }

      const created = await createWorkflow({
        name: data.name,
        description: data.description || undefined,
        category: data.category,
        isDefault: false,
        nodes: initialNodes
      });

      toast.success(`Flujo "${data.name}" creado exitosamente`);
      reset();
      onWorkflowCreated?.(created.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear flujo');
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
      title="Nuevo Flujo de Trabajo"
      subtitle="Define un nuevo pipeline operativo para la organización"
      icon={<Workflow size={20} className="text-amber-500" />}
      maxWidth="560px"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
          label="Nombre del Flujo"
          placeholder="Ej: Pipeline para Festivales Masivos"
          required
          autoFocus
          error={errors.name?.message}
          {...register('name')}
        />

        <Textarea
          label="Descripción del Protocolo"
          placeholder="Describe el objetivo y alcance operativo de este flujo..."
          rows={2}
          error={errors.description?.message}
          {...register('description')}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Select
            label="Categoría"
            required
            error={errors.category?.message}
            {...register('category')}
          >
            {WORKFLOW_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>

          <Select
            label="Plantilla Base"
            {...register('templateId')}
          >
            <option value="blank">En blanco (Lienzo vacío)</option>
            {workflows.map(w => (
              <option key={w.id} value={w.id}>Copiar de: {w.name}</option>
            ))}
          </Select>
        </div>

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
            leftIcon={<Sparkles size={15} />}
          >
            Crear Flujo de Trabajo
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
