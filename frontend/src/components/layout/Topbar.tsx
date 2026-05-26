import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';
import * as Icons from 'lucide-react';

interface TopbarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { user, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  if (!user) return null;

  const rolesList: { value: UserRole; label: string }[] = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'school_admin', label: 'School Admin' },
    { value: 'principal', label: 'Principal' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'student', label: 'Student' },
    { value: 'parent', label: 'Parent' },
    { value: 'accountant', label: 'Accountant' },
    { value: 'librarian', label: 'Librarian' },
    { value: 'transport_manager', label: 'Transport Manager' },
    { value: 'hr_reception', label: 'HR / Reception' },
  ];

  const handleRoleChange = async (role: UserRole) => {
    setShowRoleSwitcher(false);
    await login(user.email, role);
    // Reload page to reset all states and context route guards
    window.location.reload();
  };

  const getRoleLabel = (role: UserRole) => {
    return rolesList.find(r => r.value === role)?.label || role;
  };

  return (
    <header className="app-topbar">
      {/* Sidebar toggle buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Mobile menu toggle */}
        <button 
          className="btn-icon mobile-menu-toggle" 
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Icons.Menu size={20} />
        </button>

        {/* Desktop toggle collapse */}
        <button 
          className="btn-icon desktop-menu-toggle" 
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Icons.ChevronRight size={20} /> : <Icons.Menu size={20} />}
        </button>

        {/* Search simulation input */}
        <div className="search-bar-wrapper">
          <Icons.Search size={16} className="search-bar-icon" />
          <input type="text" placeholder="Search anything..." className="search-bar-input" />
        </div>
      </div>

      {/* Action buttons (Switch, Theme, Alert) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
        
        {/* Demo User Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn-role-switcher"
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
          >
            <Icons.User size={16} />
            <span className="current-role-label">{getRoleLabel(user.role)}</span>
            <Icons.ChevronDown size={14} />
          </button>
          
          {showRoleSwitcher && (
            <>
              <div className="role-dropdown-backdrop" onClick={() => setShowRoleSwitcher(false)} />
              <div className="role-dropdown-menu animate-fade-in-quick">
                <span className="dropdown-section-title">Change ERP Role Simulator</span>
                {rolesList.map((r) => (
                  <button
                    key={r.value}
                    className={`dropdown-item ${user.role === r.value ? 'is-active' : ''}`}
                    onClick={() => handleRoleChange(r.value)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Theme switch button */}
        <button className="btn-icon" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <Icons.Sun size={20} /> : <Icons.Moon size={20} />}
        </button>

        {/* Notification indicator */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn-icon" 
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Icons.Bell size={20} />
            <span className="notification-badge-dot" />
          </button>

          {showNotifications && (
            <>
              <div className="role-dropdown-backdrop" onClick={() => setShowNotifications(false)} />
              <div className="notifications-dropdown-menu animate-fade-in-quick">
                <div className="notifications-header">
                  <h4>Recent Notices</h4>
                  <span className="mark-read-all">Mark read</span>
                </div>
                <div className="notifications-list">
                  <div className="notice-notify-item">
                    <span className="notice-notify-tag primary">Academics</span>
                    <p className="notice-notify-text">End of Term Feast Schedule announced by Prof. Dumbledore.</p>
                    <span className="notice-notify-time">1 hr ago</span>
                  </div>
                  <div className="notice-notify-item">
                    <span className="notice-notify-tag warning">Security</span>
                    <p className="notice-notify-text">Curfew reminder: Wandering corridors forbidden after 22:00.</p>
                    <span className="notice-notify-time">5 hrs ago</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Avatar */}
        <img src={user.avatar} alt={user.name} className="topbar-avatar" />
      </div>

      <style>{`
        .app-topbar {
          height: var(--topbar-height);
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-lg);
          position: sticky;
          top: 0;
          z-index: 99;
        }

        .mobile-menu-toggle { display: none; }
        .search-bar-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-bar-icon {
          position: absolute;
          left: 12px;
          color: var(--text-tertiary);
        }
        .search-bar-input {
          padding: 0.5rem 0.8rem 0.5rem 2.2rem;
          border: 1px solid var(--border-color);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          border-radius: var(--radius-md);
          outline: none;
          font-size: 0.8rem;
          width: 220px;
        }

        .btn-role-switcher {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          background-color: var(--bg-primary);
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
        }
        .btn-role-switcher:hover {
          border-color: var(--accent-primary);
          color: var(--text-primary);
        }
        .current-role-label {
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .role-dropdown-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1001;
        }
        .role-dropdown-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 200px;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          border-radius: var(--radius-md);
          padding: 6px;
          z-index: 1002;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .dropdown-section-title {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-tertiary);
          padding: 6px 10px;
          text-transform: uppercase;
        }
        .dropdown-item {
          padding: 8px 10px;
          font-size: 0.8rem;
          font-weight: 600;
          text-align: left;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          cursor: pointer;
        }
        .dropdown-item:hover {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
        }
        .dropdown-item.is-active {
          background-color: rgba(var(--accent-primary-rgb), 0.08);
          color: var(--accent-primary);
        }

        .notification-badge-dot {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 6px;
          height: 6px;
          background-color: var(--danger);
          border-radius: 50%;
        }
        .notifications-dropdown-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 320px;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          border-radius: var(--radius-md);
          z-index: 1002;
          overflow: hidden;
        }
        .notifications-header {
          display: flex;
          justify-content: space-between;
          padding: var(--space-md);
          border-bottom: 1px solid var(--border-color);
          align-items: center;
        }
        .notifications-header h4 { font-size: 0.9rem; }
        .mark-read-all { font-size: 0.75rem; color: var(--accent-primary); cursor: pointer; font-weight: 600; }
        
        .notifications-list {
          max-height: 250px;
          overflow-y: auto;
        }
        .notice-notify-item {
          padding: var(--space-md);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .notice-notify-tag {
          font-size: 0.65rem;
          padding: 1px 6px;
          border-radius: var(--radius-round);
          width: fit-content;
          font-weight: 700;
          text-transform: uppercase;
        }
        .notice-notify-tag.primary { background: rgba(var(--accent-primary-rgb), 0.1); color: var(--accent-primary); }
        .notice-notify-tag.warning { background: rgba(245, 158, 11, 0.1); color: var(--warning); }
        .notice-notify-text { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; }
        .notice-notify-time { font-size: 0.7rem; color: var(--text-tertiary); }

        .topbar-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--border-color);
        }

        @media (max-width: 1024px) {
          .mobile-menu-toggle { display: flex; }
          .desktop-menu-toggle { display: none; }
        }
        @media (max-width: 768px) {
          .search-bar-wrapper { display: none; }
          .app-topbar { padding: 0 var(--space-md); }
        }
      `}</style>
    </header>
  );
};
