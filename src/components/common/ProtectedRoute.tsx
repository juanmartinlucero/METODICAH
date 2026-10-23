import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '@/stores';
import { LoadingFallback } from './LoadingFallback';

export const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const isLoading = useAuthStore(s => s.isLoading);

  if (isLoading) {
    return <LoadingFallback message="Verificando credenciales técnicas..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
