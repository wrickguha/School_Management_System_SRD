import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useOutletContext, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Check, ChevronRight, Activity, Award, ArrowRight,
  Users, CreditCard, BookOpen, ShieldCheck, Play, Tv,
  ChevronLeft
} from 'lucide-react';
import { navbarPagesData, type PageMetric, type PageFeature } from '../data/navbarPagesData';
import { Button } from '../components/ui/Button';

interface LandingContext {
  openDemoModal: () => void;
}

// ---------------------------------------------------------
// CountUp Component for animated statistics
// ---------------------------------------------------------
function CountUp({ end, suffix = '', duration = 1500 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const increment = end / (duration / 16);
    let timer: any;
    const run = () => {
      start += increment;
      if (start >= end) {
        setCount(end);
        cancelAnimationFrame(timer);
      } else {
        setCount(Math.floor(start));
        timer = requestAnimationFrame(run);
      }
    };
    timer = requestAnimationFrame(run);
    return () => cancelAnimationFrame(timer);
  }, [hasStarted, end, duration]);

  const formattedCount = count.toLocaleString('en-US', {
    maximumFractionDigits: 1
  });

  return <span ref={elementRef}>{formattedCount}{suffix}</span>;
}

// ---------------------------------------------------------
// 1. PLATFORMS LAYOUT (Product Showcase & Interactive Switcher)
// ---------------------------------------------------------
function PlatformsLayout({ page }: { page: any }) {
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);

  // SVG mini-visualisers based on feature index
  const renderMiniVisual = (idx: number) => {
    switch (idx) {
      case 0:
        return (
          <div className="w-full h-44 rounded-xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between overflow-hidden relative">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Secure Data Vault</span>
            <div className="flex justify-center items-center gap-3 py-4">
              <div className="h-14 w-14 rounded-full border border-slate-700 flex items-center justify-center bg-slate-950 animate-pulse">
                <ShieldCheck className="h-6 w-6 text-school-green" />
              </div>
              <div className="space-y-1">
                <div className="h-2.5 w-24 bg-slate-800 rounded" />
                <div className="h-2 w-32 bg-slate-800 rounded" />
                <div className="h-2 w-16 bg-slate-800 rounded" />
              </div>
            </div>
            <div className="text-[9px] text-slate-400 font-bold text-center">AES-256 Multi-Tenant Isolation Active</div>
          </div>
        );
      case 1:
        return (
          <div className="w-full h-44 rounded-xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between overflow-hidden relative">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Modular System Scale</span>
            <div className="grid grid-cols-3 gap-2 my-2">
              {[1, 2, 3].map((val) => (
                <div key={val} className="p-2 rounded bg-slate-800 border border-slate-700 text-center text-[9px] font-bold text-white flex flex-col items-center">
                  <span>Mod {val}</span>
                  <div className="h-1.5 w-full bg-slate-700 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-school-blue rounded-full w-4/5 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[9px] text-slate-400 font-bold text-center">Auto-Scaling Microservices Enabled</div>
          </div>
        );
      case 2:
        return (
          <div className="w-full h-44 rounded-xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between overflow-hidden relative">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Fee Gateway Pipeline</span>
            <div className="flex justify-between items-center bg-slate-950 border border-slate-850 p-2.5 rounded-lg">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-school-blue" />
                <span className="text-xs text-white font-bold">Online Checkout</span>
              </div>
              <span className="text-xs text-school-green font-extrabold animate-bounce">+$480.00</span>
            </div>
            <div className="text-[9px] text-slate-400 font-bold text-center">Real-Time Invoicing Ledger Sync</div>
          </div>
        );
      default:
        return (
          <div className="w-full h-44 rounded-xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between overflow-hidden relative">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">System Master Directory</span>
            <div className="flex justify-center items-center gap-2 py-4">
              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400"><Users className="h-5 w-5" /></div>
              <ChevronRight className="h-4 w-4 text-slate-600" />
              <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400"><BookOpen className="h-5 w-5" /></div>
            </div>
            <div className="text-[9px] text-slate-400 font-bold text-center">Unified Identity Matrix Enabled</div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-20 text-left">
      {/* 1. Feature Switcher Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-extrabold text-[#0A4D8C] dark:text-sky-400 uppercase tracking-widest bg-[#e6f0fa] dark:bg-slate-900 px-3.5 py-1.5 rounded-full border border-sky-100 dark:border-slate-850">
            Interactive Product Tour
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Hover & Explore the Core</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Discover why our product platform acts as the command center for modern campus chains. Check the interactive visual cards below.
          </p>

          <div className="space-y-4">
            {page.features.map((feat: PageFeature, idx: number) => {
              const FeatIcon = feat.icon;
              const isActive = idx === activeFeatureIdx;
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveFeatureIdx(idx)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-4 items-start ${
                    isActive 
                      ? 'bg-white dark:bg-slate-900 border-[#0A4D8C]/20 dark:border-sky-500/20 shadow-premium' 
                      : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-[#0A4D8C] text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                    <FeatIcon className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white mb-0.5">{feat.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Graphic Preview Column */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 shadow-premium text-center space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Live System Emulation</h3>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeatureIdx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                {renderMiniVisual(activeFeatureIdx)}
              </motion.div>
            </AnimatePresence>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 text-left">
              <span className="text-[10px] font-extrabold text-[#0A4D8C] dark:text-sky-400 uppercase block mb-1">
                Active Feature Spotlight
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                {page.features[activeFeatureIdx]?.desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Brand Value Matrix */}
      <div className="border-t border-slate-200 dark:border-slate-850 pt-16 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 dark:bg-slate-950/20 p-8 rounded-3xl">
        <div className="space-y-4">
          <h3 className="text-xl font-extrabold">{page.highlightTitle}</h3>
          <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
            {page.highlightText}
          </p>
        </div>
        <div className="space-y-4 flex flex-col justify-center">
          {[
            'Modular, self-scaling cloud frameworks.',
            'Continuous backups and multi-zone safety failovers.',
            'Direct mobile app telemetry for real-time notifications.'
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-school-green/10 text-school-green flex items-center justify-center">
                <Check className="h-3.5 w-3.5 font-bold" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 2. OPTIMISATION LAYOUT (Interactive Admin Dashboard & Operational Timeline)
// ---------------------------------------------------------
function OptimisationLayout({ page, openDemoModal }: { page: any; openDemoModal: () => void }) {
  // Simulated stats
  const [admissions, setAdmissions] = useState(142);
  const [attendance, setAttendance] = useState(92.4);
  const [collections, setCollections] = useState(148250);

  return (
    <div className="space-y-20 text-left">
      {/* 1. Simulated Live Admin Dashboard */}
      <div className="space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-extrabold text-school-green uppercase tracking-widest bg-[#e8f7f4] dark:bg-slate-900 px-3.5 py-1.5 rounded-full border border-teal-150 dark:border-slate-850">
            Interactive Dashboard Console
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Try Our Simulated Control Panel</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Test how SubhraEdu optimizes workflows. Click the buttons below to trigger simulated operational updates.
          </p>
        </div>

        {/* Live Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Admissions */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-premium flex flex-col justify-between gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Admissions Funnel</span>
              <span className="h-2 w-2 rounded-full bg-school-green animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-extrabold text-slate-850 dark:text-white">{admissions}</span>
              <span className="block text-[10px] text-slate-400 font-bold">Applicants in pipeline</span>
            </div>
            <button 
              onClick={() => setAdmissions(admissions + 1)}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-[#138D75] dark:hover:bg-[#138D75] hover:text-white text-[11px] font-bold text-slate-700 dark:text-slate-350 rounded-xl transition-all"
            >
              Simulate New Application
            </button>
          </div>

          {/* Card 2: Attendance */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-premium flex flex-col justify-between gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Classroom Attendance</span>
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-extrabold text-slate-850 dark:text-white">{attendance.toFixed(1)}%</span>
              <span className="block text-[10px] text-slate-400 font-bold">Overall school average</span>
            </div>
            <button 
              onClick={() => setAttendance(Math.min(99.9, attendance + 0.3))}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white text-[11px] font-bold text-slate-700 dark:text-slate-350 rounded-xl transition-all"
            >
              Trigger RFID Check-ins
            </button>
          </div>

          {/* Card 3: Finance */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-premium flex flex-col justify-between gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Revenues Invoiced</span>
              <span className="h-2 w-2 rounded-full bg-school-maroon animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-extrabold text-slate-850 dark:text-white">${collections.toLocaleString()}</span>
              <span className="block text-[10px] text-slate-400 font-bold">Collected this cycle</span>
            </div>
            <button 
              onClick={() => setCollections(collections + 540)}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-[#7B1E3A] dark:hover:bg-[#7B1E3A] hover:text-white text-[11px] font-bold text-slate-700 dark:text-slate-350 rounded-xl transition-all"
            >
              Simulate Online Payment
            </button>
          </div>
        </div>
      </div>

      {/* 2. Implementation Pipeline Flow */}
      <div className="border-t border-slate-200 dark:border-slate-850 pt-16 space-y-10">
        <h3 className="text-2xl font-extrabold tracking-tight">Our 4-Step Operational Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Consultation & Audit', desc: 'Our team assesses your school data records, databases, and compliance requirements.' },
            { step: '02', title: 'Configuration', desc: 'We customize modules, fees rules, and templates to map to your system.' },
            { step: '03', title: 'Staff Onboarding', desc: 'Coordinators and teachers undergo self-paced training walkthroughs.' },
            { step: '04', title: 'Live Deployment', desc: 'We sync parent directories and active biometric logs in 24 hours.' }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 relative overflow-hidden flex flex-col justify-between gap-4">
              <span className="absolute -top-3 -right-3 text-5xl font-black text-slate-100 dark:text-slate-850/60 pointer-events-none select-none z-0">
                {item.step}
              </span>
              <div className="relative z-10 space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">{item.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. General Information */}
      <div className="p-8 rounded-3xl bg-[#e8f7f4] dark:bg-slate-900/60 border border-teal-100 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-3">
          <h4 className="font-extrabold text-[#138D75] text-lg">{page.highlightTitle}</h4>
          <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
            {page.highlightText}
          </p>
        </div>
        <div className="lg:col-span-4 flex justify-end">
          <Button variant="primary" size="md" onClick={openDemoModal} className="bg-[#138D75] hover:bg-[#0e6f5c] border-none text-white font-bold">
            Schedule Process Audit
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 3. SUCCESS STORIES LAYOUT (Testimonial Quote Carousel & Before-After comparison)
// ---------------------------------------------------------
function SuccessStoriesLayout({ page }: { page: any }) {
  const quotes = [
    { text: "SubhraEdu automated fee collections across our 5 campuses, saving 200 coordinator hours monthly. It has redefined our administrative productivity.", author: "Dr. Sandeep Sen, Principal at St. Xavier International" },
    { text: "The lesson plan matrix and student gradecards allow our educators to input data effortlessly. Parent trust indexes raised by 18%.", author: "Sister Mary D'Souza, Director at Greenwood Academy" },
    { text: "Biometric check-ins linked with instant SMS notices cut classroom absence by 35% in our first term.", author: "Mr. Rajat Bose, Administrative Head at Bright Future Schools" }
  ];

  const [activeQuote, setActiveQuote] = useState(0);

  const handleNext = () => {
    setActiveQuote((prev) => (prev + 1) % quotes.length);
  };

  const handlePrev = () => {
    setActiveQuote((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  return (
    <div className="space-y-20 text-left">
      {/* 1. Interactive Testimonial Slider */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden space-y-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0A4D8C]/30 via-transparent to-transparent pointer-events-none" />
        <div className="flex justify-between items-center relative z-10">
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-sky-400">Principal Board Reviews</span>
          <div className="flex gap-2">
            <button onClick={handlePrev} className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={handleNext} className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeQuote}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 min-h-[120px] flex flex-col justify-center relative z-10"
          >
            <p className="text-lg md:text-xl font-bold leading-relaxed text-slate-100">
              "{quotes[activeQuote].text}"
            </p>
            <span className="text-xs text-sky-400 font-extrabold uppercase tracking-wider block">
              — {quotes[activeQuote].author}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. Before-and-After Metric Board */}
      <div className="space-y-8 border-t border-slate-200 dark:border-slate-850 pt-16">
        <div className="space-y-3">
          <span className="text-xs font-extrabold text-school-blue uppercase tracking-widest bg-[#e6f0fa] dark:bg-slate-900 px-3.5 py-1.5 rounded-full border border-sky-150 dark:border-slate-850">
            Efficiency Statistics Comparison
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ecosystem Before & After</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Based on data logs compiled from 1,200+ deployments. Here is the operational time difference:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Attendance Check-in (Classroom)', beforeVal: '45 mins', afterVal: '1.2 mins', beforePct: 100, afterPct: 3 },
            { label: 'Ledger Audit & Reconciliation', beforeVal: '14 hrs', afterVal: '10 mins', beforePct: 100, afterPct: 2 },
            { label: 'Absence Parent SMS Dispatch', beforeVal: '4 hrs', afterVal: '1.5 secs', beforePct: 100, afterPct: 1 }
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-premium space-y-6">
              <h4 className="font-extrabold text-slate-850 dark:text-white text-sm">{item.label}</h4>
              
              <div className="space-y-3">
                {/* Before */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-450">
                    <span>Manual Process</span>
                    <span>{item.beforeVal}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 rounded-full" style={{ width: `${item.beforePct}%` }} />
                  </div>
                </div>

                {/* After */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-extrabold text-school-green">
                    <span>SubhraEdu Managed</span>
                    <span>{item.afterVal}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-school-green rounded-full animate-pulse" style={{ width: `${item.afterPct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Text description */}
      <div className="p-6 rounded-2xl bg-sky-50/50 dark:bg-slate-900/30 border border-sky-100 dark:border-slate-800/80">
        <h4 className="font-bold mb-2 text-school-blue">{page.highlightTitle}</h4>
        <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-semibold">
          {page.highlightText}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 4. INSIGHTS LAYOUT (Interactive Video Tutorial Console & Newsletter Form)
// ---------------------------------------------------------
function InsightsLayout() {
  // Video library list
  const playlist = [
    { title: 'Interactive Fee Invoicing Setup', desc: 'Learn how to customize invoice templates, discount schemes, and online payment gateways.', duration: '4:15' },
    { title: 'RFID Smartgate Check-in Log Integration', desc: 'Learn how to connect RFID hardware devices and set up automated SMS notices.', duration: '6:30' },
    { title: 'AI Predictive GPA & Performance curves', desc: 'A guide to reading predictive models, learning index graphs, and warning systems.', duration: '5:42' }
  ];

  const [activeVideo, setActiveVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [emailSubbed, setEmailSubbed] = useState(false);

  return (
    <div className="space-y-20 text-left">
      {/* 1. Interactive Video Tutorial Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Video Player */}
        <div className="lg:col-span-8 p-4 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 shadow-premium space-y-4">
          <div className="relative h-64 md:h-96 rounded-2xl bg-slate-950 border border-slate-850 overflow-hidden flex items-center justify-center">
            {isPlaying ? (
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                <Tv className="h-12 w-12 text-school-green animate-bounce" />
                <span className="text-xs text-white font-bold">Simulating HD Tutorial Video Stream...</span>
                <button 
                  onClick={() => setIsPlaying(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-white font-bold transition-all"
                >
                  Stop Preview
                </button>
              </div>
            ) : (
              <>
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-none z-0" />
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="h-16 w-16 rounded-full bg-[#0A4D8C] text-white hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center z-10 cursor-pointer"
                >
                  <Play className="h-6 w-6 ml-1" />
                </button>
              </>
            )}
            
            {/* Control Bar Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white text-[10px] font-bold z-10">
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 bg-red-650 rounded-full animate-ping" /> {isPlaying ? 'Streaming' : 'Paused'}</span>
              <span>{playlist[activeVideo].duration}</span>
            </div>
          </div>

          <div className="space-y-2 px-2">
            <span className="text-[10px] uppercase font-extrabold text-[#0A4D8C] dark:text-sky-400 tracking-wider">Tutorial Spotlight</span>
            <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">{playlist[activeVideo].title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{playlist[activeVideo].desc}</p>
          </div>
        </div>

        {/* Video Playlist Sidebar */}
        <div className="lg:col-span-4 p-5 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 shadow-premium space-y-4">
          <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-3">Video Chapters</h4>
          
          <div className="space-y-2">
            {playlist.map((video, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveVideo(idx);
                  setIsPlaying(false);
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex gap-3 items-center ${
                  idx === activeVideo 
                    ? 'border-[#0A4D8C]/20 bg-slate-50 dark:bg-slate-850/80 font-bold' 
                    : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 ${
                  idx === activeVideo ? 'bg-[#0A4D8C] text-white' : 'bg-slate-250 dark:bg-slate-700 text-slate-500'
                }`}>
                  <Play className="h-3.5 w-3.5" />
                </div>
                <div className="truncate flex-1">
                  <span className="block truncate text-slate-800 dark:text-white font-bold">{video.title}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">{video.duration}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Interactive Newsletter Form Widget */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#138D75]/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="lg:col-span-7 space-y-3 text-left relative z-10">
          <span className="text-[10px] uppercase font-extrabold text-school-green tracking-wider bg-school-green/10 border border-school-green/20 px-2 py-0.5 rounded">Subscribe</span>
          <h3 className="text-2xl font-extrabold tracking-tight">Stay On Top of EdTech Trends</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-semibold">
            Join 8,500+ school directors, office coordinators, and teachers. Get free HTML newsletters, compliance templates, and audit guides.
          </p>
        </div>

        <div className="lg:col-span-5 relative z-10">
          {emailSubbed ? (
            <div className="p-4 bg-school-green/10 border border-school-green/30 rounded-2xl text-center text-xs font-bold text-school-green animate-bounce">
              ✓ Subscribed! Free resources dispatched to inbox.
            </div>
          ) : (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setEmailSubbed(true);
              }}
              className="flex gap-2"
            >
              <input 
                type="email" 
                required
                placeholder="work.email@school.edu" 
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none focus:ring-1 focus:ring-school-green"
              />
              <button 
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-school-green hover:bg-[#0e6f5c] text-xs font-bold text-white transition-all cursor-pointer"
              >
                Join
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 5. ABOUT US LAYOUT (Interactive Vertical timeline & Core values)
// ---------------------------------------------------------
function AboutUsLayout() {
  const milestones = [
    { year: '2018', title: ' EMR Foundation', desc: 'SubhraEdu is founded in West Bengal with the vision to replace paper school registers with active cloud databases.' },
    { year: '2020', title: 'Mobile Suite Launch', desc: 'Developed native iOS and Android apps to sync parent-teacher communications in less than 2 seconds.' },
    { year: '2023', title: 'Cognitive Engine Integration', desc: 'Deployed predictive grade models and AI automated fee payment ledgers.' },
    { year: '2026', title: 'Scaling Internationally', desc: 'Securing over 200M active student records across 1,200+ K-12 institutes.' }
  ];

  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState(3);

  return (
    <div className="space-y-20 text-left">
      {/* 1. Interactive Vertical Milestone Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Years Selector */}
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs font-extrabold text-school-blue uppercase tracking-widest bg-[#e6f0fa] dark:bg-slate-900 px-3.5 py-1.5 rounded-full border border-sky-150 dark:border-slate-850">
            Interactive Timeline
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Our Inception Journey</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Click on a milestone year to reveal our major developments and operational expansions.
          </p>

          <div className="flex flex-col gap-3">
            {milestones.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMilestoneIdx(idx)}
                className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                  idx === activeMilestoneIdx
                    ? 'border-[#0A4D8C]/20 bg-white dark:bg-slate-900 shadow-premium font-bold text-[#0A4D8C] dark:text-sky-400'
                    : 'border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900/40'
                }`}
              >
                <span className="text-lg font-black">{item.year}</span>
                <span className="text-xs font-bold uppercase tracking-wider">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Milestone Detail Card Display */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMilestoneIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 shadow-premium relative overflow-hidden min-h-[200px] flex flex-col justify-center gap-4 text-left"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-school-blue/5 via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10 space-y-3">
                <span className="text-5xl font-black text-[#0A4D8C]/15 dark:text-sky-400/20 block select-none">
                  {milestones[activeMilestoneIdx].year}
                </span>
                <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">
                  {milestones[activeMilestoneIdx].title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                  {milestones[activeMilestoneIdx].desc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 2. Core Operational Value Matrix */}
      <div className="border-t border-slate-200 dark:border-slate-850 pt-16 space-y-8">
        <h3 className="text-2xl font-extrabold tracking-tight">Our Core Operational Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, title: 'Security First', desc: 'Multi-tenant database structures and continuous network penetration tests protect student records.' },
            { icon: Sparkles, title: 'Continuous Innovation', desc: 'Deploying cognitive models, automated invoicing systems, and native mobile check-ins.' },
            { icon: Activity, title: 'Transparency', desc: 'Real-time billing statements and academic gradecards are shared directly with guardians.' },
            { icon: Users, title: 'Customer Success', desc: 'Onsite onboarding specialists lead records migration to ensure zero data loss.' }
          ].map((val, idx) => {
            const ValIcon = val.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-premium space-y-3 text-left">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-650 dark:text-slate-350 shadow-sm">
                  <ValIcon className="h-5.5 w-5.5" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">{val.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Main Page View Component
// ---------------------------------------------------------
export default function NavbarDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { openDemoModal } = useOutletContext<LandingContext>();
  
  const page = slug ? navbarPagesData[slug] : null;

  useEffect(() => {
    if (page) {
      document.title = `${page.title} | SubhraEdu Premium ERP`;
      window.scrollTo(0, 0);
    }
  }, [page]);

  if (!page) {
    return <Navigate to="/" replace />;
  }

  // Choose the visual layout based on the category
  const renderCategoryLayout = () => {
    switch (page.category) {
      case 'platforms':
        return <PlatformsLayout page={page} />;
      case 'optimisation':
        return <OptimisationLayout page={page} openDemoModal={openDemoModal} />;
      case 'success-stories':
        return <SuccessStoriesLayout page={page} />;
      case 'insights':
        return <InsightsLayout />;
      case 'about':
        return <AboutUsLayout />;
      default:
        return (
          <div className="space-y-6 text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold">Ecosystem Overview</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
              {page.description}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">
      
      {/* 1. Header Banner Gradient */}
      <div className={`w-full bg-gradient-to-r ${page.gradient} text-white py-20 px-6 md:py-28 relative overflow-hidden`}>
        {/* Grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        {/* Floating decoration objects */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white/5 blur-2xl animate-float-y" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-white/5 blur-3xl animate-float-y-reverse" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-6 text-left">
          {/* Sleek Breadcrumb Navigator */}
          <div className="flex items-center gap-2 text-xs font-bold text-white/80 uppercase tracking-widest bg-white/10 backdrop-blur-md px-4 py-2 rounded-full max-w-max border border-white/10">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-white/50" />
            <span className="text-white/60">{page.category}</span>
            <ChevronRight className="h-3.5 w-3.5 text-white/50" />
            <span className="text-white">{page.title}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20">
              <Sparkles className="h-3.5 w-3.5 text-yellow-350 animate-pulse" />
              <span>Premium Enterprise Solutions</span>
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight uppercase">
              {page.title}
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed">
              {page.subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* 2. Dynamic statistics metrics row */}
      <div className="w-full border-b border-slate-200 dark:border-slate-850 py-10 bg-white dark:bg-slate-900 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-6">
          {page.metrics.map((metric: PageMetric, idx: number) => (
            <div 
              key={idx} 
              className="text-center space-y-1"
            >
              <span className="block text-2xl md:text-4xl font-extrabold text-[#0A4D8C] dark:text-sky-400">
                <CountUp end={metric.value} suffix={metric.suffix} />
              </span>
              <span className="text-[10px] md:text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">{metric.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Main Content Category Layout Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 relative z-10">
        <div className="w-full">
          {renderCategoryLayout()}
        </div>
      </section>

      {/* 4. Bottom Ecosystem Showcase Grid */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800/80 relative z-10">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-2 text-left">
              <span className="text-xs font-bold text-[#0A4D8C] dark:text-sky-400 uppercase tracking-widest">Ecosystem modules</span>
              <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight">Explore Other Core Modules</h3>
            </div>
            <Link to="/" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-[#0A4D8C] dark:text-sky-400 hover:underline">
              Back to Home <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {Object.values(navbarPagesData)
              .filter(p => p.slug !== page.slug && p.category === page.category)
              .slice(0, 3)
              .map((p, idx) => {
                const FeatIcon = p.features[0]?.icon || Award;
                return (
                  <Link 
                    key={idx} 
                    to={`/${p.category}/${p.slug}`}
                    className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-850 hover:border-[#0A4D8C]/20 dark:hover:border-sky-500/20 bg-slate-50 dark:bg-slate-950/60 shadow-premium hover:shadow-cardHover transition-all flex flex-col justify-between items-start group"
                  >
                    <div className="space-y-4">
                      <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-500 shadow-sm border border-slate-100 dark:border-slate-850">
                        <FeatIcon className="h-5.5 w-5.5" />
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-[#0A4D8C] dark:group-hover:text-sky-400 transition-colors">{p.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">{p.subtitle}</p>
                    </div>
                    <span className="text-xs font-bold text-[#0A4D8C] dark:text-sky-400 flex items-center gap-1 mt-6">
                      Learn More <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>

      {/* 5. Direct Page Action CTA Bar */}
      <section className="bg-slate-900 dark:bg-slate-950 text-white py-16 px-6 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-school-blue/30 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight">Experience SubhraEdu Operations Live</h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Schedule a personalized walkthrough with our product architects today to deploy a customized sandboxed instance for your campus reviews.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Button variant="primary" size="lg" onClick={openDemoModal} className="bg-[#0A4D8C] hover:bg-[#083D70] border-none text-white font-bold px-8 shadow-lg">
              Book a System Walkthrough
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
