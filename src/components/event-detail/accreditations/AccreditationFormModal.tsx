import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseModal } from '@/components/common/BaseModal';
import { Button } from '@/components/ui';
import { accreditationSchema, type AccreditationFormData } from '@/schemas/accreditationSchema';
import { ACCESS_LEVEL_CONFIG } from '@/utils/accreditationUtils';
import type { AccreditationItem, AccreditationAccessLevel } from '@/types/metodicah';
import { useSuppliersStore } from '@/stores';
import { IdCard, ShieldCheck, AlertCircle, Building2, User, Phone, FileText } from 'lucide-react';

interface AccreditationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  itemToEdit?: AccreditationItem | null;
  onSave: (data: Omit<AccreditationItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const COMMON_ROLES = [
  'Jefe Técnico',
  'Operador de Sonido FOH',
  'Técnico de Monitores',
  'Operador de Luces / Consola',
  'Rigger / Alturas',
  'Stage Manager',
  'Jefe de Escenario',
  'Operador de Video / Pantallas',
  'Runner de Producción',
  'Seguridad & Control',
  'Catering & Camarines',
  'Fotógrafo / Prensa',
  'Logística & Carga'
];

export const AccreditationFormModal: React.FC<AccreditationFormModalProps> = ({
  isOpen,
  onClose,
  eventId,
  itemToEdit,
  onSave
}) => {
  const suppliers = useSuppliersStore(s => s.suppliers);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<AccreditationFormData>({
    resolver: zodResolver(accreditationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      documentNumber: '',
      role: '',
      company: '',
      accessLevel: 'STAFF',
      status: 'aprobada',
      insuranceVerified: false,
      emergencyPhone: '',
      notes: ''
    }
  });

  const selectedAccessLevel = watch('accessLevel') as AccreditationAccessLevel;
  const isInsuranceChecked = watch('insuranceVerified');

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        reset({
          firstName: itemToEdit.firstName,
          lastName: itemToEdit.lastName,
          documentNumber: itemToEdit.documentNumber,
          role: itemToEdit.role,
          company: itemToEdit.company,
          accessLevel: itemToEdit.accessLevel,
          status: itemToEdit.status,
          insuranceVerified: itemToEdit.insuranceVerified || false,
          emergencyPhone: itemToEdit.emergencyPhone || '',
          notes: itemToEdit.notes || ''
        });
      } else {
        reset({
          firstName: '',
          lastName: '',
          documentNumber: '',
          role: '',
          company: '',
          accessLevel: 'STAFF',
          status: 'aprobada',
          insuranceVerified: false,
          emergencyPhone: '',
          notes: ''
        });
      }
    }
  }, [isOpen, itemToEdit, reset]);

  const onSubmit = (data: AccreditationFormData) => {
    onSave({
      eventId,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      documentNumber: data.documentNumber.trim(),
      role: data.role.trim(),
      company: data.company.trim(),
      accessLevel: data.accessLevel,
      status: data.status,
      qrCode: itemToEdit?.qrCode || '',
      checkInAt: itemToEdit?.checkInAt || null,
      checkOutAt: itemToEdit?.checkOutAt || null,
      checkInBy: itemToEdit?.checkInBy || null,
      insuranceVerified: data.insuranceVerified,
      emergencyPhone: data.emergencyPhone?.trim() || undefined,
      notes: data.notes?.trim() || undefined
    });
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={itemToEdit ? 'Editar Acreditación' : 'Nueva Acreditación de Producción'}
      subtitle={itemToEdit ? `Modificando registro de ${itemToEdit.firstName} ${itemToEdit.lastName}` : 'Carga de personal técnico, proveedores o invitados'}
      icon={<IdCard size={20} color="#f59e0b" />}
      maxWidth="680px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button variant="ghost" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit(onSubmit)} 
            disabled={isSubmitting}
            type="submit"
          >
            {itemToEdit ? 'Guardar Cambios' : 'Registrar Acreditación'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Nivel de Acceso (3 Categorías Exclusivas) */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
            Nivel de Acceso al Evento *
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {(['ALL ACCESS', 'STAFF', 'GUEST'] as AccreditationAccessLevel[]).map((level) => {
              const cfg = ACCESS_LEVEL_CONFIG[level];
              const isSelected = selectedAccessLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setValue('accessLevel', level)}
                  style={{
                    padding: '12px 10px',
                    borderRadius: '8px',
                    border: `1.5px solid ${isSelected ? cfg.color : 'rgba(255, 255, 255, 0.08)'}`,
                    background: isSelected ? cfg.bg : 'rgba(255, 255, 255, 0.02)',
                    color: isSelected ? cfg.color : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, letterSpacing: '0.04em' }}>{cfg.label}</span>
                  <span style={{ fontSize: '0.68rem', color: isSelected ? 'var(--text-dim)' : '#64748b', textAlign: 'center' }}>
                    {level === 'ALL ACCESS' ? 'Acceso Total' : level === 'STAFF' ? 'Técnica & Crew' : 'Invitados & Prensa'}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.accessLevel && (
            <span style={{ fontSize: '0.74rem', color: '#f43f5e', marginTop: '4px', display: 'block' }}>
              {errors.accessLevel.message}
            </span>
          )}
        </div>

        {/* Datos Personales: Nombre, Apellido, DNI */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              <User size={13} />
              Nombre *
            </label>
            <input
              type="text"
              placeholder="Ej: Marcos"
              {...register('firstName')}
              className="input-field"
              style={{ width: '100%' }}
            />
            {errors.firstName && (
              <span style={{ fontSize: '0.74rem', color: '#f43f5e', marginTop: '4px', display: 'block' }}>
                {errors.firstName.message}
              </span>
            )}
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              <User size={13} />
              Apellido *
            </label>
            <input
              type="text"
              placeholder="Ej: Villalba"
              {...register('lastName')}
              className="input-field"
              style={{ width: '100%' }}
            />
            {errors.lastName && (
              <span style={{ fontSize: '0.74rem', color: '#f43f5e', marginTop: '4px', display: 'block' }}>
                {errors.lastName.message}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              <IdCard size={13} />
              DNI / Pasaporte *
            </label>
            <input
              type="text"
              placeholder="Ej: 34.892.114"
              {...register('documentNumber')}
              className="input-field"
              style={{ width: '100%' }}
            />
            {errors.documentNumber && (
              <span style={{ fontSize: '0.74rem', color: '#f43f5e', marginTop: '4px', display: 'block' }}>
                {errors.documentNumber.message}
              </span>
            )}
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              <Phone size={13} />
              Teléfono de Contacto / Urgencia
            </label>
            <input
              type="tel"
              placeholder="Ej: +54 9 11 4455-8899"
              {...register('emergencyPhone')}
              className="input-field"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Rol y Empresa */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              <Building2 size={13} />
              Empresa / Proveedor *
            </label>
            <input
              type="text"
              placeholder="Ej: Staging & Rigging Solutions"
              list="suppliers-list"
              {...register('company')}
              className="input-field"
              style={{ width: '100%' }}
            />
            <datalist id="suppliers-list">
              {suppliers.map(s => (
                <option key={s.id} value={s.company || s.name} />
              ))}
              <option value="Producción Metodicah" />
              <option value="Prensa Oficial" />
              <option value="Cliente / Sponsor" />
            </datalist>
            {errors.company && (
              <span style={{ fontSize: '0.74rem', color: '#f43f5e', marginTop: '4px', display: 'block' }}>
                {errors.company.message}
              </span>
            )}
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              <FileText size={13} />
              Rol / Función en el Evento *
            </label>
            <input
              type="text"
              placeholder="Ej: Operador de Sonido FOH"
              list="roles-list"
              {...register('role')}
              className="input-field"
              style={{ width: '100%' }}
            />
            <datalist id="roles-list">
              {COMMON_ROLES.map(r => (
                <option key={r} value={r} />
              ))}
            </datalist>
            {errors.role && (
              <span style={{ fontSize: '0.74rem', color: '#f43f5e', marginTop: '4px', display: 'block' }}>
                {errors.role.message}
              </span>
            )}
          </div>
        </div>

        {/* Seguridad & ART Checkbox */}
        <div 
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: isInsuranceChecked ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
            border: `1px solid ${isInsuranceChecked ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isInsuranceChecked ? (
              <ShieldCheck size={20} color="#10b981" />
            ) : (
              <AlertCircle size={20} color="#f59e0b" />
            )}
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#fff' }}>
                Cobertura de Seguro Laboral / ART Verificada
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {isInsuranceChecked 
                  ? 'Póliza y cláusula de no repetición recepcionadas conforme.' 
                  : 'Falta validar póliza ART para trabajos técnicos en predio.'}
              </div>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              {...register('insuranceVerified')}
              style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>
              {isInsuranceChecked ? 'Verificado' : 'Marcar OK'}
            </span>
          </label>
        </div>

        {/* Observaciones */}
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            Observaciones o Indicaciones de Acceso
          </label>
          <textarea
            rows={2}
            placeholder="Ej: Retira credencial en puerta 2. Trae vehículo de carga..."
            {...register('notes')}
            className="input-field"
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>

      </form>
    </BaseModal>
  );
};
