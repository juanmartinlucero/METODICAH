import { z } from 'zod';
import { validateTaxId } from '@/utils/clientUtils';

export const crewFormSchema = z.object({
  userName: z.string().trim().min(1, 'El nombre y apellido es obligatorio.'),
  documentNumber: z.string().optional(),
  taxId: z.string().trim().refine(val => !val || validateTaxId(val), {
    message: 'El CUIL / CUIT ingresado no es válido (formato XX-XXXXXXXX-X).'
  }).optional(),
  birthDate: z.string().optional(),
  avatarUrl: z.string().optional(),
  type: z.enum(['staff_interno', 'freelancer']),
  sector: z.string().min(1, 'El sector técnico es obligatorio.'),
  customSector: z.string().optional(),
  roleInEvent: z.string().trim().min(1, 'El rol técnico en producciones es obligatorio.'),
  seniority: z.enum(['lead', 'senior', 'semi_senior', 'junior']).optional(),
  userEmail: z.string().trim().email('Ingresa un correo electrónico válido.').min(1, 'El email es obligatorio.'),
  phone: z.string().optional(),
  city: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  artInsurance: z.string().optional(),
  clothingSize: z.string().optional(),
  dietaryRestrictions: z.string().optional(),
  notes: z.string().optional(),
  hasSystemAccess: z.boolean().optional(),
  globalRole: z.enum(['admin', 'team_member', 'guest']).optional(),
  password: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.sector === 'otro' && (!data.customSector || data.customSector.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['customSector'],
      message: 'Por favor especifica el nombre del sector.'
    });
  }
  if (data.hasSystemAccess && !data.globalRole) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['globalRole'],
      message: 'Debes seleccionar un rol en la plataforma si habilitas el acceso.'
    });
  }
  if (data.hasSystemAccess && data.password && data.password.trim().length > 0 && data.password.trim().length < 6) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['password'],
      message: 'La contraseña debe tener al menos 6 caracteres.'
    });
  }
});

export type CrewFormData = z.infer<typeof crewFormSchema>;
