import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../store/AuthContext';
import { useTheme } from '../store/ThemeContext';
import {
  LayoutDashboard, UserCheck, Users, ShieldAlert,
  ClipboardList, BookOpen, CreditCard, Bus,
  Library as LibraryIcon, Home as HomeIcon, Award, MessageSquare,
  FileBarChart, Settings, LogOut, Sun, Moon, Bell, Search,
  Menu, ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';
import NotificationPanel from '../components/NotificationPanel';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  roles: UserRole[];
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Teacher', 'Parent', 'Student', 'Faculty', 'Librarian', 'Super Admin', 'School Admin', 'Principal', 'Accountant', 'HR'] },
  { name: 'Admissions', path: '/dashboard/admissions', icon: UserCheck, roles: ['Super Admin', 'School Admin'] },
  { name: 'Students', path: '/dashboard/students', icon: Users, roles: ['Teacher', 'Faculty', 'Super Admin', 'School Admin', 'Principal'] },
  { name: 'Teachers', path: '/dashboard/teachers', icon: Users, roles: ['Super Admin', 'School Admin', 'HR'] },
  { name: 'Parents', path: '/dashboard/parents', icon: Users, roles: ['Super Admin', 'School Admin', 'Principal'] },
  { name: 'Attendance', path: '/dashboard/attendance', icon: ClipboardList, roles: ['Teacher', 'Faculty', 'Parent', 'Student', 'Super Admin', 'School Admin', 'Principal'] },
  { name: 'Examinations', path: '/dashboard/exams', icon: Award, roles: ['Teacher', 'Faculty', 'Parent', 'Student', 'Super Admin', 'School Admin', 'Principal'] },
  { name: 'Homework', path: '/dashboard/homework', icon: BookOpen, roles: ['Teacher', 'Faculty', 'Parent', 'Student', 'Super Admin', 'School Admin', 'Principal'] },
  { name: 'Fees & Finance', path: '/dashboard/fees', icon: CreditCard, roles: ['Parent', 'Super Admin', 'School Admin', 'Principal', 'Accountant'] },
  { name: 'Transport', path: '/dashboard/transport', icon: Bus, roles: ['Teacher', 'Faculty', 'Parent', 'Student', 'Super Admin', 'School Admin', 'Principal'] },
  { name: 'Library', path: '/dashboard/library', icon: LibraryIcon, roles: ['Teacher', 'Faculty', 'Librarian', 'Parent', 'Student', 'Super Admin', 'School Admin', 'Principal'] },
  { name: 'Hostel', path: '/dashboard/hostel', icon: HomeIcon, roles: ['Teacher', 'Faculty', 'Parent', 'Student', 'Super Admin', 'School Admin', 'Principal'] },
  { name: 'HR & Payroll', path: '/dashboard/payroll', icon: ShieldAlert, roles: ['Super Admin', 'School Admin', 'Accountant', 'HR'] },
  { name: 'Communication', path: '/dashboard/communication', icon: MessageSquare, roles: ['Teacher', 'Faculty', 'Parent', 'Student', 'Librarian', 'Super Admin', 'School Admin', 'Principal', 'Accountant', 'HR'] },
  { name: 'Reports', path: '/dashboard/reports', icon: FileBarChart, roles: ['Teacher', 'Faculty', 'Librarian', 'Super Admin', 'School Admin', 'Principal', 'Accountant', 'HR'] },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings, roles: ['Teacher', 'Faculty', 'Parent', 'Student', 'Librarian', 'Super Admin', 'School Admin', 'Principal', 'Accountant', 'HR'] },
];

export const DashboardLayout: React.FC = () => {
  const { user, role, switchRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showRoleSwapper, setShowRoleSwapper] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    setShowRoleSwapper(false);
    navigate('/dashboard'); // redirect to dash home
  };

  const filteredItems = sidebarItems.filter(item => role && item.roles.includes(role));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. Collapsible Sidebar for Desktop */}
      <aside 
        className={`hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 relative z-30 ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Sidebar Header Logo */}
        <div className={`h-20 flex items-center border-b border-slate-200/60 dark:border-slate-800/80 transition-all duration-300 ${
          isSidebarCollapsed ? 'justify-center px-4' : 'justify-between px-6'
        }`}>
          <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden group">
            {isSidebarCollapsed ? (
              <div className="h-12 w-12 shrink-0 overflow-hidden flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300">
                <img src="/subhraedu_logo.png" alt="SubhraEdu" className="h-10 w-auto max-w-none object-left object-contain" />
              </div>
            ) : (
              <img src="/subhraedu_logo.png" alt="SubhraEdu Logo" className="h-14 w-auto object-contain hover:scale-[1.03] active:scale-95 transition-all duration-300" />
            )}
          </Link>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-school-blue text-white shadow-md shadow-school-blue/15'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`} />
                {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute top-1/2 -right-3.5 h-7 w-7 rounded-full border border-slate-250 dark:border-slate-850 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-450 dark:text-slate-550 shadow-md hover:bg-slate-50 transition-colors z-40"
        >
          {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/80">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
          >
            <LogOut className="h-5 w-5 text-red-500" />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Mobile Sidebar drawer */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <img src="/subhraedu_logo.png" alt="SubhraEdu Logo" className="h-14 w-auto object-contain" />
          <button onClick={() => setIsMobileOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? 'bg-school-blue text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-850">
          <button onClick={handleLogout} className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Page Content View Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Sticky Top Nav Bar */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/85 px-6 flex items-center justify-between shrink-0 relative z-20">
          
          {/* Menu triggers */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 md:hidden text-slate-500 hover:bg-slate-150 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Global Search Bar */}
            <div className="relative hidden sm:block w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Global search module/record..."
                className="w-full pl-11 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
              />
            </div>
          </div>

          {/* User actions and controls */}
          <div className="flex items-center gap-4">
            
            {/* Role Swapper Dropdown (Enterprise Demo utility) */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSwapper(!showRoleSwapper)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-250 dark:border-slate-750 text-xs font-bold text-school-blue dark:text-school-greenLight hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm"
              >
                <RefreshCw className="h-3 w-3 animate-spin-slow" />
                <span>Portal: {role}</span>
              </button>

              {showRoleSwapper && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowRoleSwapper(false)} />
                  <div className="absolute right-0 mt-2 w-48 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium z-50 p-2 space-y-1 scrollbar-thin">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-455 uppercase tracking-widest border-b border-slate-150 dark:border-slate-800 mb-1 sticky top-0 bg-white dark:bg-slate-900 z-10">
                      Choose demo portal
                    </div>
                    {(['Super Admin', 'School Admin', 'Principal', 'Teacher', 'Faculty', 'Librarian', 'Parent', 'Student', 'Accountant', 'HR'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => handleRoleChange(r)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          role === r 
                            ? 'bg-school-blue text-white' 
                            : 'text-slate-655 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {r} View
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Dark Mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-yellow-500" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 relative transition-colors"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-school-maroon animate-ping" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-school-maroon" />
              </button>
              
              {showNotifications && (
                <NotificationPanel onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              <img 
                src={user?.avatar} 
                alt="user avatar" 
                className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-800 object-cover shadow-sm"
              />
              <div className="hidden lg:flex flex-col">
                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{user?.name}</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{role} Dashboard</span>
              </div>
            </div>

          </div>
        </header>

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 dark:bg-slate-950/40">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
