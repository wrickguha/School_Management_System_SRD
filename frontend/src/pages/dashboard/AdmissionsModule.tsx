import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Eye, Trash2, HelpCircle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { studentService, enquiryService } from '../../services/services';
import type { Student } from '../../services/mockDb';

interface Enquiry {
  id: number;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  student_name: string;
  applying_grade: string;
  status: 'New' | 'Contacted' | 'Admitted' | 'Closed';
  notes: string;
  created_at: string;
}

export default function AdmissionsModule() {
  const queryClient = useQueryClient();
  const [activeSubTab, setActiveSubTab] = useState<'admissions' | 'enquiries'>('admissions');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Registration Form
  const [registerForm, setRegisterForm] = useState({
    name: '',
    grade: 'Grade 10',
    section: 'A',
    gender: 'Male',
    dob: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    bloodGroup: 'O+',
    totalFees: 5000
  });

  // Enquiry Form
  const [enquiryForm, setEnquiryForm] = useState({
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    student_name: '',
    applying_grade: 'Grade 10',
    notes: ''
  });

  // Queries
  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAll
  });

  const { data: enquiries, isLoading: loadingEnquiries } = useQuery({
    queryKey: ['enquiries'],
    queryFn: enquiryService.getAll
  });

  // Mutations
  const createStudentMutation = useMutation({
    mutationFn: studentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsRegisterOpen(false);
      setRegisterForm({
        name: '', grade: 'Grade 10', section: 'A', gender: 'Male', dob: '',
        parentName: '', parentPhone: '', parentEmail: '', address: '', bloodGroup: 'O+', totalFees: 5000
      });
    }
  });

  const createEnquiryMutation = useMutation({
    mutationFn: enquiryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      setIsEnquiryOpen(false);
      setEnquiryForm({
        parent_name: '', parent_email: '', parent_phone: '',
        student_name: '', applying_grade: 'Grade 10', notes: ''
      });
    }
  });

  const updateEnquiryStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { status: any; notes?: string } }) =>
      enquiryService.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
    }
  });

  const deleteStudentMutation = useMutation({
    mutationFn: studentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setSelectedStudent(null);
      setIsProfileOpen(false);
    }
  });

  const deleteEnquiryMutation = useMutation({
    mutationFn: enquiryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
    }
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createStudentMutation.mutate({
      name: registerForm.name,
      admissionNo: `ADM2026${Math.floor(100 + Math.random() * 900)}`,
      rollNo: String(students ? students.length + 101 : 101),
      grade: registerForm.grade,
      section: registerForm.section,
      gender: registerForm.gender,
      dob: registerForm.dob,
      parentName: registerForm.parentName,
      parentPhone: registerForm.parentPhone,
      parentEmail: registerForm.parentEmail,
      address: registerForm.address,
      bloodGroup: registerForm.bloodGroup,
      admissionDate: new Date().toISOString().split('T')[0],
      totalFees: Number(registerForm.totalFees)
    });
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEnquiryMutation.mutate(enquiryForm);
  };

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setIsProfileOpen(true);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('Are you sure you want to delete this student record?')) {
      deleteStudentMutation.mutate(id);
    }
  };

  const handleDeleteEnquiry = (id: number) => {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      deleteEnquiryMutation.mutate(id);
    }
  };

  const handleStatusChange = (id: number, status: any) => {
    updateEnquiryStatusMutation.mutate({ id, data: { status } });
  };

  // Columns for Students Table
  const studentColumns: Column<Student>[] = [
    { header: 'Admission No', accessor: 'admissionNo', sortable: true, sortKey: 'admissionNo' },
    { header: 'Name', accessor: 'name', sortable: true, sortKey: 'name' },
    { header: 'Grade', accessor: (r: Student) => `${r.grade}-${r.section}` },
    { header: 'Attendance', accessor: (r: Student) => <span className="font-bold text-school-blue">{r.attendanceRate}%</span> },
    { header: 'GPA Perf', accessor: (r: Student) => <span className="font-bold text-school-green">{r.academicPerformance}%</span> },
    {
      header: 'Fee Status',
      accessor: (r: Student) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
          r.feeStatus === 'Paid'
            ? 'bg-school-greenLight text-school-green'
            : r.feeStatus === 'Partial'
            ? 'bg-school-blueLight text-school-blue'
            : 'bg-red-50 dark:bg-red-950/20 text-red-600'
        }`}>
          {r.feeStatus}
        </span>
      )
    }
  ];

  // Columns for Enquiries Table
  const enquiryColumns: Column<Enquiry>[] = [
    { header: 'Parent Name', accessor: 'parent_name', sortable: true, sortKey: 'parent_name' },
    { header: 'Email', accessor: 'parent_email' },
    { header: 'Phone', accessor: 'parent_phone' },
    { header: 'Student Name', accessor: 'student_name' },
    { header: 'Grade', accessor: 'applying_grade' },
    {
      header: 'Status',
      accessor: (r: Enquiry) => (
        <select
          value={r.status}
          onChange={(e) => handleStatusChange(r.id, e.target.value)}
          className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold focus:outline-none"
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Admitted">Admitted</option>
          <option value="Closed">Closed</option>
        </select>
      )
    }
  ];

  return (
    <div className="space-y-8 text-left">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Admissions Control Center</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Manage student registrations, seat matrices, and prospect admission enquiries.
          </p>
        </div>
        <div className="flex gap-3">
          {activeSubTab === 'admissions' ? (
            <Button variant="primary" size="sm" onClick={() => setIsRegisterOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
              Register Student
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={() => setIsEnquiryOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
              Record Enquiry
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-850 gap-6">
        <button
          onClick={() => setActiveSubTab('admissions')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'admissions'
              ? 'border-school-blue text-school-blue'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Active Admissions
        </button>
        <button
          onClick={() => setActiveSubTab('enquiries')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'enquiries'
              ? 'border-school-blue text-school-blue'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Prospect Admission Enquiries
        </button>
      </div>

      {activeSubTab === 'admissions' ? (
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
          {loadingStudents ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ) : (
            <DataTable
              columns={studentColumns}
              data={students || []}
              searchKey="name"
              searchPlaceholder="Search by student name..."
              actions={(row) => (
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" className="px-2" onClick={() => handleViewProfile(row)}>
                    <Eye className="h-4 w-4 text-school-blue" />
                  </Button>
                  <Button variant="ghost" size="sm" className="px-2" onClick={() => handleDeleteStudent(row.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              )}
            />
          )}
        </Card>
      ) : (
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
          {loadingEnquiries ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ) : (
            <DataTable
              columns={enquiryColumns}
              data={enquiries || []}
              searchKey="parent_name"
              searchPlaceholder="Search by parent name..."
              actions={(row) => (
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="px-2" 
                    onClick={() => alert(`Enquiry Notes: ${row.notes || 'No notes added yet'}`)}
                  >
                    <HelpCircle className="h-4 w-4 text-school-blue" />
                  </Button>
                  <Button variant="ghost" size="sm" className="px-2" onClick={() => handleDeleteEnquiry(row.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              )}
            />
          )}
        </Card>
      )}

      {/* Student Registration Modal */}
      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Register Student Portfolio">
        <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
            <input
              type="text"
              required
              value={registerForm.name}
              onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              placeholder="e.g. Alice Miller"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grade</label>
              <select
                value={registerForm.grade}
                onChange={(e) => setRegisterForm({ ...registerForm, grade: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
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
                value={registerForm.section}
                onChange={(e) => setRegisterForm({ ...registerForm, section: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gender</label>
              <select
                value={registerForm.gender}
                onChange={(e) => setRegisterForm({ ...registerForm, gender: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Blood Group</label>
              <input
                type="text"
                required
                value={registerForm.bloodGroup}
                onChange={(e) => setRegisterForm({ ...registerForm, bloodGroup: e.target.value })}
                placeholder="O+"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date of Birth</label>
              <input
                type="date"
                required
                value={registerForm.dob}
                onChange={(e) => setRegisterForm({ ...registerForm, dob: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="border-t border-slate-150 dark:border-slate-800 pt-4 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-school-blue">Parent/Guardian Information</h4>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Parent Name</label>
              <input
                type="text"
                required
                value={registerForm.parentName}
                onChange={(e) => setRegisterForm({ ...registerForm, parentName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Parent Phone</label>
                <input
                  type="tel"
                  required
                  value={registerForm.parentPhone}
                  onChange={(e) => setRegisterForm({ ...registerForm, parentPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Parent Email</label>
                <input
                  type="email"
                  required
                  value={registerForm.parentEmail}
                  onChange={(e) => setRegisterForm({ ...registerForm, parentEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsRegisterOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={createStudentMutation.isPending}>
              Register Admission
            </Button>
          </div>
        </form>
      </Modal>

      {/* Enquiry Form Modal */}
      <Modal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} title="Record Admission Enquiry">
        <form onSubmit={handleEnquirySubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Parent Name</label>
              <input
                type="text"
                required
                value={enquiryForm.parent_name}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, parent_name: e.target.value })}
                placeholder="Ramesh Sharma"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Student Name</label>
              <input
                type="text"
                required
                value={enquiryForm.student_name}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, student_name: e.target.value })}
                placeholder="Aarav Sharma"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                required
                value={enquiryForm.parent_email}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, parent_email: e.target.value })}
                placeholder="parent@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
              <input
                type="tel"
                value={enquiryForm.parent_phone}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, parent_phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Applying Grade</label>
            <select
              value={enquiryForm.applying_grade}
              onChange={(e) => setEnquiryForm({ ...enquiryForm, applying_grade: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
            >
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Internal Notes / Context</label>
            <textarea
              value={enquiryForm.notes}
              onChange={(e) => setEnquiryForm({ ...enquiryForm, notes: e.target.value })}
              rows={3}
              placeholder="e.g. Enquired about fees installments and transport options..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsEnquiryOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={createEnquiryMutation.isPending}>
              Record Enquiry
            </Button>
          </div>
        </form>
      </Modal>

      {/* Student Detailed Profile Modal */}
      <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} title="Student Profile Overview" size="lg">
        {selectedStudent && (
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="h-16 w-16 bg-school-blue/10 text-school-blue rounded-full flex items-center justify-center font-extrabold text-xl">
                {selectedStudent.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedStudent.name}</h3>
                <span className="text-xs text-slate-400">Class: {selectedStudent.grade}-{selectedStudent.section}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Admission Date</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedStudent.admissionDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Parent Email</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedStudent.parentEmail}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Parent Phone</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedStudent.parentPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Blood Group</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedStudent.bloodGroup}</span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setIsProfileOpen(false)}>Dismiss Overview</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
