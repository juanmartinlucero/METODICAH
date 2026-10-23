import React, { useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';

interface LogoUploadActionsProps {
  hasCustomLogo: boolean;
  isAdmin: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export const LogoUploadActions: React.FC<LogoUploadActionsProps> = ({
  hasCustomLogo,
  isAdmin,
  onUpload,
  onReset
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '220px' }}>
      <div style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 500 }}>
        {hasCustomLogo ? 'Logo personalizado cargado' : 'Logo por defecto de METODICAH'}
      </div>
      <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
        Recomendado: Formato PNG transparente o SVG. Tamaño óptimo: 240x80 px.
      </span>

      {isAdmin ? (
        <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onUpload} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
          
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()} 
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '7px 14px' }}
          >
            <Upload size={14} />
            <span>Cargar nuevo logo</span>
          </button>

          {hasCustomLogo && (
            <button 
              type="button"
              onClick={onReset} 
              className="btn-ghost"
              style={{ fontSize: '0.8rem', color: '#ef4444', padding: '7px 12px' }}
            >
              <Trash2 size={14} />
              <span>Restablecer por defecto</span>
            </button>
          )}
        </div>
      ) : (
        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          Solo los usuarios con rol Administrador pueden actualizar el logo de la empresa.
        </span>
      )}
    </div>
  );
};
