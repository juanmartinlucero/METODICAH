import React from 'react';
import { Card } from '@/components/ui';

interface KPICardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ComponentType<{ size?: number | string; color?: string; className?: string; style?: React.CSSProperties }>;
  valueColor?: string;
  iconColor?: string;
  onClick?: () => void;
  accentBorder?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  valueColor = '#ffffff',
  iconColor = 'var(--text-dim)',
  onClick,
  accentBorder = false
}) => {
  const isClickable = Boolean(onClick);

  return (
    <Card
      onClick={onClick}
      interactive={isClickable}
      className="metric-card"
      style={{
        borderColor: accentBorder ? 'rgba(245, 158, 11, 0.25)' : undefined
      }}
    >
      {/* Top Row: Title & Icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span className="metric-card-label">
          {title}
        </span>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          background: 'rgba(255, 255, 255, 0.02)',
          flexShrink: 0
        }}>
          <Icon size={16} color={iconColor} />
        </div>
      </div>

      {/* Metric Value */}
      <div className="metric-card-value" style={{ color: valueColor, fontSize: '1.9rem', lineHeight: 1 }}>
        {value}
      </div>

      {/* Subtitle / Context Note */}
      {subtitle && (
        <div className="metric-card-subtext" style={{ marginTop: '8px' }}>
          {subtitle}
        </div>
      )}
    </Card>
  );
};
