import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../store/AuthContext';
import { usePermission } from '../store/PermissionContext';
import { useTheme } from '../store/ThemeContext';
import {
  LayoutDashboard, UserCheck, Users, ShieldAlert,
  ClipboardList, BookOpen, CreditCard, Bus,
  Library as LibraryIcon, Home as HomeIcon, Award, MessageSquare,
  FileBarChart, Settings, LogOut, Sun, Moon, Search,
  Menu, ChevronLeft, ChevronRight, Briefcase, Layers, Key
} from 'lucide-react';
import logoUrl from '../assets/subhraedu_logo.png';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  roles: UserRole[];
  permission?: string;
}

const ALL_SYSTEM_ROLES: UserRole[] = [
  'Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'Department Head',
  'Class Teacher', 'Teacher', 'Faculty', 'Accountant', 'HR', 'Office Staff',
  'Receptionist', 'Librarian', 'Lab Assistant', 'Transport Manager', 'Driver',
  'Security Guard', 'Cleaner', 'Hostel Warden', 'Nurse', 'Counselor',
  'Student', 'Parent', 'Staff', 'Other'
];

const STAFF_ROLES: UserRole[] = ALL_SYSTEM_ROLES.filter(r => r !== 'Student' && r !== 'Parent');

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ALL_SYSTEM_ROLES, permission: 'dashboard.view' },
  { name: 'Roles & Permissions', path: '/dashboard/rbac', icon: Key, roles: ['Super Admin', 'School Admin', 'Principal', 'HR'], permission: 'role.view' },
  { name: 'Work Allocation', path: '/dashboard/work-assignments', icon: Briefcase, roles: STAFF_ROLES, permission: 'work.view' },
  { name: 'Admissions', path: '/dashboard/admissions', icon: UserCheck, roles: ['Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'Office Staff', 'Receptionist'], permission: 'enquiry.view' },
  { name: 'Students', path: '/dashboard/students', icon: Users, roles: ['Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'Department Head', 'Class Teacher', 'Teacher', 'Faculty', 'Office Staff', 'Counselor'], permission: 'student.view' },
  { name: 'Teachers', path: '/dashboard/teachers', icon: Users, roles: ['Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'HR', 'Department Head'], permission: 'teacher.view' },
  { name: 'Parents', path: '/dashboard/parents', icon: Users, roles: ['Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'Counselor', 'Receptionist'], permission: 'parent.view' },
  { name: 'Attendance', path: '/dashboard/attendance', icon: ClipboardList, roles: ['Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'Department Head', 'Class Teacher', 'Teacher', 'Faculty', 'Parent', 'Student'], permission: 'attendance.view' },
  { name: 'Examinations', path: '/dashboard/exams', icon: Award, roles: ['Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'Department Head', 'Class Teacher', 'Teacher', 'Faculty', 'Parent', 'Student'], permission: 'exam.view' },
  { name: 'Certificates', path: '/dashboard/certificates', icon: Award, roles: ['Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'Teacher', 'Faculty', 'Office Staff', 'Parent', 'Student'], permission: 'certificate.view' },
  { name: 'Course Management', path: '/dashboard/courses', icon: BookOpen, roles: ['Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'Department Head', 'Class Teacher', 'Teacher', 'Faculty', 'Office Staff'], permission: 'course.view' },
  { name: 'Batch Management', path: '/dashboard/batches', icon: Layers, roles: ['Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'Department Head', 'Class Teacher', 'Teacher', 'Faculty', 'Office Staff'], permission: 'batch.view' },
  { name: 'Homework', path: '/dashboard/homework', icon: BookOpen, roles: ['Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'Department Head', 'Class Teacher', 'Teacher', 'Faculty', 'Parent', 'Student'], permission: 'homework.view' },
  { name: 'Fees & Finance', path: '/dashboard/fees', icon: CreditCard, roles: ['Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'Accountant', 'Parent'], permission: 'fee.view' },
  { name: 'Transport', path: '/dashboard/transport', icon: Bus, roles: ['Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'Transport Manager', 'Driver', 'Teacher', 'Faculty', 'Parent', 'Student'], permission: 'transport.view' },
  { name: 'Library', path: '/dashboard/library', icon: LibraryIcon, roles: ['Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'Librarian', 'Lab Assistant', 'Teacher', 'Faculty', 'Parent', 'Student'], permission: 'library.view' },
  { name: 'Hostel', path: '/dashboard/hostel', icon: HomeIcon, roles: ['Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'Hostel Warden', 'Teacher', 'Faculty', 'Parent', 'Student'], permission: 'hostel.view' },
  { name: 'HR & Payroll', path: '/dashboard/payroll', icon: ShieldAlert, roles: ['Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'Accountant', 'HR'], permission: 'payroll.view' },
  { name: 'Communication', path: '/dashboard/communication', icon: MessageSquare, roles: ALL_SYSTEM_ROLES, permission: 'communication.view' },
  { name: 'Reports', path: '/dashboard/reports', icon: FileBarChart, roles: ['Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'Department Head', 'Class Teacher', 'Teacher', 'Faculty', 'Librarian', 'Accountant', 'HR'], permission: 'dashboard.reports' },
  { name: 'Event Calendar', path: '/dashboard/events', icon: Award, roles: ALL_SYSTEM_ROLES },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings, roles: ['Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'HR', 'Accountant'], permission: 'settings.view' },
  { name: 'Manage Members', path: '/dashboard/members', icon: Users, roles: ['Super Admin', 'School Admin', 'Principal', 'HR'], permission: 'user.view' },
];

const PATH_TO_MODULE_ID: Record<string, string> = {
  '/dashboard/work-assignments': 'work_assignments',
  '/dashboard/admissions': 'admissions',
  '/dashboard/students': 'students',
  '/dashboard/teachers': 'teachers',
  '/dashboard/parents': 'parents',
  '/dashboard/attendance': 'attendance',
  '/dashboard/exams': 'exams',
  '/dashboard/certificates': 'certificates',
  '/dashboard/courses': 'courses',
  '/dashboard/batches': 'batches',
  '/dashboard/homework': 'homework',
  '/dashboard/fees': 'fees',
  '/dashboard/transport': 'transport',
  '/dashboard/library': 'library',
  '/dashboard/hostel': 'hostel',
  '/dashboard/payroll': 'payroll',
  '/dashboard/communication': 'communication',
  '/dashboard/reports': 'reports',
  '/dashboard/events': 'events',
  '/dashboard/settings': 'settings',
  '/dashboard/members': 'members',
};

const ROLE_TO_KEY: Record<string, string> = {
  'Teacher': 'teacher',
  'Faculty': 'teacher',
  'Class Teacher': 'teacher',
  'Accountant': 'accountant',
  'HR': 'hr',
  'Librarian': 'librarian',
  'Principal': 'principal',
  'Vice Principal': 'principal',
  'Receptionist': 'receptionist',
  'Transport Manager': 'transport_manager',
  'Hostel Warden': 'hostel_warden',
  'Office Staff': 'office_staff',
};

export const DashboardLayout: React.FC = () => {
  const { user, role, logout, switchRole } = useAuth();
  const { hasPermission } = usePermission();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [customPermissions, setCustomPermissions] = useState<Record<string, string[]> | null>(() => {
    const saved = localStorage.getItem('subhraedu_role_permissions');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem('subhraedu_role_permissions');
      setCustomPermissions(saved ? JSON.parse(saved) : null);
    };
    window.addEventListener('role-permissions-updated', handleUpdate);
    return () => window.removeEventListener('role-permissions-updated', handleUpdate);
  }, []);

  const receptionistSidebarItems: SidebarItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Receptionist'] },
    { name: 'Visitor Management', path: '/dashboard/visitors', icon: UserCheck, roles: ['Receptionist'] },
    { name: 'Admission Enquiries', path: '/dashboard/admissions', icon: UserCheck, roles: ['Receptionist'] },
    { name: 'Student Registration', path: '/dashboard/students', icon: Users, roles: ['Receptionist'] },
    { name: 'Student Search', path: '/dashboard/students', icon: Search, roles: ['Receptionist'] },
    { name: 'Parent Directory', path: '/dashboard/parents', icon: Users, roles: ['Receptionist'] },
    { name: 'Appointments', path: '/dashboard/appointments', icon: Award, roles: ['Receptionist'] },
    { name: 'Communication', path: '/dashboard/communication', icon: MessageSquare, roles: ['Receptionist'] },
    { name: 'Work Allocation', path: '/dashboard/work-assignments', icon: Briefcase, roles: ['Receptionist'] },
    { name: 'Complaints', path: '/dashboard/complaints', icon: ShieldAlert, roles: ['Receptionist'] },
    { name: 'Event Calendar', path: '/dashboard/events', icon: Award, roles: ['Receptionist'] },
    { name: 'Reports', path: '/dashboard/reports', icon: FileBarChart, roles: ['Receptionist'] },
  ];

  const getFilteredItems = (): SidebarItem[] => {
    const isItemAllowedByPermission = (item: SidebarItem) => {
      if (!item.permission) return true;
      return hasPermission(item.permission);
    };

    if (role === 'Super Admin') {
      return sidebarItems.filter(isItemAllowedByPermission);
    }

    const roleKey = role ? (ROLE_TO_KEY[role] || role.toLowerCase().replace(/ /g, '_')) : '';
    const allowedModules = customPermissions && roleKey ? customPermissions[roleKey] : null;

    const shouldDisplayItem = (item: SidebarItem) => {
      if (!isItemAllowedByPermission(item)) {
        return false;
      }

      if (!allowedModules) {
        return item.path === '/dashboard' || item.roles.includes(role as UserRole);
      }

      if (item.path === '/dashboard') {
        return true;
      }

      const moduleId = PATH_TO_MODULE_ID[item.path];
      return moduleId ? allowedModules.includes(moduleId) : true;
    };

    return role === 'Receptionist'
      ? receptionistSidebarItems.filter(shouldDisplayItem)
      : sidebarItems.filter(shouldDisplayItem);
  };

  const filteredItems = getFilteredItems();

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
        <div className={`h-24 flex items-center border-b border-slate-200/60 dark:border-slate-800/80 transition-all duration-300 ${
          isSidebarCollapsed ? 'justify-center px-4' : 'justify-between px-6'
        }`}>
          <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden group">
            {isSidebarCollapsed ? (
              <div className="h-14 w-14 shrink-0 overflow-hidden flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300">
                <img src={logoUrl} alt="SubhraEdu" className="h-12 w-auto max-w-none object-left object-contain" />
              </div>
            ) : (
              <img src={logoUrl} alt="SubhraEdu Logo" className="h-20 w-auto object-contain hover:scale-[1.03] active:scale-95 transition-all duration-300" />
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
        <div className="h-24 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <img src="/subhraedu_logo.png" alt="SubhraEdu Logo" className="h-20 w-auto object-contain" />
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
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Master Role Dashboard Switcher */}
            <div className="relative flex items-center gap-2 px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-sm transition-all">
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <Layers className="h-4 w-4 shrink-0" />
                <span className="hidden xl:inline uppercase tracking-widest text-[10px] font-bold text-indigo-600 dark:text-indigo-400">Role View:</span>
              </div>
              <select
                value={role || 'Super Admin'}
                onChange={(e) => switchRole(e.target.value as UserRole)}
                className="bg-transparent text-indigo-900 dark:text-indigo-200 font-extrabold focus:outline-none cursor-pointer text-xs pr-1"
                title="Switch active role dashboard view"
              >
                {ALL_SYSTEM_ROLES.map((r) => (
                  <option key={r} value={r} className="text-slate-900 bg-white dark:bg-slate-900 dark:text-slate-100 font-semibold">
                    {r} Dashboard
                  </option>
                ))}
              </select>
            </div>

            {/* Dark Mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5 text-yellow-500" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="user avatar"
                  className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-800 object-cover shadow-sm"
                />
              ) : (
                <div className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-800 bg-school-blue flex items-center justify-center shadow-sm flex-shrink-0">
                  <span className="text-white font-bold text-sm leading-none select-none">
                    {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                  </span>
                </div>
              )}
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
