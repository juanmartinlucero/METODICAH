import React from 'react';
import type { EventItem, EventStageConfig } from '@/types/metodicah';
import { 
  Calendar, 
  MapPin, 
  Building2, 
  ChevronRight, 
  Clock, 
  Users 
} from 'lucide-react';
import { FormattedDate } from '@/components/common/FormattedDate';
import { Badge, Card } from '@/components/ui';

interface EventCardProps {
  event: EventItem;
  stages?: EventStageConfig[];
  onClick?: (event: EventItem) => void;
  variant?: 'default' | 'compact';
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  stages = [],
  onClick,
  variant = 'default'
}) => {
  const stage = stages.find(s => s.id === event.stageId) || {
    id: event.stageId || 'backlog',
    label: event.stageId || 'Backlog',
    color: '#94a3b8'
  };

  const stageBadge = (
    <Badge color={stage.color} dot size="sm">
      {stage.label}
    </Badge>
  );

  if (variant === 'compact') {
    return (
      <Card
        variant="glass"
        interactive={Boolean(onClick)}
        onClick={onClick ? () => onClick(event) : undefined}
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          transition: 'all 0.15s ease'
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
            <span style={{ fontSize: '0.74rem', fontFamily: 'monospace', color: '#f59e0b', fontWeight: 600 }}>
              {event.code}
            </span>
            {stageBadge}
          </div>
          <p style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {event.title}
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {event.clientName} · {event.venue ? `${event.venue}, ` : ''}{event.location}
          </span>
        </div>

        <div style={{ color: 'var(--text-dim)', marginLeft: '12px' }}>
          <ChevronRight size={16} />
        </div>
      </Card>
    );
  }

  return (
    <Card
      variant="glass"
      interactive={Boolean(onClick)}
      onClick={onClick ? () => onClick(event) : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        padding: '16px 20px',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)',
        transition: 'border-color 0.15s ease, transform 0.15s ease'
      }}
    >
      {/* Left Column: Identifiers, Title & Metadata */}
      <div style={{ flex: '1 1 auto', minWidth: '220px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#f59e0b', fontWeight: 600 }}>
            {event.code}
          </span>
          {stageBadge}
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
          {event.title}
        </h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Building2 size={13} color="var(--text-dim)" />
            {event.clientName}
          </span>

          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <MapPin size={13} color="var(--text-dim)" />
            {event.venue ? `${event.venue} · ${event.location}` : event.location}
          </span>

          {event.concept && (
            <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
              "{event.concept}"
            </span>
          )}
        </div>
      </div>

      {/* Right Column: Date, Schedule, Crew Count & Arrow */}
      <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
        <div>
          <p style={{
            fontSize: '0.82rem',
            fontWeight: 500,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            justifyContent: 'flex-end'
          }}>
            <Calendar size={13} color="var(--text-dim)" />
            <FormattedDate date={event.date} fallback="Sin fecha" />
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', marginTop: '2px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Clock size={11} />
              {event.timeRange?.startTime} - {event.timeRange?.endTime} hs
            </span>
            {event.crewIds && event.crewIds.length > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                · <Users size={11} /> {event.crewIds.length} crew
              </span>
            )}
          </div>
        </div>

        <div style={{ color: 'var(--text-dim)' }}>
          <ChevronRight size={18} />
        </div>
      </div>
    </Card>
  );
};
