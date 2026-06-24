import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Users, IndianRupee, Activity, AlertCircle,
  FileSpreadsheet, ArrowUpRight, TrendingUp, Calendar, Megaphone,
  BookOpen, CheckCircle, CreditCard, Building, Clock, Server
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { studentService, financeService, announcementService, activityService, demoService, dashboardService, libraryService } from '../../services/services';
import { useAuth } from '../../store/AuthContext';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function DashboardHome() {
  const { role, user } = useAuth();
  const queryClient = useQueryClient();

  // Queries
  const { data: students } = useQuery({ queryKey: ['students'], queryFn: studentService.getAll });
  const { data: transactions } = useQuery({ queryKey: ['transactions'], queryFn: financeService.getTransactions });
  const { data: announcements } = useQuery({ queryKey: ['announcements'], queryFn: announcementService.getAll });
  const { data: activities } = useQuery({ queryKey: ['activities'], queryFn: activityService.getAll });
  const { data: demoRequests, refetch: refetchDemos } = useQuery({
    queryKey: ['demoRequests'],
    queryFn: demoService.getAll,
    enabled: role === 'Super Admin'
  });
  const { data: superStats, isLoading: loadingSuperStats } = useQuery({
    queryKey: ['superStats'],
    queryFn: dashboardService.getSuperStats,
    enabled: role === 'Super Admin'
  });
  const { data: schoolStats, isLoading: loadingSchoolStats } = useQuery({
    queryKey: ['schoolStats'],
    queryFn: dashboardService.getSchoolStats,
    enabled: role === 'School Admin' || role === 'Accountant'
  });
  const { data: issuances } = useQuery({
    queryKey: ['issuances'],
    queryFn: libraryService.getIssuances,
    enabled: role === 'Librarian'
  });

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
  // ----------------------------------------------------
  // VIEW S: SUPER ADMIN PORTAL (SaaS Platform Dashboard)
  // ----------------------------------------------------
  if (role === 'Super Admin') {
    // SaaS KPIs
    const saasKpis = [
      { title: 'Total Schools', value: loadingSuperStats ? '...' : (superStats?.totalSchools || 0).toString(), change: (superStats?.totalSchools || 0) > 0 ? '+14 this month' : 'No schools registered', icon: Building, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20' },
      { title: 'Total Students', value: loadingSuperStats ? '...' : (superStats?.totalStudents || 0).toLocaleString(), change: (superStats?.totalStudents || 0) > 0 ? '+8.2% YoY' : '0% change', icon: Users, color: 'text-school-blue bg-school-blueLight dark:bg-school-blue/10' },
      { title: 'Total Teachers', value: loadingSuperStats ? '...' : (superStats?.totalTeachers || 0).toLocaleString(), change: (superStats?.totalTeachers || 0) > 0 ? '+5.1% YoY' : 'Stable', icon: Users, color: 'text-school-maroon bg-school-maroonLight dark:bg-school-maroon/10' },
      { title: 'Total Parents', value: loadingSuperStats ? '...' : (superStats?.totalParents || 0).toLocaleString(), change: (superStats?.totalParents || 0) > 0 ? '+7.8% YoY' : 'Stable', icon: Users, color: 'text-school-green bg-school-greenLight dark:bg-school-green/10' },
      { title: 'Total Revenue', value: loadingSuperStats ? '...' : `₹${(superStats?.totalRevenue || 0).toLocaleString()}`, change: (superStats?.totalRevenue || 0) > 0 ? '+15.4% YoY' : '0% change', icon: IndianRupee, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20' },
      { title: 'Active Subscriptions', value: loadingSuperStats ? '...' : (superStats?.activeSubscriptions || 0).toString(), change: (superStats?.activeSubscriptions || 0) > 0 ? '93.5% renewal rate' : 'No active subscriptions', icon: CheckCircle, color: 'text-teal-650 bg-teal-50 dark:bg-teal-950/20' },
      { title: 'Expired Subscriptions', value: loadingSuperStats ? '...' : (superStats?.expiredSubscriptions || 0).toString(), change: (superStats?.expiredSubscriptions || 0) > 0 ? '-4% from last quarter' : 'No expired subscriptions', icon: AlertCircle, color: 'text-red-500 bg-red-50 dark:bg-red-950/20' },
      { title: 'Pending Demo Requests', value: loadingSuperStats ? '...' : (superStats?.pendingDemoRequests || 0).toString(), change: (superStats?.pendingDemoRequests || 0) > 0 ? '8 scheduled today' : 'No pending requests', icon: Clock, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
      { title: 'Active Users Today', value: loadingSuperStats ? '...' : (superStats?.activeUsersToday || 0).toLocaleString(), change: (superStats?.activeUsersToday || 0) > 0 ? 'Peak concurrent: 3.2k' : '0 concurrent', icon: TrendingUp, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/20' },
      { title: 'System Health', value: loadingSuperStats ? '...' : (superStats?.systemHealth || '0%'), change: 'Latency: 220ms • Online', icon: Server, color: 'text-violet-650 bg-violet-50 dark:bg-violet-950/20' },
    ];

    // Data for Charts (sourced dynamically from backend superStats query)
    const schoolGrowthData = superStats?.schoolGrowthData || [];
    const monthlyRevenueData = superStats?.monthlyRevenueData || [];
    const userGrowthData = superStats?.userGrowthData || [];
    const demoConversionData = superStats?.demoConversionData || [];
    const subscriptionTierData = superStats?.subscriptionTierData || [];

    const handleApproveDemo = async (id: number) => {
      try {
        await demoService.updateStatus(id, { status: 'converted', notes: 'Converted to client' });
        refetchDemos();
      } catch (err) {
        console.error(err);
      }
    };

    const handleAssignRep = async (id: number) => {
      try {
        await demoService.updateStatus(id, { status: 'contacted', notes: 'Assigned to Sarah Connor' });
        refetchDemos();
      } catch (err) {
        console.error(err);
      }
    };

    const getStatusLabel = (status: string) => {
      if (status === 'new') return 'New Request';
      if (status === 'contacted') return 'Pending Approval';
      if (status === 'converted') return 'Approved';
      return 'Rejected';
    };

    return (
      <div className="space-y-8 text-left">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">SaaS Platform Control Panel</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Unified multi-tenant subscription analytics, platform statistics, and infrastructure monitor.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => alert('[Demo Mode] Opening tenant configuration panel...')}>
              Configure Settings
            </Button>
            <Button variant="primary" size="sm" onClick={() => alert('[Demo Mode] Registering new tenant school...')}>
              Register New School
            </Button>
          </div>
        </div>

        {/* 10 KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {saasKpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.title} className="p-5 flex flex-col justify-between h-36 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:translate-y-[-2px] hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-normal">{kpi.title}</span>
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${kpi.color}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="block text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">{kpi.value}</span>
                  <span className="text-[10px] font-bold text-slate-450 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-school-green" />
                    {kpi.change}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Row 1 Charts: School Growth & Monthly Revenue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
            <CardHeader className="mb-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle>School Growth Trends</CardTitle>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Platform Multi-Tenant Onboarding</span>
              </div>
              <span className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-650">
                <Building className="h-4 w-4" />
              </span>
            </CardHeader>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={schoolGrowthData}>
                  <defs>
                    <linearGradient id="colorSchoolsSaas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="Schools" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSchoolsSaas)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
            <CardHeader className="mb-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Platform Monthly Revenue</CardTitle>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">SaaS Subscriptions vs Add-on Packages</span>
              </div>
              <span className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600">
                <IndianRupee className="h-4 w-4" />
              </span>
            </CardHeader>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar dataKey="Subscriptions" name="Core SaaS" fill="#0A4D8C" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="Addons" name="SMS/Add-ons" fill="#138D75" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Row 2 Charts: User Growth & Subscription Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
            <CardHeader className="mb-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Traffic Growth</CardTitle>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Monthly Active vs Daily Active Users</span>
              </div>
              <span className="h-7 w-7 rounded-lg bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center text-sky-500">
                <TrendingUp className="h-4 w-4" />
              </span>
            </CardHeader>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="colorMau" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0A4D8C" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#0A4D8C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" dataKey="MAU" name="Monthly Active (MAU)" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorMau)" />
                  <Area type="monotone" dataKey="DAU" name="Daily Active (DAU)" stroke="#0A4D8C" strokeWidth={2} fillOpacity={1} fill="url(#colorDau)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
            <CardHeader className="mb-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Subscription Analytics</CardTitle>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Tenant Subscriptions Tier Distribution</span>
              </div>
              <span className="h-7 w-7 rounded-lg bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center text-violet-650">
                <CheckCircle className="h-4 w-4" />
              </span>
            </CardHeader>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={subscriptionTierData}>
                  <defs>
                    <linearGradient id="colorBasic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPro" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEnt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" stackId="1" dataKey="Basic" name="Basic Plan" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorBasic)" />
                  <Area type="monotone" stackId="1" dataKey="Pro" name="Pro Plan" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorPro)" />
                  <Area type="monotone" stackId="1" dataKey="Enterprise" name="Enterprise Plan" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorEnt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Row 3: Demo Conversion Rate & Interactive Demo Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
            <CardHeader className="mb-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Demo Conversion Rate</CardTitle>
                <span className="text-[10px] text-slate-405 text-slate-400 font-bold uppercase tracking-wider block mt-1">Requested vs Converted Demos</span>
              </div>
              <span className="h-7 w-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-500">
                <Clock className="h-4 w-4" />
              </span>
            </CardHeader>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demoConversionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar dataKey="Requested" name="Demos Requested" fill="#94A3B8" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="Converted" name="Converted Clients" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Pending Demo Requests Queue */}
          <Card className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <CardHeader className="mb-4">
                <CardTitle className="text-md flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-650" />
                  <span>Pending Demo Requests Queue</span>
                </CardTitle>
              </CardHeader>
              <div className="space-y-4">
                {(demoRequests || []).map((item) => (
                  <div key={item.id} className="p-3.5 border border-slate-150 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-extrabold block text-slate-900 dark:text-white">{item.schoolName}</span>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                        Contact: {item.contactName} • Email: {item.email} {item.phone ? `• Phone: ${item.phone}` : ''}
                      </span>
                      {item.notes && (
                        <span className="text-[10px] text-school-blue font-bold block mt-1">
                          Log: {item.notes}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        item.status === 'converted' 
                          ? 'bg-school-greenLight text-school-green' 
                          : item.status === 'new'
                          ? 'bg-blue-50 text-blue-650 dark:bg-blue-950/20 dark:text-blue-400'
                          : 'bg-amber-50 text-amber-650 dark:bg-amber-950/20 dark:text-amber-400'
                      }`}>
                        {getStatusLabel(item.status)}
                      </span>
                      {item.status === 'new' && (
                        <Button variant="outline" size="sm" onClick={() => handleAssignRep(item.id)}>
                          Assign Rep
                        </Button>
                      )}
                      {item.status === 'contacted' && (
                        <Button variant="accent" size="sm" onClick={() => handleApproveDemo(item.id)}>
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {(demoRequests || []).length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-400 font-bold">
                    No pending demo requests.
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full" onClick={() => alert('[Demo Mode] Redirecting to demo management book...')}>
                View All Historical Demos
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW A: SCHOOL ADMIN PORTAL (School-level Dashboard)
  // ----------------------------------------------------
  if (role === 'School Admin') {
    const revenueData = schoolStats?.revenueData || [];
    const studentGrowthData = schoolStats?.studentGrowthData || [];

    const kpis = [
      { title: 'Total Students', value: loadingSchoolStats ? '...' : (schoolStats?.totalStudents || 0).toString(), change: (schoolStats?.totalStudents || 0) > 0 ? '+12% from last term' : '0% change', icon: Users, color: 'text-school-blue bg-school-blueLight dark:bg-school-blue/10' },
      { title: 'Total Teachers', value: loadingSchoolStats ? '...' : (schoolStats?.totalTeachers || 0).toString(), change: 'Stable', icon: Users, color: 'text-school-maroon bg-school-maroonLight dark:bg-school-maroon/10' },
      { title: 'Total Revenue', value: loadingSchoolStats ? '...' : `₹${(schoolStats?.totalRevenue || 0).toLocaleString()}`, change: (schoolStats?.totalRevenue || 0) > 0 ? '+8% collections rate' : '0% collections rate', icon: IndianRupee, color: 'text-school-green bg-school-greenLight dark:bg-school-green/10' },
      { title: 'Attendance Rate', value: loadingSchoolStats ? '...' : `${schoolStats?.attendanceRate || 0}%`, change: (schoolStats?.attendanceRate || 0) > 0 ? '+1.5% average' : '0% average', icon: Activity, color: 'text-school-blue bg-school-blueLight dark:bg-school-blue/10' },
      { title: 'Defaulter Fees', value: loadingSchoolStats ? '...' : `₹${(schoolStats?.pendingPayments || 0).toLocaleString()}`, change: (schoolStats?.totalStudents || 0) > 0 ? 'Billing outstanding' : 'All clear', icon: AlertCircle, color: 'text-red-500 bg-red-50 dark:bg-red-950/20' }
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
                <IndianRupee className="h-4 w-4" />
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
  if (role === 'Teacher' || role === 'Faculty') {
    const classNames = Array.from(new Set(students?.map(s => s.grade) || []));
    const teacherClass = classNames.length > 0 ? classNames[0] : 'None';
    const classPupilsCount = students?.filter(s => s.grade === teacherClass).length || 0;
    const classAttendance = (students && classPupilsCount > 0)
      ? (students.filter(s => s.grade === teacherClass).reduce((acc: number, s: any) => acc + Number(s.attendanceRate || 0), 0) / classPupilsCount).toFixed(1) + '%'
      : '0%';

    const classPerfData = classPupilsCount > 0 ? [
      { name: 'UT-I', Physics: 78, Math: 82 },
      { name: 'UT-II', Physics: 84, Math: 85 },
      { name: 'Term-I', Physics: 86, Math: 88 }
    ] : [];

    return (
      <div className="space-y-8 text-left">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {role === 'Faculty' ? 'Faculty Command Portal' : 'Teacher Command Portal'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Welcome back, {user?.name}. {classPupilsCount > 0 ? 'You have 2 classes scheduled today.' : 'No lectures scheduled today.'}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">My Class Wards</span>
            <span className="block text-2xl font-extrabold text-school-blue mt-2">{teacherClass}</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">{classPupilsCount} Registered pupils</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Attendance</span>
            <span className="block text-2xl font-extrabold text-school-green mt-2">{classAttendance}</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">Present this month</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Graded Submissions</span>
            <span className="block text-2xl font-extrabold text-school-maroon mt-2">0 Pending</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">No pending homework</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Next Lecture</span>
            <span className="block text-sm font-extrabold text-slate-900 dark:text-white mt-3">
              {teacherClass !== 'None' ? '10:45 AM - Physics Lab' : 'No Scheduled Lectures'}
            </span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">
              {teacherClass !== 'None' ? 'Block-B Room 304' : 'All clear'}
            </span>
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
    const aarav = students?.find(s => s.parentEmail === user?.email) || students?.[0] || { name: 'No child linked', grade: 'N/A', pendingFees: 0, attendanceRate: 0, academicPerformance: 0 };

    return (
      <div className="space-y-8 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Parent Portal</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Active child profile: {aarav.name} ({aarav.grade}).
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
                Authorized SubhraEdu payments are secured with AES-256 bank encryption.
              </p>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 flex justify-between items-center text-xs font-bold">
                <div>
                  <span className="text-slate-400">Ward billing:</span>
                  <p className="mt-0.5 text-slate-900 dark:text-white">{aarav.name} ({aarav.grade})</p>
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

  // ----------------------------------------------------
  // VIEW D: STUDENT PORTAL
  // ----------------------------------------------------
  if (role === 'Student') {
    const aarav = students?.find(s => s.name === user?.name) || students?.[0] || { name: user?.name || 'Student', grade: 'N/A', pendingFees: 0, attendanceRate: 0, academicPerformance: 0 };

    return (
      <div className="space-y-8 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Student Command Center</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Welcome back, {user?.name} ({aarav.grade}). Track your classes, grades, and schedules.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">My Average GPA</span>
            <span className="block text-3xl font-extrabold text-school-green mt-2">{aarav.academicPerformance}%</span>
            <span className="text-[9px] font-bold text-slate-400 block mt-1">Class Rank: 4th</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">My Attendance Rate</span>
            <span className="block text-3xl font-extrabold text-school-blue mt-2">{aarav.attendanceRate}%</span>
            <span className="text-[9px] font-bold text-slate-400 block mt-1">2 Excused Absences</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Outstanding Fees Status</span>
            <span className={`block text-3xl font-extrabold mt-2 ${aarav.pendingFees > 0 ? 'text-school-maroon' : 'text-school-green'}`}>
              {aarav.pendingFees > 0 ? `₹${aarav.pendingFees.toLocaleString()}` : 'Cleared'}
            </span>
            <span className="text-[9px] font-bold text-slate-400 block mt-1">
              {aarav.pendingFees > 0 ? 'Payment due by Parent' : 'All clear for Term II'}
            </span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Library Book Checked Out</span>
            <span className="block text-3xl font-extrabold text-slate-900 dark:text-white mt-2">1 Copy</span>
            <span className="text-[9px] font-bold text-slate-400 block mt-1">Concepts of Physics Vol 1</span>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
            <CardHeader className="mb-4">
              <CardTitle className="text-md flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-school-blue" />
                <span>My Active Assignments</span>
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

          <Card className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
            <CardHeader className="mb-4">
              <CardTitle className="text-md flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-school-maroon" />
                <span>Student Bulletins & Notices</span>
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {announcements?.filter(a => a.target === 'All' || a.target === 'Students').map(ann => (
                <div key={ann.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">{ann.title}</span>
                  <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW E: LIBRARIAN PORTAL
  // ----------------------------------------------------
  if (role === 'Librarian') {
    const libraryActivities = issuances && issuances.length > 0 ? issuances.map((iss: any) => ({
      id: iss.id.toString(),
      book: iss.book?.title || 'Unknown Book',
      student: iss.student?.name || 'Unknown Student',
      type: iss.status === 'Issued' ? 'Checkout' : 'Return',
      date: new Date(iss.created_at || iss.createdAt).toLocaleDateString()
    })) : [];

    return (
      <div className="space-y-8 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Librarian Command Portal</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Welcome back, {user?.name}. Manage book records, checkouts, and student library catalog access.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => alert('[Demo Mode] Opening book catalog addition form...')}>
            Catalog New Title
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Volumes</span>
            <span className="block text-2xl font-extrabold text-school-blue mt-2">14,250</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">450 new this semester</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Active Checkouts</span>
            <span className="block text-2xl font-extrabold text-school-green mt-2">184</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">12 issues today</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Overdue Books</span>
            <span className="block text-2xl font-extrabold text-school-maroon mt-2">12</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">Reminders dispatched</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Pending Reservations</span>
            <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-2">8</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">On hold at counter</span>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
            <CardHeader className="mb-4">
              <CardTitle className="text-md flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-school-blue" />
                <span>Recent Library Operations</span>
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {libraryActivities.map((act) => (
                <div key={act.id} className="p-3.5 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold block">{act.book}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Student: {act.student} • {act.date}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    act.type === 'Return' ? 'bg-school-greenLight text-school-green' : 'bg-school-blueLight text-school-blue'
                  }`}>
                    {act.type}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <CardHeader className="mb-4">
                <CardTitle>Counter Desk Quick Actions</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold block">Issue book to student</span>
                    <span className="text-[10px] text-slate-400">Barcode scanner simulation</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => alert('[Demo Mode] Launching issue book checkout...')}>Issue</Button>
                </div>
                <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold block">Process return ledger</span>
                    <span className="text-[10px] text-slate-400">Scan book return cover</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => alert('[Demo Mode] Processing book return checklist...')}>Return</Button>
                </div>
              </div>
            </div>
            <div className="h-6" />
          </Card>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW F: PRINCIPAL PORTAL
  // ----------------------------------------------------
  if (role === 'Principal') {
    const classGPAData = [
      { name: 'Grade 6', GPA: 3.25 },
      { name: 'Grade 7', GPA: 3.42 },
      { name: 'Grade 8', GPA: 3.58 },
      { name: 'Grade 9', GPA: 3.65 },
      { name: 'Grade 10', GPA: 3.88 }
    ];

    return (
      <div className="space-y-8 text-left">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Principal Command Console</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Welcome back, {user?.name}. Global campus performance metrics and oversight logs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Enrollment</span>
            <span className="block text-2xl font-extrabold text-school-blue mt-2">2,549</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">+12% increase this year</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Class Attendance</span>
            <span className="block text-2xl font-extrabold text-school-green mt-2">91.5%</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">Daily average attendance</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Active Faculty</span>
            <span className="block text-2xl font-extrabold text-school-maroon mt-2">74</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">Teaching staff rosters</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Term Cash Flow</span>
            <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-2">94.2%</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">Fee collection rate</span>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
            <CardHeader className="mb-4">
              <CardTitle>Academic GPA Distribution</CardTitle>
            </CardHeader>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={classGPAData}>
                  <defs>
                    <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#138D75" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#138D75" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 4.0]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="GPA" stroke="#138D75" fill="url(#colorGpa)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <CardHeader className="mb-4">
                <CardTitle>Academic Advisories & Decisions</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                {[
                  { id: '1', title: 'Syllabus alignment board review', detail: 'Class 10 Board prep schedules.', date: 'June 10' },
                  { id: '2', title: 'PTM slots allocations approval', detail: 'Check and finalize time cards.', date: 'June 12' }
                ].map((act) => (
                  <div key={act.id} className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl space-y-1">
                    <span className="text-xs font-bold block">{act.title}</span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{act.detail}</p>
                    <span className="text-[9px] font-bold text-slate-400 block">{act.date}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-4" />
          </Card>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW G: ACCOUNTANT PORTAL
  // ----------------------------------------------------
  if (role === 'Accountant') {
    const revenueData = schoolStats?.revenueData || [];

    const financeLogs = transactions && transactions.length > 0 ? transactions.map((t: any) => ({
      id: t.id.toString(),
      item: `${t.studentName || 'Student'} - Fee payment`,
      amount: `₹${t.amount.toLocaleString()}`,
      status: t.status === 'Paid' ? 'Cleared' : 'Pending',
      date: new Date(t.created_at || t.createdAt).toLocaleDateString()
    })) : [];

    return (
      <div className="space-y-8 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Finance Command Center</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Welcome back, {user?.name}. Review transactions, generate invoices, and audit outstanding dues.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => alert('[Demo Mode] Launching custom fee invoice generator...')}>
            Issue Fee Invoice
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Term Revenue</span>
            <span className="block text-2xl font-extrabold text-school-blue mt-2">₹412,000</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">Projected collection target</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Realized Collections</span>
            <span className="block text-2xl font-extrabold text-school-green mt-2">₹391,500</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">95% completion rate</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Pending Collections</span>
            <span className="block text-2xl font-extrabold text-school-maroon mt-2">₹20,500</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">4 student accounts flagged</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Expense Audits</span>
            <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-2">Cleared</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">All vendor logs certified</span>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
            <CardHeader className="mb-4">
              <CardTitle>Cash Flow Trend Analysis</CardTitle>
            </CardHeader>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Revenue" fill="#0A4D8C" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="Collection" fill="#138D75" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <CardHeader className="mb-4">
                <CardTitle>Recent Payment Ledger</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                {financeLogs.map((log) => (
                  <div key={log.id} className="p-3.5 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold block">{log.item}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{log.amount} • {log.date}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      log.status === 'Cleared' ? 'bg-school-greenLight text-school-green' : 'bg-yellow-50 text-yellow-650'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-4" />
          </Card>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW H: HR PORTAL
  // ----------------------------------------------------
  if (role === 'HR') {
    const hrLogs = [
      { id: '1', staff: 'Dr. Sunita Rao (Teacher)', action: 'Calculus course timesheet submitted', status: 'Approved', date: 'Today, 11:30 AM' },
      { id: '2', staff: 'Mr. Rajesh Sharma (Staff)', action: 'Medical leave request - 2 Days', status: 'Pending', date: 'Today, 08:45 AM' },
      { id: '3', staff: 'Rahul Mehta (Librarian)', action: 'Monthly counter log completed', status: 'Approved', date: 'Yesterday, 05:00 PM' }
    ];

    return (
      <div className="space-y-8 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">HR Command Portal</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Welcome back, {user?.name}. Monitor active rosters, timesheets, and leave allocations.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => alert('[Demo Mode] Opening staff leave evaluation forms...')}>
            Review Leave Requests
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Active Staff Roster</span>
            <span className="block text-2xl font-extrabold text-school-blue mt-2">94</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">Includes admin & transport staff</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Teaching Faculty</span>
            <span className="block text-2xl font-extrabold text-school-green mt-2">74</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">2 new hires this semester</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Staff Attendance</span>
            <span className="block text-2xl font-extrabold text-school-maroon mt-2">96.8%</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">Daily timesheet averages</span>
          </Card>
          <Card className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Pending Timesheets</span>
            <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-2">5</span>
            <span className="text-[10px] text-slate-405 font-bold block mt-1">Awaiting approval</span>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent checkout activities */}
          <Card className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
            <CardHeader className="mb-4">
              <CardTitle className="text-md flex items-center gap-2">
                <Users className="h-5 w-5 text-school-blue" />
                <span>Recent Staff & HR Activities</span>
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              {hrLogs.map((log) => (
                <div key={log.id} className="p-3.5 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold block">{log.staff}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{log.action} • {log.date}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    log.status === 'Approved' ? 'bg-school-greenLight text-school-green' : 'bg-yellow-50 text-yellow-650'
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between">
            <div>
              <CardHeader className="mb-4">
                <CardTitle>HR Staff Management Actions</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold block">Audit staff timesheets</span>
                    <span className="text-[10px] text-slate-400">Review hours logged</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => alert('[Demo Mode] Processing timesheet ledger...')}>Audit</Button>
                </div>
                <div className="p-3 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold block">Process monthly payroll</span>
                    <span className="text-[10px] text-slate-400">Dispatch payment files</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => alert('[Demo Mode] Generating bank payment drafts...')}>Dispatch</Button>
                </div>
              </div>
            </div>
            <div className="h-6" />
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
