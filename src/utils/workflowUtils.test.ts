import { describe, it, expect } from 'vitest';
import { 
  WORKFLOW_CATEGORIES, 
  NODE_CATEGORIES, 
  STATUS_COLORS, 
  NODE_STATUS_CONFIG, 
  calculateWorkflowMetrics, 
  generateWorkflowId, 
  generateNodeId 
} from './workflowUtils';
import type { ProcessNode } from '@/types/metodicah';

describe('workflowUtils Suite', () => {
  it('exposes immutable and valid category catalogs', () => {
    expect(WORKFLOW_CATEGORIES.length).toBeGreaterThan(0);
    expect(WORKFLOW_CATEGORIES).toContain('Producción General');
    expect(NODE_CATEGORIES.length).toBeGreaterThan(0);
    expect(NODE_CATEGORIES).toContain('Técnica Audio');
  });

  it('provides complete status configurations and colors', () => {
    expect(STATUS_COLORS.completed).toBe('#10b981');
    expect(STATUS_COLORS.active).toBe('#f59e0b');
    expect(STATUS_COLORS.blocked).toBe('#ef4444');
    expect(STATUS_COLORS.pending).toBe('#3b82f6');

    expect(NODE_STATUS_CONFIG.completed.label).toBe('Completado');
  });

  describe('calculateWorkflowMetrics', () => {
    it('returns zeroes for empty node list or undefined', () => {
      const metrics = calculateWorkflowMetrics([]);
      expect(metrics).toEqual({
        totalNodes: 0,
        totalHours: 0,
        completedNodes: 0,
        activeNodes: 0,
        blockedNodes: 0,
        pendingNodes: 0
      });

      const metricsUndef = calculateWorkflowMetrics(undefined);
      expect(metricsUndef.totalNodes).toBe(0);
    });

    it('correctly aggregates hours and node status counts', () => {
      const mockNodes: ProcessNode[] = [
        {
          id: 'n1',
          label: 'Hito 1',
          category: 'Legal & Seguros',
          predecessorIds: [],
          successorIds: [],
          status: 'completed',
          estimatedHours: 8,
          assignedTo: 'Tester'
        },
        {
          id: 'n2',
          label: 'Hito 2',
          category: 'Infraestructura',
          predecessorIds: [],
          successorIds: [],
          status: 'active',
          estimatedHours: 12,
          assignedTo: 'Tester'
        },
        {
          id: 'n3',
          label: 'Hito 3',
          category: 'Técnica Audio',
          predecessorIds: [],
          successorIds: [],
          status: 'blocked',
          estimatedHours: 4,
          assignedTo: 'Tester'
        },
        {
          id: 'n4',
          label: 'Hito 4',
          category: 'Artística',
          predecessorIds: [],
          successorIds: [],
          status: 'pending',
          estimatedHours: 6,
          assignedTo: 'Tester'
        }
      ];

      const metrics = calculateWorkflowMetrics(mockNodes);
      expect(metrics.totalNodes).toBe(4);
      expect(metrics.totalHours).toBe(30); // 8 + 12 + 4 + 6
      expect(metrics.completedNodes).toBe(1);
      expect(metrics.activeNodes).toBe(1);
      expect(metrics.blockedNodes).toBe(1);
      expect(metrics.pendingNodes).toBe(1);
    });
  });

  describe('ID generation', () => {
    it('generates unique prefixed workflow and node IDs', () => {
      const wfId1 = generateWorkflowId();
      const wfId2 = generateWorkflowId();
      expect(wfId1).toMatch(/^wf_[a-z0-9]+$/);
      expect(wfId2).toMatch(/^wf_[a-z0-9]+$/);
      expect(wfId1).not.toBe(wfId2);

      const nodeId1 = generateNodeId();
      const nodeId2 = generateNodeId();
      expect(nodeId1).toMatch(/^node_[a-z0-9]+$/);
      expect(nodeId2).toMatch(/^node_[a-z0-9]+$/);
      expect(nodeId1).not.toBe(nodeId2);
    });
  });
});
