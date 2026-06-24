import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, IndianRupee, Users, Eye, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { payrollService, teacherService } from '../../services/services';

interface Teacher {
  id: number;
  name: string;
  teacherId: string;
  department: string;
}

interface PayrollRecord {
  id: number;
  teacher_id: number;
  teacher?: Teacher;
  month: string;
  base_salary: number;
  deductions: number;
  net_salary: number;
  bank_account: string;
  status: 'Pending' | 'Disbursed' | 'Hold';
  paid_at?: string;
}

export default function PayrollModule() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [form, setForm] = useState({
    teacher_id: '',
    month: 'June 2026',
    base_salary: 50000,
    deductions: 2000,
    bank_account: '',
    status: 'Pending' as 'Pending' | 'Disbursed' | 'Hold'
  });

  // Queries
  const { data: records, isLoading } = useQuery<PayrollRecord[]>({
    queryKey: ['payroll'],
    queryFn: payrollService.getAll
  });

  const { data: teachers } = useQuery<any[]>({
    queryKey: ['teachers'],
    queryFn: teacherService.getAll
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: payrollService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      setIsOpen(false);
      setForm({
        teacher_id: '',
        month: 'June 2026',
        base_salary: 50000,
        deductions: 2000,
        bank_account: '',
        status: 'Pending'
      });
    }
  });

  const disburseMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'Disbursed' | 'Hold' }) =>
      payrollService.disburse(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
    }
  });

  const handleTeacherChange = (teacherIdStr: string) => {
    setForm({ ...form, teacher_id: teacherIdStr });
    // Pre-populate salary if there is metadata (optional fallback)
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.teacher_id) return;
    createMutation.mutate({
      teacher_id: Number(form.teacher_id),
      month: form.month,
      base_salary: Number(form.base_salary),
      deductions: Number(form.deductions),
      bank_account: form.bank_account
    });
  };

  const handleDisburseToggle = (record: PayrollRecord) => {
    const nextStatus = record.status === 'Disbursed' ? 'Hold' : 'Disbursed';
    disburseMutation.mutate({ id: record.id, status: nextStatus });
  };

  const columns: Column<PayrollRecord>[] = [
    {
      header: 'Staff Member',
      accessor: (r: PayrollRecord) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">
            {r.teacher?.name || `Teacher #${r.teacher_id}`}
          </span>
          <span className="text-xs text-slate-500">{r.teacher?.department || 'Faculty'}</span>
        </div>
      )
    },
    { header: 'Month', accessor: 'month', sortable: true, sortKey: 'month' },
    {
      header: 'Salary Sheet',
      accessor: (r: PayrollRecord) => (
        <div className="text-xs space-y-0.5">
          <div>Base: <span className="font-semibold text-slate-700 dark:text-slate-350">₹{Number(r.base_salary).toLocaleString()}</span></div>
          <div>Ded: <span className="text-red-500 font-semibold">-₹{Number(r.deductions).toLocaleString()}</span></div>
        </div>
      )
    },
    {
      header: 'Net Payout',
      accessor: (r: PayrollRecord) => (
        <span className="font-extrabold text-school-green dark:text-emerald-400">
          ₹{Number(r.net_salary).toLocaleString()}
        </span>
      )
    },
    {
      header: 'Bank Account',
      accessor: (r: PayrollRecord) => <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{r.bank_account || 'N/A'}</span>
    },
    {
      header: 'Status',
      accessor: (r: PayrollRecord) => {
        let statusStyle = 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600';
        if (r.status === 'Disbursed') statusStyle = 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600';
        if (r.status === 'Hold') statusStyle = 'bg-rose-50 dark:bg-rose-950/20 text-rose-600';

        return (
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusStyle}`}>
            {r.status}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      accessor: (r: PayrollRecord) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedRecord(r);
              setIsDetailOpen(true);
            }}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={r.status === 'Disbursed' ? 'outline' : 'primary'}
            size="sm"
            onClick={() => handleDisburseToggle(r)}
            isLoading={disburseMutation.isPending && selectedRecord?.id === r.id}
          >
            {r.status === 'Disbursed' ? 'Put Hold' : 'Disburse'}
          </Button>
        </div>
      )
    }
  ];

  // Stats
  const totalBase = records?.reduce((acc, r) => acc + Number(r.base_salary), 0) || 0;
  const totalNet = records?.reduce((acc, r) => acc + Number(r.net_salary), 0) || 0;
  const pendingCount = records?.filter(r => r.status !== 'Disbursed').length || 0;

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">HR & Payroll Ledger</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Manage teacher payroll schedules, deductions, and bank payouts.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Generate Payroll Slip
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Base Payroll', val: `₹${totalBase.toLocaleString()}`, icon: IndianRupee, color: 'text-school-blue' },
          { label: 'Net Disbursed / Period', val: `₹${totalNet.toLocaleString()}`, icon: Users, color: 'text-school-green' },
          { label: 'Pending Disbursals', val: `${pendingCount} Slips`, icon: AlertCircle, color: 'text-rose-500' }
        ].map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <Card key={idx} className="p-5 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
                  {stat.val}
                </span>
              </div>
              <div className={`h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center ${stat.color} shrink-0`}>
                <IconComponent className="h-5 w-5" />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Payroll Table */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={records || []}
            searchKey="month"
            searchPlaceholder="Search by month..."
          />
        )}
      </Card>

      {/* Allocate Payroll Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Generate Staff Payroll Slip">
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Staff Teacher</label>
            <select
              required
              value={form.teacher_id}
              onChange={(e) => handleTeacherChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
            >
              <option value="">-- Choose Staff Member --</option>
              {teachers?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.department} Dept)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payroll Month</label>
              <input
                type="text"
                required
                value={form.month}
                onChange={(e) => setForm({ ...form, month: e.target.value })}
                placeholder="e.g. June 2026"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bank Account Number</label>
              <input
                type="text"
                required
                value={form.bank_account}
                onChange={(e) => setForm({ ...form, bank_account: e.target.value })}
                placeholder="e.g. HDFC0001892348"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white animate-transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Base Salary (₹)</label>
              <input
                type="number"
                required
                min={0}
                value={form.base_salary}
                onChange={(e) => setForm({ ...form, base_salary: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Deductions (₹)</label>
              <input
                type="number"
                required
                min={0}
                value={form.deductions}
                onChange={(e) => setForm({ ...form, deductions: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={createMutation.isPending}>
              Generate Slip
            </Button>
          </div>
        </form>
      </Modal>

      {/* Details View Modal */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Payslip Invoice Details">
        {selectedRecord && (
          <div className="space-y-6 text-left dark:text-slate-100">
            <div className="flex justify-between items-start border-b pb-4 border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-lg">{selectedRecord.teacher?.name || `Staff #${selectedRecord.teacher_id}`}</h3>
                <p className="text-xs text-slate-500">{selectedRecord.teacher?.department || 'Faculty'} • ID: {selectedRecord.id}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                selectedRecord.status === 'Disbursed'
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'
                  : selectedRecord.status === 'Hold'
                  ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600'
                  : 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600'
              }`}>
                {selectedRecord.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Statement Period</span>
                <span className="font-semibold">{selectedRecord.month}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Bank Account Ledger</span>
                <span className="font-mono text-xs font-semibold">{selectedRecord.bank_account || 'N/A'}</span>
              </div>
              {selectedRecord.paid_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Disbursed At</span>
                  <span className="font-semibold">{new Date(selectedRecord.paid_at).toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl space-y-2.5">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Base Salary Earnings</span>
                <span>₹{Number(selectedRecord.base_salary).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Statutory Deductions (TDS/PF)</span>
                <span className="text-rose-500">-₹{Number(selectedRecord.deductions).toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-base text-slate-900 dark:text-white">
                <span>Net Transfer Amount</span>
                <span className="text-school-green">₹{Number(selectedRecord.net_salary).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="ghost" onClick={() => setIsDetailOpen(false)}>
                Close Invoice
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
