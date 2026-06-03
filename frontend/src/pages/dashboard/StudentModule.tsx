import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Eye, Trash2, FileText, UploadCloud
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { studentService } from '../../services/services';
import type { Student } from '../../services/mockDb';

export default function StudentModule() {
  const queryClient = useQueryClient();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [admissionForm, setAdmissionForm] = useState({
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
    totalFees: 45000
  });

  // Queries
  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAll
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: studentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsAdmissionOpen(false);
      setAdmissionForm({
        name: '', grade: 'Grade 10', section: 'A', gender: 'Male', dob: '',
        parentName: '', parentPhone: '', parentEmail: '', address: '', bloodGroup: 'O+', totalFees: 45000
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: studentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      if (selectedStudent) {
        setSelectedStudent(null);
        setIsProfileOpen(false);
      }
    }
  });

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name: admissionForm.name,
      admissionNo: `ADM2026${Math.floor(100 + Math.random() * 900)}`,
      rollNo: String(students ? students.length + 1 : 1).padStart(2, '0'),
      grade: admissionForm.grade,
      section: admissionForm.section,
      gender: admissionForm.gender,
      dob: admissionForm.dob,
      parentName: admissionForm.parentName,
      parentPhone: admissionForm.parentPhone,
      parentEmail: admissionForm.parentEmail,
      address: admissionForm.address,
      bloodGroup: admissionForm.bloodGroup,
      admissionDate: new Date().toISOString().split('T')[0],
      totalFees: Number(admissionForm.totalFees)
    });
  };

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setIsProfileOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this student record?')) {
      deleteMutation.mutate(id);
    }
  };

  // Columns for DataTable
  const columns: Column<Student>[] = [
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
            : 'bg-red-50 dark:bg-red-950/20 text-red-650'
        }`}>
          {r.feeStatus}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Student Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Browse and manage all registered pupils and new admissions.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsAdmissionOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Register Student
        </Button>
      </div>

      {/* Main Grid */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={students || []}
            searchKey="name"
            searchPlaceholder="Search by student name..."
            actions={(row) => (
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" className="px-2" onClick={() => handleViewProfile(row)}>
                  <Eye className="h-4.5 w-4.5 text-school-blue" />
                </Button>
                <Button variant="ghost" size="sm" className="px-2" onClick={() => handleDelete(row.id)}>
                  <Trash2 className="h-4.5 w-4.5 text-red-555" />
                </Button>
              </div>
            )}
          />
        )}
      </Card>

      {/* 1. Admission Form Modal */}
      <Modal isOpen={isAdmissionOpen} onClose={() => setIsAdmissionOpen(false)} title="New Student Registration">
        <form onSubmit={handleAdmissionSubmit} className="space-y-5">
          <p className="text-xs text-slate-500">
            Submit the official academic registry documents to initialize the student portfolio.
          </p>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
            <input
              type="text"
              required
              value={admissionForm.name}
              onChange={(e) => setAdmissionForm({ ...admissionForm, name: e.target.value })}
              placeholder="e.g. Liam Fitzpatrick"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grade</label>
              <select
                value={admissionForm.grade}
                onChange={(e) => setAdmissionForm({ ...admissionForm, grade: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
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
                value={admissionForm.section}
                onChange={(e) => setAdmissionForm({ ...admissionForm, section: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
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
                value={admissionForm.gender}
                onChange={(e) => setAdmissionForm({ ...admissionForm, gender: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
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
                value={admissionForm.bloodGroup}
                onChange={(e) => setAdmissionForm({ ...admissionForm, bloodGroup: e.target.value })}
                placeholder="O+"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date of Birth</label>
              <input
                type="date"
                required
                value={admissionForm.dob}
                onChange={(e) => setAdmissionForm({ ...admissionForm, dob: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
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
                value={admissionForm.parentName}
                onChange={(e) => setAdmissionForm({ ...admissionForm, parentName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Parent Phone</label>
                <input
                  type="tel"
                  required
                  value={admissionForm.parentPhone}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, parentPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Parent Email</label>
                <input
                  type="email"
                  required
                  value={admissionForm.parentEmail}
                  onChange={(e) => setAdmissionForm({ ...admissionForm, parentEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Address</label>
              <textarea
                value={admissionForm.address}
                onChange={(e) => setAdmissionForm({ ...admissionForm, address: e.target.value })}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsAdmissionOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={createMutation.isPending}>
              Register Admission
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. Detailed Profile View Modal */}
      <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} title="Student Profile & Archives" size="lg">
        {selectedStudent && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="h-20 w-20 rounded-2xl bg-school-blueLight dark:bg-school-blue/15 text-school-blue flex items-center justify-center font-extrabold text-2xl uppercase">
                {selectedStudent.name.slice(0, 2)}
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h3 className="text-xl font-bold text-slate-905 dark:text-white">{selectedStudent.name}</h3>
                <span className="text-xs font-bold text-slate-400 block">Class Allocation: {selectedStudent.grade}-{selectedStudent.section}</span>
                <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-school-greenLight text-school-green inline-block">
                  Status: {selectedStudent.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Institutional Parameters</h4>
                <ul className="space-y-3.5 text-sm font-semibold">
                  <li className="flex justify-between border-b border-slate-50 dark:border-slate-850 pb-2">
                    <span className="text-slate-400">Admission No:</span>
                    <span>{selectedStudent.admissionNo}</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 dark:border-slate-850 pb-2">
                    <span className="text-slate-400">Date of Birth:</span>
                    <span>{selectedStudent.dob}</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 dark:border-slate-850 pb-2">
                    <span className="text-slate-400">Blood Group:</span>
                    <span>{selectedStudent.bloodGroup}</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 dark:border-slate-850 pb-2">
                    <span className="text-slate-400">Admission Date:</span>
                    <span>{selectedStudent.admissionDate}</span>
                  </li>
                </ul>
              </div>

              {/* Parents details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-jakarta">Guardians & Communications</h4>
                <ul className="space-y-3.5 text-sm font-semibold">
                  <li className="flex justify-between border-b border-slate-50 dark:border-slate-850 pb-2">
                    <span className="text-slate-400">Parent Name:</span>
                    <span>{selectedStudent.parentName}</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 dark:border-slate-850 pb-2">
                    <span className="text-slate-400">Contact Number:</span>
                    <span>{selectedStudent.parentPhone}</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 dark:border-slate-850 pb-2">
                    <span className="text-slate-400">Sync Email:</span>
                    <span>{selectedStudent.parentEmail}</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-50 dark:border-slate-850 pb-2">
                    <span className="text-slate-400">Address:</span>
                    <span className="truncate max-w-[200px]">{selectedStudent.address}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attendance</span>
                <span className="block text-xl font-extrabold text-school-blue mt-1">{selectedStudent.attendanceRate}%</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Term-I GPA</span>
                <span className="block text-xl font-extrabold text-school-green mt-1">{selectedStudent.academicPerformance}%</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due Fees</span>
                <span className="block text-xl font-extrabold text-school-maroon mt-1">${selectedStudent.pendingFees.toLocaleString()}</span>
              </div>
            </div>

            {/* Document Vault */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Document Management Vault</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedStudent.documents.map((doc, idx) => (
                  <div key={idx} className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-school-blue" />
                      <div>
                        <span className="text-xs font-bold block">{doc.name}</span>
                        <span className="text-[9px] font-semibold text-slate-400 uppercase">{doc.type}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                      doc.status === 'Verified' ? 'bg-school-greenLight text-school-green' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
                
                {/* Upload Dummy Box */}
                <div className="p-3.5 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors">
                  <UploadCloud className="h-5 w-5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-400">Upload document (pdf/img)</span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
                Dismiss Panel
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
