import type { Supplier, SupplierCategory, SupplierCategoryConfig } from '../types/metodicah';
import { buildWhatsAppUrl } from './whatsappUtils';
import { exportToCSV, parseCSVLine, type CSVColumn } from './csvUtils';
import { getTodayLocalDateString } from './dateUtils';

export const DEFAULT_SUPPLIER_CATEGORIES: SupplierCategoryConfig[] = [
  { id: 'audio', label: 'Audio & Sonido FOH', color: '#f59e0b' },
  { id: 'lighting', label: 'Iluminación & FX', color: '#8b5cf6' },
  { id: 'video', label: 'Pantallas LED & Video', color: '#06b6d4' },
  { id: 'rigging', label: 'Rigging & Estructuras', color: '#ec4899' },
  { id: 'catering', label: 'Catering & Backstage', color: '#10b981' },
  { id: 'logistics', label: 'Logística & Transporte', color: '#3b82f6' },
  { id: 'security', label: 'Seguridad & Control', color: '#ef4444' },
  { id: 'venue', label: 'Predio / Recinto', color: '#14b8a6' },
  { id: 'other', label: 'Otros Servicios', color: '#94a3b8' }
];

export const SUPPLIER_CATEGORIES = DEFAULT_SUPPLIER_CATEGORIES;

export const getSupplierCategoryLabel = (cat: string, categories: SupplierCategoryConfig[] = DEFAULT_SUPPLIER_CATEGORIES): string => {
  const found = categories.find(c => c.id === cat);
  return found ? found.label : (cat || 'Otros Servicios');
};

export const getSupplierCategoryColor = (cat: string, categories: SupplierCategoryConfig[] = DEFAULT_SUPPLIER_CATEGORIES): string => {
  const found = categories.find(c => c.id === cat);
  return found ? found.color : '#94a3b8';
};

/**
 * Generates WhatsApp Web link for a supplier using the unified utility
 */
export function getSupplierWhatsAppLink(phone?: string, contactName?: string): string | null {
  if (!phone) return null;
  const message = `Hola${contactName ? ' ' + contactName : ''}, te contacto desde la productora METODICAH por un evento técnico.`;
  const url = buildWhatsAppUrl(phone, message);
  return url || null;
}

/**
 * Column definition for exporting suppliers to CSV
 */
export const SUPPLIER_CSV_COLUMNS: CSVColumn<Supplier>[] = [
  { header: 'ID', accessor: s => s.id },
  { header: 'Nombre Fantasía', accessor: s => s.name },
  { header: 'Razón Social', accessor: s => s.company },
  { header: 'Rubro', accessor: s => getSupplierCategoryLabel(s.category) },
  { header: 'CUIT', accessor: s => s.taxId },
  { header: 'Condición IVA', accessor: s => s.taxCondition },
  { header: 'Contacto Directo', accessor: s => s.contactName },
  { header: 'Cargo Contacto', accessor: s => s.contactRole },
  { header: 'Email', accessor: s => s.email },
  { header: 'Teléfono', accessor: s => s.phone },
  { header: 'Teléfono Urgencias', accessor: s => s.emergencyPhone },
  { header: 'Sitio Web', accessor: s => s.website },
  { header: 'Equipamiento Insignia', accessor: s => s.equipmentHighlights },
  { header: 'Email Facturación', accessor: s => s.billingEmail },
  { header: 'Condición de Pago', accessor: s => s.paymentTerms },
  { header: 'Dirección', accessor: s => s.address },
  { header: 'Ciudad', accessor: s => s.city },
  { header: 'Provincia', accessor: s => s.state },
  { header: 'Código Postal', accessor: s => s.zipCode },
  { header: 'Notas', accessor: s => s.notes },
  { header: 'Fecha de Alta', accessor: s => s.createdAt },
];

/**
 * Exports Suppliers array to CSV with UTF-8 BOM
 */
export function exportSuppliersToCSV(suppliers: Supplier[]): void {
  const filename = `METODICAH_Proveedores_${getTodayLocalDateString()}.csv`;
  exportToCSV(suppliers, SUPPLIER_CSV_COLUMNS, filename);
}

/**
 * Parses CSV text to Supplier objects
 */
export function parseSuppliersCSV(csvText: string): Omit<Supplier, 'id' | 'createdAt'>[] {
  const cleanText = csvText.replace(/^\uFEFF/, '').trim();
  const lines = cleanText.split(/\r?\n/);
  if (lines.length < 2) return [];

  const parsedSuppliers: Omit<Supplier, 'id' | 'createdAt'>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = parseCSVLine(line);
    if (cols.length < 3) continue;

    const name = cols[1] || cols[0] || 'Proveedor Sin Nombre';
    const company = cols[2] || name;
    
    // Determine category
    const catStr = (cols[3] || '').toLowerCase();
    let category: SupplierCategory = 'other';
    if (catStr.includes('audio') || catStr.includes('sonido')) category = 'audio';
    else if (catStr.includes('luz') || catStr.includes('ilumin') || catStr.includes('fx')) category = 'lighting';
    else if (catStr.includes('video') || catStr.includes('led') || catStr.includes('pantalla')) category = 'video';
    else if (catStr.includes('rig') || catStr.includes('estruct')) category = 'rigging';
    else if (catStr.includes('cater') || catStr.includes('gastronom') || catStr.includes('food')) category = 'catering';
    else if (catStr.includes('logis') || catStr.includes('transp')) category = 'logistics';
    else if (catStr.includes('segur') || catStr.includes('control')) category = 'security';
    else if (catStr.includes('predio') || catStr.includes('venue') || catStr.includes('lugar')) category = 'venue';

    const supplier: Omit<Supplier, 'id' | 'createdAt'> = {
      name,
      company,
      category,
      taxId: cols[4] || '',
      taxCondition: cols[5] || '',
      contactName: cols[6] || '',
      contactRole: cols[7] || '',
      email: cols[8] || '',
      phone: cols[9] || '',
      emergencyPhone: cols[10] || '',
      website: cols[11] || '',
      equipmentHighlights: cols[12] || '',
      billingEmail: cols[13] || '',
      paymentTerms: cols[14] || '',
      address: cols[15] || '',
      city: cols[16] || '',
      state: cols[17] || '',
      zipCode: cols[18] || '',
      notes: cols[19] || ''
    };

    parsedSuppliers.push(supplier);
  }

  return parsedSuppliers;
}
