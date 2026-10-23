import React from 'react';
import type { EventCrewMember } from '@/types/metodicah';
import { 
  UserCheck, 
  Briefcase, 
  Mail, 
  Phone, 
  MessageCircle, 
  Edit2, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  Shirt, 
  Utensils, 
  MapPin
} from 'lucide-react';
import { getCrewWhatsAppLink } from '@/utils/crewUtils';
import { Badge, Button, Card } from '@/components/ui';

interface CrewCardProps {
  member: EventCrewMember;
  onViewDetail: (member: EventCrewMember) => void;
  onEdit: (member: EventCrewMember) => void;
  onDelete?: (member: EventCrewMember) => void;
  isAdmin?: boolean;
}

export const CrewCard: React.FC<CrewCardProps> = ({
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
        flexDirection: 'column', 
        justifyContent: 'space-between',
        gap: '14px',
        padding: '18px',
        borderTop: isFreelancer ? '3px solid #f59e0b' : '3px solid #38bdf8',
        position: 'relative'
      }}
    >
      
      {/* 1. Header: Avatar, Name, Contract & Role */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Avatar */}
            {member.avatarUrl ? (
              <img 
                src={member.avatarUrl} 
                alt={member.userName} 
                style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '10px', 
                  objectFit: 'cover',
                  border: isFreelancer ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)',
                  flexShrink: 0
                }} 
              />
            ) : (
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '10px', 
                background: isFreelancer ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                border: isFreelancer ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid rgba(56, 189, 248, 0.35)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: isFreelancer ? '#fbbf24' : '#38bdf8',
                fontWeight: 700,
                fontSize: '1rem',
                flexShrink: 0
              }}>
                {getInitials(member.userName)}
              </div>
            )}

            <div>
              <h3 
                onClick={() => onViewDetail(member)}
                style={{ 
                  fontSize: '1.12rem', 
                  fontWeight: 600, 
                  color: '#fff', 
                  cursor: 'pointer',
                  lineHeight: 1.25
                }}
                className="hover-underline"
              >
                {member.userName}
              </h3>
              <p style={{ fontSize: '0.8rem', color: isFreelancer ? '#fbbf24' : '#38bdf8', fontWeight: 500, marginTop: '2px' }}>
                {member.roleInEvent}
              </p>
            </div>
          </div>

          {/* Contract Badge */}
          <Badge
            variant={isFreelancer ? 'warning' : 'info'}
            size="sm"
            style={{ flexShrink: 0 }}
          >
            {isFreelancer ? <Briefcase size={10} style={{ marginRight: '4px' }} /> : <UserCheck size={10} style={{ marginRight: '4px' }} />}
            {isFreelancer ? 'Freelancer' : 'Staff'}
          </Badge>
        </div>

        {/* Sector & Seniority Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
          <Badge variant="default" size="sm">
            {member.sector}
          </Badge>
          {member.seniority && (
            <Badge variant="default" size="sm" style={{ textTransform: 'capitalize' }}>
              {member.seniority.replace('_', ' ')}
            </Badge>
          )}
          {member.city && (
            <Badge variant="default" size="sm">
              <MapPin size={10} style={{ marginRight: '4px' }} />
              {member.city}
            </Badge>
          )}
          {member.hasSystemAccess && (
            <Badge 
              variant={member.globalRole === 'admin' ? 'amber' : member.globalRole === 'team_member' ? 'blue' : 'slate'}
              size="sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}
            >
              <ShieldCheck size={10} />
              {member.globalRole === 'admin' ? 'Acceso: Admin' : member.globalRole === 'team_member' ? 'Acceso: Miembro' : 'Acceso: Invitado'}
            </Badge>
          )}
        </div>
      </div>

      {/* 2. Contact Channels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <a 
            href={`mailto:${member.userEmail}`}
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
            title={member.userEmail}
          >
            <Mail size={13} color="var(--text-dim)" />
            <span style={{ fontSize: '0.78rem' }}>{member.userEmail}</span>
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

        {member.phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
            <Phone size={12} />
            <span>{member.phone}</span>
          </div>
        )}
      </div>

      {/* 3. Backstage & Safety Badges */}
      {(member.artInsurance || member.clothingSize || (member.dietaryRestrictions && member.dietaryRestrictions !== 'Estándar')) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: '6px' }}>
          {member.artInsurance && (
            <Badge variant="success" size="sm">
              <ShieldCheck size={11} style={{ marginRight: '4px' }} />
              {member.artInsurance}
            </Badge>
          )}
          {member.clothingSize && (
            <Badge variant="default" size="sm">
              <Shirt size={11} style={{ marginRight: '4px' }} />
              Talle: {member.clothingSize}
            </Badge>
          )}
          {member.dietaryRestrictions && member.dietaryRestrictions !== 'Estándar' && (
            <Badge variant="warning" size="sm">
              <Utensils size={11} style={{ marginRight: '4px' }} />
              {member.dietaryRestrictions}
            </Badge>
          )}
        </div>
      )}

      {/* 4. Footer Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetail(member)}
            title="Ver Ficha Técnica"
            leftIcon={<Eye size={14} color="#38bdf8" />}
            style={{ padding: '6px 8px' }}
          />

          {isAdmin && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(member)}
                title="Editar Miembro"
                leftIcon={<Edit2 size={14} />}
                style={{ padding: '6px 8px' }}
              />

              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(member)}
                  title="Eliminar Miembro"
                  leftIcon={<Trash2 size={14} color="var(--text-dim)" />}
                  style={{ padding: '6px 8px' }}
                />
              )}
            </>
          )}
        </div>
      </div>

    </Card>
  );
};
