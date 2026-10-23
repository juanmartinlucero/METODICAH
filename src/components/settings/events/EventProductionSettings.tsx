import React from 'react';
import type { EventStageConfig } from '../../../types/metodicah';
import { EventStagesConfig } from './EventStagesConfig';
import { EventScopesConfig } from './EventScopesConfig';

interface EventProductionSettingsProps {
  stages: EventStageConfig[];
  onUpdateStages: (stages: EventStageConfig[]) => void;
  configuredScopes: string[];
  onUpdateConfiguredScopes: (scopes: string[]) => void;
  isAdmin: boolean;
}

export const EventProductionSettings: React.FC<EventProductionSettingsProps> = ({
  stages,
  onUpdateStages,
  configuredScopes,
  onUpdateConfiguredScopes,
  isAdmin
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <EventStagesConfig
        stages={stages}
        onUpdateStages={onUpdateStages}
        isAdmin={isAdmin}
      />

      <EventScopesConfig
        configuredScopes={configuredScopes}
        onUpdateConfiguredScopes={onUpdateConfiguredScopes}
        isAdmin={isAdmin}
      />
    </div>
  );
};
