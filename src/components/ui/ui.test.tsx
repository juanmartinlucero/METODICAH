import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button, Badge, Card, Input, Textarea, Select } from './index';

describe('UI Primitives - Design System', () => {
  describe('Button', () => {
    it('debe renderizar el texto y responder al click', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Acción</Button>);

      const btn = screen.getByRole('button', { name: 'Acción' });
      expect(btn).toBeDefined();
      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('debe deshabilitarse y no emitir click si disabled o isLoading', () => {
      const handleClick = vi.fn();
      const { rerender } = render(<Button disabled onClick={handleClick}>Deshabilitado</Button>);

      const btn = screen.getByRole('button') as HTMLButtonElement;
      expect(btn.disabled).toBe(true);
      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();

      rerender(<Button isLoading onClick={handleClick}>Cargando</Button>);
      expect(btn.disabled).toBe(true);
      expect(btn.getAttribute('aria-busy')).toBe('true');
      fireEvent.click(btn);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('debe aplicar clases de variante correctamente', () => {
      const { rerender } = render(<Button variant="primary">Primario</Button>);
      let btn = screen.getByRole('button');
      expect(btn.className).toContain('btn-primary');

      rerender(<Button variant="ghost">Ghost</Button>);
      btn = screen.getByRole('button');
      expect(btn.className).toContain('btn-ghost');
    });
  });

  describe('Badge', () => {
    it('debe renderizar el contenido del badge', () => {
      render(<Badge variant="amber">En Proceso</Badge>);
      expect(screen.getByText('En Proceso')).toBeDefined();
    });

    it('debe aceptar variantes semánticas (success, warning, info, danger, primary)', () => {
      const { rerender } = render(<Badge variant="success">Éxito</Badge>);
      expect(screen.getByText('Éxito')).toBeDefined();

      rerender(<Badge variant="warning">Atención</Badge>);
      expect(screen.getByText('Atención')).toBeDefined();

      rerender(<Badge variant="info">Información</Badge>);
      expect(screen.getByText('Información')).toBeDefined();

      rerender(<Badge variant="danger">Peligro</Badge>);
      expect(screen.getByText('Peligro')).toBeDefined();

      rerender(<Badge variant="primary">Principal</Badge>);
      expect(screen.getByText('Principal')).toBeDefined();
    });

    it('debe aceptar color dinámico personalizado', () => {
      render(<Badge color="#10b981" dot>Activo</Badge>);
      const badge = screen.getByText('Activo');
      expect(badge.style.color).toBe('rgb(16, 185, 129)');
    });
  });

  describe('Card', () => {
    it('debe renderizar contenido dentro de Card con clase glass-card', () => {
      render(<Card><span>Contenido de Tarjeta</span></Card>);
      expect(screen.getByText('Contenido de Tarjeta')).toBeDefined();
      expect(screen.getByText('Contenido de Tarjeta').parentElement?.className).toContain('glass-card');
    });

    it('debe admitir variante panel y evento click', () => {
      const handleClick = vi.fn();
      render(<Card variant="panel" onClick={handleClick} data-testid="test-card">Panel</Card>);
      const card = screen.getByTestId('test-card');
      expect(card.className).toContain('glass-panel');
      fireEvent.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Input', () => {
    it('debe renderizar label, helperText y vincularse con id', () => {
      render(
        <Input
          label="Correo Corporativo"
          helperText="Ingrese su correo institucional"
          placeholder="ejemplo@empresa.com"
        />
      );

      expect(screen.getByLabelText(/Correo Corporativo/i)).toBeDefined();
      expect(screen.getByText('Ingrese su correo institucional')).toBeDefined();
    });

    it('debe mostrar error con aria-invalid cuando se proporciona error', () => {
      render(
        <Input
          label="Teléfono"
          error="Número inválido"
          defaultValue="123"
        />
      );

      const input = screen.getByLabelText(/Teléfono/i);
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(screen.getByText('Número inválido')).toBeDefined();
    });
  });

  describe('Textarea', () => {
    it('debe renderizar label, valor y error con aria-invalid', () => {
      render(
        <Textarea
          label="Observaciones Técnicas"
          error="Campo requerido"
          defaultValue="Nota de prueba"
        />
      );

      const textarea = screen.getByLabelText(/Observaciones Técnicas/i);
      expect(textarea).toBeDefined();
      expect(textarea.getAttribute('aria-invalid')).toBe('true');
      expect(screen.getByText('Campo requerido')).toBeDefined();
    });
  });

  describe('Select', () => {
    it('debe renderizar label, opciones declarativas y responder a onChange', () => {
      const handleChange = vi.fn();
      const options = [
        { value: 'opt1', label: 'Opción 1' },
        { value: 'opt2', label: 'Opción 2' }
      ];

      render(
        <Select
          label="Categoría"
          options={options}
          defaultValue="opt1"
          onChange={handleChange}
        />
      );

      const select = screen.getByLabelText(/Categoría/i) as HTMLSelectElement;
      expect(select).toBeDefined();
      expect(select.value).toBe('opt1');

      fireEvent.change(select, { target: { value: 'opt2' } });
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(select.value).toBe('opt2');
    });

    it('debe admitir children como opciones alternativas', () => {
      render(
        <Select label="Tipo de Evento" defaultValue="festival">
          <option value="corp">Corporativo</option>
          <option value="festival">Festival</option>
        </Select>
      );

      const select = screen.getByLabelText(/Tipo de Evento/i) as HTMLSelectElement;
      expect(select.value).toBe('festival');
      expect(screen.getByText('Corporativo')).toBeDefined();
      expect(screen.getByText('Festival')).toBeDefined();
    });

    it('debe mostrar error, helperText y aria-invalid', () => {
      render(
        <Select
          label="Estado"
          error="Selecciona un estado válido"
          helperText="Texto informativo"
        >
          <option value="pending">Pendiente</option>
        </Select>
      );

      const select = screen.getByLabelText(/Estado/i);
      expect(select.getAttribute('aria-invalid')).toBe('true');
      expect(screen.getByText('Selecciona un estado válido')).toBeDefined();
    });
  });
});

