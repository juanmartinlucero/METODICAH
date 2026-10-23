import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { AppLayout } from './AppLayout';
import { useAuthStore } from '../stores';
import { INITIAL_USER } from '../services/mockData';

describe('AppLayout & Responsive Layout Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ isAuthenticated: true, user: INITIAL_USER, isLoading: false });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renderiza la barra superior móvil con branding y botones de navegación', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<div>Contenido Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Mobile header brand and buttons
    expect(screen.getAllByText('METODICAH').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /Abrir navegación/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Abrir analítica/i })).toBeDefined();
    expect(screen.getByText('Contenido Dashboard')).toBeDefined();
  });

  it('abre y cierra el drawer de navegación móvil al interactuar con el botón hamburguesa y backdrop', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<div>Contenido Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Initially no backdrop
    expect(document.querySelector('.sidebar-backdrop')).toBeNull();

    // Click to open mobile navigation
    const openNavBtn = screen.getByRole('button', { name: /Abrir navegación/i });
    fireEvent.click(openNavBtn);

    // Mobile nav is now open, backdrop exists
    expect(screen.getAllByRole('button', { name: /Cerrar navegación/i }).length).toBeGreaterThanOrEqual(1);
    const backdrop = document.querySelector('.sidebar-backdrop');
    expect(backdrop).not.toBeNull();

    // Clicking the backdrop closes the mobile nav
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(screen.getByRole('button', { name: /Abrir navegación/i })).toBeDefined();
    expect(document.querySelector('.sidebar-backdrop')).toBeNull();
  });

  it('abre y cierra el drawer de analítica móvil con exclusión mutua', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<div>Contenido Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Open mobile analytics
    const openAnalyticsBtn = screen.getByRole('button', { name: /Abrir analítica/i });
    fireEvent.click(openAnalyticsBtn);

    expect(screen.getAllByRole('button', { name: /Cerrar analítica/i }).length).toBeGreaterThanOrEqual(1);
    const backdrop = document.querySelector('.sidebar-backdrop');
    expect(backdrop).not.toBeNull();

    // Clicking mobile navigation closes analytics and opens nav
    const openNavBtn = screen.getByRole('button', { name: /Abrir navegación/i });
    fireEvent.click(openNavBtn);

    expect(screen.getAllByRole('button', { name: /Cerrar navegación/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /Abrir analítica/i })).toBeDefined();
  });
});
