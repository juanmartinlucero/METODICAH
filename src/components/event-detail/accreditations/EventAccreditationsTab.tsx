import React, { useState, useMemo } from 'react';
import type { EventItem, AccreditationItem } from '@/types/metodicah';
import { useEventsStore } from '@/stores';
import { 
  calculateAccreditationStats, 
  exportAccreditationsToExcel, 
  exportAccreditationsToPDF
} from '@/utils/accreditationUtils';
import { matchesSearch } from '@/utils/searchUtils';
import { useToast } from '@/hooks/useToast';
import { FilterPills } from '@/components/FilterPills';
import { AccreditationTable } from './AccreditationTable';
import { AccreditationFormModal } from './AccreditationFormModal';
import { AccreditationBadgeModal } from './AccreditationBadgeModal';
import { AccreditationCheckInScannerModal } from './AccreditationCheckInScannerModal';
import { AccreditationImportModal } from './AccreditationImportModal';
import { 
  Plus, 
  Search, 
  Download, 
  FileSpreadsheet, 
  QrCode, 
  UploadCloud, 
  UserCheck, 
  ShieldCheck, 
  Users, 
  Layers,
  AlertCircle
} from 'lucide-react';

interface EventAccreditationsTabProps {
  event: EventItem;
}

type StatusFilter = 'todos' | 'en_sitio' | 'pendientes' | 'sin_art';

