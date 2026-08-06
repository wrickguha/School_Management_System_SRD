import React, { useState } from 'react';
import {
  UserCheck, Calendar, Search, Plus, Printer, ShieldCheck, ChevronRight,
  Send, UserPlus, Briefcase, X, FileSpreadsheet, AlertCircle
} from 'lucide-react';

interface Visitor {
  id: number;
  name: string;
  mobile: string;
  email?: string;
  purpose: string;
  personToMeet: string;
  department: string;
  checkIn: string;
  checkOut?: string;
  remarks?: string;
  idProof?: string;
  status: 'checked_in' | 'checked_out' | 'expected';
}

interface AdmissionEnquiry {
  id: number;
  studentName: string;
  parentName: string;
  mobile: string;
  email: string;
  course: string;
  previousSchool: string;
  city: string;
  notes: string;
  followUpDate: string;
  assignedCounsellor: string;
  status: 'new' | 'contacted' | 'interested' | 'not_interested' | 'converted';
}

interface Appointment {
  id: number;
  visitorOrParentName: string;
  mobile: string;
  meetWithPerson: string;
  meetWithRole: 'Principal' | 'Vice Principal' | 'Teacher' | 'Counsellor' | 'Accounts Office';
  date: string;
  time: string;
  purpose: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
}

interface Complaint {
  id: number;
  parentName: string;
  studentName: string;
  mobile: string;
  department: 'Academic' | 'Transport' | 'Hostel' | 'Finance' | 'Administrative';
  subject: string;
  description: string;
  date: string;
  status: 'open' | 'assigned' | 'resolved' | 'closed';
}

interface WorkTask {
  id: number;
  title: string;
  assignedBy: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  remarks?: string;
}

