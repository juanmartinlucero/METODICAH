import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Briefcase, Building2, ShieldCheck } from 'lucide-react';
import { Input, Button } from '@/components/ui';
import { registerSchema, type RegisterFormData } from '@/schemas/authSchema';
import { useAuthStore } from '@/stores';
import { AuthAlert } from './AuthAlert';
import { useToast } from '@/hooks/useToast';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const registerUser = useAuthStore(s => s.register);
  const authError = useAuthStore(s => s.error);
  const clearError = useAuthStore(s => s.clearError);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: '',
      name: '',
      email: '',
      specialty: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    const success = await registerUser({
      companyName: data.companyName,
      name: data.name,
      email: data.email,
      password: data.password,
      specialty: data.specialty || undefined,
      globalRole: 'admin'
    });

    if (success) {
      toast.success('Cuenta de productora creada exitosamente. ¡Bienvenido a METODICAH!');
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <AuthAlert message={authError} onClose={clearError} />

      {/* Admin Notice Banner */}
      <div
        style={{
          padding: '10px 14px',
          borderRadius: '8px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.78rem',
          color: '#fbbf24'
        }}
      >
        <ShieldCheck size={16} style={{ flexShrink: 0, color: '#f59e0b' }} />
        <span>
          Alta de cuenta para <strong>Administrador de Productora</strong>. Podrás sumar a tus integrantes de equipo desde tu panel interno.
        </span>
      </div>

      <form noValidate onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Company / Producer Name */}
        <Input
          label="Nombre de la Productora / Estudio"
          type="text"
          placeholder="ej: Live Studio Eventos S.A."
          leftIcon={<Building2 size={16} />}
          error={errors.companyName?.message}
          required
          autoFocus
          {...register('companyName')}
        />
        {/* Full Name */}
        <Input
          label="Nombre y Apellido"
          type="text"
          placeholder="ej: María Laura Rossi"
          leftIcon={<User size={16} />}
          error={errors.name?.message}
          required
          autoComplete="name"
          {...register('name')}
        />

        {/* Email */}
        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="laura@productora.com"
          leftIcon={<Mail size={16} />}
          error={errors.email?.message}
          required
          autoComplete="username"
          {...register('email')}
        />

        {/* Specialty / Role */}
        <Input
          label="Rol / Especialidad Técnica"
          type="text"
          placeholder="ej: Coordinación Técnica / FOH Audio"
          leftIcon={<Briefcase size={16} />}
          error={errors.specialty?.message}
          helperText="Cargo u operación principal en eventos"
          {...register('specialty')}
        />

        {/* Password */}
        <Input
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          placeholder="Mínimo 6 caracteres"
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
          autoComplete="new-password"
          {...register('password')}
        />

        {/* Confirm Password */}
        <Input
          label="Confirmar Contraseña"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Repite la contraseña"
          leftIcon={<Lock size={16} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              tabIndex={-1}
              title={showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
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
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          error={errors.confirmPassword?.message}
          required
          autoComplete="new-password"
          {...register('confirmPassword')}
        />

        {/* Terms Checkbox */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '9px',
              cursor: 'pointer',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              lineHeight: 1.4
            }}
          >
            <input
              type="checkbox"
              style={{ accentColor: 'var(--accent-amber)', marginTop: '2px', cursor: 'pointer' }}
              {...register('terms')}
            />
            <span>
              Acepto los términos de servicio, políticas operativas y confidencialidad técnica de METODICAH.
            </span>
          </label>
          {errors.terms?.message && (
            <span style={{ fontSize: '0.74rem', color: '#f87171', marginLeft: '22px' }}>
              {errors.terms.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          leftIcon={<UserPlus size={16} />}
          style={{ width: '100%', marginTop: '10px', padding: '11px' }}
        >
          Crear Cuenta de Productora (Admin)
        </Button>

        {/* Link to Login */}
        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          ¿Ya tienes una cuenta activa?{' '}
          <Link
            to="/login"
            style={{
              color: 'var(--accent-amber)',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            Iniciar Sesión
          </Link>
        </div>
      </form>
    </div>
  );
};
