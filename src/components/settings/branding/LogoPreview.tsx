import React from 'react';
import { Sparkles } from 'lucide-react';

interface LogoPreviewProps {
  logoUrl: string | null;
}

export const LogoPreview: React.FC<LogoPreviewProps> = ({ logoUrl }) => {
  return (
    <div style={{
      width: '120px',
      height: '80px',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px dashed var(--border-subtle-hover)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: '8px',
      flexShrink: 0
    }}>
      {logoUrl ? (
        <img 
          src={logoUrl} 
          alt="Logo Empresa Preview" 
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
        />
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.72rem' }}>
          <Sparkles size={20} color="#f59e0b" style={{ margin: '0 auto 4px auto' }} />
          <span>Logo METODICAH</span>
        </div>
      )}
    </div>
  );
};
