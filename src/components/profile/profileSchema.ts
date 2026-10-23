import { z } from 'zod';

export const profileFormSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio.'),
  email: z.string().trim().min(1, 'El correo electrónico es obligatorio.').email('Ingresa un correo electrónico válido.'),
  phone: z.string().optional(),
  specialty: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional()
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
