import { create } from 'zustand';
import type { WorkflowDefinition, CreateWorkflowData, ProcessNode } from '../types/metodicah';
import { workflowRepository } from '../services/repositories';
import { generateWorkflowId, generateNodeId } from '../utils/workflowUtils';
import { getTodayLocalDateString } from '../utils/dateUtils';
import { formatFirebaseError } from '@/utils/firebaseErrors';

interface WorkflowState {
  workflows: WorkflowDefinition[];
  selectedWorkflowId: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;

  // Actions
  loadWorkflows: (accountId?: string) => Promise<void>;
  subscribeWorkflows: () => () => void;
  selectWorkflow: (id: string | null) => void;
  createWorkflow: (data: CreateWorkflowData) => Promise<WorkflowDefinition>;
  updateWorkflow: (id: string, updates: Partial<WorkflowDefinition>) => Promise<void>;
  deleteWorkflow: (id: string) => Promise<void>;

  // Node Actions for a specific workflow
  addNodeToWorkflow: (workflowId: string, nodeData: Omit<ProcessNode, 'id' | 'workflowId'>) => Promise<ProcessNode>;
  updateNodeInWorkflow: (workflowId: string, nodeId: string, updates: Partial<ProcessNode>) => Promise<void>;
  deleteNodeFromWorkflow: (workflowId: string, nodeId: string) => Promise<void>;
  updateNodePosition: (workflowId: string, nodeId: string, position: { x: number; y: number }) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  workflows: [],
  selectedWorkflowId: null,
  isLoading: false,
  isSyncing: false,
  error: null,

