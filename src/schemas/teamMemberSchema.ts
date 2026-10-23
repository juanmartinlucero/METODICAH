import { z } from 'zod';

export const teamMemberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre completo es obligatorio.')
    .min(2, 'El nombre debe tener al menos 2 caracteres.'),
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es obligatorio.')
    .email('Ingresa un correo electrónico corporativo válido.'),
  globalRole: z.enum(['team_member', 'guest'], {
    error: 'Selecciona un rol válido para el integrante.'
  }),
  specialty: z
    .string()
    .trim()
    .min(1, 'La especialidad o cargo técnico es obligatorio.'),
  phone: z
    .string()
    .trim()
    .optional(),
  password: z
    .string()
    .min(1, 'La contraseña provisional es obligatoria.')
    .min(6, 'La contraseña debe tener al menos 6 caracteres.')
});

export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;
