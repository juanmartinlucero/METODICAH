import React from 'react';

export type BadgeVariant = 
  | 'amber' | 'blue' | 'emerald' | 'red' | 'purple' | 'slate' | 'default'
  | 'warning' | 'info' | 'success' | 'danger' | 'primary';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  color?: string; // Color personalizado para etapas o categorías dinámicas
  children: React.ReactNode;
}

const VARIANT_CONFIGS: Record<BadgeVariant, { bg: string; border: string; text: string; dot: string }> = {
  amber: {
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.25)',
    text: '#fbbf24',
    dot: '#f59e0b',
  },
  blue: {
    bg: 'rgba(59, 130, 246, 0.08)',
    border: 'rgba(59, 130, 246, 0.25)',
    text: '#60a5fa',
    dot: '#3b82f6',
  },
  emerald: {
    bg: 'rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.25)',
    text: '#34d399',
    dot: '#10b981',
  },
  red: {
    bg: 'rgba(239, 68, 68, 0.08)',
    border: 'rgba(239, 68, 68, 0.25)',
    text: '#f87171',
    dot: '#ef4444',
  },
  purple: {
    bg: 'rgba(139, 92, 246, 0.08)',
    border: 'rgba(139, 92, 246, 0.25)',
    text: '#a78bfa',
    dot: '#8b5cf6',
  },
  slate: {
    bg: 'rgba(148, 163, 184, 0.08)',
    border: 'rgba(148, 163, 184, 0.20)',
    text: '#94a3b8',
    dot: '#64748b',
  },
  default: {
    bg: 'rgba(255, 255, 255, 0.05)',
    border: 'var(--border-subtle)',
    text: 'var(--text-main)',
    dot: 'var(--text-muted)',
  },
  // Semantic Aliases
  warning: {
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.25)',
    text: '#fbbf24',
    dot: '#f59e0b',
  },
  info: {
    bg: 'rgba(59, 130, 246, 0.08)',
    border: 'rgba(59, 130, 246, 0.25)',
    text: '#60a5fa',
    dot: '#3b82f6',
  },
  success: {
    bg: 'rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.25)',
    text: '#34d399',
    dot: '#10b981',
  },
  danger: {
    bg: 'rgba(239, 68, 68, 0.08)',
    border: 'rgba(239, 68, 68, 0.25)',
    text: '#f87171',
    dot: '#ef4444',
  },
  primary: {
    bg: 'rgba(139, 92, 246, 0.08)',
    border: 'rgba(139, 92, 246, 0.25)',
    text: '#a78bfa',
    dot: '#8b5cf6',
  }
};

const SIZE_STYLES: Record<BadgeSize, { padding: string; fontSize: string; dotSize: string }> = {
  sm: {
    padding: '2px 7px',
    fontSize: '0.68rem',
    dotSize: '4px'
  },
  md: {
    padding: '3px 9px',
    fontSize: '0.74rem',
    dotSize: '5px'
  }
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  dot = false,
  color,
  children,
  className = '',
  style,
  ...props
}) => {
  const sizeConfig = SIZE_STYLES[size] || SIZE_STYLES.md;
  const variantConfig = VARIANT_CONFIGS[variant] || VARIANT_CONFIGS.default;

  // Si se pasa un color personalizado dinámico (ej: `#f59e0b`)
  const dynamicStyle: React.CSSProperties = color ? {
    background: `${color}15`,
    borderColor: `${color}40`,
    color: color
  } : {
    background: variantConfig.bg,
    borderColor: variantConfig.border,
    color: variantConfig.text
  };

  const dotColor = color || variantConfig.dot;

  return (
    <span
      className={`badge ${className}`.trim()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: sizeConfig.padding,
        fontSize: sizeConfig.fontSize,
        fontWeight: 600,
        borderRadius: '6px',
        border: '1px solid',
        lineHeight: 1.2,
        letterSpacing: '0.02em',
        ...dynamicStyle,
        ...style
      }}
      {...props}
    >
      {dot && (
        <span
          style={{
            width: sizeConfig.dotSize,
            height: sizeConfig.dotSize,
            borderRadius: '50%',
            background: dotColor,
            flexShrink: 0
          }}
        />
      )}
      {children}
    </span>
  );
};