  loadWorkflows: async (accountId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const workflows = await workflowRepository.getWorkflows(accountId);
      const currentSelected = get().selectedWorkflowId;
      const validSelected = workflows.some(w => w.id === currentSelected)
        ? currentSelected
        : workflows[0]?.id || null;

      set({ workflows, selectedWorkflowId: validSelected, isLoading: false });
    } catch (err) {
      set({ 
        isLoading: false, 
        error: formatFirebaseError(err, 'Error al cargar flujos de trabajo')
      });
    }
  },

  subscribeWorkflows: () => {
    if (!workflowRepository.subscribeWorkflows) return () => {};
    return workflowRepository.subscribeWorkflows(
      (workflows) => {
        if (!get().isSyncing) {
          const currentSelected = get().selectedWorkflowId;
          const validSelected = workflows.some(w => w.id === currentSelected)
            ? currentSelected
            : workflows[0]?.id || null;
          set({ workflows, selectedWorkflowId: validSelected, isLoading: false });
        }
      },
      (errorMsg) => {
        set({ error: errorMsg, isLoading: false });
      }
    );
  },

  selectWorkflow: (id) => {
    set({ selectedWorkflowId: id });
  },

  createWorkflow: async (data) => {
    const previousWorkflows = get().workflows;
    const previousSelectedId = get().selectedWorkflowId;
    const newId = generateWorkflowId();
    const now = getTodayLocalDateString();
    const newWorkflow: WorkflowDefinition = {
      ...data,
      id: newId,
      nodes: data.nodes || [],
      createdAt: now,
      updatedAt: now
    };

    const updated = [...previousWorkflows, newWorkflow];
    set({ workflows: updated, selectedWorkflowId: newId, isSyncing: true, error: null });

    try {
      await workflowRepository.saveWorkflow(newWorkflow);
      set({ isSyncing: false });
      return newWorkflow;
    } catch (err) {
      set({ 
        workflows: previousWorkflows,
        selectedWorkflowId: previousSelectedId,
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al guardar nuevo flujo')
      });
      return newWorkflow;
    }
  },

  updateWorkflow: async (id, updates) => {
    const previousWorkflows = get().workflows;
    const index = previousWorkflows.findIndex(w => w.id === id);
    if (index === -1) return;

    const updatedWorkflow: WorkflowDefinition = {
      ...previousWorkflows[index],
      ...updates,
      updatedAt: getTodayLocalDateString()
    };

    const updated = [...previousWorkflows];
    updated[index] = updatedWorkflow;
    set({ workflows: updated, isSyncing: true, error: null });

    try {
      await workflowRepository.saveWorkflow(updatedWorkflow);
      set({ isSyncing: false });
    } catch (err) {
      set({ 
        workflows: previousWorkflows,
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al actualizar flujo')
      });
    }
  },

  deleteWorkflow: async (id) => {
    const previousWorkflows = get().workflows;
    const previousSelectedId = get().selectedWorkflowId;
    const updated = previousWorkflows.filter(w => w.id !== id);
    const nextSelected = previousSelectedId === id 
      ? updated[0]?.id || null 
      : previousSelectedId;

    set({ workflows: updated, selectedWorkflowId: nextSelected, isSyncing: true, error: null });

    try {
      await workflowRepository.deleteWorkflow(id);
      set({ isSyncing: false });
    } catch (err) {
      set({ 
        workflows: previousWorkflows,
        selectedWorkflowId: previousSelectedId,
        isSyncing: false, 
        error: formatFirebaseError(err, 'Error al eliminar flujo')
      });
    }
  },

  addNodeToWorkflow: async (workflowId, nodeData) => {
    const { workflows } = get();
    const targetWorkflow = workflows.find(w => w.id === workflowId);
    if (!targetWorkflow) {
      throw new Error(`No se encontró el flujo con ID: ${workflowId}`);
    }

    const newNodeId = generateNodeId();
    const newNode: ProcessNode = {
      ...nodeData,
      id: newNodeId,
      workflowId,
      position: nodeData.position || { 
        x: 100 + (targetWorkflow.nodes.length % 4) * 260, 
        y: 120 + Math.floor(targetWorkflow.nodes.length / 4) * 140 
      }
    };

    let updatedNodes = [...targetWorkflow.nodes, newNode];
    if (newNode.predecessorIds && newNode.predecessorIds.length > 0) {
      updatedNodes = updatedNodes.map(n => {
        if (newNode.predecessorIds.includes(n.id) && !n.successorIds.includes(newNode.id)) {
          return { ...n, successorIds: [...n.successorIds, newNode.id] };
        }
        return n;
      });
    }

    await get().updateWorkflow(workflowId, { nodes: updatedNodes });
    return newNode;
  },

  updateNodeInWorkflow: async (workflowId, nodeId, updates) => {
    const { workflows } = get();
    const target = workflows.find(w => w.id === workflowId);
    if (!target) return;

    const updatedNodes = target.nodes.map(n => 
      n.id === nodeId ? { ...n, ...updates } : n
    );

    await get().updateWorkflow(workflowId, { nodes: updatedNodes });
  },

  deleteNodeFromWorkflow: async (workflowId, nodeId) => {
    const { workflows } = get();
    const target = workflows.find(w => w.id === workflowId);
    if (!target) return;

    const updatedNodes = target.nodes
      .filter(n => n.id !== nodeId)
      .map(n => ({
        ...n,
        predecessorIds: n.predecessorIds.filter(id => id !== nodeId),
        successorIds: n.successorIds.filter(id => id !== nodeId)
      }));

    await get().updateWorkflow(workflowId, { nodes: updatedNodes });
  },

  updateNodePosition: (workflowId, nodeId, position) => {
    const previousWorkflows = get().workflows;
    const target = previousWorkflows.find(w => w.id === workflowId);
    if (!target) return;

    const updatedNodes = target.nodes.map(n => 
      n.id === nodeId ? { ...n, position } : n
    );

    const updatedWorkflow = {
      ...target,
      nodes: updatedNodes
    };

    const updated = previousWorkflows.map(w => w.id === workflowId ? updatedWorkflow : w);
    set({ workflows: updated });

    workflowRepository.saveWorkflow(updatedWorkflow).catch(err => {
      set({
        workflows: previousWorkflows,
        error: formatFirebaseError(err, 'Error guardando posición del nodo')
      });
    });
  }
}));
