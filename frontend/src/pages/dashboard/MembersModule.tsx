import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Camera, UploadCloud, Users, ShieldCheck, ToggleLeft, ToggleRight, Key } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import apiClient from '../../services/apiClient';

// ── Types ──────────────────────────────────────────────────────────────────────
type MemberRole = 'teacher' | 'faculty' | 'principal' | 'hr' | 'accountant' | 'librarian';

interface PortalMember {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: MemberRole;
  department?: string;
  date_of_birth?: string;
  employee_id?: string;
  status: 'active' | 'inactive';
  created_at?: string;
  photo?: string;
}

interface MemberForm {
  name: string;
  email: string;
  phone: string;
  role: MemberRole;
  department: string;
  date_of_birth: string;
  employee_id: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const ROLE_OPTIONS: { value: MemberRole; label: string; color: string }[] = [
  { value: 'teacher',    label: 'Teacher',    color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' },
  { value: 'faculty',    label: 'Faculty',    color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300' },
  { value: 'principal',  label: 'Principal',  color: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300' },
  { value: 'hr',         label: 'HR',         color: 'bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300' },
  { value: 'accountant', label: 'Accountant', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' },
  { value: 'librarian',  label: 'Librarian',  color: 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300' },
];

const DEPARTMENTS = ['Science', 'Mathematics', 'English', 'Social Studies', 'Computer Science', 'Commerce', 'Arts', 'Physical Education', 'Administration'];

function getRoleStyle(role: string) {
  return ROLE_OPTIONS.find(r => r.value === role)?.color ?? 'bg-slate-100 text-slate-700';
}
function getRoleLabel(role: string) {
  return ROLE_OPTIONS.find(r => r.value === role)?.label ?? role;
}
function generateEmpId(): string {
  return `EMP${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
}
function formatDob(dob: string): string {
  return dob.replace(/-/g, '');
}

// ── API ───────────────────────────────────────────────────────────────────────
const membersApi = {
  getAll: async (): Promise<PortalMember[]> => {
    try {
      const res = await apiClient.get('/admin/users');
      return res.data.data ?? res.data;
    } catch {
      return [];
    }
  },
  create: async (payload: Omit<PortalMember, 'id' | 'status' | 'created_at'>) => {
    const res = await apiClient.post('/admin/users', payload);
    return res.data.data ?? res.data;
  },
  toggleStatus: async (id: number, status: 'active' | 'inactive') => {
    const res = await apiClient.patch(`/admin/users/${id}/status`, { status });
    return res.data;
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function MembersModule() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [generatedEmpId, setGeneratedEmpId] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<MemberForm>({
    name: '', email: '', phone: '', role: 'teacher',
    department: 'Science', date_of_birth: '', employee_id: '',
  });

  const handleOpenModal = () => {
    setGeneratedEmpId(generateEmpId());
    setProfileImageFile(null);
    setProfileImagePreview('');
    setForm({ name: '', email: '', phone: '', role: 'teacher', department: 'Science', date_of_birth: '', employee_id: '' });
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
    if (file.size > 3 * 1024 * 1024) { alert('Image must be under 3MB.'); return; }
    setProfileImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setProfileImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['portal-members'],
    queryFn: membersApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: membersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-members'] });
      setIsModalOpen(false);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'active' | 'inactive' }) =>
      membersApi.toggleStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portal-members'] }),
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const empId = form.employee_id || generatedEmpId;
    createMutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      department: ['teacher', 'faculty'].includes(form.role) ? form.department : 'Administration',
      date_of_birth: form.date_of_birth,
      employee_id: empId,
      photo: profileImagePreview || undefined,
    });
  };

  const filtered = members.filter(m => {
    if (searchTerm && !m.name.toLowerCase().includes(searchTerm.toLowerCase()) && !m.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (roleFilter && m.role !== roleFilter) return false;
    if (statusFilter && m.status !== statusFilter) return false;
    return true;
  });

  const totalActive   = members.filter(m => m.status === 'active').length;
  const totalInactive = members.filter(m => m.status === 'inactive').length;

  const needsDepartment = ['teacher', 'faculty'].includes(form.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Manage Members</h1>
          <p className="text-sm text-slate-500 mt-0.5">Add and manage staff portal accounts</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenModal} leftIcon={<Plus className="h-4 w-4" />}>
          Add Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Members', value: members.length, icon: Users, color: 'text-school-blue' },
          { label: 'Active',        value: totalActive,    icon: ShieldCheck, color: 'text-school-green' },
          { label: 'Inactive',      value: totalInactive,  icon: ShieldCheck, color: 'text-slate-400' },
        ].map(s => (
          <Card key={s.label} className="p-4 flex items-center gap-3">
            <s.icon className={`h-8 w-8 ${s.color}`} />
            <div>
              <p className="text-xl font-extrabold text-slate-800 dark:text-white">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
            />
          </div>
          <input
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            list="role-filter-list"
            placeholder="Filter by role..."
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white w-full sm:w-48"
          />
          <datalist id="role-filter-list">
            <option value="" />
            {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </datalist>
          <input
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            list="status-filter-list"
            placeholder="Filter by status..."
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white w-full sm:w-40"
          />
          <datalist id="status-filter-list">
            <option value="" />
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </datalist>
        </div>
      </Card>

      {/* Member List */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-slate-400 text-sm">Loading members...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-500">No members found</p>
            <p className="text-xs text-slate-400 mt-1">Add portal members using the button above</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map(member => (
              <div key={member.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                {/* Avatar */}
                <div className="h-11 w-11 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-base font-extrabold text-slate-500">{member.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 dark:text-white truncate">{member.name}</p>
                  <p className="text-xs text-slate-500 truncate">{member.email}</p>
                  {member.department && member.department !== 'Administration' && (
                    <p className="text-xs text-slate-400">{member.department}</p>
                  )}
                </div>

                {/* Role badge */}
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${getRoleStyle(member.role)}`}>
                  {getRoleLabel(member.role)}
                </span>

                {/* Employee ID */}
                {member.employee_id && (
                  <span className="text-[11px] font-mono text-slate-400 shrink-0 hidden md:inline">{member.employee_id}</span>
                )}

                {/* Password hint */}
                {member.date_of_birth && (
                  <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                    <Key className="h-3 w-3" />
                    <span>{formatDob(member.date_of_birth)}</span>
                  </div>
                )}

                {/* Status toggle */}
                <button
                  onClick={() => toggleMutation.mutate({ id: member.id, status: member.status === 'active' ? 'inactive' : 'active' })}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors shrink-0 ${
                    member.status === 'active'
                      ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400'
                      : 'border-slate-300 text-slate-500 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-700'
                  }`}
                >
                  {member.status === 'active'
                    ? <><ToggleRight className="h-4 w-4" /> Active</>
                    : <><ToggleLeft className="h-4 w-4" /> Inactive</>
                  }
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── Add Member Modal ── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Portal Member">
        <form onSubmit={handleCreate} className="space-y-4">
          {/* Auto Employee ID */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Auto-Generated Employee ID</span>
              <span className="text-base font-extrabold text-school-blue">{generatedEmpId}</span>
            </div>
            <button type="button" onClick={() => setGeneratedEmpId(generateEmpId())} className="text-xs font-bold text-school-blue hover:underline shrink-0">
              Regenerate
            </button>
          </div>

          {/* Profile Photo */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Profile Photo</label>
            <div className="flex items-center gap-4">
              <div
                className="h-20 w-20 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900 cursor-pointer hover:border-school-blue transition-colors shrink-0"
                onClick={() => imageInputRef.current?.click()}
              >
                {profileImagePreview ? (
                  <img src={profileImagePreview} alt="Preview" className="h-full w-full object-cover rounded-2xl" />
                ) : (
                  <div className="text-center">
                    <Camera className="h-6 w-6 text-slate-400 mx-auto" />
                    <span className="text-[10px] text-slate-400 mt-1 block">Upload</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <UploadCloud className="h-4 w-4" />
                  Choose Photo from Device
                </button>
                <p className="text-[10px] text-slate-400 mt-1">JPEG, PNG, WebP · Max 3MB</p>
                {profileImageFile && (
                  <p className="text-[10px] text-green-600 font-semibold mt-1">✓ {profileImageFile.name}</p>
                )}
              </div>
            </div>
            <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Role *</label>
            <select
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value as MemberRole }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold cursor-pointer"
            >
              {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name *</label>
              <input
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Dr. Sunita Rao"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date of Birth *</label>
              <input
                type="date"
                required
                value={form.date_of_birth}
                onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="staff@school.edu.in"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone</label>
              <input
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+91 9XXXXXXXXX"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
              />
            </div>
          </div>

          {needsDepartment && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Department</label>
              <input
                value={form.department}
                onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                list="dept-list"
                placeholder="e.g. Science"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
              />
              <datalist id="dept-list">
                {DEPARTMENTS.map(d => <option key={d} value={d} />)}
              </datalist>
            </div>
          )}

          {/* Password info */}
          {form.date_of_birth && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl">
              <Key className="h-4 w-4 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-800 dark:text-amber-300">Default Login Password</p>
                <p className="text-sm font-extrabold font-mono text-amber-700 dark:text-amber-400">{formatDob(form.date_of_birth)}</p>
                <p className="text-[10px] text-amber-600 dark:text-amber-500">Date of birth in YYYYMMDD format. Member should change on first login.</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Adding...' : 'Add Member'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
