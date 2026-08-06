import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../store/AuthContext';
import {
  ShieldCheck, Plus, Copy, Trash2, Search, CheckSquare, Square,
  Users, RefreshCw, Key, Sliders, ChevronDown, ChevronRight,
  History, UserCheck, Check, X, ShieldAlert
} from 'lucide-react';

interface PermissionItem {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface GroupedPermissions {
  [moduleName: string]: PermissionItem[];
}

interface RoleItem {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  is_system: boolean;
  users_count: number;
  permissions_count: number;
  permissions: string[];
}

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: string;
  direct_permissions: string[];
  all_permissions: string[];
}

interface AuditLogItem {
  id: number;
  user_name: string;
  action: string;
  target_type: string;
  target_name: string;
  old_values: any;
  new_values: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export const RbacManagementModule: React.FC = () => {
  const { role, user } = useAuth();
  const isSuperAdmin = role === 'Super Admin' || user?.role === 'Super Admin';

  const [activeTab, setActiveTab] = useState<'roles' | 'user_overrides' | 'audit_logs'>('roles');
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissionsGrouped, setPermissionsGrouped] = useState<GroupedPermissions>({});
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);
  const [rolePermissionsState, setRolePermissionsState] = useState<string[]>([]);

  const safeRoles = Array.isArray(roles) ? roles : [];
  const safePermissionsGrouped = permissionsGrouped && typeof permissionsGrouped === 'object' && !Array.isArray(permissionsGrouped)
    ? permissionsGrouped
    : {};
  const safeRolePermissionsState = Array.isArray(rolePermissionsState) ? rolePermissionsState : [];
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Search & Filter
  const [roleSearch, setRoleSearch] = useState<string>('');
  const [permSearch, setPermSearch] = useState<string>('');
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});

  // Modals
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState<boolean>(false);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState<boolean>(false);
  const [cloneSourceRole, setCloneSourceRole] = useState<RoleItem | null>(null);
  const [newRoleData, setNewRoleData] = useState({ name: '', description: '', status: 'active' });
  const [cloneRoleName, setCloneRoleName] = useState('');

  // User Overrides
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [userSearch, setUserSearch] = useState<string>('');
  const [selectedUserForOverride, setSelectedUserForOverride] = useState<UserItem | null>(null);
  const [userDirectPermissions, setUserDirectPermissions] = useState<string[]>([]);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  useEffect(() => {
    if (activeTab === 'user_overrides') {
      fetchUsers();
    } else if (activeTab === 'audit_logs') {
      fetchAuditLogs();
    }
  }, [activeTab, userSearch]);

  const normalizeResponseData = <T extends any>(res: any): T => {
    if (!res) return [] as unknown as T;
    if (Array.isArray(res)) return res as unknown as T;
    if (res.data !== undefined) {
      if (Array.isArray(res.data)) return res.data as unknown as T;
      if (res.data.data !== undefined) {
        if (Array.isArray(res.data.data)) return res.data.data as unknown as T;
        if (Array.isArray(res.data.data.data)) return res.data.data.data as unknown as T;
        return res.data.data as unknown as T;
      }
      return res.data as unknown as T;
    }
    return res as unknown as T;
  };

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/rbac/roles');
      const data = normalizeResponseData<RoleItem[]>(res) || [];
      setRoles(data);
      if (data.length > 0 && !selectedRole) {
        setSelectedRole(data[0]);
        setRolePermissionsState(data[0].permissions || []);
      }
    } catch (err) {
      console.error('Failed to fetch roles', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await apiClient.get('/admin/rbac/permissions');
      const data = normalizeResponseData<Record<string, PermissionItem[]>>(res) || {};
      setPermissionsGrouped(data);
    } catch (err) {
      console.error('Failed to fetch permissions', err);
      setPermissionsGrouped({});
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get('/admin/rbac/users', { params: { search: userSearch } });
      const data = normalizeResponseData<UserItem[]>(res) || [];
      setUsersList(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
      setUsersList([]);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await apiClient.get('/admin/rbac/audit-logs');
      const data = normalizeResponseData<AuditLogItem[]>(res) || [];
      setAuditLogs(data);
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
      setAuditLogs([]);
    }
  };

  const handleSelectRole = (r: RoleItem) => {
    setSelectedRole(r);
    setRolePermissionsState(r.permissions || []);
  };

  const handleTogglePermission = (slug: string) => {
    if (!selectedRole) return;
    setRolePermissionsState(prev => 
      prev.includes(slug) ? prev.filter(p => p !== slug) : [...prev, slug]
    );
  };

  const handleToggleModulePermissions = (_moduleName: string, modulePerms: PermissionItem[]) => {
    if (!selectedRole) return;
    const slugs = modulePerms.map(p => p.slug);
    const allSelected = slugs.every(s => rolePermissionsState.includes(s));

    if (allSelected) {
      // Unselect all in module
      setRolePermissionsState(prev => prev.filter(s => !slugs.includes(s)));
    } else {
      // Select all in module
      setRolePermissionsState(prev => Array.from(new Set([...prev, ...slugs])));
    }
  };

  const handleSelectAllGlobal = () => {
    const allSlugs = Object.values(permissionsGrouped).flatMap(group => group.map(p => p.slug));
    setRolePermissionsState(allSlugs);
  };

  const handleDeselectAllGlobal = () => {
    setRolePermissionsState([]);
  };

  const handleCopyPermissionsFromRole = (sourceRoleId: number) => {
    const source = roles.find(r => r.id === sourceRoleId);
    if (source) {
      setRolePermissionsState(source.permissions || []);
    }
  };

  const handleSaveRolePermissions = async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      await apiClient.post(`/admin/rbac/roles/${selectedRole.id}/permissions`, {
        permissions: safeRolePermissionsState,
      });

      // Update local roles list
      setRoles(roles.map(r => r.id === selectedRole.id ? { ...r, permissions: rolePermissionsState, permissions_count: rolePermissionsState.length } : r));
      setSelectedRole({ ...selectedRole, permissions: rolePermissionsState, permissions_count: rolePermissionsState.length });
      
      // Dispatch global permissions refresh event
      window.dispatchEvent(new Event('role-permissions-updated'));
      alert(`Permissions for role '${selectedRole.name}' successfully updated!`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/admin/rbac/roles', newRoleData);
      setIsCreateRoleModalOpen(false);
      setNewRoleData({ name: '', description: '', status: 'active' });
      fetchRoles();
      alert(res.data.message || 'Role created successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create role');
    }
  };

  const handleCloneRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloneSourceRole) return;
    try {
      const res = await apiClient.post(`/admin/rbac/roles/${cloneSourceRole.id}/clone`, {
        name: cloneRoleName,
      });
      setIsCloneModalOpen(false);
      setCloneRoleName('');
      fetchRoles();
      alert(res.data.message || 'Role cloned successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to clone role');
    }
  };

  const handleDeleteRole = async (roleId: number, roleName: string) => {
    if (!confirm(`Are you sure you want to delete role '${roleName}'?`)) return;
    try {
      await apiClient.delete(`/admin/rbac/roles/${roleId}`);
      fetchRoles();
      alert(`Role '${roleName}' deleted.`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete role');
    }
  };

  const handleSaveUserPermissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForOverride) return;
    try {
      await apiClient.post(`/admin/rbac/users/${selectedUserForOverride.id}/permissions`, {
        direct_permissions: userDirectPermissions,
      });
      setSelectedUserForOverride(null);
      fetchUsers();
      alert('User individual permissions updated!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user permissions');
    }
  };

  const toggleModuleCollapse = (moduleName: string) => {
    setCollapsedModules(prev => ({ ...prev, [moduleName]: !prev[moduleName] }));
  };

  const filteredRoles = useMemo(() => {
    return roles.filter(r => 
      r.name.toLowerCase().includes(roleSearch.toLowerCase()) || 
      r.description.toLowerCase().includes(roleSearch.toLowerCase())
    );
  }, [roles, roleSearch]);

  const isRolePermissionsModified = useMemo(() => {
    if (!selectedRole) return false;
    const orig = selectedRole.permissions || [];
    if (orig.length !== rolePermissionsState.length) return true;
    return orig.some(p => !rolePermissionsState.includes(p));
  }, [selectedRole, rolePermissionsState]);

  return (
    <div className="space-y-8 animate-fadeIn pb-24 text-slate-900 dark:text-slate-100">

      {/* Hero Governance Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-2xl border border-indigo-800/30">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              Super Admin RBAC Master Console
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Dynamic Role & Permission Engine
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl">
              Enterprise Role-Based Access Control. Create unlimited custom roles, assign granular module permissions, configure button/route visibility, set individual user overrides, and review real-time security audit logs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { fetchRoles(); fetchPermissions(); }}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10"
              title="Refresh Security Cache"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {isSuperAdmin && (
              <button
                onClick={() => setIsCreateRoleModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center gap-2 shrink-0 active:scale-95"
              >
                <Plus className="h-5 w-5" />
                <span>Create New Role</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Tab Controls */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('roles')}
          className={`pb-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'roles'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Sliders className="h-4.5 w-4.5" />
          <span>Role Permissions Matrix ({roles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('user_overrides')}
          className={`pb-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'user_overrides'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <UserCheck className="h-4.5 w-4.5" />
          <span>Individual User Overrides</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`pb-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'audit_logs'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <History className="h-4.5 w-4.5" />
          <span>RBAC Audit Logs</span>
        </button>
      </div>

      {/* Tab 1: Roles & Permission Matrix */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Panel: Role List & Selection */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4">
              
              {/* Search Roles */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Roles Cards */}
              <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredRoles.map((r) => {
                  const isSelected = selectedRole?.id === r.id;
                  const isSuperAdminRole = r.name === 'Super Admin';
                  return (
                    <div
                      key={r.id}
                      onClick={() => handleSelectRole(r)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                        isSelected
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">{r.name}</span>
                          {isSuperAdminRole && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-600 border border-amber-300">
                              Master Owner
                            </span>
                          )}
                          {r.is_system && !isSuperAdminRole && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
                              System
                            </span>
                          )}
                        </div>

                        <span className={`h-2.5 w-2.5 rounded-full ${r.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} title={r.status} />
                      </div>

                      {r.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{r.description}</p>
                      )}

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800/80 text-slate-400 font-semibold">
                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-indigo-500" /> {r.users_count} Users</span>
                        <span className="flex items-center gap-1"><Key className="h-3.5 w-3.5 text-emerald-500" /> {r.permissions_count} Perms</span>

                        {/* Quick Clone / Delete Action */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCloneSourceRole(r);
                              setCloneRoleName(`${r.name} Copy`);
                              setIsCloneModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Clone Role"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>

                          {!r.is_system && !isSuperAdminRole && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRole(r.id, r.name);
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Delete Custom Role"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel: Permission Assignment Grid Matrix */}
          <div className="lg:col-span-8 space-y-6">
            {selectedRole ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
                
                {/* Selected Role Header & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        Permissions for "{selectedRole.name}"
                      </h3>
                      {selectedRole.name === 'Super Admin' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300">
                          Unrestricted All
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {rolePermissionsState.length} active permissions enabled for this role.
                    </p>
                  </div>

                  {/* Matrix Quick Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleSelectAllGlobal}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={handleDeselectAllGlobal}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-200 transition-colors"
                    >
                      Deselect All
                    </button>

                    {/* Copy From Another Role Dropdown */}
                    <select
                      onChange={(e) => e.target.value && handleCopyPermissionsFromRole(Number(e.target.value))}
                      defaultValue=""
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      <option value="" disabled>Copy permissions from...</option>
                      {safeRoles.filter(r => r.id !== selectedRole?.id).map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filter Permissions Search */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search permissions by name or module..."
                    value={permSearch}
                    onChange={(e) => setPermSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Module-Wise Permissions Accordion Cards */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
                  {Object.entries(safePermissionsGrouped).map(([moduleName, modulePerms]) => {
                    const permsArray = Array.isArray(modulePerms) ? modulePerms : [];
                    const filteredPerms = permsArray.filter(p => 
                      p.name?.toLowerCase().includes(permSearch.toLowerCase()) || 
                      p.description?.toLowerCase().includes(permSearch.toLowerCase())
                    );

                    if (filteredPerms.length === 0) return null;

                    const isCollapsed = collapsedModules[moduleName];
                    const selectedCount = filteredPerms.filter(p => safeRolePermissionsState.includes(p.slug)).length;
                    const isAllModuleSelected = selectedCount === filteredPerms.length;

                    return (
                      <div key={moduleName} className="bg-slate-50/60 dark:bg-slate-950/60 rounded-2xl border border-slate-200/70 dark:border-slate-800 overflow-hidden shadow-sm">
                        
                        {/* Module Header */}
                        <div className="px-5 py-3.5 flex items-center justify-between bg-slate-100/70 dark:bg-slate-900/80 border-b border-slate-200/60 dark:border-slate-800">
                          <button
                            onClick={() => toggleModuleCollapse(moduleName)}
                            className="flex items-center gap-2 font-extrabold text-sm text-slate-800 dark:text-slate-200 hover:text-indigo-600 transition-colors"
                          >
                            {isCollapsed ? <ChevronRight className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                            <span>{moduleName}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-600 font-bold">
                              {selectedCount} / {filteredPerms.length}
                            </span>
                          </button>

                          <button
                            onClick={() => handleToggleModulePermissions(moduleName, filteredPerms)}
                            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                          >
                            {isAllModuleSelected ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
                            <span>{isAllModuleSelected ? 'Deselect Module' : 'Select Module'}</span>
                          </button>
                        </div>

                        {/* Module Permissions Checkboxes */}
                        {!isCollapsed && (
                          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {filteredPerms.map((perm) => {
                              const isChecked = safeRolePermissionsState.includes(perm.slug);
                              return (
                                <label
                                  key={perm.id}
                                  onClick={() => handleTogglePermission(perm.slug)}
                                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer select-none transition-all ${
                                    isChecked
                                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-950 dark:text-indigo-100 font-semibold shadow-sm'
                                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                                  }`}
                                >
                                  <div className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400">
                                    {isChecked ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4 text-slate-400" />}
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold leading-tight">{perm.description}</div>
                                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{perm.slug}</div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            ) : (
              <div className="p-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center text-slate-400">
                <Sliders className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>Select a role from the left panel to configure permissions.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Tab 2: Individual User Permission Overrides */}
      {activeTab === 'user_overrides' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-lg">Individual User Permission Overrides</h3>
              <p className="text-xs text-slate-400">Grant or revoke individual permissions for a specific user to override their assigned role defaults.</p>
            </div>

            <div className="relative w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search user by name, email, or role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase font-bold text-[10px] border-b">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Direct User Overrides</th>
                  <th className="py-3 px-4">Total Active Permissions</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                    <td className="py-3.5 px-4 font-bold">
                      <div>{u.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-600 border border-indigo-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.direct_permissions.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {u.direct_permissions.map(p => (
                            <span key={p} className="px-2 py-0.5 rounded-md text-[9px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                              +{p}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Role Defaults Only</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">
                      {u.all_permissions.length} permissions
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedUserForOverride(u);
                          setUserDirectPermissions(u.direct_permissions || []);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                      >
                        Override Permissions
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: RBAC Audit Logs */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-indigo-500" />
                <span>RBAC Security Audit Trail Log</span>
              </h3>
              <p className="text-xs text-slate-400">Complete immutable record of all role changes, permission syncs, user overrides, and security actions.</p>
            </div>
            <button onClick={fetchAuditLogs} className="p-2 text-slate-400 hover:text-slate-600">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                      {log.action}
                    </span>
                    <strong className="text-slate-900 dark:text-white">{log.target_type}: {log.target_name}</strong>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.created_at).toLocaleString()} • IP: {log.ip_address || '127.0.0.1'}
                  </div>
                </div>

                <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                  Performed by: <strong className="text-slate-800 dark:text-slate-200">{log.user_name || 'System Admin'}</strong>
                </div>

                {log.new_values && (
                  <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl font-mono text-[10px] text-slate-500 overflow-x-auto">
                    {JSON.stringify(log.new_values)}
                  </div>
                )}
              </div>
            ))}

            {auditLogs.length === 0 && (
              <div className="p-12 text-center text-slate-400">No RBAC audit records found.</div>
            )}
          </div>
        </div>
      )}

      {/* Floating Sticky Save Bar */}
      {selectedRole && activeTab === 'roles' && isRolePermissionsModified && (
        <div className="fixed bottom-6 right-6 left-6 md:left-80 z-50 animate-bounce-short">
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-indigo-500/40 flex items-center justify-between max-w-4xl mx-auto backdrop-blur-lg bg-slate-900/90">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-6 w-6 text-amber-400 shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm">Unsaved Permission Changes for "{selectedRole.name}"</h4>
                <p className="text-xs text-slate-300">You modified permissions ({rolePermissionsState.length} active permissions).</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setRolePermissionsState(selectedRole.permissions || [])}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl"
              >
                Discard
              </button>
              <button
                onClick={handleSaveRolePermissions}
                disabled={saving}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Role Permissions'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Role */}
      {isCreateRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-base">Create Custom Role</h3>
              <button onClick={() => setIsCreateRoleModalOpen(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Role Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Admission Executive"
                  value={newRoleData.name}
                  onChange={(e) => setNewRoleData({ ...newRoleData, name: e.target.value })}
                  className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-950 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Description</label>
                <textarea
                  placeholder="Briefly describe duties and responsibilities..."
                  value={newRoleData.description}
                  onChange={(e) => setNewRoleData({ ...newRoleData, description: e.target.value })}
                  className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-950"
                  rows={3}
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">Status</label>
                <select
                  value={newRoleData.status}
                  onChange={(e) => setNewRoleData({ ...newRoleData, status: e.target.value as any })}
                  className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-950 font-bold"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20">
                Save & Initialize Role
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Clone Role */}
      {isCloneModalOpen && cloneSourceRole && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-base">Clone Role "{cloneSourceRole.name}"</h3>
              <button onClick={() => setIsCloneModalOpen(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleCloneRole} className="space-y-4 text-xs">
              <p className="text-slate-500">
                This will create a new role containing all {cloneSourceRole.permissions_count} permissions copied from <strong>{cloneSourceRole.name}</strong>.
              </p>

              <div>
                <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">New Cloned Role Name *</label>
                <input
                  required
                  type="text"
                  value={cloneRoleName}
                  onChange={(e) => setCloneRoleName(e.target.value)}
                  className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-950 font-bold"
                />
              </div>

              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl">
                Confirm & Clone Role
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: User Permission Overrides Drawer */}
      {selectedUserForOverride && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-extrabold text-lg">Individual Permission Overrides</h3>
                <p className="text-xs text-slate-400">User: <strong>{selectedUserForOverride.name}</strong> ({selectedUserForOverride.role})</p>
              </div>
              <button onClick={() => setSelectedUserForOverride(null)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleSaveUserPermissions} className="space-y-6">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 text-xs text-amber-800 dark:text-amber-300">
                <strong>Override Rule:</strong> Direct permissions assigned here will grant access to this user regardless of their role permissions.
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
                {Object.entries(permissionsGrouped).map(([mName, mPerms]) => (
                  <div key={mName} className="space-y-2">
                    <h5 className="font-extrabold text-xs text-slate-700 dark:text-slate-300">{mName}</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {mPerms.map(p => {
                        const isGranted = userDirectPermissions.includes(p.slug);
                        return (
                          <label
                            key={p.id}
                            onClick={() => {
                              setUserDirectPermissions(prev =>
                                prev.includes(p.slug) ? prev.filter(s => s !== p.slug) : [...prev, p.slug]
                              );
                            }}
                            className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer text-xs ${
                              isGranted ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {isGranted ? <CheckSquare className="h-4 w-4 text-emerald-600" /> : <Square className="h-4 w-4 text-slate-400" />}
                            <span className="truncate">{p.description}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setSelectedUserForOverride(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/20">
                  Save User Permission Overrides
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RbacManagementModule;
