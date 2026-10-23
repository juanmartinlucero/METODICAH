import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import type { EventFormData } from './eventSchema';
import { Textarea, Button, Badge } from '@/components/ui';

export const EventConceptFields: React.FC = () => {
  const { register, watch, setValue } = useFormContext<EventFormData>();
  const clientPreferences = watch('clientPreferences') || [];
  const thirdParties = watch('thirdParties') || [];

  const [preferenceInput, setPreferenceInput] = useState('');
  const [thirdPartyInput, setThirdPartyInput] = useState('');

  const handleAddPreference = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!preferenceInput.trim()) return;
    setValue('clientPreferences', [...clientPreferences, preferenceInput.trim()]);
    setPreferenceInput('');
  };

  const handleRemovePreference = (index: number) => {
    setValue('clientPreferences', clientPreferences.filter((_, i) => i !== index));
  };

  const handleAddThirdParty = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!thirdPartyInput.trim()) return;
    setValue('thirdParties', [...thirdParties, thirdPartyInput.trim()]);
    setThirdPartyInput('');
  };

  const handleRemoveThirdParty = (index: number) => {
    setValue('thirdParties', thirdParties.filter((_, i) => i !== index));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        4. Producción, Preferencias & Terceros
      </div>

      {/* Resumen del proyecto */}
      <Textarea 
        label="Resumen Ejecutivo del Proyecto"
        rows={3}
        placeholder="Síntesis del proyecto, objetivos de producción y aspectos destacados."
        {...register('summary')} 
      />

      {/* Client Preferences */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '0.80rem', fontWeight: 500, color: 'var(--text-muted)' }}>
          Client Preferences (Viñetas de requerimientos y preferencias)
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="Ej: Catering libre de gluten para técnicos, NDA firmado, etc." 
            value={preferenceInput} 
            onChange={e => setPreferenceInput(e.target.value)} 
            onKeyDown={handleAddPreference}
            className="form-input" 
            style={{ flex: 1, height: '38px', fontSize: '0.84rem' }} 
          />
          <Button 
            variant="secondary"
            size="sm"
            onClick={handleAddPreference}
            leftIcon={<Plus size={14} />}
          >
            Agregar
          </Button>
        </div>

        {clientPreferences.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
            {clientPreferences.map((pref, idx) => (
              <Badge 
                key={idx} 
                variant="blue"
                size="md"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>• {pref}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemovePreference(idx)} 
                  style={{ background: 'transparent', border: 'none', color: '#93c5fd', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  aria-label={`Eliminar preferencia ${pref}`}
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Third Parties Involved */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '0.80rem', fontWeight: 500, color: 'var(--text-muted)' }}>
          Third Parties Involved (Viñetas de terceros, sponsors o entes reguladores)
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="Ej: Municipalidad de CABA (Tránsito), Sponsor Monster, etc." 
            value={thirdPartyInput} 
            onChange={e => setThirdPartyInput(e.target.value)} 
            onKeyDown={handleAddThirdParty}
            className="form-input" 
            style={{ flex: 1, height: '38px', fontSize: '0.84rem' }} 
          />
          <Button 
            variant="secondary"
            size="sm"
            onClick={handleAddThirdParty}
            leftIcon={<Plus size={14} />}
          >
            Agregar
          </Button>
        </div>

        {thirdParties.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
            {thirdParties.map((tp, idx) => (
              <Badge 
                key={idx} 
                variant="purple"
                size="md"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>• {tp}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveThirdParty(idx)} 
                  style={{ background: 'transparent', border: 'none', color: '#d8b4fe', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  aria-label={`Eliminar tercero ${tp}`}
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
