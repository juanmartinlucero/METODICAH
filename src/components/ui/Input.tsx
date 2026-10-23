import React, { forwardRef, useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  id: explicitId,
  className = '',
  style,
  disabled,
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = explicitId || generatedId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.80rem',
            fontWeight: 500,
            color: error ? '#f87171' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>{label}</span>
          {props.required && <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {leftIcon && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
              color: 'var(--text-dim)'
            }}
          >
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={`form-input ${className}`.trim()}
          style={{
            paddingLeft: leftIcon ? '38px' : '14px',
            paddingRight: rightIcon ? '38px' : '14px',
            borderColor: error ? 'rgba(239, 68, 68, 0.5)' : undefined,
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
            ...style
          }}
          {...props}
        />

        {rightIcon && (
          <div
            style={{
              position: 'absolute',
              right: '12px',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
              color: 'var(--text-dim)'
            }}
          >
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <span style={{ fontSize: '0.74rem', color: '#f87171', marginTop: '2px' }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
