import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'outlined';
  interactive?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> & {
  Header: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; className?: string }>;
  Body: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; className?: string }>;
  Footer: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; className?: string }>;
} = ({ children, className = '', variant = 'default', interactive = false, onClick, style }) => {
  
  const getCardClass = () => {
    let classes = 'sms-card ';
    if (variant === 'glass') {
      classes += 'glass-card ';
    } else if (variant === 'outlined') {
      classes += 'outlined-card ';
    } else {
      classes += 'default-card ';
    }

    if (interactive) {
      classes += 'glass-card-interactive ';
    }
    return classes + className;
  };

  return (
    <div 
      className={getCardClass()} 
      onClick={onClick} 
      style={{
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--transition-normal)',
        ...style
      }}
    >
      {children}
      
      <style>{`
        .sms-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }
        .default-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
        }
        .default-card:hover {
          box-shadow: var(--shadow-md);
        }
        .outlined-card {
          background-color: transparent;
          border: 1px solid var(--border-color);
        }
        .outlined-card:hover {
          border-color: var(--text-tertiary);
        }
      `}</style>
    </div>
  );
};

// Card Header Subcomponent
Card.Header = ({ children, style, className = '' }) => (
  <div 
    className={`card-header ${className}`} 
    style={{
      padding: 'var(--space-md) var(--space-lg)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...style
    }}
  >
    {children}
  </div>
);

// Card Body Subcomponent
Card.Body = ({ children, style, className = '' }) => (
  <div 
    className={`card-body ${className}`} 
    style={{
      padding: 'var(--space-lg)',
      flex: 1,
      ...style
    }}
  >
    {children}
  </div>
);

// Card Footer Subcomponent
Card.Footer = ({ children, style, className = '' }) => (
  <div 
    className={`card-footer ${className}`} 
    style={{
      padding: 'var(--space-md) var(--space-lg)',
      borderTop: '1px solid var(--border-color)',
      backgroundColor: 'rgba(var(--accent-primary-rgb), 0.01)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 'var(--space-sm)',
      ...style
    }}
  >
    {children}
  </div>
);
