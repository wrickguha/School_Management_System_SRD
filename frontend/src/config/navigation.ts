import { UserRole } from '../types';

export interface NavItem {
  title: string;
  path: string;
  icon: string; // Lucide icon identifier string
  roles: UserRole[] | 'all';
}

export const NAVIGATION_ITEMS: NavItem[] = [
  // Authentication & General
  { title: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard', roles: 'all' },
  
  // Admissions & Students
  { title: 'Admissions Funnel', path: '/admissions', icon: 'UserPlus', roles: ['super_admin', 'school_admin', 'principal', 'hr_reception'] },
  { title: 'Student Directory (SIS)', path: '/students', icon: 'Users', roles: ['super_admin', 'school_admin', 'principal', 'teacher', 'hr_reception'] },
  
  // Faculty & HR
  { title: 'Staff Directory', path: '/staff', icon: 'GraduationCap', roles: ['super_admin', 'school_admin', 'principal', 'hr_reception'] },
  { title: 'Leave Management', path: '/leaves', icon: 'CalendarDays', roles: 'all' }, // Everyone can see/request leaves, admins approve
  
  // Academics
  { title: 'Class & Schedules', path: '/classes', icon: 'FolderKanban', roles: ['super_admin', 'school_admin', 'principal', 'teacher', 'student', 'parent'] },
  { title: 'Attendance Entry', path: '/attendance', icon: 'UserCheck', roles: ['super_admin', 'school_admin', 'principal', 'teacher'] },
  { title: 'Homework Logs', path: '/homework', icon: 'BookOpen', roles: ['super_admin', 'school_admin', 'principal', 'teacher', 'student', 'parent'] },
  { title: 'Exams & Grades', path: '/exams', icon: 'PenTool', roles: ['super_admin', 'school_admin', 'principal', 'teacher', 'student', 'parent'] },

  // Finance
  { title: 'Fees & Invoicing', path: '/fees', icon: 'Wallet', roles: ['super_admin', 'school_admin', 'principal', 'accountant', 'student', 'parent'] },

  // Logistics
  { title: 'Library Inventory', path: '/library', icon: 'Library', roles: ['super_admin', 'school_admin', 'principal', 'librarian', 'teacher', 'student'] },
  { title: 'Transport Routes', path: '/transport', icon: 'Bus', roles: ['super_admin', 'school_admin', 'principal', 'transport_manager', 'student', 'parent'] },

  // Notice Board / Comms
  { title: 'Notice Board', path: '/notices', icon: 'Bell', roles: 'all' },

  // Settings
  { title: 'School Settings', path: '/settings', icon: 'Settings', roles: ['super_admin', 'school_admin', 'principal'] }
];
