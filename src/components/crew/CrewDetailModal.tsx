import React from 'react';
import type { EventCrewMember, EventItem } from '@/types/metodicah';
import { 
  UserCheck, 
  Briefcase, 
  MessageCircle, 
  Edit3, 
  ShieldCheck, 
  Shirt, 
  Utensils, 
  Calendar, 
  ChevronRight, 
  AlertCircle
} from 'lucide-react';
import { getCrewWhatsAppLink } from '@/utils/crewUtils';
import { FormattedDate } from '@/components/common/FormattedDate';
import { BaseModal } from '@/components/common/BaseModal';
import { Button, Badge, Card } from '@/components/ui';

interface CrewDetailModalProps {
  member: EventCrewMember | null;
  events?: EventItem[];
  onClose: () => void;
  onEdit: (member: EventCrewMember) => void;
  onSelectEvent?: (event: EventItem) => void;
  isAdmin?: boolean;
}

export const CrewDetailModal: React.FC<CrewDetailModalProps> = ({
  member,
  events = [],
  onClose,
  onEdit,
  onSelectEvent,
  isAdmin = true
}) => {
  if (!member) return null;

  const isFreelancer = member.type === 'freelancer';
  const waLink = getCrewWhatsAppLink(member.phone, member.userName);

  // Filter assigned events
  const assignedEvents = events.filter(e => {
    return e.crewIds?.includes(member.userId) || e.crewIds?.includes(member.id);
  });

  return (
    <BaseModal
      isOpen={!!member}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>{member.userName}</span>
          <Badge
            variant={isFreelancer ? 'amber' : 'blue'}
            size="sm"
            style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            {isFreelancer ? <Briefcase size={11} /> : <UserCheck size={11} />}
            <span>{isFreelancer ? 'Freelancer' : 'Staff Interno'}</span>
          </Badge>
        </div>
      }
      subtitle={`${member.roleInEvent} · ${member.sector}`}
      icon={
        member.avatarUrl ? (
          <img 
            src={member.avatarUrl} 
            alt={member.userName} 
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '6px', 
              objectFit: 'cover' 
            }} 
          />
        ) : (
          <UserCheck size={18} />
        )
      }
      maxWidth="680px"
      footer={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%'
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Fecha de Alta: <FormattedDate date={member.createdAt} fallback="Sin fecha registrada" />
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            {isAdmin && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Edit3 size={14} />}
                onClick={() => {
                  onClose();
                  onEdit(member);
                }}
              >
                Editar Miembro
              </Button>
            )}
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
        {/* Identification Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {member.documentNumber && (
            <Badge variant="slate" size="md">
              DNI: {member.documentNumber}
            </Badge>
          )}
          {member.taxId && (
            <Badge variant="amber" size="md">
              CUIL: {member.taxId}
            </Badge>
          )}
          {member.birthDate && (
            <Badge variant="slate" size="md">
              Nacimiento: <FormattedDate date={member.birthDate} />
            </Badge>
          )}
          {member.seniority && (
            <Badge variant="info" size="md" style={{ textTransform: 'capitalize' }}>
              Seniority: {member.seniority.replace('_', ' ')}
            </Badge>
          )}
          {member.hasSystemAccess && (
            <Badge 
              variant={member.globalRole === 'admin' ? 'amber' : member.globalRole === 'team_member' ? 'blue' : 'slate'}
              size="md"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <ShieldCheck size={13} />
              Acceso: {member.globalRole === 'admin' ? 'Administrador' : member.globalRole === 'team_member' ? 'Miembro de Equipo' : 'Invitado'}
            </Badge>
          )}
        </div>

        {/* System Access Information */}
        {member.hasSystemAccess && (
          <div style={{
            background: 'rgba(56, 189, 248, 0.06)',
            padding: '12px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="#38bdf8" />
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', display: 'block' }}>
                  Cuenta de Acceso al Sistema Habilitada
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  Rol global: <strong style={{ color: member.globalRole === 'admin' ? '#f59e0b' : '#38bdf8' }}>{member.globalRole === 'admin' ? 'Administrador' : member.globalRole === 'team_member' ? 'Miembro de Equipo' : 'Invitado'}</strong> · Inicia sesión con {member.userEmail}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Contact Data */}
        <Card variant="panel" style={{ padding: '16px', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Email Operativo</span>
              <a href={`mailto:${member.userEmail}`} style={{ fontSize: '0.88rem', color: '#38bdf8', textDecoration: 'none', display: 'block', marginTop: '2px' }}>
                {member.userEmail}
              </a>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Teléfono Directo</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '0.88rem', color: '#fff' }}>{member.phone || 'No registrado'}</span>
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

            {member.city && (
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Ciudad / Residencia</span>
                <p style={{ fontSize: '0.88rem', color: '#fff', marginTop: '2px' }}>{member.city}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Emergency Contact */}
        {(member.emergencyContactName || member.emergencyContactPhone) && (
          <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <span style={{ fontSize: '0.74rem', color: '#f87171', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={13} />
              <span>Contacto de Emergencia / Urgencias</span>
            </span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.85rem' }}>
              <span style={{ color: '#fff', fontWeight: 500 }}>{member.emergencyContactName || 'Sin nombre'}</span>
              {member.emergencyContactPhone && (
                <span style={{ color: '#fca5a5' }}>{member.emergencyContactPhone}</span>
              )}
            </div>
          </div>
        )}

        {/* Backstage & Safety */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={13} color="#10b981" />
              <span>Aseguradora ART</span>
            </span>
            <p style={{ fontSize: '0.86rem', color: '#10b981', fontWeight: 500, marginTop: '2px' }}>
              {member.artInsurance || 'Sin ART registrada'}
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Shirt size={13} color="var(--text-muted)" />
              <span>Talle Indumentaria</span>
            </span>
            <p style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 500, marginTop: '2px' }}>
              {member.clothingSize || 'L'}
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Utensils size={13} color="#fbbf24" />
              <span>Dieta Catering</span>
            </span>
            <p style={{ fontSize: '0.86rem', color: member.dietaryRestrictions && member.dietaryRestrictions !== 'Estándar' ? '#fbbf24' : 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>
              {member.dietaryRestrictions || 'Estándar'}
            </p>
          </div>
        </div>

        {/* Notes */}
        {member.notes && (
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Notas Técnicas & Especialidades</span>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic', background: 'rgba(0,0,0,0.25)', padding: '10px', borderRadius: '6px' }}>
              "{member.notes}"
            </p>
          </div>
        )}

        {/* ======================================================= */}
        {/* SECCIÓN DE PRODUCCIONES Y EVENTOS ASIGNADOS             */}
        {/* ======================================================= */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
          <h4 style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Calendar size={16} color="#38bdf8" />
            <span>Historial de Eventos Asignados ({assignedEvents.length})</span>
          </h4>

          {assignedEvents.length === 0 ? (
            <div style={{ padding: '14px', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              No hay producciones asignadas a este miembro del equipo actualmente.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {assignedEvents.map(evt => (
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
