import React, { useRef } from 'react';
import { Camera, ShieldCheck, Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { Badge, Button, Card } from '@/components/ui';

interface ProfileAvatarCardProps {
  name: string;
  globalRole: 'admin' | 'team_member' | 'guest';
  specialty?: string;
  avatarUrl?: string;
  onAvatarChange: (newUrl: string | undefined) => void;
}

export const ProfileAvatarCard: React.FC<ProfileAvatarCardProps> = ({
  name,
  globalRole,
  specialty,
  avatarUrl,
  onAvatarChange
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (str: string) => {
    const parts = str.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return str.slice(0, 2).toUpperCase();
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.warning('Por favor selecciona un archivo de imagen válido (PNG, JPG, SVG o WebP).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onAvatarChange(result);
        toast.success('Foto de perfil actualizada correctamente.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    onAvatarChange(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.info('Foto de perfil eliminada.');
  };

  return (
    <Card variant="panel" style={{ padding: '28px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative' }}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(245, 158, 11, 0.4)'
            }}
          />
        ) : (
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '2px solid rgba(245, 158, 11, 0.4)',
            color: '#f59e0b',
            fontSize: '1.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {getInitials(name || 'JM')}
          </div>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Cambiar foto de perfil"
          style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#f59e0b',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
            transition: 'transform 0.15s ease'
          }}
        >
          <Camera size={14} />
        </button>
      </div>

      <div style={{ flex: 1, minWidth: '220px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', margin: 0 }}>
            {name || 'Juan Martín'}
          </h3>
          <Badge variant="amber" size="sm">
            <ShieldCheck size={12} style={{ marginRight: '4px' }} />
            {globalRole === 'admin' ? 'Administrador' : 'Miembro de Equipo'}
          </Badge>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
          {specialty || 'Dirección General de Producción'}
        </p>

        <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload size={13} />}
          >
            Subir Nueva Foto
          </Button>

          {avatarUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveAvatar}
              leftIcon={<Trash2 size={13} />}
              style={{ color: '#ef4444' }}
            >
              Quitar Foto
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

