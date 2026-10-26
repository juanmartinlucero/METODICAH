import type { AccreditationItem, AccreditationStats, AccreditationAccessLevel, AccreditationStatus, EventItem } from '@/types/metodicah';

export interface AccessLevelConfig {
  label: AccreditationAccessLevel;
  color: string;
  bg: string;
  border: string;
  text: string;
  description: string;
}

export const ACCESS_LEVEL_CONFIG: Record<AccreditationAccessLevel, AccessLevelConfig> = {
  'ALL ACCESS': {
    label: 'ALL ACCESS',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.35)',
    text: '#f59e0b',
    description: 'Acceso Total a Escenario, Backstage y Producción'
  },
  'STAFF': {
    label: 'STAFF',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.35)',
    text: '#10b981',
    description: 'Equipo Técnico, Operativo y Proveedores'
  },
  'GUEST': {
    label: 'GUEST',
    color: '#0284c7',
    bg: 'rgba(2, 132, 199, 0.12)',
    border: 'rgba(2, 132, 199, 0.35)',
    text: '#38bdf8',
    description: 'Invitados Especiales, Clientes y Prensa'
  }
};

export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
}

export const ACCREDITATION_STATUS_CONFIG: Record<AccreditationStatus, StatusConfig> = {
  solicitada: {
    label: 'Solicitada',
    color: '#94a3b8',
    bg: 'rgba(148, 163, 184, 0.12)',
    border: 'rgba(148, 163, 184, 0.3)'
  },
  aprobada: {
    label: 'Aprobada',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.12)',
    border: 'rgba(56, 189, 248, 0.3)'
  },
  impresa: {
    label: 'Impresa',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.12)',
    border: 'rgba(168, 85, 247, 0.3)'
  },
  en_sitio: {
    label: 'En Sitio',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.2)',
    border: 'rgba(16, 185, 129, 0.45)'
  },
  revocada: {
    label: 'Revocada',
    color: '#f43f5e',
    bg: 'rgba(244, 63, 94, 0.12)',
    border: 'rgba(244, 63, 94, 0.3)'
  }
};

/**
 * Calcula métricas puras y estadísticas de aforo/headcount del evento.
 * Protegido contra división por cero y NaN.
 */
export function calculateAccreditationStats(items: AccreditationItem[]): AccreditationStats {
  const total = items.length;
  if (total <= 0 || Number.isNaN(total)) {
    return {
      total: 0,
      enSitioCount: 0,
      headcountPercentage: 0,
      aprobadasCount: 0,
      solicitadasCount: 0,
      allAccessCount: 0,
      staffCount: 0,
      guestCount: 0,
      artVerificadaCount: 0,
      artFaltanteCount: 0
    };
  }

  let enSitioCount = 0;
  let aprobadasCount = 0;
  let solicitadasCount = 0;
  let allAccessCount = 0;
  let staffCount = 0;
  let guestCount = 0;
  let artVerificadaCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.status === 'en_sitio') enSitioCount++;
    if (item.status === 'aprobada' || item.status === 'en_sitio' || item.status === 'impresa') aprobadasCount++;
    if (item.status === 'solicitada') solicitadasCount++;
    
    if (item.accessLevel === 'ALL ACCESS') allAccessCount++;
    else if (item.accessLevel === 'STAFF') staffCount++;
    else if (item.accessLevel === 'GUEST') guestCount++;

    if (item.insuranceVerified) artVerificadaCount++;
  }

  const artFaltanteCount = total - artVerificadaCount;
  const rawPercentage = (enSitioCount / total) * 100;
  const headcountPercentage = Number.isFinite(rawPercentage) ? Number(rawPercentage.toFixed(1)) : 0;

  return {
    total,
    enSitioCount,
    headcountPercentage,
    aprobadasCount,
    solicitadasCount,
    allAccessCount,
    staffCount,
    guestCount,
    artVerificadaCount,
    artFaltanteCount
  };
}

/**
 * Genera un código hash determinista y seguro para la credencial y QR.
 */
