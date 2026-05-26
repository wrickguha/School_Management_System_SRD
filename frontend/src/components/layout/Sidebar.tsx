import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NAVIGATION_ITEMS } from '../../config/navigation';
import * as Icons from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  // Filter navigation items by role
  const visibleItems = NAVIGATION_ITEMS.filter((item) => {
    if (item.roles === 'all') return true;
    return item.roles.includes(user.role);
  });

  // Dynamically retrieve Lucide icons by string identifier
  const renderIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent size={20} />;
    }
    return <Icons.HelpCircle size={20} />;
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const sidebarContent = (
    <div className="sidebar-inner">
      {/* Brand Logo Header */}
      <div className="brand-header">
        <Icons.GraduationCap size={32} color="var(--accent-primary)" />
        {!collapsed && (
          <div className="brand-title-group animate-fade-in">
            <span className="brand-name">Hogwarts ERP</span>
            <span className="brand-subtitle">School Management</span>
          </div>
        )}
      </div>

      {/* Nav List */}
      <nav className="nav-list">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link-item ${isActive ? 'is-active' : ''}`}
            onClick={() => setMobileOpen(false)} // Close drawer on mobile click
            title={collapsed ? item.title : undefined}
          >
            <div className="nav-link-icon">{renderIcon(item.icon)}</div>
            {!collapsed && <span className="nav-link-title">{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Context Footer */}
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="user-profile-summary">
            <img src={user.avatar} alt={user.name} className="user-avatar" />
            <div className="user-text">
              <span className="user-name">{user.name}</span>
              <span className="user-role-tag">{formatRole(user.role)}</span>
            </div>
          </div>
        )}
        <button className="btn-logout" onClick={logout} title="Sign Out">
          <Icons.LogOut size={20} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div className="mobile-sidebar-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main Sidebar Element */}
      <aside 
        className={`app-sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'mobile-is-open' : ''}`}
      >
        {sidebarContent}
      </aside>

      <style>{`
        .app-sidebar {
          width: var(--sidebar-width);
          background-color: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          height: 100vh;
          position: sticky;
          top: 0;
          z-index: 100;
          transition: width var(--transition-normal);
        }
        .app-sidebar.is-collapsed {
          width: var(--sidebar-collapsed-width);
        }
        .sidebar-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
          padding: var(--space-md) 0;
          box-sizing: border-box;
        }
        .brand-header {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 0 var(--space-md) var(--space-md) var(--space-md);
          border-bottom: 1px solid var(--border-color);
          height: 60px;
        }
        .brand-title-group {
          display: flex;
          flex-direction: column;
        }
        .brand-name {
          font-weight: 800;
          font-size: 1.15rem;
          color: var(--text-primary);
          line-height: 1.1;
        }
        .brand-subtitle {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          font-weight: 500;
        }
        .nav-list {
          flex: 1;
          margin-top: var(--space-lg);
          padding: 0 var(--space-sm);
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
        }
        .nav-link-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 0.65rem var(--space-sm);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all var(--transition-fast);
        }
        .nav-link-item:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }
        .nav-link-item.is-active {
          background-color: rgba(var(--accent-primary-rgb), 0.08);
          color: var(--accent-primary);
        }
        .nav-link-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sidebar-footer {
          padding: var(--space-md) var(--space-sm) 0 var(--space-sm);
          border-top: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        .user-profile-summary {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 0 var(--space-sm);
        }
        .user-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--border-color);
        }
        .user-text {
          display: flex;
          flex-direction: column;
        }
        .user-name {
          font-size: 0.85rem;
          font-weight: 750;
          color: var(--text-primary);
        }
        .user-role-tag {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--accent-primary);
        }
        .btn-logout {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          width: 100%;
          padding: 0.65rem var(--space-sm);
          border-radius: var(--radius-md);
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
        }
        .btn-logout:hover {
          background-color: rgba(239, 68, 68, 0.08);
          color: var(--danger);
        }

        /* Mobile Sidebar Overrides */
        @media (max-width: 1024px) {
          .app-sidebar {
            position: fixed;
            left: 0;
            top: 0;
            height: 100vh;
            transform: translateX(-100%);
            z-index: 1001;
            box-shadow: var(--shadow-xl);
          }
          .app-sidebar.mobile-is-open {
            transform: translateX(0);
          }
          .mobile-sidebar-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.3);
            backdrop-filter: blur(4px);
            z-index: 1000;
          }
        }
      `}</style>
    </>
  );
};
