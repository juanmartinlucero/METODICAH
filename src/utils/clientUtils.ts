import type { Client, ClientType } from '../types/metodicah';
import { buildWhatsAppUrl } from './whatsappUtils';
import { exportToCSV, parseCSVLine, type CSVColumn } from './csvUtils';
import { getTodayLocalDateString } from './dateUtils';

/**
 * Formatea un CUIT / CUIL eliminando caracteres no numéricos e insertando los guiones (XX-XXXXXXXX-X).
 */
export function formatTaxId(value: string): string {
  if (!value) return '';
  const clean = value.replace(/\D/g, '').slice(0, 11);
  if (clean.length <= 2) return clean;
  if (clean.length <= 10) return `${clean.slice(0, 2)}-${clean.slice(2)}`;
  return `${clean.slice(0, 2)}-${clean.slice(2, 10)}-${clean.slice(10)}`;
}

/**
 * Valida un CUIT/CUIL de Argentina mediante el algoritmo Módulo 11.
 */
export function validateTaxId(taxId: string): boolean {
  if (!taxId) return true; // Opcional si está vacío
  const clean = taxId.replace(/\D/g, '');
  if (clean.length !== 11) return false;

  const type = clean.slice(0, 2);
  const validTypes = ['20', '23', '24', '27', '30', '33', '34'];
  if (!validTypes.includes(type)) return false;

  const multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean[i], 10) * multipliers[i];
  }

  const mod = 11 - (sum % 11);
  let expectedVerifier = mod;
  if (mod === 11) expectedVerifier = 0;
  if (mod === 10) expectedVerifier = 9;

  return parseInt(clean[10], 10) === expectedVerifier;
}

/**
 * Genera un enlace directo a WhatsApp Web a partir de un número de teléfono.
 * Utiliza el generador unificado de WhatsApp de METODICAH.
 */
export function getWhatsAppLink(phone: string, clientName?: string): string {
  const greeting = clientName 
    ? `Hola ${clientName}, te contactamos desde el equipo de producción de METODICAH.`
    : 'Hola, te contactamos desde el equipo de producción de METODICAH.';

  return buildWhatsAppUrl(phone, greeting);
}

/**
 * Columnas para exportación de clientes a CSV.
 */
export const CLIENT_CSV_COLUMNS: CSVColumn<Client>[] = [
  { header: 'Tipo', accessor: c => (c.clientType || (c.company ? 'empresa' : 'persona')) === 'empresa' ? 'Empresa' : 'Persona' },
  { header: 'Nombre / Contacto', accessor: c => c.name },
  { header: 'Razón Social', accessor: c => c.company },
  { header: 'Nombre Fantasía', accessor: c => c.fantasyName },
  { header: 'CUIT/CUIL', accessor: c => c.taxId },
  { header: 'DNI', accessor: c => c.documentNumber },
  { header: 'Condición IVA', accessor: c => c.taxCondition },
  { header: 'Email', accessor: c => c.email },
  { header: 'Teléfono', accessor: c => c.phone },
  { header: 'Rubro', accessor: c => c.industry },
  { header: 'Cargo', accessor: c => c.contactRole },
  { header: 'Ciudad', accessor: c => c.city },
  { header: 'Provincia', accessor: c => c.state },
  { header: 'Dirección', accessor: c => c.address },
  { header: 'Código Postal', accessor: c => c.zipCode },
  { header: 'Sitio Web', accessor: c => c.website },
  { header: 'Contacto Facturación', accessor: c => c.billingContactName },
  { header: 'Email Facturación', accessor: c => c.billingContactEmail },
  { header: 'Términos de Pago', accessor: c => c.paymentTerms },
  { header: 'Requisitos Proveedores', accessor: c => c.supplierRequirements },
  { header: 'Tipo Evento Frecuente', accessor: c => c.frequentEventType },
  { header: 'Preferencias', accessor: c => c.preferences },
  { header: 'Notas', accessor: c => c.notes },
  { header: 'Eventos Activos', accessor: c => c.activeEventsCount ?? 0 },
  { header: 'Fecha Alta', accessor: c => c.createdAt },
];

/**
 * Exporta el directorio de clientes a un archivo CSV codificado en UTF-8 con BOM (compatible con Excel).
 */
export function exportClientsToCSV(clients: Client[]): void {
  const filename = `METODICAH_Clientes_${getTodayLocalDateString()}.csv`;
  exportToCSV(clients, CLIENT_CSV_COLUMNS, filename);
}

/**
 * Parsea un archivo CSV para importar nuevos clientes masivamente.
 */
export function parseClientsCSV(csvText: string): Omit<Client, 'id' | 'createdAt'>[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const clients: Omit<Client, 'id' | 'createdAt'>[] = [];

  // Saltar fila de cabecera
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 3) continue;

    const tipoRaw = cols[0]?.toLowerCase();
    const isEmpresa = tipoRaw.includes('empresa') || !!cols[2];
    const clientType: ClientType = isEmpresa ? 'empresa' : 'persona';

    const name = cols[1] || (isEmpresa ? cols[2] : '') || 'Sin Nombre';
    const email = cols[7] || '';
    const phone = cols[8] || '';

    if (!name.trim()) continue;

    clients.push({
      clientType,
      name,
      company: isEmpresa ? (cols[2] || name) : undefined,
      fantasyName: isEmpresa ? (cols[3] || undefined) : undefined,
      taxId: cols[4] || undefined,
      documentNumber: !isEmpresa ? (cols[5] || undefined) : undefined,
      taxCondition: cols[6] || undefined,
      email,
      phone,
      industry: isEmpresa ? (cols[9] || undefined) : undefined,
      contactRole: isEmpresa ? (cols[10] || undefined) : undefined,
      city: cols[11] || undefined,
      state: cols[12] || undefined,
      address: cols[13] || undefined,
      zipCode: cols[14] || undefined,
      website: isEmpresa ? (cols[15] || undefined) : undefined,
      billingContactName: isEmpresa ? (cols[16] || undefined) : undefined,
      billingContactEmail: isEmpresa ? (cols[17] || undefined) : undefined,
      paymentTerms: isEmpresa ? (cols[18] || undefined) : undefined,
      supplierRequirements: isEmpresa ? (cols[19] || undefined) : undefined,
      frequentEventType: !isEmpresa ? (cols[20] || undefined) : undefined,
      preferences: !isEmpresa ? (cols[21] || undefined) : undefined,
      notes: cols[22] || undefined,
      activeEventsCount: 0
    });
  }

  return clients;
}
