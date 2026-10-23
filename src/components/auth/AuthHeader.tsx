import React from 'react';

export interface AuthHeaderProps {
  title: string;
  subtitle: string;
  badgeText?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  badgeText
}) => {
  return (
    <div style={{ marginBottom: '22px', textAlign: 'center' }}>
      {badgeText && (
        <span
          style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: '12px',
            fontSize: '0.68rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            background: 'rgba(245, 158, 11, 0.1)',
            color: '#f59e0b',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            marginBottom: '10px'
          }}
        >
          {badgeText}
        </span>
      )}
      <h2
        style={{
          fontSize: '1.45rem',
          fontWeight: 700,
          color: '#fff',
          margin: 0,
          letterSpacing: '-0.02em',
          fontFamily: 'var(--font-heading)'
        }}
      >
        {title}
      </h2>
      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.84rem',
          marginTop: '6px',
          marginBottom: 0,
          lineHeight: 1.45
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};
