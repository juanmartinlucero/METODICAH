import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { PermissionsMatrixTable } from './PermissionsMatrixTable';
import { RolesPermissionsSettings } from './RolesPermissionsSettings';
import { ToastProvider } from '@/context/ToastContext';
import { useSettingsStore, useAuthStore } from '@/stores';
import { DEFAULT_ROLE_PERMISSIONS } from '@/services/mockData';
import type { UserProfile } from '@/types/metodicah';

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Roles & Permissions Settings Suite', () => {
  const mockAdminUser: UserProfile = {
    id: 'usr_admin',
    name: 'Juan Martín',
    email: 'juan@metodicah.com',
    globalRole: 'admin',
    accountId: 'acc_demo_01',
    companyName: 'METODICAH Studio',
    specialty: 'Dirección General de Producción'
  };

  const mockTeamMember: UserProfile = {
    id: 'usr_staff_1',
    name: 'Laura Rossi',
    email: 'laura@metodicah.com',
    globalRole: 'team_member',
    accountId: 'acc_demo_01',
    companyName: 'METODICAH Studio',
    specialty: 'Operadora de Luces'
  };

  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    useAuthStore.setState({
      user: mockAdminUser,
      teamMembers: [mockAdminUser, mockTeamMember],
      isAuthenticated: true,
      isLoading: false
    });
    useSettingsStore.setState({
      currentUser: mockAdminUser,
      rolePermissions: JSON.parse(JSON.stringify(DEFAULT_ROLE_PERMISSIONS))
    });
  });

  describe('PermissionsMatrixTable', () => {
    it('renderiza la matriz de permisos con todas las filas predeterminadas', () => {
      render(
        <ToastProvider>
          <PermissionsMatrixTable isAdmin={false} />
        </ToastProvider>
      );

      expect(screen.getByText('Crear & Editar Producciones')).toBeDefined();
      expect(screen.getByText('Aprobar Presupuesto & Despliegue')).toBeDefined();
      expect(screen.getByText('Gestión de Personal Técnico (Crew)')).toBeDefined();
      expect(screen.getByText('Configuración Global & Branding')).toBeDefined();
    });

    it('en modo no-admin (read-only), muestra indicadores informativos y ningún checkbox interactivo', () => {
      render(
        <ToastProvider>
          <PermissionsMatrixTable isAdmin={false} />
        </ToastProvider>
      );

      expect(screen.getByText(/Modo de solo lectura informativo/i)).toBeDefined();
      const checkboxes = screen.queryAllByRole('checkbox');
      expect(checkboxes.length).toBe(0);
      expect(screen.queryByText(/Restablecer Valores por Defecto/i)).toBeNull();
    });

    it('en modo admin, muestra checkboxes interactivos para cada rol', () => {
      render(
        <ToastProvider>
          <PermissionsMatrixTable isAdmin={true} />
        </ToastProvider>
      );

      expect(screen.getByText(/Modo interactivo/i)).toBeDefined();
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBe(DEFAULT_ROLE_PERMISSIONS.length * 3);
      expect(screen.getByText(/Restablecer Valores por Defecto/i)).toBeDefined();
    });

    it('permite al admin modificar permisos interactuando con los checkboxes', () => {
      render(
        <ToastProvider>
          <PermissionsMatrixTable isAdmin={true} />
        </ToastProvider>
      );

      // Buscar checkbox para 'Aprobar Presupuesto & Despliegue' en rol 'team' (actualmente false)
      const checkbox = screen.getByLabelText('Permiso Aprobar Presupuesto & Despliegue para rol team') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);

      fireEvent.click(checkbox);

      // Comprobar que en el store se actualizó
      const currentPermissions = useSettingsStore.getState().rolePermissions;
      const target = currentPermissions.find(p => p.id === 'finance_approve_budget');
      expect(target?.team).toBe(true);
    });

    it('restablece los permisos a los valores predeterminados al hacer clic en restablecer', () => {
      // Modificar manualmente un permiso
      useSettingsStore.getState().updateRolePermission('finance_approve_budget', 'team', true);
      expect(useSettingsStore.getState().rolePermissions.find(p => p.id === 'finance_approve_budget')?.team).toBe(true);

      render(
        <ToastProvider>
          <PermissionsMatrixTable isAdmin={true} />
        </ToastProvider>
      );

      const resetBtn = screen.getByText(/Restablecer Valores por Defecto/i);
      fireEvent.click(resetBtn);

      const restored = useSettingsStore.getState().rolePermissions.find(p => p.id === 'finance_approve_budget');
      expect(restored?.team).toBe(false);
    });
  });

  describe('RolesPermissionsSettings', () => {
    it('renderiza el banner de gestión unificada y no muestra la lista redundante de integrantes', () => {
      render(
        <MemoryRouter>
          <ToastProvider>
            <RolesPermissionsSettings isAdmin={true} />
          </ToastProvider>
        </MemoryRouter>
      );

      // Verifica el banner hacia el directorio de Crew
      expect(screen.getByText('Directorio Unificado de Crew y Accesos')).toBeDefined();
      expect(screen.getByRole('button', { name: /Ir a Directorio de Crew/i })).toBeDefined();

      // Verifica que no existen los elementos redundantes de antes
      expect(screen.queryByText(/Integrantes de la Cuenta/i)).toBeNull();
      expect(screen.queryByRole('button', { name: /Dar de Alta Miembro de Equipo/i })).toBeNull();

      // Verifica que la matriz y las tarjetas informativas siguen presentes
      expect(screen.getByText('Roles y Matriz de Permisos (RBAC)')).toBeDefined();
      expect(screen.getByText('Matriz de Otorgamiento de Permisos')).toBeDefined();
    });

    it('redirige a /crew al hacer clic en el botón del banner', () => {
      render(
        <MemoryRouter>
          <ToastProvider>
            <RolesPermissionsSettings isAdmin={true} />
          </ToastProvider>
        </MemoryRouter>
      );

      const goBtn = screen.getByRole('button', { name: /Ir a Directorio de Crew/i });
      fireEvent.click(goBtn);

      expect(mockNavigate).toHaveBeenCalledWith('/crew');
    });
  });
});
