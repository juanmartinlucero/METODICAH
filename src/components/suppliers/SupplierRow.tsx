import React from 'react';
import type { Supplier, SupplierCategoryConfig } from '@/types/metodicah';
import { 
  Building2, 
  Mail, 
  MessageCircle, 
  Edit2, 
  Trash2, 
  Eye
} from 'lucide-react';
import { getSupplierCategoryLabel, getSupplierCategoryColor, getSupplierWhatsAppLink } from '@/utils/supplierUtils';
import { Badge, Button, Card } from '@/components/ui';

interface SupplierRowProps {
  supplier: Supplier;
  categories?: SupplierCategoryConfig[];
  onViewDetail: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete?: (supplier: Supplier) => void;
}

export const SupplierRow: React.FC<SupplierRowProps> = ({
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
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderLeft: `4px solid ${catColor}`,
        gap: '14px',
        flexWrap: 'wrap',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. Left: Identity & Category */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 240px', minWidth: 0, overflow: 'hidden' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          background: `${catColor}18`,
          border: `1px solid ${catColor}35`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: catColor,
          flexShrink: 0
        }}>
          <Building2 size={18} />
        </div>

        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h4 
              onClick={() => onViewDetail(supplier)}
              style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}
              className="hover-underline"
            >
              {supplier.name}
            </h4>
            <Badge
              color={catColor}
              size="sm"
              style={{ flexShrink: 0 }}
            >
              {catLabel}
            </Badge>
          </div>

          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
            {supplier.company && supplier.company !== supplier.name 
              ? `${supplier.company}${supplier.contactName ? ` · Contacto: ${supplier.contactName}` : ''}`
              : (supplier.contactRole ? `${supplier.contactRole}${supplier.contactName ? ` (${supplier.contactName})` : ''}` : `Rubro: ${catLabel}`)}
          </p>
        </div>
      </div>

      {/* 2. Middle: Contact Channels */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 280px', minWidth: '200px' }}>
        <a 
          href={`mailto:${supplier.email}`}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px', 
            fontSize: '0.78rem', 
            color: 'var(--text-muted)', 
            textDecoration: 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '180px'
          }}
          title={supplier.email}
        >
          <Mail size={13} color="var(--text-dim)" />
          <span>{supplier.email}</span>
        </a>

        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            title="WhatsApp Directo"
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

      {/* 3. Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetail(supplier)}
          title="Ver Ficha Técnica"
          leftIcon={<Eye size={14} color="#38bdf8" />}
          style={{ padding: '5px 7px' }}
        />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(supplier)}
          title="Editar"
          leftIcon={<Edit2 size={14} />}
          style={{ padding: '5px 7px' }}
        />

        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(supplier)}
            title="Eliminar"
            leftIcon={<Trash2 size={14} color="var(--text-dim)" />}
            style={{ padding: '5px 7px' }}
          />
        )}
      </div>

    </Card>
  );
};
