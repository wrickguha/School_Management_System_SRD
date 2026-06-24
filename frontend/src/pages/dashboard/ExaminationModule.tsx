import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { examService, studentService } from '../../services/services';
import { Plus, Award, FileText, Printer, CheckCircle } from 'lucide-react';
import type { Student } from '../../services/mockDb';

export default function ExaminationModule() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'schedule' | 'marks'>('schedule');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    title: 'First Terminal Examination',
    grade: 'Grade 10',
    subject: 'Calculus',
    date: '',
    time: '09:00 AM - 12:00 PM',
    maxMarks: 100
  });

  // Queries
  const { data: exams, isLoading: loadingExams } = useQuery({ queryKey: ['exams'], queryFn: examService.getAll });
  const { data: students, isLoading: loadingStudents } = useQuery({ queryKey: ['students'], queryFn: studentService.getAll });

  // Mutations
  const createExamMutation = useMutation({
    mutationFn: examService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      setIsScheduleOpen(false);
    }
  });

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createExamMutation.mutate(scheduleForm);
  };

  const handleViewReport = (student: Student) => {
    setSelectedStudent(student);
    setIsReportOpen(true);
  };

  const hasPublishedResults = exams && exams.some((e) => e.status === 'Completed');
  const publishedResultsText = hasPublishedResults ? 'Term-I 2026' : 'None';
  const totalStudentsVal = students?.length || 0;
  const classAvgText = (students && totalStudentsVal > 0)
    ? (students.reduce((acc: number, s: any) => acc + Number(s.academicPerformance || 0), 0) / totalStudentsVal).toFixed(1) + '% Score'
    : '0% Score';
  const gradingSystemText = totalStudentsVal > 0 ? 'Letter grade (A-F)' : 'None';

  return (
    <div className="space-y-8 text-left">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Examinations Center</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Schedule terminal tests, record marks, and publish report cards.
          </p>
        </div>
        
        {/* Toggle tabs */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'schedule' ? 'bg-white dark:bg-slate-900 shadow text-school-blue' : 'text-slate-550'
            }`}
          >
            Exam Schedules
          </button>
          <button
            onClick={() => setActiveTab('marks')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'marks' ? 'bg-white dark:bg-slate-900 shadow text-school-blue' : 'text-slate-550'
            }`}
          >
            Report Cards
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850">
          <span className="text-[10px] font-bold text-slate-450 uppercase">Active Schedules</span>
          <span className="block text-2xl font-extrabold text-school-blue mt-1">
            {loadingExams ? '...' : exams?.filter(e => e.status === 'Scheduled').length} Exams
          </span>
        </Card>
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850">
          <span className="text-[10px] font-bold text-slate-450 uppercase">Published Results</span>
          <span className="block text-2xl font-extrabold text-school-green mt-1">{publishedResultsText}</span>
        </Card>
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850">
          <span className="text-[10px] font-bold text-slate-450 uppercase">Class Average</span>
          <span className="block text-2xl font-extrabold text-school-blue mt-1">{classAvgText}</span>
        </Card>
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850">
          <span className="text-[10px] font-bold text-slate-450 uppercase">Grading System</span>
          {totalStudentsVal > 0 ? (
            <span className="block text-xs font-extrabold text-school-green mt-2 flex items-center gap-1"><CheckCircle className="h-4 w-4" /> {gradingSystemText}</span>
          ) : (
            <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{gradingSystemText}</span>
          )}
        </Card>
      </div>

      {/* Tab 1: Schedules */}
      {activeTab === 'schedule' && (
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
          <CardHeader className="flex items-center justify-between mb-6 pb-4 border-b border-slate-105 dark:border-slate-800">
            <CardTitle className="text-md">Institutional Examinations</CardTitle>
            <Button variant="primary" size="sm" onClick={() => setIsScheduleOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
              Create Schedule
            </Button>
          </CardHeader>

          {loadingExams ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-8 bg-slate-200 rounded" />
            </div>
          ) : (
            <DataTable
              columns={[
                { header: 'Title', accessor: 'title' },
                { header: 'Target Grade', accessor: 'grade' },
                { header: 'Subject', accessor: 'subject' },
                { header: 'Date', accessor: 'date' },
                { header: 'Timing', accessor: 'time' },
                {
                  header: 'Status',
                  accessor: (r) => (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      r.status === 'Scheduled' ? 'bg-school-blueLight text-school-blue' : 'bg-school-greenLight text-school-green'
                    }`}>
                      {r.status}
                    </span>
                  )
                }
              ]}
              data={exams || []}
              searchKey="subject"
              searchPlaceholder="Search by subject..."
            />
          )}
        </Card>
      )}

      {/* Tab 2: Report Cards */}
      {activeTab === 'marks' && (
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
          <CardHeader className="mb-6">
            <CardTitle className="text-md">Marksheet & Grade Card publisher</CardTitle>
          </CardHeader>

          {loadingStudents ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-8 bg-slate-200 rounded" />
            </div>
          ) : (
            <DataTable
              columns={[
                { header: 'Roll', accessor: 'rollNo' },
                { header: 'Student Name', accessor: 'name' },
                { header: 'Class', accessor: (r) => `${r.grade}-${r.section}` },
                { header: 'Term-I Average', accessor: (r) => <span className="font-bold text-school-green">{r.academicPerformance}%</span> }
              ]}
              data={students || []}
              searchKey="name"
              searchPlaceholder="Search by student name..."
              actions={(row) => (
                <Button variant="outline" size="sm" onClick={() => handleViewReport(row)} leftIcon={<FileText className="h-4 w-4" />}>
                  View Marksheet
                </Button>
              )}
            />
          )}
        </Card>
      )}

      {/* Create Schedule Modal */}
      <Modal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} title="Create Examination Schedule">
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Exam Title</label>
            <input
              type="text"
              required
              value={scheduleForm.title}
              onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Grade</label>
              <select
                value={scheduleForm.grade}
                onChange={(e) => setScheduleForm({ ...scheduleForm, grade: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              >
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</label>
              <input
                type="text"
                required
                value={scheduleForm.subject}
                onChange={(e) => setScheduleForm({ ...scheduleForm, subject: e.target.value })}
                placeholder="Chemistry"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Exam Date</label>
              <input
                type="date"
                required
                value={scheduleForm.date}
                onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Max Marks</label>
              <input
                type="number"
                required
                value={scheduleForm.maxMarks}
                onChange={(e) => setScheduleForm({ ...scheduleForm, maxMarks: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsScheduleOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={createExamMutation.isPending}>Schedule Exam</Button>
          </div>
        </form>
      </Modal>

      {/* Report Card sheet modal */}
      <Modal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} title="Official Terminal Marksheet" size="lg">
        {selectedStudent && (
          <div className="space-y-6">
            <div className="border-4 border-double border-slate-250 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-950 space-y-6 relative">
              <div className="text-center space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">St. Xavier Academy</span>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Academic Performance Grade Report</h3>
                <span className="text-xs text-slate-500 block">Session 2026 - Term I Examination</span>
              </div>

              {/* Student Info header */}
              <div className="grid grid-cols-2 gap-4 border-y border-slate-150 dark:border-slate-800 py-4 text-xs font-semibold">
                <div>
                  <p><span className="text-slate-400">Student Name:</span> {selectedStudent.name}</p>
                  <p className="mt-2.5"><span className="text-slate-400">Admission No:</span> {selectedStudent.admissionNo}</p>
                </div>
                <div>
                  <p><span className="text-slate-400">Class Section:</span> {selectedStudent.grade}-{selectedStudent.section}</p>
                  <p className="mt-2.5"><span className="text-slate-400">Roll Number:</span> {selectedStudent.rollNo}</p>
                </div>
              </div>

              {/* Marksheet table */}
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-450 font-bold bg-slate-50 dark:bg-slate-900">
                    <th className="px-4 py-3">Subject Code</th>
                    <th className="px-4 py-3">Subject Name</th>
                    <th className="px-4 py-3 text-center">Marks Obtained</th>
                    <th className="px-4 py-3 text-center">Max Marks</th>
                    <th className="px-4 py-3 text-center font-bold text-school-blue">Letter Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-850 font-medium">
                  {[
                    { code: 'MTH-10', name: 'Advanced Calculus', score: selectedStudent.academicPerformance, max: 100, gr: 'A' },
                    { code: 'PHY-10', name: 'General Physics', score: Math.max(40, selectedStudent.academicPerformance - 4), max: 100, gr: 'A-' },
                    { code: 'ENG-10', name: 'English Literature', score: Math.min(98, selectedStudent.academicPerformance + 3), max: 100, gr: 'A+' }
                  ].map((row) => (
                    <tr key={row.code}>
                      <td className="px-4 py-3 text-slate-450 font-semibold">{row.code}</td>
                      <td className="px-4 py-3 font-bold">{row.name}</td>
                      <td className="px-4 py-3 text-center font-bold">{row.score}</td>
                      <td className="px-4 py-3 text-center">{row.max}</td>
                      <td className="px-4 py-3 text-center font-bold text-school-blue">{row.gr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Result footer summary */}
              <div className="pt-4 border-t border-slate-150 dark:border-slate-800 flex justify-between items-center text-xs font-bold">
                <div>
                  <span>Grand Total score: {selectedStudent.academicPerformance}% average</span>
                </div>
                <div>
                  <span className="px-3 py-1 bg-school-greenLight text-school-green rounded-lg">Result Status: PASSED</span>
                </div>
              </div>

              {/* Holographic Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] dark:opacity-[0.02] pointer-events-none z-0">
                <Award className="h-64 w-64" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => alert('[Demo Mode] Triggering browser print dialog...')} leftIcon={<Printer className="h-4 w-4" />}>
                Print Report Card
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsReportOpen(false)}>
                Dismiss
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
