import { motion } from 'framer-motion';
import { 
  BarChart3, CreditCard, Zap, Smartphone, ShieldCheck, Users, Check
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface SubhraEduOnePageProps {
  openDemoModal: () => void;
}

export default function SubhraEduOnePage({ openDemoModal }: SubhraEduOnePageProps) {
  // Modules data for the infinite ribbon and detail cards
  const ribbonModules = [
    { name: 'Admission Enquiry', color: 'bg-blue-600' },
    { name: 'Registration', color: 'bg-blue-600' },
    { name: 'Student Information', color: 'bg-blue-800' },
    { name: 'Student Attendance', color: 'bg-blue-800' },
    { name: 'Alumni', color: 'bg-blue-800' },
    { name: 'Fee & Billing', color: 'bg-emerald-600' },
    { name: 'Online Payment', color: 'bg-emerald-600' },
    { name: 'Transport', color: 'bg-teal-600' },
    { name: 'GPS Tracking', color: 'bg-teal-600' },
    { name: 'Recruitment', color: 'bg-rose-600' },
    { name: 'Staff Info', color: 'bg-rose-600' },
    { name: 'Payroll', color: 'bg-rose-600' },
    { name: 'PMS', color: 'bg-rose-600' },
    { name: 'Staff Attendance', color: 'bg-amber-600' },
    { name: 'Accounting', color: 'bg-emerald-600' },
    { name: 'School Online', color: 'bg-sky-500' },
    { name: 'Examination', color: 'bg-violet-600' },
    { name: 'Lesson Plan', color: 'bg-violet-600' },
    { name: 'Timetable', color: 'bg-violet-600' },
    { name: 'Online Class', color: 'bg-violet-600' },
    { name: 'Inventory', color: 'bg-teal-600' },
    { name: 'CampusMart', color: 'bg-teal-600' },
    { name: 'Library', color: 'bg-teal-600' },
    { name: 'Healthcare', color: 'bg-teal-600' },
    { name: 'SQAAF', color: 'bg-amber-600' },
    { name: 'WhatsApp', color: 'bg-blue-600' },
    { name: 'SMS', color: 'bg-blue-600' },
    { name: 'Parent Portal', color: 'bg-blue-800' },
    { name: 'Staff Portal', color: 'bg-blue-800' },
    { name: 'Dashboard', color: 'bg-blue-800' },
    { name: 'Parent App', color: 'bg-violet-600' },
    { name: 'Staff App', color: 'bg-violet-600' },
    { name: 'Chatbot', color: 'bg-rose-600' }
  ];

  const modulesData = [
    {
      title: 'Admission Management',
      count: '2 Modules',
      desc: 'Convert every enquiry into an enrolment with structured counselor workflows and digital registration.',
      bullets: ['Enquiry + Admission Counselor', 'Registration Management'],
      accentColor: 'border-blue-600',
      bgColor: 'bg-blue-50/50 dark:bg-blue-950/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      icon: '📋'
    },
    {
      title: 'Student Management',
      count: '5 Modules',
      desc: 'Maintain a unified student profile from day one through graduation — academics, behaviour, attendance, and alumni records in one place.',
      bullets: ['Student Information', 'Student Attendance', 'Alumni Management', 'Anecdote', 'Class / School Observation'],
      accentColor: 'border-blue-800',
      bgColor: 'bg-indigo-50/50 dark:bg-indigo-950/20',
      textColor: 'text-indigo-650 dark:text-indigo-400',
      icon: '🎓'
    },
    {
      title: 'Fees Management',
      count: '2 Modules',
      desc: 'Automate fee structures, collect payments online, and eliminate revenue leakage with real-time financial tracking.',
      bullets: ['Fee & Billing Management', 'Online Payment'],
      accentColor: 'border-emerald-600',
      bgColor: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      icon: '💰'
    },
    {
      title: 'Transport Management',
      count: '2 Modules',
      desc: 'Ensure student safety with live GPS tracking, optimised route planning, and real-time parent notifications.',
      bullets: ['Transport Information', 'GPS Integration'],
      accentColor: 'border-teal-600',
      bgColor: 'bg-teal-50/50 dark:bg-teal-950/20',
      textColor: 'text-teal-600 dark:text-teal-400',
      icon: '🚌'
    },
    {
      title: 'HR Management',
      count: '4 Modules',
      desc: 'Streamline the entire employee lifecycle — from recruitment and onboarding to payroll processing and performance appraisals.',
      bullets: ['Recruitment', 'Staff Information', 'Payroll Management', 'PMS & Appraisal'],
      accentColor: 'border-rose-600',
      bgColor: 'bg-rose-50/50 dark:bg-rose-950/20',
      textColor: 'text-rose-600 dark:text-rose-400',
      icon: '👥'
    },
    {
      title: 'Staff Leave & Attendance',
      count: '2 Modules',
      desc: 'Track staff attendance through biometric integration and manage leave applications with automated approval workflows.',
      bullets: ['Staff Attendance (Biometric)', 'Staff Leave'],
      accentColor: 'border-amber-600',
      bgColor: 'bg-amber-50/50 dark:bg-amber-950/20',
      textColor: 'text-amber-600 dark:text-amber-400',
      icon: '📅'
    },
    {
      title: 'Finance / Accounting',
      count: '1 Module',
      desc: "Manage your school's books with audit-ready financial accounting that keeps every transaction transparent and traceable.",
      bullets: ['Financial Accounting'],
      accentColor: 'border-emerald-600',
      bgColor: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      icon: '📊'
    },
    {
      title: 'School Online',
      count: '1 Module',
      desc: 'Give your school a powerful digital presence with a branded online portal that connects every stakeholder seamlessly.',
      bullets: ['School Online Portal'],
      accentColor: 'border-sky-500',
      bgColor: 'bg-sky-50/50 dark:bg-sky-950/20',
      textColor: 'text-sky-500 dark:text-sky-400',
      icon: '🌐'
    },
    {
      title: 'Academics',
      count: '5 Modules',
      desc: 'Drive academic excellence with smart timetabling, structured lesson plans, automated report cards, and online assessments.',
      bullets: ['Examination / Report Cards', 'Lesson Planning', 'Timetable Substitution', 'Online Class', 'Online Assessment'],
      accentColor: 'border-violet-600',
      bgColor: 'bg-violet-50/50 dark:bg-violet-950/20',
      textColor: 'text-violet-600 dark:text-violet-400',
      icon: '📚'
    },
    {
      title: 'Ops / Inventory',
      count: '6 Modules',
      desc: 'Run every campus operation efficiently — from inventory and library to visitor management, healthcare, and events.',
      bullets: ['Inventory Management', 'CampusMart', 'Library Management', 'Visitor Management', 'Healthcare / Hospital Mgmt', 'Event Management'],
      accentColor: 'border-teal-600',
      bgColor: 'bg-teal-50/50 dark:bg-teal-950/20',
      textColor: 'text-teal-600 dark:text-teal-400',
      icon: '🏫'
    },
    {
      title: 'SQAAF (Quality Control)',
      count: '1 Module',
      desc: 'Meet accreditation standards with a structured quality assurance framework that benchmarks and elevates school performance.',
      bullets: ['SQAAF Accreditation Framework'],
      accentColor: 'border-amber-600',
      bgColor: 'bg-amber-50/50 dark:bg-amber-950/20',
      textColor: 'text-amber-600 dark:text-amber-400',
      icon: '✅'
    },
    {
      title: 'Communication',
      count: '4 Modules',
      desc: 'Reach every parent, teacher, and student instantly through WhatsApp, SMS, email, and in-app notifications — all from one place.',
      bullets: ['App & Portal — Internal', 'SMS', 'Email', 'WhatsApp'],
      accentColor: 'border-blue-600',
      bgColor: 'bg-blue-50/50 dark:bg-blue-950/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      icon: '💬'
    },
    {
      title: 'Portal / Dashboard',
      count: '6 Portals',
      desc: 'Give every stakeholder their own window into school performance — from parents and staff to principals and central management.',
      bullets: ['Parent / Student Portal', 'Staff Portal', 'Principal Dashboard', 'Management Dashboard', 'Central Dashboard', 'Utilisation Dashboard'],
      accentColor: 'border-blue-800',
      bgColor: 'bg-indigo-50/50 dark:bg-indigo-950/20',
      textColor: 'text-indigo-650 dark:text-indigo-400',
      icon: '📈'
    },
    {
      title: 'Mobile Application',
      count: '4 Apps',
      desc: 'Put the entire school in everyone\'s pocket with dedicated apps for parents, staff, principals, and management — 20L+ downloads and counting.',
      bullets: ['Parent App', 'Staff App', 'Principal App', 'Management App'],
      accentColor: 'border-violet-600',
      bgColor: 'bg-violet-50/50 dark:bg-violet-950/20',
      textColor: 'text-violet-600 dark:text-violet-400',
      icon: '📱'
    },
    {
      title: 'Chatbot',
      count: '3 Chatbots',
      desc: 'Answer parent queries, guide website visitors, and assist ERP users around the clock with intelligent AI-powered chatbots.',
      bullets: ['Website Chatbot', 'ERP Chatbot', 'Parent Portal Chatbot'],
      accentColor: 'border-rose-600',
      bgColor: 'bg-rose-50/50 dark:bg-rose-950/20',
      textColor: 'text-rose-600 dark:text-rose-400',
      icon: '🤖'
    }
  ];

  const testimonials = [
    {
      initials: 'DV',
      name: 'Deepak Vivek',
      school: 'Aditya Birla Public School, Muri, Jharkhand',
      text: "SubhraEdu's school ERP has transformed our administration, bringing clarity, efficiency, and structure to everyday operations. The intuitive platform, reliable performance, and responsive support have simplified complex tasks and improved data accuracy."
    },
    {
      initials: 'GJ',
      name: 'Ginsmon Jose',
      school: 'Don Bosco School, Alaknanda, New Delhi',
      text: "The ERP platform brought clarity, structure, and efficiency to our administrative tasks, making previously manual processes smooth and easy to manage. Its simple design, accurate reports, and smooth workflow have increased our productivity."
    },
    {
      initials: 'AJ',
      name: 'Ajeet James',
      school: "St. Joseph's Convent Sr. Sec. School, MP",
      text: 'Collaborating with SubhraEdu over 11 years has been truly rewarding. Their ERP brought exceptional transparency, efficiency, and precision to our daily operations. Every query is handled promptly with a strong commitment to innovation.'
    },
    {
      initials: 'GK',
      name: 'Geeta Kapur',
      school: 'Pragati Public School, Dwarka, Delhi',
      text: 'We are associated with SubhraEdu for 8 years and have found their ERP solutions to be reliable, user-friendly, and well-aligned with the operational needs of schools. The support team is responsive, ensuring smooth functioning.'
    },
    {
      initials: 'WH',
      name: 'Wisdom High Group',
      school: 'Wisdom High Group of Schools, Nashik',
      text: 'We were associated with SubhraEdu for 12 years. After briefly switching, we returned — the transition was smooth with seamless data migration and quick stabilisation. SubhraEdu remains unmatched in school management software.'
    },
    {
      initials: 'RO',
      name: 'Regi Oommen',
      school: "St. Paul's School, Hauz Khas, New Delhi",
      text: 'SubhraEdu has been associated with St. Paul\'s for 22 years. We have seen significant progress, particularly in financial accounting. Continued enhancement in process integration strengthens our efficiency every year.'
    }
  ];

  return (
    <div className="relative bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 bg-gradient-to-br from-[#eff6ff] via-[#f8fbff] to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-850">
        {/* Animated backdrop grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b60_1px,transparent_1px),linear-gradient(to_bottom,#1e293b60_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-20 right-[-10%] w-[550px] h-[550px] rounded-full bg-blue-600/5 dark:bg-blue-400/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[5%] w-[450px] h-[450px] rounded-full bg-emerald-500/5 dark:bg-emerald-400/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 text-left">
          
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-900/30 px-3.5 py-1.5 rounded-full text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              25 Years · 2,300+ Schools · 20L+ Downloads
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              Introducing <span className="bg-gradient-to-r from-rose-500 via-blue-600 to-emerald-500 bg-clip-text text-transparent">SubhraEdu One</span> — The Only School Management Software Your School Will Ever Need.
            </h1>

            {/* Subtitle */}
            <p className="text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-semibold max-w-2xl">
              SubhraEdu One reduces effort, cost, and time by making the invisible visible. It improves efficiency, builds a performance-driven culture, enhances the school’s P&L year-on-year, and helps position the school as the number one choice for parents.
            </p>

            {/* Target Stakeholders */}
            <div className="flex gap-2 flex-wrap text-xs font-bold text-slate-600 dark:text-slate-400">
              {['Management', 'Principals', 'Teachers', 'Admin Staff', 'Students', 'Parents'].map((stakeholder) => (
                <span key={stakeholder} className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
                  {stakeholder}
                </span>
              ))}
            </div>

            {/* CTA Button Row */}
            <div className="flex items-center gap-4 flex-wrap pt-2">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={openDemoModal} 
                className="bg-[#2563eb] hover:bg-[#1d4ed8] border-none font-bold text-white shadow-lg hover:shadow-xl transition-all uppercase tracking-wider text-xs"
              >
                Register for Demo →
              </Button>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">No commitment required</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/80">
              {[
                { val: '2,300+', label: 'Schools' },
                { val: '25 yrs', label: 'Trust' },
                { val: '500+', label: 'Reports' },
                { val: '400+', label: 'Team' }
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

          {/* Right Side Card Graphics */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Float Card A */}
            <motion.div 
              initial={{ y: 0 }}
              animate={{ y: [-6, 6, -6] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="absolute top-4 right-[-10px] sm:right-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl z-20 text-left min-w-[170px]"
            >
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Fee Collection
              </div>
              <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">₹24.5L</span>
              <span className="text-[9px] font-medium text-slate-400">Collected this month</span>
            </motion.div>

            {/* Float Card C */}
            <motion.div 
              initial={{ y: 0 }}
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 3 }}
              className="absolute bottom-[-10px] right-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl z-20 text-left min-w-[170px]"
            >
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Enquiries
              </div>
              <span className="block text-2xl font-black text-amber-500 dark:text-amber-405 mt-1">47</span>
              <span className="text-[9px] font-medium text-slate-400">This week via CRM</span>
            </motion.div>

            {/* Hero Main Image */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl z-10">
              <img 
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&q=85" 
                alt="Happy students collaborating in a modern school classroom"
                className="w-full h-full object-cover transform hover:scale-[1.03] transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE RUNNING RIBBON */}
      <section className="w-full bg-slate-50 dark:bg-slate-950 py-4 overflow-hidden border-t border-b border-slate-200/80 dark:border-slate-800/80 relative z-20">
        <div className="flex w-max relative">
          <motion.div 
            animate={{ x: [0, -1920] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 45,
                ease: 'linear',
              },
            }}
            className="flex gap-8 whitespace-nowrap text-xs font-bold text-slate-400 dark:text-slate-500"
          >
            {/* First list copy */}
            {ribbonModules.map((m, idx) => (
              <div key={idx} className="flex items-center gap-2 px-1">
                <span className={`h-1.5 w-1.5 rounded-full ${m.color}`} />
                <span>{m.name}</span>
              </div>
            ))}
            {/* Second list duplicate for seamless scrolling */}
            {ribbonModules.map((m, idx) => (
              <div key={`dup-${idx}`} className="flex items-center gap-2 px-1">
                <span className={`h-1.5 w-1.5 rounded-full ${m.color}`} />
                <span>{m.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. STAKEHOLDER PAGES: SPLIT LAYOUTS */}
      
      {/* MANAGEMENT */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          {/* Image */}
          <div className="lg:col-span-6 relative group">
            <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-400/5 rounded-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-500" />
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=85" 
                alt="School management team reviewing dashboard metrics"
                className="w-full h-80 md:h-[400px] object-cover hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute bottom-5 right-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-lg flex flex-col items-center min-w-[100px]">
                <span className="text-xl font-extrabold text-[#2563eb]">500+</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">MIS Reports</span>
              </div>
            </div>
          </div>
          {/* Text content */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-[#2563eb] uppercase tracking-widest">For School Authorities & Management</span>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              See Everything. <span className="text-blue-600 dark:text-sky-400">Miss Nothing.</span>
            </h2>
            <p className="text-xs md:text-sm font-semibold italic text-slate-400 dark:text-slate-500 border-l-2 border-blue-500 pl-4 leading-relaxed">
              "What gets measured, gets done — and quality improves."
            </p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              School authorities and management need clarity, not complexity. SubhraEdu One brings admissions, finance, academics, attendance, and operations into one real-time dashboard — so every decision is backed by data, not assumption.
            </p>
            {/* Features check list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
              {[
                'Real-time fee and revenue tracking',
                '500+ MIS reports for audits',
                'Staff and student performance',
                'Multi-branch central dashboard'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-emerald-550/10 rounded-full flex items-center justify-center shrink-0">
                    <Check className="h-3.5 w-3.5 text-emerald-605 font-bold" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <Button variant="primary" size="md" onClick={openDemoModal} className="bg-[#2563eb] hover:bg-[#1d4ed8] border-none font-bold text-white text-xs tracking-wider">
                Register for Demo →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TEACHERS */}
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          {/* Text content */}
          <div className="lg:col-span-6 space-y-6 lg:order-2">
            <span className="text-xs font-bold text-[#059669] uppercase tracking-widest">For Teachers & Admin Staff</span>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Teach More. <span className="text-emerald-600 dark:text-emerald-400">File Less.</span>
            </h2>
            <p className="text-xs md:text-sm font-semibold italic text-slate-400 dark:text-slate-500 border-l-2 border-emerald-500 pl-4 leading-relaxed">
              "Build a companion for teachers to excel — and build happy students."
            </p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Teachers spend too many hours on paperwork that software should handle. SubhraEdu One automates attendance, report cards, lesson planning, and timetable management — giving educators back their most valuable resource: time in the classroom.
            </p>
            {/* Features check list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
              {[
                'One-tap attendance from any device',
                'Auto-generated report cards',
                'Lesson plan tracking tools',
                'Instant substitution alerts'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-emerald-550/10 rounded-full flex items-center justify-center shrink-0">
                    <Check className="h-3.5 w-3.5 text-emerald-605 font-bold" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <Button variant="primary" size="md" onClick={openDemoModal} className="bg-[#2563eb] hover:bg-[#1d4ed8] border-none font-bold text-white text-xs tracking-wider">
                Register for Demo →
              </Button>
            </div>
          </div>
          {/* Image */}
          <div className="lg:col-span-6 lg:order-1 relative group">
            <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-400/5 rounded-2xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=85" 
                alt="Teacher conducting a class with modern tablet interface"
                className="w-full h-80 md:h-[400px] object-cover hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute bottom-5 right-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-lg flex flex-col items-center min-w-[100px]">
                <span className="text-xl font-extrabold text-[#059669]">80%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Less Paperwork</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARENTS */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          {/* Image */}
          <div className="lg:col-span-6 relative group">
            <div className="absolute inset-0 bg-rose-500/10 dark:bg-rose-400/5 rounded-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-500" />
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=85" 
                alt="Parent and child using a school mobile app"
                className="w-full h-80 md:h-[400px] object-cover hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute bottom-5 right-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-lg flex flex-col items-center min-w-[100px]">
                <span className="text-xl font-extrabold text-[#e11d48]">20L+</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Downloads</span>
              </div>
            </div>
          </div>
          {/* Text content */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-[#e11d48] uppercase tracking-widest">For Parents & Students</span>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Every Grade. Every Update. <span className="text-rose-600 dark:text-rose-455">Right on Your Phone.</span>
            </h2>
            <p className="text-xs md:text-sm font-semibold italic text-slate-400 dark:text-slate-500 border-l-2 border-rose-500 pl-4 leading-relaxed">
              "Stay connected with your child's progress — with full transparency."
            </p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              No more waiting for parent–teacher meetings. Grades, attendance, fee receipts, homework, school circulars, and live bus tracking — everything parents need is on the SubhraEdu One mobile app, updated in real time. Students access assignments, study materials, and their own portal.
            </p>
            {/* Features check list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
              {[
                'Real-time grades and attendance',
                'Online fee payment with receipts',
                'WhatsApp & push notifications',
                'Live GPS bus tracking'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="h-5 w-5 bg-emerald-550/10 rounded-full flex items-center justify-center shrink-0">
                    <Check className="h-3.5 w-3.5 text-emerald-605 font-bold" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <Button variant="primary" size="md" onClick={openDemoModal} className="bg-[#2563eb] hover:bg-[#1d4ed8] border-none font-bold text-white text-xs tracking-wider">
                Register for Demo →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DARK BAND SECTION */}
      <section className="w-full bg-[#0f172a] text-white py-16 md:py-24 relative overflow-hidden text-left border-y border-slate-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-center">
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              One Subscription. 35+ Modules.<br />
              <span className="bg-gradient-to-r from-rose-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">Every Future Module Included.</span>
            </h2>
            <p className="text-xs md:text-sm font-semibold italic text-slate-400 uppercase tracking-widest leading-relaxed">
              "Delegate to technology. Build accountability. Focus on growth."
            </p>
            <p className="text-sm font-semibold text-slate-350 leading-relaxed max-w-3xl">
              No per-module charges. No upgrade fees. Every new module we build is automatically added to your subscription. Technology runs around the clock with zero human errors. That is the SubhraEdu One promise.
            </p>
            {/* Module Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                'Student Information System', 'School ERP', 'Fees & Finance', 
                'Mobile Apps', '500+ Reports', 'Chatbots', 'Future Modules ∞'
              ].map((chip, idx) => (
                <span key={idx} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            {[
              { val: '1', label: 'Subscription' },
              { val: '35+', label: 'Modules' },
              { val: '15', label: 'Categories' },
              { val: '500+', label: 'Reports' }
            ].map((box, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center shadow-lg hover:bg-white/10 transition-colors">
                <span className="block text-3xl md:text-4xl font-black text-white">{box.val}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{box.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MODULES GRID SECTION */}
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950/40" id="modules">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#2563eb] uppercase tracking-widest">35+ Modules · 15 Categories</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              India's Most Powerful <span className="italic font-bold text-blue-600 dark:text-sky-400">Student Information System</span>
            </h2>
            <p className="text-xs md:text-sm font-semibold italic text-slate-400 dark:text-slate-500">
              "Power your school with technology. Be the No. 1 choice in your locality."
            </p>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Every process your school runs — from the first admission enquiry to alumni records — handled in one platform.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modulesData.map((m, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group flex flex-col justify-between text-left`}
              >
                {/* Visual Accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-[4px] bg-blue-600 border-l-4 ${m.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="space-y-4">
                  {/* Header info */}
                  <div className="flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg shrink-0">
                      {m.icon}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">{m.title}</h4>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mt-0.5">{m.count}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    {m.desc}
                  </p>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col gap-1.5">
                    {m.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2 text-[11px] font-semibold text-slate-650 dark:text-slate-350">
                        <span className="h-1 w-1 bg-slate-400 dark:bg-slate-600 rounded-full shrink-0" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Future Proof Banner */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-950 border border-blue-150/40 dark:border-blue-900/30 text-left flex flex-col sm:flex-row gap-6 items-start">
            <div className="h-12 w-12 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-sky-400 flex items-center justify-center text-2xl shrink-0">
              🚀
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">Future-Proof Guarantee</h4>
              <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                Every new module we build is automatically added to your subscription at no additional cost. Your school management software keeps evolving — without another purchase order.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. BEFORE/AFTER COMPARISON SECTION */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 text-left">
        <div className="space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#2563eb] uppercase tracking-widest font-black">The Transformation</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              What Changes When You <span className="italic font-bold text-[#2563eb] dark:text-sky-400">Switch to SubhraEdu One?</span>
            </h2>
            <p className="text-xs md:text-sm font-semibold italic text-slate-450 dark:text-slate-500">
              "Come! Let us improve productivity, efficiency, and brand value."
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
            {/* Without Card */}
            <div className="lg:col-span-5 p-8 rounded-3xl border border-red-200/50 bg-red-50/20 dark:border-red-900/30 dark:bg-red-950/10 space-y-6">
              <h3 className="text-lg font-black text-red-650 dark:text-red-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-650" />
                Without SubhraEdu One
              </h3>
              <ul className="space-y-3.5">
                {[
                  'Multiple disconnected software systems for different tasks',
                  'Manual attendance, report cards, and timetable generation',
                  'Fee defaulters tracked on spreadsheets with frequent errors',
                  'Parents calling the front office for every update',
                  'No centralised data — decisions based on gut feeling',
                  'Staff overwhelmed with administrative paperwork'
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs font-bold text-slate-650 dark:text-slate-400 leading-relaxed">
                    <span className="text-red-600 shrink-0">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vs Badge */}
            <div className="lg:col-span-2 flex items-center justify-center">
              <span className="h-12 w-12 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md flex items-center justify-center text-sm font-black text-slate-405">
                vs
              </span>
            </div>

            {/* With Card */}
            <div className="lg:col-span-5 p-8 rounded-3xl border border-emerald-200/50 bg-emerald-50/20 dark:border-emerald-900/30 dark:bg-emerald-950/10 space-y-6">
              <h3 className="text-lg font-black text-emerald-650 dark:text-emerald-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-650" />
                With SubhraEdu One
              </h3>
              <ul className="space-y-3.5">
                {[
                  'One unified platform for 35+ school operations',
                  'Automated attendance, report cards, and smart timetabling',
                  'Real-time fee tracking with online payments and reminders',
                  'Parents get instant updates via app, WhatsApp, and SMS',
                  '500+ MIS reports powering data-driven decisions daily',
                  'Teachers reclaim hours every week for actual teaching'
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                    <span className="text-emerald-600 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. STAKEHOLDERS GRID SECTION */}
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950/40 text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#2563eb] uppercase tracking-widest font-black">Built for Every Stakeholder</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              One Platform. <span className="italic font-bold text-blue-600 dark:text-sky-400">Everyone Connected.</span>
            </h2>
            <p className="text-xs md:text-sm font-semibold italic text-slate-450 dark:text-slate-500">
              "Schools, students, parents, teachers, admin — together on one platform."
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=85',
                title: 'Principals & Trustees',
                desc: 'Every metric, every department — one dashboard away.'
              },
              {
                img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=85',
                title: 'Teachers & Staff',
                desc: 'Less admin. More teaching. Happier classrooms.'
              },
              {
                img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=85',
                title: 'Students',
                desc: 'Grades, assignments, notes — one student portal.'
              },
              {
                img: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=600&q=85',
                title: 'Parents',
                desc: 'Real-time updates. Full transparency. Peace of mind.'
              }
            ].map((s, idx) => (
              <div 
                key={idx}
                className="relative group rounded-3xl overflow-hidden shadow-md aspect-[3/4] border border-slate-200/50 dark:border-slate-800"
              >
                <img 
                  src={s.img} 
                  alt={s.title}
                  className="w-full h-full object-cover transform group-hover:scale-[1.04] transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 text-white text-left">
                  <h4 className="text-base font-black uppercase tracking-wide">{s.title}</h4>
                  <p className="text-xs text-slate-300 font-semibold leading-relaxed mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. WHY SECTION */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 text-left">
        <div className="space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#2563eb] uppercase tracking-widest font-black">Why Schools Choose SubhraEdu One</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Trusted by 2,300+ Schools <span className="italic font-bold text-[#2563eb] dark:text-sky-400">for 25 Years</span>
            </h2>
            <p className="text-xs md:text-sm font-semibold italic text-slate-450 dark:text-slate-500">
              "Accelerate the efficiency of people, processes, and products."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: '500+ Real-Time Reports',
                desc: 'Admissions, attendance, finance, academics — one dashboard, always live.',
                iconBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400'
              },
              {
                icon: CreditCard,
                title: 'Zero Revenue Leakage',
                desc: 'Automated fee collection, online payments, and audit-ready accounting.',
                iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450'
              },
              {
                icon: Zap,
                title: '80% Less Admin Work',
                desc: 'Automate attendance, timetables, report cards, payroll, and communication.',
                iconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-450'
              },
              {
                icon: Smartphone,
                title: '20L+ App Downloads',
                desc: 'Dedicated apps for parents, staff, principals, and management.',
                iconBg: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-405'
              },
              {
                icon: ShieldCheck,
                title: 'Enterprise Security',
                desc: 'Encrypted data, role-based access, backups, and 99.9% uptime.',
                iconBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-455'
              },
              {
                icon: Users,
                title: '400+ Dedicated Team',
                desc: 'Dedicated account manager, priority support, and hands-on training.',
                iconBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-405'
              }
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                      <IconComp className="h-5.5 w-5.5" />
                    </div>
                    <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. HOW SECTION: TIMELINE */}
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950/40 text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#2563eb] uppercase tracking-widest font-black">Getting Started</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Go Live in Days. <span className="italic font-bold text-blue-600 dark:text-sky-400">Not Months.</span>
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
              Switching your school management software should not be painful. Our proven timeline ensures absolute data accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Discovery Call',
                desc: 'We study your school workflows, identify operational bottlenecks, and define software modules setup with your team.'
              },
              {
                step: '02',
                title: 'Data Migration',
                desc: 'Our onboarding database experts securely import all records, directories, and financial files from your legacy platforms.'
              },
              {
                step: '03',
                title: 'Staff Training',
                desc: 'We run structured, hands-on workshops until every teacher, coordinator, and office clerk is completely confident.'
              },
              {
                step: '04',
                title: 'System Go Live',
                desc: 'Your campus launches the cloud platform with a dedicated local account manager available around the clock.'
              }
            ].map((step, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <span className="block text-3xl font-black text-blue-600/20 dark:text-sky-400/20 leading-none">
                    {step.step}
                  </span>
                  <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">{step.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIALS SECTION */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 text-left">
        <div className="space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#2563eb] uppercase tracking-widest font-black">Voice of Success</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              From Our <span className="italic font-bold text-blue-600 dark:text-sky-400">Esteemed Partners</span>
            </h2>
            <p className="text-xs md:text-sm font-semibold italic text-slate-450 dark:text-slate-500">
              "Why schools prefer SubhraEdu School ERP Software"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <span className="block text-amber-500 text-xs font-bold tracking-wider">★★★★★</span>
                  <p className="text-xs md:text-sm font-semibold italic text-slate-600 dark:text-slate-350 leading-relaxed">
                    "{t.text}"
                  </p>
                </div>
                <div className="flex items-center gap-3.5 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center font-black text-xs text-white shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 dark:text-white text-xs">{t.name}</h4>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">{t.school}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. PRICING SECTION */}
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950/40 text-left border-t border-slate-100 dark:border-slate-900" id="pricing">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-[#2563eb] uppercase tracking-widest font-black">Pricing Plans</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              One Plan. <span className="italic font-bold text-blue-600 dark:text-sky-400">Everything Included.</span>
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto text-center">
              Custom subscription options based on your institution's strength. No hidden costs. No per-module charge.
            </p>
          </div>

          <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border-2 border-blue-600 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden text-center">
            {/* Top Stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-blue-600 to-emerald-500" />
            
            <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-900/30 px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4">
              SubhraEdu One • Premium Enterprise
            </span>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">All-in-One School ERP</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">35+ modules today · every future module included</p>

            <div className="py-6 border-t border-b border-slate-100 dark:border-slate-800 my-6 space-y-3.5 text-left">
              {[
                'All 35+ modules — zero add-on fees',
                'Every future module included automatically',
                'Unlimited users — management, teachers, staff, students & parents',
                'Dedicated mobile apps for parents, staff & principals',
                'WhatsApp, SMS, and email communication built in',
                'Dedicated account manager for your school',
                'Hassle-free data migration and onboarding',
                '500+ reports and 99.9% uptime guarantee'
              ].map((bullet, idx) => (
                <div key={idx} className="flex gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">✓</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            <Button 
              variant="primary" 
              size="lg" 
              onClick={openDemoModal} 
              className="bg-[#2563eb] hover:bg-[#1d4ed8] border-none font-bold text-white shadow-lg w-full py-3.5 uppercase tracking-wider text-xs"
            >
              Register for Demo →
            </Button>
          </div>
        </div>
      </section>

      {/* 12. BOTTOM CTA SECTION */}
      <section className="bg-slate-950 text-white py-20 px-6 relative overflow-hidden border-t border-slate-900 text-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            The School Management Software That <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Runs Itself.</span>
          </h2>
          <p className="text-xs md:text-sm font-semibold italic text-slate-400 uppercase tracking-widest leading-relaxed">
            "Fascinate the society with leading best practices. Build a data-driven culture."
          </p>
          <p className="text-sm font-semibold text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join 2,300+ schools. Built for management, teachers, admin staff, students, and parents. Experience seamless efficiency.
          </p>
          <div className="pt-4 flex justify-center gap-4 flex-wrap">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={openDemoModal} 
              className="bg-white hover:bg-slate-100 border-none font-black text-slate-950 shadow-xl py-3 px-8 text-xs uppercase tracking-wider"
            >
              Register for Demo →
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
