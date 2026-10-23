import { 
  SlidersHorizontal,
  Layers, 
  Truck, 
  Users,
  ShieldCheck
} from 'lucide-react';

export type SettingsTab = 'general' | 'events' | 'suppliers' | 'crew' | 'roles';

interface SettingsTabsNavProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const SUB_TABS: { id: SettingsTab; label: string; icon: React.FC<{ size?: number; color?: string }> }[] = [
  { id: 'general', label: 'General', icon: SlidersHorizontal },
  { id: 'events', label: 'Eventos & Producción', icon: Layers },
  { id: 'suppliers', label: 'Rubros de Proveedores', icon: Truck },
  { id: 'crew', label: 'Departamentos de Crew', icon: Users },
  { id: 'roles', label: 'Roles & Permisos', icon: ShieldCheck },
];


export const SettingsTabsNav: React.FC<SettingsTabsNavProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      borderBottom: '1px solid var(--border-subtle)',
      paddingBottom: '8px',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      width: '100%'
    }}>
      {SUB_TABS.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: isActive ? 'rgba(245, 158, 11, 0.45)' : 'transparent',
              background: isActive ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.02)',
              color: isActive ? '#f59e0b' : 'var(--text-muted)',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <Icon size={16} color={isActive ? '#f59e0b' : 'currentColor'} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
