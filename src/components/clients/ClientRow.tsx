import React from 'react';
import type { Client } from '@/types/metodicah';
import { 
  Building2, 
  User, 
  Mail, 
  MessageCircle, 
  Eye, 
  Edit2, 
  Trash2,
  CalendarPlus
} from 'lucide-react';
import { getWhatsAppLink } from '@/utils/clientUtils';
import { Badge, Button, Card } from '@/components/ui';

interface ClientRowProps {
  client: Client;
  onViewDetail: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete?: (client: Client) => void;
  onCreateEvent?: (client: Client) => void;
}

export const ClientRow: React.FC<ClientRowProps> = ({
  client,
  onViewDetail,
  onEdit,
  onDelete,
  onCreateEvent
}) => {
  const isEmpresa = (client.clientType || (client.company ? 'empresa' : 'persona')) === 'empresa';
  const displayName = isEmpresa ? (client.fantasyName || client.company || client.name) : client.name;
  const secondaryInfo = isEmpresa 
    ? (client.company && client.fantasyName ? `${client.company} · Contacto: ${client.name}` : `Contacto: ${client.name}${client.contactRole ? ` (${client.contactRole})` : ''}`)
    : (client.frequentEventType ? `${client.frequentEventType}${client.documentNumber ? ` · DNI: ${client.documentNumber}` : ''}` : (client.documentNumber ? `DNI: ${client.documentNumber}` : 'Particular'));

  const waLink = getWhatsAppLink(client.phone, isEmpresa ? client.name : displayName);

  return (
    <Card 
      variant="glass"
      className="hover-card" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '10px 16px', 
        borderRadius: '8px',
        borderLeft: isEmpresa ? '4px solid #8b5cf6' : '4px solid #10b981',
        gap: '14px',
        flexWrap: 'wrap',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. Left: Type Icon + Name & Secondary text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 240px', minWidth: 0, overflow: 'hidden' }}>
        <div style={{ 
          width: '38px', 
          height: '38px', 
          borderRadius: '8px', 
          background: isEmpresa ? 'rgba(139, 92, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)', 
          border: isEmpresa ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: isEmpresa ? '#c4b5fd' : '#6ee7b7',
          flexShrink: 0
        }}>
          {isEmpresa ? <Building2 size={18} /> : <User size={18} />}
        </div>

        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h4 
              onClick={() => onViewDetail(client)}
              style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}
              className="hover-underline"
            >
              {displayName}
            </h4>
            <Badge
              variant={isEmpresa ? 'purple' : 'emerald'}
              size="sm"
              style={{ flexShrink: 0 }}
            >
              {isEmpresa ? 'Empresa' : 'Persona'}
            </Badge>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
            {secondaryInfo}
          </p>
        </div>
      </div>

      {/* 2. Middle: Contact Channels */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 260px', minWidth: '200px' }}>
        <a 
          href={`mailto:${client.email}`}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px', 
            fontSize: '0.78rem', 
            color: 'var(--text-muted)', 
            textDecoration: 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '180px'
          }}
          title={client.email}
        >
          <Mail size={13} color="var(--text-dim)" />
          <span>{client.email}</span>
        </a>

        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            title="WhatsApp Directo"
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

      {/* 3. Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {onCreateEvent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCreateEvent(client)}
            title="Crear Nuevo Evento"
            leftIcon={<CalendarPlus size={14} color="#38bdf8" />}
            style={{ padding: '5px 7px' }}
          />
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetail(client)}
          title="Ver Ficha Completa"
          leftIcon={<Eye size={14} color="#38bdf8" />}
          style={{ padding: '5px 7px' }}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(client)}
          title="Editar Cliente"
          leftIcon={<Edit2 size={14} />}
          style={{ padding: '5px 7px' }}
        />
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(client)}
            title="Eliminar Cliente"
            leftIcon={<Trash2 size={14} color="var(--text-dim)" />}
            style={{ padding: '5px 7px' }}
          />
        )}
      </div>
    </Card>
  );
};
