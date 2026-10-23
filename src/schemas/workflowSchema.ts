import { z } from 'zod';
import { WORKFLOW_CATEGORIES, NODE_CATEGORIES } from '@/utils/workflowUtils';

export const createWorkflowSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre del flujo es obligatorio.')
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(100, 'El nombre no puede superar los 100 caracteres.'),
  description: z
    .string()
    .trim()
    .max(500, 'La descripción no puede superar los 500 caracteres.')
    .optional(),
  category: z.enum(WORKFLOW_CATEGORIES, {
    error: 'Selecciona una categoría válida para el flujo.'
  }),
  templateId: z.string().optional()
});

export type CreateWorkflowFormData = z.infer<typeof createWorkflowSchema>;

export const addWorkflowNodeSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, 'El nombre del hito es obligatorio.')
    .min(2, 'El hito debe tener al menos 2 caracteres.')
    .max(120, 'El nombre del hito no puede superar los 120 caracteres.'),
  category: z.enum(NODE_CATEGORIES, {
    error: 'Selecciona una categoría técnica válida.'
  }),
  assignedTo: z
    .string()
    .trim()
    .min(1, 'El responsable o proveedor es obligatorio.'),
  estimatedHours: z
    .number({ error: 'La duración estimada debe ser un número.' })
    .int('La duración debe ser un número entero.')
    .min(1, 'La duración mínima es de 1 hora.')
    .max(200, 'La duración máxima permitida es de 200 horas.'),
  status: z.enum(['pending', 'active', 'completed', 'blocked'], {
    error: 'Selecciona un estado operativo válido.'
  }),
  predecessorId: z.string().optional()
});

export type AddWorkflowNodeFormData = z.infer<typeof addWorkflowNodeSchema>;
