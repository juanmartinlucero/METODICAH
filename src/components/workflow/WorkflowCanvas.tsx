import React, { useMemo, useCallback, useState } from 'react';
import type { WorkflowDefinition, ProcessNode, ProcessNodeStatus } from '@/types/metodicah';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  type Node, 
  type Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkflowStore } from '@/stores';
import { Plus, Trash2, Clock, User, Hourglass } from 'lucide-react';
import { Button } from '@/components/ui';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { STATUS_COLORS } from '@/utils/workflowUtils';

interface WorkflowCanvasProps {
  workflow: WorkflowDefinition;
  onOpenAddNodeModal: () => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  workflow,
  onOpenAddNodeModal
}) => {
  const updateNodeInWorkflow = useWorkflowStore(s => s.updateNodeInWorkflow);
  const deleteNodeFromWorkflow = useWorkflowStore(s => s.deleteNodeFromWorkflow);
  const updateNodePosition = useWorkflowStore(s => s.updateNodePosition);
  const [nodeToDelete, setNodeToDelete] = useState<ProcessNode | null>(null);

  // Convert workflow.nodes into ReactFlow Node[]
  const nodes: Node[] = useMemo(() => {
    return workflow.nodes.map((n: ProcessNode) => {
      const color = STATUS_COLORS[n.status] || '#3b82f6';

      return {
        id: n.id,
        position: n.position || { x: 100, y: 100 },
        data: {
          label: (
            <div style={{ padding: '12px', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ 
                  fontSize: '0.68rem', 
                  color: color, 
                  fontWeight: 700, 
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {n.category}
                </span>

                <button
                  type="button"
                  title="Eliminar este nodo"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNodeToDelete(n);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '4px'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div style={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '8px' }}>
                {n.label}
              </div>

              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '4px',
                fontSize: '0.72rem', 
                color: 'var(--text-muted)',
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <User size={12} style={{ flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {n.assignedTo}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={12} style={{ flexShrink: 0 }} />
                  <span>Duración estimada: {n.estimatedHours}hs</span>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: '8px'
              }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Estado:</span>
                <select
                  value={n.status}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateNodeInWorkflow(workflow.id, n.id, { 
                      status: e.target.value as ProcessNodeStatus 
                    });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: '#1f2937',
                    color: color,
                    border: `1px solid ${color}40`,
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '2px 6px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="pending">Pendiente</option>
                  <option value="active">En Progreso</option>
                  <option value="completed">Completado</option>
                  <option value="blocked">Bloqueado</option>
                </select>
              </div>
            </div>
          )
        },
        style: {
          background: 'rgba(17, 24, 39, 0.95)',
          border: `2px solid ${color}`,
          borderRadius: '10px',
          width: 250,
          boxShadow: `0 4px 20px ${color}20`,
          cursor: 'grab'
        }
      };
    });
  }, [workflow, updateNodeInWorkflow]);

  // Convert successorIds into ReactFlow Edge[]
  const edges: Edge[] = useMemo(() => {
    const edgeList: Edge[] = [];
    workflow.nodes.forEach((n: ProcessNode) => {
      n.successorIds?.forEach((succId: string) => {
        const succNode = workflow.nodes.find(target => target.id === succId);
        if (!succNode) return;

        const isAnimated = n.status === 'active';
        const strokeColor = n.status === 'completed' 
          ? '#10b981' 
          : n.status === 'active' 
            ? '#f59e0b' 
            : 'var(--border-subtle)';

        edgeList.push({
          id: `e-${n.id}-${succId}`,
          source: n.id,
          target: succId,
          animated: isAnimated,
          style: { 
            stroke: strokeColor, 
            strokeWidth: 2 
          }
        });
      });
    });
    return edgeList;
  }, [workflow.nodes]);

  // Node Drag Handler to persist positions
  const handleNodeDragStop = useCallback((_event: unknown, node: Node) => {
    updateNodePosition(workflow.id, node.id, node.position);
  }, [workflow.id, updateNodePosition]);

  if (workflow.nodes.length === 0) {
    return (
      <div 
        className="glass-panel" 
        style={{ 
          height: '620px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '16px',
          textAlign: 'center',
          padding: '32px'
        }}
      >
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f59e0b'
        }}>
          <Hourglass size={32} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Flujo sin hitos configurados
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto' }}>
            Este pipeline operativo aún no cuenta con tareas ni dependencias. Comienza agregando el primer nodo de proceso.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={onOpenAddNodeModal}
          leftIcon={<Plus size={16} />}
        >
          Agregar Primer Hito
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="glass-panel" 
      style={{ 
        height: '640px', 
        padding: '0', 
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      {/* Legend / Info Overlay */}
      <div style={{
        position: 'absolute',
        top: '18px',
        left: '18px',
        zIndex: 10,
        background: 'rgba(11, 15, 25, 0.88)',
        backdropFilter: 'blur(8px)',
        padding: '10px 16px',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 700 }}>
          {workflow.name}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            Completado
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
            En Progreso
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
            Bloqueado
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
            Pendiente
          </span>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeDragStop={handleNodeDragStop}
        fitView
      >
        <Background color="#1e293b" gap={16} />
        <Controls />
      </ReactFlow>

      <ConfirmModal
        isOpen={Boolean(nodeToDelete)}
        onClose={() => setNodeToDelete(null)}
        onConfirm={() => {
          if (nodeToDelete) {
            void deleteNodeFromWorkflow(workflow.id, nodeToDelete.id);
          }
        }}
        title="Eliminar hito del flujo"
        description={`¿Eliminar el hito "${nodeToDelete?.label ?? ''}" del flujo?`}
        confirmLabel="Eliminar hito"
      />
    </div>
  );
};
