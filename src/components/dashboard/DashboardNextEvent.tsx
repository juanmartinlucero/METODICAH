import React from 'react';
import type { EventItem, EventStageConfig } from '@/types/metodicah';
import { Calendar, ChevronRight } from 'lucide-react';
import { FormattedDate } from '@/components/common/FormattedDate';
import { Badge, Button, Card } from '@/components/ui';
import { parseDateSafe } from '@/utils/dateUtils';

interface DashboardNextEventProps {
  events: EventItem[];
  stages?: EventStageConfig[];
  onSelectEvent: (event: EventItem) => void;
}

export const DashboardNextEvent: React.FC<DashboardNextEventProps> = ({
  events,
  stages = [],
  onSelectEvent
}) => {
  // Filter active events with a valid date and sort by date ascending
  const activeEventsWithDate = events
    .filter(e => e.stageId !== 'post_prod' && e.stageId !== 'rejected' && e.date)
    .sort((a, b) => (parseDateSafe(a.date)?.getTime() ?? 0) - (parseDateSafe(b.date)?.getTime() ?? 0));

  const nextEvent = activeEventsWithDate[0];

  if (!nextEvent) return null;

  const stage = stages.find(s => s.id === nextEvent.stageId) || {
    id: nextEvent.stageId || 'backlog',
    label: nextEvent.stageId || 'Backlog',
    color: '#94a3b8'
  };

  return (
    <div style={{ width: '100%', maxWidth: '880px' }}>
      <Card
        variant="glass"
        interactive
        onClick={() => onSelectEvent(nextEvent)}
        style={{
          padding: '16px 22px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          background: 'rgba(245, 158, 11, 0.03)',
          transition: 'all 0.18s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
          {/* Calendar Day Badge */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 12px',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#f59e0b',
            flexShrink: 0
          }}>
            <Calendar size={14} style={{ marginBottom: '2px' }} />
            <span style={{ fontSize: '0.74rem', fontWeight: 700, fontFamily: 'monospace' }}>
              <FormattedDate date={nextEvent.date} />
            </span>
          </div>

          {/* Event Details */}
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <Badge variant="amber" size="sm">
                Próxima Producción en Agenda
              </Badge>
              <Badge color={stage.color} dot size="sm">
                {stage.label}
              </Badge>
            </div>

            <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {nextEvent.title}
            </h4>
          </div>
        </div>

        {/* Right Action */}
        <Button
          variant="ghost"
          size="sm"
          rightIcon={<ChevronRight size={16} />}
          style={{ color: '#f59e0b', padding: '6px 12px', flexShrink: 0 }}
        >
          Abrir
        </Button>
      </Card>
    </div>
  );
};
