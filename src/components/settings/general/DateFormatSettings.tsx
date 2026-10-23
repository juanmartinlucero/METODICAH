import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import type { DateFormatPattern } from '../../../types/metodicah';
import { DATE_FORMAT_OPTIONS } from '../../../utils/dateUtils';
import { useDateFormat } from '../../../hooks/useDateFormat';

interface DateFormatSettingsProps {
  currentFormat?: DateFormatPattern;
  onSelectFormat?: (format: DateFormatPattern) => void;
}

export const DateFormatSettings: React.FC<DateFormatSettingsProps> = ({
  currentFormat: propFormat,
  onSelectFormat
}) => {
  const context = useDateFormat();
  const activeFormat = propFormat || context.dateFormat;

  const handleFormatChange = (newFormat: DateFormatPattern) => {
    if (onSelectFormat) {
      onSelectFormat(newFormat);
    }
    context.setDateFormat(newFormat);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={20} color="#f59e0b" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', margin: 0 }}>
            Preferencias Regionales & Formato de Fechas
          </h3>
        </div>
        <span style={{
          fontSize: '0.72rem',
          padding: '3px 8px',
          borderRadius: '20px',
          background: 'rgba(16, 185, 129, 0.12)',
          color: '#10b981',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <CheckCircle2 size={12} />
          <span>Guardado automático</span>
        </span>
      </div>

      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
        Elige cómo deseas visualizar las fechas de producciones, agendas, vencimientos y reportes exportables en todo el sistema METODICAH.
      </p>

      {/* Options Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '12px'
      }}>
        {DATE_FORMAT_OPTIONS.map((option) => {
          const isSelected = activeFormat === option.value;
          return (
            <div
              key={option.value}
              onClick={() => handleFormatChange(option.value)}
              style={{
                cursor: 'pointer',
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: isSelected ? 'rgba(245, 158, 11, 0.6)' : 'var(--border-subtle)',
                background: isSelected ? 'rgba(245, 158, 11, 0.08)' : 'rgba(9, 13, 22, 0.5)',
                transition: 'all 0.16s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.background = 'rgba(9, 13, 22, 0.5)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: isSelected ? '#f59e0b' : '#fff',
                  fontFamily: 'monospace'
                }}>
                  {option.label}
                </span>
                <span style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: isSelected ? '#f59e0b' : 'var(--text-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isSelected ? '#f59e0b' : 'transparent',
                  transition: 'all 0.15s ease'
                }}>
                  {isSelected && (
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0c111c' }} />
                  )}
                </span>
              </div>

              <div style={{
                fontSize: '0.82rem',
                color: isSelected ? '#fff' : 'var(--text-muted)',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>Ejemplo:</span>
                <strong style={{ color: isSelected ? '#f59e0b' : '#fff' }}>{option.example}</strong>
              </div>

              <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', margin: 0, lineHeight: 1.3 }}>
                {option.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

