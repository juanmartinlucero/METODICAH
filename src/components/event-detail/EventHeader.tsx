import React from 'react';
import type { EventItem, EventStageConfig } from '../../types/metodicah';
import { 
  ArrowLeft, 
  Clock, 
  History, 
  Download, 
  Calendar, 
  MapPin, 
  Building2, 
  Layers,
  ChevronDown
} from 'lucide-react';
import { FormattedDate } from '../common/FormattedDate';


export type EventSubTab = 'overview' | 'timing' | 'logs';

interface EventHeaderProps {
  event: EventItem;
  stages?: EventStageConfig[];
  activeSubTab: EventSubTab;
  setActiveSubTab: (tab: EventSubTab) => void;
  onBack: () => void;
  onExportPDF: () => void;
  onUpdateEventStage?: (eventId: string, stageId: string) => void;
  timingsCount: number;
  logsCount: number;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  event,
  stages = [],
  activeSubTab,
  setActiveSubTab,
  onBack,
  onExportPDF,
  onUpdateEventStage,
  timingsCount,
  logsCount
}) => {
  const currentStage = stages.find(s => s.id === event.stageId) || {
    id: event.stageId || 'backlog',
    label: event.stageId || 'Backlog',
    color: '#94a3b8'
  };

  return (
    <div className="glass-panel" style={{ padding: '22px 28px' }}>
      <button 
        onClick={onBack} 
        className="btn-ghost" 
        style={{ padding: '6px 0', fontSize: '0.82rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        <ArrowLeft size={16} />
        <span>Volver a Producciones</span>
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontFamily: 'monospace', color: '#f59e0b', fontWeight: 700, fontSize: '0.88rem' }}>
              {event.code}
            </span>

            {/* Stage selector dropdown badge with ChevronDown indicator */}
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: 600,
                background: `${currentStage.color}15`,
                border: `1px solid ${currentStage.color}40`,
                color: currentStage.color,
                cursor: 'pointer'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: currentStage.color }} />
                {currentStage.label}
                <ChevronDown size={13} style={{ opacity: 0.85, marginLeft: '1px' }} />
              </span>

              {onUpdateEventStage && stages.length > 0 && (
                <select
                  value={event.stageId}
                  onChange={(e) => onUpdateEventStage(event.id, e.target.value)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                  title="Cambiar etapa del evento"
                >
                  {stages.map(st => (
                    <option key={st.id} value={st.id}>{st.label}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
            {event.title}
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Building2 size={14} color="var(--text-dim)" />
              Cliente: <strong style={{ color: '#fff' }}>{event.clientName}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={14} color="var(--text-dim)" />
              {event.venue ? `${event.venue} · ${event.location}` : event.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={14} color="var(--text-dim)" />
              <FormattedDate date={event.date} /> ({event.timeRange?.startTime} - {event.timeRange?.endTime} hs)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
              <Clock size={13} color="var(--text-dim)" />
              Última actualización: <strong style={{ color: 'var(--text-muted)', fontWeight: 500 }}><FormattedDate date={event.updatedAt || event.createdAt} fallback="Hoy" /></strong>
            </span>

          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={onExportPDF} className="btn-secondary" style={{ fontSize: '0.82rem', padding: '8px 14px' }}>
            <Download size={15} />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '6px',
        marginTop: '22px',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '14px',
        overflowX: 'auto'
      }}>
        <button 
          onClick={() => setActiveSubTab('overview')}
          className={activeSubTab === 'overview' ? 'btn-primary' : 'btn-ghost'}
          style={{ fontSize: '0.82rem', padding: '7px 14px' }}
        >
          <Layers size={15} />
          <span>Ficha Técnica & Overview</span>
        </button>

        <button 
          onClick={() => setActiveSubTab('timing')}
          className={activeSubTab === 'timing' ? 'btn-primary' : 'btn-ghost'}
          style={{ fontSize: '0.82rem', padding: '7px 14px' }}
        >
          <Clock size={15} />
          <span>Timing Sectorizado ({timingsCount})</span>
        </button>

        <button 
          onClick={() => setActiveSubTab('logs')}
          className={activeSubTab === 'logs' ? 'btn-primary' : 'btn-ghost'}
          style={{ fontSize: '0.82rem', padding: '7px 14px' }}
        >
          <History size={15} />
          <span>Audit Logs ({logsCount})</span>
        </button>
      </div>
    </div>
  );
};
