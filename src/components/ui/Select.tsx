import React, { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  leftIcon,
  options,
  children,
  id: explicitId,
  className = '',
  style,
  disabled,
  ...props
}, ref) => {
  const generatedId = useId();
  const selectId = explicitId || generatedId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label
          htmlFor={selectId}
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
              color: 'var(--text-dim)',
              zIndex: 1
            }}
          >
            {leftIcon}
          </div>
        )}

        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={`form-select ${className}`.trim()}
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            paddingLeft: leftIcon ? '38px' : '14px',
            paddingRight: '36px',
            borderColor: error ? 'rgba(239, 68, 68, 0.5)' : undefined,
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
            ...style
          }}
          {...props}
        >
          {options ? options.map(opt => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          )) : children}
        </select>

        <div
          style={{
            position: 'absolute',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
            color: 'var(--text-muted)'
          }}
        >
          <ChevronDown size={15} />
        </div>
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

Select.displayName = 'Select';
