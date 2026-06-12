import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, ShieldCheck, CheckCircle2, Activity, 
  Users, CreditCard, BookOpen, Play, Tv, 
  Award, FileText, Bookmark, 
  GraduationCap, Clock, MessageSquare, Clipboard, UserCheck, 
  Bell, Calendar, Truck, Lock, ShieldAlert, AlertCircle, Info,
  Zap, BarChart3, ChevronDown
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface MobileAppsPageProps {
  openDemoModal: () => void;
}

type TabKey = 'general' | 'parents' | 'teachers' | 'principals' | 'admins';
type ToggleKey = 'features' | 'benefits';

export default function MobileAppsPage({ openDemoModal }: MobileAppsPageProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [activeToggle, setActiveToggle] = useState<Record<TabKey, ToggleKey>>({
    general: 'features',
    parents: 'features',
    teachers: 'features',
    principals: 'features',
    admins: 'features'
  });

  const handleToggleChange = (tab: TabKey, value: ToggleKey) => {
    setActiveToggle(prev => ({
      ...prev,
      [tab]: value
    }));
  };

  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do parents access information for multiple children?",
      a: "Parents can view information for multiple siblings using a single login. They can easily switch profiles directly from the app header without logging out."
    },
    {
      q: "Is the live school bus tracking secure?",
      a: "Yes, the live GPS bus tracking uses end-to-end encrypted signals visible only to verified parents and school coordinators."
    },
    {
      q: "How are fee receipts and payment summaries generated?",
      a: "Every fee payment made via the integrated payment gateway instantly syncs with the school's central ERP ledger, generating digital receipts downloadable in the app."
    },
    {
      q: "What happens if the parent's phone is offline?",
      a: "The app caches the latest academic syllabus, timetables, and homework assignments offline so they can be viewed anytime without internet access."
    }
  ];

  const tabsConfig = [
    { key: 'general', label: 'General Features' },
    { key: 'parents', label: 'Parents' },
    { key: 'teachers', label: 'Teachers' },
    { key: 'principals', label: 'Principals' },
    { key: 'admins', label: 'Admins / Management' }
  ];

  // Detailed lists of Features & Benefits for each tab
  const tabContent: Record<TabKey, {
    title: string;
    description: string;
    features: { label: string; icon: any }[];
    benefits: { label: string; icon: any }[];
    mockTitle: string;
    mockItems: { label: string; value: string; color: string }[];
  }> = {
    general: {
      title: 'Key Features of School Management Mobile App',
      description: 'The school app has become essential for the smooth functioning of schools today. The app helps connect all stakeholders on a single platform and streamlines the tasks of administration.',
      features: [
        { label: 'Student Information System', icon: Users },
        { label: 'Staff Payroll Management', icon: CreditCard },
        { label: 'Attendance Tracking and Management', icon: CheckCircle2 },
        { label: 'Bus Tracking and GPS', icon: Truck },
        { label: 'Online Fee Payment and Management', icon: ShieldCheck }
      ],
      benefits: [
        { label: 'Chat and Communication', icon: MessageSquare },
        { label: 'Reminders, Updates, and Notifications', icon: Bell },
        { label: 'Schedules and Timetable', icon: Calendar },
        { label: 'Academic Calendar', icon: Award },
        { label: 'Online Library Management', icon: BookOpen }
      ],
      mockTitle: 'Ecosystem Status',
      mockItems: [
        { label: 'App Installs', value: '4L+ Active', color: 'text-emerald-500' },
        { label: 'Store Rating', value: '4.8 ★ Stars', color: 'text-amber-500' },
        { label: 'Daily Uptime', value: '99.99%', color: 'text-blue-500' },
        { label: 'Push Sync', value: '< 1.5s', color: 'text-purple-500' }
      ]
    },
    parents: {
      title: 'School Management Mobile App For Parents',
      description: 'Serving as a single point of reference, the parent app centralises all school-parent interaction and lets parents stay updated with their ward\'s day-to-day activities, fees, and safety.',
      features: [
        { label: 'Receive homework, projects, assignments, and circulars', icon: Clipboard },
        { label: 'Pay fee online and see fee details such as summary & dues', icon: CreditCard },
        { label: 'Get timely push notifications and fee reminders', icon: Bell },
        { label: 'Check attendance history in real time', icon: CheckCircle2 },
        { label: 'View working and non-working days using holiday assigner', icon: Calendar },
        { label: 'See exam schedules and download report cards', icon: GraduationCap },
        { label: 'See the list of assigned class and subject teachers', icon: UserCheck }
      ],
      benefits: [
        { label: 'View activities and upcoming school events', icon: Award },
        { label: 'View timetable and syllabus progress', icon: BookOpen },
        { label: 'Check multiple siblings\' information from the same login', icon: Users },
        { label: 'Send secure messages to class and subject teachers', icon: MessageSquare },
        { label: 'Check library books status - issue, return date, etc.', icon: Bookmark },
        { label: 'Check SMS history archives', icon: Clock },
        { label: 'View school bus route information with live GPS', icon: Truck }
      ],
      mockTitle: "Arjun's Portal",
      mockItems: [
        { label: 'Math Homework', value: 'Submitted ✓', color: 'text-emerald-500' },
        { label: 'Next Term Fees', value: '₹4,500 Paid', color: 'text-blue-500' },
        { label: 'Today\'s Attendance', value: 'Present (08:35)', color: 'text-emerald-500' },
        { label: 'School Bus Route A', value: '5 mins away', color: 'text-amber-500' }
      ]
    },
    teachers: {
      title: 'School Management Mobile App For Teachers',
      description: 'Act as a bridge between parents and teachers. Post assignments, mark attendance, apply for leaves, check payslips, and coordinate with school departments directly from your smartphone.',
      features: [
        { label: 'Apply for leaves and view personal attendance logs', icon: Calendar },
        { label: 'Upload assignments, homework, and classroom notices', icon: Clipboard },
        { label: 'Quick employee directory code search', icon: UserCheck },
        { label: 'Instant student academic profiles check', icon: Users },
        { label: 'Download payslips and view salary statements', icon: CreditCard }
      ],
      benefits: [
        { label: 'Accountability and transparency of classroom data', icon: ShieldCheck },
        { label: 'Improves grade input and attendance accuracy', icon: CheckCircle2 },
        { label: 'Better staff management and lesson coordination', icon: Users },
        { label: 'Eliminates unnecessary administrative paperwork', icon: Zap }
      ],
      mockTitle: 'Educator Console',
      mockItems: [
        { label: 'Class Grade 10', value: '45 Students', color: 'text-blue-500' },
        { label: 'Class Attendance', value: 'Marked (08:45)', color: 'text-emerald-500' },
        { label: 'HW Uploaded Today', value: '2 Subjects', color: 'text-purple-500' },
        { label: 'Leave Balance', value: '14 Days Accrued', color: 'text-slate-500' }
      ]
    },
    principals: {
      title: 'School Management Mobile App For Principals',
      description: 'Keep track of the overall activities of the school: student profiles, classroom progress, school calendars, staff schedules, and central accounts with a single touch of a button.',
      features: [
        { label: 'View assignments, school messages, and circulars', icon: MessageSquare },
        { label: 'Monitor school statistics, revenues, and event compliance', icon: Activity },
        { label: 'Check login history of both teachers and parents', icon: Clock }
      ],
      benefits: [
        { label: 'Monitor what\'s going on in the school in real-time', icon: Tv },
        { label: 'Analyse department performance and grading curves', icon: BarChart3 },
        { label: 'Ensures operational accuracy and data transparency', icon: ShieldCheck },
        { label: 'Access school parameters and audit logs on the go', icon: Smartphone }
      ],
      mockTitle: 'Principal Overview',
      mockItems: [
        { label: 'Total Strength', value: '1,297 Enrolled', color: 'text-blue-500' },
        { label: 'Today\'s Attendance', value: '96.2% Present', color: 'text-emerald-500' },
        { label: 'Revenue Collection', value: '₹24.5L Settled', color: 'text-emerald-500' },
        { label: 'SSO Directory', value: '45 Staff Online', color: 'text-purple-500' }
      ]
    },
    admins: {
      title: 'School Management Mobile App For Admins',
      description: 'Specifically engineered for school admin staff and management committees to streamline tedious paperwork, fee collections, payroll runs, and asset tracking.',
      features: [
        { label: 'View class-wise data (new admissions, dropouts, TCs)', icon: Users },
        { label: 'Check staff details including monthly payrolls', icon: CreditCard },
        { label: 'Fee collection and analysis (head-wise and month-wise)', icon: BarChart3 },
        { label: 'Track the list of outstanding fee defaulters', icon: AlertCircle },
        { label: 'Check login history logs of parents and teachers', icon: Clock },
        { label: 'Keep track of school system equipment and assets', icon: Clipboard },
        { label: 'Generate accurate regulatory audit reports', icon: FileText }
      ],
      benefits: [
        { label: 'Ensures absolute financial transparency', icon: ShieldCheck },
        { label: 'Allows accurate capacity and budget planning', icon: Calendar },
        { label: 'Improves staff accountability and productivity', icon: UserCheck },
        { label: 'Maintains systematic and secure database records', icon: Lock },
        { label: 'Enables error-free analytical statistics', icon: Activity },
        { label: 'Easy to spot fee defaulters and push reminders', icon: Bell },
        { label: 'Easily search for specific student or parent details', icon: Info },
        { label: 'Less time spent on managing physical stock levels', icon: Bookmark }
      ],
      mockTitle: 'Admin Command',
      mockItems: [
        { label: 'New Admissions', value: '18 This Week', color: 'text-emerald-500' },
        { label: 'Pending Reminders', value: '12 Sent', color: 'text-amber-500' },
        { label: 'Inventory Level', value: '98% Stocked', color: 'text-blue-500' },
        { label: 'SSO Audits', value: '0 Conflicts', color: 'text-emerald-500' }
      ]
    }
  };

  return (
    <div className="relative bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 bg-gradient-to-br from-[#eff6ff] via-[#f8fbff] to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-850">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b60_1px,transparent_1px),linear-gradient(to_bottom,#1e293b60_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-20 right-[-10%] w-[550px] h-[550px] rounded-full bg-blue-600/5 dark:bg-blue-400/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[5%] w-[450px] h-[450px] rounded-full bg-emerald-500/5 dark:bg-emerald-400/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 text-left">
          
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-900/30 px-3.5 py-1.5 rounded-full text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              SubhraEdu Mobile Suite • iOS & Android
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              School Management <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">Mobile Apps</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-semibold max-w-2xl">
              Now reduce the time spent on various tasks of administration by mobile apps. Stakeholders can perform multiple operations while on the go!
            </p>

            <div className="flex gap-4 pt-2">
              <Button 
                variant="primary" 
                size="md" 
                onClick={openDemoModal} 
                className="bg-[#2563eb] hover:bg-[#1d4ed8] border-none font-bold text-white shadow-lg text-xs uppercase tracking-wider"
              >
                Request For Demo
              </Button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/80">
              {[
                { val: '4L+', label: 'Installs' },
                { val: '4.8 ★', label: 'Rating' },
                { val: '100%', label: 'Cloud Sync' }
              ].map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="block text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
                    {stat.val}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Visual */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Phone Mockup Frame */}
            <div className="relative w-full max-w-[320px] aspect-[9/18] rounded-[48px] border-[8px] border-slate-900 dark:border-slate-800 bg-slate-950 shadow-2xl overflow-hidden z-10 flex flex-col justify-between p-3 text-left">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center">
                <span className="h-2 w-2 bg-slate-800 rounded-full mr-2" />
                <span className="h-1 w-12 bg-slate-800 rounded-full" />
              </div>

              {/* Status Bar */}
              <div className="flex justify-between items-center text-[9px] text-slate-400 font-extrabold px-3 pt-3">
                <span>09:41 AM</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2.5 bg-slate-400 rounded-sm" />
                  <span className="h-1.5 w-4 bg-slate-400 rounded-sm" />
                </div>
              </div>

              {/* Mock App Body */}
              <div className="flex-1 flex flex-col justify-start pt-6 px-1.5 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <div className="h-9 w-9 bg-blue-600/15 rounded-lg flex items-center justify-center text-blue-500 font-black text-xs">
                    SE
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-white">SubhraEdu One</span>
                    <span className="text-[7.5px] text-slate-400">Campus Cloud Active</span>
                  </div>
                </div>

                {/* Simulated notifications */}
                <div className="space-y-2.5">
                  {[
                    { title: 'Maths HW Assigned', time: 'Just now', desc: 'Syllabus chapter 4 derivatives practice sheet.', color: 'border-l-rose-500' },
                    { title: 'Online Fees Settled', time: '12 mins ago', desc: 'Invoice #INV-2901 for Term-II cleared successfully.', color: 'border-l-emerald-500' },
                    { title: 'School Bus Route A', time: '20 mins ago', desc: 'Bus crossed stop #12. 5 mins to pick-up.', color: 'border-l-amber-500' }
                  ].map((notif, nIdx) => (
                    <div key={nIdx} className={`p-2.5 rounded-xl bg-slate-900 border-l-4 ${notif.color} border border-slate-850/60 shadow space-y-0.5`}>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-white">{notif.title}</span>
                        <span className="text-[7.5px] text-slate-450">{notif.time}</span>
                      </div>
                      <p className="text-[8px] text-slate-400 font-semibold leading-normal">{notif.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Quick actions panel */}
                <div className="bg-slate-900 border border-slate-850/60 rounded-2xl p-2.5 space-y-2">
                  <span className="text-[7.5px] font-bold text-slate-450 uppercase tracking-wider block">Quick Modules</span>
                  <div className="grid grid-cols-4 gap-2">
                    {['Diary', 'Fees', 'GPS', 'Report'].map((mod, mIdx) => (
                      <div key={mIdx} className="bg-slate-950/60 rounded-xl p-1.5 text-center text-[7.5px] font-bold text-white border border-slate-850">
                        <span className="block text-slate-500 font-black">{mIdx + 1}</span>
                        <span className="block truncate mt-0.5">{mod}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Nav Bar */}
              <div className="h-1 w-24 bg-slate-800 mx-auto rounded-full mb-1" />
            </div>
            
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-blue-600/10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full border border-blue-600/5 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 2. INTRO SECTION */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-left space-y-10">
        <div className="space-y-4 text-center">
          <span className="text-xs font-bold text-[#2563eb] uppercase tracking-widest">Complete Mobile Ecosystem</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            India's Most Trusted School Parent App & Student Mobile App
          </h2>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-premium space-y-5">
          <h3 className="text-lg md:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            One App. Complete School Communication. Total Transparency.
          </h3>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
            In today's education ecosystem, communication gaps create the biggest dissatisfaction for parents, students, and teachers alike.
            <br /><br />
            SubhraEdu's CampusCare is a comprehensive School Mobile App designed to bring parents, students, teachers, and school management onto one secure digital platform.
            <br /><br />
            Used by millions of parents and students across India, the CampusCare App transforms everyday school communication into a structured, transparent, and real-time experience.
          </p>
        </div>
      </section>

      {/* 3. WHY SECTION */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950/40 border-y border-slate-100 dark:border-slate-850/80 text-left">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Why Schools Need a Dedicated School Mobile App Today
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Modern parents expect more than circulars and paper diary notes. They expect instant updates, visibility into student progress, and assurance of safety.
            </p>
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider block">Without a dedicated school mobile app, schools face:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-650 dark:text-slate-400">
                {[
                  'Delayed communication cycles',
                  'Missed messages and instructions',
                  'Parent dissatisfaction and doubts',
                  'Lack of attendance transparency'
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-red-650">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              A unified School Parent App and Student Mobile App ensures that every stakeholder stays informed, connected, and confident.
            </p>
          </div>
          <div className="md:col-span-5 flex justify-center">
            {/* Visual Warning alert box */}
            <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20 max-w-sm space-y-4">
              <div className="h-10 w-10 bg-red-600/10 text-red-600 rounded-xl flex items-center justify-center">
                <ShieldAlert className="h-5.5 w-5.5" />
              </div>
              <h4 className="text-sm font-black uppercase text-red-650 dark:text-red-400">Ecosystem Risk Warning</h4>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                Relying on physical logs or un-synced spreadsheets results in an average 35% lag in notification times. Instant push notifications solve this failure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. APP ECOSYSTEM MODULES */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 text-left">
        <div className="space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#2563eb] uppercase tracking-widest font-black">Feature Deep Dive</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              More Than a Digital Diary, A Complete School App Ecosystem
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              SubhraEdu's CampusCare replaces traditional almanacs and fragmented tools with a smart School Diary App that centralises all communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Box 1 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="h-10 w-10 bg-blue-500/10 text-[#2563eb] rounded-xl flex items-center justify-center text-lg">
                📋
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Homework, Circulars & Announcements</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                  Teachers upload homework and notices instantly, allowing parents to receive real-time notifications with no missed updates or manual follow-ups.
                </p>
              </div>
            </div>

            {/* Box 2 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="h-10 w-10 bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center text-lg">
                📅
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Academic Calendar & Events</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                  Tracks exams, PTMs, holidays, and school events with automatic reminders to parents and students for improved planning.
                </p>
              </div>
            </div>

            {/* Box 3 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="h-10 w-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center text-lg">
                🚌
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Real-Time Student Attendance & Safety</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                  Parents receive instant present/absent notifications and check live GPS school bus route tracking during pick-up and drop hours.
                </p>
              </div>
            </div>

            {/* Box 4 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="h-10 w-10 bg-violet-500/10 text-violet-600 rounded-xl flex items-center justify-center text-lg">
                🎓
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Seamless Learning with Student Zone</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                  Enables secure virtual classes, access to recorded lectures, subject-wise performance tracking, and homework submissions with feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE TABS & TOGGLES SECTION */}
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950/45 border-y border-slate-200/80 dark:border-slate-850/80 text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#2563eb] uppercase tracking-widest font-black">Interactive Modules Workspace</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Explore Features & Benefits by Stakeholder
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Select a stakeholder tab below, then toggle between Features and Benefits lists to see how SubhraEdu optimizes school workloads.
            </p>
          </div>

          {/* Stakeholder Tabs Header */}
          <div className="flex gap-2 overflow-x-auto pb-3 border-b border-slate-200 dark:border-slate-800 scrollbar-none justify-start lg:justify-center">
            {tabsConfig.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-[#2563eb] border-[#2563eb] text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
            
            {/* Left lists column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {tabContent[activeTab].title}
                </h3>
                <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-450 leading-relaxed">
                  {tabContent[activeTab].description}
                </p>
              </div>

              {/* Toggle Switcher */}
              <div className="inline-flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
                <button
                  onClick={() => handleToggleChange(activeTab, 'features')}
                  className={`px-5 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    activeToggle[activeTab] === 'features'
                      ? 'bg-white dark:bg-slate-900 text-[#2563eb] shadow'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Features
                </button>
                <button
                  onClick={() => handleToggleChange(activeTab, 'benefits')}
                  className={`px-5 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    activeToggle[activeTab] === 'benefits'
                      ? 'bg-white dark:bg-slate-900 text-[#2563eb] shadow'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Benefits
                </button>
              </div>

              {/* Dynamic list rendering */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeTab}-${activeToggle[activeTab]}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:col-span-2"
                  >
                    {(activeToggle[activeTab] === 'features'
                      ? tabContent[activeTab].features
                      : tabContent[activeTab].benefits
                    ).map((item, idx) => {
                      const IconComp = item.icon;
                      return (
                        <div 
                          key={idx}
                          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex gap-3 items-start hover:border-slate-350 dark:hover:border-slate-700 shadow-sm transition-all"
                        >
                          <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-[#2563eb] flex items-center justify-center shrink-0">
                            <IconComp className="h-4.5 w-4.5" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-750 dark:text-slate-200 leading-normal">
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right Phone Mockup column */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium w-full max-w-sm space-y-6">
                <span className="text-[10px] font-bold text-slate-405 uppercase tracking-widest block text-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  Live Mock Terminal
                </span>
                
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between aspect-[9/10] overflow-hidden text-slate-300">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    {tabContent[activeTab].mockTitle}
                  </span>
                  
                  <div className="space-y-3 py-3 text-xs font-semibold">
                    {tabContent[activeTab].mockItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-slate-900 pb-1.5 last:border-b-0 last:pb-0">
                        <span className="text-slate-450 text-[10px]">{item.label}:</span>
                        <span className={`font-black text-[10px] ${item.color}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <span className="text-[8px] text-slate-500 text-center font-bold">
                    * Interactive Data Auto-Sync Enabled
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. PRESCHOOL ECOSYSTEM (CAMPUSKIDZ) */}
      <section className="py-20 bg-gradient-to-tr from-rose-50/50 via-purple-50/20 to-white dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 border-b border-slate-100 dark:border-slate-850 text-left">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 relative flex justify-center">
            {/* Playful/Kids mockup box */}
            <div className="p-8 rounded-[36px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-premium w-full max-w-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl" />
              
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 bg-rose-100 dark:bg-rose-950/60 rounded-xl flex items-center justify-center text-lg">
                    🧸
                  </div>
                  <div>
                    <span className="block text-xs font-black text-slate-900 dark:text-white">CampusKidz</span>
                    <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wider">Preschool ERP</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400">Early Years</span>
              </div>

              <div className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <div className="p-3.5 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 space-y-1">
                  <span className="block text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">Activity Feed</span>
                  <p className="text-[11px] leading-relaxed">Arjun painted a paper plate sunflower and finished lunch today! 🌻</p>
                </div>
                
                <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 space-y-1">
                  <span className="block text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">Sleep & Health Logs</span>
                  <p className="text-[11px] leading-relaxed">Napped for 45 mins (12:30 - 13:15). Hydration: 3 cups water. 💧</p>
                </div>
              </div>

              <div className="text-center text-[10px] font-extrabold text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                Real-time Infant & Toddler Diaries
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-6">
            <span className="text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest font-black">Dedicated Preschool Suite</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              CampusKidz™ Preschool Ecosystem
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              A preschool ecosystem is very much different from that of a high school. To cater to the requirements of early childhood institutes, we developed the **CampusKidz Module**.
              <br /><br />
              It addresses the unique daily tracking, safety, and engagement needs of preschool parents and early childhood educators by working in harmony with SubhraEdu ERP.
            </p>
            <ul className="space-y-3.5 text-xs font-bold text-slate-600 dark:text-slate-400 font-semibold">
              {[
                { title: 'Interactive Photo & Media Sharing', desc: 'Teachers share activity highlights, play progress, and event updates instantly.' },
                { title: 'Meal, Sleep & Hygiene Diaries', desc: 'Parents stay logged in to hydration, meals, naps, and sanitization routines.' },
                { title: 'Seamless Touchless Check-in/out', desc: 'Digital QR-based student entry and exit to ensure absolute safety logs.' }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="h-5 w-5 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 text-[10px] font-black">✓</span>
                  <div>
                    <span className="block text-slate-900 dark:text-white font-extrabold text-xs">{item.title}</span>
                    <span className="block text-slate-400 dark:text-slate-500 font-semibold text-[11px] mt-0.5 leading-normal">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7. TECHNICAL CAPABILITIES & SECURITY */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 text-left">
        <div className="space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#2563eb] uppercase tracking-widest font-black">Enterprise Architecture</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Enterprise Grade Security & High Performance
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              SubhraEdu Mobile Suite is built on a high-availability infrastructure optimized for fast, secure, and low-latency synchronization with your campus databases.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 font-semibold">
            {[
              { icon: ShieldCheck, title: 'End-to-End Encryption', desc: 'All personal student files, fee records, and chat messages are encrypted in transit and at rest with AES-256 standards.' },
              { icon: Zap, title: 'Instant Cloud Sync', desc: 'Automatic socket connections push homework and announcements to parent devices in under 1.5 seconds from staff upload.' },
              { icon: Clock, title: 'Smart Offline Cache', desc: 'App caches latest syllabus, fee summaries, and timetables offline so they are viewable even without network coverage.' },
              { icon: Lock, title: 'Multi-Factor Auth', desc: 'Protected by secure SSO, biometric logins (FaceID/TouchID), and one-time passwords to safeguard sensitive campus credentials.' }
            ].map((tech, idx) => {
              const TechIcon = tech.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/80 space-y-4 hover:border-blue-500/30 dark:hover:border-blue-500/20 transition-all shadow-sm">
                  <div className="h-10 w-10 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                    <TechIcon className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">{tech.title}</h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">{tech.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. INTERACTIVE FAQ SECTION */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950/45 border-t border-slate-200/80 dark:border-slate-850/80 text-left">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#2563eb] uppercase tracking-widest font-black">Support & Help</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Find answers to common questions about SubhraEdu's school parent app ecosystem.
            </p>
          </div>

          <div className="space-y-4 font-semibold">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-5 flex justify-between items-center text-left text-slate-900 dark:text-white font-extrabold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 dark:text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="p-5 pt-0 text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 9. DOWNLOAD CTA BLOCK */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-center">
        <div className="p-8 md:p-12 rounded-[32px] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900 border border-blue-150/40 dark:border-blue-900/30 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Download the SubhraEdu School App Today
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Get immediate access to student profiles, grade analytics, real-time bus tracking, and cashless online fees on your smartphone.
          </p>

          {/* Badges */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Play store badge */}
            <a 
              href="https://play.google.com/store/apps/details?id=com.entab.learninglab&hl=en-IN" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transform hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <div className="bg-slate-950 border border-slate-800 text-white rounded-2xl px-5 py-3 flex items-center gap-3 w-48 shadow-lg">
                <Play className="h-6 w-6 text-emerald-500" />
                <div className="text-left leading-tight">
                  <span className="block text-[8px] text-slate-400 font-bold uppercase">Get it on</span>
                  <span className="block text-xs font-black">Google Play</span>
                </div>
              </div>
            </a>

            {/* App store badge */}
            <a 
              href="https://apps.apple.com/in/app/campuscare-10X/id1611283814" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transform hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <div className="bg-slate-950 border border-slate-800 text-white rounded-2xl px-5 py-3 flex items-center gap-3 w-48 shadow-lg">
                <Smartphone className="h-6 w-6 text-sky-400" />
                <div className="text-left leading-tight">
                  <span className="block text-[8px] text-slate-400 font-bold uppercase">Download on the</span>
                  <span className="block text-xs font-black">App Store</span>
                </div>
              </div>
            </a>
          </div>

          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-850/50 max-w-xs mx-auto">
            <Button 
              variant="outline" 
              size="md" 
              onClick={openDemoModal} 
              className="font-extrabold border-[#2563eb] text-[#2563eb] hover:bg-blue-50 dark:hover:bg-slate-800 w-full"
            >
              Request For Demo
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
