import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { financeService, studentService } from '../../services/services';
import { CreditCard, DollarSign, Calendar, AlertCircle, Plus, CheckCircle } from 'lucide-react';

export default function FeeModule() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'transactions' | 'defaulters'>('transactions');
  const [isCollectOpen, setIsCollectOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    studentName: 'Aarav Sharma',
    grade: 'Grade 10',
    amount: 15000,
    paymentMode: 'Card'
  });

  // Queries
  const { data: transactions, isLoading: loadingTx } = useQuery({ queryKey: ['transactions'], queryFn: financeService.getTransactions });
  const { data: students, isLoading: loadingStudents } = useQuery({ queryKey: ['students'], queryFn: studentService.getAll });

  // Mutations
  const payFeeMutation = useMutation({
    mutationFn: financeService.payFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsCollectOpen(false);
        setPaymentForm({ studentName: 'Aarav Sharma', grade: 'Grade 10', amount: 15000, paymentMode: 'Card' });
      }, 1500);
    }
  });

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    payFeeMutation.mutate(paymentForm);
  };

  const handleSendReminder = (studentName: string) => {
    alert(`[Demo Mode] Fee payment reminder SMS sent to parent of ${studentName}`);
  };

  const totalCollected = transactions?.reduce((acc, t) => acc + t.amount, 0) || 0;
  const defaulters = students?.filter(s => s.pendingFees > 0) || [];
  const totalPending = students?.reduce((acc, s) => acc + s.pendingFees, 0) || 0;

  return (
    <div className="space-y-8 text-left">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Finance & Fees</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Track student billing transactions and outstanding fee balances.
          </p>
        </div>
        
        {/* Toggle tabs */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'transactions' ? 'bg-white dark:bg-slate-900 shadow text-school-blue' : 'text-slate-550'
            }`}
          >
            Transaction Logs
          </button>
          <button
            onClick={() => setActiveTab('defaulters')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'defaulters' ? 'bg-white dark:bg-slate-900 shadow text-school-blue' : 'text-slate-550'
            }`}
          >
            Defaulter ledger
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-450 uppercase">Total Collected</span>
            <span className="block text-2xl font-extrabold text-school-green mt-1">${(totalCollected + 117000).toLocaleString()}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-school-greenLight dark:bg-school-green/10 text-school-green flex items-center justify-center shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
        </Card>
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-450 uppercase">Outstanding Dues</span>
            <span className="block text-2xl font-extrabold text-school-maroon mt-1">${totalPending.toLocaleString()}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-school-maroonLight dark:bg-school-maroon/10 text-school-maroon flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
        </Card>
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-450 uppercase">Active Defaulters</span>
            <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{defaulters.length} Pupils</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
            <CreditCard className="h-5 w-5" />
          </div>
        </Card>
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-450 uppercase">Billing Status</span>
            <span className="block text-xs font-extrabold text-school-green mt-2 flex items-center gap-1"><CheckCircle className="h-4 w-4" /> Sync auto-reminders</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Tab 1: Transaction Logs */}
      {activeTab === 'transactions' && (
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
          <CardHeader className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-md">Transaction Logs</CardTitle>
            <Button variant="primary" size="sm" onClick={() => setIsCollectOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
              Collect Payment
            </Button>
          </CardHeader>

          {loadingTx ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-8 bg-slate-200 rounded" />
            </div>
          ) : (
            <DataTable
              columns={[
                { header: 'Receipt No', accessor: 'receiptNo' },
                { header: 'Student Name', accessor: 'studentName', sortable: true, sortKey: 'studentName' },
                { header: 'Grade', accessor: 'grade' },
                { header: 'Amount', accessor: (r) => <span className="font-extrabold text-slate-850 dark:text-slate-105">${r.amount.toLocaleString()}</span> },
                { header: 'Payment Mode', accessor: 'paymentMode' },
                { header: 'Date', accessor: 'date' },
                {
                  header: 'Status',
                  accessor: (r) => (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-school-greenLight text-school-green">
                      {r.status}
                    </span>
                  )
                }
              ]}
              data={transactions || []}
              searchKey="studentName"
              searchPlaceholder="Search by student name..."
            />
          )}
        </Card>
      )}

      {/* Tab 2: Defaulters Directory */}
      {activeTab === 'defaulters' && (
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
          <CardHeader className="mb-6">
            <CardTitle className="text-md">Defaulter ledger (Outstanding Balance)</CardTitle>
          </CardHeader>

          {loadingStudents ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-8 bg-slate-200 rounded" />
            </div>
          ) : (
            <DataTable
              columns={[
                { header: 'Admission No', accessor: 'admissionNo' },
                { header: 'Student Name', accessor: 'name', sortable: true, sortKey: 'name' },
                { header: 'Grade', accessor: (r) => `${r.grade}-${r.section}` },
                { header: 'Parent Phone', accessor: 'parentPhone' },
                { header: 'Pending Amount', accessor: (r) => <span className="font-extrabold text-school-maroon">${r.pendingFees.toLocaleString()}</span> }
              ]}
              data={defaulters}
              searchKey="name"
              searchPlaceholder="Search by student name..."
              actions={(row) => (
                <Button variant="outline" size="sm" className="border-school-maroon text-school-maroon hover:bg-school-maroonLight" onClick={() => handleSendReminder(row.name)}>
                  Send Reminder
                </Button>
              )}
            />
          )}
        </Card>
      )}

      {/* Collect Fee Modal */}
      <Modal isOpen={isCollectOpen} onClose={() => setIsCollectOpen(false)} title="Collect Student Tuition Fee">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-14 w-14 bg-school-green/10 rounded-full flex items-center justify-center text-school-green mb-4">
              <CheckCircle className="h-8 w-8 animate-bounce" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Transaction Success!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Payment logged and receipt issued.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Student</label>
              <select
                value={paymentForm.studentName}
                onChange={(e) => {
                  const s = students?.find(item => item.name === e.target.value);
                  setPaymentForm({
                    ...paymentForm,
                    studentName: e.target.value,
                    grade: s ? s.grade : 'Grade 10',
                    amount: s ? s.pendingFees : 15000
                  });
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold"
              >
                {students?.map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.grade} - Dues: ${s.pendingFees})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Billing Grade</label>
                <input
                  type="text"
                  disabled
                  value={paymentForm.grade}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-sm focus:outline-none dark:text-slate-400 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Collection Amount ($)</label>
                <input
                  type="number"
                  required
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payment Mechanism</label>
              <select
                value={paymentForm.paymentMode}
                onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold"
              >
                <option value="Card">Credit/Debit Card</option>
                <option value="UPI">Unified Payments Interface (UPI)</option>
                <option value="Bank Transfer">Direct Bank Wire</option>
                <option value="Cash">Physical Cash Counter</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsCollectOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" isLoading={payFeeMutation.isPending}>Authorize Transaction</Button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
}
