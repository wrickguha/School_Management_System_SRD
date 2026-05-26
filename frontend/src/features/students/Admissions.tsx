import React, { useState, useEffect } from 'react';
import { AdmissionRequest } from '../../types';
import { studentService } from '../../services/studentService';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import * as Icons from 'lucide-react';

export const Admissions: React.FC = () => {
  const [admissions, setAdmissions] = useState<AdmissionRequest[]>([]);

  useEffect(() => {
    studentService.getAdmissions().then(setAdmissions);
  }, []);

  const handleAction = async (id: string, status: AdmissionRequest['status']) => {
    try {
      const updated = await studentService.updateAdmissionStatus(id, status);
      setAdmissions(prev => prev.map(a => a.id === id ? updated : a));
    } catch (e) {
      console.error(e);
    }
  };

  const columns: Column<AdmissionRequest>[] = [
    { key: 'requestDate', title: 'Applied Date', sortable: true },
    {
      key: 'name',
      title: 'Applicant Name',
      sortable: true,
      render: (_, row) => `${row.firstName} ${row.lastName}`
    },
    { key: 'classId', title: 'Grade Request', render: (val) => `Grade ${String(val).replace('cls-', '')}` },
    { key: 'parentName', title: 'Parent/Guardian' },
    { key: 'parentPhone', title: 'Contact Phone' },
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
      title: 'Action Gate',
      render: (_, row) => {
        if (row.status !== 'pending') return <span style={{ color: 'var(--text-tertiary)' }}>Logged</span>;
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
      <div>
        <h2>Admissions & Registrations Funnel</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Review pending enrollments and manage approval workflow.</p>
      </div>

      <DataTable 
        columns={columns}
        data={admissions}
        searchKey="firstName"
        searchPlaceholder="Search applicant first name..."
      />

      {/* Laravel Endpoint info */}
      <Card style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <Card.Body>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Icons.Code size={20} color="var(--accent-primary)" />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <strong>Laravel REST Mapping:</strong> Status updates post directly to <code>POST /api/admissions/{"{id}"}/status</code> payload: <code>{"{ status: 'approved' | 'rejected' }"}</code>.
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
export default Admissions;
