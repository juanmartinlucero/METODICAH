import React, { useState, useEffect, useRef } from 'react';
import { BaseModal } from '@/components/common/BaseModal';
import { Button } from '@/components/ui';
import type { AccreditationItem } from '@/types/metodicah';
import { ACCESS_LEVEL_CONFIG } from '@/utils/accreditationUtils';
import { QrCode, Search, CheckCircle2, AlertTriangle, ShieldCheck, UserCheck, ArrowRight, XCircle } from 'lucide-react';

interface AccreditationCheckInScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  accreditations: AccreditationItem[];
  onToggleCheckIn: (id: string) => void;
}

export const AccreditationCheckInScannerModal: React.FC<AccreditationCheckInScannerModalProps> = ({
  isOpen,
  onClose,
  accreditations,
  onToggleCheckIn
}) => {
  const [query, setQuery] = useState('');
  const [matchedItem, setMatchedItem] = useState<AccreditationItem | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setMatchedItem(null);
      setFeedbackMessage(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSearch = (term: string) => {
    setQuery(term);
    const cleanTerm = term.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    if (!cleanTerm) {
      setMatchedItem(null);
      return;
    }

    const found = accreditations.find(item => {
      const docClean = item.documentNumber.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const qrClean = item.qrCode.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const nameClean = `${item.firstName} ${item.lastName}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const searchClean = term.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      return docClean === cleanTerm || qrClean.includes(cleanTerm) || nameClean.includes(searchClean);
    });

    setMatchedItem(found || null);
  };

  const handleConfirmCheckIn = () => {
    if (!matchedItem) return;
    onToggleCheckIn(matchedItem.id);
    const isEntering = matchedItem.status !== 'en_sitio';
    setFeedbackMessage(
      isEntering 
        ? `¡Ingreso autorizado para ${matchedItem.firstName} ${matchedItem.lastName}!` 
        : `Salida registrada para ${matchedItem.firstName} ${matchedItem.lastName}.`
    );

    // Refresh matched item status locally
    setMatchedItem({
      ...matchedItem,
      status: isEntering ? 'en_sitio' : 'aprobada',
      checkInAt: isEntering ? new Date().toISOString() : null
    });

    // Reset query for the next scan after a short delay
    setTimeout(() => {
      setQuery('');
      setMatchedItem(null);
      setFeedbackMessage(null);
      inputRef.current?.focus();
    }, 1800);
  };

  const accessConfig = matchedItem ? ACCESS_LEVEL_CONFIG[matchedItem.accessLevel] : null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Terminal de Control de Accesos & Check-In"
      subtitle="Escaneo de QR o búsqueda rápida por DNI para registro de ingresos"
      icon={<QrCode size={20} color="#10b981" />}
      maxWidth="560px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="ghost" onClick={onClose}>
            Cerrar Terminal
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Search / Scan Input */}
        <div style={{ position: 'relative' }}>
          <Search 
            size={18} 
            color="#94a3b8" 
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} 
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Escanear QR con lector o escribir DNI / Apellido..."
            className="input-field"
            style={{
              width: '100%',
              paddingLeft: '42px',
              paddingRight: '14px',
              paddingTop: '12px',
              paddingBottom: '12px',
              fontSize: '0.96rem',
              borderColor: matchedItem ? '#10b981' : undefined
            }}
          />
        </div>

        {/* Feedback Banner */}
        {feedbackMessage && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10b981',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            fontWeight: 600
          }}>
            <CheckCircle2 size={18} />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Result Card */}
        {matchedItem ? (
          <div style={{
            padding: '20px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: `2px solid ${accessConfig?.color || '#38bdf8'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  background: accessConfig?.bg,
                  color: accessConfig?.color,
                  border: `1px solid ${accessConfig?.border}`
                }}>
                  {matchedItem.accessLevel}
                </span>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginTop: '8px' }}>
                  {matchedItem.firstName} {matchedItem.lastName}
                </h3>

                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {matchedItem.role} · <strong style={{ color: '#e2e8f0' }}>{matchedItem.company}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>DNI / Documento</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>
                  {matchedItem.documentNumber}
                </div>
              </div>
            </div>

            {/* ART & Status row */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                background: matchedItem.insuranceVerified ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                color: matchedItem.insuranceVerified ? '#10b981' : '#f43f5e',
                border: `1px solid ${matchedItem.insuranceVerified ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
              }}>
                {matchedItem.insuranceVerified ? <ShieldCheck size={13} /> : <AlertTriangle size={13} />}
                <span>{matchedItem.insuranceVerified ? 'ART Verificada' : 'Sin ART Registrada'}</span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                background: matchedItem.status === 'en_sitio' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.12)',
                color: matchedItem.status === 'en_sitio' ? '#10b981' : '#94a3b8'
              }}>
                <UserCheck size={13} />
                <span>
                  {matchedItem.status === 'en_sitio' 
                    ? `En Sitio (Ingresó ${matchedItem.checkInAt ? matchedItem.checkInAt.split('T')[1]?.slice(0, 5) : ''} hs)` 
                    : 'Aún no ingresó'}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <Button
              variant={matchedItem.status === 'en_sitio' ? 'secondary' : 'primary'}
              onClick={handleConfirmCheckIn}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.96rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <ArrowRight size={18} />
              <span>{matchedItem.status === 'en_sitio' ? 'Registrar Salida del Predio' : 'Autorizar Ingreso Inmediato'}</span>
            </Button>
          </div>
        ) : query.trim().length >= 3 ? (
          <div style={{
            padding: '30px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '12px',
            border: '1px dashed var(--border-subtle)'
          }}>
            <XCircle size={32} color="#f43f5e" style={{ margin: '0 auto 10px auto', opacity: 0.8 }} />
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.92rem' }}>
              No se encontró ninguna acreditación
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>
              Verifica el DNI o código QR ingresado. Si la persona no está cargada, regístrala desde el botón "Nueva Acreditación".
            </div>
          </div>
        ) : (
          <div style={{
            padding: '30px',
            textAlign: 'center',
            color: 'var(--text-dim)',
            fontSize: '0.84rem'
          }}>
            💡 Conecta un lector de código de barras o escribe el DNI para buscar instantáneamente.
          </div>
        )}

      </div>
    </BaseModal>
  );
};
