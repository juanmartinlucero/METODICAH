import { z } from 'zod';
import { validateTaxId } from '@/utils/clientUtils';

export const TAX_CONDITIONS_SUPPLIER = [
  'Responsable Inscripto',
  'Monotributo',
  'Exento'
] as const;

export const supplierFormSchema = z.object({
  name: z.string().trim().min(1, 'El nombre comercial / fantasía es obligatorio.'),
  company: z.string().optional(),
  category: z.string().min(1, 'Debes seleccionar un rubro técnico.'),
  taxId: z.string().trim().refine(val => !val || validateTaxId(val), {
    message: 'El CUIT ingresado no es válido (formato XX-XXXXXXXX-X).'
  }),
  taxCondition: z.string(),
  contactName: z.string().optional(),
  contactRole: z.string().optional(),
  email: z.string().trim().email('Ingresa un email de contacto válido.').min(1, 'El email es obligatorio.'),
  phone: z.string().trim().min(1, 'El teléfono / WhatsApp es obligatorio.'),
  emergencyPhone: z.string().optional(),
  website: z.string().optional(),
  equipmentHighlights: z.string().optional(),
  billingEmail: z.string().trim().email('Ingresa un email de facturación válido.').or(z.literal('')).optional(),
  paymentTerms: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string(),
  zipCode: z.string().optional(),
  notes: z.string().optional()
});

export type SupplierFormData = z.infer<typeof supplierFormSchema>;
