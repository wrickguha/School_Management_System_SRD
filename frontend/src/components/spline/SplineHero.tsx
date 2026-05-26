import React from 'react';
import { SplineWrapper } from './SplineWrapper';

interface SplineHeroProps {
  sceneUrl: string;
  title: string;
  subtitle: string;
  description: string;
  primaryActionText?: string;
  onPrimaryAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  height?: string | number;
}

export const SplineHero: React.FC<SplineHeroProps> = ({
  sceneUrl,
  title,
  subtitle,
  description,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
  height = '500px',
}) => {
  const overlay = (
    <div 
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--space-xl)',
        background: 'linear-gradient(90deg, var(--bg-secondary) 0%, rgba(var(--bg-secondary), 0.8) 50%, rgba(var(--bg-secondary), 0) 100%)',
        boxSizing: 'border-box'
      }}
    >
      <div 
        className="animate-fade-in"
        style={{ 
          maxWidth: '550px', 
          zIndex: 10,
        }}
      >
        <span 
          style={{ 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            color: 'var(--accent-primary)', 
            textTransform: 'uppercase', 
            letterSpacing: '1.5px',
            display: 'block',
            marginBottom: 'var(--space-sm)'
          }}
        >
          {subtitle}
        </span>
        <h1 
          className="glow-text" 
          style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-md)'
          }}
        >
          {title}
        </h1>
        <p 
          style={{ 
            fontSize: '1rem', 
            color: 'var(--text-secondary)', 
            marginBottom: 'var(--space-lg)',
            lineHeight: 1.6
          }}
        >
          {description}
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          {primaryActionText && (
            <button className="btn btn-primary" onClick={onPrimaryAction}>
              {primaryActionText}
            </button>
          )}
          {secondaryActionText && (
            <button className="btn btn-secondary" onClick={onSecondaryAction}>
              {secondaryActionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      <SplineWrapper 
        sceneUrl={sceneUrl} 
        height={height} 
        fallbackType="campus"
        interactionMode="hover"
        loadingStrategy="eager"
        overlayContent={overlay}
      />
    </div>
  );
};
