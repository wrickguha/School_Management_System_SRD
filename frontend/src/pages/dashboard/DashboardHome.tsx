import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Users, DollarSign, Activity, AlertCircle,
  FileSpreadsheet, ArrowUpRight, TrendingUp, Calendar, Megaphone,
  BookOpen, CheckCircle, CreditCard
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { studentService, teacherService, financeService, announcementService, activityService } from '../../services/services';
import { useAuth } from '../../store/AuthContext';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function DashboardHome() {
  const { role } = useAuth();
  const queryClient = useQueryClient();

  // Queries
  const { data: students, isLoading: loadingStudents } = useQuery({ queryKey: ['students'], queryFn: studentService.getAll });
  const { data: teachers, isLoading: loadingTeachers } = useQuery({ queryKey: ['teachers'], queryFn: teacherService.getAll });
  const { data: transactions, isLoading: loadingFinance } = useQuery({ queryKey: ['transactions'], queryFn: financeService.getTransactions });
  const { data: announcements } = useQuery({ queryKey: ['announcements'], queryFn: announcementService.getAll });
  const { data: activities } = useQuery({ queryKey: ['activities'], queryFn: activityService.getAll });

  // Parent specific states
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handlePayCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutSubmitting(true);
    setTimeout(() => {
      setCheckoutSubmitting(false);
      setCheckoutSuccess(true);
      setTimeout(() => {
        setCheckoutSuccess(false);
        setIsPayModalOpen(false);
        // Mutate/reset pending dues locally for demo
        queryClient.invalidateQueries({ queryKey: ['students'] });
      }, 1500);
    }, 1500);
  };

  // ----------------------------------------------------
  // VIEW A: ADMIN PORTAL
  // ----------------------------------------------------
  if (role === 'Admin') {
    const totalStudents = students?.length || 0;
    const totalTeachers = teachers?.length || 0;
    const totalRevenue = transactions?.reduce((acc, t) => acc + t.amount, 0) || 0;
    const attendanceRate = 91.5;
    const pendingPayments = students?.reduce((acc, s) => acc + s.pendingFees, 0) || 0;

    const revenueData = [
      { name: 'Jan', Revenue: 45000, Collection: 40000 },
      { name: 'Feb', Revenue: 55000, Collection: 52000 },
      { name: 'Mar', Revenue: 60000, Collection: 58000 },
      { name: 'Apr', Revenue: 75000, Collection: 70000 },
      { name: 'May', Revenue: 95000, Collection: 92000 },
      { name: 'Jun', Revenue: totalRevenue, Collection: totalRevenue * 0.95 }
    ];

    const studentGrowthData = [
      { name: '2021', Students: 1200 },
      { name: '2022', Students: 1550 },
      { name: '2023', Students: 1900 },
      { name: '2024', Students: 2150 },
      { name: '2025', Students: 2380 },
      { name: '2026', Students: 2480 }
    ];

    const kpis = [
      { title: 'Total Students', value: loadingStudents ? '...' : totalStudents + 2475, change: '+12% from last term', icon: Users, color: 'text-school-blue bg-school-blueLight dark:bg-school-blue/10' },
      { title: 'Total Teachers', value: loadingTeachers ? '...' : totalTeachers + 74, change: 'Stable', icon: Users, color: 'text-school-maroon bg-school-maroonLight dark:bg-school-maroon/10' },
      { title: 'Total Revenue', value: loadingFinance ? '...' : `$${(totalRevenue + 412000).toLocaleString()}`, change: '+8% collections rate', icon: DollarSign, color: 'text-school-green bg-school-greenLight dark:bg-school-green/10' },
      { title: 'Attendance Rate', value: `${attendanceRate}%`, change: '+1.5% average', icon: Activity, color: 'text-school-blue bg-school-blueLight dark:bg-school-blue/10' },
      { title: 'Defaulter Fees', value: loadingStudents ? '...' : `$${pendingPayments.toLocaleString()}`, change: '4 students pending', icon: AlertCircle, color: 'text-red-500 bg-red-50 dark:bg-red-950/20' }
    ];

    return (
      <div className="space-y-8 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Executive Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Real-time operations monitor for St. Xavier Academy.
            </p>
          </div>
          <Button variant="outline" size="sm" leftIcon={<FileSpreadsheet className="h-4 w-4" />}>
            Generate Monthly Report
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.title} className="p-5 flex flex-col justify-between h-36 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{kpi.title}</span>
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${kpi.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="block text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">{kpi.value}</span>
                  <span className="text-[10px] font-semibold text-slate-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-school-green" />
                    {kpi.change}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
            <CardHeader className="mb-6">
              <div>
                <CardTitle>Enrollment Trends</CardTitle>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Student Growth Profile</span>
              </div>
              <span className="h-7 w-7 rounded-lg bg-school-blue/10 flex items-center justify-center text-school-blue">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </CardHeader>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={studentGrowthData}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0A4D8C" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0A4D8C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="Students" stroke="#0A4D8C" strokeWidth={2.5} fillOpacity={1} fill="url(#colorStudents)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
            <CardHeader className="mb-6">
              <div>
                <CardTitle>Financial Analysis</CardTitle>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Revenue Stream vs Cash Collection</span>
              </div>
              <span className="h-7 w-7 rounded-lg bg-school-green/10 flex items-center justify-center text-school-green">
                <DollarSign className="h-4 w-4" />
              </span>
            </CardHeader>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar dataKey="Revenue" fill="#0A4D8C" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="Collection" fill="#138D75" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <CardHeader className="mb-4">
                <CardTitle className="flex items-center gap-2 text-md">
                  <Activity className="h-5 w-5 text-school-blue" />
                  <span>Recent Activity Feed</span>
                </CardTitle>
              </CardHeader>
              <div className="space-y-4">
                {activities?.slice(0, 4).map((act) => (
                  <div key={act.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-105 dark:border-slate-850">
                    <span className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 bg-school-${act.type === 'success' ? 'green' : act.type === 'warning' ? 'maroon' : 'blue'}`} />
                    <div>
                      <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed">
                        <span className="font-bold text-slate-950 dark:text-white">{act.user}</span> ({act.role}): {act.action}
                      </p>
                      <span className="text-[9px] font-semibold text-slate-400 block mt-1">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-6">View Operations Ledger</Button>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <CardHeader className="mb-4">
                <CardTitle className="flex items-center gap-2 text-md">
                  <Megaphone className="h-5 w-5 text-school-maroon" />
                  <span>Active Announcements</span>
                </CardTitle>
              </CardHeader>
              <div className="space-y-4">
                {announcements?.slice(0, 3).map((ann) => (
                  <div key={ann.id} className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{ann.title}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase">{ann.postedBy}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed truncate">{ann.content}</p>
                    <span className="text-[9px] font-bold text-slate-400 block">{ann.date}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-6">Launch Broadcast Modal</Button>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <CardHeader className="mb-4">
                <CardTitle className="flex items-center gap-2 text-md">
                  <Calendar className="h-5 w-5 text-school-green" />
                  <span>Upcoming Calendar</span>
                </CardTitle>
              </CardHeader>
              <div className="space-y-4">
                {[
                  { id: '1', title: 'Grade 10 Calculus Exam', date: 'June 15, 2026', time: '09:00 AM' },
                  { id: '2', title: 'PTM Slot Discussion', date: 'June 12, 2026', time: '02:00 PM' }
                ].map((evt) => (
                  <div key={evt.id} className="flex gap-4 items-center">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400">June</span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">{evt.date.split(' ')[1].replace(',', '')}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{evt.title}</h4>
                      <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 block mt-1">{evt.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-6">Open Global Scheduler</Button>
          </Card>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW B: TEACHER PORTAL
  // ----------------------------------------------------
  if (role === 'Teacher') {
    const classPerfData = [
      { name: 'UT-I', Physics: 78, Math: 82 },
      { name: 'UT-II', Physics: 84, Math: 85 },
      { name: 'Term-I', Physics: 86, Math: 88 }
    ];

    return (
      <div className="space-y-8 text-left">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Teacher Command Portal</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Welcome back, Dr. Sunita Rao. You have 2 classes scheduled today.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">My Class Wards</span>
            <span className="block text-2xl font-extrabold text-school-blue mt-2">Grade 10-A</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">28 Registered pupils</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Attendance</span>
            <span className="block text-2xl font-extrabold text-school-green mt-2">98.2%</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">Present this month</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Graded Submissions</span>
            <span className="block text-2xl font-extrabold text-school-maroon mt-2">4 Pending</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">Calculus Homework UT-I</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Next Lecture</span>
            <span className="block text-sm font-extrabold text-slate-900 dark:text-white mt-3">10:45 AM - Physics Lab</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">Block-B Room 304</span>
          </Card>
        </div>

        {/* Chart & Quick Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Performance chart */}
          <Card className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
            <CardHeader className="mb-4">
              <CardTitle>Class GPA Progress Curve</CardTitle>
            </CardHeader>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={classPerfData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} domain={[70, 100]} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="Physics" stroke="#0A4D8C" fill="#0A4D8C" fillOpacity={0.05} strokeWidth={2} />
                  <Area type="monotone" dataKey="Math" stroke="#138D75" fill="#138D75" fillOpacity={0.05} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Quick links shortcut */}
          <Card className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between">
            <CardHeader className="mb-4">
              <CardTitle>Teacher Dashboard Actions</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold block">Submit Homework assignment</span>
                  <span className="text-[10px] text-slate-400">Post details to student portals</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => alert('[Demo Mode] Launching Homework post modal...')}>Upload</Button>
              </div>
              <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold block">Submit Terminal Marks</span>
                  <span className="text-[10px] text-slate-400">Update exam card sheets</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => alert('[Demo Mode] Redirecting to Marks Upload ledger...')}>Update</Button>
              </div>
              <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold block">Register Absent Wards</span>
                  <span className="text-[10px] text-slate-400">Call today's attendance sheet</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => alert('[Demo Mode] Launching Attendance daily checklist...')}>Call Sheet</Button>
              </div>
            </div>
            <div className="h-6" />
          </Card>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW C: PARENT PORTAL
  // ----------------------------------------------------
  if (role === 'Parent') {
    // Read local Aarav Sharma student details
    const aarav = students?.find(s => s.name === 'Aarav Sharma') || { pendingFees: 0, attendanceRate: 94.5, academicPerformance: 88.5 };

    return (
      <div className="space-y-8 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Parent Portal</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Active child profile: Aarav Sharma (Grade 10-A).
            </p>
          </div>
          {aarav.pendingFees > 0 && (
            <Button variant="accent" size="sm" onClick={() => setIsPayModalOpen(true)} leftIcon={<CreditCard className="h-4 w-4" />}>
              Pay Outstanding Dues (${aarav.pendingFees.toLocaleString()})
            </Button>
          )}
        </div>

        {/* Child statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Term-I Average Score</span>
            <span className="block text-3xl font-extrabold text-school-green mt-2">{aarav.academicPerformance}%</span>
            <span className="text-[9px] font-bold text-slate-400 block mt-1">A Letter Grade average</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Class Attendance</span>
            <span className="block text-3xl font-extrabold text-school-blue mt-2">{aarav.attendanceRate}%</span>
            <span className="text-[9px] font-bold text-slate-400 block mt-1">2 Absences registered</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Outstanding Fees</span>
            <span className={`block text-3xl font-extrabold mt-2 ${aarav.pendingFees > 0 ? 'text-school-maroon' : 'text-school-green'}`}>
              ${aarav.pendingFees.toLocaleString()}
            </span>
            <span className="text-[9px] font-bold text-slate-400 block mt-1">
              {aarav.pendingFees > 0 ? 'Billing Term II outstanding' : 'All clear for Term II'}
            </span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Checked Out Books</span>
            <span className="block text-3xl font-extrabold text-slate-900 dark:text-white mt-2">1 Copy</span>
            <span className="text-[9px] font-bold text-slate-400 block mt-1">Concepts of Physics Vol 1</span>
          </Card>
        </div>

        {/* Homework list and school notifications timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Homework list */}
          <Card className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
            <CardHeader className="mb-4">
              <CardTitle className="text-md flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-school-blue" />
                <span>Homework & Assignments</span>
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {[
                { id: '1', title: 'Calculus Derivatives Problems', subject: 'Math', date: 'Due June 08', status: 'Pending' },
                { id: '2', title: 'Kinematics lab writeup report', subject: 'Physics', date: 'Due June 06', status: 'Submitted' }
              ].map((hw) => (
                <div key={hw.id} className="p-3.5 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold block">{hw.title}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{hw.subject} • {hw.date}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    hw.status === 'Submitted' ? 'bg-school-greenLight text-school-green' : 'bg-yellow-50 text-yellow-650'
                  }`}>
                    {hw.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Announcements feed for parent */}
          <Card className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
            <CardHeader className="mb-4">
              <CardTitle className="text-md flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-school-maroon" />
                <span>Parent Advisories & Alerts</span>
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {announcements?.filter(a => a.target === 'All' || a.target === 'Parents').map(ann => (
                <div key={ann.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">{ann.title}</span>
                  <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Payment Checkout Modal */}
        <Modal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)} title="Secure Checkout Gateway">
          {checkoutSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-14 w-14 bg-school-green/10 rounded-full flex items-center justify-center text-school-green mb-4">
                <CheckCircle className="h-8 w-8 animate-bounce" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Transaction Approved!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Outstanding balance updated. Receipt issued in billing archives.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePayCheckout} className="space-y-4 text-left">
              <p className="text-xs text-slate-500">
                Authorized SUBHRAEDU payments are secured with AES-256 bank encryption.
              </p>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 flex justify-between items-center text-xs font-bold">
                <div>
                  <span className="text-slate-400">Ward billing:</span>
                  <p className="mt-0.5 text-slate-900 dark:text-white">Aarav Sharma (Grade 10-A)</p>
                </div>
                <div>
                  <span className="text-slate-400">Amount Due:</span>
                  <p className="mt-0.5 text-school-maroon text-sm">${aarav.pendingFees.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-widest block">Card Holder Name</label>
                <input
                  type="text"
                  required
                  placeholder="Ramesh Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-widest block">Credit Card Number</label>
                <input
                  type="text"
                  required
                  placeholder="4111 2222 3333 4444"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-widest block">Expiration</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-widest block">CVV/Access Pin</label>
                  <input
                    type="password"
                    required
                    placeholder="•••"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsPayModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary" isLoading={checkoutSubmitting}>Authorize payment</Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    );
  }

  return null;
}
