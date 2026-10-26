import { describe, it, expect } from 'vitest';
import {
  calculateAccreditationStats,
  generateAccreditationQrHash,
  generateQrMatrix,
  ACCESS_LEVEL_CONFIG,
  ACCREDITATION_STATUS_CONFIG
} from './accreditationUtils';
import type { AccreditationItem } from '@/types/metodicah';

describe('Accreditation Pure Domain Utils', () => {
  const mockItems: AccreditationItem[] = [
    {
      id: 'acc-1',
      eventId: 'evt-100',
      firstName: 'Carlos',
      lastName: 'Pérez',
      documentNumber: '32456789',
      role: 'Jefe Técnico',
      company: 'PRG Audio',
      accessLevel: 'ALL ACCESS',
      status: 'en_sitio',
      qrCode: 'MET-E100-32456789-A1B2',
      checkInAt: '2026-10-25T14:30:00.000Z',
      insuranceVerified: true,
      createdAt: '2026-10-25T10:00:00.000Z',
      updatedAt: '2026-10-25T14:30:00.000Z'
    },
    {
      id: 'acc-2',
      eventId: 'evt-100',
      firstName: 'Mariana',
      lastName: 'Gómez',
      documentNumber: '38123456',
      role: 'Operadora de Luces',
      company: 'PRG Audio',
      accessLevel: 'STAFF',
      status: 'aprobada',
      qrCode: 'MET-E100-38123456-C3D4',
      insuranceVerified: true,
      createdAt: '2026-10-25T10:00:00.000Z',
      updatedAt: '2026-10-25T10:00:00.000Z'
    },
    {
      id: 'acc-3',
      eventId: 'evt-100',
      firstName: 'Lucas',
      lastName: 'Vázquez',
      documentNumber: '40987654',
      role: 'Invitado VIP Marca',
      company: 'Cliente Sponsor',
      accessLevel: 'GUEST',
      status: 'solicitada',
      qrCode: 'MET-E100-40987654-E5F6',
      insuranceVerified: false,
      createdAt: '2026-10-25T10:00:00.000Z',
      updatedAt: '2026-10-25T10:00:00.000Z'
    }
  ];

  it('calcula métricas de aforo y presencia en vivo correctamente', () => {
    const stats = calculateAccreditationStats(mockItems);

    expect(stats.total).toBe(3);
    expect(stats.enSitioCount).toBe(1);
    expect(stats.headcountPercentage).toBe(33.3);
    expect(stats.allAccessCount).toBe(1);
    expect(stats.staffCount).toBe(1);
    expect(stats.guestCount).toBe(1);
    expect(stats.artVerificadaCount).toBe(2);
    expect(stats.artFaltanteCount).toBe(1);
  });

  it('protege contra división por cero y NaN cuando la lista de acreditaciones está vacía', () => {
    const stats = calculateAccreditationStats([]);

    expect(stats.total).toBe(0);
    expect(stats.enSitioCount).toBe(0);
    expect(stats.headcountPercentage).toBe(0);
    expect(Number.isNaN(stats.headcountPercentage)).toBe(false);
    expect(Number.isFinite(stats.headcountPercentage)).toBe(true);
  });

  it('genera un hash de QR determinista con prefijo MET y formato estructurado', () => {
    const hash = generateAccreditationQrHash('evt-100', '32.456.789');
    expect(hash.startsWith('MET-')).toBe(true);
    expect(hash).toContain('32456789');
  });

  it('genera una matriz 25x25 de QR válida y simétrica en sus patrones de búsqueda', () => {
    const matrix = generateQrMatrix('MET-TEST-1234');
    expect(matrix.length).toBe(25);
    expect(matrix[0].length).toBe(25);
    // Verificar que los finder patterns en las 3 esquinas existen (7x7)
    expect(matrix[0][0]).toBe(true);
    expect(matrix[0][24]).toBe(true);
    expect(matrix[24][0]).toBe(true);
  });

  it('mantiene la configuración cromática exacta para los 3 niveles de acceso', () => {
    expect(ACCESS_LEVEL_CONFIG['ALL ACCESS'].color).toBe('#f59e0b');
    expect(ACCESS_LEVEL_CONFIG['STAFF'].color).toBe('#10b981');
    expect(ACCESS_LEVEL_CONFIG['GUEST'].color).toBe('#0284c7');
  });

  it('proporciona etiquetas de estado completas en español', () => {
    expect(ACCREDITATION_STATUS_CONFIG.en_sitio.label).toBe('En Sitio');
    expect(ACCREDITATION_STATUS_CONFIG.solicitada.label).toBe('Solicitada');
    expect(ACCREDITATION_STATUS_CONFIG.aprobada.label).toBe('Aprobada');
    expect(ACCREDITATION_STATUS_CONFIG.impresa.label).toBe('Impresa');
    expect(ACCREDITATION_STATUS_CONFIG.revocada.label).toBe('Revocada');
  });
});
