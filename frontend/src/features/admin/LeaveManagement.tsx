import React, { useState, useEffect } from 'react';
import { LeaveRequest } from '../../types';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/FormFields';
import * as Icons from 'lucide-react';

export const LeaveManagement: React.FC = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Form states
  const [leaveType, setLeaveType] = useState<'Casual' | 'Sick' | 'Maternity' | 'Earned'>('Casual');
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-06-02');
  const [reason, setReason] = useState('');

  useEffect(() => {
    adminService.getLeaves().then(setLeaves);
  }, []);

  const handleAction = async (id: string, status: LeaveRequest['status']) => {
    try {
      const updated = await adminService.updateLeaveStatus(id, status, user?.name || 'Admin');
      setLeaves(prev => prev.map(l => l.id === id ? updated : l));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const newLeave = await adminService.submitLeave({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      leaveType,
      startDate,
      endDate,
      reason,
    });
    setLeaves([...leaves, newLeave]);
    setIsOpen(false);
    setReason('');
  };

  const canApprove = user?.role === 'super_admin' || user?.role === 'school_admin' || user?.role === 'principal' || user?.role === 'hr_reception';

  const columns: Column<LeaveRequest>[] = [
    { key: 'userName', title: 'Employee/Student', sortable: true },
    { key: 'leaveType', title: 'Type', sortable: true },
    { key: 'startDate', title: 'Start Date', sortable: true },
    { key: 'endDate', title: 'End Date' },
    { key: 'reason', title: 'Reason / Description' },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (val) => (
        <Badge color={val === 'approved' ? 'success' : val === 'pending' ? 'warning' : 'danger'}>
          {val}
        </Badge>
      )
    },
    {
      key: 'actions',
      title: 'Action Panel',
      render: (_, row) => {
        if (!canApprove) return <span style={{ color: 'var(--text-tertiary)' }}>No access</span>;
        if (row.status !== 'pending') return <span style={{ color: 'var(--text-tertiary)' }}>Logged ({row.approverName})</span>;
        return (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button 
              className="btn btn-primary"
              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
              onClick={() => handleAction(row.id, 'approved')}
            >
              Approve
            </button>
            <button 
              className="btn btn-danger"
              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
              onClick={() => handleAction(row.id, 'rejected')}
            >
              Reject
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Absence & Leave Management</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Log leave applications and manage approval routing gates.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
          <Icons.CalendarPlus size={16} /> Submit Leave Request
        </button>
      </div>

      <DataTable 
        columns={columns}
        data={leaves}
        searchKey="userName"
        searchPlaceholder="Search applicant name..."
      />

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Submit Absence Leave Request"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Submit Application</button>
          </>
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Select 
            label="Type of Leave"
            value={leaveType}
            onChange={e => setLeaveType(e.target.value as any)}
            options={[
              { value: 'Casual', label: 'Casual Leave' },
              { value: 'Sick', label: 'Sick Leave' },
              { value: 'Maternity', label: 'Maternity Leave' },
              { value: 'Earned', label: 'Earned Leave' }
            ]}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <Input label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <Input label="Reason for Leave" required value={reason} onChange={e => setReason(e.target.value)} />
        </form>
      </Modal>
    </div>
  );
};
export default LeaveManagement;
