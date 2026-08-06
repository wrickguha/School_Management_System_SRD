import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import apiClient from '../../services/apiClient';
import {
  Briefcase, ClipboardCheck, Users, CheckCircle2, Clock, AlertTriangle,
  Plus, Search, Calendar, TrendingUp, Send, X,
  BarChart3, RefreshCw, Eye, Edit3, Trash2, Sparkles, ShieldCheck, Lock, CheckSquare, Square
} from 'lucide-react';

interface WorkAssignment {
  id: number;
  school_id: number | null;
  created_by: number;
  assigned_to: number | null;
  assigned_role: string;
  title: string;
  description: string | null;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  status: 'pending' | 'in_progress' | 'submitted' | 'completed' | 'rejected';
  completion_notes: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  creator?: { id: number; name: string; email: string; role: string };
  assignee?: { id: number; name: string; email: string; role: string; profile_image_path?: string };
  school?: { id: number; name: string; code: string };
}

interface AnalyticsData {
  total: number;
  pending: number;
  in_progress: number;
  submitted: number;
  completed: number;
  rejected: number;
  urgent: number;
  completion_rate: number;
  role_breakdown: Record<string, number>;
  priority_breakdown: Record<string, number>;
}

const AVAILABLE_ROLES = [
  { id: 'all', label: 'All Roles (Master)', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
  { id: 'teacher', label: 'Teacher / Faculty', color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' },
  { id: 'accountant', label: 'Finance & Accountant', color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' },
  { id: 'hr', label: 'HR & Operations', color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400' },
  { id: 'librarian', label: 'Librarian', color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400' },
  { id: 'principal', label: 'Principal / Vice Principal', color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' },
  { id: 'transport_manager', label: 'Transport Manager', color: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400' },
  { id: 'receptionist', label: 'Receptionist / Admin Desk', color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400' },
  { id: 'hostel_warden', label: 'Hostel Warden', color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400' },
  { id: 'office_staff', label: 'Office & Admin Staff', color: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400' },
];

export const SYSTEM_SIDEBAR_MODULES = [
  { id: 'work_assignments', name: 'Work Allocation', category: 'Administrative' },
  { id: 'admissions', name: 'Admissions Desk', category: 'Administrative' },
  { id: 'students', name: 'Students Directory', category: 'Academic' },
  { id: 'teachers', name: 'Teachers & Faculty', category: 'Academic' },
  { id: 'parents', name: 'Parent Directory', category: 'Administrative' },
  { id: 'attendance', name: 'Attendance & Leave', category: 'Academic' },
  { id: 'exams', name: 'Examinations & Marks', category: 'Academic' },
  { id: 'certificates', name: 'Certificates & TC', category: 'Academic' },
  { id: 'homework', name: 'Homework & Study', category: 'Academic' },
  { id: 'fees', name: 'Fees & Finance', category: 'Financial' },
  { id: 'transport', name: 'Transport & Fleet', category: 'Operations' },
  { id: 'library', name: 'Library Catalog', category: 'Operations' },
  { id: 'hostel', name: 'Hostel Management', category: 'Operations' },
  { id: 'payroll', name: 'HR & Payroll Desk', category: 'Financial' },
  { id: 'communication', name: 'Communication & SMS', category: 'Administrative' },
  { id: 'reports', name: 'Reports & Analytics', category: 'Administrative' },
  { id: 'events', name: 'Event Calendar', category: 'Operations' },
  { id: 'members', name: 'Manage Members', category: 'Administrative' },
  { id: 'settings', name: 'System Settings', category: 'Administrative' },
];

export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  teacher: ['work_assignments', 'students', 'attendance', 'exams', 'homework', 'certificates', 'library', 'communication', 'events', 'reports'],
  accountant: ['work_assignments', 'fees', 'payroll', 'reports', 'communication', 'events'],
  hr: ['work_assignments', 'teachers', 'payroll', 'members', 'reports', 'settings', 'communication', 'events'],
  librarian: ['work_assignments', 'library', 'students', 'reports', 'communication', 'events'],
  principal: ['work_assignments', 'admissions', 'students', 'teachers', 'parents', 'attendance', 'exams', 'certificates', 'homework', 'fees', 'transport', 'library', 'hostel', 'payroll', 'communication', 'reports', 'events', 'settings', 'members'],
  receptionist: ['work_assignments', 'admissions', 'students', 'parents', 'communication', 'events', 'reports'],
  transport_manager: ['work_assignments', 'transport', 'students', 'reports', 'communication', 'events'],
  hostel_warden: ['work_assignments', 'hostel', 'students', 'reports', 'communication', 'events'],
  office_staff: ['work_assignments', 'admissions', 'students', 'certificates', 'communication', 'events', 'reports'],
};

export const WorkAssignmentModule: React.FC = () => {
  const { role } = useAuth();
  const isSuperAdmin = role === 'Super Admin';
  const isSchoolAdmin = role === 'School Admin' || role === 'Principal';

  const [activeTab, setActiveTab] = useState<'assignments' | 'role_matrix' | 'analytics' | 'sidebar_permissions'>('assignments');
  const [assignments, setAssignments] = useState<WorkAssignment[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [schools, setSchools] = useState<{ id: number; name: string }[]>([]);

  // Custom Role Sidebar Access Permissions State
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('subhraedu_role_permissions');
    return saved ? JSON.parse(saved) : DEFAULT_ROLE_PERMISSIONS;
  });

  const handleTogglePermission = (roleId: string, moduleId: string) => {
    setRolePermissions(prev => {
      const current = prev[roleId] || [];
      const updated = current.includes(moduleId)
        ? current.filter(m => m !== moduleId)
        : [...current, moduleId];
      const newPerms = { ...prev, [roleId]: updated };
      localStorage.setItem('subhraedu_role_permissions', JSON.stringify(newPerms));
      window.dispatchEvent(new Event('role-permissions-updated'));
      return newPerms;
    });
  };

  const handleResetPermissionsToDefault = () => {
    if (!confirm('Reset all sidebar access permissions to default?')) return;
    setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
    localStorage.setItem('subhraedu_role_permissions', JSON.stringify(DEFAULT_ROLE_PERMISSIONS));
    window.dispatchEvent(new Event('role-permissions-updated'));
  };

  const handleSavePermissions = () => {
    localStorage.setItem('subhraedu_role_permissions', JSON.stringify(rolePermissions));
    window.dispatchEvent(new Event('role-permissions-updated'));
    alert('Sidebar access permissions successfully saved!');
  };

  // Filters
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<WorkAssignment | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState<boolean>(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);

  // New Work Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_role: 'teacher',
    school_id: '',
    category: 'academic',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    due_date: '',
    remarks: '',
  });

  // Status Update Form State
  const [statusUpdate, setStatusUpdate] = useState({
    status: 'in_progress' as 'pending' | 'in_progress' | 'submitted' | 'completed' | 'rejected',
    completion_notes: '',
    remarks: '',
  });

  useEffect(() => {
    fetchAssignments();
    fetchAnalytics();
    if (isSuperAdmin) {
      fetchSchools();
    }
  }, [selectedRoleFilter, selectedStatusFilter, selectedPriorityFilter, selectedSchoolFilter, searchQuery]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (selectedRoleFilter) params.assigned_role = selectedRoleFilter;
      if (selectedStatusFilter) params.status = selectedStatusFilter;
      if (selectedPriorityFilter) params.priority = selectedPriorityFilter;
      if (selectedSchoolFilter) params.school_id = selectedSchoolFilter;
      if (searchQuery) params.search = searchQuery;

      const res = await apiClient.get('/work-assignments', { params });
      setAssignments(res.data.data || res.data);
    } catch (err) {
      console.error('Failed to load work assignments', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const params: Record<string, string> = {};
      if (selectedSchoolFilter) params.school_id = selectedSchoolFilter;
      const res = await apiClient.get('/work-assignments/analytics', { params });
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to load analytics', err);
    }
  };

  const fetchSchools = async () => {
    try {
      const res = await apiClient.get('/admin/schools');
      setSchools(res.data.data || res.data || []);
    } catch (err) {
      console.error('Failed to load schools', err);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/work-assignments', formData);
      setIsAssignModalOpen(false);
      setFormData({
        title: '',
        description: '',
        assigned_role: 'teacher',
        school_id: '',
        category: 'academic',
        priority: 'medium',
        due_date: '',
        remarks: '',
      });
      fetchAssignments();
      fetchAnalytics();
    } catch (err) {
      console.error('Failed to create assignment', err);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    try {
      await apiClient.patch(`/work-assignments/${selectedTask.id}/status`, statusUpdate);
      setIsStatusModalOpen(false);
      setSelectedTask(null);
      fetchAssignments();
      fetchAnalytics();
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  const handleDeleteAssignment = async (id: number) => {
    if (!confirm('Are you sure you want to delete this work assignment?')) return;
    try {
      await apiClient.delete(`/work-assignments/${id}`);
      fetchAssignments();
      fetchAnalytics();
    } catch (err) {
      console.error('Failed to delete assignment', err);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 flex items-center gap-1"><AlertTriangle className="h-3 w-3 inline" /> Urgent</span>;
      case 'high':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">High</span>;
      case 'medium':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">Medium</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">Low</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Completed</span>;
      case 'submitted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 flex items-center gap-1"><Send className="h-3 w-3" /> Submitted</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60 flex items-center gap-1"><Clock className="h-3 w-3" /> In Progress</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/60">Rejected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">Pending</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">

      {/* Hero Master Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-2xl border border-indigo-800/30">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              {isSuperAdmin ? 'Super Admin Master Workspace' : 'School Admin Work Master'}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Role Work Master & Allocation
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl">
              Centralized work assignment master engine. Delegate duties, track progress by role, set priorities, and ensure accountability across all institution departments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchAssignments()}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-200 border border-white/10"
              title="Refresh Data"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {(isSuperAdmin || isSchoolAdmin) && (
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-200 flex items-center gap-2 shrink-0 active:scale-95"
              >
                <Plus className="h-5 w-5" />
                <span>Assign New Work</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Works</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{analytics?.total ?? 0}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Briefcase className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">In Progress</p>
            <h3 className="text-2xl font-extrabold text-sky-600 dark:text-sky-400 mt-1">{analytics?.in_progress ?? 0}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{analytics?.completed ?? 0}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Urgent Tasks</p>
            <h3 className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{analytics?.urgent ?? 0}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completion Rate</p>
            <h3 className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{analytics?.completion_rate ?? 0}%</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('assignments')}
          className={`pb-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'assignments'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <ClipboardCheck className="h-4.5 w-4.5" />
          <span>Work Master List ({assignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('role_matrix')}
          className={`pb-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'role_matrix'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Users className="h-4.5 w-4.5" />
          <span>Role Work Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'analytics'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <BarChart3 className="h-4.5 w-4.5" />
          <span>Workload Analytics</span>
        </button>

        {(isSuperAdmin || isSchoolAdmin) && (
          <button
            onClick={() => setActiveTab('sidebar_permissions')}
            className={`pb-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'sidebar_permissions'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <ShieldCheck className="h-4.5 w-4.5 text-indigo-500" />
            <span>Sidebar Access & Permissions</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search work title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          
          {/* Role Filter */}
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Target Roles</option>
            {AVAILABLE_ROLES.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="submitted">Submitted</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Super Admin School Filter */}
          {isSuperAdmin && schools.length > 0 && (
            <select
              value={selectedSchoolFilter}
              onChange={(e) => setSelectedSchoolFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Schools (Tenant Scope)</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          )}

          {(selectedRoleFilter || selectedStatusFilter || selectedPriorityFilter || selectedSchoolFilter || searchQuery) && (
            <button
              onClick={() => {
                setSelectedRoleFilter('');
                setSelectedStatusFilter('');
                setSelectedPriorityFilter('');
                setSelectedSchoolFilter('');
                setSearchQuery('');
              }}
              className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-300 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

      </div>

      {/* Tab 1: Work Allocation Master Table / Cards */}
      {activeTab === 'assignments' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3 text-indigo-500" />
              <p className="text-sm font-medium">Loading work assignments...</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="p-16 text-center">
              <Briefcase className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Work Assignments Found</h3>
              <p className="text-xs text-slate-500 mt-1">Assign new duties to roles or adjust filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-4 px-6">Work Details</th>
                    <th className="py-4 px-6">Target Role</th>
                    <th className="py-4 px-6">Priority</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Deadline</th>
                    {isSuperAdmin && <th className="py-4 px-6">School</th>}
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {assignments.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-0.5">
                          {item.title}
                        </div>
                        {item.description && (
                          <div className="text-slate-500 text-xs line-clamp-1 max-w-md">
                            {item.description}
                          </div>
                        )}
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                          <span>Category: <strong className="text-slate-600 dark:text-slate-300 capitalize">{item.category}</strong></span>
                          <span>•</span>
                          <span>Assigned by: {item.creator?.name ?? 'Master Admin'}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                          {item.assigned_role}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        {getPriorityBadge(item.priority)}
                      </td>

                      <td className="py-4 px-6">
                        {getStatusBadge(item.status)}
                      </td>

                      <td className="py-4 px-6">
                        {item.due_date ? (
                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>{new Date(item.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">No Deadline</span>
                        )}
                      </td>

                      {isSuperAdmin && (
                        <td className="py-4 px-6 font-medium text-slate-600 dark:text-slate-400">
                          {item.school?.name ?? 'Global Platform'}
                        </td>
                      )}

                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTask(item);
                            setIsDetailDrawerOpen(true);
                          }}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedTask(item);
                            setStatusUpdate({
                              status: item.status,
                              completion_notes: item.completion_notes || '',
                              remarks: item.remarks || '',
                            });
                            setIsStatusModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                          title="Update Status / Response"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        {(isSuperAdmin || isSchoolAdmin) && (
                          <button
                            onClick={() => handleDeleteAssignment(item.id)}
                            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                            title="Delete Task"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Role Work Matrix */}
      {activeTab === 'role_matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AVAILABLE_ROLES.filter(r => r.id !== 'all').map((roleItem) => {
            const roleTasks = assignments.filter(a => a.assigned_role === roleItem.id || a.assigned_role === 'all');
            const pendingCount = roleTasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
            const completedCount = roleTasks.filter(t => t.status === 'completed').length;

            return (
              <div key={roleItem.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-4 hover:shadow-xl transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${roleItem.color}`}>
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{roleItem.label}</h4>
                      <p className="text-xs text-slate-400">{roleTasks.length} active assignments</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    {roleItem.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Active / Pending</span>
                    <p className="text-lg font-extrabold text-sky-600 dark:text-sky-400">{pendingCount}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Completed</span>
                    <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{completedCount}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Latest Role Duties:</span>
                  {roleTasks.slice(0, 3).map((t) => (
                    <div key={t.id} className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/70 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{t.title}</span>
                      {getStatusBadge(t.status)}
                    </div>
                  ))}
                  {roleTasks.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No duties assigned to this role yet.</p>
                  )}
                </div>

                {(isSuperAdmin || isSchoolAdmin) && (
                  <button
                    onClick={() => {
                      setFormData({ ...formData, assigned_role: roleItem.id });
                      setIsAssignModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Assign Duty to {roleItem.label}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Workload Analytics */}
      {activeTab === 'analytics' && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-500" />
              <span>Role-Wise Task Distribution</span>
            </h3>

            <div className="space-y-4">
              {Object.entries(analytics.role_breakdown).map(([r, count]) => {
                const percentage = analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0;
                return (
                  <div key={r} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span className="uppercase">{r}</span>
                      <span>{count} tasks ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Priority Level Breakdown</span>
            </h3>

            <div className="space-y-4">
              {Object.entries(analytics.priority_breakdown).map(([p, count]) => {
                const percentage = analytics.total > 0 ? Math.round((count / analytics.total) * 100) : 0;
                return (
                  <div key={p} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span className="capitalize">{p} Priority</span>
                      <span>{count} tasks ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          p === 'urgent' ? 'bg-rose-500' : p === 'high' ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Sidebar Access Control & Permissions */}
      {activeTab === 'sidebar_permissions' && (
        <div className="space-y-6">
          {/* Header Policy Notice */}
          <div className="p-6 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl border border-indigo-700/40 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-400/30">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Super Admin Governance Module
                </div>
                <h3 className="text-xl font-extrabold">Role Sidebar Access & Module Control</h3>
                <p className="text-xs text-slate-300 max-w-3xl">
                  Configure which sidebar items and sub-modules are accessible to each role. Changes take immediate effect in navigation sidebars. <strong>Super Admin is the master delegator, retains full access, and cannot be assigned tasks directly.</strong>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetPermissionsToDefault}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
                >
                  Reset Defaults
                </button>
                <button
                  onClick={handleSavePermissions}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                >
                  <CheckSquare className="h-4 w-4" />
                  <span>Save Access Matrix</span>
                </button>
              </div>
            </div>
          </div>

          {/* Policy Notice Box */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
            <Lock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block text-sm">Super Admin Task Exclusion Policy</strong>
              Super Admin manages workspace allocation and sidebar access permissions for staff roles (Teachers, Accountants, HR, Librarians, Receptionists, Wardens, etc.). Super Admin accounts are excluded from task assignment dropdowns.
            </div>
          </div>

          {/* Role Access Matrix */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Sidebar Navigation Access Matrix</h4>
                <p className="text-xs text-slate-400">Toggle ON/OFF sidebar module visibility per role.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const allRoleIds = AVAILABLE_ROLES.filter(r => r.id !== 'all').map(r => r.id);
                    const fullPerms: Record<string, string[]> = {};
                    allRoleIds.forEach(roleId => {
                      fullPerms[roleId] = SYSTEM_SIDEBAR_MODULES.map(m => m.id);
                    });
                    setRolePermissions(fullPerms);
                    localStorage.setItem('subhraedu_role_permissions', JSON.stringify(fullPerms));
                    window.dispatchEvent(new Event('role-permissions-updated'));
                    alert('Full sidebar access granted to all roles.');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                >
                  Grant Full Access To All
                </button>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4 min-w-[200px]">Sidebar Module</th>
                    <th className="py-3 px-4">Category</th>
                    {AVAILABLE_ROLES.filter(r => r.id !== 'all').map(roleItem => (
                      <th key={roleItem.id} className="py-3 px-3 text-center min-w-[110px]">
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-extrabold uppercase ${roleItem.color}`}>
                          {roleItem.id}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {SYSTEM_SIDEBAR_MODULES.map((module) => (
                    <tr key={module.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                        {module.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {module.category}
                        </span>
                      </td>
                      {AVAILABLE_ROLES.filter(r => r.id !== 'all').map(roleItem => {
                        const isGranted = (rolePermissions[roleItem.id] || []).includes(module.id);
                        return (
                          <td key={roleItem.id} className="py-3.5 px-3 text-center">
                            <button
                              onClick={() => handleTogglePermission(roleItem.id, module.id)}
                              className={`p-2 rounded-xl transition-all ${
                                isGranted
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                              }`}
                              title={`${isGranted ? 'Revoke' : 'Grant'} ${module.name} access for ${roleItem.label}`}
                            >
                              {isGranted ? <CheckSquare className="h-4.5 w-4.5 mx-auto" /> : <Square className="h-4.5 w-4.5 mx-auto" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* Assign New Work Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Assign Work / Duty</h3>
                <p className="text-xs text-slate-400">Master allocation form to dispatch tasks to roles.</p>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Work Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Syllabus Review & Lesson Plan Submission"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Target Role *
                  </label>
                  <select
                    value={formData.assigned_role}
                    onChange={(e) => setFormData({ ...formData, assigned_role: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    {AVAILABLE_ROLES.map((r) => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="academic">Academic</option>
                    <option value="finance">Finance</option>
                    <option value="hr">HR & Staff</option>
                    <option value="administrative">Administrative</option>
                    <option value="facilities">Facilities & Transport</option>
                    <option value="compliance">Compliance & Audit</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Priority Level *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Due Date / Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {isSuperAdmin && schools.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Assign To Specific School (Super Admin)
                  </label>
                  <select
                    value={formData.school_id}
                    onChange={(e) => setFormData({ ...formData, school_id: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Schools (Global System Assignment)</option>
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Detailed Instructions & Scope
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide comprehensive details on deliverables, requirements, and guidelines..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Remarks / Internal Admin Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Requires approval from Principal before final submission"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
                >
                  Dispatch Work Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Details Drawer */}
      {isDetailDrawerOpen && selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white dark:bg-slate-900 h-full max-w-md w-full p-8 border-l border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 uppercase">
                {selectedTask.assigned_role}
              </span>
              <button onClick={() => setIsDetailDrawerOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{selectedTask.title}</h3>
              
              <div className="flex items-center gap-3">
                {getPriorityBadge(selectedTask.priority)}
                {getStatusBadge(selectedTask.status)}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Assigned By:</span>
                  <strong className="text-slate-800 dark:text-slate-200">{selectedTask.creator?.name ?? 'Master Admin'}</strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Category:</span>
                  <strong className="text-slate-800 dark:text-slate-200 capitalize">{selectedTask.category}</strong>
                </div>
                {selectedTask.due_date && (
                  <div className="flex justify-between text-slate-500">
                    <span>Deadline:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{new Date(selectedTask.due_date).toLocaleDateString()}</strong>
                  </div>
                )}
              </div>

              {selectedTask.description && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Instructions</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl whitespace-pre-wrap">
                    {selectedTask.description}
                  </p>
                </div>
              )}

              {selectedTask.completion_notes && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Completion Notes / Response</h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/40">
                    {selectedTask.completion_notes}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setIsDetailDrawerOpen(false);
                  setStatusUpdate({
                    status: selectedTask.status,
                    completion_notes: selectedTask.completion_notes || '',
                    remarks: selectedTask.remarks || '',
                  });
                  setIsStatusModalOpen(true);
                }}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg"
              >
                Update Status / Submit Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {isStatusModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Update Work Status</h3>
              <button onClick={() => setIsStatusModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Status *
                </label>
                <select
                  value={statusUpdate.status}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="submitted">Submitted for Review</option>
                  <option value="completed">Completed & Verified</option>
                  <option value="rejected">Rejected / Requires Changes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Completion Notes / Progress Update
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide status updates, deliverables completed, or remarks..."
                  value={statusUpdate.completion_notes}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, completion_notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold text-xs text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg"
                >
                  Save Status Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default WorkAssignmentModule;
