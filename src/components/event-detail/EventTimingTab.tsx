import React, { useState } from 'react';
import type { TimingItem } from '../../types/metodicah';
import { FilterPills } from '../FilterPills';
import { Plus } from 'lucide-react';

import { TimingFormModal } from './TimingFormModal';

interface EventTimingTabProps {
  timings: TimingItem[];
  onUpdateTimingStatus: (timingId: string, newStatus: TimingItem['status']) => void;
  onAddTimingItem: (newItem: Omit<TimingItem, 'id' | 'eventId'>) => void;
}

export const EventTimingTab: React.FC<EventTimingTabProps> = ({
  timings,
  onUpdateTimingStatus,
  onAddTimingItem
}) => {
  const [sectorFilter, setSectorFilter] = useState<string>('todos');
  const [showTimingModal, setShowTimingModal] = useState(false);

  const uniqueSectors = Array.from(new Set(timings.map(t => t.sector)));
  const filteredTimings = sectorFilter === 'todos' 
    ? timings 
    : timings.filter(t => t.sector === sectorFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Filters & Actions Toolbar */}
      <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <FilterPills
          options={[
            { id: 'todos', label: 'Todos los Sectores', count: timings.length },
            ...uniqueSectors.map(sec => ({
              id: sec,
              label: sec,
              count: timings.filter(t => t.sector === sec).length
            }))
          ]}
          selectedId={sectorFilter}
          onSelect={setSectorFilter}
        />

        <button onClick={() => setShowTimingModal(true)} className="btn-primary" style={{ fontSize: '0.82rem', padding: '7px 14px' }}>
          <Plus size={15} />
          <span>Nuevo Item de Timing</span>
        </button>
      </div>

      {/* Timings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredTimings.length === 0 ? (
          <div className="glass-panel" style={{ padding: '36px 20px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No hay tareas de cronograma registradas en este sector.
            </p>
          </div>
        ) : (
          filteredTimings.map((timing) => (
            <div 
              key={timing.id}
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                padding: '16px 20px',
                borderLeft: `4px solid ${
                  timing.status === 'completed' ? '#10b981' :
                  timing.status === 'in_progress' ? '#f59e0b' :
                  timing.status === 'delayed' ? '#ef4444' : '#64748b'
                }`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ minWidth: '110px' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
                    {timing.timeStart} - {timing.timeEnd}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    {timing.sector}
                  </span>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.94rem', color: '#fff', marginBottom: '2px' }}>{timing.title}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    👤 {timing.responsible} {timing.supplierName ? `| 🏢 ${timing.supplierName}` : ''}
                  </span>
                </div>
              </div>

              {/* Status Switcher */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(['pending', 'in_progress', 'completed', 'delayed'] as TimingItem['status'][]).map((st) => (
                  <button
                    key={st}
                    onClick={() => onUpdateTimingStatus(timing.id, st)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      border: timing.status === st ? '1px solid transparent' : '1px solid var(--border-subtle)',
                      background: timing.status === st 
                        ? st === 'completed' ? '#10b981' : st === 'in_progress' ? '#f59e0b' : st === 'delayed' ? '#ef4444' : '#64748b'
                        : 'transparent',
                      color: timing.status === st ? (st === 'in_progress' ? '#000' : '#fff') : 'var(--text-dim)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {st === 'pending' && 'PENDIENTE'}
                    {st === 'in_progress' && 'EN PROGRESO'}
                    {st === 'completed' && 'COMPLETO'}
                    {st === 'delayed' && 'DEMORADO'}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Timing Modal */}
      <TimingFormModal
        isOpen={showTimingModal}
        onClose={() => setShowTimingModal(false)}
        onAddTimingItem={onAddTimingItem}
        nextOrder={timings.length + 1}
      />

    </div>
  );
};
