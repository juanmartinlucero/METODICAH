import type { EventCrewMember, CrewContractType, CrewSeniority } from '../types/metodicah';
import { buildWhatsAppUrl } from './whatsappUtils';
import { exportToCSV, parseCSVLine, type CSVColumn } from './csvUtils';
import { getTodayLocalDateString } from './dateUtils';

export const DEFAULT_CREW_SECTORS = [
  'Dirección Técnica',
  'Audio & Sonido',
  'Iluminación & FX',
  'Video & Pantallas LED',
  'Rigging / Estructuras',
  'Stage Management',
  'Producción General',
  'Logística & Electricidad',
  'Seguridad & Accesos',
  'Hospitality & Artistas'
];

export const COMMON_CREW_SECTORS = DEFAULT_CREW_SECTORS;

export const CREW_CLOTHING_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

export const CREW_DIETARY_OPTIONS = [
  'Estándar',
  'Vegetariano',
  'Vegano',
  'Sin TACC (Celíaco)',
  'Kosher / Halal',
  'Otras restricciones'
];

/**
 * Generates WhatsApp Web link for a crew member using the unified utility
 */
export function getCrewWhatsAppLink(phone?: string, name?: string): string | null {
  if (!phone) return null;
  const message = `Hola${name ? ' ' + name : ''}, te contacto desde la producción de METODICAH por una asignación de equipo.`;
  const url = buildWhatsAppUrl(phone, message);
  return url || null;
}

/**
 * Column definition for exporting crew members to CSV
 */
export const CREW_CSV_COLUMNS: CSVColumn<EventCrewMember>[] = [
  { header: 'ID', accessor: c => c.id },
  { header: 'ID Usuario', accessor: c => c.userId },
  { header: 'Nombre Completo', accessor: c => c.userName },
  { header: 'Tipo Contrato', accessor: c => c.type === 'freelancer' ? 'Freelancer' : 'Staff Interno' },
  { header: 'Sector Técnico', accessor: c => c.sector },
  { header: 'Rol Habitual', accessor: c => c.roleInEvent },
  { header: 'Seniority', accessor: c => c.seniority || 'senior' },
  { header: 'DNI / Documento', accessor: c => c.documentNumber },
  { header: 'CUIL', accessor: c => c.taxId },
  { header: 'Fecha Nacimiento', accessor: c => c.birthDate },
  { header: 'Email', accessor: c => c.userEmail },
  { header: 'Teléfono', accessor: c => c.phone },
  { header: 'Contacto Emergencia Nombre', accessor: c => c.emergencyContactName },
  { header: 'Contacto Emergencia Teléfono', accessor: c => c.emergencyContactPhone },
  { header: 'Ciudad / Localidad', accessor: c => c.city },
  { header: 'Aseguradora ART', accessor: c => c.artInsurance },
  { header: 'Talle Indumentaria', accessor: c => c.clothingSize },
  { header: 'Restricción Alimentaria', accessor: c => c.dietaryRestrictions },
  { header: 'Notas Técnicas', accessor: c => c.notes },
  { header: 'Fecha Alta', accessor: c => c.createdAt },
];

/**
 * Exports Crew Members array to CSV with UTF-8 BOM
 */
export function exportCrewToCSV(crew: EventCrewMember[]): void {
  const filename = `METODICAH_Equipo_Crew_${getTodayLocalDateString()}.csv`;
  exportToCSV(crew, CREW_CSV_COLUMNS, filename);
}

/**
 * Parses CSV text to EventCrewMember objects
 */
export function parseCrewCSV(csvText: string): Omit<EventCrewMember, 'id' | 'userId'>[] {
  const cleanText = csvText.replace(/^\uFEFF/, '').trim();
  const lines = cleanText.split(/\r?\n/);
  if (lines.length < 2) return [];

  const parsedCrew: Omit<EventCrewMember, 'id' | 'userId'>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = parseCSVLine(line);
    if (cols.length < 3) continue;

    const userName = cols[2] || cols[0] || 'Miembro Crew';
    const typeStr = (cols[3] || '').toLowerCase();
    const type: CrewContractType = typeStr.includes('free') ? 'freelancer' : 'staff_interno';
    const sector = cols[4] || COMMON_CREW_SECTORS[0];
    const roleInEvent = cols[5] || 'Técnico de Producción';

    const seniorityStr = (cols[6] || '').toLowerCase();
    let seniority: CrewSeniority = 'senior';
    if (seniorityStr.includes('lead')) seniority = 'lead';
    else if (seniorityStr.includes('semi')) seniority = 'semi_senior';
    else if (seniorityStr.includes('jun')) seniority = 'junior';

    const member: Omit<EventCrewMember, 'id' | 'userId'> = {
      userName,
      type,
      sector,
      roleInEvent,
      seniority,
      documentNumber: cols[7] || '',
      taxId: cols[8] || '',
      birthDate: cols[9] || '',
      userEmail: cols[10] || '',
      phone: cols[11] || '',
      emergencyContactName: cols[12] || '',
      emergencyContactPhone: cols[13] || '',
      city: cols[14] || '',
      artInsurance: cols[15] || '',
      clothingSize: cols[16] || '',
      dietaryRestrictions: cols[17] || '',
      notes: cols[18] || '',
      createdAt: cols[19] || getTodayLocalDateString()
    };

    parsedCrew.push(member);
  }

  return parsedCrew;
}
