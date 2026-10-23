import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '@/stores';
import { LoadingFallback } from './LoadingFallback';

export const PublicOnlyRoute: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const isLoading = useAuthStore(s => s.isLoading);

  if (isLoading) {
    return <LoadingFallback message="Cargando acceso..." />;
  }

  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};
