import React, { forwardRef, useId } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  id: explicitId,
  className = '',
  style,
  disabled,
  rows = 3,
  ...props
}, ref) => {
  const generatedId = useId();
  const textareaId = explicitId || generatedId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label
          htmlFor={textareaId}
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

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className={`form-input ${className}`.trim()}
        style={{
          padding: '10px 14px',
          borderColor: error ? 'rgba(239, 68, 68, 0.5)' : undefined,
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
          resize: 'vertical',
          ...style
        }}
        {...props}
      />

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

Textarea.displayName = 'Textarea';
