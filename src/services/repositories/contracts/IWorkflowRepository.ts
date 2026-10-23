import type { WorkflowDefinition } from '@/types/metodicah';

export interface IWorkflowRepository {
  getWorkflows(accountId?: string): Promise<WorkflowDefinition[]>;
  saveWorkflows(workflows: WorkflowDefinition[]): Promise<void>;
  saveWorkflow(workflow: WorkflowDefinition): Promise<WorkflowDefinition>;
  deleteWorkflow(id: string): Promise<void>;
  subscribeWorkflows?(onData: (workflows: WorkflowDefinition[]) => void, onError?: (error: string) => void): () => void;
}
