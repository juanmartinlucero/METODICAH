import React from 'react';
import type { Client, EventItem } from '@/types/metodicah';
import { 
  Building2, 
  User, 
  Edit3, 
  MessageCircle, 
  CalendarPlus, 
  Calendar, 
  ChevronRight
} from 'lucide-react';
import { getWhatsAppLink } from '@/utils/clientUtils';
import { FormattedDate } from '@/components/common/FormattedDate';
import { BaseModal } from '@/components/common/BaseModal';
import { Button, Badge, Card } from '@/components/ui';

interface ClientDetailModalProps {
  client: Client | null;
  events?: EventItem[];
  onClose: () => void;
  onEdit: (client: Client) => void;
  onSelectEvent?: (event: EventItem) => void;
  onCreateEvent?: (client: Client) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  events = [],
  onClose,
  onEdit,
  onSelectEvent,
  onCreateEvent
}) => {
  if (!client) return null;

  const isEmpresa = (client.clientType || (client.company ? 'empresa' : 'persona')) === 'empresa';
  const displayName = isEmpresa ? (client.fantasyName || client.company || client.name) : client.name;
  const waLink = getWhatsAppLink(client.phone, isEmpresa ? client.name : displayName);

  // Filter associated events
  const associatedEvents = events.filter(e => {
    if (e.clientId && e.clientId === client.id) return true;
    if (client.company && e.clientName?.toLowerCase() === client.company.toLowerCase()) return true;
    if (client.fantasyName && e.clientName?.toLowerCase() === client.fantasyName.toLowerCase()) return true;
    if (e.clientName?.toLowerCase() === client.name.toLowerCase()) return true;
    return false;
  });

  return (
    <BaseModal
      isOpen={!!client}
      onClose={onClose}
      title={displayName}
      subtitle={isEmpresa ? `Razón Social: ${client.company}` : 'Cliente Particular'}
      icon={isEmpresa ? <Building2 size={20} /> : <User size={20} />}
      maxWidth="680px"
      footer={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%'
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Fecha de Alta: <FormattedDate date={client.createdAt} fallback="Sin fecha registrada" /> · {associatedEvents.length || client.activeEventsCount || 0} eventos
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            {onCreateEvent && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<CalendarPlus size={14} />}
                onClick={() => {
                  onClose();
                  onCreateEvent(client);
                }}
                style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}
              >
                Crear Evento
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              leftIcon={<Edit3 size={14} />}
              onClick={() => {
                onClose();
                onEdit(client);
              }}
            >
              Editar Cliente
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Cerrar
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <Badge variant={isEmpresa ? 'purple' : 'emerald'} size="md">
            {isEmpresa ? '🏢 Empresa' : '👤 Persona'}
          </Badge>
          {client.taxId && (
            <Badge variant="amber" size="md">
              CUIT/CUIL: {client.taxId}
            </Badge>
          )}
          {client.taxCondition && (
            <Badge variant="slate" size="md">
              IVA: {client.taxCondition}
            </Badge>
          )}
          {client.industry && (
            <Badge variant="default" size="md">
              {client.industry}
            </Badge>
          )}
        </div>

        {/* Grid Contact Data */}
        <Card variant="panel" style={{ padding: '16px', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Contacto Directo</span>
              <p style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500, marginTop: '2px' }}>{client.name}</p>
              {client.contactRole && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{client.contactRole}</p>}
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Email</span>
              <a href={`mailto:${client.email}`} style={{ fontSize: '0.88rem', color: '#38bdf8', textDecoration: 'none', display: 'block', marginTop: '2px' }}>
                {client.email}
              </a>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Teléfono</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '0.88rem', color: '#fff' }}>{client.phone}</span>
                {waLink && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    title="Enviar WhatsApp"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      color: '#22c55e',
                      background: 'rgba(34, 197, 94, 0.12)',
                      border: '1px solid rgba(34, 197, 94, 0.25)',
                      textDecoration: 'none'
                    }}
                  >
                    <MessageCircle size={12} />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

            {client.website && (
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Sitio Web</span>
                <a href={client.website} target="_blank" rel="noreferrer" style={{ fontSize: '0.88rem', color: '#a78bfa', textDecoration: 'none', display: 'block', marginTop: '2px' }}>
                  {client.website}
                </a>
              </div>
            )}
          </div>
        </Card>

        {/* Empresa Specifics */}
        {isEmpresa && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Datos Administrativos & Operativos
            </h4>
            
            {client.billingContactEmail && (
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: '#fff' }}>Facturación:</strong> {client.billingContactName ? `${client.billingContactName} (` : ''}{client.billingContactEmail}{client.billingContactName ? ')' : ''}
              </div>
            )}

            {client.paymentTerms && (
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: '#fff' }}>Condición de Pago:</strong> {client.paymentTerms}
              </div>
            )}

            {client.supplierRequirements && (
              <div style={{ fontSize: '0.82rem', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.08)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <strong style={{ display: 'block', marginBottom: '2px' }}>Requisitos de Ingreso de Proveedores:</strong>
                {client.supplierRequirements}
              </div>
            )}
          </div>
        )}

        {/* Persona Specifics */}
        {!isEmpresa && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Perfil & Preferencias
            </h4>

            {client.documentNumber && (
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: '#fff' }}>Documento / DNI:</strong> {client.documentNumber}
              </div>
            )}

            {client.birthDate && (
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: '#fff' }}>Fecha de Nacimiento / Aniversario:</strong> <FormattedDate date={client.birthDate} />
              </div>
            )}

            {client.frequentEventType && (
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: '#fff' }}>Tipo de Evento Frecuente:</strong> {client.frequentEventType}
              </div>
            )}

            {client.preferences && (
              <div style={{ fontSize: '0.82rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.08)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <strong style={{ display: 'block', marginBottom: '2px' }}>Preferencias / Requerimientos:</strong>
                {client.preferences}
              </div>
            )}
          </div>
        )}

        {/* Domicilio */}
        {(client.address || client.city) && (
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Domicilio</span>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {client.address ? `${client.address}, ` : ''}
              {client.city || ''}
              {client.state ? ` (${client.state})` : ''}
              {client.zipCode ? ` - CP ${client.zipCode}` : ''}
            </p>
          </div>
        )}

        {/* Notes */}
        {client.notes && (
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Notas Técnicas & Criterios</span>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic', background: 'rgba(0,0,0,0.25)', padding: '10px', borderRadius: '6px' }}>
              "{client.notes}"
            </p>
          </div>
        )}

        {/* ======================================================= */}
        {/* SECCIÓN DE EVENTOS ASOCIADOS                           */}
        {/* ======================================================= */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} color="#f59e0b" />
              <span>Historial de Eventos & Producciones ({associatedEvents.length})</span>
            </h4>

            {onCreateEvent && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<CalendarPlus size={13} />}
                onClick={() => {
                  onClose();
                  onCreateEvent(client);
                }}
                style={{ fontSize: '0.76rem', color: '#38bdf8', padding: '3px 8px' }}
              >
                Nuevo Evento
              </Button>
            )}
          </div>

          {associatedEvents.length === 0 ? (
            <div style={{ padding: '14px', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              No hay producciones activas o registradas para este cliente aún.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {associatedEvents.map(evt => (
                <Card
                  key={evt.id}
                  variant="glass"
                  interactive={Boolean(onSelectEvent)}
                  onClick={() => {
                    if (onSelectEvent) {
                      onClose();
                      onSelectEvent(evt);
                    }
                  }}
                  style={{
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.74rem', fontFamily: 'monospace', color: '#f59e0b', fontWeight: 600 }}>
                        {evt.code}
                      </span>
                      <h5 style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {evt.title}
                      </h5>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      <span><FormattedDate date={evt.date} fallback="Sin fecha" /></span>
                      <span>·</span>
                      <span>{evt.location}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)' }}>
                    <span style={{ fontSize: '0.74rem', color: '#38bdf8' }}>Ver Detalle</span>
                    <ChevronRight size={14} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};
