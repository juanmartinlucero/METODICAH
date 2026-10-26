import React, { useRef } from 'react';
import { BaseModal } from '@/components/common/BaseModal';
import { Button } from '@/components/ui';
import type { AccreditationItem, EventItem } from '@/types/metodicah';
import { ACCESS_LEVEL_CONFIG, generateQrMatrix } from '@/utils/accreditationUtils';
import { Printer, Sparkles, Building2, ShieldCheck, AlertCircle } from 'lucide-react';

interface AccreditationBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  accreditation: AccreditationItem | null;
  event: EventItem;
}

export const AccreditationBadgeModal: React.FC<AccreditationBadgeModalProps> = ({
  isOpen,
  onClose,
  accreditation,
  event
}) => {
  const badgeRef = useRef<HTMLDivElement>(null);

  if (!accreditation) return null;

  const accessConfig = ACCESS_LEVEL_CONFIG[accreditation.accessLevel] || ACCESS_LEVEL_CONFIG.STAFF;
  const qrMatrix = generateQrMatrix(accreditation.qrCode);
  const matrixSize = qrMatrix.length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Credencial Oficial de Producción"
      subtitle="Pase identificatorio con código QR de acceso seguro"
      icon={<Sparkles size={20} color={accessConfig.color} />}
      maxWidth="480px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
            ID: {accreditation.qrCode}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="ghost" onClick={onClose}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Printer size={15} />
              <span>Imprimir Credencial</span>
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
        
        {/* Lanyard Pass Card */}
        <div
          ref={badgeRef}
          className="print-area"
          style={{
            width: '320px',
            background: 'linear-gradient(180deg, #131b26 0%, #0a0f16 100%)',
            border: `2px solid ${accessConfig.color}`,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: `0 12px 30px -10px ${accessConfig.color}40`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {/* Lanyard Slot Hole Simulation */}
          <div style={{
            width: '40px',
            height: '6px',
            background: '#04070a',
            borderRadius: '4px',
            marginTop: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }} />

          {/* Event Header Banner */}
          <div style={{
            width: '100%',
            padding: '12px 18px 8px 18px',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>
              METODICAH PRODUCCIÓN
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '2px', lineHeight: 1.2 }}>
              {event.title}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {event.date} · {event.venue || event.location}
            </div>
          </div>

          {/* Prominent Access Level Banner */}
          <div style={{
            width: '100%',
            padding: '12px 0',
            background: accessConfig.color,
            color: '#080b11',
            textAlign: 'center',
            fontWeight: 900,
            fontSize: '1.35rem',
            letterSpacing: '0.1em',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 3px 6px rgba(0,0,0,0.2)'
          }}>
            {accreditation.accessLevel}
          </div>

          {/* Person Details */}
          <div style={{ padding: '20px 20px 14px 20px', textAlign: 'center', width: '100%' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', lineHeight: 1.1 }}>
              {accreditation.firstName} {accreditation.lastName}
            </div>
            
            <div style={{
              display: 'inline-block',
              marginTop: '6px',
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#38bdf8'
            }}>
              {accreditation.role}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <Building2 size={14} color="var(--text-dim)" />
              <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{accreditation.company}</span>
            </div>

            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              DNI / Pasaporte: <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{accreditation.documentNumber}</strong>
            </div>
          </div>

          {/* QR Code Section */}
          <div style={{
            background: '#ffffff',
            padding: '12px',
            borderRadius: '12px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
            marginBottom: '16px'
          }}>
            <svg
              width="140"
              height="140"
              viewBox={`0 0 ${matrixSize} ${matrixSize}`}
              style={{ display: 'block', shapeRendering: 'crispEdges' }}
            >
              {qrMatrix.map((row, r) =>
                row.map((cell, c) =>
                  cell ? (
                    <rect
                      key={`${r}-${c}`}
                      x={c}
                      y={r}
                      width={1}
                      height={1}
                      fill="#080b11"
                    />
                  ) : null
                )
              )}
            </svg>
          </div>

          {/* Verification Footer Bar */}
          <div style={{
            width: '100%',
            padding: '8px 16px',
            background: 'rgba(0, 0, 0, 0.4)',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: accreditation.insuranceVerified ? '#10b981' : '#f59e0b' }}>
              {accreditation.insuranceVerified ? <ShieldCheck size={13} /> : <AlertCircle size={13} />}
              <span>{accreditation.insuranceVerified ? 'ART OK' : 'ART Pendiente'}</span>
            </div>

            <span style={{ fontFamily: 'monospace', color: 'var(--text-dim)' }}>
              {accreditation.status.toUpperCase()}
            </span>
          </div>

        </div>

      </div>
    </BaseModal>
  );
};
