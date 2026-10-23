import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tag, Plus, AlertCircle } from 'lucide-react';
import { EventScopeItem } from './EventScopeItem';
import { useToast } from '../../../hooks/useToast';
import { eventScopeSchema, type EventScopeFormData } from '../settingsSchemas';

interface EventScopesConfigProps {
  configuredScopes: string[];
  onUpdateConfiguredScopes: (scopes: string[]) => void;
  isAdmin: boolean;
}

export const EventScopesConfig: React.FC<EventScopesConfigProps> = ({
  configuredScopes,
  onUpdateConfiguredScopes,
  isAdmin
}) => {
  const toast = useToast();
  const [editingScopeIndex, setEditingScopeIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EventScopeFormData>({
    resolver: zodResolver(eventScopeSchema),
    defaultValues: {
      name: ''
    }
  });

  const onValidAddScope = (data: EventScopeFormData) => {
    const trimmed = data.name.trim();
    if (configuredScopes.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      toast.warning('Este alcance ya se encuentra registrado.');
      return;
    }
    onUpdateConfiguredScopes([...configuredScopes, trimmed]);
    reset();
    toast.success(`Alcance "${trimmed}" registrado.`);
  };

  const handleSaveEditScope = (index: number, newText: string) => {
    if (configuredScopes.some((s, i) => i !== index && s.toLowerCase() === newText.toLowerCase())) {
      toast.warning('Ya existe otro alcance con este nombre.');
      return;
    }
    const updated = [...configuredScopes];
    updated[index] = newText;
    onUpdateConfiguredScopes(updated);
    setEditingScopeIndex(null);
    toast.success('Alcance actualizado.');
  };

  const handleDeleteScope = (index: number) => {
    onUpdateConfiguredScopes(configuredScopes.filter((_, i) => i !== index));
    toast.info('Alcance eliminado.');
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Tag size={20} color="#f59e0b" />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>
              Alcance de Negocio & Producción (Scope)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Define tus áreas de servicio y alcance técnico a medida para tenerlas disponibles al registrar producciones.
            </p>
          </div>
        </div>
      </div>

      {isAdmin && (
        <form onSubmit={handleSubmit(onValidAddScope)} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Ej: Iluminación Escenográfica & FX, Audio FOH, Rigging Layher, etc."
              {...register('name')}
              className="form-input"
              style={{ flex: 1, height: '38px', fontSize: '0.84rem', borderColor: errors.name ? '#ef4444' : undefined }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ fontSize: '0.82rem', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={14} />
              <span>Agregar Alcance</span>
            </button>
          </div>
          {errors.name && (
            <span style={{ fontSize: '0.72rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={11} /> {errors.name.message}
            </span>
          )}
        </form>
      )}

      {configuredScopes.length === 0 ? (
        <div style={{
          padding: '28px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.015)',
          border: '1px dashed var(--border-subtle)',
          borderRadius: '8px',
          color: 'var(--text-muted)'
        }}>
          <p style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 500, marginBottom: '4px' }}>
            No has configurado ningún alcance de negocio aún
          </p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Agrega los alcances que ofrece tu productora o empresa para seleccionarlos con un solo clic al crear nuevos eventos.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {configuredScopes.map((scopeItem, idx) => (
            <EventScopeItem
              key={idx}
              scope={scopeItem}
              index={idx}
              isEditing={editingScopeIndex === idx}
              isAdmin={isAdmin}
              existingScopes={configuredScopes}
              onStartEdit={() => setEditingScopeIndex(idx)}
              onCancelEdit={() => setEditingScopeIndex(null)}
              onSaveEdit={(newText) => handleSaveEditScope(idx, newText)}
              onDelete={() => handleDeleteScope(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
