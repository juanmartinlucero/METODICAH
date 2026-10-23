import React from 'react';

export interface DynamicCalendarIconProps {
  day: string;
  size?: number;
  frameColor?: string;
  numberColor?: string;
}

export const DynamicCalendarIcon: React.FC<DynamicCalendarIconProps> = ({
  day,
  size = 18,
  frameColor = 'var(--text-muted)',
  numberColor = 'var(--text-main)'
}) => {
  const strokeWidth = Number((36 / size).toFixed(2));

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={frameColor}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'block' }}
    >
      <path d="M8 2v3" />
      <path d="M16 2v3" />
      <rect width="18" height="17.5" x="3" y="4.5" rx="3" />
      <text
        x="12"
        y="13.2"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12"
        fontWeight="700"
        fill={numberColor}
        stroke="none"
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          letterSpacing: '-0.02em'
        }}
      >
        {day}
      </text>
    </svg>
  );
};
