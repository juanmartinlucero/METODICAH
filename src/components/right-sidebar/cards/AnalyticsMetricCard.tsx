import React from 'react';
import { Card } from '@/components/ui';

export interface AnalyticsMetricCardProps {
  label?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  value?: React.ReactNode;
  valueColor?: string;
  subtitle?: React.ReactNode;
  statusDotColor?: string;
  topRightContent?: React.ReactNode;
  progressBar?: {
    percentage: number;
    color?: string;
  };
  children?: React.ReactNode;
}

export const AnalyticsMetricCard: React.FC<AnalyticsMetricCardProps> = ({
  label,
  icon,
  iconColor,
  value,
  valueColor = '#fff',
  subtitle,
  statusDotColor,
  topRightContent,
  progressBar,
  children
}) => {
  return (
    <Card 
      variant="glass"
      style={{
        background: 'rgba(14, 19, 31, 0.65)',
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        borderRadius: '9px'
      }}
    >
      {(label || statusDotColor || topRightContent || icon) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: iconColor || 'var(--text-muted)' }}>
            {icon}
            {label && (
              <span style={{ fontSize: '0.68rem', fontWeight: icon ? 600 : 400, textTransform: icon ? 'uppercase' : 'none', letterSpacing: icon ? '0.04em' : 'normal' }}>
                {label}
              </span>
            )}
          </div>
          {statusDotColor && (
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusDotColor }} />
          )}
          {topRightContent}
        </div>
      )}

      {value && (
        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: valueColor, lineHeight: 1.3 }}>
          {value}
        </div>
      )}

      {progressBar && (
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden', marginTop: '2px' }}>
          <div 
            style={{ 
              width: `${Math.min(100, Math.max(0, progressBar.percentage))}%`, 
              height: '100%', 
              background: progressBar.color || '#f59e0b',
              borderRadius: '2px'
            }} 
          />
        </div>
      )}

      {subtitle && (
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: 1.3 }}>
          {subtitle}
        </div>
      )}

      {children}
    </Card>
  );
};
