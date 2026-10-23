import { z } from 'zod';

export const supplierCategorySchema = z.object({
  label: z.string().trim().min(1, 'El nombre del rubro es obligatorio.'),
  color: z.string().min(1, 'El color identificador es obligatorio.')
});
export type SupplierCategoryFormData = z.infer<typeof supplierCategorySchema>;

export const crewDepartmentSchema = z.object({
  name: z.string().trim().min(1, 'El nombre del departamento es obligatorio.')
});
export type CrewDepartmentFormData = z.infer<typeof crewDepartmentSchema>;

export const eventScopeSchema = z.object({
  name: z.string().trim().min(1, 'El nombre del alcance técnico es obligatorio.')
});
export type EventScopeFormData = z.infer<typeof eventScopeSchema>;

export const eventStageSchema = z.object({
  label: z.string().trim().min(1, 'El nombre de la etapa es obligatorio.'),
  color: z.string().min(1, 'El color identificador es obligatorio.')
});
export type EventStageFormData = z.infer<typeof eventStageSchema>;
