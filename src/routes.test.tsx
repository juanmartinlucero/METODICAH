import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { NotFoundView } from './components/common/NotFoundView';

describe('Routing & Deep Linking Suite', () => {
  describe('NotFoundView (Dedicated 404 View)', () => {
    it('debe renderizar el código 404, título y descripción por defecto', () => {
      render(
        <MemoryRouter>
          <NotFoundView />
        </MemoryRouter>
      );

      expect(screen.getByText(/ERROR 404/i)).toBeDefined();
      expect(screen.getByText('Página no encontrada')).toBeDefined();
      expect(screen.getByText(/La ruta o recurso al que intentas acceder no existe/i)).toBeDefined();
      expect(screen.getByRole('button', { name: /Ir al Dashboard Principal/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Volver atrás/i })).toBeDefined();
    });

    it('debe admitir props personalizadas para títulos, códigos y descripciones', () => {
      render(
        <MemoryRouter>
          <NotFoundView
            code="403"
            title="Acceso Restringido"
            description="No tienes permisos para ver este recurso técnico."
            actionLabel="Solicitar Acceso"
            showBackButton={false}
          />
        </MemoryRouter>
      );

      expect(screen.getByText(/ERROR 403/i)).toBeDefined();
      expect(screen.getByText('Acceso Restringido')).toBeDefined();
      expect(screen.getByText('No tienes permisos para ver este recurso técnico.')).toBeDefined();
      expect(screen.getByRole('button', { name: /Solicitar Acceso/i })).toBeDefined();
      expect(screen.queryByRole('button', { name: /Volver atrás/i })).toBeNull();
    });
  });

  describe('Route Matching & Fallback', () => {
    it('debe renderizar NotFoundView ante rutas comodín no mapeadas', () => {
      render(
        <MemoryRouter initialEntries={['/ruta-totalmente-desconocida']}>
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
            <Route path="*" element={<NotFoundView title="Ruta Desconocida" />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Ruta Desconocida')).toBeDefined();
    });
  });

  describe('Route Guards (ProtectedRoute & PublicOnlyRoute)', () => {
    it('redirige a /login cuando se accede a una ruta protegida sin sesión', async () => {
      const { ProtectedRoute } = await import('./components/common/ProtectedRoute');
      const { useAuthStore } = await import('./stores');

      useAuthStore.setState({ isAuthenticated: false, isLoading: false, user: null });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<div>Vista de Login</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Contenido Protegido Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Vista de Login')).toBeDefined();
      expect(screen.queryByText('Contenido Protegido Dashboard')).toBeNull();
    });

    it('permite ver el contenido protegido cuando el usuario está autenticado', async () => {
      const { ProtectedRoute } = await import('./components/common/ProtectedRoute');
      const { useAuthStore } = await import('./stores');
      const { INITIAL_USER } = await import('./services/mockData');

      useAuthStore.setState({ isAuthenticated: true, isLoading: false, user: INITIAL_USER });

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<div>Vista de Login</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Contenido Protegido Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Contenido Protegido Dashboard')).toBeDefined();
      expect(screen.queryByText('Vista de Login')).toBeNull();
    });

    it('redirige al dashboard si un usuario autenticado intenta acceder a /login', async () => {
      const { PublicOnlyRoute } = await import('./components/common/PublicOnlyRoute');
      const { useAuthStore } = await import('./stores');
      const { INITIAL_USER } = await import('./services/mockData');

      useAuthStore.setState({ isAuthenticated: true, isLoading: false, user: INITIAL_USER });

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<div>Vista de Login</div>} />
            </Route>
            <Route path="/dashboard" element={<div>Dashboard de Producción</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Dashboard de Producción')).toBeDefined();
      expect(screen.queryByText('Vista de Login')).toBeNull();
    });
  });

  describe('Sidebar Navigation & Workflow Positioning', () => {
    it('renderiza el ítem Workflow justo encima de Configuración en el menú lateral', async () => {
      const { SidebarNav } = await import('./components/sidebar/SidebarNav');
      const { SIDEBAR_MENU_ITEMS } = await import('./components/sidebar/sidebar.constants');

      const labels = SIDEBAR_MENU_ITEMS.map(i => i.label);
      const workflowIndex = labels.indexOf('Workflow');
      const settingsIndex = labels.indexOf('Configuración');
      const crewIndex = labels.indexOf('Equipo / Crew');

      expect(workflowIndex).toBeGreaterThan(-1);
      expect(settingsIndex).toBeGreaterThan(-1);
      expect(workflowIndex).toBe(settingsIndex - 1);
      expect(workflowIndex).toBe(crewIndex + 1);

      render(
        <MemoryRouter>
          <SidebarNav isCollapsed={false} />
        </MemoryRouter>
      );

      expect(screen.getByText('Workflow')).toBeDefined();
      expect(screen.getByText('Configuración')).toBeDefined();
      expect(screen.getByText('Equipo / Crew')).toBeDefined();
    });
  });
});

