import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Clock, ShieldCheck, Smartphone, Laptop, Wifi, Users, Calendar, 
  Truck, Play, ClipboardList, Info, Search, Settings
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface PreSchoolManagementPageProps {
  openDemoModal: () => void;
}

type TimelineKey = 'arrival' | 'meal' | 'play' | 'nap' | 'departure';
type FunctionKey = 'enquiry' | 'attendance' | 'transport' | 'admission' | 'fees' | 'mis' | 'sis' | 'staff' | 'communication' | 'performance' | 'staff_att';

export default function PreSchoolManagementPage({ openDemoModal }: PreSchoolManagementPageProps) {
  // 1. Timeline State
  const [activeTime, setActiveTime] = useState<TimelineKey>('arrival');

  // 2. Functions State
  const [activeFunc, setActiveFunc] = useState<FunctionKey>('enquiry');

  const timelineConfig = [
    { key: 'arrival', label: '08:30 AM', title: 'Arrival & QR Check-in', desc: 'Arjun arrives at preschool. Staff scans QR code on the parent app. Profile logs present status, and parent receives a push notification.', icon: Clock, detail: 'Sanitisation & Temperature check: 36.5°C (Normal) • Drop-off by Father.' },
    { key: 'meal', label: '10:00 AM', title: 'Nutritious Snack Time', desc: 'Children gather for breakfast. Teachers log meal intake stats on their mobile portal.', icon: Clock, detail: 'Menu: Apple Slices & Oats Porridge • Intake: Finished everything • Water: 1.5 cups.' },
    { key: 'play', label: '11:30 AM', title: 'Story Circle & Play', desc: 'Creative activity focusing on motor skills development. Teachers share snapshots of kids playing.', icon: Heart, detail: 'Activity: Building blocks & Nursery rhyme recitation • Peer interaction: Excellent.' },
    { key: 'nap', label: '01:00 PM', title: 'Afternoon Nap Log', desc: 'Toddlers rest in the nursery room. Sleep start and end times are auto-recorded.', icon: Clock, detail: 'Duration: 1 hr 15 mins (13:00 - 14:15) • Rest level: Quiet & Peaceful.' },
    { key: 'departure', label: '02:00 PM', title: 'Safe Check-out Scan', desc: 'Pickup scanner verifies parent credentials. Guardian signature checked before hand-off.', icon: ShieldCheck, detail: 'Picked up by Mother • Time: 14:05 • Verification ID: Verified ✓.' }
  ];

  const functionsConfig: Record<FunctionKey, { label: string; icon: any; title: string; desc: string; workflow: string }> = {
    enquiry: {
      label: 'Enquiry Management',
      icon: Search,
      title: 'Enquiry Tracker & Admissions Pipeline',
      desc: 'Tracks prospective admissions, sibling profiles, walk-in enquiries, and follows up automatically via SMS templates.',
      workflow: 'Lead captured online -> Auto SMS welcome message -> Scheduled campus walkthrough log -> Status updated.'
    },
    attendance: {
      label: 'Student Attendance',
      icon: ClipboardList,
      title: 'Digital Roll-Calls & Safety Notices',
      desc: 'Enables teachers to log presence lists, health checks, and notify parents of unexplained absences in under 2 minutes.',
      workflow: 'Teacher marks attendance via app -> Auto push sync to parents -> Database audit report compiled.'
    },
    transport: {
      label: 'Transport Management',
      icon: Truck,
      title: 'Real-time GPS Tracking & Routing',
      desc: 'Monitors school buses and shuttle routes, alerting parents when the pickup vehicle is 5 minutes away.',
      workflow: 'Bus GPS starts -> Parent app shows live coordinates -> Notification triggered on approaching stop.'
    },
    admission: {
      label: 'Admission Process',
      icon: Users,
      title: 'Paperless Digital Registrations',
      desc: 'Simplifies admission files, document uploads, family profiles creation, and registration fee settlement.',
      workflow: 'Parent fills online form -> Verifier confirms documentation -> Admission ID allocated -> Portal enabled.'
    },
    fees: {
      label: 'Online Fee Payment',
      icon: Laptop,
      title: 'Cashless Fee Settlement gateway',
      desc: 'Provides secure, cashless online fee settlement options with automatic receipts generated and ledger sync.',
      workflow: 'Dues mapped to parent portal -> Parent pays via UPI/Cards -> Digital receipt generated -> Bank settlement synced.'
    },
    mis: {
      label: 'Management Info System',
      icon: Settings,
      title: 'Ready-to-Use MIS Analytics',
      desc: 'Compiles financial dashboards, enrollment trends, staff logs, and regulatory compliance registers for founders.',
      workflow: 'Daily operations logged -> Central server runs data analytics -> Visual charts outputted for management review.'
    },
    sis: {
      label: 'Student Info System',
      icon: Info,
      title: 'Centralised Student Badges & Bio',
      desc: 'Houses contact details, allergy lists, health histories, developmental charts, and sibling details.',
      workflow: 'Data captured at entry -> Encrypted profile generated -> Teachers access medical flags instantly when needed.'
    },
    staff: {
      label: 'Staff Information Management',
      icon: Laptop,
      title: 'Educator Profiles & Payroll Logs',
      desc: 'Manages educator credentials, schedules, payroll statements, payslip downloads, and training certificates.',
      workflow: 'Staff details compiled -> Salary mapped -> Payslips generated on-portal -> Training hours audited.'
    },
    communication: {
      label: 'Parent Communication',
      icon: Smartphone,
      title: 'Unified Chat & Push Broadcasts',
      desc: 'Eliminates fragmented WhatsApp groups with official chat rooms, circular distribution, and instant media broadcasts.',
      workflow: 'Admin uploads circular PDF -> Parents receive instant notification -> Read-receipt stats tracked.'
    },
    performance: {
      label: 'Performance Management',
      icon: Heart,
      title: 'Early Milestones Developmental logs',
      desc: 'Monitors early childhood motor skills, cognitive markers, social behavior progress, and vocabulary charts.',
      workflow: 'Teacher logs monthly developmental checklist -> AI compiles progress graphs -> Custom reports shared.'
    },
    staff_att: {
      label: 'Staff Attendance',
      icon: Calendar,
      title: 'Educator Rota & Leave Approvals',
      desc: 'Registers staff attendance, check-in schedules, leave balances, substitution logs, and payroll integrations.',
      workflow: 'Staff checks in via biometric/app -> Admin portal audits schedules -> Substitution assigned for leaves.'
    }
  };

  const stepsConfig = [
    { step: 1, title: 'Register & Purchase', desc: "Click on 'Register & Purchase' on our portal, and fill up the quick registration form to choose your plan." },
    { step: 2, title: 'Submit Details', desc: 'Fill up the basic preschool information worksheet received in your inbox to map your campuses.' },
    { step: 3, title: 'Set Up Formalities', desc: 'SubhraEdu teams complete the server setup and database allocations, emailing your login credentials.' },
    { step: 4, title: 'Portal Launch', desc: 'Access your dedicated School Management Portal, and download the teacher/parent mobile apps.' },
    { step: 5, title: 'Pay Online', desc: 'Pay your subscription amount online and start enjoying India\'s most preferred preschool system.' }
  ];

  return (
    <div className="relative bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 bg-gradient-to-br from-pink-50 via-rose-50/30 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-850">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ec489908_1px,transparent_1px),linear-gradient(to_bottom,#ec489908_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ec489905_1px,transparent_1px),linear-gradient(to_bottom,#ec489905_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-500/5 dark:bg-pink-400/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[5%] w-[450px] h-[450px] rounded-full bg-rose-500/5 dark:bg-rose-400/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 text-left">
          
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-pink-50 dark:bg-pink-950/40 border border-pink-200/50 dark:border-pink-900/30 px-3.5 py-1.5 rounded-full text-[11px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
              CampusKidz™ Preschool Suite
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              Preschool Management <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 bg-clip-text text-transparent">Software</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-semibold max-w-2xl">
              ChildCare Software to Track Child Activity & Development. Streamline administrative tasks and keep parents connected with real-time health, meals, nap updates, and photo diaries.
            </p>

            {/* Download Badges */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="https://play.google.com/store/apps/details?id=com.campuscare.entab.ui" target="_blank" rel="noopener noreferrer" className="bg-slate-950 text-white rounded-xl px-4 py-2 flex items-center gap-2.5 border border-slate-800 shadow hover:scale-[1.02] active:scale-[0.98] transition-all">
                <Play className="h-5 w-5 text-pink-500" />
                <div className="text-left leading-tight text-[10px] font-bold">
                  <span className="block text-[7px] text-slate-400 font-bold uppercase">Google Play</span>
                  <span className="block text-xs font-black">CampusKidz App</span>
                </div>
              </a>
              
              <a href="https://apps.apple.com/in/app/Campus/id1034721587" target="_blank" rel="noopener noreferrer" className="bg-slate-950 text-white rounded-xl px-4 py-2 flex items-center gap-2.5 border border-slate-800 shadow hover:scale-[1.02] active:scale-[0.98] transition-all">
                <Smartphone className="h-5 w-5 text-indigo-400" />
                <div className="text-left leading-tight text-[10px] font-bold">
                  <span className="block text-[7px] text-slate-400 font-bold uppercase">App Store</span>
                  <span className="block text-xs font-black">CampusKidz App</span>
                </div>
              </a>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 pt-2">
              <Button 
                variant="primary" 
                size="md" 
                onClick={openDemoModal} 
                className="bg-pink-600 hover:bg-pink-700 border-none font-bold text-white shadow-lg text-xs uppercase tracking-wider"
              >
                Request For Demo
              </Button>
            </div>
          </div>

          {/* Right Side Visual - Phone mockup showing active feed */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-[325px] aspect-[9/18.5] rounded-[48px] border-[8px] border-slate-900 dark:border-slate-800 bg-slate-950 shadow-2xl overflow-hidden z-10 flex flex-col justify-between p-3 text-left">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center">
                <span className="h-1.5 w-1.5 bg-slate-800 rounded-full mr-2" />
                <span className="h-1 w-10 bg-slate-800 rounded-full" />
              </div>

              {/* Status Bar */}
              <div className="flex justify-between items-center text-[8.5px] text-slate-400 font-extrabold px-3 pt-2">
                <span>09:41 AM</span>
                <div className="flex items-center gap-1">
                  <Wifi className="h-2 w-2" />
                  <span className="h-1.5 w-3.5 bg-slate-400 rounded-sm" />
                </div>
              </div>

              {/* App Body */}
              <div className="flex-1 flex flex-col justify-start pt-6 px-1.5 space-y-3.5">
                <div className="flex items-center gap-2 border-b border-slate-900 pb-2.5">
                  <div className="h-8.5 w-8.5 bg-pink-500/10 text-pink-500 rounded-lg flex items-center justify-center text-xs font-black">
                    CK
                  </div>
                  <div>
                    <span className="block text-[9.5px] font-black text-white">CampusKidz Mobile</span>
                    <span className="text-[7px] text-slate-455">Microsoft Security Shield Active</span>
                  </div>
                </div>

                {/* Kids Feed Cards */}
                <div className="space-y-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-pink-500/15 space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-bold uppercase tracking-wider text-pink-500">
                      <span>Activity Share</span>
                      <span>11:35 AM</span>
                    </div>
                    <p className="text-[9px] text-slate-300 font-semibold leading-normal">Arjun colored a paper butterfly & practiced story blocks! 🎨🦋</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-indigo-500/15 space-y-1">
                    <div className="flex justify-between items-center text-[7.5px] font-bold uppercase tracking-wider text-indigo-400">
                      <span>Health & Sleep Log</span>
                      <span>01:15 PM</span>
                    </div>
                    <p className="text-[9px] text-slate-300 font-semibold leading-normal">Napping peacefully (since 13:00). Sanitised check completed ✓.</p>
                  </div>
                </div>

                {/* Dashboard grid preview */}
                <div className="bg-slate-900/40 border border-slate-900 p-2.5 rounded-xl space-y-1.5">
                  <span className="text-[7px] font-bold text-slate-455 uppercase tracking-widest block">Preschool Core</span>
                  <div className="grid grid-cols-3 gap-1.5 text-[7px] font-bold text-center text-white">
                    <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-850">🥗 Food</div>
                    <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-850">💤 Nap</div>
                    <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-850">🧸 Milestones</div>
                  </div>
                </div>
              </div>

              {/* Home Line */}
              <div className="h-1 w-20 bg-slate-800 mx-auto rounded-full mb-0.5" />
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[390px] h-[390px] rounded-full border border-pink-500/10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full border border-pink-500/5 pointer-events-none" />
          </div>

        </div>
      </section>

      {/* 2. CHILDCARE SOFTWARE INTRO */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-left space-y-10">
        <div className="space-y-4 text-center">
          <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest">Nurturing Young Minds</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Tailored Specifically for Early Childhood Needs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center font-semibold">
          <div className="md:col-span-7 space-y-5">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              We understand that the needs of a preschool are very different from that of a high school, hence we've specially designed **CampusKidz**, an ERP that streamlines the administrative tasks of a preschool.
              <br /><br />
              As a cloud-based solution, CampusKidz ERP can be accessed from any part of the world with minimal hardware requirements. To operate this ERP, a pre-school only needs a laptop, a smartphone, and a stable internet connection.
              <br /><br />
              We provide mobile apps that help teachers, parents, and school management stay connected at all times. They can easily access important student and school-related information at the touch of a button. Protected by Microsoft Technology, the app is equipped with the latest security features.
            </p>
          </div>
          <div className="md:col-span-5">
            <div className="p-6 rounded-3xl bg-pink-500/5 dark:bg-pink-500/10 border border-pink-500/10 space-y-4">
              <div className="h-10 w-10 bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center">
                <Laptop className="h-5.5 w-5.5" />
              </div>
              <h4 className="text-sm font-black uppercase text-indigo-700 dark:text-indigo-400">Minimalist Operations</h4>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                Zero local server setup. All you need is a stable internet connection, a laptop, and our mobile applications to handle admissions, diaries, and parent broadcasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE CHILD ACTIVITY TIMELINE */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950/45 border-y border-slate-200/80 dark:border-slate-850/80 text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest font-black">Live Childcare Flow</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Preschool Day-to-Day Activity Log
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Step through the daily timeline of a toddler to see how teachers record updates and how parents stay notified.
            </p>
          </div>

          {/* Time Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-3 border-b border-slate-200 dark:border-slate-800 justify-start md:justify-center">
            {timelineConfig.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTime(item.key as TimelineKey)}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border cursor-pointer ${
                  activeTime === item.key
                    ? 'bg-pink-600 border-pink-600 text-white shadow'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-805 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Display Timeline Details */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-855 shadow-premium">
            <AnimatePresence mode="wait">
              {timelineConfig.map((item) => {
                if (item.key !== activeTime) return null;
                const StageIcon = item.icon;
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
                  >
                    <div className="md:col-span-8 space-y-4">
                      <div className="inline-flex items-center gap-2 bg-pink-50 dark:bg-pink-950 px-3 py-1 rounded-xl text-[10px] font-extrabold text-pink-600 dark:text-pink-400 uppercase tracking-widest">
                        Preschool Timeline Stage ({item.label})
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight flex items-center gap-2">
                        <StageIcon className="h-5 w-5 text-pink-500" />
                        {item.title}
                      </h3>
                      <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="md:col-span-4 p-5 rounded-2xl bg-pink-500/5 dark:bg-pink-500/10 border border-pink-500/10 space-y-1 text-left">
                      <span className="block text-[8.5px] font-extrabold uppercase text-pink-600 dark:text-pink-400 tracking-wider">Teacher's Private Log Details</span>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 4. KEY FUNCTIONS INTERACTIVE GRID */}
      <section className="py-20 max-w-7xl mx-auto px-6 text-left">
        <div className="space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest font-black font-semibold">ERP Capabilities</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Key Functions of a Preschool
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Explore the 11 essential modules integrated into the CampusKidz ERP suite. Click a function to view its operations workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Hand Functions List */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {(Object.keys(functionsConfig) as FunctionKey[]).map((fKey) => {
                const isSelected = activeFunc === fKey;
                const FuncIcon = functionsConfig[fKey].icon;
                return (
                  <button
                    key={fKey}
                    onClick={() => setActiveFunc(fKey)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between hover:shadow-md aspect-[1.5] ${
                      isSelected
                        ? 'bg-pink-600 border-pink-600 text-white shadow-premium ring-2 ring-pink-500/15'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-805 text-slate-650 dark:text-slate-400 hover:border-slate-350 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-white/10 text-white' : 'bg-pink-500/5 text-pink-600'
                    }`}>
                      <FuncIcon className="h-4.5 w-4.5" />
                    </div>
                    <span className="text-xs font-black tracking-tight leading-snug mt-2">{functionsConfig[fKey].label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Hand Flow Viewer */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-855 shadow-inner space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-200/50 dark:border-slate-855 pb-2.5">
                Active Module Workflow
              </span>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 bg-pink-500/10 text-pink-600 dark:text-pink-400 px-3 py-1.5 rounded-xl w-fit">
                  {(() => {
                    const IconComp = functionsConfig[activeFunc].icon;
                    return <IconComp className="h-4 w-4" />;
                  })()}
                  <span className="text-xs font-black">{functionsConfig[activeFunc].label}</span>
                </div>

                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {functionsConfig[activeFunc].title}
                </h3>
                
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-450 leading-relaxed">
                  {functionsConfig[activeFunc].desc}
                </p>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-805 space-y-2">
                  <span className="block text-[8px] font-black text-indigo-500 uppercase tracking-widest">Process Flowchart</span>
                  <p className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400 leading-normal">
                    {functionsConfig[activeFunc].workflow}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. BENEFITS OF IMPLEMENTING CAMPUSKIDZ */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950/45 border-y border-slate-200/80 dark:border-slate-850/80 text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest font-black font-semibold">Operational Value</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Benefits of Implementing CampusKidz
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Providing preschool owners, principals, and teachers with an automated dashboard that cuts manual log times.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 font-semibold">
            {[
              { title: 'Central database & Safety', desc: 'Secure Microsoft-backed cloud hosting protects personal records and family files.' },
              { title: 'Save Time & Money', desc: 'Ditches physical record logbooks and multiple messaging channels.' },
              { title: 'Ready-to-Use MIS Reports', desc: 'Instant audit registers, child developmental graphs, and fee sheets.' },
              { title: 'Eliminate Paper Work', desc: 'Digital check-ins, medical diaries, and online circular logs.' },
              { title: 'Improves Brand Image', desc: 'Builds parental confidence and establishes your preschool as premium.' }
            ].map((ben, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-805 space-y-4 hover:border-pink-500/25 transition-all shadow-sm">
                <span className="text-[10px] font-black text-pink-500 block">0{idx + 1}</span>
                <h3 className="text-xs font-black text-slate-900 dark:text-white leading-snug">{ben.title}</h3>
                <p className="text-[11px] text-slate-450 dark:text-slate-400 leading-relaxed">{ben.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 5-STEP ONBOARDING INTERACTIVE MAP */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-left">
        <div className="space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest font-black">Quick Setup</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              Onboard Your Preschool in 5 Easy Steps
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-450 leading-relaxed max-w-xl mx-auto">
              Our setup is fully optimized, taking not more than 48 hours from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {stepsConfig.map((item) => (
              <div key={item.step} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-805 relative z-10 flex flex-col justify-between space-y-4 shadow-sm hover:border-pink-500/20 transition-all font-semibold">
                <div className="flex justify-between items-center w-full">
                  <span className="h-7 w-7 rounded-lg bg-pink-500/10 text-pink-600 font-black flex items-center justify-center text-xs">
                    0{item.step}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white leading-tight">{item.title}</h3>
                  <p className="text-[10.5px] text-slate-450 dark:text-slate-400 leading-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PURCHASE CTA & DEMO TRIGGER */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-center">
        <div className="p-8 md:p-12 rounded-[32px] bg-gradient-to-br from-pink-50 to-rose-50 dark:from-slate-950 dark:to-slate-900 border border-pink-150/40 dark:border-pink-900/30 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Purchase CampusKidz For Your Preschool Today
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-450 max-w-xl mx-auto leading-relaxed">
            Get instant access to digital diaries, check-in scans, developmental milestones log, and parent broadcasts. Setup compiles in under 48 hours.
          </p>

          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-850/50 max-w-xs mx-auto">
            <Button 
              variant="outline" 
              size="md" 
              onClick={openDemoModal} 
              className="font-extrabold border-pink-650 text-pink-650 hover:bg-pink-50 dark:hover:bg-slate-800 w-full cursor-pointer"
            >
              Request For Demo
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
