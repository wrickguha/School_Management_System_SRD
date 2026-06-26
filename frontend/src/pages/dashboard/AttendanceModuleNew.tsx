import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Check, X, Clock, Calendar as CalendarIcon, BarChart2, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../store/AuthContext';

interface AttendanceRecord {
  id: number;
  student_id: number;
  student_name: string;
  date: string;
  grade: string;
  section: string;
  status: 'Present' | 'Absent' | 'Late';
  attendance_type: 'class' | 'routine';
  teacher_id?: number;
}

const AttendanceModule: React.FC = () => {
  const { role, user } = useAuth();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState<'register' | 'insights' | 'history'>('register');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [attendanceType, setAttendanceType] = useState<'class' | 'routine'>('class');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states for history tab
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch attendance data
  const { data: attendanceData, isLoading: loadingAttendance } = useQuery({
    queryKey: ['attendance', { date: attendanceDate, grade: selectedClass, section: selectedSection }],
    queryFn: async () => {
      const params = new URLSearchParams({
        date_from: attendanceDate,
        date_to: attendanceDate,
        ...(selectedClass && { grade: selectedClass }),
        ...(selectedSection && { section: selectedSection }),
        attendance_type: attendanceType,
      });
      const response = await fetch(`/api/attendance?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch attendance');
      return response.json();
    },
    enabled: !!selectedClass && !!selectedSection,
  });

  // Fetch teacher's classes
  const { data: teacherClasses } = useQuery({
    queryKey: ['teacher-classes'],
    queryFn: async () => {
      if (!['teacher', 'faculty'].includes(role)) return [];
      const response = await fetch('/api/attendance/teacher-classes', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch classes');
      return response.json();
    },
    enabled: ['teacher', 'faculty'].includes(role),
  });

  // Fetch attendance history with filters
  const { data: attendanceHistory } = useQuery({
    queryKey: ['attendance-history', { dateFrom, dateTo, statusFilter }],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(dateFrom && { date_from: dateFrom }),
        ...(dateTo && { date_to: dateTo }),
        ...(statusFilter && { status: statusFilter }),
      });
      const response = await fetch(`/api/attendance?${params}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch history');
      return response.json();
    },
  });

  // Submit bulk attendance
  const submitBulkMutation = useMutation({
    mutationFn: async (sheet: Record<string, 'Present' | 'Absent' | 'Late'>) => {
      const response = await fetch('/api/attendance/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: attendanceDate,
          grade: selectedClass,
          section: selectedSection,
          attendance_type: attendanceType,
          sheet,
        }),
      });
      if (!response.ok) throw new Error('Failed to submit attendance');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      alert('Attendance submitted successfully!');
    },
  });

  const [attendanceSheet, setAttendanceSheet] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceSheet(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = () => {
    if (Object.keys(attendanceSheet).length === 0) {
      alert('Please select a class and section first');
      return;
    }
    submitBulkMutation.mutate(attendanceSheet);
  };

  const stats = {
    present: Object.values(attendanceSheet).filter(v => v === 'Present').length,
    absent: Object.values(attendanceSheet).filter(v => v === 'Absent').length,
    late: Object.values(attendanceSheet).filter(v => v === 'Late').length,
    total: Object.keys(attendanceSheet).length,
  };

  const presentRate = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8 text-left">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Attendance Center</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Manage daily attendance, view insights, and track attendance history.
            {role === 'Teacher' || role === 'Faculty' ? ' (Class & Routine Teacher Mode)' : ''}
          </p>
        </div>
        
        {/* Toggle tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'register' ? 'bg-white dark:bg-slate-900 shadow text-school-blue' : 'text-slate-550'
            }`}
          >
            Daily Register
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'history' ? 'bg-white dark:bg-slate-900 shadow text-school-blue' : 'text-slate-550'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'insights' ? 'bg-white dark:bg-slate-900 shadow text-school-blue' : 'text-slate-550'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-450 uppercase">Present Rate</span>
          <span className="block text-2xl font-extrabold text-school-green mt-1">{presentRate}%</span>
        </Card>
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-450 uppercase">Absences</span>
          <span className="block text-2xl font-extrabold text-school-maroon mt-1">{stats.absent}</span>
        </Card>
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-450 uppercase">Late Arrivals</span>
          <span className="block text-2xl font-extrabold text-school-blue mt-1">{stats.late}</span>
        </Card>
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-450 uppercase">Total</span>
          <span className="block text-2xl font-extrabold mt-1">{stats.total}</span>
        </Card>
      </div>

      {/* Tab 1: Daily Register */}
      {activeTab === 'register' && (
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Date</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold focus:outline-none dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Grade</label>
                <input
                  type="text"
                  placeholder="e.g., 10"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold focus:outline-none dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Section</label>
                <input
                  type="text"
                  placeholder="e.g., A"
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold focus:outline-none dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Type</label>
                <select
                  value={attendanceType}
                  onChange={(e) => setAttendanceType(e.target.value as 'class' | 'routine')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold focus:outline-none dark:text-white"
                >
                  <option value="class">Class Attendance</option>
                  <option value="routine">Routine Attendance</option>
                </select>
              </div>
            </div>
            <Button variant="primary" size="sm" onClick={handleSaveAttendance} isLoading={submitBulkMutation.isPending}>
              Publish Register
            </Button>
          </CardHeader>

          {loadingAttendance ? (
            <div className="text-center py-10">Loading students...</div>
          ) : attendanceData?.data?.length === 0 ? (
            <div className="text-center py-10 text-slate-500">No students found for this class. Please select a valid grade and section.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-450 dark:text-slate-500 font-semibold bg-slate-50/50 dark:bg-slate-850/20">
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Roll No</th>
                    <th className="px-6 py-4 text-center">Mark Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData?.data?.map((record: AttendanceRecord) => (
                    <tr key={record.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/40">
                      <td className="px-6 py-4 font-bold">{record.student_name}</td>
                      <td className="px-6 py-4 text-slate-500">{record.student_id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(String(record.student_id), 'Present')}
                            className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                              attendanceSheet[record.student_id] === 'Present'
                                ? 'bg-green-500 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <Check className="h-3 w-3" /> P
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(String(record.student_id), 'Absent')}
                            className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                              attendanceSheet[record.student_id] === 'Absent'
                                ? 'bg-red-500 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <X className="h-3 w-3" /> A
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(String(record.student_id), 'Late')}
                            className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                              attendanceSheet[record.student_id] === 'Late'
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <Clock className="h-3 w-3" /> L
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Tab 2: History with Filters */}
      {activeTab === 'history' && (
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
          <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-bold text-school-blue hover:text-school-blue/80"
            >
              <Filter className="h-4 w-4" /> Filters
            </button>
            
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">From Date</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold focus:outline-none dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">To Date</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold focus:outline-none dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold focus:outline-none dark:text-white"
                  >
                    <option value="">All</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-450 dark:text-slate-500 font-semibold bg-slate-50/50 dark:bg-slate-850/20">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Grade/Section</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Type</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory?.data?.map((record: AttendanceRecord) => (
                  <tr key={record.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/40">
                    <td className="px-6 py-4 text-slate-500">{record.date}</td>
                    <td className="px-6 py-4 font-bold">{record.student_name}</td>
                    <td className="px-6 py-4 text-slate-500">{record.grade} {record.section}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        record.status === 'Present' ? 'bg-green-100 text-green-700' :
                        record.status === 'Absent' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 capitalize">{record.attendance_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 3: Analytics */}
      {activeTab === 'insights' && (
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
          <CardHeader className="mb-6">
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-school-blue" />
              <span>Attendance Trends</span>
            </CardTitle>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { month: 'Jan', attendance: 94 },
                { month: 'Feb', attendance: 95 },
                { month: 'Mar', attendance: 93 },
                { month: 'Apr', attendance: 96 },
                { month: 'May', attendance: 97 },
                { month: 'Jun', attendance: 96 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[90, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#0A4D8C" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AttendanceModule;
