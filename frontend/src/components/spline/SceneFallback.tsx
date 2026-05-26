import React from 'react';

export interface SceneFallbackProps {
  title?: string;
  subtitle?: string;
  height?: string | number;
  type?: 'academic' | 'campus' | 'book' | 'transport' | 'finance' | 'onboarding';
}

export const SceneFallback: React.FC<SceneFallbackProps> = ({
  title,
  subtitle,
  height = '100%',
  type = 'academic',
}) => {
  // Render different beautiful SVG illustrations depending on the context
  const getIllustration = () => {
    switch (type) {
      case 'campus':
        return (
          <svg viewBox="0 0 100 80" fill="none" className="fallback-svg">
            <path d="M10 70 L90 70 M50 15 L85 45 L85 70 L15 70 L15 45 Z" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M42 70 L42 50 L58 50 L58 70" stroke="var(--accent-secondary)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="50" cy="35" r="5" stroke="var(--warning)" strokeWidth="1" />
            <path d="M30 45 L30 55 M70 45 L70 55" stroke="var(--text-tertiary)" strokeWidth="1" />
          </svg>
        );
      case 'book':
        return (
          <svg viewBox="0 0 100 80" fill="none" className="fallback-svg">
            <path d="M25 20 H75 C80 20, 80 55, 75 55 H25 C20 55, 20 20, 25 20 Z" stroke="var(--accent-primary)" strokeWidth="1.5" />
            <path d="M25 20 L25 55 M35 20 L35 55 M75 20 L75 55" stroke="var(--accent-secondary)" strokeWidth="1" />
            <path d="M45 30 H65 M45 40 H60" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case 'transport':
        return (
          <svg viewBox="0 0 100 80" fill="none" className="fallback-svg">
            <rect x="20" y="25" width="60" height="30" rx="6" stroke="var(--warning)" strokeWidth="1.5" />
            <circle cx="35" cy="55" r="6" stroke="var(--text-primary)" strokeWidth="1.5" fill="var(--bg-secondary)" />
            <circle cx="65" cy="55" r="6" stroke="var(--text-primary)" strokeWidth="1.5" fill="var(--bg-secondary)" />
            <line x1="20" y1="40" x2="80" y2="40" stroke="var(--warning)" strokeWidth="1" />
            <rect x="25" y="30" width="12" height="8" rx="1" stroke="var(--accent-secondary)" strokeWidth="1" />
            <rect x="44" y="30" width="12" height="8" rx="1" stroke="var(--accent-secondary)" strokeWidth="1" />
            <rect x="63" y="30" width="12" height="8" rx="1" stroke="var(--accent-secondary)" strokeWidth="1" />
          </svg>
        );
      case 'finance':
        return (
          <svg viewBox="0 0 100 80" fill="none" className="fallback-svg">
            <rect x="25" y="20" width="50" height="40" rx="4" stroke="var(--success)" strokeWidth="1.5" />
            <circle cx="50" cy="40" r="10" stroke="var(--success)" strokeWidth="1.5" />
            <path d="M50 35 V45 M47 38 H53 M47 42 H53" stroke="var(--success)" strokeWidth="1.2" />
            <line x1="32" y1="30" x2="38" y2="30" stroke="var(--text-tertiary)" strokeWidth="1.5" />
            <line x1="32" y1="50" x2="38" y2="50" stroke="var(--text-tertiary)" strokeWidth="1.5" />
          </svg>
        );
      case 'onboarding':
        return (
          <svg viewBox="0 0 100 80" fill="none" className="fallback-svg">
            <path d="M50 15 L80 35 L80 65 L50 75 L20 65 L20 35 Z" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="50" y1="15" x2="50" y2="75" stroke="var(--accent-primary)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="50" cy="45" r="8" stroke="var(--accent-secondary)" strokeWidth="1.5" fill="var(--bg-secondary)" />
          </svg>
        );
      case 'academic':
      default:
        return (
          <svg viewBox="0 0 100 80" fill="none" className="fallback-svg">
            <path d="M50 15 L85 30 L50 45 L15 30 Z" fill="rgba(99, 102, 241, 0.1)" stroke="var(--accent-primary)" strokeWidth="1.5" />
            <path d="M22 36 V52 C22 58 35 63 50 63 C65 63 78 58 78 52 V36" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M85 30 V50 L82 52" stroke="var(--warning)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="82" cy="52" r="2.5" fill="var(--warning)" />
          </svg>
        );
    }
  };

  return (
    <div 
      className="scene-fallback-container shimmer"
      style={{ 
        height: typeof height === 'number' ? `${height}px` : height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        padding: 'var(--space-md)',
        textAlign: 'center'
      }}
    >
      <div 
        style={{ 
          width: '120px', 
          height: '120px', 
          marginBottom: 'var(--space-md)',
          opacity: 0.8
        }}
      >
        {getIllustration()}
      </div>

      {title && (
        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
          {title}
        </h4>
      )}

      {subtitle && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {subtitle}
        </p>
      )}

      <style>{`
        .fallback-svg {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.05));
          animation: float-fallback 3s ease-in-out infinite;
        }
        @keyframes float-fallback {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};
