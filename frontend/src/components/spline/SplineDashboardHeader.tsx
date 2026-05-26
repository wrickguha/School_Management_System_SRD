import React from 'react';
import { SplineWrapper } from './SplineWrapper';

interface StatItem {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
}

interface SplineDashboardHeaderProps {
  sceneUrl: string;
  title: string;
  subtitle: string;
  stats?: StatItem[];
  height?: string | number;
  fallbackType?: 'academic' | 'campus' | 'book' | 'transport' | 'finance';
}

export const SplineDashboardHeader: React.FC<SplineDashboardHeaderProps> = ({
  sceneUrl,
  title,
  subtitle,
  stats = [],
  height = '200px',
  fallbackType = 'academic',
}) => {
  const overlay = (
    <div 
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 var(--space-lg)',
        background: 'linear-gradient(90deg, var(--glass-bg) 0%, rgba(var(--bg-secondary), 0.7) 40%, rgba(var(--bg-secondary), 0) 100%)',
        boxSizing: 'border-box'
      }}
    >
      {/* Welcome message */}
      <div className="animate-fade-in" style={{ zIndex: 10 }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
          {title}
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {subtitle}
        </p>
      </div>

      {/* KPI Stats widgets layered over header */}
      {stats.length > 0 && (
        <div 
          className="hidden-mobile"
          style={{ 
            display: 'flex', 
            gap: 'var(--space-md)', 
            zIndex: 10,
            pointerEvents: 'auto'
          }}
        >
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="glass-card" 
              style={{ 
                padding: 'var(--space-sm) var(--space-md)',
                minWidth: '100px',
                textAlign: 'left',
                border: '1px solid var(--glass-border)'
              }}
            >
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>
                {stat.label}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>
                {stat.value}
              </span>
              {stat.change && (
                <span 
                  style={{ 
                    fontSize: '0.7rem', 
                    color: stat.isPositive ? 'var(--success)' : 'var(--danger)',
                    fontWeight: 600
                  }}
                >
                  {stat.change}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );

  return (
    <div 
      className="glass-panel"
      style={{ 
        position: 'relative', 
        width: '100%', 
        overflow: 'hidden', 
        marginBottom: 'var(--space-lg)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)'
      }}
    >
      <SplineWrapper 
        sceneUrl={sceneUrl} 
        height={height} 
        fallbackType={fallbackType}
        interactionMode="hover"
        loadingStrategy="lazy"
        overlayContent={overlay}
      />
    </div>
  );
};
