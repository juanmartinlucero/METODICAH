import React, { useEffect } from 'react';
import { useForm, FormProvider, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { BaseModal } from '@/components/common/BaseModal';
import { useEventsStore, useClientsStore, useCrewStore, useSettingsStore } from '@/stores';
import {
  eventFormSchema,
  type EventFormData,
  EventIdentityFields,
  EventDatesFields,
  EventScopeCrewFields,
  EventConceptFields
} from './events/form';

import { Button } from '@/components/ui';
import { formatDate } from '@/utils/dateUtils';

export interface NewEventModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const getDefaultEventValues = (initialClientId: string, defaultClientId: string, defaultCrewId: string): EventFormData => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  const defaultDate = formatDate(d, 'YYYY-MM-DD');

  return {
    title: '',
    clientId: initialClientId || defaultClientId || '',
    concept: '',
    venue: '',
    location: '',
    date: defaultDate,
    startTime: '18:00',
    endTime: '23:30',
    attendeesCount: '',
    scoutingDate: '',
    deployDate: '',
    scope: [],
    crewIds: defaultCrewId ? [defaultCrewId] : ['usr_01'],
    summary: '',
    thirdParties: [],
    clientPreferences: []
  };
};

export const NewEventModal: React.FC<NewEventModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose
}) => {
  const clients = useClientsStore(s => s.clients);
  const configuredScopes = useSettingsStore(s => s.configuredScopes);
  const storeCrew = useCrewStore(s => s.crewMembers);
  const initialClientId = useEventsStore(s => s.preselectedClientId);
  const onCreateEvent = useEventsStore(s => s.createEvent);
  const storeCloseModal = useEventsStore(s => s.closeNewEventModal);
  const storeIsOpen = useEventsStore(s => s.isNewEventModalOpen);

  const isOpen = propIsOpen !== undefined ? propIsOpen : storeIsOpen;
  const onClose = propOnClose ?? storeCloseModal;

  const crewMembers = storeCrew;
  const toast = useToast();

  const methods = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: getDefaultEventValues(
      initialClientId || '',
      clients[0]?.id || '',
      crewMembers[0]?.userId || 'usr_01'
    )
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultEventValues(
        initialClientId || '',
        clients[0]?.id || '',
        crewMembers[0]?.userId || 'usr_01'
      ));
    }
  }, [isOpen, initialClientId, clients, crewMembers, reset]);

  const onValidSubmit = (data: EventFormData) => {
    const selectedClient = clients.find(c => c.id === data.clientId);
    const clientDisplayName = selectedClient 
      ? (selectedClient.clientType === 'persona' 
          ? selectedClient.name 
          : (selectedClient.fantasyName || selectedClient.company || selectedClient.name))
      : 'Cliente General';

    onCreateEvent({
      title: data.title.trim(),
      date: data.date,
      venue: data.venue.trim(),
      location: data.location.trim(),
      clientId: data.clientId,
      clientName: clientDisplayName,
      timeRange: {
        startTime: data.startTime,
        endTime: data.endTime
      },
      attendeesCount: data.attendeesCount ? parseInt(data.attendeesCount, 10) : undefined,
      scoutingDate: data.scoutingDate || undefined,
      deployDate: data.deployDate || undefined,
      scope: data.scope,
      crewIds: data.crewIds,
      summary: data.summary?.trim() || undefined,
      thirdPartiesInvolved: data.thirdParties.length > 0 ? data.thirdParties : undefined,
      clientPreferences: data.clientPreferences.length > 0 ? data.clientPreferences : undefined,
      concept: data.concept?.trim() || undefined,
      stageId: 'backlog'
    });

    onClose();
  };

  const onInvalidSubmit = (errors: FieldErrors<EventFormData>) => {
    const firstKey = Object.keys(errors)[0] as keyof EventFormData | undefined;
    if (firstKey && errors[firstKey]?.message) {
      toast.warning(String(errors[firstKey]?.message));
    } else {
      toast.warning('Por favor completa todos los campos obligatorios marcados con *');
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Producción"
      subtitle="Ficha técnica y operativa de registro de evento en METODICAH"
      icon={<Sparkles size={18} />}
      maxWidth="840px"
    >
      <FormProvider {...methods}>
        <form 
          onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)} 
          style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}
        >
          <EventIdentityFields clients={clients} />
          <EventDatesFields />
          <EventScopeCrewFields configuredScopes={configuredScopes} crewMembers={crewMembers} />
          <EventConceptFields />

          {/* Modal Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
            marginTop: '8px'
          }}>
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" size="md">
              Crear Producción
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseModal>
  );
};
