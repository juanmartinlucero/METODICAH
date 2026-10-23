import React, { useState } from 'react';
import { DEFAULT_CREW_SECTORS } from '../../../utils/crewUtils';
import { Users, RotateCcw } from 'lucide-react';
import { CrewDepartmentForm } from './CrewDepartmentForm';
import { CrewDepartmentItem } from './CrewDepartmentItem';
import { ConfirmModal } from '../../common/ConfirmModal';
import { useToast } from '../../../hooks/useToast';

interface CrewDepartmentsSettingsProps {
  crewSectors: string[];
  onUpdateCrewSectors: (sectors: string[]) => void;
  isAdmin: boolean;
}

export const CrewDepartmentsSettings: React.FC<CrewDepartmentsSettingsProps> = ({
  crewSectors,
  onUpdateCrewSectors,
  isAdmin
}) => {
  const toast = useToast();
  const [editingSectorIndex, setEditingSectorIndex] = useState<number | null>(null);
  const [sectorToDelete, setSectorToDelete] = useState<{ index: number; name: string } | null>(null);
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);

  const handleAddSector = (name: string) => {
    onUpdateCrewSectors([...crewSectors, name]);
    toast.success(`Departamento "${name}" agregado.`);
  };

  const handleSaveEditSector = (index: number, newName: string) => {
    const updated = [...crewSectors];
    updated[index] = newName;
    onUpdateCrewSectors(updated);
    setEditingSectorIndex(null);
    toast.success('Departamento actualizado.');
  };

  const handleDeleteSector = (index: number, sectorName: string) => {
    if (crewSectors.length <= 1) {
      toast.warning('Debe haber al menos un departamento configurado en el sistema.');
      return;
    }
    setSectorToDelete({ index, name: sectorName });
  };

  const handleConfirmDeleteSector = () => {
    if (!sectorToDelete) return;
    onUpdateCrewSectors(crewSectors.filter((_, i) => i !== sectorToDelete.index));
    toast.info(`Departamento "${sectorToDelete.name}" eliminado.`);
    setSectorToDelete(null);
  };

  const handleResetSectors = () => {
    setIsConfirmResetOpen(true);
  };

  const handleConfirmResetSectors = () => {
    onUpdateCrewSectors(DEFAULT_CREW_SECTORS);
    setEditingSectorIndex(null);
    toast.info('Departamentos predeterminados restaurados.');
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Users size={20} color="#f59e0b" />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>
              Departamentos de Crew & Staff
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Configura las áreas operativas y sectores técnicos asignables al personal y colaboradores de producción.
            </p>
          </div>
        </div>

        {isAdmin && (
          <button 
            type="button"
            onClick={handleResetSectors}
            className="btn-ghost"
            style={{ fontSize: '0.78rem', padding: '6px 10px' }}
            title="Restaurar departamentos predeterminados"
          >
            <RotateCcw size={13} />
            <span>Restaurar por defecto</span>
          </button>
        )}
      </div>

      {isAdmin && (
        <CrewDepartmentForm
          onSubmit={handleAddSector}
          existingNames={crewSectors}
        />
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '10px'
      }}>
        {crewSectors.map((sectorName, idx) => (
          <CrewDepartmentItem
            key={idx}
            name={sectorName}
            index={idx}
            isEditing={editingSectorIndex === idx}
            isAdmin={isAdmin}
            existingNames={crewSectors}
            onStartEdit={() => setEditingSectorIndex(idx)}
            onCancelEdit={() => setEditingSectorIndex(null)}
            onSaveEdit={(newName) => handleSaveEditSector(idx, newName)}
            onDelete={() => handleDeleteSector(idx, sectorName)}
          />
        ))}
      </div>

      <ConfirmModal
        isOpen={Boolean(sectorToDelete)}
        onClose={() => setSectorToDelete(null)}
        onConfirm={handleConfirmDeleteSector}
        title="Eliminar departamento"
        description={`¿Estás seguro de que deseas eliminar el departamento "${sectorToDelete?.name ?? ''}"?`}
        confirmLabel="Eliminar"
      />

      <ConfirmModal
        isOpen={isConfirmResetOpen}
        onClose={() => setIsConfirmResetOpen(false)}
        onConfirm={handleConfirmResetSectors}
        title="Restaurar departamentos predeterminados"
        description="¿Deseas restaurar los departamentos predeterminados de Crew (10 sectores técnicos)?"
        confirmLabel="Restaurar"
        variant="primary"
      />
    </div>
  );
};

