import React from 'react';
import type { Supplier, EventItem, SupplierCategoryConfig } from '@/types/metodicah';
import { 
  Building2, 
  MessageCircle, 
  Edit3, 
  Cpu, 
  Calendar, 
  ChevronRight
} from 'lucide-react';
import { getSupplierCategoryLabel, getSupplierCategoryColor, getSupplierWhatsAppLink } from '@/utils/supplierUtils';
import { FormattedDate } from '@/components/common/FormattedDate';
import { BaseModal } from '@/components/common/BaseModal';
import { Button, Badge, Card } from '@/components/ui';

interface SupplierDetailModalProps {
  supplier: Supplier | null;
  events?: EventItem[];
  categories?: SupplierCategoryConfig[];
  onClose: () => void;
  onEdit: (supplier: Supplier) => void;
  onSelectEvent?: (event: EventItem) => void;
}

export const SupplierDetailModal: React.FC<SupplierDetailModalProps> = ({
  supplier,
  events = [],
  categories,
  onClose,
  onEdit,
  onSelectEvent
}) => {
  if (!supplier) return null;

  const catColor = getSupplierCategoryColor(supplier.category, categories);
  const catLabel = getSupplierCategoryLabel(supplier.category, categories);
  const waLink = getSupplierWhatsAppLink(supplier.phone, supplier.contactName || supplier.name);

  // Filter associated events (checks third parties or scope match)
  const associatedEvents = events.filter(e => {
    if (e.thirdPartiesInvolved?.some(t => t.toLowerCase().includes(supplier.name.toLowerCase()) || (supplier.company && t.toLowerCase().includes(supplier.company.toLowerCase())))) return true;
    return false;
  });

  return (
    <BaseModal
      isOpen={!!supplier}
      onClose={onClose}
      title={supplier.name}
      subtitle={supplier.company ? `Razón Social: ${supplier.company}` : 'Proveedor de Servicios Técnicos'}
      icon={<Building2 size={20} color={catColor} />}
      maxWidth="680px"
      footer={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%'
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Fecha de Alta: <FormattedDate date={supplier.createdAt} fallback="Sin fecha registrada" />
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Edit3 size={14} />}
              onClick={() => {
                onClose();
                onEdit(supplier);
              }}
            >
              Editar Proveedor
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Cerrar
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <Badge color={catColor} size="md">
            {catLabel}
          </Badge>
          {supplier.taxId && (
            <Badge variant="amber" size="md">
              CUIT: {supplier.taxId}
            </Badge>
          )}
          {supplier.taxCondition && (
            <Badge variant="slate" size="md">
              IVA: {supplier.taxCondition}
            </Badge>
          )}
        </div>

        {/* Contact Data */}
        <Card variant="panel" style={{ padding: '16px', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Contacto Comercial / Técnico</span>
              <p style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 500, marginTop: '2px' }}>
                {supplier.contactName || 'No asignado'}
              </p>
              {supplier.contactRole && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{supplier.contactRole}</p>}
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Email Operativo</span>
              <a href={`mailto:${supplier.email}`} style={{ fontSize: '0.88rem', color: '#38bdf8', textDecoration: 'none', display: 'block', marginTop: '2px' }}>
                {supplier.email}
              </a>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Teléfono Principal</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '0.88rem', color: '#fff' }}>{supplier.phone}</span>
                {waLink && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    title="Enviar WhatsApp"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      color: '#22c55e',
                      background: 'rgba(34, 197, 94, 0.12)',
                      border: '1px solid rgba(34, 197, 94, 0.25)',
                      textDecoration: 'none'
                    }}
                  >
                    <MessageCircle size={12} />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

            {supplier.emergencyPhone && (
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Teléfono Urgencias / Guardia</span>
                <p style={{ fontSize: '0.88rem', color: '#ef4444', fontWeight: 500, marginTop: '2px' }}>
                  {supplier.emergencyPhone}
                </p>
              </div>
            )}

            {supplier.website && (
              <div>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Sitio Web / Portfolio</span>
                <a href={supplier.website} target="_blank" rel="noreferrer" style={{ fontSize: '0.88rem', color: '#a78bfa', textDecoration: 'none', display: 'block', marginTop: '2px' }}>
                  {supplier.website}
                </a>
              </div>
            )}
          </div>
        </Card>

        {/* Equipamiento Insignia */}
        {supplier.equipmentHighlights && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={15} />
              <span>Equipamiento Insignia & Marcas</span>
            </h4>
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.5 }}>
              {supplier.equipmentHighlights}
            </div>
          </div>
        )}

        {/* Facturación & Domicilio */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
          {supplier.billingEmail && (
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Email Facturación</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{supplier.billingEmail}</span>
            </div>
          )}

          {supplier.paymentTerms && (
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Condición de Pago</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{supplier.paymentTerms}</span>
            </div>
          )}

          {(supplier.address || supplier.city) && (
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Depósito / Domicilio</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {supplier.address ? `${supplier.address}, ` : ''}{supplier.city || ''}
              </span>
            </div>
          )}
        </div>

        {/* Notes */}
        {supplier.notes && (
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block' }}>Notas Técnicas & Criterios</span>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic', background: 'rgba(0,0,0,0.25)', padding: '10px', borderRadius: '6px' }}>
              "{supplier.notes}"
            </p>
          </div>
        )}

        {/* ======================================================= */}
        {/* SECCIÓN DE PRODUCCIONES Y EVENTOS ASOCIADOS             */}
        {/* ======================================================= */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
          <h4 style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Calendar size={16} color="#f59e0b" />
            <span>Historial de Participación en Eventos ({associatedEvents.length})</span>
          </h4>

          {associatedEvents.length === 0 ? (
            <div style={{ padding: '14px', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              No hay registros de participación directa en eventos para este proveedor aún.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {associatedEvents.map(evt => (
                <Card
                  key={evt.id}
                  variant="glass"
                  interactive={Boolean(onSelectEvent)}
                  onClick={() => {
                    if (onSelectEvent) {
                      onClose();
                      onSelectEvent(evt);
                    }
                  }}
                  style={{
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.74rem', fontFamily: 'monospace', color: '#f59e0b', fontWeight: 600 }}>
                        {evt.code}
                      </span>
                      <h5 style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {evt.title}
                      </h5>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      <span><FormattedDate date={evt.date} fallback="Sin fecha" /></span>
                      <span>·</span>
                      <span>{evt.location}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)' }}>
                    <span style={{ fontSize: '0.74rem', color: '#38bdf8' }}>Ver Detalle</span>
                    <ChevronRight size={14} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};
