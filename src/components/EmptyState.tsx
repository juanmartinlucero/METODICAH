import React from 'react';
import { Button } from './ui';

interface EmptyStateProps {
  icon: React.ComponentType<{ size?: number | string; color?: string; style?: React.CSSProperties }>;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ComponentType<{ size?: number | string; color?: string }>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon
}) => {
  return (
    <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
      <Icon size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px auto' }} />
      
      <h4 style={{ fontSize: '1rem', color: '#fff', fontWeight: 500, marginBottom: '6px' }}>
        {title}
      </h4>

      {description && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', maxWidth: '420px', margin: '0 auto 18px auto' }}>
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onAction}
          leftIcon={ActionIcon ? <ActionIcon size={14} /> : undefined}
          style={{ margin: '0 auto' }}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
