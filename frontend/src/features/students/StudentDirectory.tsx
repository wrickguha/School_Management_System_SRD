import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { studentService } from '../../services/studentService';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Modal, Drawer } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/FormFields';
import * as Icons from 'lucide-react';

export const StudentDirectory: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [classId, setClassId] = useState('cls-10');
  const [sectionId, setSectionId] = useState('sec-10a');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [dob, setDob] = useState('2010-01-01');
  const [parentName, setParentName] = useState('');

  useEffect(() => {
    studentService.getStudents().then(setStudents);
  }, []);

  const handleRowClick = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent = await studentService.createStudent({
      firstName,
      lastName,
      classId,
      className: classId === 'cls-10' ? 'Grade 10' : 'Grade 9',
      sectionId,
      sectionName: sectionId === 'sec-10a' ? 'A' : 'B',
      gender,
      dateOfBirth: dob,
      parentName,
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'active'
    });
    setStudents([...students, newStudent]);
    setIsAddOpen(false);
    // Reset Form
    setFirstName('');
    setLastName('');
    setParentName('');
  };

  const handleSuspendBulk = (selected: Student[]) => {
    const ids = selected.map(s => s.id);
    const updated = students.map(s => ids.includes(s.id) ? { ...s, status: 'suspended' as const } : s);
    setStudents(updated);
    localStorage.setItem('mock__api_students', JSON.stringify(updated));
    alert(`Suspended ${selected.length} students in mock database.`);
  };

  const columns: Column<Student>[] = [
    { key: 'admissionNo', title: 'Adm. No', sortable: true },
    { key: 'rollNo', title: 'Roll No', sortable: true },
    {
      key: 'name',
      title: 'Student Name',
      sortable: true,
      render: (_, row) => `${row.firstName} ${row.lastName}`
    },
    { key: 'className', title: 'Class', sortable: true },
    { key: 'sectionName', title: 'Sec', sortable: true },
    { key: 'parentName', title: 'Parent/Guardian' },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (val) => (
        <Badge color={val === 'active' ? 'success' : val === 'suspended' ? 'danger' : 'secondary'}>
          {val}
        </Badge>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Student Information System (SIS)</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage pupil records, registrations, and statuses.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
          <Icons.UserPlus size={16} /> Register Student
        </button>
      </div>

      {/* Reusable Data Table */}
      <DataTable
        columns={columns}
        data={students}
        searchKey="firstName"
        searchPlaceholder="Search student first name..."
        onRowClick={handleRowClick}
        bulkActions={[
          { label: 'Suspend Students', onClick: handleSuspendBulk, variant: 'danger' }
        ]}
      />

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register New Student (Admission Entry)"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddSubmit}>Save Record</button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input label="First Name" required value={firstName} onChange={e => setFirstName(e.target.value)} />
          <Input label="Last Name" required value={lastName} onChange={e => setLastName(e.target.value)} />
          <Select 
            label="Class Room"
            value={classId}
            onChange={e => setClassId(e.target.value)}
            options={[
              { value: 'cls-10', label: 'Grade 10' },
              { value: 'cls-9', label: 'Grade 9' }
            ]}
          />
          <Select 
            label="Section"
            value={sectionId}
            onChange={e => setSectionId(e.target.value)}
            options={[
              { value: 'sec-10a', label: 'A' },
              { value: 'sec-10b', label: 'B' }
            ]}
          />
          <Select 
            label="Gender"
            value={gender}
            onChange={e => setGender(e.target.value as any)}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' }
            ]}
          />
          <Input label="Date of Birth" type="date" value={dob} onChange={e => setDob(e.target.value)} />
          <Input label="Parent / Guardian Name" required value={parentName} onChange={e => setParentName(e.target.value)} className="w-full" style={{ gridColumn: 'span 2' }} />
        </form>
      </Modal>

      {/* Detail View Drawer */}
      <Drawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Student Full Ledger Details"
        size="md"
      >
        {selectedStudent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, margin: '0 auto 12px' }}>
                {selectedStudent.firstName.charAt(0)}{selectedStudent.lastName.charAt(0)}
              </div>
              <h3>{selectedStudent.firstName} {selectedStudent.lastName}</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Adm: {selectedStudent.admissionNo} • Roll: {selectedStudent.rollNo}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Class & Section</span>
                <strong>Grade {selectedStudent.classId.replace('cls-', '')} ({selectedStudent.sectionName})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Date of Birth</span>
                <strong>{selectedStudent.dateOfBirth}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Gender</span>
                <strong style={{ textTransform: 'capitalize' }}>{selectedStudent.gender}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Parent / Guardian</span>
                <strong>{selectedStudent.parentName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Admission Date</span>
                <strong>{selectedStudent.admissionDate}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                <Badge color={selectedStudent.status === 'active' ? 'success' : 'danger'}>{selectedStudent.status}</Badge>
              </div>
            </div>

            {/* Laravel Integration Endpoint Note */}
            <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-sm)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
              <strong>API Connectivity Notice:</strong>
              <p style={{ marginTop: '4px' }}>Replacing mock data will point requests directly to <code>GET /api/students/{selectedStudent.id}</code>. Student entities match Laravel database schemas exactly.</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
export default StudentDirectory;
