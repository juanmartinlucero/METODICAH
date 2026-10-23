import { describe, it, expect } from 'vitest';
import { createWorkflowSchema, addWorkflowNodeSchema } from './workflowSchema';

describe('workflowSchema Validation Suite', () => {
  describe('createWorkflowSchema', () => {
    it('validates a correct workflow creation payload', () => {
      const result = createWorkflowSchema.safeParse({
        name: 'Pipeline de Festivales 2026',
        description: 'Protocolo para festivales masivos',
        category: 'Festivales & Recitales',
        templateId: 'blank'
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Pipeline de Festivales 2026');
        expect(result.data.category).toBe('Festivales & Recitales');
      }
    });

    it('fails when name is empty or too short', () => {
      const emptyResult = createWorkflowSchema.safeParse({
        name: '   ',
        category: 'Producción General'
      });
      expect(emptyResult.success).toBe(false);

      const shortResult = createWorkflowSchema.safeParse({
        name: 'A',
        category: 'Producción General'
      });
      expect(shortResult.success).toBe(false);
    });

    it('fails when category is not part of WORKFLOW_CATEGORIES', () => {
      const invalidCatResult = createWorkflowSchema.safeParse({
        name: 'Pipeline Válido',
        category: 'Categoría Inexistente'
      });
      expect(invalidCatResult.success).toBe(false);
    });
  });

  describe('addWorkflowNodeSchema', () => {
    it('validates a correct process node payload', () => {
      const result = addWorkflowNodeSchema.safeParse({
        label: 'Montaje de Torres FOH',
        category: 'Infraestructura',
        assignedTo: 'Equipo de Producción',
        estimatedHours: 6,
        status: 'pending'
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.label).toBe('Montaje de Torres FOH');
        expect(result.data.estimatedHours).toBe(6);
        expect(result.data.status).toBe('pending');
        expect(result.data.assignedTo).toBe('Equipo de Producción');
      }
    });

    it('fails when estimatedHours is out of bounds', () => {
      const zeroHours = addWorkflowNodeSchema.safeParse({
        label: 'Montaje',
        category: 'Infraestructura',
        assignedTo: 'Equipo',
        estimatedHours: 0,
        status: 'pending'
      });
      expect(zeroHours.success).toBe(false);

      const excessiveHours = addWorkflowNodeSchema.safeParse({
        label: 'Montaje',
        category: 'Infraestructura',
        assignedTo: 'Equipo',
        estimatedHours: 201,
        status: 'pending'
      });
      expect(excessiveHours.success).toBe(false);
    });

    it('fails when status is invalid', () => {
      const invalidStatus = addWorkflowNodeSchema.safeParse({
        label: 'Montaje',
        category: 'Infraestructura',
        assignedTo: 'Equipo',
        estimatedHours: 5,
        status: 'status_inexistente'
      });
      expect(invalidStatus.success).toBe(false);
    });
  });
});
