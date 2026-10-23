import React from 'react';
import type { EventCrewMember } from '@/types/metodicah';
import { 
  Mail, 
  MessageCircle, 
  Edit2, 
  Trash2, 
  Eye,
  ShieldCheck
} from 'lucide-react';
import { getCrewWhatsAppLink } from '@/utils/crewUtils';
import { Badge, Button, Card } from '@/components/ui';

interface CrewRowProps {
  member: EventCrewMember;
  onViewDetail: (member: EventCrewMember) => void;
  onEdit: (member: EventCrewMember) => void;
  onDelete?: (member: EventCrewMember) => void;
  isAdmin?: boolean;
}

export const CrewRow: React.FC<CrewRowProps> = ({
  member,
  onViewDetail,
  onEdit,
  onDelete,
  isAdmin = true
}) => {
  const isFreelancer = member.type === 'freelancer';
  const waLink = getCrewWhatsAppLink(member.phone, member.userName);

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Card 
      variant="glass"
      className="hover-card" 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderLeft: isFreelancer ? '4px solid #f59e0b' : '4px solid #38bdf8',
        gap: '14px',
        flexWrap: 'wrap',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. Left: Avatar & Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 240px', minWidth: 0, overflow: 'hidden' }}>
        {member.avatarUrl ? (
          <img 
            src={member.avatarUrl} 
            alt={member.userName} 
            style={{ 
              width: '38px', 
              height: '38px', 
              borderRadius: '8px', 
              objectFit: 'cover',
              border: isFreelancer ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)',
              flexShrink: 0
            }} 
          />
        ) : (
          <div style={{ 
            width: '38px', 
            height: '38px', 
            borderRadius: '8px', 
            background: isFreelancer ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
            border: isFreelancer ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(56, 189, 248, 0.35)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: isFreelancer ? '#fbbf24' : '#38bdf8',
            fontWeight: 700,
            fontSize: '0.85rem',
            flexShrink: 0
          }}>
            {getInitials(member.userName)}
          </div>
        )}

        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h4 
              onClick={() => onViewDetail(member)}
              style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}
              className="hover-underline"
            >
              {member.userName}
            </h4>

            <Badge
              variant={isFreelancer ? 'warning' : 'info'}
              size="sm"
              style={{ flexShrink: 0 }}
            >
              {isFreelancer ? 'Freelancer' : 'Staff'}
            </Badge>

            {member.hasSystemAccess && (
              <Badge
                variant={member.globalRole === 'admin' ? 'amber' : member.globalRole === 'team_member' ? 'blue' : 'slate'}
                size="sm"
                style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
              >
                <ShieldCheck size={10} />
                {member.globalRole === 'admin' ? 'Acceso: Admin' : member.globalRole === 'team_member' ? 'Acceso: Miembro' : 'Acceso: Invitado'}
              </Badge>
            )}
          </div>

          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
            <span style={{ color: isFreelancer ? '#fbbf24' : '#38bdf8', fontWeight: 500 }}>{member.roleInEvent}</span>
            <span> · </span>
            <span>{member.sector}</span>
          </p>
        </div>
      </div>

      {/* 2. Middle: Contact Channels */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 260px', minWidth: '200px' }}>
        <a 
          href={`mailto:${member.userEmail}`}
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
          title={member.userEmail}
        >
          <Mail size={13} color="var(--text-dim)" />
          <span>{member.userEmail}</span>
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

      {/* 3. Right: Meta & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetail(member)}
          title="Ver Ficha Técnica"
          leftIcon={<Eye size={14} color="#38bdf8" />}
          style={{ padding: '5px 7px' }}
        />

        {isAdmin && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(member)}
              title="Editar"
              leftIcon={<Edit2 size={14} />}
              style={{ padding: '5px 7px' }}
            />

            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(member)}
                title="Eliminar"
                leftIcon={<Trash2 size={14} color="var(--text-dim)" />}
                style={{ padding: '5px 7px' }}
              />
            )}
          </>
        )}
      </div>

    </Card>
  );
};
