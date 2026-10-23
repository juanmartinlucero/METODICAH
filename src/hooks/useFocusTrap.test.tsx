import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { useFocusTrap } from './useFocusTrap';

interface TestModalProps {
  isActive: boolean;
}

const TestModalComponent: React.FC<TestModalProps> = ({ isActive }) => {
  const panelRef = useFocusTrap<HTMLDivElement>(isActive);

  return (
    <div ref={panelRef} data-testid="modal-panel" tabIndex={-1}>
      <input data-testid="first-input" placeholder="Nombre" />
      <select data-testid="middle-select">
        <option value="1">Opción 1</option>
      </select>
      <button data-testid="last-button">Guardar</button>
    </div>
  );
};

describe('useFocusTrap', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('debe enfocar el primer elemento interactivo al activarse', async () => {
    render(<TestModalComponent isActive={true} />);

    await new Promise(r => setTimeout(r, 30));

    const firstInput = screen.getByTestId('first-input');
    expect(document.activeElement).toBe(firstInput);
  });

  it('debe ciclar al primer elemento al presionar Tab en el último elemento', async () => {
    render(<TestModalComponent isActive={true} />);

    await new Promise(r => setTimeout(r, 30));

    const firstInput = screen.getByTestId('first-input');
    const lastButton = screen.getByTestId('last-button');

    // Enfocar el último botón manualmente
    lastButton.focus();
    expect(document.activeElement).toBe(lastButton);

    // Disparar Tab hacia adelante
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
      shiftKey: false
    });
    window.dispatchEvent(tabEvent);

    // Debe circular al primer input
    expect(document.activeElement).toBe(firstInput);
  });

  it('debe ciclar al último elemento al presionar Shift+Tab en el primer elemento', async () => {
    render(<TestModalComponent isActive={true} />);

    await new Promise(r => setTimeout(r, 30));

    const firstInput = screen.getByTestId('first-input');
    const lastButton = screen.getByTestId('last-button');

    firstInput.focus();
    expect(document.activeElement).toBe(firstInput);

    // Disparar Shift+Tab hacia atrás
    const shiftTabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
      shiftKey: true
    });
    window.dispatchEvent(shiftTabEvent);

    // Debe circular al último botón
    expect(document.activeElement).toBe(lastButton);
  });

  it('debe restaurar el foco al elemento disparador al desmontarse o cerrarse', async () => {
    const trigger = document.createElement('button');
    trigger.setAttribute('data-testid', 'open-trigger');
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    const { unmount } = render(<TestModalComponent isActive={true} />);

    await new Promise(r => setTimeout(r, 30));
    expect(document.activeElement).toBe(screen.getByTestId('first-input'));

    // Desmontar el modal simulando cierre
    unmount();
    await new Promise(r => setTimeout(r, 30));

    expect(document.activeElement).toBe(trigger);
  });
});
