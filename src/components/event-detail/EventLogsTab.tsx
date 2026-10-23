import React from 'react';
import type { AuditLog } from '../../types/metodicah';
import { FormattedDate } from '../common/FormattedDate';

interface EventLogsTabProps {
  logs: AuditLog[];
}

export const EventLogsTab: React.FC<EventLogsTabProps> = ({
  logs = []
}) => {
  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginBottom: '14px' }}>
        Registro de Trazabilidad del Evento
      </div>
      {logs.length === 0 ? (
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          No hay registros de trazabilidad para este evento aún.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {logs.map(l => (
            <div 
              key={l.id} 
              style={{
                padding: '10px 14px',
                background: 'rgba(12,17,28,0.5)',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.8rem' }}>
                  {l.userName}
                </span>
                <p style={{ color: '#fff', fontSize: '0.82rem', marginTop: '2px' }}>
                  {l.details}
                </p>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                <FormattedDate date={l.timestamp} includeTime={true} fallback={l.timestamp} />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

