import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, RefreshCw } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  moduleName?: string;
  isRoot?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    console.error(`[ErrorBoundary${this.props.moduleName ? ` - ${this.props.moduleName}` : ''}]:`, error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { moduleName, isRoot = false } = this.props;
      const errorMessage = this.state.error?.message || 'Error inesperado de ejecución';

      const containerStyle: React.CSSProperties = isRoot
        ? {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            width: '100vw',
            padding: '24px',
            background: 'var(--bg-dark)',
            boxSizing: 'border-box',
          }
        : {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '340px',
            padding: '24px',
            width: '100%',
            boxSizing: 'border-box',
          };

      return (
        <div role="alert" aria-live="assertive" style={containerStyle}>
          <Card
            variant="glass"
            style={{
              maxWidth: isRoot ? '600px' : '520px',
              width: '100%',
              padding: isRoot ? '36px' : '28px',
              textAlign: 'center',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(239, 68, 68, 0.1)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                margin: '0 auto 16px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-red, #ef4444)',
              }}
            >
              <AlertTriangle size={28} />
            </div>

            <h2
              style={{
                fontSize: isRoot ? '1.4rem' : '1.2rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                marginBottom: '8px',
                letterSpacing: '-0.02em',
              }}
            >
              {moduleName ? `Error en ${moduleName}` : 'Se ha producido una excepción'}
            </h2>

            <p
              style={{
                fontSize: '0.88rem',
                color: 'var(--text-muted)',
                marginBottom: '18px',
                lineHeight: 1.5,
              }}
            >
              {isRoot
                ? 'La aplicación experimentó un fallo imprevisto. Tus datos en el catálogo y configuración se mantienen a salvo.'
                : 'Ocurrió una interrupción al renderizar este componente. El resto de la aplicación continúa operativa.'}
            </p>

            <div
              style={{
                padding: '12px 14px',
                background: 'rgba(0, 0, 0, 0.45)',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                fontSize: '0.78rem',
                fontFamily: 'monospace',
                color: '#fca5a5',
                textAlign: 'left',
                overflowX: 'auto',
                marginBottom: '24px',
                maxHeight: '120px',
                wordBreak: 'break-word',
              }}
            >
              {errorMessage}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant="secondary"
                size="md"
                onClick={this.handleReset}
                leftIcon={<RotateCcw size={15} />}
              >
                Reintentar
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={this.handleReload}
                leftIcon={<RefreshCw size={15} />}
              >
                Recargar aplicación
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export const RootErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary isRoot moduleName="Aplicación METODICAH">
    {children}
  </ErrorBoundary>
);
