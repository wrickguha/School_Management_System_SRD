import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const AppShell: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Generate simple breadcrumbs from path
  const renderBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    if (pathnames.length === 0) return null;

    return (
      <div className="breadcrumb-nav">
        <Link to="/dashboard" className="breadcrumb-link">
          Home
        </Link>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayValue = value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <React.Fragment key={to}>
              <span className="breadcrumb-separator">/</span>
              {isLast ? (
                <span className="breadcrumb-current">{displayValue}</span>
              ) : (
                <Link to={to} className="breadcrumb-link">
                  {displayValue}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="app-layout-shell">
      {/* 3D Immersive glowing orbs in the background */}
      <div className="glow-orb glow-orb-primary" />
      <div className="glow-orb glow-orb-secondary" />

      <div className="app-container">
        {/* Collapsible Sidebar */}
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Main View Area */}
        <div className="main-content">
          <Topbar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />

          <main className="page-wrapper-outer">
            {/* Breadcrumb row */}
            <div className="breadcrumbs-bar">
              {renderBreadcrumbs()}
            </div>
            
            {/* Main Outlet */}
            <div className="page-wrapper animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <style>{`
        .app-layout-shell {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          background-color: var(--bg-primary);
        }
        .page-wrapper-outer {
          display: flex;
          flex-direction: column;
          flex: 1;
          z-index: 10;
        }
        .breadcrumbs-bar {
          padding: var(--space-md) var(--space-lg) 0 var(--space-lg);
          z-index: 10;
        }
        .breadcrumb-nav {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .breadcrumb-link {
          color: var(--text-tertiary);
          text-decoration: none;
          transition: color var(--transition-fast);
        }
        .breadcrumb-link:hover {
          color: var(--accent-primary);
        }
        .breadcrumb-separator {
          color: var(--text-tertiary);
        }
        .breadcrumb-current {
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
};
export default AppShell;
