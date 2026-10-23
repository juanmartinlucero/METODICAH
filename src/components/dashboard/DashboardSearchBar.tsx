import React, { useState, useEffect, useRef } from 'react';
import type { EventItem, EventStageConfig } from '@/types/metodicah';
import { EventCard } from '@/components/EventCard';
import { Search, Plus } from 'lucide-react';
import { Badge, Button, Card } from '@/components/ui';

interface DashboardSearchBarProps {
  events: EventItem[];
  stages?: EventStageConfig[];
  onSelectEvent: (event: EventItem) => void;
  onOpenNewEvent: () => void;
}

export const DashboardSearchBar: React.FC<DashboardSearchBarProps> = ({
  events,
  stages = [],
  onSelectEvent,
  onOpenNewEvent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search matches
  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : events.filter(evt =>
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (evt.venue && evt.venue.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  // Global keyboard shortcut (Ctrl+K or Cmd+K) and global Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && searchQuery) {
        e.preventDefault();
        setSearchQuery('');
        setSelectedIndex(-1);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  // Handle arrow keys and Enter navigation in search results
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setSearchQuery('');
      setSelectedIndex(-1);
      inputRef.current?.blur();
      return;
    }

    if (searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
        onSelectEvent(searchResults[selectedIndex]);
        setSearchQuery('');
        setSelectedIndex(-1);
      } else if (searchResults.length > 0) {
        onSelectEvent(searchResults[0]);
        setSearchQuery('');
        setSelectedIndex(-1);
      }
    }
  };

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  return (
    <div ref={containerRef} style={{ width: '100%', maxWidth: '640px', position: 'relative' }}>
      
      {/* Search Bar Input Container */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: isSearchFocused ? 'rgba(18, 24, 38, 0.95)' : 'rgba(14, 19, 31, 0.8)',
        border: isSearchFocused ? '1px solid rgba(245, 158, 11, 0.45)' : '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '12px 18px',
        gap: '12px',
        boxShadow: isSearchFocused ? '0 8px 30px rgba(0, 0, 0, 0.5)' : '0 4px 20px rgba(0, 0, 0, 0.25)',
        transition: 'all 0.2s ease'
      }}>
        <Search size={20} color={isSearchFocused ? '#f59e0b' : 'var(--text-dim)'} />
        
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar eventos por título, código, cliente o venue..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
          onKeyDown={handleInputKeyDown}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontSize: '0.98rem',
            fontFamily: 'var(--font-body)'
          }}
        />

        {/* Clear query button / Esc shortcut badge */}
        {searchQuery ? (
          <button 
            type="button"
            onClick={() => {
              setSearchQuery('');
              inputRef.current?.focus();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '2px 7px',
              borderRadius: '4px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
            title="Limpiar búsqueda (Esc)"
          >
            Esc
          </button>
        ) : (
          /* Subtle Keyboard Shortcut Badge */
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.72rem',
            color: 'var(--text-dim)',
            userSelect: 'none'
          }}>
            <span>{isMac ? '⌘' : 'Ctrl'}</span>
            <span>K</span>
          </div>
        )}

        {/* Quick Launch New Event button */}
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenNewEvent}
          leftIcon={<Plus size={15} />}
          title="Crear un nuevo evento"
          style={{ flexShrink: 0 }}
        >
          Nuevo
        </Button>
      </div>

      {/* Floating Instant Search Dropdown */}
      {searchQuery.trim() !== '' && (
        <Card
          variant="panel"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            padding: 0,
            background: 'rgba(12, 17, 28, 0.98)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-subtle-hover)',
            borderRadius: '10px',
            overflow: 'hidden',
            zIndex: 50,
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)'
          }}
        >
          {searchResults.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No se encontraron eventos coincidentes con "{searchQuery}".
            </div>
          ) : (
            <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
              <div style={{
                padding: '10px 16px',
                fontSize: '0.72rem',
                color: 'var(--text-dim)',
                fontWeight: 600,
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Badge variant="default" size="sm">
                  {searchResults.length} {searchResults.length === 1 ? 'resultado' : 'resultados'}
                </Badge>
                <span style={{ fontSize: '0.68rem', textTransform: 'none', color: 'var(--text-dim)' }}>
                  Usa ↑ ↓ para navegar · Enter para abrir
                </span>
              </div>

              {searchResults.map((evt, idx) => {
                const isHighlighted = idx === selectedIndex;
                return (
                  <div
                    key={evt.id}
                    style={{
                      background: isHighlighted ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                      borderLeft: isHighlighted ? '3px solid #f59e0b' : '3px solid transparent',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <EventCard
                      event={evt}
                      stages={stages}
                      variant="compact"
                      onClick={(selected) => {
                        onSelectEvent(selected);
                        setSearchQuery('');
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

    </div>
  );
};
