import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import type { EventCrewMember, EventItem } from '@/types/metodicah';
import { Plus, Search } from 'lucide-react';
import { SectionGroupHeader } from '@/components/common/SectionGroupHeader';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/ui';
import { useEntityList } from '@/hooks/useEntityList';
import { CrewDepartmentFilter, CrewActionBar } from '@/components/crew/CrewToolbar';
import type { CrewSortOption } from '@/components/crew/CrewActionBar';
import { CrewCard } from '@/components/crew/CrewCard';
import { CrewRow } from '@/components/crew/CrewRow';
import { CrewFormModal } from '@/components/crew/CrewFormModal';
import { CrewDetailModal } from '@/components/crew/CrewDetailModal';
import { CrewDeleteModal } from '@/components/crew/CrewDeleteModal';
import { exportCrewToCSV, parseCrewCSV, DEFAULT_CREW_SECTORS } from '@/utils/crewUtils';
import { matchesSearch } from '@/utils/searchUtils';
import { useToast } from '@/hooks/useToast';
import { useCrewStore, useEventsStore, useSettingsStore, useAuthStore } from '@/stores';

export interface CrewViewProps {
  // Vista principal de Crew: Smart Container conectado a Zustand y React Router
}

const SENIORITY_WEIGHT: Record<string, number> = {
  lead: 4,
  senior: 3,
  semi_senior: 2,
  junior: 1
};

