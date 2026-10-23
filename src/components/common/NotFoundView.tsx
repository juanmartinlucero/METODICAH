import React from 'react';
import { useNavigate } from 'react-router';
import { Compass, ArrowLeft, Home } from 'lucide-react';
import { Button, Card, Badge } from '../ui';

export interface NotFoundViewProps {
  code?: string | number;
  title?: string;
  description?: string;
  redirectPath?: string;
  actionLabel?: string;
  showBackButton?: boolean;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  code = '404',
  title = 'Página no encontrada',
  description = 'La ruta o recurso al que intentas acceder no existe, ha sido movido o no está disponible en este momento.',
  redirectPath = '/dashboard',
  actionLabel = 'Ir al Dashboard Principal',
  showBackButton = true
}) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '65vh',
        width: '100%',
        padding: '24px',
        boxSizing: 'border-box'
      }}
    >
      <Card
        variant="panel"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glow ambient background effect */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200px',
            height: '140px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, rgba(245, 158, 11, 0) 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Icon & Code Badge */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24',
            marginBottom: '16px'
          }}
        >
          <Compass size={32} />
        </div>

        <Badge variant="warning" size="md" style={{ marginBottom: '16px', letterSpacing: '0.05em' }}>
          ERROR {code}
        </Badge>

        {/* Title & Description */}
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '10px',
            letterSpacing: '-0.02em'
          }}
        >
          {title}
        </h2>

        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            lineHeight: 1.55,
            marginBottom: '28px',
            maxWidth: '420px'
          }}
        >
          {description}
        </p>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          {showBackButton && (
            <Button
              variant="secondary"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate(-1)}
            >
              Volver atrás
            </Button>
          )}

          <Button
            variant="primary"
            leftIcon={<Home size={16} />}
            onClick={() => navigate(redirectPath)}
          >
            {actionLabel}
          </Button>
        </div>
      </Card>
    </div>
  );
};
