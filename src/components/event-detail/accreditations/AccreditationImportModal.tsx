import React, { useState } from 'react';
import { BaseModal } from '@/components/common/BaseModal';
import { Button } from '@/components/ui';
import type { AccreditationItem, AccreditationAccessLevel } from '@/types/metodicah';
import { parseCSVRecords } from '@/utils/csvUtils';
import { UploadCloud, CheckCircle2, AlertTriangle, FileSpreadsheet, Info } from 'lucide-react';

interface AccreditationImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  existingItems: AccreditationItem[];
  onImport: (newItems: Omit<AccreditationItem, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
}

interface ParsedPreviewRow {
  firstName: string;
  lastName: string;
  documentNumber: string;
  role: string;
  company: string;
  accessLevel: AccreditationAccessLevel;
  insuranceVerified: boolean;
  isDuplicate: boolean;
}

export const AccreditationImportModal: React.FC<AccreditationImportModalProps> = ({
  isOpen,
  onClose,
  eventId,
  existingItems,
  onImport
}) => {
  const [csvRawText, setCsvRawText] = useState('');
  const [previewRows, setPreviewRows] = useState<ParsedPreviewRow[]>([]);
  const [defaultCompany, setDefaultCompany] = useState('');
  const [defaultAccessLevel, setDefaultAccessLevel] = useState<AccreditationAccessLevel>('STAFF');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const existingDnis = new Set(
    existingItems.map(i => i.documentNumber.replace(/\D/g, ''))
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvRawText(content);
      processContent(content);
    };
    reader.readAsText(file, 'UTF-8');
  };

  const processContent = (text: string) => {
    setErrorMsg(null);
    if (!text.trim()) {
      setPreviewRows([]);
      return;
    }

    try {
      const records = parseCSVRecords(text);
      if (records.length === 0) {
        setPreviewRows([]);
        return;
      }

      // Check if first row is header
      let startIndex = 0;
      const firstRowLower = records[0].map(c => c.toLowerCase());
      if (
        firstRowLower.some(c => c.includes('nombre') || c.includes('dni') || c.includes('apellido') || c.includes('rol'))
      ) {
        startIndex = 1;
      }

      const rows: ParsedPreviewRow[] = [];
      for (let i = startIndex; i < records.length; i++) {
        const col = records[i];
        if (!col || col.length < 2) continue;

        let firstName = '';
        let lastName = '';
        let documentNumber = '';
        let role = 'Técnico';
        let company = defaultCompany || 'Proveedor Externo';
        let accessLevel: AccreditationAccessLevel = defaultAccessLevel;

        if (col.length >= 4) {
          firstName = col[0] || '';
          lastName = col[1] || '';
          documentNumber = col[2] || '';
          role = col[3] || 'Técnico';
          if (col[4]) company = col[4];
          if (col[5]) {
            const rawLvl = col[5].toUpperCase().trim();
            if (rawLvl.includes('ALL')) accessLevel = 'ALL ACCESS';
            else if (rawLvl.includes('GUEST') || rawLvl.includes('INVITADO')) accessLevel = 'GUEST';
            else accessLevel = 'STAFF';
          }
        } else if (col.length === 3) {
          // Format: Nombre Completo, DNI, Rol
          const parts = (col[0] || '').split(' ');
          firstName = parts[0] || 'Nombre';
          lastName = parts.slice(1).join(' ') || 'Apellido';
          documentNumber = col[1] || '';
          role = col[2] || 'Técnico';
        }

        const cleanDni = documentNumber.replace(/\D/g, '');
        const isDuplicate = existingDnis.has(cleanDni) && cleanDni.length > 0;

        if (firstName.trim()) {
          rows.push({
            firstName: firstName.trim(),
            lastName: lastName.trim() || '-',
            documentNumber: documentNumber.trim() || 'S/DNI',
            role: role.trim(),
            company: company.trim(),
            accessLevel,
            insuranceVerified: false,
            isDuplicate
          });
        }
      }

      setPreviewRows(rows);
    } catch {
      setErrorMsg('No se pudo procesar el formato del archivo. Asegúrate de que sea un CSV válido.');
    }
  };

  const handleConfirmImport = () => {
    const validRows = previewRows.filter(r => !r.isDuplicate);
    if (validRows.length === 0) return;

    const payload = validRows.map(row => ({
      eventId,
      firstName: row.firstName,
      lastName: row.lastName,
      documentNumber: row.documentNumber,
      role: row.role,
      company: row.company,
      accessLevel: row.accessLevel,
      status: 'aprobada' as const,
      qrCode: '',
      insuranceVerified: row.insuranceVerified,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    onImport(payload);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Carga Masiva de Acreditaciones"
      subtitle="Importa nóminas enviadas por proveedores en formato CSV o texto tabulado"
      icon={<FileSpreadsheet size={20} color="#10b981" />}
      maxWidth="720px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {previewRows.length > 0 && `${previewRows.filter(r => !r.isDuplicate).length} registros listos para importar`}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmImport}
              disabled={previewRows.filter(r => !r.isDuplicate).length === 0}
            >
              Confirmar Importación ({previewRows.filter(r => !r.isDuplicate).length})
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Info guide banner */}
        <div style={{
          padding: '10px 14px',
          borderRadius: '8px',
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          color: '#38bdf8',
          fontSize: '0.78rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Info size={16} />
          <span>Columnas sugeridas en el archivo: <strong>Nombre, Apellido, DNI, Rol, Empresa, Nivel (ALL ACCESS / STAFF / GUEST)</strong></span>
        </div>

        {/* Global defaults */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Empresa por Defecto (si no está especificada en la fila)
            </label>
            <input
              type="text"
              placeholder="Ej: Proveedor Audio & Luces"
              value={defaultCompany}
              onChange={(e) => {
                setDefaultCompany(e.target.value);
                if (csvRawText) processContent(csvRawText);
              }}
              className="input-field"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Nivel de Acceso por Defecto
            </label>
            <select
              value={defaultAccessLevel}
              onChange={(e) => {
                const lvl = e.target.value as AccreditationAccessLevel;
                setDefaultAccessLevel(lvl);
                if (csvRawText) processContent(csvRawText);
              }}
              className="input-field"
              style={{ width: '100%' }}
            >
              <option value="STAFF">STAFF (Técnica & Crew)</option>
              <option value="ALL ACCESS">ALL ACCESS (Acceso Total)</option>
              <option value="GUEST">GUEST (Invitados & Prensa)</option>
            </select>
          </div>
        </div>

        {/* File drop area */}
        <div style={{
          border: '2px dashed var(--border-subtle)',
          borderRadius: '10px',
          padding: '20px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.01)',
          cursor: 'pointer',
          position: 'relative'
        }}>
          <input
            type="file"
            accept=".csv,text/csv,text/plain"
            onChange={handleFileUpload}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
          />
          <UploadCloud size={32} color="#10b981" style={{ margin: '0 auto 8px auto' }} />
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>
            Arrastra tu archivo CSV aquí o haz clic para seleccionarlo
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Acepta archivos delimitados por coma o punto y coma
          </div>
        </div>

        {errorMsg && (
          <div style={{ color: '#f43f5e', fontSize: '0.8rem', padding: '6px 0' }}>
            {errorMsg}
          </div>
        )}

        {/* Preview Table */}
        {previewRows.length > 0 && (
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
              Vista Previa ({previewRows.length} filas detectadas):
            </div>
            <div style={{
              maxHeight: '220px',
              overflowY: 'auto',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-dim)', textAlign: 'left' }}>
                    <th style={{ padding: '8px 10px' }}>Persona</th>
                    <th style={{ padding: '8px 10px' }}>DNI</th>
                    <th style={{ padding: '8px 10px' }}>Rol</th>
                    <th style={{ padding: '8px 10px' }}>Empresa</th>
                    <th style={{ padding: '8px 10px' }}>Nivel</th>
                    <th style={{ padding: '8px 10px' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, idx) => (
                    <tr 
                      key={idx}
                      style={{
                        borderTop: '1px solid var(--border-subtle)',
                        background: row.isDuplicate ? 'rgba(244, 63, 94, 0.08)' : undefined
                      }}
                    >
                      <td style={{ padding: '7px 10px', color: '#fff', fontWeight: 500 }}>
                        {row.firstName} {row.lastName}
                      </td>
                      <td style={{ padding: '7px 10px', fontFamily: 'monospace' }}>
                        {row.documentNumber}
                      </td>
                      <td style={{ padding: '7px 10px', color: 'var(--text-muted)' }}>
                        {row.role}
                      </td>
                      <td style={{ padding: '7px 10px' }}>
                        {row.company}
                      </td>
                      <td style={{ padding: '7px 10px', fontWeight: 700 }}>
                        {row.accessLevel}
                      </td>
                      <td style={{ padding: '7px 10px' }}>
                        {row.isDuplicate ? (
                          <span style={{ color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={12} /> DNI Ya Registrado
                          </span>
                        ) : (
                          <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} /> Listo
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </BaseModal>
  );
};
