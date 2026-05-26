import React from 'react';
import { SplineWrapper } from './SplineWrapper';

interface SplineSceneCardProps {
  sceneUrl: string;
  title: string;
  description: string;
  tag?: string;
  tagColor?: string;
  onClick?: () => void;
  height?: string | number;
}

export const SplineSceneCard: React.FC<SplineSceneCardProps> = ({
  sceneUrl,
  title,
  description,
  tag,
  tagColor = 'var(--accent-primary)',
  onClick,
  height = '180px',
}) => {
  return (
    <div 
      className="glass-card glass-card-interactive"
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)'
      }}
    >
      {/* 3D Visual Section */}
      <div style={{ position: 'relative', width: '100%', height: typeof height === 'number' ? `${height}px` : height, background: 'rgba(var(--accent-primary-rgb), 0.03)' }}>
        {tag && (
          <span 
            style={{ 
              position: 'absolute', 
              top: '12px', 
              left: '12px', 
              zIndex: 10,
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              backgroundColor: tagColor,
              color: 'white'
            }}
          >
            {tag}
          </span>
        )}
        <SplineWrapper 
          sceneUrl={sceneUrl} 
          height="100%" 
          fallbackType="academic"
          interactionMode="hover"
          loadingStrategy="lazy"
        />
      </div>

      {/* Description Content */}
      <div style={{ padding: 'var(--space-md)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
            {title}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
