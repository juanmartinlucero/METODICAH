import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import type { Client, ClientType, EventItem } from '@/types/metodicah';
import { Plus, Search } from 'lucide-react';
import { ClientTypeFilter, ClientActionBar, type ClientSortOption } from '@/components/clients/ClientsToolbar';
import { SectionGroupHeader } from '@/components/common/SectionGroupHeader';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/ui';
import { useEntityList } from '@/hooks/useEntityList';
import { ClientCard } from '@/components/clients/ClientCard';
import { ClientRow } from '@/components/clients/ClientRow';
import { ClientFormModal } from '@/components/clients/ClientFormModal';
import { ClientDetailModal } from '@/components/clients/ClientDetailModal';
import { ClientDeleteModal } from '@/components/clients/ClientDeleteModal';
import { exportClientsToCSV, parseClientsCSV } from '@/utils/clientUtils';
import { getTodayLocalDateString } from '@/utils/dateUtils';
import { matchesSearch } from '@/utils/searchUtils';
import { useToast } from '@/hooks/useToast';
import { useClientsStore, useEventsStore } from '@/stores';

export interface ClientsViewProps {
  // Vista principal de Clientes: Smart Container conectado a Zustand y React Router
}

export const ClientsView: React.FC<ClientsViewProps> = () => { 
  const navigate = useNavigate();
  const clients = useClientsStore(s => s.clients);
  const onAddClient = useClientsStore(s => s.addClient);
  const onAddClientsBulk = useClientsStore(s => s.addClientsBulk);
  const onUpdateClient = useClientsStore(s => s.updateClient);
  const onDeleteClient = useClientsStore(s => s.deleteClient);
  const events = useEventsStore(s => s.events);
  const onSelectEvent = useEventsStore(s => s.selectEvent);
  const storeOpenNewEvent = useEventsStore(s => s.openNewEventModal);
  const onCreateEventForClient = (c: Client) => storeOpenNewEvent(c.id);
  const toast = useToast();

  const handleSelectEvent = (evt: EventItem) => {
    onSelectEvent(evt);
    navigate(`/events/${evt.id}`);
  };

  // Unified Entity List Hook
  const {
    searchQuery,
    setSearchQuery,
    filterValue: typeFilter,
    setFilterValue: setTypeFilter,
    hasActiveFilters,
    resetFilters: handleResetFilters,
    sortBy,
    handleSortChange,
    isGrouped: groupByType,
    toggleGrouping: handleToggleGroupByType,
    viewMode,
    handleViewModeChange,
    currentPage,
    setCurrentPage,
    sortedItems: sortedClients,
    paginatedItems: paginatedClients,
    showFormModal,
    setShowFormModal,
    editingItem: editingClient,
    setEditingItem: setEditingClient,
    viewingItem: viewingClient,
    setViewingItem: setViewingClient,
    itemToDelete: clientToDelete,
    setItemToDelete: setClientToDelete,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseFormModal
  } = useEntityList<Client, ClientSortOption, 'all' | ClientType>({
    items: clients,
    storagePrefix: 'metodicah_clients',
    defaultSort: 'name_asc',
    defaultFilter: 'all',
    pageSize: 10,
    filterPredicate: (c, filter) => {
      if (filter === 'all') return true;
      const cType = c.clientType || (c.company ? 'empresa' : 'persona');
      return cType === filter;
    },
    searchPredicate: (c, q) =>
      matchesSearch(
        [
          c.name,
          c.company,
          c.fantasyName,
          c.email,
          c.phone,
          c.taxId,
          c.documentNumber,
          c.industry,
          c.contactRole,
          c.city
        ],
        q
      ),
    sortComparator: (a, b, sort) => {
      if (sort === 'name_asc') return a.name.localeCompare(b.name);
      if (sort === 'name_desc') return b.name.localeCompare(a.name);
      if (sort === 'created_desc') return (b.createdAt || '').localeCompare(a.createdAt || '');
      if (sort === 'created_asc') return (a.createdAt || '').localeCompare(b.createdAt || '');
      return 0;
    }
  });

  const handleFormSubmit = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    if (editingClient && onUpdateClient) {
      onUpdateClient({
        ...clientData,
        id: editingClient.id,
        createdAt: editingClient.createdAt,
        updatedAt: getTodayLocalDateString()
      });
      toast.success('Ficha de cliente actualizada con éxito.');
    } else {
      onAddClient(clientData);
      toast.success('Cliente registrado exitosamente en el directorio.');
    }
    handleCloseFormModal();
  };

  const handleConfirmDelete = () => {
    if (clientToDelete && onDeleteClient) {
      onDeleteClient(clientToDelete.id);
      toast.info('Cliente eliminado del directorio.');
      setClientToDelete(null);
      if (viewingClient?.id === clientToDelete.id) {
        setViewingClient(null);
      }
    }
  };

  const handleExportCSV = () => {
    exportClientsToCSV(clients);
    toast.success('Archivo CSV exportado con éxito.');
  };

  const handleImportCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      try {
        const parsed = parseClientsCSV(text);
        if (parsed.length === 0) {
          toast.warning('No se encontraron registros válidos para importar en el archivo CSV.');
          return;
        }

        if (onAddClientsBulk) {
          onAddClientsBulk(parsed);
        } else {
          parsed.forEach(c => onAddClient(c));
        }

        toast.success(`¡Se importaron con éxito ${parsed.length} clientes al directorio!`);
      } catch (err) {
        console.error('Error al importar CSV:', err);
        toast.error('Hubo un error al procesar el archivo CSV. Revisa el formato e intenta nuevamente.');
      }
    };
    reader.readAsText(file);
  };

  // Grouped structure
  const groupedClients = useMemo(() => {
    if (!groupByType) return null;
    const empresas = paginatedClients.filter(c => (c.clientType || (c.company ? 'empresa' : 'persona')) === 'empresa');
    const personas = paginatedClients.filter(c => (c.clientType || (c.company ? 'empresa' : 'persona')) === 'persona');
    const groups: { key: string; title: string; items: Client[]; color: string; unitSingular: string; unitPlural: string }[] = [];
    if (empresas.length > 0) {
      groups.push({ key: 'empresa', title: 'Cuentas Corporativas & Empresas', items: empresas, color: '#8b5cf6', unitSingular: 'empresa', unitPlural: 'empresas' });
    }
    if (personas.length > 0) {
      groups.push({ key: 'persona', title: 'Clientes Particulares & Personas', items: personas, color: '#10b981', unitSingular: 'persona', unitPlural: 'personas' });
    }
    return groups;
  }, [paginatedClients, groupByType]);

  const counts = useMemo(() => {
    let empresas = 0;
    let personas = 0;
    clients.forEach(c => {
      const cType = c.clientType || (c.company ? 'empresa' : 'persona');
      if (cType === 'empresa') empresas++;
      else personas++;
    });
    return { total: clients.length, empresas, personas };
  }, [clients]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      
      {/* 1. Header & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', width: '100%' }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
            Directorio de Clientes
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px', marginBottom: 0, lineHeight: 1.4 }}>
            Gestión centralizada de cuentas corporativas y clientes particulares para eventos METODICAH.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus size={18} />}
          onClick={handleOpenCreateModal}
        >
          Nuevo Cliente
        </Button>
      </div>

      {/* 2. Client Type Filter Pills */}
      <ClientTypeFilter
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        counts={counts}
      />

      {/* 3. Actions Toolbar */}
      <ClientActionBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={counts.total}
        filteredCount={sortedClients.length}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        groupByType={groupByType}
        onToggleGroupByType={handleToggleGroupByType}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onExportCSV={handleExportCSV}
        onImportCSV={handleImportCSV}
      />

      {/* 4. Clients Content */}
      {sortedClients.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
            <Search size={28} />
          </div>
          <h3 style={{ color: '#fff', fontSize: '1.1rem' }}>No se encontraron clientes</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '400px' }}>
            {searchQuery ? `No hay resultados para la búsqueda "${searchQuery}".` : 'No hay clientes registrados en esta categoría.'}
          </p>
          {searchQuery && (
            <Button variant="secondary" onClick={() => setSearchQuery('')} style={{ marginTop: '8px' }}>
              Limpiar búsqueda
            </Button>
          )}
        </div>
      ) : groupByType && groupedClients ? (
        /* GROUPED VIEW MODE */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {groupedClients.map(group => (
            <div key={group.key} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <SectionGroupHeader
                title={group.title}
                count={group.items.length}
                color={group.color}
                unitSingular={group.unitSingular}
                unitPlural={group.unitPlural}
              />

              {viewMode === 'compact' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {group.items.map(c => (
                    <ClientRow
                      key={c.id}
                      client={c}
                      onViewDetail={setViewingClient}
                      onEdit={handleOpenEditModal}
                      onDelete={setClientToDelete}
                      onCreateEvent={onCreateEventForClient}
                    />
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
                  {group.items.map(c => (
                    <ClientCard
                      key={c.id}
                      client={c}
                      onViewDetail={setViewingClient}
                      onEdit={handleOpenEditModal}
                      onDelete={setClientToDelete}
                      onCreateEvent={onCreateEventForClient}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : viewMode === 'compact' ? (
        /* COMPACT LIST VIEW MODE */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {paginatedClients.map(c => (
            <ClientRow
              key={c.id}
              client={c}
              onViewDetail={setViewingClient}
              onEdit={handleOpenEditModal}
              onDelete={setClientToDelete}
              onCreateEvent={onCreateEventForClient}
            />
          ))}
        </div>
      ) : (
        /* DEFAULT FLAT VIEW MODE */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
          {paginatedClients.map(c => (
            <ClientCard
              key={c.id}
              client={c}
              onViewDetail={setViewingClient}
              onEdit={handleOpenEditModal}
              onDelete={setClientToDelete}
              onCreateEvent={onCreateEventForClient}
            />
          ))}
        </div>
      )}

      {/* Paginación */}
      {sortedClients.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={sortedClients.length}
          pageSize={10}
          onPageChange={setCurrentPage}
          itemLabel={{ singular: 'cliente', plural: 'clientes' }}
        />
      )}

      {/* 4. MODAL: REGISTRAR / EDITAR CLIENTE */}
      <ClientFormModal
        isOpen={showFormModal}
        editingClient={editingClient}
        onClose={() => {
          setShowFormModal(false);
          setEditingClient(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* 5. MODAL: FICHA COMPLETA & EVENTOS ASOCIADOS */}
      <ClientDetailModal
        client={viewingClient}
        events={events}
        onClose={() => setViewingClient(null)}
        onEdit={handleOpenEditModal}
        onSelectEvent={handleSelectEvent}
        onCreateEvent={onCreateEventForClient}
      />

      {/* 6. MODAL: CONFIRMACIÓN DE ELIMINACIÓN */}
      <ClientDeleteModal
        client={clientToDelete}
        onClose={() => setClientToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
};
