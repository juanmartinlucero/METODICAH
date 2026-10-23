import React from 'react';
import { Sparkles } from 'lucide-react';

interface DashboardWelcomeProps {
  userName?: string;
  companyLogo?: string | null;
}

export const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({
  userName = 'Juan Martín',
  companyLogo
}) => {
  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      {/* Company Logo */}
      {companyLogo ? (
        <div style={{ marginBottom: '8px' }}>
          <img 
            src={companyLogo} 
            alt="Logo de la empresa" 
            style={{
              maxHeight: '64px',
              maxWidth: '220px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'
            }} 
          />
        </div>
      ) : (
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f59e0b',
          marginBottom: '4px'
        }}>
          <Sparkles size={28} />
        </div>
      )}

      {/* Greeting & Subtitle */}
      <div>
        <h1 style={{
          fontSize: '2.4rem',
          fontWeight: 600,
          letterSpacing: '-0.03em',
          color: '#ffffff',
          marginBottom: '6px'
        }}>
          Hola, {userName}
        </h1>
        <p style={{
          fontSize: '0.96rem',
          color: 'var(--text-muted)',
          fontWeight: 400,
          maxWidth: '520px',
          margin: '0 auto'
        }}>
          Explora tus producciones activas o gestiona un nuevo evento.
        </p>
      </div>
    </div>
  );
};
