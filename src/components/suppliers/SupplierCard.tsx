import React from 'react';
import type { Supplier, SupplierCategoryConfig } from '@/types/metodicah';
import { 
  Building2,
  Mail, 
  Phone, 
  MessageCircle, 
  Edit2, 
  Trash2, 
  Eye, 
  Cpu,
  MapPin
} from 'lucide-react';
import { getSupplierCategoryLabel, getSupplierCategoryColor, getSupplierWhatsAppLink } from '@/utils/supplierUtils';
import { Badge, Button, Card } from '@/components/ui';

interface SupplierCardProps {
  supplier: Supplier;
  categories?: SupplierCategoryConfig[];
  onViewDetail: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete?: (supplier: Supplier) => void;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  categories,
  onViewDetail,
  onEdit,
  onDelete
}) => {
  const catColor = getSupplierCategoryColor(supplier.category, categories);
  const catLabel = getSupplierCategoryLabel(supplier.category, categories);
  const waLink = getSupplierWhatsAppLink(supplier.phone, supplier.contactName || supplier.name);

  return (
    <Card 
      variant="glass"
      className="hover-card" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        gap: '14px',
        padding: '18px',
        borderTop: `3px solid ${catColor}`,
        position: 'relative'
      }}
    >
      
      {/* 1. Header: Category Icon, Name, Subtitle & Category Badge */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '10px', 
              background: `${catColor}18`, 
              border: `1px solid ${catColor}35`,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: catColor,
              flexShrink: 0
            }}>
              <Building2 size={22} />
            </div>

            <div>
              <h3 
                onClick={() => onViewDetail(supplier)}
                style={{ 
                  fontSize: '1.12rem', 
                  fontWeight: 600, 
                  color: '#fff', 
                  cursor: 'pointer',
                  lineHeight: 1.25
                }}
                className="hover-underline"
              >
                {supplier.name}
              </h3>
              
              {supplier.company && supplier.company !== supplier.name ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {supplier.company}
                </p>
              ) : (
                supplier.contactRole ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {supplier.contactRole}
                  </p>
                ) : null
              )}
            </div>
          </div>

          <Badge color={catColor} dot size="sm">
            {catLabel}
          </Badge>
        </div>

        {/* Fiscal & City badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
          {supplier.taxId && (
            <Badge variant="amber" size="sm">
              CUIT: {supplier.taxId}
            </Badge>
          )}
          {supplier.city && (
            <Badge variant="default" size="sm">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <MapPin size={10} />
                <span>{supplier.city}</span>
              </span>
            </Badge>
          )}
        </div>
      </div>

      {/* 2. Equipamiento Insignia */}
      {supplier.equipmentHighlights && (
        <div style={{
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '8px 10px',
          borderRadius: '6px',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.76rem',
          color: '#cbd5e1',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '6px',
          lineHeight: 1.4
        }}>
          <Cpu size={14} color={catColor} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {supplier.equipmentHighlights}
          </span>
        </div>
      )}

      {/* 3. Contact Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
        {supplier.contactName && (
          <div style={{ color: '#fff', fontWeight: 500, fontSize: '0.82rem' }}>
            {supplier.contactName} {supplier.contactRole ? <span style={{ color: 'var(--text-dim)', fontWeight: 400, fontSize: '0.75rem' }}>({supplier.contactRole})</span> : ''}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <a 
            href={`mailto:${supplier.email}`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              color: 'var(--text-muted)', 
              textDecoration: 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            title={supplier.email}
          >
            <Mail size={13} color="var(--text-dim)" />
            <span style={{ fontSize: '0.78rem' }}>{supplier.email}</span>
          </a>

          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              title="Abrir chat de WhatsApp"
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
                textDecoration: 'none',
                flexShrink: 0
              }}
            >
              <MessageCircle size={12} />
              <span>WhatsApp</span>
            </a>
          )}
        </div>

        {supplier.phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
            <Phone size={12} />
            <span>{supplier.phone}</span>
          </div>
        )}
      </div>

      {/* 4. Footer Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetail(supplier)}
            title="Ver Ficha Técnica"
            leftIcon={<Eye size={14} color="#38bdf8" />}
            style={{ padding: '6px 8px' }}
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(supplier)}
            title="Editar Proveedor"
            leftIcon={<Edit2 size={14} />}
            style={{ padding: '6px 8px' }}
          />

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(supplier)}
              title="Eliminar Proveedor"
              leftIcon={<Trash2 size={14} color="var(--text-dim)" />}
              style={{ padding: '6px 8px' }}
            />
          )}
        </div>
      </div>

    </Card>
  );
};
