import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useWorkflowStore, useAuthStore } from '@/stores';
import { 
  WorkflowHeader, 
  WorkflowCanvas, 
  CreateWorkflowModal, 
  AddWorkflowNodeModal 
} from '@/components/workflow';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingFallback } from '@/components/common/LoadingFallback';

export interface WorkflowViewProps {}

export const WorkflowView: React.FC<WorkflowViewProps> = () => {
  const { workflowId } = useParams<{ workflowId?: string }>();
  const navigate = useNavigate();

  const workflows = useWorkflowStore(s => s.workflows);
  const selectedWorkflowId = useWorkflowStore(s => s.selectedWorkflowId);
  const selectWorkflow = useWorkflowStore(s => s.selectWorkflow);
  const loadWorkflows = useWorkflowStore(s => s.loadWorkflows);
  const isLoading = useWorkflowStore(s => s.isLoading);
  const user = useAuthStore(s => s.user);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false);

  // Cargar flujos de la organización al montar
  useEffect(() => {
    loadWorkflows(user?.accountId);
  }, [loadWorkflows, user?.accountId]);

  // Si se navega a /workflow sin parámetro de ID, redirigir al flujo por defecto
  useEffect(() => {
    if (!workflowId && workflows.length > 0) {
      const defaultId = (selectedWorkflowId && workflows.some(w => w.id === selectedWorkflowId))
        ? selectedWorkflowId
        : workflows[0].id;
      navigate(`/workflow/${defaultId}`, { replace: true });
    }
  }, [workflowId, workflows, selectedWorkflowId, navigate]);

  // Sincronizar el store únicamente cuando la RUTA externa cambia (historial, links directos)
  const lastSynchronizedRouteIdRef = useRef<string | undefined>(workflowId);
  useEffect(() => {
    if (workflowId && workflowId !== lastSynchronizedRouteIdRef.current) {
      lastSynchronizedRouteIdRef.current = workflowId;
      const exists = workflows.some(w => w.id === workflowId);
      if (exists) {
        selectWorkflow(workflowId);
      } else if (workflows.length > 0) {
        navigate(`/workflow/${workflows[0].id}`, { replace: true });
      }
    }
  }, [workflowId, workflows, selectWorkflow, navigate]);

  // Manejador explícito de cambio de flujo desde la interfaz (dropdown, creación, duplicación)
  const handleSelectWorkflow = (newId: string) => {
    lastSynchronizedRouteIdRef.current = newId;
    selectWorkflow(newId);
    navigate(`/workflow/${newId}`);
  };

  const currentWorkflow = (workflowId ? workflows.find(w => w.id === workflowId) : null)
    || (selectedWorkflowId ? workflows.find(w => w.id === selectedWorkflowId) : null)
    || workflows[0]
    || null;

  if (isLoading) {
    return <LoadingFallback message="Cargando flujos de trabajo de la organización..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 1. Header & Metric Controls */}
      <WorkflowHeader
        currentWorkflow={currentWorkflow}
        onSelectWorkflow={handleSelectWorkflow}
        onOpenCreateWorkflowModal={() => setIsCreateModalOpen(true)}
        onOpenAddNodeModal={() => setIsAddNodeModalOpen(true)}
      />

      {/* 2. Visual Canvas Area */}
      {currentWorkflow ? (
        <ErrorBoundary moduleName="Canvas de Workflow">
          <WorkflowCanvas
            key={currentWorkflow.id}
            workflow={currentWorkflow}
            onOpenAddNodeModal={() => setIsAddNodeModalOpen(true)}
          />
        </ErrorBoundary>
      ) : (
        <div 
          className="glass-panel"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
            No hay flujos de trabajo registrados
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '460px' }}>
            Crea el primer flujo operativo de tu organización para definir dependencias y tiempos técnicos de trabajo.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
            style={{ fontSize: '0.85rem', padding: '9px 18px' }}
          >
            Crear Primer Flujo
          </button>
        </div>
      )}

      {/* 3. Modals */}
      <CreateWorkflowModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onWorkflowCreated={handleSelectWorkflow}
      />

      {currentWorkflow && (
        <AddWorkflowNodeModal
          isOpen={isAddNodeModalOpen}
          onClose={() => setIsAddNodeModalOpen(false)}
          workflowId={currentWorkflow.id}
          existingNodes={currentWorkflow.nodes}
        />
      )}
    </div>
  );
};
