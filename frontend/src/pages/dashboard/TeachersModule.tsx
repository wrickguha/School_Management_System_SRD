import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, GraduationCap, Users } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { teacherService } from '../../services/services';

interface StaffMember {
  id: number;
  employee_id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary_grade: string;
  attendance_rate: number;
  status: 'Active' | 'Inactive';
  role: 'school_admin' | 'principal' | 'teacher' | 'faculty' | 'accountant' | 'hr' | 'librarian';
}

export default function TeachersModule() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'teacher' as 'school_admin' | 'principal' | 'teacher' | 'faculty' | 'accountant' | 'hr' | 'librarian',
    department: 'Science',
    designation: 'Senior Teacher',
    salary_grade: 'Grade A',
    employee_id: ''
  });

  // Queries
  const { data: staff, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: teacherService.getAll
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: teacherService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      setIsOpen(false);
      setForm({
        name: '', email: '', phone: '', role: 'teacher', department: 'Science',
        designation: 'Senior Teacher', salary_grade: 'Grade A', employee_id: ''
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedEmpId = form.employee_id || `EMP2026${Math.floor(100 + Math.random() * 900)}`;
    createMutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      department: ['teacher', 'faculty'].includes(form.role) ? form.department : 'Administration',
      designation: ['teacher', 'faculty'].includes(form.role) ? form.designation : form.role.toUpperCase().replace('_', ' '),
      salary_grade: form.salary_grade,
      employee_id: generatedEmpId,
      attendance_rate: 98.0
    });
  };

  const roleLabels: Record<string, string> = {
    school_admin: 'School Admin',
    principal: 'Principal',
    teacher: 'Teacher',
    faculty: 'Faculty',
    accountant: 'Accountant',
    hr: 'HR',
    librarian: 'Librarian'
  };

  const columns: Column<StaffMember>[] = [
    { header: 'Employee ID', accessor: 'employee_id', sortable: true, sortKey: 'employee_id' },
    { header: 'Name', accessor: 'name', sortable: true, sortKey: 'name' },
    {
      header: 'Role',
      accessor: (r: StaffMember) => (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">
          {roleLabels[r.role] || r.role || 'Teacher'}
        </span>
      )
    },
    { header: 'Department', accessor: 'department', sortable: true, sortKey: 'department' },
    { header: 'Designation', accessor: 'designation' },
    { header: 'Salary Grade', accessor: 'salary_grade' },
    { header: 'Attendance', accessor: (r: StaffMember) => <span className="text-school-green font-bold">{r.attendance_rate}%</span> },
    {
      header: 'Status',
      accessor: (r: StaffMember) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          r.status === 'Active' ? 'bg-school-greenLight text-school-green' : 'bg-red-50 text-red-650'
        }`}>
          {r.status || 'Active'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Staff & Roles Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Browse and manage school teachers, principal, librarians, accountants, HR, and other administrative staff roles.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Register Staff Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Staff & Teachers', val: staff?.length || 0 },
          { label: 'On Leave', val: '0' },
          { label: 'Teachers Count', val: staff?.filter(t => ['teacher', 'faculty'].includes(t.role)).length || 0 }
        ].map((stat, idx) => (
          <Card key={idx} className="p-5 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
                {stat.val}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-school-blue/10 flex items-center justify-center text-school-blue shrink-0">
              <GraduationCap className="h-5 w-5" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={staff || []}
            searchKey="name"
            searchPlaceholder="Search by staff name..."
          />
        )}
      </Card>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Register Staff Member & Role">
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as any })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold cursor-pointer"
            >
              <option value="teacher">Teacher</option>
              <option value="faculty">Faculty</option>
              <option value="principal">Principal</option>
              <option value="librarian">Librarian</option>
              <option value="accountant">Accountant</option>
              <option value="hr">HR</option>
              <option value="school_admin">School Admin</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Dr. Sunita Rao"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Work Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="s.rao@greenwood.edu"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 99887 76601"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
              />
            </div>
          </div>

          {['teacher', 'faculty'].includes(form.role) && (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Department</label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold cursor-pointer"
                >
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Designation</label>
                <input
                  type="text"
                  required
                  value={form.designation}
                  onChange={(e) => setForm({ ...form, designation: e.target.value })}
                  placeholder="Senior Teacher"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Salary Band</label>
                <select
                  value={form.salary_grade}
                  onChange={(e) => setForm({ ...form, salary_grade: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold cursor-pointer"
                >
                  <option value="Grade A">Grade A</option>
                  <option value="Grade B">Grade B</option>
                  <option value="Grade C">Grade C</option>
                </select>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Employee ID (Optional)</label>
            <input
              type="text"
              value={form.employee_id}
              onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
              placeholder="Leave empty for auto-generation"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={createMutation.isPending}>
              Register Staff Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
