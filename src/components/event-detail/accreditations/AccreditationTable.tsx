import React, { useState } from 'react';
import type { AccreditationItem } from '@/types/metodicah';
import { ACCESS_LEVEL_CONFIG } from '@/utils/accreditationUtils';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { 
  Building2, 
  IdCard, 
  ShieldCheck, 
  AlertCircle, 
  LogIn, 
  LogOut, 
  Sparkles, 
  PenLine, 
  Trash2,
  Phone,
  UserCheck
} from 'lucide-react';

interface AccreditationTableProps {
  items: AccreditationItem[];
  onToggleCheckIn: (id: string) => void;
  onOpenBadgeModal: (item: AccreditationItem) => void;
  onOpenEditModal: (item: AccreditationItem) => void;
  onDeleteAccreditation: (id: string) => void;
}

export const AccreditationTable: React.FC<AccreditationTableProps> = ({
  items,
  onToggleCheckIn,
  onOpenBadgeModal,
  onOpenEditModal,
  onDeleteAccreditation
}) => {
  const [itemToDelete, setItemToDelete] = useState<AccreditationItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center' }}>
        <IdCard size={40} color="var(--text-dim)" style={{ margin: '0 auto 12px auto', opacity: 0.7 }} />
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
          No hay acreditaciones en este filtro
        </h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
          Prueba cambiando el nivel de acceso seleccionado o registra una nueva acreditación para la producción.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-panel" style={{ overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderBottom: '1px solid var(--border-subtle)',
              color: 'var(--text-dim)',
              fontSize: '0.74rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              <th style={{ padding: '14px 18px' }}>Persona</th>
              <th style={{ padding: '14px 16px' }}>Rol / Función</th>
              <th style={{ padding: '14px 16px' }}>Empresa</th>
              <th style={{ padding: '14px 16px' }}>Nivel de Acceso</th>
              <th style={{ padding: '14px 16px' }}>ART / Seguro</th>
              <th style={{ padding: '14px 16px' }}>Control & Check-In</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const accessCfg = ACCESS_LEVEL_CONFIG[item.accessLevel] || ACCESS_LEVEL_CONFIG.STAFF;
              const isCheckedIn = item.status === 'en_sitio';

              return (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    background: isCheckedIn 
                      ? 'rgba(16, 185, 129, 0.025)' 
                      : idx % 2 === 0 
                        ? 'transparent' 
                        : 'rgba(255, 255, 255, 0.01)',
                    transition: 'background 0.15s ease'
                  }}
                  className="table-row-hover"
                >
                  {/* Persona: Nombre, Apellido, DNI */}
                  <td style={{ padding: '12px 18px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>
                        {item.firstName} {item.lastName}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                        <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                          DNI: {item.documentNumber}
                        </span>
                        {item.emergencyPhone && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Phone size={11} /> {item.emergencyPhone}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Rol */}
                  <td style={{ padding: '12px 16px', color: '#e2e8f0', fontWeight: 500 }}>
                    {item.role}
                  </td>

                  {/* Empresa */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                      <Building2 size={13} color="var(--text-dim)" />
                      <span>{item.company}</span>
                    </div>
                  </td>

                  {/* Nivel de Acceso (ALL ACCESS, STAFF, GUEST) */}
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      background: accessCfg.bg,
                      color: accessCfg.color,
                      border: `1px solid ${accessCfg.border}`
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: accessCfg.color }} />
                      {item.accessLevel}
                    </span>
                  </td>

                  {/* ART / Seguro */}
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      background: item.insuranceVerified ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.1)',
                      color: item.insuranceVerified ? '#10b981' : '#f43f5e',
                      border: `1px solid ${item.insuranceVerified ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.25)'}`
                    }}>
                      {item.insuranceVerified ? <ShieldCheck size={13} /> : <AlertCircle size={13} />}
                      {item.insuranceVerified ? 'ART OK' : 'Sin ART'}
                    </span>
                  </td>

                  {/* Control & Check-In */}
                  <td style={{ padding: '12px 16px' }}>
                    {isCheckedIn ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          background: 'rgba(16, 185, 129, 0.18)',
                          color: '#10b981',
                          border: '1px solid rgba(16, 185, 129, 0.4)'
                        }}>
                          <UserCheck size={13} />
                          EN SITIO {item.checkInAt ? `(${item.checkInAt.split('T')[1]?.slice(0, 5)} hs)` : ''}
                        </span>

                        <button
                          type="button"
                          onClick={() => onToggleCheckIn(item.id)}
                          className="btn-ghost"
                          title="Registrar egreso del predio"
                          style={{ padding: '4px 8px', fontSize: '0.7rem', color: 'var(--text-dim)' }}
                        >
                          <LogOut size={12} />
                          <span>Salida</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToggleCheckIn(item.id)}
                        className="btn-secondary"
                        style={{
                          padding: '5px 12px',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          borderColor: 'rgba(16, 185, 129, 0.4)',
                          color: '#10b981'
                        }}
                      >
                        <LogIn size={13} />
                        <span>Dar Ingreso</span>
                      </button>
                    )}
                  </td>

                  {/* Acciones */}
                  <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => onOpenBadgeModal(item)}
                        className="btn-ghost"
                        title="Ver credencial y código QR"
                        style={{ padding: '6px', borderRadius: '6px', color: '#f59e0b' }}
                      >
                        <Sparkles size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenEditModal(item)}
                        className="btn-ghost"
                        title="Editar datos de la acreditación"
                        style={{ padding: '6px', borderRadius: '6px' }}
                      >
                        <PenLine size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setItemToDelete(item)}
                        className="btn-ghost"
                        title="Eliminar acreditación"
                        style={{ padding: '6px', borderRadius: '6px', color: '#f43f5e' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Accessible Confirmation Modal for Deleting */}
      {itemToDelete && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setItemToDelete(null)}
          onConfirm={() => {
            onDeleteAccreditation(itemToDelete.id);
            setItemToDelete(null);
          }}
          title="Eliminar Acreditación"
          description={`¿Estás seguro de que deseas eliminar la acreditación de ${itemToDelete.firstName} ${itemToDelete.lastName} (${itemToDelete.role} - ${itemToDelete.company})? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar Acreditación"
          cancelLabel="Cancelar"
          variant="danger"
        />
      )}
    </>
  );
};
