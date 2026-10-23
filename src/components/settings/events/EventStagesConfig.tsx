import React, { useState } from 'react';
import type { EventStageConfig } from '../../../types/metodicah';
import { DEFAULT_EVENT_STAGES } from '../../../services/mockData';
import { Layers, RotateCcw, Plus } from 'lucide-react';
import { EventStageForm } from './EventStageForm';
import { EventStageItem } from './EventStageItem';
import { ConfirmModal } from '../../common/ConfirmModal';
import { useToast } from '../../../hooks/useToast';

interface EventStagesConfigProps {
  stages: EventStageConfig[];
  onUpdateStages: (stages: EventStageConfig[]) => void;
  isAdmin: boolean;
}

export const EventStagesConfig: React.FC<EventStagesConfigProps> = ({
  stages,
  onUpdateStages,
  isAdmin
}) => {
  const toast = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [stageIdToDelete, setStageIdToDelete] = useState<string | null>(null);
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);

  const handleAddStage = (label: string, color: string) => {
    const newStage: EventStageConfig = {
      id: `stage_${Date.now()}`,
      label,
      color
    };
    onUpdateStages([...stages, newStage]);
    setShowAddForm(false);
    toast.success(`Etapa "${label}" creada.`);
  };

  const handleSaveEditStage = (stageId: string, label: string, color: string) => {
    const updated = stages.map(s => 
      s.id === stageId ? { ...s, label, color } : s
    );
    onUpdateStages(updated);
    setEditingStageId(null);
    toast.success('Etapa actualizada.');
  };

  const handleDeleteStage = (stageId: string) => {
    if (stages.length <= 1) {
      toast.warning('Debe haber al menos una etapa configurada en el sistema.');
      return;
    }
    setStageIdToDelete(stageId);
  };

  const handleConfirmDeleteStage = () => {
    if (!stageIdToDelete) return;
    onUpdateStages(stages.filter(s => s.id !== stageIdToDelete));
    toast.info('Etapa eliminada del pipeline.');
    setStageIdToDelete(null);
  };

  const handleResetStages = () => {
    setIsConfirmResetOpen(true);
  };

  const handleConfirmResetStages = () => {
    onUpdateStages(DEFAULT_EVENT_STAGES);
    setEditingStageId(null);
    toast.info('Etapas predeterminadas restauradas.');
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers size={20} color="#f59e0b" />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>
              Etapas de Eventos (Event Stages)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Gestiona, edita, elimina y crea las etapas del pipeline de producción.
            </p>
          </div>
        </div>

        {isAdmin && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="button"
              onClick={handleResetStages}
              className="btn-ghost"
              style={{ fontSize: '0.78rem', padding: '6px 10px' }}
              title="Restaurar etapas predeterminadas"
            >
              <RotateCcw size={13} />
              <span>Restaurar por defecto</span>
            </button>

            <button 
              type="button"
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingStageId(null);
              }}
              className="btn-primary"
              style={{ fontSize: '0.8rem', padding: '7px 14px' }}
            >
              <Plus size={14} />
              <span>Nueva Etapa</span>
            </button>
          </div>
        )}
      </div>

      {showAddForm && (
        <EventStageForm
          onSubmit={handleAddStage}
          onCancel={() => setShowAddForm(false)}
          existingLabels={stages.map(s => s.label)}
        />
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '10px'
      }}>
        {stages.map((stage) => (
          <EventStageItem
            key={stage.id}
            stage={stage}
            isEditing={editingStageId === stage.id}
            isAdmin={isAdmin}
            existingLabels={stages.map(s => s.label)}
            onStartEdit={() => {
              setEditingStageId(stage.id);
              setShowAddForm(false);
            }}
            onCancelEdit={() => setEditingStageId(null)}
            onSaveEdit={(label, color) => handleSaveEditStage(stage.id, label, color)}
            onDelete={() => handleDeleteStage(stage.id)}
          />
        ))}
      </div>

      <ConfirmModal
        isOpen={Boolean(stageIdToDelete)}
        onClose={() => setStageIdToDelete(null)}
        onConfirm={handleConfirmDeleteStage}
        title="Eliminar etapa"
        description="¿Estás seguro de que deseas eliminar esta etapa del pipeline?"
        confirmLabel="Eliminar"
      />

      <ConfirmModal
        isOpen={isConfirmResetOpen}
        onClose={() => setIsConfirmResetOpen(false)}
        onConfirm={handleConfirmResetStages}
        title="Restaurar etapas predeterminadas"
        description="¿Deseas restaurar las 8 etapas predeterminadas de METODICAH (Backlog, Meeting, Deploy, Approved, Rejected, Pre Prod, Prod, Post Prod)?"
        confirmLabel="Restaurar"
        variant="primary"
      />
    </div>
  );
};

