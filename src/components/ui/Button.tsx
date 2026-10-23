import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const SIZE_STYLES: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    padding: '6px 12px',
    fontSize: '0.80rem',
    borderRadius: '6px',
    gap: '6px',
  },
  md: {
    padding: '9px 16px',
    fontSize: '0.86rem',
    borderRadius: '8px',
    gap: '8px',
  },
  lg: {
    padding: '12px 22px',
    fontSize: '0.95rem',
    borderRadius: '10px',
    gap: '10px',
  }
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  glass: 'glass-card'
};

const VARIANT_FALLBACK_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: {},
  secondary: {},
  ghost: {},
  danger: {
    background: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.35)',
    color: '#f87171',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-main)',
  }
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  style,
  type = 'button',
  ...props
}, ref) => {
  const isDisabled = disabled || isLoading;
  const baseClass = VARIANT_CLASSES[variant] || 'btn-secondary';
  const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.md;
  const variantStyle = VARIANT_FALLBACK_STYLES[variant] || {};

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading ? 'true' : undefined}
      className={`${baseClass} ${className}`.trim()}
      style={{
        ...sizeStyle,
        ...variantStyle,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.65 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={size === 'sm' ? 13 : 16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        leftIcon
      )}
      {children && <span>{children}</span>}
      {!isLoading && rightIcon}
    </button>
  );
});

Button.displayName = 'Button';
