import React, { useEffect } from 'react';

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className={`modal-container size-${size} animate-scale`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-container {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          max-height: 90vh;
          width: 90%;
        }
        .size-sm { max-width: 400px; }
        .size-md { max-width: 600px; }
        .size-lg { max-width: 800px; }
        .size-xl { max-width: 1100px; }

        .modal-header {
          padding: var(--space-md) var(--space-lg);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-body {
          padding: var(--space-lg);
          overflow-y: auto;
          flex: 1;
        }
        .modal-footer {
          padding: var(--space-md) var(--space-lg);
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-tertiary);
          display: flex;
          justify-content: flex-end;
          gap: var(--space-sm);
        }
        .animate-scale {
          animation: scale-up 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes scale-up {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Drawer Component (Slides from Right)
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div 
        className={`drawer-container d-size-${size} animate-slide-right`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <h3>{title}</h3>
          <button className="btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="drawer-body">
          {children}
        </div>

        {footer && (
          <div className="drawer-footer">
            {footer}
          </div>
        )}
      </div>

      <style>{`
        .drawer-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: flex-end;
          z-index: 1000;
        }
        .drawer-container {
          background-color: var(--bg-secondary);
          border-left: 1px solid var(--border-color);
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-xl);
        }
        .d-size-sm { width: 350px; }
        .d-size-md { width: 500px; }
        .d-size-lg { width: 750px; }

        @media (max-width: 500px) {
          .drawer-container { width: 100% !important; }
        }

        .drawer-header {
          padding: var(--space-md) var(--space-lg);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .drawer-body {
          padding: var(--space-lg);
          overflow-y: auto;
          flex: 1;
        }
        .drawer-footer {
          padding: var(--space-md) var(--space-lg);
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-tertiary);
          display: flex;
          justify-content: flex-end;
          gap: var(--space-sm);
        }
        .animate-slide-right {
          animation: slide-right-in 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes slide-right-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
