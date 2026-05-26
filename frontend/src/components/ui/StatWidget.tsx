import React from 'react';
import { Card } from './Card';

interface StatWidgetProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  change?: string;
  isPositive?: boolean;
  variant?: 'default' | 'glass';
}

export const StatWidget: React.FC<StatWidgetProps> = ({
  title,
  value,
  icon,
  description,
  change,
  isPositive = true,
  variant = 'default',
}) => {
  return (
    <Card variant={variant} style={{ height: '100%' }}>
      <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'var(--space-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-sm)' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {title}
            </span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px', color: 'var(--text-primary)' }}>
              {value}
            </h3>
          </div>
          {icon && (
            <div 
              style={{ 
                padding: '10px', 
                borderRadius: 'var(--radius-md)', 
                backgroundColor: 'rgba(var(--accent-primary-rgb), 0.05)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </div>
          )}
        </div>

        <div>
          {change && (
            <span 
              style={{ 
                fontSize: '0.8rem', 
                fontWeight: 700, 
                color: isPositive ? 'var(--success)' : 'var(--danger)',
                marginRight: '6px'
              }}
            >
              {isPositive ? '↑' : '↓'} {change}
            </span>
          )}
          {description && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              {description}
            </span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
