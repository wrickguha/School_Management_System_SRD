import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Calendar, Award, CreditCard, UserCheck, GraduationCap,
  BookOpen, ShieldAlert, Bus, Library as LibraryIcon, Home as HomeIcon,
  BarChart3, Check, ChevronRight, HelpCircle, ArrowRight, Star,
  MessageSquare, Sparkles, FileText, Clock
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';

interface LandingContext {
  openDemoModal: () => void;
}

// ---------------------------------------------------------
// CountUp Component for animated statistics on scroll
// ---------------------------------------------------------
function CountUp({ end, suffix = '', duration = 1800 }: { end: number; suffix?: string; duration?: number }) {
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
// CUSTOM ANIMATED FEATURE ILLUSTRATIONS (SVGs)
// ---------------------------------------------------------

// 1. Attendance Tracking Animation
function AttendanceIllustration() {
  const [activeChecks, setActiveChecks] = useState([true, false, false, false, false, false]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveChecks((prev) => {
        const next = [...prev];
        const nextFalseIndex = next.indexOf(false);
        if (nextFalseIndex === -1) {
          return [true, false, false, false, false, false];
        }
        next[nextFalseIndex] = true;
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-44 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between overflow-hidden relative">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <span>RFID Check-in Log</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-school-green animate-pulse" /> Live</span>
      </div>
      <div className="grid grid-cols-3 gap-2 my-2">
        {activeChecks.map((checked, i) => (
          <div key={i} className={`p-2.5 rounded-lg border text-center transition-all duration-500 ${checked ? 'bg-school-greenLight border-school-green/30 text-school-green scale-100' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-850 text-slate-350 scale-95'}`}>
            <span className="text-[10px] block opacity-75 font-semibold">STU-10{i}</span>
            <div className="flex justify-center mt-1">
              {checked ? <Check className="h-4.5 w-4.5 text-school-green font-bold animate-bounce" /> : <Clock className="h-4.5 w-4.5 text-slate-300 animate-pulse" />}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-lg p-2 border border-slate-100 dark:border-slate-850">
        <span className="text-[10px] font-bold text-slate-440">Today Attendance</span>
        <div className="w-16 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div className="bg-school-green h-full transition-all duration-1000" style={{ width: `${(activeChecks.filter(Boolean).length / 6) * 100}%` }} />
        </div>
        <span className="text-xs font-bold text-school-green">{Math.floor((activeChecks.filter(Boolean).length / 6) * 100)}%</span>
      </div>
    </div>
  );
}

// 2. Fee Management Illustration
function FeeIllustration() {
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimateChart((p) => !p);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-44 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between overflow-hidden relative">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <span>Revenue Collections</span>
        <span className="text-school-green font-extrabold text-[10px]">+14% Growth</span>
      </div>
      <div className="h-20 flex items-end gap-3 justify-center pt-4">
        {[45, 60, 52, 78, animateChart ? 95 : 85, animateChart ? 110 : 92].map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-t-md h-20 relative overflow-hidden">
              <div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-school-blue to-school-blueDark rounded-t-md transition-all duration-1000 ease-out" 
                style={{ height: `${height}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-400 font-bold">M{i+1}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-lg p-2 border border-slate-100 dark:border-slate-850">
        <span className="text-[10px] font-bold text-slate-440">Total Invoiced</span>
        <span className="text-xs font-extrabold text-school-blue animate-pulse">$482,900</span>
      </div>
    </div>
  );
}

// 3. Examination & Gradecard Illustration
function ExaminationIllustration() {
  const [gpaProgress, setGpaProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setGpaProgress(96), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-44 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between overflow-hidden relative">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <span>Term Report Card</span>
        <span className="px-2 py-0.5 rounded bg-school-maroonLight text-school-maroon text-[9px] font-bold">Grade A+</span>
      </div>
      <div className="space-y-2.5 my-2">
        {[
          { name: 'Mathematics', value: 98, color: 'bg-school-blue' },
          { name: 'English Literature', value: 92, color: 'bg-school-green' },
          { name: 'Physical Sciences', value: 94, color: 'bg-school-maroon' }
        ].map((sub, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold">
              <span>{sub.name}</span>
              <span className="opacity-80">{sub.value}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`${sub.color} h-full transition-all duration-1000 ease-out`} 
                style={{ width: `${gpaProgress ? sub.value : 0}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
        <span>GPA Index Score</span>
        <span className="text-school-blue font-extrabold">3.94 / 4.00</span>
      </div>
    </div>
  );
}

// 4. Transport Tracking Route Map Animation
function TransportIllustration() {
  return (
    <div className="w-full h-44 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between overflow-hidden relative">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <span>GPS Bus Route Map</span>
        <span className="text-[10px] font-bold text-school-blue">Route 4 - Active</span>
      </div>
      <div className="relative h-20 border border-dashed border-slate-200 dark:border-slate-850 rounded-lg bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center">
        {/* Animated Dashed Route Path */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M 20 40 Q 120 10, 220 40 T 320 40" 
            fill="none" 
            stroke="#cbd5e1" 
            strokeWidth="3" 
            strokeDasharray="6,6"
            className="dark:stroke-slate-800"
          />
          <path 
            d="M 20 40 Q 120 10, 220 40 T 320 40" 
            fill="none" 
            stroke="#0A4D8C" 
            strokeWidth="3" 
            strokeDasharray="10,120"
            strokeDashoffset="0"
            className="animate-dash-move"
          />
          <circle cx="20" cy="40" r="4.5" fill="#7B1E3A" />
          <circle cx="160" cy="27" r="4.5" fill="#138D75" className="animate-ping opacity-75" />
          <circle cx="160" cy="27" r="4.5" fill="#138D75" />
          <circle cx="300" cy="40" r="4.5" fill="#7B1E3A" />
        </svg>
        
        {/* Orbit bus mockup indicator */}
        <div className="absolute top-4 left-1/3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-school-blue text-white text-[9px] font-bold shadow animate-float-y">
          <Bus className="h-3 w-3" />
          <span>Bus 42</span>
        </div>
      </div>
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
        <span>Next Station</span>
        <span className="text-school-green">Arriving in 4 min</span>
      </div>
    </div>
  );
}

// 5. Communication Nodes Alert
function CommunicationIllustration() {
  return (
    <div className="w-full h-44 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between overflow-hidden relative">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <span>Instant Gateway Logs</span>
        <span className="text-school-blue">SMS & Email Queue</span>
      </div>
      <div className="flex items-center justify-between gap-2 my-2 relative">
        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 shrink-0 z-10">
          <GraduationCap className="h-5 w-5 text-school-blue" />
          <span className="text-[8px] font-bold text-slate-450 mt-1">Teacher</span>
        </div>

        {/* Dynamic arrows flowing */}
        <div className="w-full h-0.5 relative overflow-hidden bg-slate-200 dark:bg-slate-850">
          <div className="absolute top-0 bottom-0 left-0 bg-school-maroon animate-dash-move w-1/2" style={{ animationDuration: '1.2s' }} />
        </div>

        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 shrink-0 z-10">
          <MessageSquare className="h-5 w-5 text-school-maroon animate-bounce" />
          <span className="text-[8px] font-bold text-slate-450 mt-1">Alert</span>
        </div>

        {/* Dynamic arrows flowing */}
        <div className="w-full h-0.5 relative overflow-hidden bg-slate-200 dark:bg-slate-850">
          <div className="absolute top-0 bottom-0 left-0 bg-school-green animate-dash-move w-1/2" style={{ animationDuration: '1.5s' }} />
        </div>

        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 shrink-0 z-10">
          <UserCheck className="h-5 w-5 text-school-green" />
          <span className="text-[8px] font-bold text-slate-450 mt-1">Parent</span>
        </div>
      </div>
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-440">
        <span>Delivery Success</span>
        <span className="text-school-green">99.98% Status</span>
      </div>
    </div>
  );
}

// 6. Library Book Shelf Sorting
function LibraryIllustration() {
  const [activeBookIndex, setActiveBookIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBookIndex((prev) => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-44 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between overflow-hidden relative">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <span>Book Catalog Sort</span>
        <span className="text-school-green">RFID Scan: In</span>
      </div>
      <div className="flex gap-2 justify-center items-end h-20 my-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-lg p-3">
        {[
          { color: 'bg-school-blue', height: 'h-12' },
          { color: 'bg-school-green', height: 'h-14' },
          { color: 'bg-school-maroon', height: 'h-10' },
          { color: 'bg-school-blueDark', height: 'h-16' }
        ].map((book, idx) => (
          <div 
            key={idx} 
            className={`w-6 ${book.height} ${book.color} rounded-sm transition-all duration-500 transform ${idx === activeBookIndex ? '-translate-y-2 ring-2 ring-offset-2 ring-school-green' : 'scale-100'}`} 
          />
        ))}
      </div>
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
        <span>Total Books Vaulted</span>
        <span className="text-school-blue">14,250 Volumes</span>
      </div>
    </div>
  );
}

// 7. Advanced Analytics Graph
function AnalyticsIllustration() {
  return (
    <div className="w-full h-44 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between overflow-hidden relative">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <span>AI Predictive GPA</span>
        <span className="flex items-center gap-1 text-school-maroon"><Sparkles className="h-3 w-3 animate-spin" /> Smart Insight</span>
      </div>
      <div className="relative h-20 my-2 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 80">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0A4D8C" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0A4D8C" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d="M 10 70 L 10 70 Q 75 10, 150 40 T 290 10 L 290 70 Z" 
            fill="url(#chartGrad)"
          />
          <path 
            d="M 10 70 Q 75 10, 150 40 T 290 10" 
            fill="none" 
            stroke="#0A4D8C" 
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Glowing peaks */}
          <circle cx="290" cy="10" r="5" fill="#138D75" className="animate-ping" />
          <circle cx="290" cy="10" r="5" fill="#138D75" />
          <circle cx="150" cy="40" r="4.5" fill="#7B1E3A" />
        </svg>
        <span className="absolute top-2 right-4 text-[9px] font-bold bg-school-greenLight text-school-green px-1.5 py-0.5 rounded shadow">
          Class Avg +6.2%
        </span>
      </div>
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-450">
        <span>Data Confidence Rate</span>
        <span className="text-school-blue">98.2% Accurate</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// COMPONENT-BASED MODULE ILLUSTRATIONS (SVGs) FOR SHOWCASE
// ---------------------------------------------------------

// 1. School Administration Illustration Card
function AdminIllustrationCard() {
  return (
    <svg className="w-full h-full max-h-56" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="240" rx="16" fill="#F8FAFC" className="dark:fill-slate-950" />
      
      {/* Background grids */}
      <line x1="50" y1="20" x2="50" y2="220" stroke="#E2E8F0" strokeDasharray="4 4" className="dark:stroke-slate-800" />
      <line x1="200" y1="20" x2="200" y2="220" stroke="#E2E8F0" strokeDasharray="4 4" className="dark:stroke-slate-800" />
      <line x1="350" y1="20" x2="350" y2="220" stroke="#E2E8F0" strokeDasharray="4 4" className="dark:stroke-slate-800" />
      
      {/* Central Admin Hub node */}
      <rect x="130" y="40" width="140" height="60" rx="12" fill="#0A4D8C" className="shadow" />
      <text x="200" y="70" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Institution Admin Core</text>
      <text x="200" y="85" fill="#E6F0FA" fontSize="8" fontWeight="medium" textAnchor="middle">Settings & Security Control</text>

      {/* Satellite modules */}
      <g className="animate-float-y">
        <rect x="30" y="140" width="100" height="45" rx="10" fill="white" stroke="#138D75" strokeWidth="1.5" className="dark:fill-slate-900" />
        <text x="80" y="166" fill="#138D75" fontSize="10" fontWeight="bold" textAnchor="middle">Multi-Campus</text>
      </g>
      
      <g className="animate-float-y-reverse" style={{ animationDelay: '1s' }}>
        <rect x="150" y="140" width="100" height="45" rx="10" fill="white" stroke="#7B1E3A" strokeWidth="1.5" className="dark:fill-slate-900" />
        <text x="200" y="166" fill="#7B1E3A" fontSize="10" fontWeight="bold" textAnchor="middle">HR & Payroll</text>
      </g>

      <g className="animate-float-y" style={{ animationDelay: '2s' }}>
        <rect x="270" y="140" width="100" height="45" rx="10" fill="white" stroke="#0A4D8C" strokeWidth="1.5" className="dark:fill-slate-900" />
        <text x="320" y="166" fill="#0A4D8C" fontSize="10" fontWeight="bold" textAnchor="middle">Syllabus Matrix</text>
      </g>

      {/* Dynamic connection lines */}
      <path d="M 80 140 L 150 100" stroke="#138D75" strokeWidth="1.5" strokeDasharray="5 5" />
      <path d="M 200 140 L 200 100" stroke="#7B1E3A" strokeWidth="1.5" strokeDasharray="5 5" />
      <path d="M 320 140 L 250 100" stroke="#0A4D8C" strokeWidth="1.5" strokeDasharray="5 5" />
    </svg>
  );
}

// 2. Teacher Management Illustration Card
function TeacherIllustrationCard() {
  return (
    <svg className="w-full h-full max-h-56" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="240" rx="16" fill="#F8FAFC" className="dark:fill-slate-950" />
      
      {/* Console Sheet */}
      <rect x="40" y="30" width="320" height="180" rx="12" fill="white" stroke="#E2E8F0" strokeWidth="1.5" className="dark:fill-slate-900 dark:stroke-slate-800 shadow" />
      
      {/* Header bar */}
      <rect x="40" y="30" width="320" height="35" rx="12" fill="#0A4D8C" />
      <text x="60" y="52" fill="white" fontSize="10" fontWeight="bold">Active Grade Book: Class 10A</text>
      
      {/* Progress sheet */}
      <rect x="60" y="90" width="110" height="30" rx="6" fill="#F1F5F9" className="dark:fill-slate-800" />
      <rect x="65" y="103" width="70" height="4" rx="2" fill="#E2E8F0" className="dark:fill-slate-700" />
      <rect x="65" y="103" width="55" height="4" rx="2" fill="#138D75" />
      <text x="65" y="117" fill="#64748B" fontSize="6" fontWeight="bold">Syllabus: 78% Finished</text>

      <rect x="60" y="130" width="110" height="30" rx="6" fill="#F1F5F9" className="dark:fill-slate-800" />
      <rect x="65" y="143" width="70" height="4" rx="2" fill="#E2E8F0" className="dark:fill-slate-700" />
      <rect x="65" y="143" width="35" height="4" rx="2" fill="#7B1E3A" />
      <text x="65" y="157" fill="#64748B" fontSize="6" fontWeight="bold">Assignments: 42% Graded</text>

      {/* Dynamic graph widget */}
      <rect x="190" y="90" width="150" height="100" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" className="dark:fill-slate-950 dark:stroke-slate-800" />
      <text x="200" y="106" fill="#0A4D8C" fontSize="8" fontWeight="bold">Grade Performance Curve</text>
      <path d="M 200 160 L 220 145 L 245 152 L 270 120 L 295 130 L 325 110" stroke="#138D75" strokeWidth="2" strokeLinecap="round" />
      <circle cx="325" cy="110" r="3" fill="#138D75" className="animate-ping" />
      <circle cx="325" cy="110" r="3" fill="#138D75" />
    </svg>
  );
}

// 3. Parent Communication Illustration Card
function ParentIllustrationCard() {
  return (
    <svg className="w-full h-full max-h-56" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="240" rx="16" fill="#F8FAFC" className="dark:fill-slate-950" />
      
      {/* Mobile Frame */}
      <rect x="135" y="20" width="130" height="200" rx="20" fill="white" stroke="#64748B" strokeWidth="3" className="dark:fill-slate-900 shadow-premium" />
      
      {/* Screen details */}
      <rect x="145" y="32" width="110" height="15" rx="4" fill="#0A4D8C" />
      <text x="200" y="42" fill="white" fontSize="7" fontWeight="bold" textAnchor="middle">St. Xavier SmartApp</text>
      
      {/* Chat messages */}
      <g className="animate-float-y" style={{ animationDuration: '4s' }}>
        <rect x="142" y="65" width="85" height="35" rx="6" fill="#F1F5F9" className="dark:fill-slate-800" />
        <text x="147" y="77" fill="#334155" className="dark:fill-slate-300" fontSize="6" fontWeight="bold">Notice: Math Quiz</text>
        <text x="147" y="87" fill="#64748B" className="dark:fill-slate-400" fontSize="5" fontWeight="medium">Scheduled on Monday, 9 AM</text>
      </g>

      <g className="animate-float-y-reverse" style={{ animationDuration: '5s', animationDelay: '1.5s' }}>
        <rect x="178" y="115" width="80" height="30" rx="6" fill="#E6F0FA" className="dark:fill-slate-800" />
        <text x="183" y="127" fill="#0A4D8C" className="dark:fill-school-blueLight" fontSize="6" fontWeight="bold">Response Sent</text>
        <text x="183" y="137" fill="#64748B" className="dark:fill-slate-400" fontSize="5" fontWeight="medium">Checked and acknowledged.</text>
      </g>

      <g className="animate-float-y" style={{ animationDuration: '4s', animationDelay: '2.5s' }}>
        <rect x="142" y="160" width="85" height="35" rx="6" fill="#E8F7F4" className="dark:fill-slate-800" />
        <text x="147" y="172" fill="#138D75" fontSize="6" fontWeight="bold">Payment Receipt</text>
        <text x="147" y="182" fill="#64748B" className="dark:fill-slate-400" fontSize="5" fontWeight="medium">Invoice #F402 paid online.</text>
      </g>
    </svg>
  );
}

// 4. Student Analytics Illustration Card
function AnalyticsIllustrationCard() {
  return (
    <svg className="w-full h-full max-h-56" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="240" rx="16" fill="#F8FAFC" className="dark:fill-slate-950" />
      
      {/* Console frame */}
      <rect x="30" y="30" width="340" height="180" rx="12" fill="white" stroke="#E2E8F0" strokeWidth="1.5" className="dark:fill-slate-900 dark:stroke-slate-800 shadow" />
      
      {/* Charts Grid */}
      {/* Mini Radar Chart mockup */}
      <circle cx="110" cy="120" r="45" fill="none" stroke="#E2E8F0" className="dark:stroke-slate-800" strokeWidth="1" />
      <circle cx="110" cy="120" r="30" fill="none" stroke="#E2E8F0" className="dark:stroke-slate-800" strokeWidth="1" />
      <polygon points="110,80 145,105 130,150 90,150 75,105" fill="#0A4D8C" fillOpacity="0.25" stroke="#0A4D8C" strokeWidth="2" />
      <text x="110" y="73" fill="#64748B" fontSize="7" fontWeight="bold" textAnchor="middle">Academics</text>
      <text x="160" y="110" fill="#64748B" fontSize="7" fontWeight="bold">Sports</text>
      <text x="50" y="110" fill="#64748B" fontSize="7" fontWeight="bold">Attendance</text>

      {/* KPI stats on side */}
      <rect x="200" y="55" width="145" height="40" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" className="dark:fill-slate-950 dark:stroke-slate-855" />
      <text x="212" y="70" fill="#64748B" fontSize="7" fontWeight="bold">Institutional Retention Rate</text>
      <text x="212" y="87" fill="#138D75" fontSize="14" fontWeight="extrabold">99.4%</text>

      <rect x="200" y="110" width="145" height="45" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" className="dark:fill-slate-950 dark:stroke-slate-855" />
      <text x="212" y="125" fill="#64748B" fontSize="7" fontWeight="bold">AI Forecasted Defaulters</text>
      <text x="212" y="144" fill="#7B1E3A" fontSize="14" fontWeight="extrabold">-45% decrease</text>
    </svg>
  );
}

// ---------------------------------------------------------
// MAIN PAGE VIEW
// ---------------------------------------------------------
export default function LandingPage() {
  const { openDemoModal } = useOutletContext<LandingContext>();
  const [activeTab, setActiveTab] = useState<'admissions' | 'academics' | 'finance' | 'analytics'>('admissions');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Large Interactive Ecosystem states
  const [hoveredEco, setHoveredEco] = useState<typeof ecosystemModules[0] | null>(ecosystemModules[0]);
  const [selectedEco, setSelectedEco] = useState<typeof ecosystemModules[0] | null>(null);

  // Auto testimonial rotation
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((p) => (p + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* ---------------------------------------------------------
          0. FLOATING BACKGROUND DECORATIVE SYSTEMS
          --------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[40%] rounded-full bg-gradient-to-tr from-school-blue/5 via-school-blue/2 to-transparent blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[45%] h-[35%] rounded-full bg-gradient-to-tr from-school-green/5 via-transparent to-transparent blur-[100px]" />
        <div className="absolute top-[75%] left-[5%] w-[40%] h-[30%] rounded-full bg-gradient-to-br from-school-maroon/5 via-transparent to-transparent blur-[110px]" />
        
        {/* Floating Particles Mockup (CSS Animated) */}
        <div className="absolute top-1/4 left-1/4 w-3.5 h-3.5 rounded-full bg-school-blue/20 blur-[1px] animate-float-y" />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-school-green/15 blur-[1px] animate-float-y-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-2/3 left-10 w-2.5 h-2.5 rounded-full bg-school-maroon/25 blur-[1px] animate-float-y-reverse" />
        <div className="absolute top-4/5 right-10 w-5 h-5 rounded-full bg-school-blue/10 blur-[2px] animate-float-y" style={{ animationDelay: '3s' }} />
      </div>

      {/* ---------------------------------------------------------
          1. HERO SECTION
          --------------------------------------------------------- */}
      <section className="relative pt-24 pb-28 md:pt-36 md:pb-40 z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-school-blue/10 text-school-blue dark:text-school-blueLight text-xs font-bold border border-school-blue/20 shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-school-blue animate-spin" style={{ animationDuration: '3s' }} />
              <span>Next-Gen Enterprise School SaaS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight"
            >
              Command Your Entire School Ecosystem in <span className="premium-gradient-text">One Unified Cloud</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-semibold max-w-2xl"
            >
              Ditch slow on-premise servers. SubhraEdu empowers modern academies with institutional analytics, paperless admissions, dynamic gradebooks, and automated fee collections.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button variant="primary" size="lg" onClick={openDemoModal} rightIcon={<ArrowRight className="h-5 w-5" />} className="shadow-lg hover:shadow-xl hover:shadow-school-blue/20">
                Request Private Demo
              </Button>
              <a href="#features">
                <Button variant="outline" size="lg" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                  Explore Features
                </Button>
              </a>
            </motion.div>

            {/* Micro Stats counter row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-850"
            >
              <div>
                <span className="block text-3xl font-extrabold text-school-blue"><CountUp end={1000} suffix="+" /></span>
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Deployments</span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold text-school-green"><CountUp end={99.9} suffix="%" /></span>
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Uptime SLA</span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold text-school-maroon"><CountUp end={45} suffix="%" /></span>
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Time Saved</span>
              </div>
            </motion.div>
          </div>

          {/* Right Floating Ecosystem Orbit Mockup */}
          <div className="lg:col-span-6 flex justify-center items-center relative min-h-[520px]">
            <div className="relative w-[500px] h-[500px] flex items-center justify-center hover-pause">
              
              {/* Orbital Connected Rings (SVG paths drawing) */}
              <svg className="absolute w-full h-full inset-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="250" cy="250" r="170" fill="none" stroke="#cbd5e1" strokeWidth="1" className="dark:stroke-slate-800" />
                <circle cx="250" cy="250" r="170" fill="none" stroke="#0A4D8C" strokeWidth="1.5" strokeDasharray="8 8" className="animate-dash-move opacity-40" />
                
                <circle cx="250" cy="250" r="235" fill="none" stroke="#cbd5e1" strokeWidth="1" className="dark:stroke-slate-800" strokeDasharray="4 4" />
                <circle cx="250" cy="250" r="235" fill="none" stroke="#138D75" strokeWidth="1.5" strokeDasharray="12 12" className="animate-dash-move opacity-35" style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
              </svg>

              {/* CENTER: Floating ERP Dashboard Card Mockup */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute w-[240px] h-[160px] rounded-2xl glass-card border border-white/40 dark:border-slate-850 p-4 shadow-glass z-20 flex flex-col justify-between text-left animate-float-y"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="h-2 w-2 rounded-full bg-yellow-400" />
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                  </div>
                  <span className="text-[8px] font-extrabold text-slate-450">admin.subhraedu</span>
                </div>
                
                <div className="my-2 space-y-1.5">
                  <span className="text-[7px] font-bold text-slate-450 uppercase tracking-widest block">St. Jude Academy</span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-white block">$148,250</span>
                  <div className="w-full bg-slate-150 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-school-green h-full rounded-full" style={{ width: '84%' }} />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[8px] font-bold text-slate-400">
                  <span>Fee Ledger Collected</span>
                  <span className="text-school-green">84.2%</span>
                </div>
              </motion.div>

              {/* ORBITING NODES (Rotating wrapper CW, counter-rotation CCW to stay upright) */}
              <div className="absolute w-full h-full animate-orbit-cw">
                {heroModules.map((mod, idx) => {
                  const angle = (idx * 360) / 10;
                  const Icon = mod.icon;
                  return (
                    <div
                      key={idx}
                      className="absolute top-1/2 left-1/2 -mt-7 -ml-7 group cursor-pointer z-30"
                      style={{
                        transform: `rotate(${angle}deg) translate(170px) rotate(-${angle}deg)`
                      }}
                    >
                      <div className="animate-orbit-ccw hover-pause-child">
                        <motion.div
                          whileHover={{ scale: 1.25, boxShadow: '0 0 20px rgba(10, 77, 140, 0.4)' }}
                          className="w-14 h-14 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium flex items-center justify-center text-slate-650 dark:text-slate-300 transition-all"
                          style={{ borderColor: mod.color + '40' }}
                        >
                          <Icon className="h-5.5 w-5.5 transition-colors group-hover:text-white" style={{ color: mod.color }} />
                        </motion.div>
                        
                        {/* Hover Data preview tooltip */}
                        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-slate-900/95 dark:bg-white text-white dark:text-slate-900 text-[9px] font-bold rounded-lg py-1.5 px-3 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 shadow-glass border border-slate-800 dark:border-slate-200 z-50">
                          <span className="block uppercase text-[7px] text-slate-400 dark:text-slate-500 font-extrabold">{mod.name} Module</span>
                          <span className="text-[10px]">{mod.preview}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Second Orbit Nodes (Outer ring, slower) */}
              <div className="absolute w-full h-full animate-orbit-cw-slow" style={{ animationDuration: '65s' }}>
                {[
                  { name: 'Hostel', icon: HomeIcon, color: '#7B1E3A', angle: 45 },
                  { name: 'HR Control', icon: ShieldAlert, color: '#138D75', angle: 165 },
                  { name: 'Gradebook', icon: BookOpen, color: '#0A4D8C', angle: 285 }
                ].map((mod, idx) => {
                  const Icon = mod.icon;
                  return (
                    <div
                      key={idx}
                      className="absolute top-1/2 left-1/2 -mt-6 -ml-6 group cursor-pointer z-30"
                      style={{
                        transform: `rotate(${mod.angle}deg) translate(235px) rotate(-${mod.angle}deg)`
                      }}
                    >
                      <div className="animate-orbit-ccw-slow hover-pause-child">
                        <motion.div
                          whileHover={{ scale: 1.25 }}
                          className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow flex items-center justify-center text-slate-400 transition-all"
                        >
                          <Icon className="h-5 w-5" style={{ color: mod.color }} />
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ---------------------------------------------------------
          2. DYNAMIC VISUAL FEATURES SHOWCASE (Animated SVGs)
          --------------------------------------------------------- */}
      <section id="features" className="py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-16">
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-school-blue uppercase tracking-widest bg-school-blue/10 px-3.5 py-1.5 rounded-full border border-school-blue/20">Interactive Modules</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Supercharged Operations, Visualized</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              We replaced boring tables and static data screens with real-time indicators, charts, and interactive control decks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { component: AttendanceIllustration, title: 'Attendance Ledger', desc: 'Active RFID tracking, classroom smartgate logging, and instant parent notifications dispatch.' },
              { component: FeeIllustration, title: 'Fee Cash Flow', desc: 'Secure credit card checkout pipelines, custom ledger auditing, and automatic late fee reminders.' },
              { component: ExaminationIllustration, title: 'Grade Diagnostics', desc: 'Calculates performance graphs, weights marks, publishes report cards, and displays GPA boards.' },
              { component: TransportIllustration, title: 'Transport Tracking', desc: 'Active school bus route mapping, geo-fence trackers, driver registers, and delay SMS notifications.' },
              { component: CommunicationIllustration, title: 'Unified Gateway', desc: 'Integrates automated email templates, bulk sms schedules, and direct classroom push message channels.' },
              { component: LibraryIllustration, title: 'Smart Library Shelf', desc: 'Barcode checkouts, virtual catalog searches, book due list flagging, and late fine processing.' },
              { component: AnalyticsIllustration, title: 'AI Student Insights', desc: 'Leverages model analysis to output grade indicators, attendance reports, and cash flow forecast projections.' },
              {
                component: () => (
                  <div className="w-full h-44 rounded-xl bg-slate-100 dark:bg-slate-955 flex flex-col justify-center items-center text-center p-6 border border-slate-200 dark:border-slate-800">
                    <Sparkles className="h-10 w-10 text-school-maroon animate-bounce mb-3" />
                    <span className="text-xs font-bold text-slate-800 dark:text-white">And 5+ More Modules</span>
                    <span className="text-[10px] text-slate-450 font-bold mt-1">Hostels, HR & Payroll, Admissions, Classroom schedulers</span>
                  </div>
                ),
                title: 'Full ERP Core Platform',
                desc: 'Consolidate campus settings, security layers, student directories, and staff payroll under one domain.'
              }
            ].map((feat, idx) => {
              const Illustration = feat.component;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  className="group relative h-full"
                >
                  <Card className="h-full border border-slate-200/80 dark:border-slate-850 hover:border-school-blue/30 dark:hover:border-school-blue/40 bg-white dark:bg-slate-900 flex flex-col justify-between items-start text-left p-6 shadow-premium hover:shadow-cardHover transition-all rounded-2xl overflow-hidden">
                    <div className="w-full mb-6">
                      <Illustration />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-school-blue transition-colors">{feat.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed font-semibold">{feat.desc}</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          3. LARGE INTERACTIVE ERP ECOSYSTEM
          --------------------------------------------------------- */}
      <section className="py-24 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6 space-y-16 text-center">
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-school-maroon uppercase tracking-widest bg-school-maroon/10 px-3.5 py-1.5 rounded-full border border-school-maroon/20">Rule Engine Blueprint</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Interactive Platform Blueprint</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Hover over modules to preview active data pipelines linking back to the central administrative database.
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto min-h-[580px] flex items-center justify-center hover-pause">
            {/* SVG Connecting network lines */}
            <svg className="absolute w-full h-full inset-0 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="384" cy="290" r="210" fill="none" stroke="#E2E8F0" strokeWidth="1" className="dark:stroke-slate-800" />
              <circle cx="384" cy="290" r="210" fill="none" stroke="#7B1E3A" strokeWidth="1.5" strokeDasharray="10 10" className="animate-dash-move opacity-35" style={{ animationDuration: '4s' }} />
              
              {/* Live drawing rays from nodes to center */}
              {ecosystemModules.map((mod, idx) => {
                const angle = (idx * 2 * Math.PI) / 12;
                const x2 = 384 + 210 * Math.cos(angle);
                const y2 = 290 + 210 * Math.sin(angle);
                const isHovered = hoveredEco?.name === mod.name;
                return (
                  <line 
                    key={idx} 
                    x1="384" 
                    y1="290" 
                    x2={x2} 
                    y2={y2} 
                    stroke={isHovered ? mod.color : '#cbd5e1'} 
                    strokeWidth={isHovered ? '2' : '0.75'} 
                    strokeDasharray={isHovered ? '4 4' : 'none'}
                    className={`transition-all duration-300 dark:stroke-slate-800 ${isHovered ? 'animate-dash-move' : 'opacity-30'}`} 
                  />
                );
              })}
            </svg>

            {/* Orbit Core administrative unit */}
            <div className="absolute w-72 h-72 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-glass flex flex-col items-center justify-center p-6 text-center z-20">
              <AnimatePresence mode="wait">
                {hoveredEco ? (
                  <motion.div 
                    key={hoveredEco.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-3"
                  >
                    <div className="h-14 w-14 rounded-full mx-auto flex items-center justify-center text-white shadow shadow-premium transition-transform duration-500 hover:rotate-12" style={{ backgroundColor: hoveredEco.color }}>
                      <hoveredEco.icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-base font-extrabold tracking-tight">{hoveredEco.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-relaxed font-semibold px-2">{hoveredEco.desc}</p>
                    <button 
                      onClick={() => setSelectedEco(hoveredEco)}
                      className="text-[10px] font-bold text-school-blue hover:underline cursor-pointer flex items-center gap-1 mx-auto mt-2"
                    >
                      <span>Expand Sub-Features</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    <GraduationCap className="h-10 w-10 text-school-blue mx-auto animate-bounce" />
                    <h4 className="text-sm font-extrabold tracking-tight">SubhraEdu Platform</h4>
                    <p className="text-[11px] text-slate-455 font-semibold px-4">Hover over any module orbiting around the core platform to view active data flows</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Orbiting Ecosystem Nodes */}
            <div className="absolute w-full h-full animate-orbit-cw" style={{ animationDuration: '45s' }}>
              {ecosystemModules.map((mod, idx) => {
                const angle = (idx * 360) / 12;
                const Icon = mod.icon;
                const isHovered = hoveredEco?.name === mod.name;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredEco(mod)}
                    onClick={() => setSelectedEco(mod)}
                    className="absolute top-1/2 left-1/2 -mt-7 -ml-7 group cursor-pointer z-30"
                    style={{
                      transform: `rotate(${angle}deg) translate(210px) rotate(-${angle}deg)`
                    }}
                  >
                    <div className="animate-orbit-ccw hover-pause-child" style={{ animationDuration: '45s' }}>
                      <div 
                        className={`w-14 h-14 rounded-full border bg-white dark:bg-slate-900 shadow-premium flex items-center justify-center text-slate-650 dark:text-slate-355 transition-all duration-300 ${isHovered ? 'scale-115 border-school-blue/50 ring-4 ring-school-blue/10 dark:ring-school-blue/30' : 'scale-100 border-slate-200 dark:border-slate-800'}`}
                      >
                        <Icon className="h-5.5 w-5.5" style={{ color: isHovered ? mod.color : undefined }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Detail Overlay Modal for Large Interactive Ecosystem */}
      <Modal 
        isOpen={!!selectedEco} 
        onClose={() => setSelectedEco(null)} 
        title={selectedEco ? `${selectedEco.name} Sub-Features Blueprint` : ''}
      >
        {selectedEco && (
          <div className="space-y-6 text-left p-2">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              {selectedEco.desc} Our enterprise cloud integrates these critical sub-modules instantly:
            </p>
            <div className="grid grid-cols-2 gap-4">
              {selectedEco.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                  <Check className="h-4.5 w-4.5 text-school-green shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{detail}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setSelectedEco(null)}>Close</Button>
              <Button variant="primary" size="sm" onClick={() => { setSelectedEco(null); openDemoModal(); }}>Request Custom Demo</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ---------------------------------------------------------
          4. DASHBOARD PREVIEW SECTION (Glassmorphism Mockup)
          --------------------------------------------------------- */}
      <section className="py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-950/10">
        <div className="max-w-7xl mx-auto px-6 space-y-16 text-center">
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-school-green uppercase tracking-widest bg-school-green/10 px-3.5 py-1.5 rounded-full border border-school-green/20">Live Interface</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Luxury Glassmorphism Console</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              We reject outdated 90s administrative table portals. Here is a live layout preview of your daily institutional dashboard.
            </p>
          </div>

          <div className="max-w-5xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 md:p-8 shadow-glass backdrop-blur-md overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-school-blue/5 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-school-maroon/5 blur-3xl rounded-full" />

            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3.5 w-3.5 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs font-bold text-slate-400 tracking-wider">aegis-dashboard-preview-v4.1</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-school-blue/10 text-school-blue dark:text-school-blueLight text-[10px] font-bold border border-school-blue/15 animate-pulse">
                Dynamic Mode
              </div>
            </div>

            {/* Inside Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              
              {/* Col 1: Performance card */}
              <div className="border border-slate-150 dark:border-slate-800/80 rounded-2xl p-5 bg-white dark:bg-slate-950 flex flex-col justify-between text-left shadow-premium hover:shadow-cardHover transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Institution Revenue</span>
                  <CreditCard className="h-4 w-4 text-school-green" />
                </div>
                <div className="my-6">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">$324,800</span>
                  <span className="text-[9px] block text-school-green font-bold mt-1">+12.4% vs Last Term</span>
                </div>
                <div className="h-16 flex items-end gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-900">
                  {[20, 30, 25, 45, 60, 52, 75].map((h, i) => (
                    <div key={i} className="flex-1 bg-school-green/10 rounded-sm h-full relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 right-0 bg-school-green rounded-sm transition-all duration-1000" style={{ height: `${h}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Col 2: Average attendance card */}
              <div className="border border-slate-150 dark:border-slate-800/80 rounded-2xl p-5 bg-white dark:bg-slate-950 flex flex-col justify-between text-left shadow-premium hover:shadow-cardHover transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">Daily Attendance</span>
                  <Calendar className="h-4 w-4 text-school-blue" />
                </div>
                <div className="my-6">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">96.84%</span>
                  <span className="text-[9px] block text-school-blue font-bold mt-1">Average Pupil Presence Rate</span>
                </div>
                <div className="h-16 flex items-end gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-900">
                  {[45, 55, 65, 80, 75, 90, 96].map((h, i) => (
                    <div key={i} className="flex-1 bg-school-blue/10 rounded-sm h-full relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 right-0 bg-school-blue rounded-sm transition-all duration-1000" style={{ height: `${h}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Col 3: Alerts Feed */}
              <div className="border border-slate-150 dark:border-slate-800/80 rounded-2xl p-5 bg-white dark:bg-slate-950 flex flex-col justify-between text-left shadow-premium hover:shadow-cardHover transition-all">
                <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider">System Activity Logs</span>
                <div className="space-y-2.5 my-4 overflow-hidden h-28">
                  <div className="flex gap-2 items-start text-[10px] p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-155 dark:border-slate-850">
                    <span className="h-2 w-2 rounded-full bg-school-green mt-1 shrink-0" />
                    <p className="text-slate-500 font-semibold"><span className="font-extrabold text-slate-800 dark:text-slate-200">Terminal Gate 2</span> recorded student check-in checkout.</p>
                  </div>
                  <div className="flex gap-2 items-start text-[10px] p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-155 dark:border-slate-850">
                    <span className="h-2 w-2 rounded-full bg-school-blue mt-1 shrink-0" />
                    <p className="text-slate-500 font-semibold"><span className="font-extrabold text-slate-800 dark:text-slate-200">Parent #304</span> cleared tuition balance receipt.</p>
                  </div>
                  <div className="flex gap-2 items-start text-[10px] p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-155 dark:border-slate-850">
                    <span className="h-2 w-2 rounded-full bg-school-maroon mt-1 shrink-0" />
                    <p className="text-slate-500 font-semibold"><span className="font-extrabold text-slate-800 dark:text-slate-200">Teacher Sen</span> submitted Grade 10 marks list.</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-school-blue text-right block hover:underline cursor-pointer">Explore Audits →</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          5. CORE MODULES SHOWCASE (INTERACTIVE TABS WITH ILLUSTRATIONS)
          --------------------------------------------------------- */}
      <section id="modules" className="py-24 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-school-green uppercase tracking-widest bg-school-green/10 px-3.5 py-1.5 rounded-full border border-school-green/20">System Core Showcase</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Premium Architecture Mockups</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Take an interactive look at the technical architecture of our four main institutional centers.
            </p>
          </div>

          {/* Tabs header */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {(['admissions', 'academics', 'finance', 'analytics'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-school-blue border-school-blue text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                {tab.toUpperCase()} SHOWCASE
              </button>
            ))}
          </div>

          {/* Active Tab Card Details with SVG Illustration */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center rounded-3xl shadow-premium">
                  <div className="md:col-span-7 space-y-6 text-left">
                    <div className="inline-block px-3 py-1 bg-school-blue/10 text-school-blue rounded text-[10px] font-bold">
                      {activeTab.toUpperCase()} ENGINE
                    </div>
                    <h3 className="text-2xl font-extrabold tracking-tight text-slate-850 dark:text-white">
                      {showcaseData[activeTab].title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-455 leading-relaxed text-sm font-semibold">
                      {showcaseData[activeTab].desc}
                    </p>
                    <ul className="grid grid-cols-2 gap-4">
                      {showcaseData[activeTab].points.map((p, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-350">
                          <Check className="h-4.5 w-4.5 text-school-green shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:col-span-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 text-center border border-slate-150 dark:border-slate-850 flex flex-col justify-between h-full min-h-[250px]">
                    <div className="w-full h-full flex items-center justify-center min-h-[160px]">
                      {activeTab === 'admissions' && <AdminIllustrationCard />}
                      {activeTab === 'academics' && <TeacherIllustrationCard />}
                      {activeTab === 'finance' && <ParentIllustrationCard />}
                      {activeTab === 'analytics' && <AnalyticsIllustrationCard />}
                    </div>
                    <div className="pt-4 border-t border-slate-200/60 dark:border-slate-850 flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-school-blue uppercase">{showcaseData[activeTab].stats}</span>
                      <Button variant="outline" size="sm" onClick={openDemoModal}>Explore Panel</Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          6. TRUST / STATISTICS (SCROLL COUNTERS)
          --------------------------------------------------------- */}
      <section className="py-20 bg-gradient-to-r from-school-blue to-school-blueDark text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="50" x2="1000" y2="50" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
            <line x1="200" y1="0" x2="200" y2="500" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <div className="space-y-2">
            <span className="block text-4xl md:text-5xl font-extrabold tracking-tight">
              <CountUp end={1200} suffix="+" />
            </span>
            <span className="text-xs font-bold text-school-blueLight/80 uppercase tracking-widest">Active Schools</span>
          </div>
          <div className="space-y-2">
            <span className="block text-4xl md:text-5xl font-extrabold tracking-tight">
              <CountUp end={180000} suffix="+" />
            </span>
            <span className="text-xs font-bold text-school-blueLight/80 uppercase tracking-widest">Pupils Managed</span>
          </div>
          <div className="space-y-2">
            <span className="block text-4xl md:text-5xl font-extrabold tracking-tight">
              <CountUp end={95000} suffix="+" />
            </span>
            <span className="text-xs font-bold text-school-blueLight/80 uppercase tracking-widest">Parents Online</span>
          </div>
          <div className="space-y-2">
            <span className="block text-4xl md:text-5xl font-extrabold tracking-tight">
              <CountUp end={99.98} suffix="%" />
            </span>
            <span className="text-xs font-bold text-school-blueLight/80 uppercase tracking-widest">Server Uptime SLA</span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          7. PROCESS PROGRESSION MAP (Connected Arrows)
          --------------------------------------------------------- */}
      <section className="py-24 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6 space-y-16 text-center">
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-school-maroon uppercase tracking-widest bg-school-maroon/10 px-3.5 py-1.5 rounded-full border border-school-maroon/20">Operational Flow</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Unified School Lifecycle</h2>
            <p className="text-slate-500 dark:text-slate-450 font-medium">
              Trace the automated journey of a student profile from registration to parent report sharing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 max-w-5xl mx-auto relative items-center">
            {[
              { step: '01', title: 'Admissions', desc: 'Custom forms, digital files verify, portal setup.', icon: UserCheck, color: 'border-school-blue text-school-blue bg-school-blue/5' },
              { step: '02', title: 'Attendance', desc: 'Smart check-in gates, biometric updates.', icon: Calendar, color: 'border-school-green text-school-green bg-school-green/5' },
              { step: '03', title: 'Exams Plan', desc: 'Schedules hall matrix, uploads papers.', icon: Award, color: 'border-school-maroon text-school-maroon bg-school-maroon/5' },
              { step: '04', title: 'Grade Cards', desc: 'Weight calculation, auto grade publish.', icon: FileText, color: 'border-school-blue text-school-blue bg-school-blue/5' },
              { step: '05', title: 'Share Report', desc: 'Parents receive pdf grades, clear fees.', icon: MessageSquare, color: 'border-school-green text-school-green bg-school-green/5' }
            ].map((p, idx) => (
              <div key={idx} className="relative flex flex-col items-center group">
                <motion.div 
                  whileHover={{ scale: 1.08 }}
                  className={`h-16 w-16 rounded-2xl border-2 flex items-center justify-center shadow-premium relative z-10 transition-colors bg-white dark:bg-slate-900 ${p.color}`}
                >
                  <p.icon className="h-6 w-6" />
                  <span className="absolute -top-3.5 -right-3 h-6 w-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-extrabold flex items-center justify-center shadow">
                    {p.step}
                  </span>
                </motion.div>
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-white mt-4">{p.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-455 font-semibold text-center mt-2 px-4 leading-relaxed">{p.desc}</p>
                
                {/* Connecting Arrow SVG right */}
                {idx < 4 && (
                  <div className="hidden md:block absolute top-8 left-[75%] w-[50%] h-4 pointer-events-none z-0">
                    <svg className="w-full h-full" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 0 10 L 90 10 M 80 5 L 90 10 L 80 15" stroke="#cbd5e1" strokeWidth="2.5" className="dark:stroke-slate-800 animate-arrow-flow" strokeDasharray="6,6" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          8. TESTIMONIALS SLIDER
          --------------------------------------------------------- */}
      <section className="py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-950/5">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-school-blue uppercase tracking-widest bg-school-blue/10 px-3.5 py-1.5 rounded-full border border-school-blue/20">Success Records</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Evaluations by Directors</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Read how principals and administrative board heads value their ERP migration to SubhraEdu.
            </p>
          </div>

          <div className="max-w-3xl mx-auto min-h-[250px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.4 }}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 md:p-10 rounded-3xl shadow-glass flex flex-col justify-between text-left animate-float-y"
              >
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonials[testimonialIndex].rating }).map((_, i) => (
                      <Star key={i} className="h-4.5 w-4.5 fill-yellow-400 text-yellow-400 shrink-0" />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base italic leading-relaxed font-medium">
                    "{testimonials[testimonialIndex].text}"
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-850 pt-5 mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-school-blue/10 text-school-blue dark:text-school-blueLight flex items-center justify-center text-xs font-bold uppercase shrink-0">
                      {testimonials[testimonialIndex].name.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-855 dark:text-white leading-tight">{testimonials[testimonialIndex].name}</h4>
                      <span className="text-[10px] font-bold text-slate-400">{testimonials[testimonialIndex].role}</span>
                    </div>
                  </div>
                  
                  {/* Slider controllers */}
                  <div className="flex gap-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setTestimonialIndex(i)}
                        className={`h-2.5 w-2.5 rounded-full transition-all cursor-pointer ${testimonialIndex === i ? 'w-6 bg-school-blue' : 'bg-slate-200 dark:bg-slate-800'}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>



      {/* ---------------------------------------------------------
          10. REQUEST DEMO CTA (Animated Background & Floating Icons)
          --------------------------------------------------------- */}
      <section className="py-24 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative rounded-3xl bg-gradient-to-r from-school-blue via-school-blueDark to-school-maroon p-10 md:p-16 text-white text-center overflow-hidden shadow-glass">
            
            {/* Background vector graphics orbits */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50%" cy="50%" r="200" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="5,5" />
                <circle cx="50%" cy="50%" r="350" fill="none" stroke="white" strokeWidth="1" strokeDasharray="10,10" />
              </svg>
            </div>

            {/* Floating educational vector icons in background */}
            <div className="absolute top-8 left-8 text-white/10 animate-float-y pointer-events-none">
              <GraduationCap className="h-16 w-16" />
            </div>
            <div className="absolute bottom-8 right-8 text-white/10 animate-float-y-reverse pointer-events-none" style={{ animationDelay: '1s' }}>
              <BookOpen className="h-14 w-14" />
            </div>
            <div className="absolute top-1/2 right-12 text-white/10 animate-float-y pointer-events-none" style={{ animationDelay: '2s' }}>
              <Sparkles className="h-10 w-10" />
            </div>

            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Ready to Upgrade Your Institution?</h2>
              <p className="text-sm md:text-base text-school-blueLight/85 font-semibold leading-relaxed">
                Connect with our deployment engineers. Schedule a private guided tour of the administrative console, parent apps, and check-in smartgates.
              </p>
              <div className="flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    variant="success" 
                    size="lg" 
                    onClick={openDemoModal} 
                    className="cursor-pointer shadow-xl shadow-school-greenDark/30 bg-school-green hover:bg-school-greenDark border-none ring-4 ring-school-green/20 font-bold px-8 py-4 text-base"
                  >
                    Schedule Custom Demo Now
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          11. FAQ ACCORDION SECTION
          --------------------------------------------------------- */}
      <section id="faqs" className="py-24 border-t border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-950/20">
        <div className="max-w-4xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-school-blue uppercase tracking-widest bg-school-blue/10 px-3.5 py-1.5 rounded-full border border-school-blue/20">FAQ Help desk</span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Frequently Answered Queries</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Learn more about setting up portals and migrating historical records.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-all duration-300">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-slate-800 dark:text-white cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-school-blue shrink-0" />
                    <span className="text-xs md:text-sm font-extrabold">{faq.q}</span>
                  </span>
                  <ChevronRight className={`h-4.5 w-4.5 text-slate-400 shrink-0 transition-transform ${activeFaq === idx ? 'rotate-90 text-school-blue' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-slate-550 dark:text-slate-400 text-xs md:text-sm leading-relaxed border-t border-slate-100 dark:border-slate-850 pt-4 font-semibold">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

// ---------------------------------------------------------
// COMPONENT LIST DATA & DETAILS
// ---------------------------------------------------------

const heroModules = [
  { name: 'Students', icon: Users, color: '#0A4D8C', preview: '2.4K Active Student Folders' },
  { name: 'Teachers', icon: GraduationCap, color: '#138D75', preview: '142 Gradebooks Live' },
  { name: 'Parents', icon: Users, color: '#7B1E3A', preview: '1.2K Checkout Statements' },
  { name: 'Attendance', icon: Calendar, color: '#0A4D8C', preview: '96.8% Average Checked In' },
  { name: 'Examination', icon: Award, color: '#138D75', preview: 'Term-I Report Cards Published' },
  { name: 'Fees', icon: CreditCard, color: '#7B1E3A', preview: '$184K Collected This Month' },
  { name: 'Transport', icon: Bus, color: '#0A4D8C', preview: '8 Active Bus Tracker GPS Lines' },
  { name: 'Library', icon: LibraryIcon, color: '#138D75', preview: '240 Checked out Books Today' },
  { name: 'Communication', icon: MessageSquare, color: '#7B1E3A', preview: '14,250 Bulk SMS Queue' },
  { name: 'Analytics', icon: BarChart3, color: '#0A4D8C', preview: 'Cash flow: +14% Prediction' }
];

const ecosystemModules = [
  { name: 'Students', desc: 'Central student profile registry and online admissions pipeline.', icon: Users, color: '#0A4D8C', details: ['Biometric Smart ID Cards', 'Digital Document Lockers', 'Behavior Conduct Records', 'Sibling Student Groupings'] },
  { name: 'Parents', desc: 'Sleek, transparent interface for child grades & direct bill payments.', icon: Users, color: '#7B1E3A', details: ['3-Click Online Fee Pay', 'Real-time Marksheets Access', 'Active GPS Bus Trackers', 'Homework Review signoffs'] },
  { name: 'Teachers', desc: 'Saves classroom hours with digital attendance logs and planners.', icon: GraduationCap, color: '#138D75', details: ['Mobile Attendance Entry', 'Lesson Progress Checkers', 'Instant Gradebook Publishers', 'Notice Broadcasters'] },
  { name: 'Admin', desc: 'Complete institutional controls and campus settings panels.', icon: ShieldAlert, color: '#0A4D8C', details: ['Campus Ledger Auditing', 'Unified HR & Payroll logs', 'Custom Department Budgets', 'Role Permissions Control'] },
  { name: 'Library', desc: 'Automated barcode scanner cataloging and fine processing.', icon: LibraryIcon, color: '#138D75', details: ['Online Catalog Searches', 'Barcode Reader Integration', 'Auto Fine Aggregators', 'Overdue Notification alerts'] },
  { name: 'Transport', desc: 'Live school bus routes, driver rosters, and location updates.', icon: Bus, color: '#0A4D8C', details: ['Geo-fence Boundary Alerts', 'Fuel & Mileage logs', 'Driver Log Auditing', 'Location SMS triggers'] },
  { name: 'Attendance', desc: 'Daily check-in logs with active RFID gate integration support.', icon: Calendar, color: '#138D75', details: ['RFID Gate Integrations', 'Absent SMS Autotriggers', 'Monthly Percentage reports', 'Leave Request Checkers'] },
  { name: 'Fees', desc: 'Recurring custom fee schedules, billing collections, and invoices.', icon: CreditCard, color: '#7B1E3A', details: ['Secure Payment Checkouts', 'Late Fee Invoicing Rules', 'Consolidated Ledger logs', 'PDF Receipts dispatch'] },
  { name: 'Exams', desc: 'Automated exam hall matrix grids and grading configurations.', icon: Award, color: '#0A4D8C', details: ['Custom Grading systems', 'Exam Schedule Builders', 'Weightage Configuration', 'Hall Ticket Creators'] },
  { name: 'Results', desc: 'Instant marks distribution sheets and subject progress charts.', icon: BarChart3, color: '#138D75', details: ['Subject Analysis logs', 'Rank & Percentile charts', 'Digital Gradecards PDF', 'AI Grade Improvement tips'] },
  { name: 'Timetable', desc: 'Conflict-free classroom mapping planners and teacher rosters.', icon: Calendar, color: '#0A4D8C', details: ['Teacher-Class Roster Planners', 'Substitute Auto Mappings', 'Room Occupancy Matrix', 'Weekly Lecture Schedules'] },
  { name: 'Communication', desc: 'Central gateway for institutional SMS, Email, and Push alerts.', icon: MessageSquare, color: '#7B1E3A', details: ['Emergency Alert System', 'Teacher-Parent Chat lines', 'Bulk Notice Campaigns', 'Staff Bulletins board'] }
];

const showcaseData = {
  admissions: {
    title: 'Paperless Digital Admissions Engine',
    desc: 'Eliminate registration lines and paperwork. Design custom multi-step online forms and process applicant verification vaults automatically.',
    points: ['Online Application Builders', 'Digital Document Verification', 'Seat Matrix Allocators', 'Automatic Portal Activation'],
    stats: '85% Faster Admissions Cycle'
  },
  academics: {
    title: 'Integrated Lesson Planners & Grading Logs',
    desc: 'Empower teachers with lesson milestone trackers, syllabus progression check sheets, conflict-free calendars, and instant grading desks.',
    points: ['National Syllabus Mappings', 'Interactive Teacher Planners', 'Roster Substitute Allocators', 'One-Click Grade Publishing'],
    stats: '15+ Hours Saved Weekly / Teacher'
  },
  finance: {
    title: 'Automated Billing & Secure Gateway Collections',
    desc: 'Issue custom fee schedules, track collection accounts, send automated late invoice alerts, and process secure parent card payments.',
    points: ['Flexible Fee Structure setups', 'Automated Late Fee Rules', 'Multi-gateway (UPI, Cards) Checkouts', 'Auto-generated PDF Invoices'],
    stats: '45% Defaulter Reductions'
  },
  analytics: {
    title: 'AI Predictive Institutional Diagnostics',
    desc: 'Analyze institution indicators in real-time. Predict student dropout alerts, trace class marks distributions, and view cash flow forecasts.',
    points: ['AI Student Performance Tips', 'Seasonal Absence Anomaly Alerts', 'Revenue Collection forecasts', 'Custom Department Cost audits'],
    stats: '99.4% Accurate Projections'
  }
};

const testimonials = [
  {
    name: 'Dr. Arthur Sterling',
    role: 'Board President, Sterling Academies',
    text: 'SubhraEdu transformed our entire district. Managing 5 campus sites, 12,000 students, and unified billing used to take a team of 40. Now we handle everything seamlessly from a single dashboard.',
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
    text: 'Its rare to find a platform with both high-level financial tracking and detailed academic tools. SubhraEdu looks premium, runs lightning-fast, and their API structure is highly scalable.',
    rating: 5
  }
];

const faqs = [
  { q: 'How long does the ERP migration and setup take?', a: 'Setting up your customized SubhraEdu instance takes 5 to 7 business days, including migrating student rosters, historical grade books, and teacher database profiles.' },
  { q: 'Is our student records database secure?', a: 'Absolutely. We enforce end-to-end data encryption in transit and at rest. Our infrastructure runs on dedicated enterprise cloud servers following strict safety compliance standards.' },
  { q: 'Can we configure custom permissions for departments?', a: 'Yes. SubhraEdu supports role-based permissions access. You can define distinct restrictions for finance officers, academic coordinators, registrar admins, and transport drivers.' },
  { q: 'Does SubhraEdu integrate with hardware systems like RFID?', a: 'Yes. We support RFID smartgate scanners, biometric staff timesheets, and global SMS gateways for real-time alerts.' }
];
