import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es obligatorio.')
    .email('Ingresa un correo electrónico válido.'),
  password: z
    .string()
    .min(1, 'La contraseña es obligatoria.')
    .min(6, 'La contraseña debe contener al menos 6 caracteres.'),
  rememberMe: z.boolean().optional()
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    companyName: z
      .string()
      .trim()
      .min(1, 'El nombre de la productora o estudio es obligatorio.')
      .min(2, 'El nombre de la productora debe tener al menos 2 caracteres.'),
    name: z
      .string()
      .trim()
      .min(1, 'El nombre completo del administrador es obligatorio.')
      .min(2, 'El nombre debe tener al menos 2 caracteres.'),
    email: z
      .string()
      .trim()
      .min(1, 'El correo electrónico es obligatorio.')
      .email('Ingresa un correo electrónico válido.'),
    specialty: z
      .string()
      .trim()
      .optional(),
    password: z
      .string()
      .min(1, 'La contraseña es obligatoria.')
      .min(6, 'La contraseña debe tener al menos 6 caracteres.'),
    confirmPassword: z
      .string()
      .min(1, 'Por favor confirma tu contraseña.'),
    terms: z
      .boolean()
      .refine((val) => val === true, {
        message: 'Debes aceptar los términos de uso y políticas operativas de METODICAH.'
      })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword']
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
