import React from 'react';
import { SplineWrapper } from './SplineWrapper';
import { SceneFallbackProps } from './SceneFallback';

interface SplineEmptyStateProps {
  sceneUrl: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  fallbackType?: SceneFallbackProps['type'];
  height?: string | number;
}

export const SplineEmptyState: React.FC<SplineEmptyStateProps> = ({
  sceneUrl,
  title,
  description,
  actionText,
  onAction,
  fallbackType = 'book',
  height = '240px',
}) => {
  return (
    <div 
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-xl)',
        textAlign: 'center',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '600px',
        margin: 'var(--space-xl) auto'
      }}
    >
      <div style={{ width: '100%', height: typeof height === 'number' ? `${height}px` : height, marginBottom: 'var(--space-md)' }}>
        <SplineWrapper 
          sceneUrl={sceneUrl} 
          height="100%" 
          fallbackType={fallbackType} 
          interactionMode="hover"
          loadingStrategy="lazy"
        />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 750, color: 'var(--text-primary)', marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', maxWidth: '400px', margin: '0 auto var(--space-lg)' }}>
        {description}
      </p>

      {actionText && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};