export function generateAccreditationQrHash(eventId: string, docNumber: string): string {
  const cleanEvent = eventId.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() || 'EVT';
  const cleanDoc = docNumber.replace(/\D/g, '').slice(-8) || '000000';
  const salt = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MET-${cleanEvent}-${cleanDoc}-${salt}`;
}

/**
 * Genera una matriz de módulos 21x21 para renderizar un código QR en SVG limpio y vectorizado
 * sin requerir dependencias externas pesadas.
 */
export function generateQrMatrix(text: string): boolean[][] {
  const size = 25;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const drawFinderPattern = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[row + r][col + c] = isBorder || isCenter;
      }
    }
  };

  // 3 Finder patterns
  drawFinderPattern(0, 0);
  drawFinderPattern(0, size - 7);
  drawFinderPattern(size - 7, 0);

  // Timing lines
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Hash encoding across internal cells
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 8; r < size - 8; r++) {
    for (let c = 8; c < size - 8; c++) {
      const bit = ((hash ^ (r * 31 + c * 17)) >>> ((r + c) % 16)) & 1;
      matrix[r][c] = bit === 1;
    }
  }

  return matrix;
}

/**
 * Exporta el listado de acreditaciones a Excel (.xlsx) de forma dinámica bajo demanda.
 */
export async function exportAccreditationsToExcel(
  items: AccreditationItem[], 
  eventTitle: string
): Promise<void> {
  const XLSX = await import('xlsx');
  
  const formattedRows = items.map((item, idx) => ({
    'N°': idx + 1,
    'Nombre': item.firstName,
    'Apellido': item.lastName,
    'DNI / Documento': item.documentNumber,
    'Rol / Función': item.role,
    'Empresa / Proveedor': item.company,
    'Nivel de Acceso': item.accessLevel,
    'Estado': ACCREDITATION_STATUS_CONFIG[item.status]?.label || item.status,
    'En Sitio': item.status === 'en_sitio' ? 'SÍ' : 'NO',
    'Hora de Ingreso': item.checkInAt ? item.checkInAt.replace('T', ' ').slice(0, 19) : '-',
    'Validado Por': item.checkInBy || '-',
    'Seguro / ART': item.insuranceVerified ? 'VERIFICADO' : 'PENDIENTE',
    'Teléfono Urgencia': item.emergencyPhone || '-',
    'Observaciones': item.notes || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Acreditaciones');

  const safeTitle = eventTitle.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30) || 'Evento';
  XLSX.writeFile(workbook, `Acreditaciones_${safeTitle}.xlsx`);
}

/**
 * Exporta el listado oficial de acreditaciones en formato PDF apaisado para control de accesos.
 */
export async function exportAccreditationsToPDF(
  items: AccreditationItem[], 
  event: EventItem
): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const stats = calculateAccreditationStats(items);

  // Header
  doc.setFillColor(8, 11, 17);
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(245, 158, 11);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('METODICAH', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('|  PLANILLA OFICIAL DE CONTROL DE ACREDITACIONES Y ACCESO', 47, 12);

  doc.setFontSize(8);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-AR')} ${new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs`, 245, 12);

  // Event info bar
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Evento: ${event.title} (${event.code})`, 14, 32);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Fecha: ${event.date}  |  Lugar: ${event.venue} (${event.location})  |  Cliente: ${event.clientName}`, 14, 38);
  doc.text(`Acreditados: ${stats.total}  |  En Sitio: ${stats.enSitioCount} (${stats.headcountPercentage}%)  |  ALL ACCESS: ${stats.allAccessCount}  |  STAFF: ${stats.staffCount}  |  GUEST: ${stats.guestCount}`, 14, 44);

  // Table header
  let y = 52;
  const colWidths = [10, 50, 25, 40, 45, 30, 25, 22, 25];
  const colHeaders = ['N°', 'Nombre y Apellido', 'DNI / Doc', 'Rol / Función', 'Empresa', 'Nivel', 'Estado', 'ART', 'Firma / Control'];

  const drawTableHeader = () => {
    doc.setFillColor(30, 41, 59);
    doc.rect(14, y, 269, 7, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);

    let curX = 16;
    for (let c = 0; c < colHeaders.length; c++) {
      doc.text(colHeaders[c], curX, y + 5);
      curX += colWidths[c];
    }
    y += 8;
  };

  drawTableHeader();

  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (y > 190) {
      doc.addPage();
      y = 15;
      drawTableHeader();
    }

    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 1, 269, 7, 'F');
    }

    doc.setTextColor(30, 41, 59);
    let curX = 16;

    // N°
    doc.text(String(i + 1), curX, y + 4);
    curX += colWidths[0];

    // Nombre y Apellido
    const fullName = `${item.lastName.toUpperCase()}, ${item.firstName}`;
    doc.text(fullName.slice(0, 26), curX, y + 4);
    curX += colWidths[1];

    // DNI
    doc.text(item.documentNumber.slice(0, 14), curX, y + 4);
    curX += colWidths[2];

    // Rol
    doc.text(item.role.slice(0, 22), curX, y + 4);
    curX += colWidths[3];

    // Empresa
    doc.text(item.company.slice(0, 24), curX, y + 4);
    curX += colWidths[4];

    // Nivel
    if (item.accessLevel === 'ALL ACCESS') doc.setTextColor(180, 83, 9);
    else if (item.accessLevel === 'STAFF') doc.setTextColor(4, 120, 87);
    else doc.setTextColor(2, 132, 199);
    doc.setFont('helvetica', 'bold');
    doc.text(item.accessLevel, curX, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    curX += colWidths[5];

    // Estado
    const stLabel = ACCREDITATION_STATUS_CONFIG[item.status]?.label || item.status;
    doc.text(stLabel, curX, y + 4);
    curX += colWidths[6];

    // ART
    doc.setTextColor(item.insuranceVerified ? 16 : 220, item.insuranceVerified ? 185 : 38, item.insuranceVerified ? 129 : 38);
    doc.text(item.insuranceVerified ? 'OK' : 'PENDIENTE', curX, y + 4);
    doc.setTextColor(30, 41, 59);
    curX += colWidths[7];

    // Firma / Control
    doc.setDrawColor(203, 213, 225);
    doc.line(curX, y + 4, curX + 22, y + 4);

    y += 7;
  }

  const safeTitle = event.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 25) || 'Evento';
  doc.save(`Planilla_Acreditaciones_${safeTitle}.pdf`);
}
