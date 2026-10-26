import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider } from '@/context/ToastContext';
import { EventAccreditationsTab } from './EventAccreditationsTab';
import { AccreditationTable } from './AccreditationTable';
import { AccreditationBadgeModal } from './AccreditationBadgeModal';
import { AccreditationCheckInScannerModal } from './AccreditationCheckInScannerModal';
import { useEventsStore } from '@/stores';
import type { EventItem, AccreditationItem } from '@/types/metodicah';

describe('Accreditations Module Suite', () => {
  const mockEvent: EventItem = {
    id: 'evt_test_99',
    code: 'MET-2026-99',
    title: 'Estadio Obras Live Show',
    date: '2026-11-20',
    venue: 'Estadio Obras',
    location: 'Buenos Aires',
    clientId: 'cli_01',
    clientName: 'Sony Music',
    timeRange: { startTime: '18:00', endTime: '23:30' },
    stageId: 'approved',
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01'
  };

  const mockAccreditations: AccreditationItem[] = [
    {
      id: 'acc_test_1',
      eventId: 'evt_test_99',
      firstName: 'Federico',
      lastName: 'Sánchez',
      documentNumber: '37104992',
      role: 'Ingeniero de Sonido FOH',
      company: 'MaxiSound Pro',
      accessLevel: 'STAFF',
      status: 'en_sitio',
      qrCode: 'MET-T099-37104992-A1B2',
      checkInAt: '2026-11-20T17:15:00.000Z',
      insuranceVerified: true,
      createdAt: '2026-10-01',
      updatedAt: '2026-10-01'
    },
    {
      id: 'acc_test_2',
      eventId: 'evt_test_99',
      firstName: 'Marcos',
      lastName: 'Villalba',
      documentNumber: '34892114',
      role: 'Director Técnico',
      company: 'Staging & Rigging',
      accessLevel: 'ALL ACCESS',
      status: 'aprobada',
      qrCode: 'MET-T099-34892114-C3D4',
      insuranceVerified: true,
      createdAt: '2026-10-01',
      updatedAt: '2026-10-01'
    },
    {
      id: 'acc_test_3',
      eventId: 'evt_test_99',
      firstName: 'Camila',
      lastName: 'Duarte',
      documentNumber: '42555666',
      role: 'Prensa VIP',
      company: 'Rolling Stone',
      accessLevel: 'GUEST',
      status: 'solicitada',
      qrCode: 'MET-T099-42555666-E5F6',
      insuranceVerified: false,
      createdAt: '2026-10-01',
      updatedAt: '2026-10-01'
    }
  ];

  beforeEach(() => {
    useEventsStore.setState({
      events: [mockEvent],
      selectedEvent: mockEvent,
      accreditationsMap: {
        'evt_test_99': mockAccreditations
      }
    });
  });

  it('renderiza el Top HUD con las 4 tarjetas de métricas en tiempo real', () => {
    render(
      <ToastProvider>
        <EventAccreditationsTab event={mockEvent} />
      </ToastProvider>
    );

    // Métricas
    expect(screen.getByText('Total Acreditados')).toBeDefined();
    expect(screen.getByText('Presentes en Sitio')).toBeDefined();
    expect(screen.getByText('Seguridad & ART')).toBeDefined();
    expect(screen.getByText('Zonas de Acceso')).toBeDefined();

    // Comprobamos total
    expect(screen.getByText('3')).toBeDefined();
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
  });

  it('muestra las 3 categorías exclusivas de acceso en los filtros: ALL ACCESS, STAFF y GUEST', () => {
    render(
      <ToastProvider>
        <EventAccreditationsTab event={mockEvent} />
      </ToastProvider>
    );

    expect(screen.getByRole('button', { name: /Todos los Niveles/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /ALL ACCESS/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /STAFF/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /GUEST/i })).toBeDefined();
  });

  it('permite filtrar por nivel de acceso al hacer clic en una píldora', () => {
    render(
      <ToastProvider>
        <EventAccreditationsTab event={mockEvent} />
      </ToastProvider>
    );

    // Los 3 están visibles inicialmente
    expect(screen.getByText(/Federico Sánchez/i)).toBeDefined();
    expect(screen.getByText(/Marcos Villalba/i)).toBeDefined();
    expect(screen.getByText(/Camila Duarte/i)).toBeDefined();

    // Clic en la píldora ALL ACCESS
    fireEvent.click(screen.getByRole('button', { name: /ALL ACCESS/i }));

    // Solo Marcos debe estar visible
    expect(screen.getByText(/Marcos Villalba/i)).toBeDefined();
    expect(screen.queryByText(/Federico Sánchez/i)).toBeNull();
    expect(screen.queryByText(/Camila Duarte/i)).toBeNull();
  });

  it('ejecuta onToggleCheckIn al hacer clic en Dar Ingreso en la tabla', () => {
    const handleToggleCheckIn = vi.fn();
    const handleOpenBadge = vi.fn();
    const handleOpenEdit = vi.fn();
    const handleDelete = vi.fn();

    render(
      <AccreditationTable
        items={mockAccreditations}
        onToggleCheckIn={handleToggleCheckIn}
        onOpenBadgeModal={handleOpenBadge}
        onOpenEditModal={handleOpenEdit}
        onDeleteAccreditation={handleDelete}
      />
    );

    const darIngresoButtons = screen.getAllByRole('button', { name: /Dar Ingreso/i });
    expect(darIngresoButtons.length).toBeGreaterThan(0);

    fireEvent.click(darIngresoButtons[0]);
    expect(handleToggleCheckIn).toHaveBeenCalled();
  });

  it('renderiza la credencial Lanyard y el código QR en AccreditationBadgeModal', () => {
    render(
      <AccreditationBadgeModal
        isOpen={true}
        onClose={vi.fn()}
        accreditation={mockAccreditations[0]}
        event={mockEvent}
      />
    );

    expect(screen.getByText('Credencial Oficial de Producción')).toBeDefined();
    expect(screen.getAllByText('STAFF').length).toBeGreaterThan(0);
    expect(screen.getByText(/Federico Sánchez/i)).toBeDefined();
    expect(screen.getByText('MaxiSound Pro')).toBeDefined();
    expect(screen.getByText('Imprimir Credencial')).toBeDefined();
  });

  it('encuentra una acreditación en AccreditationCheckInScannerModal al buscar por DNI', () => {
    const handleToggle = vi.fn();

    render(
      <AccreditationCheckInScannerModal
        isOpen={true}
        onClose={vi.fn()}
        accreditations={mockAccreditations}
        onToggleCheckIn={handleToggle}
      />
    );

    const input = screen.getByPlaceholderText(/Escanear QR con lector o escribir DNI/i);
    fireEvent.change(input, { target: { value: '34892114' } });

    expect(screen.getByText(/Marcos Villalba/i)).toBeDefined();
    expect(screen.getByText(/Director Técnico/i)).toBeDefined();

    const authButton = screen.getByRole('button', { name: /Autorizar Ingreso Inmediato/i });
    fireEvent.click(authButton);
    expect(handleToggle).toHaveBeenCalledWith('acc_test_2');
  });
});
