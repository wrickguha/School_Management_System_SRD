import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, BookOpen, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { homeworkService } from '../../services/services';

interface Homework {
  id: number;
  title: string;
  subject: string;
  grade: string;
  section: string;
  instructions: string;
  deadline: string;
  status: 'Active' | 'Draft' | 'Closed';
}

export default function HomeworkModule() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    subject: '',
    grade: 'Grade 10',
    section: 'A',
    instructions: '',
    deadline: ''
  });

  // Queries
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['homework'],
    queryFn: homeworkService.getAll
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: homeworkService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homework'] });
      setIsOpen(false);
      setForm({ title: '', subject: '', grade: 'Grade 10', section: 'A', instructions: '', deadline: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: homeworkService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homework'] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this homework assignment?')) {
      deleteMutation.mutate(id);
    }
  };

  const columns: Column<Homework>[] = [
    { header: 'Task ID', accessor: (r: Homework) => `HWK${String(r.id).padStart(3, '0')}` },
    { header: 'Subject', accessor: 'subject', sortable: true, sortKey: 'subject' },
    { header: 'Topic Header', accessor: 'title', sortable: true, sortKey: 'title' },
    { header: 'Target Grade', accessor: (r: Homework) => `${r.grade}-${r.section}` },
    { header: 'Deadline Date', accessor: 'deadline' },
    {
      header: 'Status',
      accessor: (r: Homework) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
          r.status === 'Active' ? 'bg-school-blueLight text-school-blue' : 'bg-slate-100 text-slate-500'
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
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Homework & Tasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Publish and monitor assignments, deadlines, and submissions.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Assign Homework
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Assigned Today', val: tasks?.length || 0 },
          { label: 'Avg Submission Rate', val: '92.4%' },
          { label: 'Grading Pending', val: '0' }
        ].map((stat, idx) => (
          <Card key={idx} className="p-5 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
                {stat.val}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-school-blue/10 flex items-center justify-center text-school-blue shrink-0">
              <BookOpen className="h-5 w-5" />
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
            data={tasks || []}
            searchKey="subject"
            searchPlaceholder="Search by subject..."
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

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Assign Homework Task">
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subject Name</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g. Mathematics"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Topic Header</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Algebra Equations Practice"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grade</label>
              <select
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              >
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Section</label>
              <select
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Submission Deadline</label>
              <input
                type="date"
                required
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Task Instructions</label>
            <textarea
              required
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              rows={3}
              placeholder="Provide detailed instructions for the task..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={createMutation.isPending}>
              Publish Homework
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
