import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Calendar, Award, CreditCard, UserCheck, GraduationCap,
  BookOpen, ShieldAlert, Bus, Library as LibraryIcon, Home as HomeIcon,
  BarChart3, Check, X, ChevronRight, HelpCircle, ArrowRight, Star
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface LandingContext {
  openDemoModal: () => void;
}

export default function LandingPage() {
  const { openDemoModal } = useOutletContext<LandingContext>();
  const [activeTab, setActiveTab] = useState<'admissions' | 'academics' | 'finance' | 'analytics'>('admissions');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Features List
  const features = [
    { icon: Users, title: 'Student Management', desc: 'Centralized profiles, academic trackers, document vaults, and admissions registry.' },
    { icon: Calendar, title: 'Attendance Management', desc: 'RFID integrations, check-in widgets, automated absent alerts, and summaries.' },
    { icon: Award, title: 'Examination System', desc: 'Schedule exams, upload grade cards, automatically generate report cards, and publish scores.' },
    { icon: CreditCard, title: 'Fee Management', desc: 'Sleek parent invoicing, automated ledger adjustments, payment gateways, and fine alerts.' },
    { icon: UserCheck, title: 'Parent Portal', desc: 'Real-time learning stats, class notifications, fee payment dashboard, and homework logs.' },
    { icon: GraduationCap, title: 'Teacher Portal', desc: 'Quick marks uploads, attendance entries, lesson planners, and class summaries.' },
    { icon: BookOpen, title: 'Homework Management', desc: 'Upload documents, set deadlines, grade papers online, and track submission rates.' },
    { icon: ShieldAlert, title: 'HR & Payroll', desc: 'Biometric timesheet syncing, staff directory, grade logs, and salary disbursements.' },
    { icon: Bus, title: 'Transport Management', desc: 'Live bus tracking, route planners, driver records, and pick/drop sms alerts.' },
    { icon: LibraryIcon, title: 'Library Management', desc: 'Barcode checkouts, book category trackers, due lists, and automated fines.' },
    { icon: HomeIcon, title: 'Hostel Management', desc: 'Room allocations, occupancy metrics, asset trackers, and mess roster logs.' },
    { icon: BarChart3, title: 'AI Analytics', desc: 'Predictive dropout warnings, grade performance, cash flow forecasts, and charts.' }
  ];

  // Showcase details
  const showcaseData = {
    admissions: {
      title: 'Paperless Digital Admissions',
      desc: 'Simplify new student enrollment with customized forms, online fee collection, and digital document verification pipeline.',
      points: ['Online Application Forms', 'Automatic Seat Matrix Calculations', 'Verification Workflows', 'Instant Portal Activation'],
      stats: '85% faster enrollment cycles'
    },
    academics: {
      title: 'End-to-End Lesson Planning & Grading',
      desc: 'Equip teachers with interactive gradebooks, lesson milestone checkers, and report card builders.',
      points: ['National Syllabus Mappings', 'Automatic Grade Computations', 'Progress Reports Sheets', 'Homework Tracker feed'],
      stats: '15+ hours saved per teacher weekly'
    },
    finance: {
      title: 'Secure Automated Cash Flows',
      desc: 'Eliminate paperwork for outstanding fee collections. Trigger reminders and provide instant payment checkouts.',
      points: ['Recurring Invoice Schedulers', 'Multi-payment Gateways (UPI, Cards)', 'Auto-Defaulter List flagging', 'Instant Receipt PDF dispatch'],
      stats: '40% reduction in late fee collections'
    },
    analytics: {
      title: 'Advanced AI School Diagnostic Suite',
      desc: 'Analyze performance trends, attendance anomalies, and revenue forecasting in real-time.',
      points: ['Grade Improvement Predictors', 'Seasonal Absence Warning Flags', 'Revenue Projection Modeler', 'Departmental Cost Breakdowns'],
      stats: '99.2% data calculation accuracy'
    }
  };

  // Testimonials
  const testimonials = [
    {
      name: 'Dr. Arthur Sterling',
      role: 'Board President, Sterling Academies',
      text: 'Aegis ERP transformed our entire district. Managing 5 campus sites, 12,000 students, and unified billing used to take a team of 40. Now we handle everything seamlessly from a single dashboard.',
      rating: 5
    },
    {
      name: 'Mrs. Rebecca Mercer',
      role: 'Principal, Greenfield Prep School',
      text: 'The Parent Portal is incredible. Late fees dropped by 45% because parents can checkout outstanding balances in 3 clicks. The teachers love the automated gradecard publisher.',
      rating: 5
    },
    {
      name: 'Mr. David Cho',
      role: 'Chief Administrator, Horizon Global School',
      text: 'Its rare to find a platform with both high-level financial tracking and detailed academic tools. Aegis looks premium, runs lightning-fast, and their API structure is highly scalable.',
      rating: 5
    }
  ];

  const faqs = [
    { q: 'How long does the ERP implementation take?', a: 'Typically, setting up your customized Aegis instance takes 5 to 7 business days, including migrating student history databases and teacher profiles.' },
    { q: 'Is our student information database secure?', a: 'Absolutely. We apply enterprise-grade end-to-end encryption. Our systems follow strict HIPAA and COPPA compliance protocols.' },
    { q: 'Can we configure custom roles for department heads?', a: 'Yes. The system has unlimited custom role assignments. You can define specific permissions for academic heads, financial officers, and transportation coordinators.' },
    { q: 'Does Aegis integrate with physical RFID gates?', a: 'Yes. We support RFID smartgate integrations, biometric sensors, and SMS gateways to dispatch notifications in real-time.' }
  ];

  return (
    <div className="relative">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 bg-gradient-to-b from-school-blueLight/30 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-school-blue/10 text-school-blue text-xs font-bold"
            >
              <span className="h-2 w-2 rounded-full bg-school-blue animate-pulse" />
              Next-Gen School Administration Suite
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
            >
              Transform Your School with the Most <span className="text-school-blue">Advanced ERP</span> Platform
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium max-w-2xl"
            >
              Manage admissions, attendance, academics, fees, examinations, communication, and administration from a single intelligent platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button variant="primary" size="lg" onClick={openDemoModal} rightIcon={<ArrowRight className="h-5 w-5" />}>
                Request Demo
              </Button>
              <a href="#features">
                <Button variant="outline" size="lg">
                  Explore Features
                </Button>
              </a>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800"
            >
              <div>
                <span className="block text-3xl font-extrabold text-slate-900 dark:text-white">99.8%</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Uptime SLA</span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold text-slate-900 dark:text-white">45%</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin Time Saved</span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold text-slate-900 dark:text-white">500+</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Schools Worldwide</span>
              </div>
            </motion.div>
          </div>

          {/* Right Floating Dashboard Preview */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="relative z-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-4 shadow-glass backdrop-blur-md overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full bg-red-400" />
                  <span className="h-3.5 w-3.5 rounded-full bg-yellow-400" />
                  <span className="h-3.5 w-3.5 rounded-full bg-green-400" />
                </div>
                <span className="text-xs font-semibold text-slate-400">admin-dashboard-v3.2</span>
              </div>

              {/* Inside Mockup */}
              <div className="space-y-4">
                <div className="h-28 rounded-xl bg-gradient-to-r from-school-blue to-school-blueDark p-4 text-white flex flex-col justify-between">
                  <span className="text-xs font-bold tracking-widest uppercase opacity-75">St. Xavier Academy Summary</span>
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-2xl font-bold">2,480</span>
                      <span className="text-[10px] block opacity-75">Total Active Students</span>
                    </div>
                    <span className="px-2.5 py-1 bg-white/20 rounded-lg text-xs font-bold">Term-I 94.6% Avg</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-950">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Fee Collection</span>
                    <span className="block text-lg font-bold text-school-green">$184,500</span>
                    <span className="text-[9px] font-semibold text-slate-400">92% Collected</span>
                  </div>
                  <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-950">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Attendance</span>
                    <span className="block text-lg font-bold text-school-blue">96.8%</span>
                    <span className="text-[9px] font-semibold text-slate-400">+1.2% from last month</span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold">Recent Activities</span>
                    <span className="text-school-blue font-semibold">View logs</span>
                  </div>
                  <div className="h-24 overflow-hidden space-y-2">
                    <div className="flex gap-2 items-start text-[11px] p-2 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-850">
                      <span className="h-2 w-2 rounded-full bg-school-green mt-1 shrink-0" />
                      <p className="text-slate-500"><span className="font-bold text-slate-800 dark:text-slate-200">Mrs. Priya Sen</span> uploaded Grade 9 English Marksheet.</p>
                    </div>
                    <div className="flex gap-2 items-start text-[11px] p-2 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-850">
                      <span className="h-2 w-2 rounded-full bg-school-blue mt-1 shrink-0" />
                      <p className="text-slate-500"><span className="font-bold text-slate-800 dark:text-slate-200">Parent of STU402</span> paid Tuition Fee online ($1,250).</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Background design elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-school-blue/10 blur-3xl z-0" />
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-school-maroon/5 blur-3xl z-0" />
          </div>

        </div>
      </section>

      {/* 2. FEATURES GRID SECTION */}
      <section id="features" className="py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-16">
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-school-blue uppercase tracking-widest bg-school-blue/10 px-3 py-1.5 rounded-full">All-In-One Platform</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">Built for Every School Need</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Explore 12 enterprise-grade ERP modules fully integrated into a single, lightning-fast dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="group relative"
                >
                  <Card className="h-full border border-slate-200/80 dark:border-slate-850 hover:border-school-blue/30 dark:hover:border-school-blue/40 bg-white dark:bg-slate-900 flex flex-col items-start text-left p-6">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-950 text-school-blue group-hover:bg-school-blue group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-5 group-hover:text-school-blue transition-colors">{feat.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{feat.desc}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US (COMPARISON TABLE) */}
      <section id="why-choose-us" className="py-24 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-5xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-school-maroon uppercase tracking-widest bg-school-maroon/10 px-3 py-1.5 rounded-full">Aegis Advantage</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">Why Schools Choose Us</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              See how our modern ERP compares against traditional server-hosted solutions.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 shadow-premium">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-850/40 border-b border-slate-150 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <th className="px-6 py-5 font-bold text-sm">Feature Comparison</th>
                  <th className="px-6 py-5 font-extrabold text-sm text-school-blue">Aegis ERP SaaS</th>
                  <th className="px-6 py-5 font-bold text-sm">Legacy Systems</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-350">
                {[
                  { title: 'Deployment & Setup', us: 'Cloud-instance deployment (5-7 days)', them: 'On-premise servers (3-6 weeks)' },
                  { title: 'RFID & Biometrics integrations', us: 'API-based active integration widgets', them: 'Complex local serial setups' },
                  { title: 'Parent Portal speed', us: 'Responsive web app (3-click payments)', them: 'Slow portals, complex logins' },
                  { title: 'AI & Performance Reporting', us: 'Predictive dropout & GPA trends charts', them: 'Basic static tables (no graphs)' },
                  { title: 'SLA Uptime commitment', us: '99.8% Uptime with backup clusters', them: 'Frequent server downtime crashes' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/10 transition-colors">
                    <td className="px-6 py-4.5 font-bold text-slate-850 dark:text-slate-200">{row.title}</td>
                    <td className="px-6 py-4.5 text-school-blue dark:text-school-greenLight font-semibold flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0 text-school-green" />
                      <span>{row.us}</span>
                    </td>
                    <td className="px-6 py-4.5 text-slate-450 dark:text-slate-500 font-medium flex items-center gap-2">
                      <X className="h-4 w-4 shrink-0 text-red-450" />
                      <span>{row.them}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. MODULES SHOWCASE (INTERACTIVE TABS) */}
      <section id="modules" className="py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-950/10">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-school-green uppercase tracking-widest bg-school-green/10 px-3 py-1.5 rounded-full">Core Showcase</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">Premium Feature Showcase</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Dive deeper into the sub-features of our four biggest admin centers.
            </p>
          </div>

          {/* Tabs header */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {(['admissions', 'academics', 'finance', 'analytics'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full text-sm font-bold border transition-all ${
                  activeTab === tab
                    ? 'bg-school-blue border-school-blue text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Active Tab Card Details */}
          <div className="max-w-4xl mx-auto">
            <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-6 text-left">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{showcaseData[activeTab].title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm font-medium">{showcaseData[activeTab].desc}</p>
                <ul className="grid grid-cols-2 gap-4">
                  {showcaseData[activeTab].points.map((p, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-350">
                      <Check className="h-4 w-4 text-school-green shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 text-center border border-slate-150 dark:border-slate-850">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Metrics/Impact</span>
                <span className="text-2xl font-extrabold text-school-blue dark:text-school-greenLight block leading-tight">
                  {showcaseData[activeTab].stats}
                </span>
                <Button variant="outline" size="sm" className="mt-6 w-full" onClick={openDemoModal}>
                  Request Showcase Demo
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-24 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-school-blue uppercase tracking-widest bg-school-blue/10 px-3 py-1.5 rounded-full">Success Stories</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">Trusted by School Leaders</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Read how principals, board directors, and finance heads evaluate their upgrade to Aegis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <Card key={idx} className="flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8">
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: test.rating }).map((_, rIdx) => (
                      <Star key={rIdx} className="h-4.5 w-4.5 fill-yellow-400 text-yellow-400 shrink-0" />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-350 text-sm italic leading-relaxed">
                    "{test.text}"
                  </p>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-850 pt-4 mt-6 text-left flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-xs font-bold uppercase text-school-blue shrink-0">
                    {test.name.slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{test.name}</h4>
                    <span className="text-xs font-semibold text-slate-400">{test.role}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PRICING SECTION */}
      <section id="pricing" className="py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-school-maroon uppercase tracking-widest bg-school-maroon/10 px-3 py-1.5 rounded-full">Fair Pricing</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">Predictable Plans, Flat Pricing</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Choose the package tailored to your student strength. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Plan 1 */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 flex flex-col justify-between text-left">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Starter Plan</span>
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 block">$149<span className="text-sm font-semibold text-slate-400">/month</span></span>
                </div>
                <p className="text-sm text-slate-500">Perfect for private preschools, kindergartens, or early-learning centers.</p>
                <div className="border-t border-slate-100 dark:border-slate-850 pt-4">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-350"><Check className="h-4 w-4 text-school-green shrink-0" /> Up to 250 Students</li>
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-350"><Check className="h-4 w-4 text-school-green shrink-0" /> Admissions & Student Records</li>
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-350"><Check className="h-4 w-4 text-school-green shrink-0" /> Attendance Ledger</li>
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-350"><Check className="h-4 w-4 text-school-green shrink-0" /> Basic Parent Portal</li>
                  </ul>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-8" onClick={openDemoModal}>Request Demo</Button>
            </Card>

            {/* Plan 2 */}
            <Card className="bg-white dark:bg-slate-900 border-2 border-school-blue p-8 flex flex-col justify-between text-left relative">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-school-blue text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Most Popular</span>
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-school-blue uppercase tracking-widest block">Professional</span>
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 block">$299<span className="text-sm font-semibold text-slate-400">/month</span></span>
                </div>
                <p className="text-sm text-slate-500">Ideal for growing primary and secondary schools requiring detailed financials.</p>
                <div className="border-t border-slate-100 dark:border-slate-850 pt-4">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-350"><Check className="h-4 w-4 text-school-green shrink-0" /> Up to 1000 Students</li>
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-350"><Check className="h-4 w-4 text-school-green shrink-0" /> Everything in Starter</li>
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-350"><Check className="h-4 w-4 text-school-green shrink-0" /> Fee Invoicing & Reminders</li>
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-350"><Check className="h-4 w-4 text-school-green shrink-0" /> Exam Publishing & Gradecards</li>
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-350"><Check className="h-4 w-4 text-school-green shrink-0" /> Teacher & Parent mobile-apps</li>
                  </ul>
                </div>
              </div>
              <Button variant="primary" className="w-full mt-8" onClick={openDemoModal}>Request Demo</Button>
            </Card>

            {/* Plan 3 */}
            <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 flex flex-col justify-between text-left">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Enterprise Plan</span>
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 block">Custom Pricing</span>
                </div>
                <p className="text-sm text-slate-500">Engineered for large-scale multi-campus K-12 systems, colleges, or districts.</p>
                <div className="border-t border-slate-100 dark:border-slate-850 pt-4">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-350"><Check className="h-4 w-4 text-school-green shrink-0" /> Unlimited Students</li>
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-350"><Check className="h-4 w-4 text-school-green shrink-0" /> Multi-Campus Consolidation</li>
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-350"><Check className="h-4 w-4 text-school-green shrink-0" /> Dedicated Cloud Server Instance</li>
                    <li className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-350"><Check className="h-4 w-4 text-school-green shrink-0" /> Custom API & Laravel endpoints</li>
                  </ul>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-8" onClick={openDemoModal}>Request Demo</Button>
            </Card>

          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION SECTION */}
      <section id="faqs" className="py-24 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-4xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-school-blue uppercase tracking-widest bg-school-blue/10 px-3 py-1.5 rounded-full">Got Questions?</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Everything you need to know about setting up and operating Aegis ERP.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-slate-850 dark:text-white"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-school-blue shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronRight className={`h-5 w-5 text-slate-450 shrink-0 transition-transform ${activeFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-6 text-slate-550 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-850 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
