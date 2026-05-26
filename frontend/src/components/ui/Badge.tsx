import React from 'react';

type BadgeColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  variant?: 'solid' | 'light';
  style?: React.CSSProperties;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'primary',
  variant = 'light',
  style,
  className = '',
}) => {
  const getBadgeStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      fontSize: '0.75rem',
      fontWeight: 700,
      borderRadius: 'var(--radius-round)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      whiteSpace: 'nowrap',
      ...style,
    };

    const varsMap = {
      primary: {
        solid: { bg: 'var(--accent-primary)', text: 'white' },
        light: { bg: 'rgba(var(--accent-primary-rgb), 0.1)', text: 'var(--accent-primary)' }
      },
      secondary: {
        solid: { bg: 'var(--text-secondary)', text: 'var(--bg-primary)' },
        light: { bg: 'var(--bg-tertiary)', text: 'var(--text-secondary)' }
      },
      success: {
        solid: { bg: 'var(--success)', text: 'white' },
        light: { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--success)' }
      },
      warning: {
        solid: { bg: 'var(--warning)', text: 'var(--bg-primary)' },
        light: { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--warning)' }
      },
      danger: {
        solid: { bg: 'var(--danger)', text: 'white' },
        light: { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--danger)' }
      },
      info: {
        solid: { bg: 'var(--info)', text: 'white' },
        light: { bg: 'rgba(59, 130, 246, 0.1)', text: 'var(--info)' }
      }
    };

    const target = varsMap[color][variant];
    return {
      ...base,
      backgroundColor: target.bg,
      color: target.text,
    };
  };

  return (
    <span className={`sms-badge ${className}`} style={getBadgeStyle()}>
      {children}
    </span>
  );
};
