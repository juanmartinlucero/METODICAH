import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, RootErrorBoundary } from './ErrorBoundary';

// Componente de prueba que arroja un error controlado
const ProblemChild: React.FC<{ shouldThrow?: boolean; message?: string }> = ({ 
  shouldThrow = true, 
  message = 'Fallo simulado de renderizado' 
}) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div data-testid="child-ok">Contenido hijo renderizado correctamente</div>;
};

describe('ErrorBoundary Component', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Silenciar console.error para evitar ruido en la salida de Vitest durante lanzamientos de excepción esperados
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renderiza a los componentes hijos con normalidad si no hay excepciones', () => {
    render(
      <ErrorBoundary moduleName="Módulo Normal">
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('child-ok')).toBeDefined();
    expect(screen.getByText('Contenido hijo renderizado correctamente')).toBeDefined();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('captura el error lanzado por un hijo y muestra la interfaz de recuperación HUD Studio Dark', () => {
    render(
      <ErrorBoundary moduleName="Catálogo de Clientes">
        <ProblemChild shouldThrow={true} message="Error crítico al parsear registros" />
      </ErrorBoundary>
    );

    const alert = screen.getByRole('alert');
    expect(alert).toBeDefined();
    expect(screen.getByText('Error en Catálogo de Clientes')).toBeDefined();
    expect(screen.getByText('Error crítico al parsear registros')).toBeDefined();
    expect(screen.getByRole('button', { name: /Reintentar/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Recargar aplicación/i })).toBeDefined();
  });

  it('invoca onError cuando ocurre una excepción', () => {
    const handleError = vi.fn();

    render(
      <ErrorBoundary moduleName="Test Error" onError={handleError}>
        <ProblemChild shouldThrow={true} message="Excepción de prueba" />
      </ErrorBoundary>
    );

    expect(handleError).toHaveBeenCalledTimes(1);
    expect(handleError.mock.calls[0][0].message).toBe('Excepción de prueba');
  });

  it('permite resetear el límite de error tras pulsar Reintentar', () => {
    const handleReset = vi.fn();

    // Contenedor que permite alternar el estado que arroja el error
    const RecoverableParent: React.FC = () => {
      const [hasExploded, setHasExploded] = useState(true);

      return (
        <ErrorBoundary 
          moduleName="Módulo Recuperable" 
          onReset={() => {
            setHasExploded(false);
            handleReset();
          }}
        >
          <ProblemChild shouldThrow={hasExploded} message="Error recuperable" />
        </ErrorBoundary>
      );
    };

    render(<RecoverableParent />);

    expect(screen.getByText('Error en Módulo Recuperable')).toBeDefined();

    const retryBtn = screen.getByRole('button', { name: /Reintentar/i });
    fireEvent.click(retryBtn);

    expect(handleReset).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('child-ok')).toBeDefined();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('renderiza un fallback personalizado si se suministra', () => {
    render(
      <ErrorBoundary fallback={<div data-testid="custom-fallback">UI Fallback Alternativa</div>}>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('custom-fallback')).toBeDefined();
    expect(screen.getByText('UI Fallback Alternativa')).toBeDefined();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('RootErrorBoundary encapsula en modo isRoot con mensaje de resguardo de datos', () => {
    render(
      <RootErrorBoundary>
        <ProblemChild shouldThrow={true} message="Colapso en root" />
      </RootErrorBoundary>
    );

    expect(screen.getByText('Error en Aplicación METODICAH')).toBeDefined();
    expect(screen.getByText(/Tus datos en el catálogo y configuración se mantienen a salvo/i)).toBeDefined();
    expect(screen.getByText('Colapso en root')).toBeDefined();
  });
});
