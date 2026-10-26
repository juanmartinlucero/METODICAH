import { z } from 'zod';

export const ACCREDITATION_ACCESS_LEVELS = ['ALL ACCESS', 'STAFF', 'GUEST'] as const;
export const ACCREDITATION_STATUSES = ['solicitada', 'aprobada', 'impresa', 'en_sitio', 'revocada'] as const;

export const accreditationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio.')
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(80, 'El nombre no puede superar los 80 caracteres.'),
  lastName: z
    .string()
    .trim()
    .min(1, 'El apellido es obligatorio.')
    .min(2, 'El apellido debe tener al menos 2 caracteres.')
    .max(80, 'El apellido no puede superar los 80 caracteres.'),
  documentNumber: z
    .string()
    .trim()
    .min(1, 'El DNI o documento es obligatorio.')
    .min(6, 'El documento debe tener al menos 6 caracteres.')
    .max(20, 'El documento no puede superar los 20 caracteres.')
    .regex(/^[a-zA-Z0-9.-]+$/, 'El documento solo puede contener números, letras, puntos o guiones.'),
  role: z
    .string()
    .trim()
    .min(1, 'El rol o función en la producción es obligatorio.')
    .max(100, 'El rol no puede superar los 100 caracteres.'),
  company: z
    .string()
    .trim()
    .min(1, 'La empresa o proveedor es obligatorio.')
    .max(100, 'El nombre de empresa no puede superar los 100 caracteres.'),
  accessLevel: z.enum(ACCREDITATION_ACCESS_LEVELS, {
    message: 'El nivel de acceso debe ser ALL ACCESS, STAFF o GUEST.'
  }),
  status: z.enum(ACCREDITATION_STATUSES),
  insuranceVerified: z.boolean(),
  emergencyPhone: z
    .string()
    .trim()
    .max(50, 'El teléfono no puede superar los 50 caracteres.')
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .trim()
    .max(500, 'Las observaciones no pueden superar los 500 caracteres.')
    .optional()
    .or(z.literal(''))
});

export type AccreditationFormData = z.infer<typeof accreditationSchema>;
