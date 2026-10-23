import React from 'react';
import { Outlet } from 'react-router';
import { Sparkles, ShieldCheck, Cpu } from 'lucide-react';
import { useSettingsStore } from '@/stores';

export const AuthLayout: React.FC = () => {
  const companyLogo = useSettingsStore(s => s.companyLogo);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--bg-dark)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px 16px',
        boxSizing: 'border-box'
      }}
    >
      {/* Ambient background glow effects */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, rgba(8, 11, 17, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '10%',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, rgba(8, 11, 17, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Main card container */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {/* Brand identity header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)'
            }}
          >
            {companyLogo ? (
              <img
                src={companyLogo}
                alt="METODICAH"
                style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '8px' }}
              />
            ) : (
              <Sparkles size={24} />
            )}
          </div>
          <div>
            <h1
              style={{
                fontSize: '1.45rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: '#fff',
                margin: 0,
                fontFamily: 'var(--font-heading)'
              }}
            >
              METODICAH
            </h1>
            <p
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-dim)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                margin: '2px 0 0 0',
                fontWeight: 600
              }}
            >
              STUDIO CONTROL · LIVE EVENT MANAGEMENT
            </p>
          </div>
        </div>

        {/* Content Outlet (Login or Register View) */}
        <div
          className="glass-panel"
          style={{
            padding: '32px 28px',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.55)',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <React.Suspense fallback={<div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>Cargando módulo...</div>}>
            <Outlet />
          </React.Suspense>
        </div>

        {/* System security & status indicators */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '18px',
            fontSize: '0.72rem',
            color: 'var(--text-dim)',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={13} style={{ color: '#10b981' }} />
            <span>Acceso Seguro Encriptado</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={13} style={{ color: '#f59e0b' }} />
            <span>METODICAH Core v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
