import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface ProfileFeedbackAlertProps {
  isSaved: boolean;
  errorMsg: string | null;
}

export const ProfileFeedbackAlert: React.FC<ProfileFeedbackAlertProps> = ({
  isSaved,
  errorMsg
}) => {
  if (errorMsg) {
    return (
      <div style={{
        padding: '12px 16px',
        borderRadius: '8px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        color: '#f87171',
        fontSize: '0.84rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <AlertCircle size={16} />
        <span>{errorMsg}</span>
      </div>
    );
  }

  if (isSaved) {
    return (
      <div style={{
        padding: '12px 16px',
        borderRadius: '8px',
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        color: '#34d399',
        fontSize: '0.84rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Check size={16} />
        <span>Perfil actualizado correctamente.</span>
      </div>
    );
  }

  return null;
};
