import React from 'react';

export interface SectionGroupHeaderProps {
  title: string;
  count: number;
  unitSingular: string;
  unitPlural: string;
  color?: string;
  style?: React.CSSProperties;
}

export const SectionGroupHeader: React.FC<SectionGroupHeaderProps> = ({
  title,
  count,
  unitSingular,
  unitPlural,
  color = '#f59e0b',
  style
}) => {
  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '4px 6px',
        color: color,
        fontSize: '0.76rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        ...style
      }}
    >
      <span>{title}</span>
      <span 
        style={{
          fontSize: '0.68rem',
          padding: '1px 6px',
          borderRadius: '10px',
          background: `${color}1a`,
          border: `1px solid ${color}40`,
          fontWeight: 600
        }}
      >
        {count} {count === 1 ? unitSingular : unitPlural}
      </span>
      <div style={{ flex: 1, height: '1px', background: `${color}26` }} />
    </div>
  );
};
