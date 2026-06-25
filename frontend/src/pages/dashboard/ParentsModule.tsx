import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Users, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { parentService, studentService } from '../../services/services';

interface Ward {
  id: number;
  name: string;
  grade: string;
  section: string;
}

interface Parent {
  id: number;
  name: string;
  phone: string;
  email: string;
  students: Ward[];
}

export default function ParentsModule() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    student_id: '',
    relation: 'Father'
  });

  // Filters state
  const [gradeFilter, setGradeFilter] = useState('');
  const [feeFilter, setFeeFilter] = useState('');

  // Queries
  const { data: parents, isLoading } = useQuery({
    queryKey: ['parents'],
    queryFn: parentService.getAll
  });

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAll
  });

  const uniqueGrades = React.useMemo(() => {
    return Array.from(new Set(
      (parents || []).flatMap(p => (p.students || []).map(w => w.grade))
    )).filter(Boolean);
  }, [parents]);

  const filteredParents = React.useMemo(() => {
    return (parents || []).filter(parent => {
      // Grade filter: check if any ward belongs to this grade
      if (gradeFilter) {
        const hasWardInGrade = (parent.students || []).some(w => w.grade === gradeFilter);
        if (!hasWardInGrade) return false;
      }
      
      // Fee filter: check if any ward has this fee status
      if (feeFilter) {
        const hasWardWithFeeStatus = (parent.students || []).some(w => {
          const wardFee = w.fee_status || w.feeStatus;
          return wardFee === feeFilter;
        });
        if (!hasWardWithFeeStatus) return false;
      }
      
      return true;
    });
  }, [parents, gradeFilter, feeFilter]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: parentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
      setIsOpen(false);
      setForm({ name: '', email: '', phone: '', student_id: '', relation: 'Father' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: parentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parents'] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name: form.name,
      email: form.email,
      phone: form.phone,
      student_id: form.student_id ? Number(form.student_id) : undefined,
      relation: form.relation
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this parent registration?')) {
      deleteMutation.mutate(id);
    }
  };

  const columns: Column<Parent>[] = [
    { header: 'Parent ID', accessor: (r: Parent) => `PAR${String(r.id).padStart(3, '0')}` },
    { header: 'Parent Name', accessor: 'name', sortable: true, sortKey: 'name' },
    {
      header: 'Wards Allocated',
      accessor: (r: Parent) => (
        <div className="flex flex-wrap gap-1">
          {r.students && r.students.length > 0 ? (
            r.students.map((w) => (
              <span key={w.id} className="px-2 py-0.5 bg-school-blueLight dark:bg-school-blue/10 text-school-blue rounded text-[10px] font-bold">
                {w.name} ({w.grade}-{w.section})
              </span>
            ))
          ) : (
            <span className="text-[10px] text-slate-400 font-semibold">No Wards Linked</span>
          )}
        </div>
      )
    },
    { header: 'Contact No', accessor: 'phone' },
    { header: 'Email Address', accessor: 'email' },
    {
      header: 'Portal Status',
      accessor: () => (
        <span className="px-2 py-0.5 bg-school-greenLight dark:bg-school-green/10 text-school-green rounded-full text-[10px] font-bold uppercase">
          Online
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Parents Registry</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Browse and sync parent profiles associated with registered students.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Add Parent Profile
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Registered Parents', val: parents?.length || 0 },
          { label: 'Active Logins', val: parents?.length || 0 },
          { label: 'Portal Deliveries', val: '100%' }
        ].map((stat, idx) => (
          <Card key={idx} className="p-5 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
                {stat.val}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-school-blue/10 flex items-center justify-center text-school-blue shrink-0">
              <Users className="h-5 w-5" />
            </div>
          </Card>
        ))}
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Filter By:</span>
        
        {/* Ward Grade Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Ward Grade</label>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold focus:outline-none dark:text-white cursor-pointer font-Jakarta"
          >
            <option value="">All Grades</option>
            {uniqueGrades.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Ward Fee Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Ward Fee Status</label>
          <select
            value={feeFilter}
            onChange={(e) => setFeeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold focus:outline-none dark:text-white cursor-pointer font-Jakarta"
          >
            <option value="">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
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
            data={filteredParents}
            searchKey="name"
            searchPlaceholder="Search by parent name..."
            actions={(row) => (
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" className="px-2" onClick={() => handleDelete(row.id)}>
                  <Trash2 className="h-4.5 w-4.5 text-red-500" />
                </Button>
              </div>
            )}
          />
        )}
      </Card>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Parent Profile">
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Robert Miller"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="parent@greenwood.edu"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1-555-0144"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Link Student Ward</label>
              <select
                value={form.student_id}
                onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              >
                <option value="">-- Choose Ward Student --</option>
                {students?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.grade}-{s.section})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Relation</label>
              <select
                value={form.relation}
                onChange={(e) => setForm({ ...form, relation: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={createMutation.isPending}>
              Add Parent
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
