import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { CrewFormData } from './crewSchema';
import { Input, Select } from '@/components/ui';
import { ShieldCheck, Lock, Eye, EyeOff, Sparkles, Mail } from 'lucide-react';

export const CrewAccessFields: React.FC = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext<CrewFormData>();
  const [showPassword, setShowPassword] = useState(false);

  const hasSystemAccess = watch('hasSystemAccess');
  const userEmail = watch('userEmail');

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue('password', pass, { shouldValidate: true });
    setShowPassword(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <h4 style={{ fontSize: '0.85rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={16} />
          5. Acceso a la Plataforma & Rol Global
        </h4>

        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#fff' }}>
          <input
            type="checkbox"
            {...register('hasSystemAccess')}
            style={{ accentColor: '#f59e0b', cursor: 'pointer', width: '16px', height: '16px' }}
          />
          <span>Habilitar cuenta de acceso para este miembro</span>
        </label>
      </div>

      {hasSystemAccess && (
        <div
          className="glass-panel"
          style={{
            padding: '16px',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            background: 'rgba(245, 158, 11, 0.03)',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <Select
              label="Rol Global en METODICAH"
              required
              error={errors.globalRole?.message}
              {...register('globalRole')}
            >
              <option value="">Selecciona un nivel de rol...</option>
              <option value="team_member">Miembro de Equipo (Crew Operativo)</option>
              <option value="admin">Administrador (Productor Lead / Full Access)</option>
              <option value="guest">Invitado (Visualizador / Sólo Lectura)</option>
            </Select>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-main)' }}>
                  Contraseña de Ingreso
                </label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="btn-ghost"
                  style={{ fontSize: '0.72rem', color: '#f59e0b', padding: '0 4px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Sparkles size={12} />
                  <span>Generar clave</span>
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres..."
                  leftIcon={<Lock size={15} />}
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="btn-ghost"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '4px',
                    color: 'var(--text-dim)'
                  }}
                  title={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            <Mail size={13} color="#f59e0b" />
            <span>
              El usuario iniciará sesión con su correo: <strong style={{ color: '#fff' }}>{userEmail || '(especifica el email arriba)'}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