export const CrewView: React.FC<CrewViewProps> = () => {
  const navigate = useNavigate();
  const crewMembers = useCrewStore(s => s.crewMembers);
  const onAddCrewMember = useCrewStore(s => s.addCrewMember);
  const onAddCrewMembersBulk = useCrewStore(s => s.addCrewMembersBulk);
  const onUpdateCrewMember = useCrewStore(s => s.updateCrewMember);
  const onDeleteCrewMember = useCrewStore(s => s.deleteCrewMember);
  const events = useEventsStore(s => s.events);
  const onSelectEvent = useEventsStore(s => s.selectEvent);
  const storeSectors = useSettingsStore(s => s.crewSectors);
  const storeUser = useSettingsStore(s => s.currentUser);
  const sectors = storeSectors ?? DEFAULT_CREW_SECTORS;
  const isAdmin = storeUser.globalRole === 'admin';
  const toast = useToast();

  const handleSelectEvent = (evt: EventItem) => {
    onSelectEvent(evt);
    navigate(`/events/${evt.id}`);
  };

  // Unified Entity List Hook (Modals, Search, Filter, Sort, ViewMode, Pagination)
  const {
    searchQuery,
    setSearchQuery,
    filterValue: sectorFilter,
    setFilterValue: setSectorFilter,
    hasActiveFilters,
    resetFilters: handleResetFilters,
    sortBy,
    handleSortChange,
    isGrouped: groupByContract,
    toggleGrouping: handleToggleGroupByContract,
    viewMode,
    handleViewModeChange,
    currentPage,
    setCurrentPage,
    sortedItems: sortedCrew,
    paginatedItems: paginatedCrew,
    showFormModal,
    setShowFormModal,
    editingItem: editingMember,
    setEditingItem: setEditingMember,
    viewingItem: viewingMember,
    setViewingItem: setViewingMember,
    itemToDelete: memberToDelete,
    setItemToDelete: setMemberToDelete,
    handleOpenCreateModal,
    handleOpenEditModal
  } = useEntityList<EventCrewMember, CrewSortOption, string>({
    items: crewMembers,
    storagePrefix: 'metodicah_crew',
    defaultSort: 'name_asc',
    defaultFilter: 'todos',
    pageSize: 10,
    filterPredicate: (m, filter) => {
      if (filter === 'todos') return true;
      return m.sector === filter;
    },
    searchPredicate: (m, q) =>
      matchesSearch(
        [
          m.userName,
          m.roleInEvent,
          m.sector,
          m.userEmail,
          m.phone,
          m.documentNumber,
          m.taxId,
          m.city
        ],
        q
      ),
    sortComparator: (a, b, sort) => {
      if (sort === 'name_asc') return a.userName.localeCompare(b.userName);
      if (sort === 'name_desc') return b.userName.localeCompare(a.userName);
      if (sort === 'seniority_desc') {
        const weightA = SENIORITY_WEIGHT[a.seniority || 'junior'] || 0;
        const weightB = SENIORITY_WEIGHT[b.seniority || 'junior'] || 0;
        if (weightB !== weightA) return weightB - weightA;
        return a.userName.localeCompare(b.userName);
      }
      if (sort === 'created_desc') return (b.createdAt || '').localeCompare(a.createdAt || '');
      if (sort === 'created_asc') return (a.createdAt || '').localeCompare(b.createdAt || '');
      return 0;
    }
  });

  const teamMembers = useAuthStore(s => s.teamMembers);
  const onAddTeamMember = useAuthStore(s => s.addTeamMember);
  const onUpdateTeamMember = useAuthStore(s => s.updateTeamMember);
  const onRemoveTeamMember = useAuthStore(s => s.removeTeamMember);

  const handleFormSubmit = async (payload: Omit<EventCrewMember, 'id' | 'userId'> & { password?: string }) => {
    const { password, ...crewPayload } = payload;

    if (editingMember) {
      const updated: EventCrewMember = {
        ...crewPayload,
        id: editingMember.id,
        userId: editingMember.userId,
        createdAt: editingMember.createdAt
      };
      onUpdateCrewMember(updated);
      if (viewingMember?.id === editingMember.id) {
        setViewingMember(updated);
      }

      // Sincronizar usuario de autenticación si se habilitó acceso al sistema
      if (payload.hasSystemAccess && payload.globalRole) {
        const existingAuthMember = teamMembers.find(
          m => m.id === editingMember.userId || m.email.toLowerCase() === payload.userEmail.toLowerCase()
        );
        if (existingAuthMember) {
          await onUpdateTeamMember(existingAuthMember.id, {
            name: payload.userName,
            email: payload.userEmail,
            globalRole: payload.globalRole,
            phone: payload.phone,
            specialty: payload.roleInEvent
          });
        } else if (password) {
          await onAddTeamMember({
            name: payload.userName,
            email: payload.userEmail,
            password: password,
            globalRole: payload.globalRole,
            phone: payload.phone,
            specialty: payload.roleInEvent
          });
        }
      }

      toast.success('Ficha técnica de crew actualizada con éxito.');
    } else {
      onAddCrewMember(crewPayload);

      // Si se habilitó acceso a plataforma, dar de alta la cuenta de login
      if (payload.hasSystemAccess && payload.globalRole) {
        try {
          await onAddTeamMember({
            name: payload.userName,
            email: payload.userEmail,
            password: password || 'Metodicah2026!',
            globalRole: payload.globalRole,
            phone: payload.phone,
            specialty: payload.roleInEvent
          });
        } catch (authErr) {
          console.warn('[CrewView] No se pudo crear el usuario de acceso:', authErr);
        }
      }

      toast.success('Miembro de crew incorporado exitosamente.');
    }
    setShowFormModal(false);
    setEditingMember(null);
  };

  const handleConfirmDelete = async () => {
    if (memberToDelete) {
      // Si el miembro tenía cuenta de sistema vinculada, dar de baja en auth
      if (memberToDelete.hasSystemAccess) {
        const existingAuthMember = teamMembers.find(
          m => m.id === memberToDelete.userId || m.email.toLowerCase() === memberToDelete.userEmail.toLowerCase()
        );
        if (existingAuthMember) {
          try {
            await onRemoveTeamMember(existingAuthMember.id);
          } catch (e) {
            console.warn('[CrewView] Error al dar de baja cuenta vinculada:', e);
          }
        }
      }

      onDeleteCrewMember(memberToDelete.id);
      toast.info('Miembro eliminado del equipo técnico.');
      if (viewingMember?.id === memberToDelete.id) {
        setViewingMember(null);
      }
      setMemberToDelete(null);
    }
  };

  const handleExportCSV = () => {
    exportCrewToCSV(crewMembers);
    toast.success('Archivo CSV exportado con éxito.');
  };

  const handleImportCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      try {
        const parsed = parseCrewCSV(text);
        if (parsed.length === 0) {
          toast.warning('No se encontraron registros válidos para importar en el archivo CSV.');
          return;
        }

        if (onAddCrewMembersBulk) {
          onAddCrewMembersBulk(parsed);
        } else {
          parsed.forEach(m => onAddCrewMember(m));
        }

        toast.success(`¡Se importaron con éxito ${parsed.length} miembros al equipo técnico!`);
      } catch (err) {
        console.error('Error al importar CSV:', err);
        toast.error('Hubo un error al procesar el archivo CSV. Revisa el formato e intenta nuevamente.');
      }
    };
    reader.readAsText(file);
  };

  // Grouped structure
  const groupedCrew = useMemo(() => {
    if (!groupByContract) return null;
    const staff = paginatedCrew.filter(m => (m.type || 'staff_interno') !== 'freelancer');
    const freelance = paginatedCrew.filter(m => m.type === 'freelancer');
    const groups: { key: string; title: string; items: EventCrewMember[]; color: string; unitSingular: string; unitPlural: string }[] = [];
    if (staff.length > 0) {
      groups.push({
        key: 'staff_interno',
        title: 'Staff Fijo Interno',
        items: staff,
        color: '#38bdf8',
        unitSingular: 'miembro',
        unitPlural: 'miembros'
      });
    }
    if (freelance.length > 0) {
      groups.push({
        key: 'freelancer',
        title: 'Colaboradores Técnicos Freelance',
        items: freelance,
        color: '#fbbf24',
        unitSingular: 'colaborador',
        unitPlural: 'colaboradores'
      });
    }
    return groups;
  }, [paginatedCrew, groupByContract]);

  const sectorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    crewMembers.forEach(m => {
      counts[m.sector] = (counts[m.sector] || 0) + 1;
    });
    return counts;
  }, [crewMembers]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      
      {/* 1. Header & Primary Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', width: '100%' }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
            Equipo de Producción & Crew
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px', marginBottom: 0, lineHeight: 1.4 }}>
            Directorio del staff fijo y colaboradores técnicos independientes asignables a producciones.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            leftIcon={<Plus size={18} />}
            onClick={handleOpenCreateModal}
          >
            Nuevo Miembro
          </Button>
        )}
      </div>

      {/* 2. Department Filter Pills */}
      <CrewDepartmentFilter
        sectorFilter={sectorFilter}
        onSectorFilterChange={setSectorFilter}
        sectorCounts={sectorCounts}
        totalCount={crewMembers.length}
        sectors={sectors}
      />

      {/* 3. Actions Toolbar: Contador, Orden, Agrupación, Buscador predictivo, CSV & Selector de Vista */}
      <CrewActionBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={crewMembers.length}
        filteredCount={sortedCrew.length}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        groupByContract={groupByContract}
        onToggleGroupByContract={handleToggleGroupByContract}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onExportCSV={handleExportCSV}
        onImportCSV={handleImportCSV}
      />

      {/* 3. Crew Content Grid / Rows */}
      {sortedCrew.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
            <Search size={28} />
          </div>
          <h3 style={{ color: '#fff', fontSize: '1.1rem' }}>No se encontraron miembros de equipo</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '420px' }}>
            {searchQuery ? `No hay resultados para la búsqueda "${searchQuery}".` : 'No hay personal registrado en este sector técnico actualmente.'}
          </p>
          {searchQuery ? (
            <Button variant="secondary" onClick={() => setSearchQuery('')} style={{ marginTop: '8px' }}>
              Limpiar búsqueda
            </Button>
          ) : isAdmin ? (
            <Button variant="primary" leftIcon={<Plus size={16} />} onClick={handleOpenCreateModal} style={{ marginTop: '8px' }}>
              Registrar Primer Miembro
            </Button>
          ) : null}
        </div>
      ) : groupedCrew ? (
        /* GROUPED VIEW MODE (Por Contrato) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {groupedCrew.map(group => (
            <div key={group.key} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <SectionGroupHeader
                title={group.title}
                count={group.items.length}
                unitSingular={group.unitSingular}
                unitPlural={group.unitPlural}
                color={group.color}
              />
              {viewMode === 'compact' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {group.items.map(m => (
                    <CrewRow
                      key={m.id}
                      member={m}
                      onViewDetail={setViewingMember}
                      onEdit={handleOpenEditModal}
                      onDelete={setMemberToDelete}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
                  {group.items.map(m => (
                    <CrewCard
                      key={m.id}
                      member={m}
                      onViewDetail={setViewingMember}
                      onEdit={handleOpenEditModal}
                      onDelete={setMemberToDelete}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : viewMode === 'compact' ? (
        /* COMPACT ROWS */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {paginatedCrew.map(m => (
            <CrewRow
              key={m.id}
              member={m}
              onViewDetail={setViewingMember}
              onEdit={handleOpenEditModal}
              onDelete={setMemberToDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      ) : (
        /* DETAILED CARDS GRID */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
          {paginatedCrew.map(m => (
            <CrewCard
              key={m.id}
              member={m}
              onViewDetail={setViewingMember}
              onEdit={handleOpenEditModal}
              onDelete={setMemberToDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      {/* Paginación */}
      {sortedCrew.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={sortedCrew.length}
          pageSize={10}
          onPageChange={setCurrentPage}
          itemLabel={{ singular: 'miembro', plural: 'miembros' }}
        />
      )}

      {/* 4. MODAL: REGISTRAR / EDITAR MIEMBRO */}
      <CrewFormModal
        isOpen={showFormModal}
        editingMember={editingMember}
        sectors={sectors}
        onClose={() => {
          setShowFormModal(false);
          setEditingMember(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* 5. MODAL: FICHA COMPLETA & EVENTOS ASIGNADOS */}
      <CrewDetailModal
        member={viewingMember}
        events={events}
        onClose={() => setViewingMember(null)}
        onEdit={handleOpenEditModal}
        onSelectEvent={handleSelectEvent}
        isAdmin={isAdmin}
      />

      {/* 6. MODAL: CONFIRMACIÓN DE ELIMINACIÓN */}
      <CrewDeleteModal
        member={memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
};
