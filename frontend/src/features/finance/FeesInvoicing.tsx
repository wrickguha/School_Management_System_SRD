import React, { useState, useEffect } from 'react';
import { FeeReceipt } from '../../types';
import { financeService } from '../../services/financeService';
import { useAuth } from '../../context/AuthContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/FormFields';
import * as Icons from 'lucide-react';

export const FeesInvoicing: React.FC = () => {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState<FeeReceipt[]>([]);
  const [summary, setSummary] = useState({ totalInvoiced: 0, totalCollected: 0, totalPending: 0, recoveryRate: 0 });
  const [isOpen, setIsOpen] = useState(false);

  // Form states
  const [studentName, setStudentName] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank_transfer' | 'online'>('cash');
  const [feeType, setFeeType] = useState<'Tuition' | 'Admission' | 'Transport' | 'Exam' | 'Library'>('Tuition');
  const [concession, setConcession] = useState('0');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    financeService.getFeeReceipts().then(setReceipts);
    financeService.getOutstandingFeesSummary().then(setSummary);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    await financeService.createFeeReceipt({
      studentId: 'std-manual',
      studentName,
      className: 'Grade 10',
      amountPaid: Number(amountPaid),
      paymentMethod,
      paymentDate: new Date().toISOString().split('T')[0],
      feeType,
      status: 'paid',
      concession: Number(concession) > 0 ? Number(concession) : undefined
    });
    setIsOpen(false);
    loadData(); // Reload table & summary
    // Reset Form
    setStudentName('');
    setAmountPaid('');
    setConcession('0');
  };

  const isAccountant = user?.role === 'accountant' || user?.role === 'super_admin' || user?.role === 'school_admin' || user?.role === 'principal';

  const columns: Column<FeeReceipt>[] = [
    { key: 'invoiceNo', title: 'Invoice No', sortable: true },
    { key: 'studentName', title: 'Student Name', sortable: true },
    { key: 'className', title: 'Class' },
    { key: 'feeType', title: 'Fee Type', sortable: true },
    { key: 'amountPaid', title: 'Amount Paid', render: (val) => `$${val}` },
    { key: 'concession', title: 'Concession', render: (val) => val ? `$${val}` : '-' },
    { key: 'paymentMethod', title: 'Method', render: (val) => String(val).toUpperCase() },
    { key: 'paymentDate', title: 'Date', sortable: true },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (val) => (
        <Badge color={val === 'paid' ? 'success' : val === 'partial' ? 'warning' : 'danger'}>
          {val}
        </Badge>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Fee Ledger & Invoicing Center</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track student tuition billing sheets, outstanding dues, and deposit receipts.</p>
        </div>

        {isAccountant && (
          <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
            <Icons.Plus size={16} /> Record Cash Deposit
          </button>
        )}
      </div>

      {/* Stats Summary cards */}
      <div className="grid-dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <Card style={{ borderLeft: '4px solid var(--accent-primary)' }}>
          <Card.Body style={{ padding: 'var(--space-md)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL EXPECTED REVENUE</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4px' }}>${summary.totalInvoiced}</h3>
          </Card.Body>
        </Card>
        <Card style={{ borderLeft: '4px solid var(--success)' }}>
          <Card.Body style={{ padding: 'var(--space-md)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>REVENUE COLLECTED</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4px' }}>${summary.totalCollected}</h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 700 }}>{summary.recoveryRate}% Recovery Rate</span>
          </Card.Body>
        </Card>
        <Card style={{ borderLeft: '4px solid var(--danger)' }}>
          <Card.Body style={{ padding: 'var(--space-md)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>OUTSTANDING RECEIVABLES</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4px' }}>${summary.totalPending}</h3>
          </Card.Body>
        </Card>
      </div>

      <DataTable 
        columns={columns}
        data={receipts}
        searchKey="studentName"
        searchPlaceholder="Search student name..."
      />

      {/* Record Payment Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Record Student Fee Deposit (Manual Entry)"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleRecordPayment}>Post Transaction</button>
          </>
        }
      >
        <form onSubmit={handleRecordPayment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input label="Student Name" required value={studentName} onChange={e => setStudentName(e.target.value)} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Amount Deposited ($)" type="number" required value={amountPaid} onChange={e => setAmountPaid(e.target.value)} />
            <Input label="Fee Concession ($)" type="number" value={concession} onChange={e => setConcession(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select 
              label="Payment Mode"
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value as any)}
              options={[
                { value: 'cash', label: 'Cash / Cheque' },
                { value: 'card', label: 'Credit/Debit Card' },
                { value: 'bank_transfer', label: 'Direct Bank Transfer' }
              ]}
            />
            <Select 
              label="Billing Category"
              value={feeType}
              onChange={e => setFeeType(e.target.value as any)}
              options={[
                { value: 'Tuition', label: 'Tuition Fee' },
                { value: 'Admission', label: 'Admission Fee' },
                { value: 'Transport', label: 'Transport Fee' },
                { value: 'Exam', label: 'Exam Fee' },
                { value: 'Library', label: 'Library Fee' }
              ]}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default FeesInvoicing;
