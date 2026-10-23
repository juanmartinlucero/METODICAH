import React from 'react';
import { useForm, FormProvider, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit3, Check, X } from 'lucide-react';
import type { EventItem, EventCrewMember, Client } from '../../types/metodicah';
import { eventFormSchema, type EventFormData } from '../events/form/eventSchema';
import { EventIdentityFields } from '../events/form/EventIdentityFields';
import { EventDatesFields } from '../events/form/EventDatesFields';
import { EventScopeCrewFields } from '../events/form/EventScopeCrewFields';
import { EventConceptFields } from '../events/form/EventConceptFields';
import { useToast } from '../../hooks/useToast';

interface EventOverviewEditFormProps {
  event: EventItem;
  clients: Client[];
  crewMembers: EventCrewMember[];
  configuredScopes: string[];
  onSave: (updatedEvent: EventItem) => void;
  onCancel: () => void;
}

export const EventOverviewEditForm: React.FC<EventOverviewEditFormProps> = ({
  event,
  clients,
  crewMembers,
  configuredScopes,
  onSave,
  onCancel
}) => {
  const toast = useToast();

  const methods = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: event.title || '',
      clientId: event.clientId || '',
      venue: event.venue || '',
      location: event.location || '',
      date: event.date || '',
      startTime: event.timeRange?.startTime || '08:00',
      endTime: event.timeRange?.endTime || '23:00',
      attendeesCount: event.attendeesCount ? String(event.attendeesCount) : '',
      scoutingDate: event.scoutingDate || '',
      deployDate: event.deployDate || '',
      concept: event.concept || '',
      summary: event.summary || '',
      scope: event.scope || [],
      crewIds: event.crewIds || [],
      clientPreferences: event.clientPreferences || [],
      thirdParties: event.thirdPartiesInvolved || []
    }
  });

  const { handleSubmit, formState: { isSubmitting } } = methods;

  const onValidSubmit = (data: EventFormData) => {
    const selectedClient = clients.find(c => c.id === data.clientId);
    let clientDisplayName = event.clientName;
    if (selectedClient) {
      clientDisplayName = selectedClient.clientType === 'persona'
        ? selectedClient.name
        : (selectedClient.fantasyName || selectedClient.company || selectedClient.name);
    }

    const updated: EventItem = {
      ...event,
      title: data.title.trim(),
      clientId: data.clientId,
      clientName: clientDisplayName,
      venue: data.venue.trim(),
      location: data.location.trim(),
      date: data.date,
      timeRange: {
        startTime: data.startTime,
        endTime: data.endTime
      },
      attendeesCount: data.attendeesCount ? parseInt(data.attendeesCount, 10) : undefined,
      scoutingDate: data.scoutingDate || undefined,
      deployDate: data.deployDate || undefined,
      concept: data.concept?.trim() || undefined,
      summary: data.summary?.trim() || undefined,
      scope: data.scope,
      crewIds: data.crewIds,
      clientPreferences: data.clientPreferences.length > 0 ? data.clientPreferences : undefined,
      thirdPartiesInvolved: data.thirdParties.length > 0 ? data.thirdParties : undefined,
      updatedAt: new Date().toISOString()
    };

    onSave(updated);
    toast.success('Ficha técnica actualizada exitosamente.');
  };

  const onInvalidSubmit = (errors: FieldErrors<EventFormData>) => {
    const firstKey = Object.keys(errors)[0] as keyof EventFormData | undefined;
    if (firstKey && errors[firstKey]?.message) {
      toast.warning(String(errors[firstKey]?.message));
    } else {
      toast.warning('Por favor completa todos los campos requeridos marcados con *');
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        
        {/* Edit Toolbar Header */}
        <div className="glass-panel" style={{
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          background: 'rgba(245, 158, 11, 0.03)'
        }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Edit3 size={16} /> Editando Ficha Técnica Completa
            </span>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Modifica los 15 campos del evento con validación de esquema en tiempo real.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onCancel}
              className="btn-ghost"
              style={{ fontSize: '0.82rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <X size={15} />
              <span>Cancelar</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ fontSize: '0.82rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Check size={15} />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </div>

        {/* Modular Subcomponents */}
        <div className="glass-panel" style={{ padding: '22px 26px' }}>
          <EventIdentityFields clients={clients} />
        </div>

        <div className="glass-panel" style={{ padding: '22px 26px' }}>
          <EventDatesFields />
        </div>

        <div className="glass-panel" style={{ padding: '22px 26px' }}>
          <EventScopeCrewFields configuredScopes={configuredScopes} crewMembers={crewMembers} />
        </div>

        <div className="glass-panel" style={{ padding: '22px 26px' }}>
          <EventConceptFields />
        </div>

        {/* Bottom Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px' }}>
          <button type="button" onClick={onCancel} className="btn-ghost" style={{ fontSize: '0.84rem', padding: '8px 18px' }}>
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ fontSize: '0.84rem', padding: '8px 22px' }}>
            Guardar Ficha Técnica
          </button>
        </div>

      </form>
    </FormProvider>
  );
};
