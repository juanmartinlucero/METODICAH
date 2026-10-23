import React, { useMemo } from 'react';
import { useNavigate } from 'react-router';
import type { Supplier, EventItem } from '@/types/metodicah';
import { Plus, Search } from 'lucide-react';
import { SectionGroupHeader } from '@/components/common/SectionGroupHeader';
import { Pagination } from '@/components/common/Pagination';
import { Button } from '@/components/ui';
import { useEntityList } from '@/hooks/useEntityList';
import { SupplierCategoryFilter, SupplierActionBar } from '@/components/suppliers/SuppliersToolbar';
import type { SupplierSortOption } from '@/components/suppliers/SupplierActionBar';
import { SupplierCard } from '@/components/suppliers/SupplierCard';
import { SupplierRow } from '@/components/suppliers/SupplierRow';
import { SupplierFormModal } from '@/components/suppliers/SupplierFormModal';
import { SupplierDetailModal } from '@/components/suppliers/SupplierDetailModal';
import { SupplierDeleteModal } from '@/components/suppliers/SupplierDeleteModal';
import { exportSuppliersToCSV, parseSuppliersCSV, DEFAULT_SUPPLIER_CATEGORIES } from '@/utils/supplierUtils';
import { matchesSearch } from '@/utils/searchUtils';
import { useToast } from '@/hooks/useToast';
import { useSuppliersStore, useEventsStore, useSettingsStore } from '@/stores';

export interface SuppliersViewProps {
  // Vista principal de Proveedores: Smart Container conectado a Zustand y React Router
}

