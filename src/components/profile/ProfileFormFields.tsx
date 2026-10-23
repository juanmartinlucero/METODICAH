import React from 'react';
import { useFormContext } from 'react-hook-form';
import { User, Mail, Phone, Briefcase, MapPin, AlertCircle } from 'lucide-react';
import type { ProfileFormData } from './profileSchema';

export const ProfileFormFields: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<ProfileFormData>();

  return (
    <div className="glass-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
        Información Personal y Contacto
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <User size={13} color="var(--text-dim)" />
            <span>Nombre Completo *</span>
          </label>
          <input
            type="text"
            {...register('name')}
            className="form-input"
            placeholder="Tu nombre y apellido"
            style={{ borderColor: errors.name ? '#ef4444' : undefined }}
          />
          {errors.name && (
            <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={11} /> {errors.name.message}
            </span>
          )}
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <Mail size={13} color="var(--text-dim)" />
            <span>Correo Electrónico *</span>
          </label>
          <input
            type="email"
            {...register('email')}
            className="form-input"
            placeholder="juan@metodicah.com"
            style={{ borderColor: errors.email ? '#ef4444' : undefined }}
          />
          {errors.email && (
            <span style={{ fontSize: '0.72rem', color: '#ef4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={11} /> {errors.email.message}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <Phone size={13} color="var(--text-dim)" />
            <span>Teléfono / WhatsApp</span>
          </label>
          <input
            type="tel"
            {...register('phone')}
            className="form-input"
            placeholder="+54 9 11 5555-0199"
          />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <Briefcase size={13} color="var(--text-dim)" />
            <span>Cargo / Especialidad Principal</span>
          </label>
          <input
            type="text"
            {...register('specialty')}
            className="form-input"
            placeholder="Ej: Dirección General de Producción"
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
          <MapPin size={13} color="var(--text-dim)" />
          <span>Ubicación / Base de Operaciones</span>
        </label>
        <input
          type="text"
          {...register('location')}
          className="form-input"
          placeholder="Ej: Buenos Aires, Argentina"
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Biografía / Notas de Perfil
        </label>
        <textarea
          {...register('bio')}
          className="form-textarea"
          placeholder="Escribe una breve descripción de tu trayectoria, enfoque o notas..."
          rows={3}
        />
      </div>
    </div>
  );
};
