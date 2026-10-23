import React, { useState } from 'react';
import type { EventStageConfig, SupplierCategoryConfig, DateFormatPattern } from '@/types/metodicah';
import { SettingsTabsNav, type SettingsTab } from '@/components/settings/SettingsTabsNav';
import { GeneralSettings } from '@/components/settings/general/GeneralSettings';
import { EventProductionSettings } from '@/components/settings/events/EventProductionSettings';
import { SupplierCategoriesSettings } from '@/components/settings/suppliers/SupplierCategoriesSettings';
import { CrewDepartmentsSettings } from '@/components/settings/crew/CrewDepartmentsSettings';
import { RolesPermissionsSettings } from '@/components/settings/roles/RolesPermissionsSettings';
import { useSettingsStore } from '@/stores';
import { STORAGE_KEYS } from '@/constants/storageKeys';

export interface SettingsViewProps {
  companyLogo?: string | null;
  onUpdateCompanyLogo?: (logoUrl: string | null) => void;
  stages?: EventStageConfig[];
  onUpdateStages?: (stages: EventStageConfig[]) => void;
  configuredScopes?: string[];
  onUpdateConfiguredScopes?: (scopes: string[]) => void;
  supplierCategories?: SupplierCategoryConfig[];
  onUpdateSupplierCategories?: (categories: SupplierCategoryConfig[]) => void;
  crewSectors?: string[];
  onUpdateCrewSectors?: (sectors: string[]) => void;
  dateFormat?: DateFormatPattern;
  onUpdateDateFormat?: (format: DateFormatPattern) => void;
  isAdmin?: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  companyLogo: propCompanyLogo,
  onUpdateCompanyLogo: propOnUpdateCompanyLogo,
  stages: propStages,
  onUpdateStages: propOnUpdateStages,
  configuredScopes: propConfiguredScopes,
  onUpdateConfiguredScopes: propOnUpdateConfiguredScopes,
  supplierCategories: propSupplierCategories,
  onUpdateSupplierCategories: propOnUpdateSupplierCategories,
  crewSectors: propCrewSectors,
  onUpdateCrewSectors: propOnUpdateCrewSectors,
  dateFormat: propDateFormat,
  onUpdateDateFormat: propOnUpdateDateFormat,
  isAdmin: propIsAdmin
}) => {
  const storeLogo = useSettingsStore(s => s.companyLogo);
  const storeUpdateLogo = useSettingsStore(s => s.updateCompanyLogo);
  const storeStages = useSettingsStore(s => s.stages);
  const storeUpdateStages = useSettingsStore(s => s.updateStages);
  const storeScopes = useSettingsStore(s => s.configuredScopes);
  const storeUpdateScopes = useSettingsStore(s => s.updateConfiguredScopes);
  const storeCategories = useSettingsStore(s => s.supplierCategories);
  const storeUpdateCategories = useSettingsStore(s => s.updateSupplierCategories);
  const storeSectors = useSettingsStore(s => s.crewSectors);
  const storeUpdateSectors = useSettingsStore(s => s.updateCrewSectors);
  const storeDateFormat = useSettingsStore(s => s.dateFormat);
  const storeUpdateDateFormat = useSettingsStore(s => s.updateDateFormat);
  const storeUser = useSettingsStore(s => s.currentUser);

  const companyLogo = propCompanyLogo !== undefined ? propCompanyLogo : storeLogo;
  const onUpdateCompanyLogo = propOnUpdateCompanyLogo ?? storeUpdateLogo;
  const stages = propStages ?? storeStages;
  const onUpdateStages = propOnUpdateStages ?? storeUpdateStages;
  const configuredScopes = propConfiguredScopes ?? storeScopes;
  const onUpdateConfiguredScopes = propOnUpdateConfiguredScopes ?? storeUpdateScopes;
  const supplierCategories = propSupplierCategories ?? storeCategories;
  const onUpdateSupplierCategories = propOnUpdateSupplierCategories ?? storeUpdateCategories;
  const crewSectors = propCrewSectors ?? storeSectors;
  const onUpdateCrewSectors = propOnUpdateCrewSectors ?? storeUpdateSectors;
  const dateFormat = propDateFormat ?? storeDateFormat;
  const onUpdateDateFormat = propOnUpdateDateFormat ?? storeUpdateDateFormat;
  const isAdmin = propIsAdmin !== undefined ? propIsAdmin : (storeUser.globalRole === 'admin');
  const [activeSubTab, setActiveSubTab] = useState<SettingsTab>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS.SUBTAB);
    if (saved === 'branding') return 'general';
    if (saved && ['general', 'events', 'suppliers', 'crew', 'roles'].includes(saved)) {
      return saved as SettingsTab;
    }
    return 'general';
  });

  const handleTabChange = (tab: SettingsTab) => {
    setActiveSubTab(tab);
    localStorage.setItem(STORAGE_KEYS.SETTINGS.SUBTAB, tab);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
          Configuración del Sistema
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px', marginBottom: 0, lineHeight: 1.4 }}>
          Preferencias generales y formato de fechas, identidad de marca corporativa, etapas de producción, rubros de proveedores, departamentos de crew y permisos.
        </p>
      </div>

      {/* Modular Sub-Tabs Navigation */}
      <SettingsTabsNav
        activeTab={activeSubTab}
        onTabChange={handleTabChange}
      />

      {/* Sub-Tab Panels */}
      {activeSubTab === 'general' && (
        <GeneralSettings
          companyLogo={companyLogo}
          onUpdateCompanyLogo={onUpdateCompanyLogo}
          dateFormat={dateFormat}
          onUpdateDateFormat={onUpdateDateFormat}
          isAdmin={isAdmin}
        />
      )}

      {activeSubTab === 'events' && (
        <EventProductionSettings
          stages={stages}
          onUpdateStages={onUpdateStages}
          configuredScopes={configuredScopes}
          onUpdateConfiguredScopes={onUpdateConfiguredScopes}
          isAdmin={isAdmin}
        />
      )}

      {activeSubTab === 'suppliers' && (
        <SupplierCategoriesSettings
          supplierCategories={supplierCategories}
          onUpdateSupplierCategories={onUpdateSupplierCategories}
          isAdmin={isAdmin}
        />
      )}

      {activeSubTab === 'crew' && (
        <CrewDepartmentsSettings
          crewSectors={crewSectors}
          onUpdateCrewSectors={onUpdateCrewSectors}
          isAdmin={isAdmin}
        />
      )}

      {activeSubTab === 'roles' && (
        <RolesPermissionsSettings isAdmin={isAdmin} />
      )}
    </div>
  );
};
