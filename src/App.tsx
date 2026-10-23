import { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { DateFormatProvider } from './context/DateFormatContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './layouts/AppLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { PublicOnlyRoute } from './components/common/PublicOnlyRoute';
import { NotFoundView } from './views/NotFoundView';
import { RootErrorBoundary } from './components/common/ErrorBoundary';
import { useSettingsStore } from './stores';

// Lazy-loaded Views for optimal code-splitting and architectural isolation
const LoginView = lazy(() => import('./views/LoginView').then(m => ({ default: m.LoginView })));
const RegisterView = lazy(() => import('./views/RegisterView').then(m => ({ default: m.RegisterView })));
const DashboardView = lazy(() => import('./views/DashboardView').then(m => ({ default: m.DashboardView })));
const EventsView = lazy(() => import('./views/EventsView').then(m => ({ default: m.EventsView })));
const EventDetailView = lazy(() => import('./views/EventDetailView').then(m => ({ default: m.EventDetailView })));
const ClientsView = lazy(() => import('./views/ClientsView').then(m => ({ default: m.ClientsView })));
const SuppliersView = lazy(() => import('./views/SuppliersView').then(m => ({ default: m.SuppliersView })));
const CrewView = lazy(() => import('./views/CrewView').then(m => ({ default: m.CrewView })));
const WorkflowView = lazy(() => import('./views/WorkflowView').then(m => ({ default: m.WorkflowView })));
const SettingsView = lazy(() => import('./views/SettingsView').then(m => ({ default: m.SettingsView })));
const ProfileView = lazy(() => import('./views/ProfileView').then(m => ({ default: m.ProfileView })));

export function App() {
  const dateFormat = useSettingsStore(s => s.dateFormat);
  const updateDateFormat = useSettingsStore(s => s.updateDateFormat);

  return (
    <RootErrorBoundary>
      <DateFormatProvider dateFormat={dateFormat} setDateFormat={updateDateFormat}>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Rutas Públicas de Autenticación */}
              <Route element={<PublicOnlyRoute />}>
                <Route element={<AuthLayout />}>
                  <Route path="login" element={<LoginView />} />
                  <Route path="signin" element={<Navigate to="/login" replace />} />
                  <Route path="register" element={<RegisterView />} />
                  <Route path="signup" element={<Navigate to="/register" replace />} />
                </Route>
              </Route>

              {/* Rutas Protegidas de la Plataforma */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardView />} />
                  <Route path="events" element={<EventsView />} />
                  <Route path="events/:eventId" element={<EventDetailView />} />
                  <Route path="events/:eventId/:subTab" element={<EventDetailView />} />
                  <Route path="clients" element={<ClientsView />} />
                  <Route path="suppliers" element={<SuppliersView />} />
                  <Route path="crew" element={<CrewView />} />
                  <Route path="workflow" element={<WorkflowView />} />
                  <Route path="workflow/:workflowId" element={<WorkflowView />} />
                  <Route path="workflows" element={<Navigate to="/workflow" replace />} />
                  <Route path="settings" element={<SettingsView />} />
                  <Route path="profile" element={<ProfileView />} />
                  <Route path="*" element={<NotFoundView />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </DateFormatProvider>
    </RootErrorBoundary>
  );
}
