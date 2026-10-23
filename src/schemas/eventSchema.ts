import { z } from 'zod';

export const eventFormSchema = z.object({
  title: z.string().trim().min(1, 'El título del evento es obligatorio.'),
  clientId: z.string().min(1, 'Debes seleccionar un cliente u organizador.'),
  concept: z.string().optional(),
  venue: z.string().trim().min(1, 'El recinto o venue es obligatorio.'),
  location: z.string().trim().min(1, 'La ubicación o dirección es obligatoria.'),
  date: z.string().min(1, 'La fecha del evento es obligatoria.'),
  startTime: z.string().min(1, 'El horario de inicio es obligatorio.'),
  endTime: z.string().min(1, 'El horario de fin es obligatorio.'),
  attendeesCount: z.string().optional(),
  scoutingDate: z.string().optional(),
  deployDate: z.string().optional(),
  scope: z.array(z.string()),
  crewIds: z.array(z.string()),
  summary: z.string().optional(),
  thirdParties: z.array(z.string()),
  clientPreferences: z.array(z.string())
});

export type EventFormData = z.infer<typeof eventFormSchema>;
