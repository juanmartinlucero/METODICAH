import React from 'react';
import type { Client } from '@/types/metodicah';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MessageCircle, 
  MapPin, 
  ShieldAlert, 
  Sparkles, 
  Eye, 
  Edit2, 
  Trash2,
  CalendarPlus
} from 'lucide-react';
import { getWhatsAppLink } from '@/utils/clientUtils';
import { Badge, Button, Card } from '@/components/ui';

interface ClientCardProps {
  client: Client;
  onViewDetail: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete?: (client: Client) => void;
  onCreateEvent?: (client: Client) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onViewDetail,
  onEdit,
  onDelete,
  onCreateEvent
}) => {
  const isEmpresa = (client.clientType || (client.company ? 'empresa' : 'persona')) === 'empresa';
  const displayName = isEmpresa ? (client.fantasyName || client.company || client.name) : client.name;
  const subtitle = isEmpresa 
    ? (client.company && client.fantasyName ? client.company : (client.contactRole ? `${client.name} (${client.contactRole})` : `Contacto: ${client.name}`))
    : (client.frequentEventType || 'Cliente Particular');

  const waLink = getWhatsAppLink(client.phone, isEmpresa ? client.name : displayName);

  return (
    <Card 
      variant="glass"
      className="hover-card" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        gap: '14px', 
        padding: '18px',
        position: 'relative',
        borderTop: isEmpresa ? '3px solid rgba(139, 92, 246, 0.6)' : '3px solid rgba(16, 185, 129, 0.6)'
      }}
    >
      {/* 1. Header: Type Icon, Titles & Category Badge */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '10px', 
              background: isEmpresa ? 'rgba(139, 92, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)', 
              border: isEmpresa ? '1px solid rgba(139, 92, 246, 0.35)' : '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: isEmpresa ? '#c4b5fd' : '#6ee7b7',
              flexShrink: 0
            }}>
              {isEmpresa ? <Building2 size={22} /> : <User size={22} />}
            </div>
            <div>
              <h3 
                onClick={() => onViewDetail(client)}
                style={{ 
                  fontSize: '1.12rem', 
                  color: '#fff', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  lineHeight: 1.25 
                }}
                className="hover-underline"
              >
                {displayName}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {subtitle}
              </p>
            </div>
          </div>

          {/* Badge */}
          <Badge variant={isEmpresa ? 'purple' : 'emerald'} size="sm">
            {isEmpresa ? 'Empresa' : 'Persona'}
          </Badge>
        </div>

        {/* Badges row: Industry / Tax / Document / Location */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
          {isEmpresa && client.industry && (
            <Badge variant="default" size="sm">
              {client.industry}
            </Badge>
          )}
          {client.taxId && (
            <Badge variant="amber" size="sm">
              CUIT: {client.taxId}
            </Badge>
          )}
          {!isEmpresa && client.documentNumber && (
            <Badge variant="blue" size="sm">
              DNI: {client.documentNumber}
            </Badge>
          )}
          {client.taxCondition && (
            <Badge variant="default" size="sm">
              {client.taxCondition}
            </Badge>
          )}
          {client.city && (
            <Badge variant="default" size="sm">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <MapPin size={10} />
                <span>{client.city}{client.state ? `, ${client.state}` : ''}</span>
              </span>
            </Badge>
          )}
        </div>
      </div>

      {/* 2. Operational Highlights: Requirements or Preferences */}
      {isEmpresa && client.supplierRequirements && (
        <div style={{ fontSize: '0.76rem', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.06)', padding: '7px 9px', borderRadius: '6px', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
          <ShieldAlert size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Req. Ingreso: {client.supplierRequirements}
          </span>
        </div>
      )}

      {!isEmpresa && client.preferences && (
        <div style={{ fontSize: '0.76rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.06)', padding: '7px 9px', borderRadius: '6px', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
          <Sparkles size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {client.preferences}
          </span>
        </div>
      )}

      {/* 3. Contact Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <a 
            href={`mailto:${client.email}`} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              color: 'var(--text-muted)', 
              textDecoration: 'none', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }} 
            className="hover-underline"
            title={client.email}
          >
            <Mail size={13} color="var(--text-dim)" />
            <span style={{ fontSize: '0.78rem' }}>{client.email}</span>
          </a>

          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              title="Abrir chat de WhatsApp"
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
                textDecoration: 'none',
                flexShrink: 0
              }}
            >
              <MessageCircle size={12} />
              <span>WhatsApp</span>
            </a>
          )}
        </div>

        {client.phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
            <Phone size={12} />
            <span>{client.phone}</span>
          </div>
        )}
      </div>

      {/* 4. Footer Actions */}
      <div style={{ 
        borderTop: '1px solid var(--border-subtle)', 
        paddingTop: '10px', 
        marginTop: 'auto',
        display: 'flex', 
        justifyContent: 'flex-end',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {onCreateEvent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCreateEvent(client)}
              title="Crear Nuevo Evento para este Cliente"
              leftIcon={<CalendarPlus size={14} color="#38bdf8" />}
              style={{ padding: '6px 8px' }}
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetail(client)}
            title="Ver Ficha Completa"
            leftIcon={<Eye size={14} color="#38bdf8" />}
            style={{ padding: '6px 8px' }}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(client)}
            title="Editar Cliente"
            leftIcon={<Edit2 size={14} />}
            style={{ padding: '6px 8px' }}
          />
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(client)}
              title="Eliminar Cliente"
              leftIcon={<Trash2 size={14} color="var(--text-dim)" />}
              style={{ padding: '6px 8px' }}
            />
          )}
        </div>
      </div>
    </Card>
  );
};
