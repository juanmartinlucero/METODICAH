import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Check } from 'lucide-react';
import type { EventCrewMember } from '../../../types/metodicah';
import type { EventFormData } from './eventSchema';

interface EventScopeCrewFieldsProps {
  configuredScopes: string[];
  crewMembers: EventCrewMember[];
}

export const EventScopeCrewFields: React.FC<EventScopeCrewFieldsProps> = ({
  configuredScopes,
  crewMembers
}) => {
  const { watch, setValue } = useFormContext<EventFormData>();
  const selectedScopes = watch('scope') || [];
  const selectedCrewIds = watch('crewIds') || [];

  const toggleScope = (scopeItem: string) => {
    if (selectedScopes.includes(scopeItem)) {
      setValue('scope', selectedScopes.filter(s => s !== scopeItem));
    } else {
      setValue('scope', [...selectedScopes, scopeItem]);
    }
  };

  const toggleCrew = (userId: string) => {
    if (selectedCrewIds.includes(userId)) {
      setValue('crewIds', selectedCrewIds.filter(id => id !== userId));
    } else {
      setValue('crewIds', [...selectedCrewIds, userId]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        3. Alcance Técnico (Scope) & Equipo Asignado
      </div>

      {/* 10. Scope Selector */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Alcance Técnico (Scope)
          </label>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            {selectedScopes.length} seleccionado{selectedScopes.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Configured Scopes Chips */}
        {configuredScopes.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {configuredScopes.map(sc => {
              const isSelected = selectedScopes.includes(sc);
              return (
                <button
                  type="button"
                  key={sc}
                  onClick={() => toggleScope(sc)}
                  className={isSelected ? 'btn-secondary' : 'btn-ghost'}
                  style={{
                    fontSize: '0.76rem',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    border: isSelected ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid var(--border-subtle)',
                    color: isSelected ? '#f59e0b' : 'var(--text-muted)',
                    background: isSelected ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.02)'
                  }}
                >
                  {isSelected && <Check size={12} style={{ marginRight: '4px' }} />}
                  {sc}
                </button>
              );
            })}
          </div>
        ) : (
          <div style={{
            padding: '12px 14px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '6px',
            border: '1px dashed var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-dim)'
          }}>
            No has registrado alcances en la sección de Configuración. Define los alcances de tu productora desde Configuración para seleccionarlos aquí.
          </div>
        )}
      </div>

      {/* 11. Crew Selector */}
      <div>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
          Equipo Asignado (Crew)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
          {crewMembers.map(member => {
            const isAssigned = selectedCrewIds.includes(member.userId);
            return (
              <div
                key={member.id}
                onClick={() => toggleCrew(member.userId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: isAssigned ? 'rgba(245, 158, 11, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: isAssigned ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-subtle)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: isAssigned ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
                  color: isAssigned ? '#000' : '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {member.userName.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  <p style={{ fontSize: '0.78rem', fontWeight: 500, color: isAssigned ? '#fff' : 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', margin: 0 }}>
                    {member.userName}
                  </p>
                  <span style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>
                    {member.roleInEvent}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
