import { z } from 'zod';

export const timingFormSchema = z.object({
  timeStart: z.string().min(1, 'La hora de inicio es obligatoria.'),
  timeEnd: z.string().min(1, 'La hora de fin es obligatoria.'),
  title: z.string().trim().min(1, 'El título del hito o tarea es obligatorio.'),
  sector: z.string().trim().min(1, 'El sector es obligatorio.'),
  responsible: z.string().trim().min(1, 'El responsable es obligatorio.')
}).refine(
  (data) => {
    if (!data.timeStart || !data.timeEnd) return true;
    return data.timeEnd >= data.timeStart;
  },
  {
    message: 'La hora de fin debe ser igual o posterior a la hora de inicio.',
    path: ['timeEnd']
  }
);

export type TimingFormData = z.infer<typeof timingFormSchema>;