export const SuppliersView: React.FC<SuppliersViewProps> = () => { 
  const navigate = useNavigate();
  const suppliers = useSuppliersStore(s => s.suppliers);
  const onAddSupplier = useSuppliersStore(s => s.addSupplier);
  const onAddSuppliersBulk = useSuppliersStore(s => s.addSuppliersBulk);
  const onUpdateSupplier = useSuppliersStore(s => s.updateSupplier);
  const onDeleteSupplier = useSuppliersStore(s => s.deleteSupplier);
  const events = useEventsStore(s => s.events);
  const onSelectEvent = useEventsStore(s => s.selectEvent);
  const storeCategories = useSettingsStore(s => s.supplierCategories);
  const categories = storeCategories ?? DEFAULT_SUPPLIER_CATEGORIES;
  const toast = useToast();

  const handleSelectEvent = (evt: EventItem) => {
    onSelectEvent(evt);
    navigate(`/events/${evt.id}`);
  };

  // Unified Entity List Hook (Modals, Search, Filter, Sort, ViewMode, Pagination)
  const {
    searchQuery,
    setSearchQuery,
    filterValue: categoryFilter,
    setFilterValue: setCategoryFilter,
    hasActiveFilters,
    resetFilters: handleResetFilters,
    sortBy,
    handleSortChange,
    isGrouped: groupByCategory,
    toggleGrouping: handleToggleGroupByCategory,
    viewMode,
    handleViewModeChange,
    currentPage,
    setCurrentPage,
    sortedItems: sortedSuppliers,
    paginatedItems: paginatedSuppliers,
    showFormModal,
    setShowFormModal,
    editingItem: editingSupplier,
    setEditingItem: setEditingSupplier,
    viewingItem: viewingSupplier,
    setViewingItem: setViewingSupplier,
    itemToDelete: supplierToDelete,
    setItemToDelete: setSupplierToDelete,
    handleOpenCreateModal,
    handleOpenEditModal
  } = useEntityList<Supplier, SupplierSortOption, string>({
    items: suppliers,
    storagePrefix: 'metodicah_suppliers',
    defaultSort: 'name_asc',
    defaultFilter: 'todos',
    pageSize: 10,
    filterPredicate: (s, filter) => {
      if (filter === 'todos') return true;
      return s.category === filter;
    },
    searchPredicate: (s, q) =>
      matchesSearch(
        [
          s.name,
          s.company,
          s.contactName,
          s.email,
          s.phone,
          s.taxId,
          s.equipmentHighlights,
          s.city
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

  const handleFormSubmit = (payload: Omit<Supplier, 'id' | 'createdAt'>) => {
    if (editingSupplier && onUpdateSupplier) {
      onUpdateSupplier({
        ...payload,
        id: editingSupplier.id,
        createdAt: editingSupplier.createdAt
      });
      toast.success('Proveedor actualizado con éxito.');
    } else {
      onAddSupplier(payload);
      toast.success('Proveedor registrado exitosamente.');
    }
    setShowFormModal(false);
    setEditingSupplier(null);
  };

  const handleConfirmDelete = () => {
    if (supplierToDelete && onDeleteSupplier) {
      onDeleteSupplier(supplierToDelete.id);
      toast.info('Proveedor eliminado de la red técnica.');
      if (viewingSupplier?.id === supplierToDelete.id) {
        setViewingSupplier(null);
      }
      setSupplierToDelete(null);
    }
  };

  const handleExportCSV = () => {
    exportSuppliersToCSV(suppliers);
    toast.success('Archivo CSV exportado con éxito.');
  };

  const handleImportCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      try {
        const parsed = parseSuppliersCSV(text);
        if (parsed.length === 0) {
          toast.warning('No se encontraron registros válidos para importar en el archivo CSV.');
          return;
        }

        if (onAddSuppliersBulk) {
          onAddSuppliersBulk(parsed);
        } else {
          parsed.forEach(s => onAddSupplier(s));
        }

        toast.success(`¡Se importaron con éxito ${parsed.length} proveedores a la red técnica!`);
      } catch (err) {
        console.error('Error al importar CSV:', err);
        toast.error('Hubo un error al procesar el archivo CSV. Revisa el formato e intenta nuevamente.');
      }
    };
    reader.readAsText(file);
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    suppliers.forEach(s => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [suppliers]);

  // Grouped structure
  const groupedSuppliers = useMemo(() => {
    if (!groupByCategory) return null;
    const groups: { key: string; title: string; items: Supplier[]; color: string; unitSingular: string; unitPlural: string }[] = [];
    const activeCategories = categories && categories.length > 0 ? categories : DEFAULT_SUPPLIER_CATEGORIES;
    
    activeCategories.forEach(cat => {
      const items = paginatedSuppliers.filter(s => s.category === cat.id);
      if (items.length > 0) {
        groups.push({
          key: cat.id,
          title: cat.label,
          items,
          color: cat.color,
          unitSingular: 'proveedor',
          unitPlural: 'proveedores'
        });
      }
    });

    const otherItems = paginatedSuppliers.filter(s => !activeCategories.some(cat => cat.id === s.category));
    if (otherItems.length > 0) {
      groups.push({
        key: 'unclassified',
        title: 'Otros Servicios',
        items: otherItems,
        color: '#94a3b8',
        unitSingular: 'proveedor',
        unitPlural: 'proveedores'
      });
    }

    return groups;
  }, [paginatedSuppliers, groupByCategory, categories]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      
      {/* 1. Header & Primary Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', width: '100%' }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 600, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
            Red de Proveedores Técnicos
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px', marginBottom: 0, lineHeight: 1.4 }}>
            Directorio especializado de empresas de audio, iluminación, rigging, video, catering y logística para producciones METODICAH.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus size={18} />}
          onClick={handleOpenCreateModal}
        >
          Nuevo Proveedor
        </Button>
      </div>

      {/* 2. Category Filter Pills */}
      <SupplierCategoryFilter
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categoryCounts={categoryCounts}
        totalCount={suppliers.length}
        categories={categories}
      />

      {/* 3. Actions Toolbar: Contador, Orden, Agrupación, Buscador predictivo, CSV & Selector de Vista */}
      <SupplierActionBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={suppliers.length}
        filteredCount={sortedSuppliers.length}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        groupByCategory={groupByCategory}
        onToggleGroupByCategory={handleToggleGroupByCategory}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onExportCSV={handleExportCSV}
        onImportCSV={handleImportCSV}
      />

      {/* 3. Suppliers Content Grid / Rows */}
      {sortedSuppliers.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
            <Search size={28} />
          </div>
          <h3 style={{ color: '#fff', fontSize: '1.1rem' }}>No se encontraron proveedores</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '420px' }}>
            {searchQuery ? `No hay coincidencias para la búsqueda "${searchQuery}".` : 'No hay proveedores registrados en este rubro técnico actualmente.'}
          </p>
          {searchQuery ? (
            <Button variant="secondary" onClick={() => setSearchQuery('')} style={{ marginTop: '8px' }}>
              Limpiar búsqueda
            </Button>
          ) : (
            <Button variant="primary" leftIcon={<Plus size={16} />} onClick={handleOpenCreateModal} style={{ marginTop: '8px' }}>
              Registrar Primer Proveedor
            </Button>
          )}
        </div>
      ) : groupedSuppliers ? (
        /* GROUPED VIEW MODE (Por Rubro) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {groupedSuppliers.map(group => (
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
                  {group.items.map(s => (
                    <SupplierRow
                      key={s.id}
                      supplier={s}
                      categories={categories}
                      onViewDetail={setViewingSupplier}
                      onEdit={handleOpenEditModal}
                      onDelete={setSupplierToDelete}
                    />
                  ))}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
                  {group.items.map(s => (
                    <SupplierCard
                      key={s.id}
                      supplier={s}
                      categories={categories}
                      onViewDetail={setViewingSupplier}
                      onEdit={handleOpenEditModal}
                      onDelete={setSupplierToDelete}
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
          {paginatedSuppliers.map(s => (
            <SupplierRow
              key={s.id}
              supplier={s}
              categories={categories}
              onViewDetail={setViewingSupplier}
              onEdit={handleOpenEditModal}
              onDelete={setSupplierToDelete}
            />
          ))}
        </div>
      ) : (
        /* DETAILED CARDS GRID */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
          {paginatedSuppliers.map(s => (
            <SupplierCard
              key={s.id}
              supplier={s}
              categories={categories}
              onViewDetail={setViewingSupplier}
              onEdit={handleOpenEditModal}
              onDelete={setSupplierToDelete}
            />
          ))}
        </div>
      )}

      {/* Paginación */}
      {sortedSuppliers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={sortedSuppliers.length}
          pageSize={10}
          onPageChange={setCurrentPage}
          itemLabel={{ singular: 'proveedor', plural: 'proveedores' }}
        />
      )}

      {/* 4. MODAL: REGISTRAR / EDITAR PROVEEDOR */}
      <SupplierFormModal
        isOpen={showFormModal}
        editingSupplier={editingSupplier}
        categories={categories}
        onClose={() => {
          setShowFormModal(false);
          setEditingSupplier(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* 5. MODAL: FICHA COMPLETA & HISTORIAL DE EVENTOS */}
      <SupplierDetailModal
        supplier={viewingSupplier}
        events={events}
        categories={categories}
        onClose={() => setViewingSupplier(null)}
        onEdit={handleOpenEditModal}
        onSelectEvent={handleSelectEvent}
      />

      {/* 6. MODAL: CONFIRMACIÓN DE ELIMINACIÓN */}
      <SupplierDeleteModal
        supplier={supplierToDelete}
        onClose={() => setSupplierToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

    </div>
  );
};
