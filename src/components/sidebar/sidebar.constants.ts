import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Truck, 
  UserCheck, 
  Workflow,
  Settings 
} from 'lucide-react';

export interface SidebarMenuItem {
  id: string;
  path: string;
  label: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; className?: string }>;
}

export const SIDEBAR_MENU_ITEMS: SidebarMenuItem[] = [
  { id: 'dashboard', path: '/dashboard', label: 'Dashboard General', icon: LayoutDashboard },
  { id: 'events', path: '/events', label: 'Eventos & Producción', icon: CalendarDays },
  { id: 'clients', path: '/clients', label: 'Clientes', icon: Users },
  { id: 'suppliers', path: '/suppliers', label: 'Proveedores', icon: Truck },
  { id: 'crew', path: '/crew', label: 'Equipo / Crew', icon: UserCheck },
  { id: 'workflow', path: '/workflow', label: 'Workflow', icon: Workflow },
  { id: 'settings', path: '/settings', label: 'Configuración', icon: Settings },
];
