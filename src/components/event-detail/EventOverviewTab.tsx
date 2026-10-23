import React, { useState } from 'react';
import type { EventItem, EventCrewMember, Client } from '../../types/metodicah';
import { Edit3 } from 'lucide-react';
import { FormattedDate } from '../common/FormattedDate';
import { EventOverviewEditForm } from './EventOverviewEditForm';

interface EventOverviewTabProps {
  event: EventItem;
  crewMembers?: EventCrewMember[];
  clients?: Client[];
  configuredScopes?: string[];
  onUpdateEvent?: (updatedEvent: EventItem) => void;
}

export const EventOverviewTab: React.FC<EventOverviewTabProps> = ({
  event,
  crewMembers = [],
  clients = [],
  configuredScopes = [],
  onUpdateEvent
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const assignedCrew = crewMembers.filter(c => event.crewIds?.includes(c.userId));

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  // -------------------------------------------------------------
  // EDIT MODE VIEW (Standardized with RHF & Zod via EventOverviewEditForm)
  // -------------------------------------------------------------
  if (isEditing) {
    return (
      <EventOverviewEditForm
        event={event}
        clients={clients}
        crewMembers={crewMembers}
        configuredScopes={configuredScopes}
        onSave={(updatedEvent) => {
          if (onUpdateEvent) {
            onUpdateEvent(updatedEvent);
          }
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // -------------------------------------------------------------
  // READ-ONLY VIEW (WITH EDIT BUTTON & QUICK COMPLETION TRIGGERS)
  // -------------------------------------------------------------
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Overview Top Header with Edit Trigger */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>
            Ficha Técnica & Datos Maestros
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Estructura operativa de los 15 campos del evento.
          </p>
        </div>

        <button
          onClick={handleStartEditing}
          className="btn-secondary"
          style={{
            fontSize: '0.82rem',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            borderColor: 'rgba(245, 158, 11, 0.4)',
            color: '#f59e0b'
          }}
        >
          <Edit3 size={15} />
          <span>Editar Ficha Técnica</span>
        </button>
      </div>

      {/* 1. Key Metric Highlights Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        <div className="glass-card">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
            Fecha del Evento & Horario
          </span>
          <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', marginTop: '6px' }}>
            <FormattedDate date={event.date} />
          </p>
          <span style={{ fontSize: '0.76rem', color: '#f59e0b' }}>
            {event.timeRange?.startTime} a {event.timeRange?.endTime} hs
          </span>
        </div>

        <div className="glass-card" onClick={handleStartEditing} style={{ cursor: 'pointer' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
            Aforo / Asistentes
          </span>
          <p style={{ fontSize: '1.05rem', fontWeight: 600, color: event.attendeesCount ? '#fff' : 'var(--text-dim)', marginTop: '6px' }}>
            {event.attendeesCount ? `${event.attendeesCount.toLocaleString('es-AR')} personas` : '+ Agregar aforo'}
          </p>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
            Capacidad esperada
          </span>
        </div>

        <div className="glass-card" onClick={handleStartEditing} style={{ cursor: 'pointer' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
            Fecha de Scouting (Técnico)
          </span>
          <p style={{ fontSize: '1.05rem', fontWeight: 600, color: event.scoutingDate ? '#fff' : 'var(--text-dim)', marginTop: '6px' }}>
            <FormattedDate date={event.scoutingDate} fallback="+ Programar scouting" />
          </p>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
            Reconocimiento de venue
          </span>
        </div>

        <div className="glass-card" onClick={handleStartEditing} style={{ cursor: 'pointer' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
            Fecha de Deploy (Presupuesto)
          </span>
          <p style={{ fontSize: '1.05rem', fontWeight: 600, color: event.deployDate ? '#fff' : 'var(--text-dim)', marginTop: '6px' }}>
            <FormattedDate date={event.deployDate} fallback="+ Fijar fecha deploy" />
          </p>
          <span style={{ fontSize: '0.76rem', color: '#10b981' }}>
            Envío de cotización
          </span>
        </div>

      </div>

      {/* 2. Concept & Summary */}
      {(event.concept || event.summary) ? (
        <div className="glass-panel" style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {event.concept && (
            <div>
              <span style={{ fontSize: '0.74rem', color: '#f59e0b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Concepto Creativo / Temática
              </span>
              <p style={{ fontSize: '1.02rem', color: '#fff', fontWeight: 500, marginTop: '4px', fontStyle: 'italic' }}>
                "{event.concept}"
              </p>
            </div>
          )}

          {event.summary && (
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>
                Resumen Ejecutivo del Proyecto
              </span>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                {event.summary}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div 
          onClick={handleStartEditing}
          className="glass-panel" 
          style={{ padding: '18px 24px', cursor: 'pointer', border: '1px dashed var(--border-subtle)', textAlign: 'center' }}
        >
          <p style={{ fontSize: '0.84rem', color: '#f59e0b' }}>
            + Agregar Concepto Creativo y Resumen del Proyecto
          </p>
        </div>
      )}

      {/* 3. Scopes & Assigned Crew */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        
        {/* Scope */}
        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
              Alcance Técnico Registrado (Scope)
            </span>
            <button onClick={handleStartEditing} style={{ background: 'none', border: 'none', color: '#f59e0b', fontSize: '0.74rem', cursor: 'pointer' }}>
              Editar
            </button>
          </div>
          {event.scope && event.scope.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {event.scope.map((sc, idx) => (
                <span 
                  key={idx}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    color: '#f59e0b',
                    fontSize: '0.78rem',
                    fontWeight: 500
                  }}
                >
                  ✓ {sc}
                </span>
              ))}
            </div>
          ) : (
            <p onClick={handleStartEditing} style={{ fontSize: '0.82rem', color: '#f59e0b', cursor: 'pointer' }}>
              + Asignar alcances técnicos al evento
            </p>
          )}
        </div>

        {/* Crew */}
        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
              Equipo Asignado (Crew)
            </span>
            <button onClick={handleStartEditing} style={{ background: 'none', border: 'none', color: '#f59e0b', fontSize: '0.74rem', cursor: 'pointer' }}>
              Editar
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {assignedCrew.length > 0 ? (
              assignedCrew.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)' }}>
                  {c.avatarUrl ? (
                    <img 
                      src={c.avatarUrl} 
                      alt={c.userName} 
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: '#f59e0b',
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getInitials(c.userName)}
                    </div>
                  )}
                  <div>
                    <p style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 500 }}>{c.userName}</p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{c.roleInEvent}</span>
                  </div>
                </div>
              ))
            ) : (
              <p onClick={handleStartEditing} style={{ fontSize: '0.82rem', color: '#f59e0b', cursor: 'pointer' }}>
                + Asignar miembros de equipo técnico
              </p>
            )}
          </div>
        </div>

      </div>

      {/* 4. Bullet Items: Client Preferences & Third Parties Involved */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        
        {/* Client Preferences */}
        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#93c5fd' }}>
              Client Preferences (Requerimientos & Preferencias)
            </span>
            <button onClick={handleStartEditing} style={{ background: 'none', border: 'none', color: '#93c5fd', fontSize: '0.74rem', cursor: 'pointer' }}>
              Editar
            </button>
          </div>
          {event.clientPreferences && event.clientPreferences.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {event.clientPreferences.map((pref, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(59, 130, 246, 0.06)',
                    border: '1px solid rgba(59, 130, 246, 0.15)',
                    borderRadius: '6px',
                    color: '#bfdbfe',
                    fontSize: '0.82rem',
                    lineHeight: 1.4
                  }}
                >
                  • {pref}
                </div>
              ))}
            </div>
          ) : (
            <p onClick={handleStartEditing} style={{ fontSize: '0.82rem', color: '#93c5fd', cursor: 'pointer' }}>
              + Agregar requerimientos o preferencias del cliente
            </p>
          )}
        </div>

        {/* Third Parties Involved */}
        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6ee7b7' }}>
              Third Parties Involved (Sponsors, Agencias & Entes)
            </span>
            <button onClick={handleStartEditing} style={{ background: 'none', border: 'none', color: '#6ee7b7', fontSize: '0.74rem', cursor: 'pointer' }}>
              Editar
            </button>
          </div>
          {event.thirdPartiesInvolved && event.thirdPartiesInvolved.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {event.thirdPartiesInvolved.map((tp, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(16, 185, 129, 0.06)',
                    border: '1px solid rgba(16, 185, 129, 0.15)',
                    borderRadius: '6px',
                    color: '#a7f3d0',
                    fontSize: '0.82rem',
                    lineHeight: 1.4
                  }}
                >
                  • {tp}
                </div>
              ))}
            </div>
          ) : (
            <p onClick={handleStartEditing} style={{ fontSize: '0.82rem', color: '#6ee7b7', cursor: 'pointer' }}>
              + Agregar sponsors, agencias o terceros involucrados
            </p>
          )}
        </div>

      </div>

    </div>
  );
};
