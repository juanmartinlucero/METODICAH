import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AuthHeader } from './AuthHeader';
import { AuthAlert } from './AuthAlert';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ToastProvider } from '@/context/ToastContext';
import { useAuthStore } from '@/stores';

describe('Auth UI Components Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.getState().logout();
  });

  describe('AuthHeader', () => {
    it('debe renderizar título, subtítulo y badge informativo', () => {
      render(
        <AuthHeader
          badgeText="Acceso Técnico"
          title="Iniciar Sesión"
          subtitle="Panel de operaciones de METODICAH"
        />
      );

      expect(screen.getByText('Acceso Técnico')).toBeDefined();
      expect(screen.getByText('Iniciar Sesión')).toBeDefined();
      expect(screen.getByText('Panel de operaciones de METODICAH')).toBeDefined();
    });
  });

  describe('AuthAlert', () => {
    it('renderiza mensaje y llama a onClose al hacer clic', () => {
      const onClose = vi.fn();
      render(
        <AuthAlert
          message="Credenciales inválidas"
          type="error"
          onClose={onClose}
        />
      );

      expect(screen.getByText('Credenciales inválidas')).toBeDefined();
      const closeBtn = screen.getByRole('button', { name: /Cerrar aviso/i });
      fireEvent.click(closeBtn);
      expect(onClose).toHaveBeenCalled();
    });

    it('no renderiza nada si el mensaje es nulo', () => {
      const { container } = render(<AuthAlert message={null} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('LoginForm', () => {
    it('debe renderizar campos de email, contraseña, botón de envío y acceso demo', () => {
      render(
        <ToastProvider>
          <MemoryRouter>
            <LoginForm />
          </MemoryRouter>
        </ToastProvider>
      );

      expect(screen.getByLabelText(/Correo Electrónico Corporativo/i)).toBeDefined();
      expect(screen.getByLabelText(/Contraseña/i)).toBeDefined();
      expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeDefined();
      expect(screen.getByText(/Accesos Demo:/i)).toBeDefined();
      expect(screen.getByRole('button', { name: /Admin \(Juan\)/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Team \(Laura\)/i })).toBeDefined();
    });

    it('debe completar credenciales demo al hacer clic en Admin o Team', async () => {
      render(
        <ToastProvider>
          <MemoryRouter>
            <LoginForm />
          </MemoryRouter>
        </ToastProvider>
      );

      const adminBtn = screen.getByRole('button', { name: /Admin \(Juan\)/i });
      fireEvent.click(adminBtn);

      await waitFor(() => {
        const emailInput = screen.getByLabelText(/Correo Electrónico Corporativo/i) as HTMLInputElement;
        expect(emailInput.value).toBe('juan@metodicah.com');
      });

      const teamBtn = screen.getByRole('button', { name: /Team \(Laura\)/i });
      fireEvent.click(teamBtn);

      await waitFor(() => {
        const emailInput = screen.getByLabelText(/Correo Electrónico Corporativo/i) as HTMLInputElement;
        expect(emailInput.value).toBe('laura@metodicah.com');
      });
    });

    it('muestra errores de validación si se envía con campos vacíos', async () => {
      render(
        <ToastProvider>
          <MemoryRouter>
            <LoginForm />
          </MemoryRouter>
        </ToastProvider>
      );

      const submitBtn = screen.getByRole('button', { name: /Iniciar Sesión/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/El correo electrónico es obligatorio/i)).toBeDefined();
        expect(screen.getByText(/La contraseña es obligatoria/i)).toBeDefined();
      });
    });
  });

  describe('RegisterForm', () => {
    it('debe renderizar todos los campos de registro de productora y checkbox de términos', () => {
      render(
        <ToastProvider>
          <MemoryRouter>
            <RegisterForm />
          </MemoryRouter>
        </ToastProvider>
      );

      expect(screen.getByLabelText(/Nombre de la Productora \/ Estudio/i)).toBeDefined();
      expect(screen.getByLabelText(/Nombre y Apellido/i)).toBeDefined();
      expect(screen.getByLabelText(/Correo Electrónico/i)).toBeDefined();
      expect(screen.getByLabelText(/Rol \/ Especialidad Técnica/i)).toBeDefined();
      expect(screen.getByLabelText(/^Contraseña/i)).toBeDefined();
      expect(screen.getByLabelText(/Confirmar Contraseña/i)).toBeDefined();
      expect(screen.getByRole('button', { name: /Crear Cuenta de Productora/i })).toBeDefined();
      expect(screen.getByText(/Acepto los términos de servicio/i)).toBeDefined();
    });

    it('muestra error si no se aceptan los términos y condiciones', async () => {
      render(
        <ToastProvider>
          <MemoryRouter>
            <RegisterForm />
          </MemoryRouter>
        </ToastProvider>
      );

      const companyInput = screen.getByLabelText(/Nombre de la Productora \/ Estudio/i);
      const nameInput = screen.getByLabelText(/Nombre y Apellido/i);
      const emailInput = screen.getByLabelText(/Correo Electrónico/i);
      const passwordInput = screen.getByLabelText(/^Contraseña/i);
      const confirmInput = screen.getByLabelText(/Confirmar Contraseña/i);

      fireEvent.change(companyInput, { target: { value: 'Live Producciones S.A.' } });
      fireEvent.change(nameInput, { target: { value: 'Laura Productora' } });
      fireEvent.change(emailInput, { target: { value: 'laura@eventos.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });

      const submitBtn = screen.getByRole('button', { name: /Crear Cuenta de Productora/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText(/Debes aceptar los términos de uso/i)).toBeDefined();
      });
    });
  });
});
