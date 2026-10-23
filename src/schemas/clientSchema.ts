import { z } from 'zod';
import { validateTaxId } from '@/utils/clientUtils';

export const INDUSTRY_OPTIONS = [
  'Entretenimiento & Música',
  'Marketing & BTL',
  'Tecnología & Software',
  'Moda & Lifestyle',
  'Bebidas & Alimentos',
  'Automotriz & Movilidad',
  'Finanzas & Banca',
  'Farmacéutica & Salud',
  'Institucional & Gubernamental',
  'Inmobiliario & Construcción',
  'Otro Rubro'
] as const;

export const TAX_CONDITIONS_EMPRESA = [
  'Responsable Inscripto',
  'Monotributista',
  'Exento',
  'Gran Contribuyente'
] as const;

export const TAX_CONDITIONS_PERSONA = [
  'Consumidor Final',
  'Monotributista',
  'Responsable Inscripto',
  'Exento'
] as const;

export const EVENT_TYPES_PERSONA = [
  'Boda / Casamiento',
  'Cumpleaños / Aniversario',
  'Fiesta Privada VIP',
  'Show / Performance Artística',
  'Celebración Familiar / Social',
  'Otro'
] as const;

export const clientFormSchema = z.object({
  clientType: z.enum(['empresa', 'persona']),
  name: z.string().trim().min(1, 'El nombre o persona de contacto es obligatorio.'),
  email: z.string().trim().email('Ingresa un correo electrónico válido.').or(z.literal('')),
  phone: z.string().trim().min(1, 'El teléfono de contacto es obligatorio.'),
  taxId: z.string().trim().optional().refine(val => !val || validateTaxId(val), {
    message: 'El CUIT / CUIL ingresado no es válido (formato XX-XXXXXXXX-X).'
  }),
  taxCondition: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  notes: z.string().optional(),

  // Empresa specific
  company: z.string().optional(),
  fantasyName: z.string().optional(),
  contactRole: z.string().optional(),
  industry: z.string().optional(),
  website: z.string().optional(),
  billingContactName: z.string().optional(),
  billingContactEmail: z.string().trim().email('Ingresa un email de facturación válido.').or(z.literal('')).optional(),
  paymentTerms: z.string().optional(),
  supplierRequirements: z.string().optional(),

  // Persona specific
  documentNumber: z.string().optional(),
  birthDate: z.string().optional(),
  frequentEventType: z.string().optional(),
  preferences: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.clientType === 'empresa' && (!data.company || data.company.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['company'],
      message: 'La Razón Social es requerida para cuentas de tipo Empresa.'
    });
  }
});

export type ClientFormData = z.infer<typeof clientFormSchema>;