export const ReceptionistModule: React.FC<{ initialTab?: string }> = ({ initialTab = 'dashboard' }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sample State Data (Pre-populated for instant front desk demo)
  const [visitors, setVisitors] = useState<Visitor[]>([
    { id: 1, name: 'Robert Vance', mobile: '+91 98765 43210', email: 'robert@gmail.com', purpose: 'Admission Inquiry for Grade 8', personToMeet: 'Sarah Jenkins', department: 'Admissions', checkIn: '09:15 AM', status: 'checked_in', remarks: 'Gate pass #102 issued' },
    { id: 2, name: 'Anita Sharma', mobile: '+91 98123 45678', purpose: 'Parent Teacher Discussion', personToMeet: 'Dr. Sunita Rao', department: 'Academics', checkIn: '10:00 AM', checkOut: '10:45 AM', status: 'checked_out' },
    { id: 3, name: 'David Miller', mobile: '+91 97654 32109', purpose: 'Vendor Book Delivery', personToMeet: 'Librarian', department: 'Library', checkIn: '11:20 AM', status: 'checked_in' },
  ]);

  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>([
    { id: 1, studentName: 'Aarav Sharma', parentName: 'Rajesh Sharma', mobile: '+91 98111 22233', email: 'rajesh@gmail.com', course: 'Grade 9 (Science Stream)', previousSchool: 'St. Xavier School', city: 'Kolkata', notes: 'Interested in robotics lab facilities', followUpDate: '2026-08-05', assignedCounsellor: 'Ms. Ritu Sen', status: 'interested' },
    { id: 2, studentName: 'Meera Patel', parentName: 'Vikram Patel', mobile: '+91 98222 33344', email: 'vikram@gmail.com', course: 'Grade 11 (Commerce)', previousSchool: 'Delhi Public School', city: 'Howrah', notes: 'Requested hostel brochure', followUpDate: '2026-08-04', assignedCounsellor: 'Mr. Alok Verma', status: 'new' },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, visitorOrParentName: 'Mrs. Priya Roy', mobile: '+91 98333 44455', meetWithPerson: 'Dr. A. K. Banerjee', meetWithRole: 'Principal', date: '2026-08-04', time: '11:00 AM', purpose: 'Special Fee Exemption Discussion', status: 'approved' },
    { id: 2, visitorOrParentName: 'Mr. S. K. Gupta', mobile: '+91 98444 55566', meetWithPerson: 'Vice Principal', meetWithRole: 'Vice Principal', date: '2026-08-04', time: '02:30 PM', purpose: 'Transfer Certificate Clearance', status: 'pending' },
  ]);

  const [complaints, setComplaints] = useState<Complaint[]>([
    { id: 1, parentName: 'Subhash Sen', studentName: 'Rohan Sen (Grade 6-B)', mobile: '+91 98555 66677', department: 'Transport', subject: 'Bus Route #4 15-min delay in morning pickup', description: 'Bus arrived late 3 days in a row at Salt Lake Stop', date: '2026-08-02', status: 'assigned' },
  ]);

  const [tasks] = useState<WorkTask[]>([
    { id: 1, title: 'Verify Grade 11 Admission Form Documents', assignedBy: 'Super Admin', dueDate: 'Today, 5:00 PM', priority: 'high', status: 'in_progress' },
    { id: 2, title: 'Dispatch Monthly Parent Circular SMS', assignedBy: 'Principal', dueDate: 'Tomorrow, 12:00 PM', priority: 'medium', status: 'pending' },
  ]);

  // Modal Controls
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [selectedVisitorForPass, setSelectedVisitorForPass] = useState<Visitor | null>(null);

  // Forms
  const [newVisitor, setNewVisitor] = useState({ name: '', mobile: '', email: '', purpose: '', personToMeet: '', department: 'Admissions', remarks: '' });
  const [newEnquiry, setNewEnquiry] = useState({ studentName: '', parentName: '', mobile: '', email: '', course: 'Grade 8', previousSchool: '', city: '', notes: '', followUpDate: '' });
  const [newAppointment, setNewAppointment] = useState({ visitorOrParentName: '', mobile: '', meetWithPerson: 'Principal', meetWithRole: 'Principal' as any, date: '', time: '', purpose: '' });
  const [newComplaint, setNewComplaint] = useState({ parentName: '', studentName: '', mobile: '', department: 'Administrative' as any, subject: '', description: '' });

  const handleRegisterVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Visitor = {
      id: Date.now(),
      ...newVisitor,
      checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'checked_in'
    };
    setVisitors([created, ...visitors]);
    setIsVisitorModalOpen(false);
    setSelectedVisitorForPass(created);
    setNewVisitor({ name: '', mobile: '', email: '', purpose: '', personToMeet: '', department: 'Admissions', remarks: '' });
  };

  const handleCheckOut = (id: number) => {
    setVisitors(visitors.map(v => v.id === id ? {
      ...v,
      checkOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'checked_out'
    } : v));
  };

  const handleCreateEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AdmissionEnquiry = {
      id: Date.now(),
      ...newEnquiry,
      assignedCounsellor: 'Ms. Ritu Sen',
      status: 'new'
    };
    setEnquiries([created, ...enquiries]);
    setIsEnquiryModalOpen(false);
    setNewEnquiry({ studentName: '', parentName: '', mobile: '', email: '', course: 'Grade 8', previousSchool: '', city: '', notes: '', followUpDate: '' });
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Appointment = {
      id: Date.now(),
      ...newAppointment,
      status: 'pending'
    };
    setAppointments([created, ...appointments]);
    setIsAppointmentModalOpen(false);
  };

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Complaint = {
      id: Date.now(),
      ...newComplaint,
      date: new Date().toISOString().split('T')[0],
      status: 'open'
    };
    setComplaints([created, ...complaints]);
    setIsComplaintModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 text-slate-900 dark:text-slate-100">

      {/* Notion/Linear Style Clean Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              Reception & Front Desk Command Terminal
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Front Desk Operations Console</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
              Enterprise visitor logging, gate passes, admission enquiries, appointments, parent directory, and prompt communication desk.
            </p>
          </div>

          {/* Quick Action Large Buttons */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setIsVisitorModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Register Visitor</span>
            </button>

            <button
              onClick={() => setIsEnquiryModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Admission Enquiry</span>
            </button>

            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Schedule Appointment</span>
            </button>

            <button
              onClick={() => setIsComplaintModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4" />
              <span>Register Complaint</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Today's Visitors</span>
          <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 block">{visitors.length}</span>
          <span className="text-[9px] text-slate-400 font-semibold">{visitors.filter(v => v.status === 'checked_in').length} Checked In</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Appointments</span>
          <span className="text-xl font-extrabold text-sky-600 dark:text-sky-400 mt-1 block">{appointments.length}</span>
          <span className="text-[9px] text-slate-400 font-semibold">2 Today</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Enquiries</span>
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">{enquiries.length}</span>
          <span className="text-[9px] text-slate-400 font-semibold">5 Follow-ups Due</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pending Work</span>
          <span className="text-xl font-extrabold text-amber-500 mt-1 block">{tasks.length}</span>
          <span className="text-[9px] text-slate-400 font-semibold">Assigned by Admin</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pending Docs</span>
          <span className="text-xl font-extrabold text-purple-600 dark:text-purple-400 mt-1 block">4</span>
          <span className="text-[9px] text-slate-400 font-semibold">New Students</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Open Complaints</span>
          <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 block">{complaints.length}</span>
          <span className="text-[9px] text-slate-400 font-semibold">Assigned to Dept</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Gate Status</span>
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">Active</span>
          <span className="text-[9px] text-slate-400 font-semibold">RFID Terminal OK</span>
        </div>
      </div>

      {/* Receptionist Tabs Nav */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 overflow-x-auto scrollbar-none">
        {[
          { id: 'dashboard', label: 'Front Desk Dashboard', icon: Briefcase },
          { id: 'visitors', label: 'Visitor Management', icon: UserCheck },
          { id: 'enquiries', label: 'Admission Enquiries', icon: Plus },
          { id: 'appointments', label: 'Appointments Desk', icon: Calendar },
          { id: 'search', label: 'Student Search & Profile', icon: Search },
          { id: 'communication', label: 'Communication Templates', icon: Send },
          { id: 'complaints', label: 'Parent Complaints', icon: AlertCircle },
          { id: 'reports', label: 'Reception Reports', icon: FileSpreadsheet },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 font-bold text-xs flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: Front Desk Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent Visitor Entries */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-indigo-600" />
                <span>Today's Visitor Log & Check-Ins</span>
              </h3>
              <button onClick={() => setActiveTab('visitors')} className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-4">Visitor</th>
                    <th className="py-3 px-4">Purpose</th>
                    <th className="py-3 px-4">Meeting With</th>
                    <th className="py-3 px-4">Check-In</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {visitors.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                      <td className="py-3 px-4 font-bold">
                        <div>{v.name}</div>
                        <div className="text-[10px] font-normal text-slate-400">{v.mobile}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{v.purpose}</td>
                      <td className="py-3 px-4 font-medium">{v.personToMeet} ({v.department})</td>
                      <td className="py-3 px-4 font-mono">{v.checkIn}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          v.status === 'checked_in' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {v.status === 'checked_in' ? 'Checked In' : 'Checked Out'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {v.status === 'checked_in' && (
                          <button
                            onClick={() => handleCheckOut(v.id)}
                            className="px-2.5 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-[10px] font-bold"
                          >
                            Check Out
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedVisitorForPass(v)}
                          className="px-2.5 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-[10px] font-bold"
                        >
                          Pass
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Appointments & Admin Tasks */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Appointments */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Calendar className="h-4.5 w-4.5 text-sky-600" />
                <span>Today's Executive Appointments</span>
              </h3>

              <div className="space-y-3">
                {appointments.map((app) => (
                  <div key={app.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl space-y-1 text-xs border border-slate-150 dark:border-slate-800">
                    <div className="flex justify-between font-bold">
                      <span>{app.visitorOrParentName}</span>
                      <span className="text-sky-600 font-mono">{app.time}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Meeting: {app.meetWithPerson} ({app.meetWithRole})</div>
                    <div className="text-[10px] text-slate-400 italic">{app.purpose}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Receptionist Work Tasks */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Briefcase className="h-4.5 w-4.5 text-amber-500" />
                <span>Assigned Front Desk Duties</span>
              </h3>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl space-y-1.5 text-xs border border-slate-150 dark:border-slate-800">
                    <div className="flex justify-between font-bold">
                      <span>{task.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold bg-amber-100 text-amber-700">{task.priority}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Assigned by: {task.assignedBy} • Due: {task.dueDate}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab Content 2: Visitor Management */}
      {activeTab === 'visitors' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-extrabold text-lg">Visitor Register & Gate Pass History</h3>
            <button
              onClick={() => setIsVisitorModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 w-fit"
            >
              <UserPlus className="h-4 w-4" />
              <span>Register New Visitor</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-4">Visitor Details</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Purpose</th>
                  <th className="py-3 px-4">Meeting Person</th>
                  <th className="py-3 px-4">Check-In Time</th>
                  <th className="py-3 px-4">Check-Out Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                    <td className="py-3.5 px-4 font-bold">{v.name}</td>
                    <td className="py-3.5 px-4">{v.mobile}</td>
                    <td className="py-3.5 px-4">{v.purpose}</td>
                    <td className="py-3.5 px-4">{v.personToMeet} ({v.department})</td>
                    <td className="py-3.5 px-4 font-mono">{v.checkIn}</td>
                    <td className="py-3.5 px-4 font-mono">{v.checkOut || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        v.status === 'checked_in' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {v.status === 'checked_in' ? 'Active On-Campus' : 'Checked Out'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedVisitorForPass(v)}
                        className="px-3 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold"
                      >
                        Print Pass
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 3: Admission Enquiries */}
      {activeTab === 'enquiries' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-extrabold text-lg">Admission Enquiry Log</h3>
            <button
              onClick={() => setIsEnquiryModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 w-fit"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Enquiry</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-4">Student & Parent</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Course Interested</th>
                  <th className="py-3 px-4">City / Prev School</th>
                  <th className="py-3 px-4">Follow-Up Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                    <td className="py-3.5 px-4 font-bold">
                      <div>{enq.studentName}</div>
                      <div className="text-[10px] text-slate-400">Parent: {enq.parentName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{enq.mobile}</div>
                      <div className="text-[10px] text-slate-400">{enq.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-indigo-600">{enq.course}</td>
                    <td className="py-3.5 px-4">{enq.city} • {enq.previousSchool}</td>
                    <td className="py-3.5 px-4 font-mono">{enq.followUpDate}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 capitalize">
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold">
                        Follow-up
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 4: Appointments Desk */}
      {activeTab === 'appointments' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-extrabold text-lg">Executive Appointments Schedule</h3>
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 w-fit"
            >
              <Calendar className="h-4 w-4" />
              <span>Schedule New Appointment</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((app) => (
              <div key={app.id} className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{app.visitorOrParentName}</h4>
                    <p className="text-xs text-slate-400">{app.mobile}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 uppercase">
                    {app.status}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <div>Meeting With: <strong className="text-slate-900 dark:text-white">{app.meetWithPerson} ({app.meetWithRole})</strong></div>
                  <div>Date & Time: <strong className="text-sky-600">{app.date} at {app.time}</strong></div>
                  <div className="text-slate-500 italic mt-2">"{app.purpose}"</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 5: Student Search */}
      {activeTab === 'search' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-extrabold text-lg">Student Front Desk Search & Contact Update</h3>

          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search student by Admission #, Name, Class, or Parent Mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <ShieldCheck className="h-4 w-4" />
              <span>Receptionist Authorization Boundary:</span>
            </div>
            <p className="text-slate-500">
              Receptionists can view student profile details and edit <strong>Phone Numbers</strong>, <strong>Home Address</strong>, and <strong>Guardian Contact Information</strong>. Academic grades, marks, and promotions are strictly read-only.
            </p>
          </div>
        </div>
      )}

      {/* Modal: Register Visitor */}
      {isVisitorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-base">Register Gate Visitor</h3>
              <button onClick={() => setIsVisitorModalOpen(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleRegisterVisitor} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Visitor Full Name *</label>
                <input required type="text" value={newVisitor.name} onChange={e => setNewVisitor({...newVisitor, name: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Mobile Number *</label>
                  <input required type="text" value={newVisitor.mobile} onChange={e => setNewVisitor({...newVisitor, mobile: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Department</label>
                  <input type="text" value={newVisitor.department} onChange={e => setNewVisitor({...newVisitor, department: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-500 block mb-1">Person To Meet *</label>
                <input required type="text" value={newVisitor.personToMeet} onChange={e => setNewVisitor({...newVisitor, personToMeet: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
              </div>
              <div>
                <label className="font-bold text-slate-500 block mb-1">Purpose of Visit *</label>
                <input required type="text" value={newVisitor.purpose} onChange={e => setNewVisitor({...newVisitor, purpose: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
              </div>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl mt-2">
                Generate Visitor Pass & Check In
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Printable Gate Pass Preview */}
      {selectedVisitorForPass && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-xs font-bold uppercase text-indigo-600">SubhraEdu Official Gate Pass</span>
              <button onClick={() => setSelectedVisitorForPass(null)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-left">
              <div className="font-extrabold text-base text-slate-900 dark:text-white">{selectedVisitorForPass.name}</div>
              <div>Mobile: <span className="font-mono">{selectedVisitorForPass.mobile}</span></div>
              <div>Meeting: <strong>{selectedVisitorForPass.personToMeet} ({selectedVisitorForPass.department})</strong></div>
              <div>Check-In: <span className="font-mono">{selectedVisitorForPass.checkIn}</span></div>
              <div className="pt-2 border-t text-[10px] text-slate-400 italic">Valid only for date of issue</div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => alert('Printing Visitor Gate Pass...')} className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5">
                <Printer className="h-4 w-4" /> Print Pass
              </button>
              <button onClick={() => setSelectedVisitorForPass(null)} className="py-2.5 px-4 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Admission Enquiry */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-base">New Admission Enquiry</h3>
              <button onClick={() => setIsEnquiryModalOpen(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleCreateEnquiry} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Student Name *</label>
                  <input required type="text" value={newEnquiry.studentName} onChange={e => setNewEnquiry({...newEnquiry, studentName: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Parent Name *</label>
                  <input required type="text" value={newEnquiry.parentName} onChange={e => setNewEnquiry({...newEnquiry, parentName: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Mobile Number *</label>
                  <input required type="text" value={newEnquiry.mobile} onChange={e => setNewEnquiry({...newEnquiry, mobile: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Email</label>
                  <input type="email" value={newEnquiry.email} onChange={e => setNewEnquiry({...newEnquiry, email: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Course / Grade</label>
                  <input type="text" value={newEnquiry.course} onChange={e => setNewEnquiry({...newEnquiry, course: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">City</label>
                  <input type="text" value={newEnquiry.city} onChange={e => setNewEnquiry({...newEnquiry, city: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-500 block mb-1">Previous School</label>
                <input type="text" value={newEnquiry.previousSchool} onChange={e => setNewEnquiry({...newEnquiry, previousSchool: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
              </div>
              <div>
                <label className="font-bold text-slate-500 block mb-1">Notes / Special Remarks</label>
                <textarea value={newEnquiry.notes} onChange={e => setNewEnquiry({...newEnquiry, notes: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" rows={2} />
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl mt-2">
                Save Admission Enquiry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule Appointment */}
      {isAppointmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-base">Schedule Appointment</h3>
              <button onClick={() => setIsAppointmentModalOpen(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">Visitor / Parent Name *</label>
                <input required type="text" value={newAppointment.visitorOrParentName} onChange={e => setNewAppointment({...newAppointment, visitorOrParentName: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Mobile Number *</label>
                  <input required type="text" value={newAppointment.mobile} onChange={e => setNewAppointment({...newAppointment, mobile: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Meet With Role</label>
                  <select value={newAppointment.meetWithRole} onChange={e => setNewAppointment({...newAppointment, meetWithRole: e.target.value as any})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950">
                    <option value="Principal">Principal</option>
                    <option value="Vice Principal">Vice Principal</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Counsellor">Counsellor</option>
                    <option value="Accounts Office">Accounts Office</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Person Name *</label>
                  <input required type="text" value={newAppointment.meetWithPerson} onChange={e => setNewAppointment({...newAppointment, meetWithPerson: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Date *</label>
                  <input required type="date" value={newAppointment.date} onChange={e => setNewAppointment({...newAppointment, date: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Time *</label>
                  <input required type="text" placeholder="e.g. 11:30 AM" value={newAppointment.time} onChange={e => setNewAppointment({...newAppointment, time: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Purpose *</label>
                  <input required type="text" value={newAppointment.purpose} onChange={e => setNewAppointment({...newAppointment, purpose: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl mt-2">
                Schedule Appointment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Register Complaint */}
      {isComplaintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold text-base">Register Parent Complaint</h3>
              <button onClick={() => setIsComplaintModalOpen(false)}><X className="h-5 w-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleCreateComplaint} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Parent Name *</label>
                  <input required type="text" value={newComplaint.parentName} onChange={e => setNewComplaint({...newComplaint, parentName: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Student Name *</label>
                  <input required type="text" value={newComplaint.studentName} onChange={e => setNewComplaint({...newComplaint, studentName: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Mobile Number *</label>
                  <input required type="text" value={newComplaint.mobile} onChange={e => setNewComplaint({...newComplaint, mobile: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Department</label>
                  <select value={newComplaint.department} onChange={e => setNewComplaint({...newComplaint, department: e.target.value as any})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950">
                    <option value="Administrative">Administrative</option>
                    <option value="Academic">Academic</option>
                    <option value="Transport">Transport</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-500 block mb-1">Subject *</label>
                <input required type="text" value={newComplaint.subject} onChange={e => setNewComplaint({...newComplaint, subject: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" />
              </div>
              <div>
                <label className="font-bold text-slate-500 block mb-1">Description *</label>
                <textarea required value={newComplaint.description} onChange={e => setNewComplaint({...newComplaint, description: e.target.value})} className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-950" rows={2} />
              </div>
              <button type="submit" className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl mt-2">
                Register Complaint
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReceptionistModule;
