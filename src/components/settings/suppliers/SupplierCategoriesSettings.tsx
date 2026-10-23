import React, { useState } from 'react';
import type { SupplierCategoryConfig } from '../../../types/metodicah';
import { DEFAULT_SUPPLIER_CATEGORIES } from '../../../utils/supplierUtils';
import { Truck, RotateCcw, Plus } from 'lucide-react';
import { SupplierCategoryForm } from './SupplierCategoryForm';
import { SupplierCategoryItem } from './SupplierCategoryItem';
import { ConfirmModal } from '../../common/ConfirmModal';
import { useToast } from '../../../hooks/useToast';

interface SupplierCategoriesSettingsProps {
  supplierCategories: SupplierCategoryConfig[];
  onUpdateSupplierCategories: (categories: SupplierCategoryConfig[]) => void;
  isAdmin: boolean;
}

export const SupplierCategoriesSettings: React.FC<SupplierCategoriesSettingsProps> = ({
  supplierCategories,
  onUpdateSupplierCategories,
  isAdmin
}) => {
  const toast = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<SupplierCategoryConfig | null>(null);
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);

  const existingLabels = supplierCategories.map(c => c.label);

  const handleAddCategory = (label: string, color: string) => {
    const newCategory: SupplierCategoryConfig = {
      id: `cat_${Date.now()}`,
      label,
      color
    };
    onUpdateSupplierCategories([...supplierCategories, newCategory]);
    setShowAddForm(false);
    toast.success(`Rubro "${label}" creado.`);
  };

  const handleSaveEditCategory = (catId: string, label: string, color: string) => {
    const updated = supplierCategories.map(c => 
      c.id === catId ? { ...c, label, color } : c
    );
    onUpdateSupplierCategories(updated);
    setEditingCategoryId(null);
    toast.success('Rubro actualizado.');
  };

  const handleDeleteCategory = (cat: SupplierCategoryConfig) => {
    if (supplierCategories.length <= 1) {
      toast.warning('Debe haber al menos un rubro configurado en el sistema.');
      return;
    }
    setCategoryToDelete(cat);
  };

  const handleConfirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    onUpdateSupplierCategories(supplierCategories.filter(c => c.id !== categoryToDelete.id));
    toast.info(`Rubro "${categoryToDelete.label}" eliminado.`);
    setCategoryToDelete(null);
  };

  const handleResetCategories = () => {
    setIsConfirmResetOpen(true);
  };

  const handleConfirmResetCategories = () => {
    onUpdateSupplierCategories(DEFAULT_SUPPLIER_CATEGORIES);
    setEditingCategoryId(null);
    toast.info('Rubros predeterminados restaurados.');
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Truck size={20} color="#f59e0b" />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>
              Rubros de Proveedores
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Configura los rubros comerciales y especialidades asignables a proveedores en METODICAH.
            </p>
          </div>
        </div>

        {isAdmin && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="button"
              onClick={handleResetCategories}
              className="btn-ghost"
              style={{ fontSize: '0.78rem', padding: '6px 10px' }}
              title="Restaurar rubros predeterminados"
            >
              <RotateCcw size={13} />
              <span>Restaurar por defecto</span>
            </button>

            <button 
              type="button"
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingCategoryId(null);
              }}
              className="btn-primary"
              style={{ fontSize: '0.8rem', padding: '7px 14px' }}
            >
              <Plus size={14} />
              <span>Nuevo Rubro</span>
            </button>
          </div>
        )}
      </div>

      {showAddForm && (
        <SupplierCategoryForm
          onSubmit={handleAddCategory}
          onCancel={() => setShowAddForm(false)}
          existingLabels={existingLabels}
        />
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '10px'
      }}>
        {supplierCategories.map((cat) => (
          <SupplierCategoryItem
            key={cat.id}
            category={cat}
            isEditing={editingCategoryId === cat.id}
            isAdmin={isAdmin}
            existingLabels={existingLabels}
            onStartEdit={() => {
              setEditingCategoryId(cat.id);
              setShowAddForm(false);
            }}
            onCancelEdit={() => setEditingCategoryId(null)}
            onSaveEdit={(label, color) => handleSaveEditCategory(cat.id, label, color)}
            onDelete={() => handleDeleteCategory(cat)}
          />
        ))}
      </div>

      <ConfirmModal
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDeleteCategory}
        title="Eliminar rubro"
        description={`¿Estás seguro de que deseas eliminar el rubro "${categoryToDelete?.label ?? ''}"? Los proveedores que tengan este rubro conservarán su etiqueta.`}
        confirmLabel="Eliminar"
      />

      <ConfirmModal
        isOpen={isConfirmResetOpen}
        onClose={() => setIsConfirmResetOpen(false)}
        onConfirm={handleConfirmResetCategories}
        title="Restaurar rubros predeterminados"
        description="¿Deseas restaurar los rubros predeterminados de proveedores (9 rubros esenciales)?"
        confirmLabel="Restaurar"
        variant="primary"
      />
    </div>
  );
};

