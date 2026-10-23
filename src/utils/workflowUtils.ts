import type { ProcessNode, ProcessNodeStatus } from '@/types/metodicah';

export const WORKFLOW_CATEGORIES = [
  'Producción General',
  'Eventos Corporativos',
  'Festivales & Recitales',
  'Técnica & Montaje',
  'Habilitaciones & Legal'
] as const;

export type WorkflowCategory = typeof WORKFLOW_CATEGORIES[number];

export const NODE_CATEGORIES = [
  'Legal & Seguros',
  'Infraestructura',
  'Técnica Audio',
  'Técnica Luces/Video',
  'Artística',
  'Operación Show',
  'Comercial & Finanzas',
  'Logística & Accesos'
] as const;

export type NodeCategory = typeof NODE_CATEGORIES[number];

export const STATUS_COLORS: Record<ProcessNodeStatus, string> = {
  completed: '#10b981',
  active: '#f59e0b',
  blocked: '#ef4444',
  pending: '#3b82f6'
};

export const NODE_STATUS_CONFIG: Record<ProcessNodeStatus, { label: string; color: string; dot: string }> = {
  completed: { label: 'Completado', color: '#10b981', dot: '#10b981' },
  active: { label: 'En Progreso', color: '#f59e0b', dot: '#f59e0b' },
  blocked: { label: 'Bloqueado', color: '#ef4444', dot: '#ef4444' },
  pending: { label: 'Pendiente', color: '#3b82f6', dot: '#3b82f6' }
};

export interface WorkflowMetrics {
  totalNodes: number;
  totalHours: number;
  completedNodes: number;
  activeNodes: number;
  blockedNodes: number;
  pendingNodes: number;
}

export function calculateWorkflowMetrics(nodes: ProcessNode[] = []): WorkflowMetrics {
  let totalHours = 0;
  let completedNodes = 0;
  let activeNodes = 0;
  let blockedNodes = 0;
  let pendingNodes = 0;

  for (const node of nodes) {
    totalHours += Number(node.estimatedHours) || 0;
    switch (node.status) {
      case 'completed':
        completedNodes++;
        break;
      case 'active':
        activeNodes++;
        break;
      case 'blocked':
        blockedNodes++;
        break;
      case 'pending':
      default:
        pendingNodes++;
        break;
    }
  }

  return {
    totalNodes: nodes.length,
    totalHours,
    completedNodes,
    activeNodes,
    blockedNodes,
    pendingNodes
  };
}

export function generateWorkflowId(): string {
  const uuid = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().replace(/-/g, '').substring(0, 8)
    : Math.random().toString(36).substring(2, 10);
  return `wf_${uuid}`;
}

export function generateNodeId(): string {
  const uuid = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().replace(/-/g, '').substring(0, 8)
    : Math.random().toString(36).substring(2, 10);
  return `node_${uuid}`;
}
