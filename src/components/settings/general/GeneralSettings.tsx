import React from 'react';
import type { DateFormatPattern } from '../../../types/metodicah';
import { DateFormatSettings } from './DateFormatSettings';
import { BrandingSettings } from '../branding/BrandingSettings';

interface GeneralSettingsProps {
  companyLogo: string | null;
  onUpdateCompanyLogo: (logoUrl: string | null) => void;
  dateFormat?: DateFormatPattern;
  onUpdateDateFormat?: (format: DateFormatPattern) => void;
  isAdmin: boolean;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  companyLogo,
  onUpdateCompanyLogo,
  dateFormat,
  onUpdateDateFormat,
  isAdmin
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Preferencias Regionales & Formato de Fechas */}
      <DateFormatSettings
        currentFormat={dateFormat}
        onSelectFormat={onUpdateDateFormat}
      />

      {/* 2. Identidad Visual & Logo Corporativo */}
      <BrandingSettings
        companyLogo={companyLogo}
        onUpdateCompanyLogo={onUpdateCompanyLogo}
        isAdmin={isAdmin}
      />
    </div>
  );
};
