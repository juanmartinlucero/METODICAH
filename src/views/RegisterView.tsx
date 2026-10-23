import React from 'react';
import { AuthHeader, RegisterForm } from '@/components/auth';

export const RegisterView: React.FC = () => {
  return (
    <div>
      <AuthHeader
        badgeText="Nuevo Registro Técnico"
        title="Crear Cuenta de Producción"
        subtitle="Regístrate para integrarte a los proyectos, timing en vivo, proveedores y coordinación general."
      />
      <RegisterForm />
    </div>
  );
};
