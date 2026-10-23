import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { LogoPreview } from './LogoPreview';
import { LogoUploadActions } from './LogoUploadActions';
import { useToast } from '../../../hooks/useToast';

interface BrandingSettingsProps {
  companyLogo: string | null;
  onUpdateCompanyLogo: (logoUrl: string | null) => void;
  isAdmin: boolean;
}

export const BrandingSettings: React.FC<BrandingSettingsProps> = ({
  companyLogo,
  onUpdateCompanyLogo,
  isAdmin
}) => {
  const toast = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.warning('Por favor selecciona un archivo de imagen válido (PNG, JPG, SVG o WebP).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onUpdateCompanyLogo(result);
        toast.success('Logo corporativo actualizado correctamente.');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ImageIcon size={20} color="#f59e0b" />
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>
          Identidad Visual & Logo Corporativo
        </h3>
      </div>
      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
        Carga el logo de tu empresa o productora. Se mostrará en el Dashboard General, barra lateral y reportes exportables.
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        padding: '20px',
        background: 'rgba(9, 13, 22, 0.6)',
        borderRadius: '10px',
        border: '1px solid var(--border-subtle)',
        flexWrap: 'wrap'
      }}>
        <LogoPreview logoUrl={companyLogo} />

        <LogoUploadActions
          hasCustomLogo={Boolean(companyLogo)}
          isAdmin={isAdmin}
          onUpload={handleFileUpload}
          onReset={() => onUpdateCompanyLogo(null)}
        />
      </div>
    </div>
  );
};

