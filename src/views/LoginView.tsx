import React from 'react';
import { AuthHeader, LoginForm } from '@/components/auth';

export const LoginView: React.FC = () => {
  return (
    <div>
      <AuthHeader
        badgeText="Acceso al Sistema"
        title="Iniciar Sesión"
        subtitle="Ingresa tus credenciales técnicas para acceder al panel de control de eventos y operaciones."
      />
      <LoginForm />
    </div>
  );
};