export const EventAccreditationsTab: React.FC<EventAccreditationsTabProps> = ({ event }) => {
  const toast = useToast();
  
  // Zustand store
  const accreditationsMap = useEventsStore(s => s.accreditationsMap);
  const onAddAccreditation = useEventsStore(s => s.addAccreditation);
  const onUpdateAccreditation = useEventsStore(s => s.updateAccreditation);
  const onDeleteAccreditation = useEventsStore(s => s.deleteAccreditation);
  const onToggleCheckIn = useEventsStore(s => s.toggleCheckIn);
  const onBulkAdd = useEventsStore(s => s.bulkAddAccreditations);

  const rawAccreditations = accreditationsMap[event.id];
  const accreditations = useMemo(() => rawAccreditations || [], [rawAccreditations]);
  const stats = useMemo(() => calculateAccreditationStats(accreditations), [accreditations]);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [accessFilter, setAccessFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [companyFilter, setCompanyFilter] = useState<string>('todos');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<AccreditationItem | null>(null);
  const [badgeItem, setBadgeItem] = useState<AccreditationItem | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Unique companies
  const uniqueCompanies = useMemo(() => {
    return Array.from(new Set(accreditations.map(i => i.company).filter(Boolean)));
  }, [accreditations]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return accreditations.filter(item => {
      // 1. Level filter
      if (accessFilter !== 'todos' && item.accessLevel !== accessFilter) {
        return false;
      }

      // 2. Status filter
      if (statusFilter === 'en_sitio' && item.status !== 'en_sitio') return false;
      if (statusFilter === 'pendientes' && item.status === 'en_sitio') return false;
      if (statusFilter === 'sin_art' && item.insuranceVerified) return false;

      // 3. Company filter
      if (companyFilter !== 'todos' && item.company !== companyFilter) return false;

      // 4. Search query
      if (searchQuery.trim()) {
        const matches = matchesSearch(
          [
            item.firstName,
            item.lastName,
            item.documentNumber,
            item.role,
            item.company,
            item.accessLevel,
            item.notes || ''
          ],
          searchQuery
        );
        if (!matches) return false;
      }

      return true;
    });
  }, [accreditations, accessFilter, statusFilter, companyFilter, searchQuery]);

  // Handlers
  const handleSaveItem = (data: Omit<AccreditationItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (itemToEdit) {
      onUpdateAccreditation({
        ...itemToEdit,
        ...data,
        updatedAt: new Date().toISOString()
      });
      toast.success('Acreditación actualizada correctamente');
    } else {
      onAddAccreditation(data);
      toast.success('Acreditación registrada exitosamente');
    }
  };

  const handleToggleCheckIn = (id: string) => {
    const item = accreditations.find(i => i.id === id);
    const isEntering = item?.status !== 'en_sitio';
    onToggleCheckIn(event.id, id);
    toast.success(
      isEntering 
        ? `Ingreso confirmado para ${item?.firstName} ${item?.lastName}` 
        : `Salida registrada para ${item?.firstName} ${item?.lastName}`
    );
  };

  const handleDeleteItem = (id: string) => {
    onDeleteAccreditation(event.id, id);
    toast.success('Acreditación eliminada');
  };

  const handleBulkImport = (newItems: Omit<AccreditationItem, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    onBulkAdd(event.id, newItems);
    toast.success(`Se importaron ${newItems.length} acreditaciones con éxito`);
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      await exportAccreditationsToExcel(filteredItems, event.title);
      toast.success('Archivo Excel descargado con éxito');
    } catch {
      toast.error('Error al generar archivo Excel');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      await exportAccreditationsToPDF(filteredItems, event);
      toast.success('Planilla oficial en PDF descargada');
    } catch {
      toast.error('Error al generar planilla PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. TOP HUD ANALYTICS (Live Headcount & Control) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        
        {/* Total Acreditaciones */}
        <div className="glass-card" style={{ padding: '16px 20px', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Acreditados
            </span>
            <Users size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {stats.aprobadasCount} autorizadas · {stats.solicitadasCount} pendientes
          </div>
        </div>

        {/* Headcount en Vivo */}
        <div className="glass-card" style={{ padding: '16px 20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Presentes en Sitio
            </span>
            <UserCheck size={18} color="#10b981" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10b981' }}>
              {stats.enSitioCount}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              ({stats.headcountPercentage}%)
            </span>
          </div>
          {/* Progress bar */}
          <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(stats.headcountPercentage, 100)}%`, height: '100%', background: '#10b981', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        {/* Cobertura ART / Seguros */}
        <div className="glass-card" style={{ padding: '16px 20px', borderLeft: `4px solid ${stats.artFaltanteCount > 0 ? '#f59e0b' : '#10b981'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Seguridad & ART
            </span>
            {stats.artFaltanteCount > 0 ? <AlertCircle size={18} color="#f59e0b" /> : <ShieldCheck size={18} color="#10b981" />}
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
            {stats.artVerificadaCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 400 }}>/ {stats.total}</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: stats.artFaltanteCount > 0 ? '#f59e0b' : '#10b981', marginTop: '4px' }}>
            {stats.artFaltanteCount > 0 ? `⚠️ ${stats.artFaltanteCount} personas sin constancia ART` : '✓ 100% Cobertura validada'}
          </div>
        </div>

        {/* Desglose por Nivel de Acceso */}
        <div className="glass-card" style={{ padding: '16px 20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Zonas de Acceso
            </span>
            <Layers size={18} color="#f59e0b" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: '#f59e0b', fontWeight: 700 }}>{stats.allAccessCount}</span>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>ALL ACCESS</div>
            </div>
            <div>
              <span style={{ color: '#10b981', fontWeight: 700 }}>{stats.staffCount}</span>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>STAFF</div>
            </div>
            <div>
              <span style={{ color: '#0284c7', fontWeight: 700 }}>{stats.guestCount}</span>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>GUEST</div>
            </div>
          </div>
        </div>

      </div>

      {/* 2. TOOLBAR & FILTERS */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        {/* Row 1: Actions & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Search box */}
          <div style={{ position: 'relative', minWidth: '280px', flex: '1 1 280px' }}>
            <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, DNI, rol o empresa..."
              className="input-field"
              style={{ width: '100%', paddingLeft: '36px', fontSize: '0.82rem' }}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            
            <button
              onClick={() => setIsScannerOpen(true)}
              className="btn-secondary"
              title="Abrir terminal para lector de código QR o verificación rápida de DNI"
              style={{ fontSize: '0.82rem', padding: '8px 12px', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#10b981' }}
            >
              <QrCode size={15} />
              <span>Control Puerta / QR</span>
            </button>

            <button
              onClick={() => setIsImportOpen(true)}
              className="btn-secondary"
              title="Cargar nóminas masivas en formato CSV"
              style={{ fontSize: '0.82rem', padding: '8px 12px' }}
            >
              <UploadCloud size={15} />
              <span>Importar CSV</span>
            </button>

            <button
              onClick={handleExportExcel}
              disabled={isExporting}
              className="btn-secondary"
              title="Descargar archivo Excel con datos completos"
              style={{ fontSize: '0.82rem', padding: '8px 12px' }}
            >
              <FileSpreadsheet size={15} />
              <span>Excel</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="btn-secondary"
              title="Descargar planilla oficial apaisada en PDF para firmas"
              style={{ fontSize: '0.82rem', padding: '8px 12px' }}
            >
              <Download size={15} />
              <span>Planilla PDF</span>
            </button>

            <button
              onClick={() => {
                setItemToEdit(null);
                setIsFormOpen(true);
              }}
              className="btn-primary"
              style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            >
              <Plus size={15} />
              <span>Nueva Acreditación</span>
            </button>

          </div>
        </div>

        {/* Row 2: Category Filter Pills (ALL ACCESS, STAFF, GUEST) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
          
          <FilterPills
            options={[
              { id: 'todos', label: 'Todos los Niveles', count: accreditations.length },
              { id: 'ALL ACCESS', label: 'ALL ACCESS', count: stats.allAccessCount },
              { id: 'STAFF', label: 'STAFF', count: stats.staffCount },
              { id: 'GUEST', label: 'GUEST', count: stats.guestCount }
            ]}
            selectedId={accessFilter}
            onSelect={setAccessFilter}
          />

          {/* Secondary select filters: Estado & Empresa */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="input-field"
              style={{ fontSize: '0.78rem', padding: '6px 10px' }}
            >
              <option value="todos">Todos los Estados ({accreditations.length})</option>
              <option value="en_sitio">En Sitio / Presentes ({stats.enSitioCount})</option>
              <option value="pendientes">Pendientes de Ingreso ({stats.total - stats.enSitioCount})</option>
              <option value="sin_art">Sin Seguro ART ({stats.artFaltanteCount})</option>
            </select>

            {uniqueCompanies.length > 1 && (
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="input-field"
                style={{ fontSize: '0.78rem', padding: '6px 10px', maxWidth: '200px' }}
              >
                <option value="todos">Todas las Empresas</option>
                {uniqueCompanies.map(comp => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>
            )}
          </div>

        </div>

      </div>

      {/* 3. TABLE OF ACCREDITATIONS */}
      <AccreditationTable
        items={filteredItems}
        onToggleCheckIn={handleToggleCheckIn}
        onOpenBadgeModal={(item) => setBadgeItem(item)}
        onOpenEditModal={(item) => {
          setItemToEdit(item);
          setIsFormOpen(true);
        }}
        onDeleteAccreditation={handleDeleteItem}
      />

      {/* 4. MODALS */}
      {isFormOpen && (
        <AccreditationFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setItemToEdit(null);
          }}
          eventId={event.id}
          itemToEdit={itemToEdit}
          onSave={handleSaveItem}
        />
      )}

      {badgeItem && (
        <AccreditationBadgeModal
          isOpen={!!badgeItem}
          onClose={() => setBadgeItem(null)}
          accreditation={badgeItem}
          event={event}
        />
      )}

      {isScannerOpen && (
        <AccreditationCheckInScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          accreditations={accreditations}
          onToggleCheckIn={handleToggleCheckIn}
        />
      )}

      {isImportOpen && (
        <AccreditationImportModal
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
          eventId={event.id}
          existingItems={accreditations}
          onImport={handleBulkImport}
        />
      )}

    </div>
  );
};
