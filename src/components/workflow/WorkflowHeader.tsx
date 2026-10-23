import React, { useState } from 'react';
import type { WorkflowDefinition } from '@/types/metodicah';
import { 
  Workflow, 
  Plus, 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  AlertCircle, 
  Layers, 
  Trash2, 
  Copy 
} from 'lucide-react';
import { useWorkflowStore } from '@/stores';
import { useToast } from '@/hooks/useToast';
import { Button, Badge, Card, Select } from '@/components/ui';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { calculateWorkflowMetrics, generateNodeId } from '@/utils/workflowUtils';

interface WorkflowHeaderProps {
  currentWorkflow: WorkflowDefinition | null;
  onOpenCreateWorkflowModal: () => void;
  onOpenAddNodeModal: () => void;
  onSelectWorkflow?: (id: string) => void;
}

export const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
  currentWorkflow,
  onOpenCreateWorkflowModal,
  onOpenAddNodeModal,
  onSelectWorkflow
}) => {
  const workflows = useWorkflowStore(s => s.workflows);
  const selectedWorkflowId = useWorkflowStore(s => s.selectedWorkflowId);
  const selectWorkflow = useWorkflowStore(s => s.selectWorkflow);
  const deleteWorkflow = useWorkflowStore(s => s.deleteWorkflow);
  const createWorkflow = useWorkflowStore(s => s.createWorkflow);
  const toast = useToast();
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const { 
    totalNodes, 
    totalHours, 
    completedNodes, 
    activeNodes, 
    blockedNodes 
  } = calculateWorkflowMetrics(currentWorkflow?.nodes);

  const handleDuplicate = async () => {
    if (!currentWorkflow) return;
    try {
      const duplicated = await createWorkflow({
        name: `${currentWorkflow.name} (Copia)`,
        description: currentWorkflow.description,
        category: currentWorkflow.category,
        isDefault: false,
        nodes: currentWorkflow.nodes.map(n => ({
          ...n,
          id: generateNodeId(),
          status: 'pending' as const
        }))
      });
      if (onSelectWorkflow) {
        onSelectWorkflow(duplicated.id);
      }
      toast.success(`Flujo duplicado como "${duplicated.name}"`);
    } catch {
      toast.error('Error al duplicar el flujo');
    }
  };

  const handleDeleteCurrent = () => {
    if (!currentWorkflow) return;
    if (workflows.length <= 1) {
      toast.error('No es posible eliminar el único flujo existente de la organización.');
      return;
    }
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDeleteWorkflow = async () => {
    if (!currentWorkflow) return;
    try {
      await deleteWorkflow(currentWorkflow.id);
      toast.success('Flujo eliminado correctamente');
    } catch {
      toast.error('Error al eliminar el flujo');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
      {/* Top Bar: Title, Active Switcher & Global Actions */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: '14px',
        padding: '16px 20px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '10px', 
            background: 'rgba(245, 158, 11, 0.1)', 
            border: '1px solid rgba(245, 158, 11, 0.25)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#f59e0b'
          }}>
            <Workflow size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ 
                margin: 0, 
                fontSize: '1.28rem', 
                fontWeight: 700, 
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em'
              }}>
                Workflow & Procesos
              </h1>
              <Badge variant="warning" size="sm">
                ORGANIZACIÓN
              </Badge>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Diseño, estandarización y control del camino crítico operativo para tu productora
            </p>
          </div>
        </div>

        {/* Workflow Switcher & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ minWidth: '240px' }}>
            <Select
              aria-label="Flujo Activo"
              value={currentWorkflow?.id || selectedWorkflowId || ''}
              onChange={(e) => {
                const targetId = e.target.value;
                if (onSelectWorkflow) {
                  onSelectWorkflow(targetId);
                } else {
                  selectWorkflow(targetId);
                }
              }}
              style={{
                fontSize: '0.84rem',
                fontWeight: 600,
                padding: '6px 36px 6px 12px',
                height: '38px'
              }}
            >
              {workflows.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.nodes.length} hitos)
                </option>
              ))}
            </Select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDuplicate}
            title="Duplicar este flujo"
            leftIcon={<Copy size={14} />}
          >
            Duplicar
          </Button>

          {currentWorkflow && workflows.length > 1 && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteCurrent}
              title="Eliminar este flujo"
              leftIcon={<Trash2 size={14} />}
            >
              Eliminar
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenCreateWorkflowModal}
            leftIcon={<Plus size={15} />}
          >
            Nuevo Flujo
          </Button>

          {currentWorkflow && (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenAddNodeModal}
              leftIcon={<Plus size={15} />}
            >
              Agregar Hito
            </Button>
          )}
        </div>
      </div>

      {/* 2. KPI Summary Strip */}
      {currentWorkflow && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px'
        }}>
          {/* Total Hitos */}
          <Card variant="glass" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#38bdf8' }}>
              <Layers size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Hitos del Flujo
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {totalNodes}
              </div>
            </div>
          </Card>

          {/* Horas Totales */}
          <Card variant="glass" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#f59e0b' }}>
              <Clock size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Horas Estimadas
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {totalHours} hs
              </div>
            </div>
          </Card>

          {/* Completados */}
          <Card variant="glass" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#10b981' }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Completados
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#10b981' }}>
                {completedNodes}
              </div>
            </div>
          </Card>

          {/* En Progreso */}
          <Card variant="glass" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#f59e0b' }}>
              <PlayCircle size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                En Progreso
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f59e0b' }}>
                {activeNodes}
              </div>
            </div>
          </Card>

          {/* Bloqueados */}
          <Card variant="glass" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#ef4444' }}>
              <AlertCircle size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Bloqueados
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ef4444' }}>
                {blockedNodes}
              </div>
            </div>
          </Card>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => { void handleConfirmDeleteWorkflow(); }}
        title="Eliminar flujo de trabajo"
        description={`¿Estás seguro de eliminar el flujo "${currentWorkflow?.name ?? ''}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar flujo"
      />
    </div>
  );
};
