import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { studentService } from '../../services/services';
import { Check, X, Clock, Calendar as CalendarIcon, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AttendanceModule() {
  const [activeTab, setActiveTab] = useState<'register' | 'insights'>('register');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('Grade 10-A');
  
  // Queries
  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAll
  });

  // State for daily attendance entry
  const [attendanceSheet, setAttendanceSheet] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize sheet when students load
  React.useEffect(() => {
    if (students) {
      const initial: Record<string, 'Present' | 'Absent' | 'Late'> = {};
      students.forEach((s) => {
        initial[s.id] = 'Present'; // default value
      });
      setAttendanceSheet(initial);
    }
  }, [students]);

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceSheet((prev) => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      alert('[Demo Mode] Attendance register saved successfully!');
    }, 1500);
  };

  // Mock calendar metrics for insights
  const monthlyTrendsData = [
    { name: 'Jan', Attendance: 94.2 },
    { name: 'Feb', Attendance: 95.8 },
    { name: 'Mar', Attendance: 93.5 },
    { name: 'Apr', Attendance: 96.0 },
    { name: 'May', Attendance: 97.2 },
    { name: 'Jun', Attendance: 96.8 }
  ];

  // Calendar dates mock
  const calendarDays = Array.from({ length: 30 }).map((_, idx) => {
    const day = idx + 1;
    let status: 'present' | 'absent' | 'late' | 'none' = 'present';
    if (day === 7 || day === 14 || day === 21 || day === 28) status = 'none'; // weekends
    else if (day === 5 || day === 18) status = 'absent';
    else if (day === 12) status = 'late';
    return { day, status };
  });

  return (
    <div className="space-y-8 text-left">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Attendance Center</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Log daily registers and view evolutionary attendance charts.
          </p>
        </div>
        
        {/* Toggle tabs */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'register' ? 'bg-white dark:bg-slate-900 shadow text-school-blue' : 'text-slate-550'
            }`}
          >
            Daily Register
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'insights' ? 'bg-white dark:bg-slate-900 shadow text-school-blue' : 'text-slate-550'
            }`}
          >
            Insights & Analytics
          </button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850">
          <span className="text-[10px] font-bold text-slate-450 uppercase">Present Rate</span>
          <span className="block text-2xl font-extrabold text-school-green mt-1">94.6%</span>
        </Card>
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850">
          <span className="text-[10px] font-bold text-slate-450 uppercase">Absences Today</span>
          <span className="block text-2xl font-extrabold text-school-maroon mt-1">4 Students</span>
        </Card>
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850">
          <span className="text-[10px] font-bold text-slate-450 uppercase">Late Arrivals</span>
          <span className="block text-2xl font-extrabold text-school-blue mt-1">2 Students</span>
        </Card>
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850">
          <span className="text-[10px] font-bold text-slate-450 uppercase">RFID Synced</span>
          <span className="block text-xs font-extrabold text-school-green mt-2 flex items-center gap-1"><Check className="h-4 w-4" /> Smart gates Active</span>
        </Card>
      </div>

      {/* Tab 1: Daily Register */}
      {activeTab === 'register' && (
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Registry Date</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold focus:outline-none dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Select Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold focus:outline-none dark:text-white"
                >
                  <option value="Grade 10-A">Grade 10-A</option>
                  <option value="Grade 10-B">Grade 10-B</option>
                  <option value="Grade 9-A">Grade 9-A</option>
                </select>
              </div>
            </div>
            <Button variant="primary" size="sm" onClick={handleSaveAttendance} isLoading={saveSuccess}>
              Publish Register
            </Button>
          </CardHeader>

          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-8 bg-slate-200 rounded" />
              <div className="h-8 bg-slate-200 rounded" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-450 dark:text-slate-500 font-semibold bg-slate-50/50 dark:bg-slate-850/20">
                    <th className="px-6 py-4">Roll No</th>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Average Attendance</th>
                    <th className="px-6 py-4 text-center">Status Selection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-350">
                  {students?.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/10 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-450">{s.rollNo}</td>
                      <td className="px-6 py-4 font-bold text-slate-850 dark:text-slate-200">{s.name}</td>
                      <td className="px-6 py-4 font-semibold text-school-blue">{s.attendanceRate}%</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.id, 'Present')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                              attendanceSheet[s.id] === 'Present'
                                ? 'bg-school-green text-white shadow-sm shadow-school-green/20'
                                : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Present</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.id, 'Absent')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                              attendanceSheet[s.id] === 'Absent'
                                ? 'bg-school-maroon text-white shadow-sm shadow-school-maroon/20'
                                : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Absent</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.id, 'Late')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                              attendanceSheet[s.id] === 'Late'
                                ? 'bg-school-blue text-white shadow-sm shadow-school-blue/20'
                                : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            <Clock className="h-3.5 w-3.5" />
                            <span>Late</span>
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

      {/* Tab 2: Insights */}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Chart */}
          <Card className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
            <CardHeader className="mb-6">
              <CardTitle className="flex items-center gap-2 text-md">
                <BarChart2 className="h-5 w-5 text-school-blue" />
                <span>Monthly Presence Curve</span>
              </CardTitle>
            </CardHeader>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[90, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="Attendance" stroke="#0A4D8C" strokeWidth={2.5} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Student calendar sheet */}
          <Card className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
            <CardHeader className="mb-6">
              <CardTitle className="flex items-center gap-2 text-md">
                <CalendarIcon className="h-5 w-5 text-school-green" />
                <span>Ward Monthly Calendar</span>
              </CardTitle>
            </CardHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-450 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((dayObj) => (
                  <div
                    key={dayObj.day}
                    className={`h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      dayObj.status === 'present'
                        ? 'bg-school-greenLight text-school-green'
                        : dayObj.status === 'absent'
                        ? 'bg-red-50 dark:bg-red-950/20 text-red-600'
                        : dayObj.status === 'late'
                        ? 'bg-school-blueLight text-school-blue'
                        : 'bg-slate-100 dark:bg-slate-850 text-slate-400'
                    }`}
                  >
                    {dayObj.day}
                  </div>
                ))}
              </div>

              {/* Legends */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-450 uppercase">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-school-green shrink-0" />
                  <span>Present</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-school-maroon shrink-0" />
                  <span>Absent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-school-blue shrink-0" />
                  <span>Late</span>
                </div>
              </div>
            </div>
          </Card>

        </div>
      )}

    </div>
  );
}
