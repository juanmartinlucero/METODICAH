import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';
import { Input, Button } from '@/components/ui';
import { loginSchema, type LoginFormData } from '@/schemas/authSchema';
import { useAuthStore } from '@/stores';
import { AuthAlert } from './AuthAlert';
import { useToast } from '@/hooks/useToast';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const login = useAuthStore(s => s.login);
  const authError = useAuthStore(s => s.error);
  const clearError = useAuthStore(s => s.clearError);

  const [showPassword, setShowPassword] = useState(false);
  const [isResetInfoVisible, setIsResetInfoVisible] = useState(false);

  const fromLocation = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const success = await login({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe
    });

    if (success) {
      toast.success('Sesión iniciada correctamente. Bienvenido a METODICAH.');
      navigate(fromLocation, { replace: true });
    }
  };

  const handleFillDemo = (email: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', 'password123', { shouldValidate: true });
    clearError();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <AuthAlert message={authError} onClose={clearError} />

      {isResetInfoVisible && (
        <AuthAlert
          type="info"
          message="Para restablecer tus credenciales técnicas de METODICAH, solicita asistencia al Administrador del sistema o contacta a soporte@metodicah.com."
          onClose={() => setIsResetInfoVisible(false)}
        />
      )}

      <form noValidate onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Email Field */}
        <Input
          label="Correo Electrónico Corporativo"
          type="email"
          placeholder="nombre@empresa.com"
          leftIcon={<Mail size={16} />}
          error={errors.email?.message}
          required
          autoComplete="username"
          {...register('email')}
        />

        {/* Password Field with Eye Toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Input
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            leftIcon={<Lock size={16} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                tabIndex={-1}
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                  pointerEvents: 'auto'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            error={errors.password?.message}
            required
            autoComplete="current-password"
            {...register('password')}
          />
        </div>

        {/* Remember me & Forgot Password links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.80rem',
            marginTop: '2px'
          }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <input
              type="checkbox"
              style={{ accentColor: 'var(--accent-amber)', cursor: 'pointer' }}
              {...register('rememberMe')}
            />
            <span>Recordar mi sesión</span>
          </label>

          <button
            type="button"
            onClick={() => setIsResetInfoVisible(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-amber)',
              fontSize: '0.80rem',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'none'
            }}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          leftIcon={<LogIn size={16} />}
          style={{ width: '100%', marginTop: '8px', padding: '11px' }}
        >
          Iniciar Sesión
        </Button>

        {/* Demo Credentials Quick Fill */}
        <div
          style={{
            marginTop: '10px',
            padding: '12px 14px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={15} style={{ color: '#f59e0b', flexShrink: 0 }} />
            <div style={{ fontSize: '0.75rem' }}>
              <span style={{ color: '#fff', fontWeight: 600 }}>Accesos Demo:</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('juan@metodicah.com')}
              className="btn-ghost"
              title="Admin Principal de la productora"
              style={{
                fontSize: '0.72rem',
                padding: '4px 8px',
                borderRadius: '4px',
                background: 'rgba(245, 158, 11, 0.1)',
                color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.25)'
              }}
            >
              Admin (Juan)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('laura@metodicah.com')}
              className="btn-ghost"
              title="Miembro de Equipo (Staff operativo)"
              style={{
                fontSize: '0.72rem',
                padding: '4px 8px',
                borderRadius: '4px',
                background: 'rgba(56, 189, 248, 0.1)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.25)'
              }}
            >
              Team (Laura)
            </button>
          </div>
        </div>

        {/* Link to Register */}
        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          <div>
            ¿Eres administrador y no tienes cuenta?{' '}
            <Link
              to="/register"
              style={{
                color: 'var(--accent-amber)',
                textDecoration: 'none',
                fontWeight: 500
              }}
            >
              Crear Cuenta de Productora
            </Link>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Los miembros de equipo reciben su acceso directamente desde el panel del Administrador.
          </div>
        </div>
      </form>
    </div>
  );
};
