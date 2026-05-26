import React, { useState, useEffect } from 'react';
import { Staff } from '../../types';
import { adminService } from '../../services/adminService';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import * as Icons from 'lucide-react';

export const StaffDirectory: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    adminService.getStaff().then(setStaff);
  }, []);

  const columns: Column<Staff>[] = [
    { key: 'employeeNo', title: 'Emp. No', sortable: true },
    {
      key: 'name',
      title: 'Staff Member',
      sortable: true,
      render: (_, row) => `${row.firstName} ${row.lastName}`
    },
    { key: 'email', title: 'Email Address' },
    { key: 'designation', title: 'Designation', sortable: true },
    { key: 'department', title: 'Department', sortable: true },
    { key: 'joiningDate', title: 'Joining Date', sortable: true },
    { key: 'salary', title: 'Salary (Monthly)', render: (val) => `$${val}` },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (val) => (
        <Badge color={val === 'active' ? 'success' : val === 'on_leave' ? 'warning' : 'secondary'}>
          {val.replace('_', ' ')}
        </Badge>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div>
        <h2>Staff & Faculty Directory (HR)</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage employee profiles, designations, and payroll structures.</p>
      </div>

      <DataTable 
        columns={columns}
        data={staff}
        searchKey="firstName"
        searchPlaceholder="Search staff member first name..."
      />

      <Card style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <Card.Body>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Icons.BadgeInfo size={20} color="var(--accent-primary)" />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <strong>Laravel Integration:</strong> Syncs with <code>GET /api/staff</code>. Salaries and designations feed directly into staff payroll modules.
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
export default StaffDirectory;
