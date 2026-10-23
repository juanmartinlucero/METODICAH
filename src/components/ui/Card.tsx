import React, { forwardRef } from 'react';

export type CardVariant = 'glass' | 'panel' | 'solid';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  interactive?: boolean;
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  glass: 'glass-card',
  panel: 'glass-panel',
  solid: 'glass-panel'
};

const VARIANT_STYLES: Record<CardVariant, React.CSSProperties> = {
  glass: {},
  panel: {
    padding: '20px'
  },
  solid: {
    background: 'var(--bg-card-solid)',
    padding: '20px'
  }
};

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'glass',
  interactive = false,
  className = '',
  style,
  children,
  onClick,
  ...props
}, ref) => {
  const isClickable = interactive || Boolean(onClick);
  const baseClass = VARIANT_CLASSES[variant] || 'glass-card';

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`${baseClass} ${className}`.trim()}
      style={{
        ...VARIANT_STYLES[variant],
        cursor: isClickable ? 'pointer' : undefined,
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';
