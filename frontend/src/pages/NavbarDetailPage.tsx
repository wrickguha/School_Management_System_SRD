import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useOutletContext, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Check, ChevronRight, Activity, Award, ArrowRight,
  Users, CreditCard, BookOpen, ShieldCheck, Play, Tv,
  ChevronLeft, CheckCircle, Smartphone, Truck, Heart
} from 'lucide-react';
import { navbarPagesData, type PageMetric, type PageFeature } from '../data/navbarPagesData';
import { Button } from '../components/ui/Button';
import SubhraEduOnePage from './SubhraEduOnePage';
import MobileAppsPage from './MobileAppsPage';
import ExperientialLearningPage from './ExperientialLearningPage';
import PreSchoolManagementPage from './PreSchoolManagementPage';
import CaseStudiesPage from './CaseStudiesPage';

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
// 1. BEAKER CHEMICAL MIXING SIMULATOR
// ---------------------------------------------------------
function BeakerSimulator() {
  const [liquidColor, setLiquidColor] = useState('bg-sky-400');
  const [beakerText, setBeakerText] = useState('H2O (Water)');
  const [isBubbling, setIsBubbling] = useState(false);

  const mix = (color: string, chemical: string) => {
    setIsBubbling(true);
    setLiquidColor(color);
    setBeakerText(chemical);
    setTimeout(() => setIsBubbling(false), 2000);
  };

  return (
    <div className="w-full h-52 rounded-2xl bg-slate-955 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden relative shadow-inner">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Virtual Science Sandbox</span>
      
      <div className="flex justify-center items-center gap-6 my-1">
        {/* Beaker Graphic */}
        <div className="relative w-14 h-24 border-4 border-slate-700 rounded-b-xl border-t-0 bg-slate-900/50 flex flex-col justify-end p-0.5 overflow-hidden">
          {/* Beaker markings */}
          <div className="absolute left-1 top-2 w-2 h-0.5 bg-slate-600" />
          <div className="absolute left-1 top-6 w-3.5 h-0.5 bg-slate-600" />
          <div className="absolute left-1 top-10 w-2 h-0.5 bg-slate-600" />
          <div className="absolute left-1 top-14 w-3.5 h-0.5 bg-slate-600" />
          <div className="absolute left-1 top-18 w-2 h-0.5 bg-slate-600" />

          {/* Liquid */}
          <div className={`w-full transition-all duration-700 rounded-b-lg relative ${liquidColor}`} style={{ height: '70%' }}>
            {isBubbling && (
              <div className="absolute inset-0 bg-repeat-x bg-[size:10px_10px] animate-pulse flex justify-around items-end pb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-white/40 animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-white/30 animate-bounce delay-100" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/40 animate-bounce delay-200" />
              </div>
            )}
          </div>
        </div>

        {/* Buttons and Chemical State */}
        <div className="flex flex-col gap-2 text-left">
          <span className="text-[10px] text-slate-400 font-bold">Active Chemical:</span>
          <span className="text-xs text-white font-extrabold">{beakerText}</span>
          <div className="flex gap-2">
            <button
              onClick={() => mix('bg-rose-500/80', 'CuSO4 + NaOH (Acidic)')}
              disabled={isBubbling}
              className="px-2.5 py-1 bg-rose-650 hover:bg-rose-700 disabled:opacity-50 text-[9px] font-bold text-white rounded transition-colors cursor-pointer"
            >
              Add Reagent A
            </button>
            <button
              onClick={() => mix('bg-purple-600/80', 'Litmus Base Reaction')}
              disabled={isBubbling}
              className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-[9px] font-bold text-white rounded transition-colors cursor-pointer"
            >
              Add Reagent B
            </button>
          </div>
        </div>
      </div>
      
      <div className="text-[10px] text-slate-400 font-bold text-center">
        {isBubbling ? '🧪 Reaction Bubbling...' : 'Click buttons to mix chemicals'}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 2. ACL PERMISSION BUILDER (Administration)
// ---------------------------------------------------------
function AclPermissionManager() {
  const [permissions, setPermissions] = useState({
    fees: { admin: true, teacher: false, clerk: true },
    exams: { admin: true, teacher: true, clerk: false },
    admissions: { admin: true, teacher: false, clerk: true }
  });

  const toggle = (module: 'fees' | 'exams' | 'admissions', role: 'admin' | 'teacher' | 'clerk') => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [role]: !prev[module][role]
      }
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-premium space-y-4 text-left">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Active Directory Access Matrix</span>
        <span className="h-2 w-2 rounded-full bg-school-green animate-pulse" />
      </div>
      <div className="space-y-3">
        {Object.entries(permissions).map(([modName, roles]) => (
          <div key={modName} className="flex justify-between items-center py-1">
            <span className="text-xs font-bold capitalize text-slate-800 dark:text-white">{modName} Module</span>
            <div className="flex gap-2">
              {(['admin', 'teacher', 'clerk'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => toggle(modName as any, role)}
                  className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                    roles[role]
                      ? 'bg-school-blue/10 border border-school-blue/30 text-[#0A4D8C] dark:text-sky-400'
                      : 'bg-slate-100 dark:bg-slate-800 border border-transparent text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="text-[10px] text-slate-400 font-semibold leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
        * Admin, Teacher, and Clerk database triggers dynamically self-isolate when toggled above.
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 3. INTERACTIVE INVOICE CALCULATOR (Finance)
// ---------------------------------------------------------
function InvoiceBuilder() {
  const [tuition, setTuition] = useState(400);
  const [transport, setTransport] = useState(true);
  const [exams, setExams] = useState(false);

  const total = tuition + (transport ? 80 : 0) + (exams ? 30 : 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-premium space-y-5 text-left">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Interactive Fee Invoicer</span>
        <span className="text-xs text-[#138D75] font-extrabold">Auto-Ledger Active</span>
      </div>

      <div className="space-y-3">
        {/* Tuition slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-600 dark:text-slate-400">Base Tuition Fee:</span>
            <span className="text-slate-800 dark:text-white">${tuition}</span>
          </div>
          <input 
            type="range" 
            min="200" 
            max="800" 
            step="50"
            value={tuition} 
            onChange={(e) => setTuition(Number(e.target.value))}
            className="w-full h-1 bg-slate-150 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-school-green" 
          />
        </div>

        {/* Checkboxes */}
        <div className="flex flex-col gap-2 pt-2">
          <label className="flex items-center gap-2.5 text-xs font-bold text-slate-605 dark:text-slate-400 cursor-pointer">
            <input 
              type="checkbox" 
              checked={transport} 
              onChange={() => setTransport(!transport)}
              className="rounded text-school-green border-slate-350 focus:ring-school-green"
            />
            <span>Add Transport Allowance (+$80.00)</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs font-bold text-slate-605 dark:text-slate-400 cursor-pointer">
            <input 
              type="checkbox" 
              checked={exams} 
              onChange={() => setExams(!exams)}
              className="rounded text-school-green border-slate-350 focus:ring-school-green"
            />
            <span>Add Term Exams Charge (+$30.00)</span>
          </label>
        </div>
      </div>

      {/* Gross Invoiced Slip Box */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 flex justify-between items-center">
        <div>
          <span className="text-[10px] text-slate-400 font-extrabold uppercase">Calculated Invoiced Slip</span>
          <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Tx ID: #SUB-LIVE-749</span>
        </div>
        <span className="text-2xl font-black text-slate-855 dark:text-white">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 4. LMS VIDEO STREAM TERMINAL (Learning)
// ---------------------------------------------------------
function LmsClassroomStream() {
  const [isLive, setIsLive] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, `Student: ${chatInput}`]);
    setChatInput('');
    // Auto simulated reply from Professor after 1 second
    setTimeout(() => {
      setMessages(prev => [...prev, 'Professor: Excellent question, check slide 14!']);
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-premium space-y-4 text-left">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-805 pb-3">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">LMS Video Classroom Terminal</span>
        <span className={`h-2.5 w-2.5 rounded-full flex items-center justify-center ${isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Stream Box */}
        <div className="md:col-span-7 h-44 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col items-center justify-center p-4 relative overflow-hidden text-center">
          {isLive ? (
            <div className="space-y-3">
              <span className="text-xs text-white font-extrabold block animate-pulse">🔴 HD Video Stream Active</span>
              <p className="text-[10px] text-slate-400 max-w-[150px] mx-auto">Topic: Unit 3 Electromagnetic Spectrum Analysis</p>
              <button 
                onClick={() => setIsLive(false)}
                className="px-4 py-1.5 bg-slate-800 text-[10px] text-white font-bold rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Disconnect Stream
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs text-slate-500 font-bold block">Classroom Offline</span>
              <button 
                onClick={() => setIsLive(true)}
                className="px-4 py-2 bg-[#0A4D8C] text-[10px] font-bold text-white rounded-lg hover:bg-sky-700 transition-all shadow-md cursor-pointer"
              >
                Launch Virtual Lecture
              </button>
            </div>
          )}
        </div>

        {/* Chat Feed */}
        <div className="md:col-span-5 h-44 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-1.5 text-[9px] font-bold leading-normal mb-2 pr-1">
            <div className="text-slate-400">System: Connected to class group chat</div>
            {messages.map((m, idx) => (
              <div key={idx} className={m.startsWith('Professor') ? 'text-school-blue' : 'text-slate-800 dark:text-slate-200'}>
                {m}
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="flex gap-1.5 border-t border-slate-200 dark:border-slate-800 pt-2 shrink-0">
            <input 
              type="text" 
              placeholder="Ask Professor..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-2 py-1 text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded focus:outline-none focus:ring-1 focus:ring-school-blue"
            />
            <button type="submit" className="px-3 py-1 bg-[#0A4D8C] text-white text-[9px] font-extrabold rounded cursor-pointer">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 5. CLASS CURRICULUM SYLLABUS CHECKLIST (Academics)
// ---------------------------------------------------------
function SyllabusChecklist() {
  const [syllabus, setSyllabus] = useState([
    { id: 1, chapter: 'Chapter 1: Newton Mechanics & Inertia', status: 'Complete' },
    { id: 2, chapter: 'Chapter 2: Thermodynamics & Adiabatic curves', status: 'Complete' },
    { id: 3, chapter: 'Chapter 3: Quantum Mechanics Schrodinger waves', status: 'In Progress' },
    { id: 4, chapter: 'Chapter 4: Special Relativity Time dilation', status: 'Unmapped' }
  ]);

  const toggleStatus = (id: number) => {
    setSyllabus(prev => prev.map(ch => {
      if (ch.id === id) {
        let nextStatus: 'Complete' | 'In Progress' | 'Unmapped' = 'Complete';
        if (ch.status === 'Complete') nextStatus = 'In Progress';
        else if (ch.status === 'In Progress') nextStatus = 'Unmapped';
        else nextStatus = 'Complete';
        return { ...ch, status: nextStatus };
      }
      return ch;
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-premium space-y-4 text-left">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Interactive Class Syllabus Progress</span>
        <span className="text-xs text-amber-500 font-extrabold">Grade 10 Physics</span>
      </div>

      <div className="space-y-2">
        {syllabus.map(ch => (
          <div key={ch.id} className="flex justify-between items-center py-1 border-b border-slate-55 dark:border-slate-850 last:border-0">
            <span className="text-xs font-bold text-slate-750 dark:text-slate-350 truncate max-w-[200px]">{ch.chapter}</span>
            <button
              onClick={() => toggleStatus(ch.id)}
              className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold transition-all uppercase cursor-pointer ${
                ch.status === 'Complete' 
                  ? 'bg-emerald-500/10 text-emerald-500' 
                  : ch.status === 'In Progress'
                    ? 'bg-amber-500/10 text-amber-500 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-505'
              }`}
            >
              {ch.status}
            </button>
          </div>
        ))}
      </div>
      <div className="text-[10px] text-slate-400 font-semibold leading-relaxed pt-2">
        * Click chapter status badges to simulate school curriculum audit updates.
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 6. LOGISTICS STOCK LEDGER AND REORDER TRIGGER (Logistics)
// ---------------------------------------------------------
function LogisticsInventory() {
  const [inventory, setInventory] = useState([
    { name: 'Physics Lab Chemicals (Vials)', count: 42, min: 20 },
    { name: 'Classroom Whiteboard Markers', count: 12, min: 15 },
    { name: 'Cafeteria Beverages (Bottles)', count: 185, min: 50 },
    { name: 'Computer Suite Keyboards', count: 9, min: 10 }
  ]);

  const restock = (name: string) => {
    setInventory(prev => prev.map(item => {
      if (item.name === name) {
        return { ...item, count: item.count + 20 };
      }
      return item;
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-premium space-y-4 text-left">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Logistics & Supply Ledger</span>
        <span className="text-xs text-slate-500 dark:text-slate-450 font-bold">Auto-Reorder Engine</span>
      </div>

      <div className="space-y-3">
        {inventory.map((item, idx) => {
          const isLow = item.count < item.min;
          return (
            <div key={idx} className="flex justify-between items-center py-1">
              <div className="space-y-0.5 text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-white">{item.name}</span>
                <div className="text-[9px] text-slate-500 flex gap-2">
                  <span>Qty: <strong className={isLow ? 'text-school-maroon' : 'text-slate-600 dark:text-slate-450'}>{item.count}</strong></span>
                  <span>• Threshold: {item.min}</span>
                </div>
              </div>
              <button
                onClick={() => restock(item.name)}
                className={`px-3 py-1 text-[9px] font-bold uppercase rounded transition-all cursor-pointer ${
                  isLow 
                    ? 'bg-[#7B1E3A] text-white animate-pulse hover:bg-[#6b1932]' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-305 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isLow ? 'Restock Alert' : 'Order +20'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 7. DIRECT BROADCAST NOTIFICATION COMPOSER (Communication)
// ---------------------------------------------------------
function CommunicationBroadcaster() {
  const [channel, setChannel] = useState<'SMS' | 'Email' | 'Push'>('Push');
  const [message, setMessage] = useState('Parent Teacher Meet scheduled for Grade 10 tomorrow.');
  const [success, setSuccess] = useState(false);

  const triggerBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-premium space-y-4 text-left relative overflow-hidden">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Direct Broadcast Console</span>
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <form onSubmit={triggerBroadcast} className="space-y-3.5">
        <div className="grid grid-cols-3 gap-2">
          {(['SMS', 'Email', 'Push'] as const).map(ch => (
            <button
              key={ch}
              type="button"
              onClick={() => setChannel(ch)}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                channel === ch 
                  ? 'bg-school-green border-school-green text-white' 
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-400'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        <div className="space-y-1">
          <label className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Broadcast Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-55 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-school-green h-16 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-school-green hover:bg-[#0e6f5c] text-white text-xs font-bold uppercase rounded-xl transition-all cursor-pointer"
        >
          Dispatch Broadcast Alert
        </button>
      </form>

      {/* On-screen Notification Emulator Popup */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="p-3 bg-slate-955 border border-slate-800 text-white rounded-xl flex items-center gap-3 text-xs font-bold absolute top-2 right-2 left-2 shadow-2xl z-50"
          >
            <div className="h-6 w-6 rounded bg-school-green flex items-center justify-center text-white text-[10px]">✓</div>
            <div className="flex-1 text-left truncate">
              <span className="text-[10px] text-school-green block uppercase">Live Broadcast Success ({channel})</span>
              <p className="truncate font-medium text-[10px] text-slate-300">{message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------
// 8. ENTERPRISE API ENDPOINT LOGGER (Enterprise Features)
// ---------------------------------------------------------
function ApiRequestLogger() {
  const [logs, setLogs] = useState<string[]>([
    'GET /api/v1/students - 200 OK - 24ms',
    'POST /api/v1/admissions/trigger - 201 Created - 110ms',
    'GET /api/v1/fees/ledgers - 200 OK - 32ms'
  ]);

  const sendRequest = () => {
    const methods = ['GET', 'POST', 'PUT', 'DELETE'];
    const endpoints = ['/api/v1/logistics/inventory', '/api/v1/attendance/checkin', '/api/v1/grades/reportcards', '/api/v1/hr/payroll'];
    const codes = [200, 201, 400, 403];
    
    const randomMethod = methods[Math.floor(Math.random() * methods.length)];
    const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    const randomCode = codes[Math.floor(Math.random() * codes.length)];
    const randomMs = Math.floor(Math.random() * 150) + 10;
    
    const newLog = `${randomMethod} ${randomEndpoint} - ${randomCode} ${randomCode === 200 || randomCode === 201 ? 'OK' : 'Error'} - ${randomMs}ms`;
    setLogs(prev => [newLog, ...prev.slice(0, 4)]);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-premium space-y-4 text-left">
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Enterprise API Terminal</span>
        <button 
          onClick={sendRequest}
          className="px-2.5 py-1 bg-[#0A4D8C] hover:bg-sky-700 text-white text-[9px] font-black uppercase rounded shadow-sm cursor-pointer"
        >
          Send Test Query
        </button>
      </div>

      <div className="space-y-1.5 font-mono text-[9px] bg-slate-950 p-4 rounded-xl border border-slate-850 text-emerald-400 h-28 overflow-y-auto leading-normal">
        {logs.map((log, idx) => (
          <div key={idx} className={log.includes('Error') ? 'text-rose-500' : 'text-emerald-400'}>
            &gt; {log}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 9. PODCAST EPISODE AUDIO PLAYER SIMULATOR (Ed Talks Series)
// ---------------------------------------------------------
function PodcastPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeEpisode, setActiveEpisode] = useState(0);

  const playlist = [
    { title: 'EdTalk #12: Paperless registers with Sister Mary', guest: 'Sister Mary D\'Souza', duration: '14:20' },
    { title: 'EdTalk #13: Cognitive GPA curves with Dr. Robert', guest: 'Dr. Robert Vance', duration: '18:45' },
    { title: 'EdTalk #14: Securing database records', guest: 'Admin Technical Lead', duration: '12:15' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
      {/* Player console */}
      <div className="lg:col-span-8 p-6 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 shadow-premium space-y-6">
        <div className="relative h-44 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col justify-between p-5 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="flex justify-between items-center text-white">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-500">Live Podcast Player</span>
            <span className="text-[9px] font-bold text-slate-500">HD MP3 Streaming</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-amber-500 font-extrabold block">{playlist[activeEpisode].guest}</span>
            <h3 className="text-base font-extrabold text-white truncate">{playlist[activeEpisode].title}</h3>
          </div>

          {/* Visual Waveform */}
          <div className="flex items-center justify-between gap-1.5 h-10 px-4">
            {[1,2,3,4,3,2,1,2,3,4,5,6,5,4,3,2,1,2,3,4,3,2,1,2,3,4,5,4,3,2].map((h, i) => (
              <div
                key={i}
                className={`w-1 bg-amber-500 rounded-full transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : 'opacity-40'
                }`}
                style={{ height: `${h * 15}%` }}
              />
            ))}
          </div>

          {/* Audio Controls */}
          <div className="flex justify-between items-center text-white text-[10px] font-bold pt-2 border-t border-slate-900">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-605 rounded-lg text-slate-950 font-black flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isPlaying ? 'Pause Podcast' : 'Play Podcast'}
            </button>
            <span>{isPlaying ? '03:45' : '00:00'} / {playlist[activeEpisode].duration}</span>
          </div>
        </div>
      </div>

      {/* Playlist Selector */}
      <div className="lg:col-span-4 p-5 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 shadow-premium space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-3">Podcast Episodes</h4>
        <div className="space-y-2">
          {playlist.map((ep, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveEpisode(idx);
                setIsPlaying(false);
              }}
              className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex gap-3 items-center cursor-pointer ${
                idx === activeEpisode
                  ? 'border-amber-500/20 bg-slate-50 dark:bg-slate-850/80 font-bold'
                  : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 ${
                idx === activeEpisode ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                {idx + 1}
              </span>
              <div className="truncate flex-1">
                <span className="block truncate text-slate-805 dark:text-white font-bold">{ep.title}</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">{ep.guest}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 10. STUDENT ZONE PORTAL DESK
// ---------------------------------------------------------
function StudentZoneDashboard() {
  const [activeTab, setActiveTab] = useState<'grades' | 'homework' | 'bus' | 'badges'>('grades');
  const [hwList, setHwList] = useState([
    { id: 1, subject: 'Mathematics Grade 10', title: 'Calculus Derivative Practice sheet', done: false },
    { id: 2, subject: 'Physics Practical', title: 'Upload lab report on lens focal length', done: true }
  ]);

  const toggleHw = (id: number) => {
    setHwList(prev => prev.map(hw => hw.id === id ? { ...hw, done: !hw.done } : hw));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-premium text-left space-y-6">
      <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-3">
        <div>
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Mock Student Terminal</span>
          <h3 className="text-base font-extrabold text-slate-850 dark:text-white">Arjun's Portal Desk</h3>
        </div>
        <span className="text-xs text-school-blue font-extrabold">Active Session</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {(['grades', 'homework', 'bus', 'badges'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 rounded-xl text-xs font-bold transition-all border capitalize cursor-pointer ${
              activeTab === tab
                ? 'bg-[#0A4D8C] border-[#0A4D8C] text-white'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="min-h-[140px] flex flex-col justify-center">
        {activeTab === 'grades' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-center">
                <span className="text-[10px] text-slate-450 font-bold uppercase">Physics GPA</span>
                <span className="block text-xl font-black text-school-blue mt-1">3.9</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-center">
                <span className="text-[10px] text-slate-450 font-bold uppercase">Math GPA</span>
                <span className="block text-xl font-black text-school-blue mt-1">3.8</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-center">
                <span className="text-[10px] text-slate-455 font-bold uppercase">Chemistry GPA</span>
                <span className="block text-xl font-black text-school-blue mt-1">4.0</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-bold text-center">AI Gradecast Curve Projector indicates steady GPA growth index</div>
          </div>
        )}

        {activeTab === 'homework' && (
          <div className="space-y-2">
            {hwList.map(hw => (
              <div key={hw.id} className="flex justify-between items-center py-2 px-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-850 rounded-xl">
                <div>
                  <span className="text-[9px] text-[#0A4D8C] dark:text-sky-400 font-black uppercase">{hw.subject}</span>
                  <p className="text-xs text-slate-805 dark:text-white font-bold">{hw.title}</p>
                </div>
                <button
                  onClick={() => toggleHw(hw.id)}
                  className={`px-3 py-1 text-[9px] font-bold rounded-lg uppercase cursor-pointer ${
                    hw.done ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  {hw.done ? 'Done ✓' : 'Upload'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'bus' && (
          <div className="space-y-4">
            <div className="h-24 bg-slate-950 border border-slate-850 rounded-2xl relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff02_1px,_transparent_1px)] bg-[size:10px_10px]" />
              <div className="h-0.5 w-4/5 bg-slate-850 relative">
                <div className="absolute left-1/2 -top-1.5 h-3.5 w-3.5 rounded-full bg-purple-500 flex items-center justify-center animate-pulse">
                  <div className="h-2 w-2 rounded-full bg-white animate-ping" />
                </div>
              </div>
              <div className="absolute bottom-2 left-3 text-[9px] font-extrabold text-[#0A4D8C] dark:text-sky-400 uppercase">
                School Bus: Route A • Bagdogra Stop • 3 Mins
              </div>
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="flex gap-4 justify-center items-center py-4">
            {['Math Genius', 'Perfect attendance', 'Science Lab Guru'].map((badge, idx) => (
              <div key={idx} className="p-3 bg-[#e6f0fa] dark:bg-slate-900 border border-sky-100 dark:border-slate-850 rounded-2xl flex flex-col items-center gap-1 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-[#0A4D8C] text-white flex items-center justify-center"><Award className="h-4 w-4" /></div>
                <span className="text-[9px] text-[#0A4D8C] dark:text-sky-400 font-extrabold text-center uppercase tracking-wider">{badge}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 11. TEACHER ZONE ATTENDANCE CHECK-IN WORKSPACE
// ---------------------------------------------------------
function TeacherZoneDashboard() {
  const [students, setStudents] = useState([
    { id: 1, name: 'Arjun Sen', roll: 10, present: true },
    { id: 2, name: 'Pooja Bose', roll: 11, present: true },
    { id: 3, name: 'Sandeep Roy', roll: 12, present: false },
    { id: 4, name: 'Ritu Sen', roll: 13, present: true }
  ]);

  const toggleAttendance = (id: number) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, present: !s.present } : s));
  };

  const presentCount = students.filter(s => s.present).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-premium text-left space-y-4">
      <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-3">
        <div>
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Mock Teacher workspace</span>
          <h3 className="text-base font-extrabold text-slate-850 dark:text-white">Grade 10 Class Attendance</h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-[#138D75] font-extrabold block">Registry Sync</span>
          <span className="text-[9px] text-slate-500">Present: {presentCount} / {students.length}</span>
        </div>
      </div>

      <div className="space-y-2">
        {students.map(s => (
          <div key={s.id} className="flex justify-between items-center py-2 px-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-850 rounded-xl">
            <span className="text-xs font-bold text-slate-800 dark:text-white">Roll #{s.roll} • {s.name}</span>
            <button
              onClick={() => toggleAttendance(s.id)}
              className={`px-3 py-1 text-[9px] font-bold rounded-lg uppercase transition-all cursor-pointer ${
                s.present 
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse'
              }`}
            >
              {s.present ? 'Present' : 'Absent'}
            </button>
          </div>
        ))}
      </div>
      <div className="text-[10px] text-slate-400 font-semibold leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
        * Clicking Absent triggers an automated SMS push notice to the guardian's phone registry.
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 12. HD TUTORIAL VIDEO chapters (Video Library)
// ---------------------------------------------------------
function VideoPlaylistConsole() {
  const playlist = [
    { title: 'Interactive Fee Invoicing Setup', desc: 'Learn how to customize invoice templates, discount schemes, and online payment gateways.', duration: '4:15' },
    { title: 'RFID Smartgate Check-in Log Integration', desc: 'Learn how to connect RFID hardware devices and set up automated SMS notices.', duration: '6:30' },
    { title: 'AI Predictive GPA & Performance curves', desc: 'A guide to reading predictive models, learning index graphs, and warning systems.', duration: '5:42' }
  ];

  const [activeVideo, setActiveVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
      {/* Video Player */}
      <div className="lg:col-span-8 p-4 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 shadow-premium space-y-4">
        <div className="relative h-64 md:h-96 rounded-2xl bg-slate-950 border border-slate-850 overflow-hidden flex items-center justify-center">
          {isPlaying ? (
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
              <Tv className="h-12 w-12 text-school-green animate-bounce" />
              <span className="text-xs text-white font-bold">Simulating HD Tutorial Video Stream...</span>
              <button 
                onClick={() => setIsPlaying(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-850 hover:bg-slate-700 text-[10px] text-white font-bold transition-all cursor-pointer"
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
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 bg-red-600 rounded-full animate-ping" /> {isPlaying ? 'Streaming' : 'Paused'}</span>
            <span>{playlist[activeVideo].duration}</span>
          </div>
        </div>

        <div className="space-y-2 px-2">
          <span className="text-[10px] uppercase font-extrabold text-[#0A4D8C] dark:text-sky-400 tracking-wider">Tutorial Spotlight</span>
          <h3 className="text-xl font-extrabold text-slate-855 dark:text-white">{playlist[activeVideo].title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{playlist[activeVideo].desc}</p>
        </div>
      </div>

      {/* Video Playlist Sidebar */}
      <div className="lg:col-span-4 p-5 rounded-3xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 shadow-premium space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-3">Video Chapters</h4>
        
        <div className="space-y-2">
          {playlist.map((video, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveVideo(idx);
                setIsPlaying(false);
              }}
              className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex gap-3 items-center cursor-pointer ${
                idx === activeVideo 
                  ? 'border-[#0A4D8C]/20 bg-slate-50 dark:bg-slate-850/80 font-bold' 
                  : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 ${
                idx === activeVideo ? 'bg-[#0A4D8C] text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                <Play className="h-3.5 w-3.5" />
              </div>
              <div className="truncate flex-1">
                <span className="block truncate text-slate-805 dark:text-white font-bold">{video.title}</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">{video.duration}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 13. EDUCATOR ARTICLE BLOG CATALOG
// ---------------------------------------------------------
function EducatorBlogCatalog() {
  const [filter, setFilter] = useState<'all' | 'teaching' | 'psychology' | 'trends'>('all');

  const articles = [
    { title: '10 Strategies for Better Classroom Focus', category: 'teaching', author: 'Sister Mary D\'Souza', desc: 'Practical tips to minimize distractions and manage classroom dynamics using lesson planners.' },
    { title: 'Supporting Student Mental Health During Exams', category: 'psychology', author: 'Dr. Sandeep Sen', desc: 'How school boards and parent committees coordinate to manage exam anxieties.' },
    { title: 'The Role of AI Analytics in K-12 Syllabus Goals', category: 'trends', author: 'Admin Tech Architect', desc: 'A guide on how cognitive trackers are alerting teachers of performance gaps early.' }
  ];

  const filtered = filter === 'all' ? articles : articles.filter(a => a.category === filter);

  return (
    <div className="space-y-8 text-left">
      <div className="space-y-3">
        <span className="text-xs font-extrabold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
          Professional Articles
        </span>
        <h2 className="text-3xl font-extrabold">Educator Article Vault</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Explore educational design, support programs, and software trends written by our school coordinators and principals.
        </p>
      </div>

      <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        {(['all', 'teaching', 'psychology', 'trends'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border capitalize cursor-pointer ${
              filter === cat
                ? 'bg-amber-600 border-amber-600 text-white'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-400'
            }`}
          >
            {cat === 'all' ? 'Show All' : cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((art, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-800 transition-all text-left">
            <div className="space-y-3">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-500">{art.category}</span>
              <h4 className="text-sm font-extrabold text-slate-805 dark:text-white leading-snug">{art.title}</h4>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed font-medium line-clamp-3">{art.desc}</p>
            </div>
            <div className="pt-4 mt-6 text-[10px] text-slate-400 font-bold border-t border-slate-50 dark:border-slate-850">
              <span>By {art.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Helper Wrapper for Beaker / Platform Simulator
// ---------------------------------------------------------
function BeakerSimulatorWrapper({ slug, activeFeatureIdx }: { slug: string; activeFeatureIdx: number }) {
  const renderMiniVisual = (slug: string, idx: number) => {
    switch (slug) {
      case 'subhraedu-one':
        switch (idx) {
          case 0:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-955 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden relative shadow-inner">
                <div className="absolute top-0 right-0 p-3 flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] text-emerald-500 font-extrabold uppercase">Shield Active</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Secure Data Vault</span>
                <div className="flex justify-center items-center gap-4 py-4">
                  <div className="h-16 w-16 rounded-full border border-slate-700 flex items-center justify-center bg-slate-900 shadow-lg animate-pulse">
                    <ShieldCheck className="h-8 w-8 text-school-green" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <div className="h-3 w-28 bg-slate-800 rounded" />
                    <div className="h-2 w-36 bg-slate-800 rounded" />
                    <div className="h-2 w-20 bg-slate-800 rounded" />
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-bold text-center border-t border-slate-900 pt-2 flex justify-between">
                  <span>AES-256 Iso</span>
                  <span className="text-emerald-505 font-extrabold">SSL SECURE</span>
                </div>
              </div>
            );
          case 1:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden relative">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Modular Lego Connection</span>
                <div className="grid grid-cols-4 gap-2.5 my-2">
                  {['Admissions', 'Fees', 'Exams', 'Library'].map((val, i) => (
                    <div key={val} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center text-[9px] font-bold text-white flex flex-col items-center justify-center hover:border-school-blue transition-all">
                      <span className="text-school-blue font-extrabold">Mod {i+1}</span>
                      <span className="text-[8px] text-slate-400 mt-1 block truncate w-full">{val}</span>
                      <div className="h-1 w-full bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-school-blue rounded-full w-full animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-school-blue font-bold text-center">Auto-Scaling Microservices Active</div>
              </div>
            );
          case 2:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden relative">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Fee Gateway Pipeline</span>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-school-blue" />
                      <span className="text-xs text-white font-bold">Online Checkout</span>
                    </div>
                    <span className="text-xs text-school-green font-extrabold animate-bounce">+$480.00</span>
                  </div>
                  <div className="text-[9px] text-slate-500 flex justify-between">
                    <span>Trans ID: #TXN-9482</span>
                    <span>Status: Settled</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-bold text-center">Real-Time Invoicing Ledger Sync</div>
              </div>
            );
          default:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-955 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden relative">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Unified Identity Matrix</span>
                <div className="flex justify-center items-center gap-3 py-4">
                  <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-800 shadow-md">
                    <Users className="h-6 w-6 text-school-blue" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-700 animate-pulse" />
                  <div className="h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-800 shadow-md">
                    <BookOpen className="h-6 w-6 text-school-green" />
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-bold text-center">Unified Identity Directory Active</div>
              </div>
            );
        }
      
      case 'campuscloud-10x':
        switch (idx) {
          case 0:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-950 border border-slate-805 p-5 flex flex-col justify-between overflow-hidden relative">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Predictive GPA Index</span>
                <div className="h-24 flex items-end justify-between px-2 gap-1 border-b border-slate-900 pb-2">
                  {[3.1, 3.2, 3.4, 3.2, 3.5, 3.8, 3.9].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full bg-school-green rounded-t-md transition-all hover:bg-emerald-500" style={{ height: `${val * 20}px` }} />
                      <span className="text-[8px] text-slate-500">Q{i+1}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-school-green font-bold text-center pt-2 flex justify-between">
                  <span>AI Gradecast Forecast</span>
                  <span className="font-extrabold text-white">3.9 Projected GPA</span>
                </div>
              </div>
            );
          case 1:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-955 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden relative">
                <span className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">Smart Classroom Allocations</span>
                <div className="grid grid-cols-3 gap-2 my-2 text-[9px] font-bold text-slate-400">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center text-white">
                    <span>Room 101</span>
                    <span className="block text-[8px] text-emerald-500 mt-1">Available</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center text-white">
                    <span>Room 102</span>
                    <span className="block text-[8px] text-[#7B1E3A] mt-1">Class Slot A</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center text-white">
                    <span>Room 103</span>
                    <span className="block text-[8px] text-emerald-555 mt-1">Available</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-bold text-center">Scheduler Audits Resolves Conflicts (100% Load)</div>
              </div>
            );
          case 2:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden relative">
                <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Automated Late Fee Triggers</span>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-left space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-white">
                    <span>Invoice #INV-2901</span>
                    <span className="text-school-maroon bg-school-maroon/10 px-2 py-0.5 rounded text-[10px]">Overdue</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>Original: $400.00</span>
                    <span className="text-white">+ Late Penalty $20.00</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-bold text-center">AI Outstanding Reminders Sent Out Automatically</div>
              </div>
            );
          default:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-955 border border-slate-805 p-5 flex flex-col justify-between overflow-hidden relative">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Lesson Planner Matrix</span>
                <div className="space-y-2">
                  {['Unit 1: Quantum Physics (Complete)', 'Unit 2: Atomic Nuclei (Complete)', 'Unit 3: Wave Optics (In Progress)'].map((unit, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-white">
                      <span className={`h-2.5 w-2.5 rounded-full flex items-center justify-center ${i === 2 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                      <span className="truncate">{unit}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-slate-400 font-bold text-center">Department Curriculum Tracker Active</div>
              </div>
            );
        }

      case 'mobile-apps':
        switch (idx) {
          case 0:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden relative">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Smartphone Face ID Login</span>
                <div className="flex justify-center py-2">
                  <div className="h-20 w-12 rounded-2xl border-2 border-slate-800 bg-slate-900 p-1 relative shadow-lg">
                    <div className="w-6 h-1 bg-slate-800 mx-auto rounded-full mb-2" />
                    <div className="h-10 w-full rounded bg-slate-950 flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-purple-500 animate-bounce" />
                    </div>
                    <span className="absolute bottom-1 left-0 right-0 text-[6px] text-slate-550 text-center font-bold">1.2s Auth</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-bold text-center">Native Biometric Isolation Active</div>
              </div>
            );
          case 1:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-955 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden relative">
                <span className="text-[10px] text-slate-555 font-bold uppercase tracking-wider">Direct Chat Channel</span>
                <div className="space-y-2 bg-slate-900 border border-slate-805 p-3 rounded-xl text-left h-24 overflow-y-auto text-[9px] font-bold">
                  <div className="text-purple-505">Sister Mary: <span className="text-white font-medium">Is Arjun doing fine?</span></div>
                  <div className="text-emerald-505 text-right">Teacher: <span className="text-white font-medium">Yes, top grades in physics!</span></div>
                </div>
                <div className="text-[10px] text-slate-400 font-bold text-center">Guardians-Teacher Chat Logs Encrypted</div>
              </div>
            );
          case 2:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-955 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden relative">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Live School Bus Route</span>
                <div className="h-20 border border-slate-900 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff02_1px,_transparent_1px)] bg-[size:10px_10px]" />
                  <div className="h-0.5 w-4/5 bg-slate-800 relative">
                    <div className="absolute left-1/3 -top-1.5 h-3.5 w-3.5 rounded-full bg-purple-500 flex items-center justify-center animate-pulse">
                      <Truck className="h-2 w-2 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 text-[9px] font-bold text-purple-400">Route A: 4 Mins Away</div>
                </div>
                <div className="text-[10px] text-slate-400 font-bold text-center">GPS Bus Telemetry Active</div>
              </div>
            );
          default:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-955 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden relative">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Student Badge Vault</span>
                <div className="flex gap-4 justify-center items-center py-2">
                  <div className="p-2 rounded-full bg-purple-500/10 border border-purple-500 text-purple-500 shadow-md animate-bounce"><Award className="h-6 w-6" /></div>
                  <div className="p-2 rounded-full bg-emerald-500/10 border border-emerald-500 text-emerald-500 shadow-md"><CheckCircle className="h-6 w-6" /></div>
                  <div className="p-2 rounded-full bg-amber-500/10 border border-amber-500 text-amber-500 shadow-md"><Sparkles className="h-6 w-6" /></div>
                </div>
                <div className="text-[10px] text-slate-400 font-bold text-center">Recognized Co-curricular Achievements</div>
              </div>
            );
        }

      case 'experiential-learning':
        switch (idx) {
          case 0:
            return <BeakerSimulator />;
          case 1:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden relative">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Experience Level Dials</span>
                <div className="flex justify-center items-center py-4">
                  <div className="relative h-20 w-20 rounded-full border-4 border-slate-800 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-orange-550 border-t-transparent animate-spin" />
                    <span className="text-xs font-black text-white">LVL 4</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-bold text-center">XP Multiplier Active (+3.2x Boost)</div>
              </div>
            );
          case 2:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-955 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden relative">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">3D Orbit Simulation</span>
                <div className="h-24 flex items-center justify-center relative">
                  <div className="h-8 w-8 rounded-full bg-amber-500 animate-pulse relative" />
                  <div className="absolute h-16 w-16 rounded-full border border-slate-850 animate-spin flex items-start">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-400 -mt-1" />
                  </div>
                  <div className="absolute h-24 w-24 rounded-full border border-slate-900 animate-orbit-ccw flex items-start">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400 -mt-1" />
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-bold text-center">High-Fidelity Virtual Solar System Map</div>
              </div>
            );
          default:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-955 border border-slate-808 p-5 flex flex-col justify-between overflow-hidden relative">
                <span className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">AI Lab Helper Chat</span>
                <div className="bg-slate-900 border border-slate-850 rounded-xl p-3 text-left space-y-1 text-[9px] font-bold">
                  <span className="text-orange-550 font-black">AI Helper:</span>
                  <p className="text-white font-medium">"Try adding 5ml of H2O to dissolve the crystals."</p>
                </div>
                <div className="text-[10px] text-slate-400 font-bold text-center">Cognitive Mentor Guidance Stream</div>
              </div>
            );
        }

      case 'pre-school-management':
        switch (idx) {
          case 0:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-955 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden relative">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Toddler Milestone Tracker</span>
                <div className="space-y-2">
                  {['Motor Skills: Walk Steady (Complete)', 'Language: 50+ Vocabulary (Complete)', 'Social: Cooperative Play (In Progress)'].map((mile, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px] font-bold text-white">
                      <span>{mile.split(':')[0]}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] ${i === 2 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {i === 2 ? 'In Progress' : 'Done'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-slate-400 font-bold text-center">Early Childhood Developmental Progress Log</div>
              </div>
            );
          case 1:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-950 border border-slate-850 p-5 flex flex-col justify-between overflow-hidden relative">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Meal & Nap Schedule</span>
                <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-white">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-pink-500">11:30 AM</span>
                    <p className="text-slate-400 mt-1">Fruit Lunch</p>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-pink-500">01:00 PM</span>
                    <p className="text-slate-400 mt-1">Nap Interval (1.5h)</p>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-bold text-center">Classroom Coordinator Schedule Board</div>
              </div>
            );
          case 2:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden relative">
                <span className="text-[10px] text-slate-550 font-bold uppercase tracking-wider">Guardians Snapshot Feed</span>
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-left">
                  <div className="h-14 w-14 rounded bg-slate-850 flex items-center justify-center border border-slate-800 overflow-hidden relative">
                    <div className="h-4 w-4 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500"><Heart className="h-2.5 w-2.5 fill-current" /></div>
                  </div>
                  <div className="space-y-1 text-[9px] font-bold text-white">
                    <span>Arjun doing finger-painting!</span>
                    <span className="block text-slate-500 text-[8px]">Uploaded by Sister Mary • 2 mins ago</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-bold text-center">Instant Notice Broadcast Dispatch</div>
              </div>
            );
          default:
            return (
              <div className="w-full h-52 rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden relative">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Allergen & Health Log</span>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-left flex items-start gap-2.5 text-[10px] font-bold text-white">
                  <div className="h-5 w-5 bg-pink-500/10 text-pink-500 rounded flex items-center justify-center shrink-0">!</div>
                  <div>
                    <span>Arjun: Peanuts Allergy</span>
                    <p className="text-[8px] text-slate-400 mt-0.5">Emergency contact details synced to database</p>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-bold text-center">Childhood Medical Registry Active</div>
              </div>
            );
        }
      default:
        return null;
    }
  };

  return renderMiniVisual(slug, activeFeatureIdx);
}

// ---------------------------------------------------------
// 14. DYNAMIC PIPELINE OPTIMISATION STEPS MAPPING
// ---------------------------------------------------------
const OPTIMISATION_STEPS: Record<string, { step: string; title: string; desc: string }[]> = {
  administration: [
    { step: '01', title: 'Consultation & Rota Matrix', desc: 'Our operational team reviews employee directories, rota rules, and compliance criteria.' },
    { step: '02', title: 'Granular ACL Config', desc: 'Configure database role matrices (coordinators, teachers, administrators, clerks).' },
    { step: '03', title: 'Office Staff Onboarding', desc: 'Onsite onboarding specialists lead self-paced training for office clerks.' },
    { step: '04', title: 'Active System Launch', desc: 'Sync live records and deploy security keys within 12 hours.' }
  ],
  finance: [
    { step: '01', title: 'Ledger Audit', desc: 'Assessment of school fee structures, payment collection channels, and tax forms.' },
    { step: '02', title: 'Gateway Linking', desc: 'Integrate active debit/credit card merchant gateways and net banking APIs.' },
    { step: '03', title: 'Dry-run Invoicing', desc: 'Test discount templates, cash receipts, and automated reminder SMS notices.' },
    { step: '04', title: 'Production Ledger Sync', desc: 'Deploy live online checkout portals for parents in less than 24 hours.' }
  ],
  learning: [
    { step: '01', title: 'Virtual Suite Configure', desc: 'Configure cloud video rooms and interactive teacher whiteboards.' },
    { step: '02', title: 'Syllabus Mapping', desc: 'Upload study files, video chapters, lecture notes, and classroom PDFs.' },
    { step: '03', title: 'Student Invite Run', desc: 'Invite students to study modules and launch test quizzes.' },
    { step: '04', title: 'Online Classrooms Active', desc: 'Live lectures and learning channels are active with zero latency.' }
  ],
  academics: [
    { step: '01', title: 'Curriculum Audits', desc: 'Coordinate with department chairs to structure classroom syllabus guides.' },
    { step: '02', title: 'Scheduler Integration', desc: 'Generate digital exam schedules and lesson progress checklists.' },
    { step: '03', title: 'Grade Scales Config', desc: 'Input grading criteria, report card layouts, and board averages.' },
    { step: '04', title: 'Academic Year Go-live', desc: 'Launch unified grade trackers and curriculum calendars.' }
  ],
  intelligence: [
    { step: '01', title: 'Historical Sync', desc: 'Import past years\' student test scores, fee receipts, and attendance patterns.' },
    { step: '02', title: 'Model Training', desc: 'Train cognitive algorithms to parse drop-out indicators and payment delays.' },
    { step: '03', title: 'Diagnostics Audit', desc: 'Principals tune warning thresholds for high/medium/low-risk lists.' },
    { step: '04', title: 'Predictive Alerts Live', desc: 'Automated warnings are sent to coordinator consoles in real time.' }
  ],
  logistics: [
    { step: '01', title: 'Supply Audit', desc: 'Audit physical inventory, laboratory tools, cafeteria stock, and buses.' },
    { step: '02', title: 'POS Configuration', desc: 'Register cashless checkout POS codes at school cafeteria desks.' },
    { step: '03', title: 'Threshold Limits Config', desc: 'Setup auto-reorder indicators for supplies.' },
    { step: '04', title: 'Logistics Active', desc: 'Sync inventory changes and trigger automated supplier orders.' }
  ],
  'leadership-management': [
    { step: '01', title: 'Executive Alignment', desc: 'Review key performance goals, budget structures, and quality standards.' },
    { step: '02', title: 'Consolidated Sync', desc: 'Connect database feeds from multiple campuses under one login.' },
    { step: '03', title: 'Report Templates Config', desc: 'Design customized board summary slides and budget ledgers.' },
    { step: '04', title: 'Director Desk Live', desc: 'Board members review visual operational reports in real time.' }
  ],
  'enterprise-features': [
    { step: '01', title: 'SSO Directory Link', desc: 'Connect Google Workspace or active corporate directory protocols.' },
    { step: '02', title: 'Custom API Settings', desc: 'Configure REST webhook triggers for physical biometric gates.' },
    { step: '03', title: 'Cluster Load Testing', desc: 'Simulate high concurrency spikes to guarantee page speed.' },
    { step: '04', title: 'Enterprise SLA Active', desc: 'Deploy load-balanced clusters with 99.99% uptime guarantees.' }
  ],
  communication: [
    { step: '01', title: 'Gateway Activation', desc: 'Register bulk SMS sender IDs and active telecom licenses.' },
    { step: '02', title: 'Template Approvals', desc: 'Draft announcement newsletter templates and notice forms.' },
    { step: '03', title: 'Priority Routing Config', desc: 'Set weather/emergency notices to bypass standard logs queue.' },
    { step: '04', title: 'Messaging Center Live', desc: 'Dispatches emergency parent notifications in less than 2 seconds.' }
  ],
  'human-resources': [
    { step: '01', title: 'Staff Registry Upload', desc: 'Upload coordinator and teacher files, CVs, and credentials.' },
    { step: '02', title: 'Salary Structure Sync', desc: 'Define basic allowances, tax deductions, and expense categories.' },
    { step: '03', title: 'Biometrics Link', desc: 'Connect office check-in registers to employee payroll accounts.' },
    { step: '04', title: 'Automated HR Desk Live', desc: 'Staff download payslips and submit leave requests online.' }
  ]
};

// ---------------------------------------------------------
// PLATFORMS LAYOUT (Product Showcase & Interactive Switcher)
// ---------------------------------------------------------
function PlatformsLayout({ page }: { page: any }) {
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);

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
                      ? 'bg-white dark:bg-slate-900 border-[#0A4D8C]/20 dark:border-sky-505/20 shadow-premium' 
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
            <BeakerSimulatorWrapper slug={page.slug} activeFeatureIdx={activeFeatureIdx} />
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-955/60 border border-slate-100 dark:border-slate-855 text-left">
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
              <span className="text-xs font-bold text-slate-700 dark:text-slate-305">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// OPTIMISATION LAYOUT (Interactive Admin Dashboard & Operational Timeline)
// ---------------------------------------------------------
function OptimisationLayout({ page, openDemoModal }: { page: any; openDemoModal: () => void }) {
  const renderOptimisationDashboard = (slug: string) => {
    switch (slug) {
      case 'administration':
        return <AclPermissionManager />;
      case 'finance':
        return <InvoiceBuilder />;
      case 'learning':
        return <LmsClassroomStream />;
      case 'academics':
        return <SyllabusChecklist />;
      case 'intelligence':
        return (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-premium text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-105 dark:border-slate-850 pb-3">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Cognitive Danger Indicators</span>
              <span className="text-xs text-[#7B1E3A] font-extrabold animate-pulse">2 Critical Risks</span>
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-550 rounded-2xl flex items-center justify-between text-xs font-bold">
                <div>
                  <span className="text-[10px] uppercase font-black">Fee Defaulter Warning</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Arjun Sen (Grade 10) • Overdue by 45 days</p>
                </div>
                <button className="px-2.5 py-1 bg-[#7B1E3A] hover:bg-[#6b1932] text-white text-[9px] font-bold rounded cursor-pointer">Audit</button>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-550 rounded-2xl flex items-center justify-between text-xs font-bold">
                <div>
                  <span className="text-[10px] uppercase font-black">Performance Decline Warning</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Ritu Sen (Grade 10) • Quiz average down 18%</p>
                </div>
                <button className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[9px] font-bold rounded cursor-pointer">View Diagnostics</button>
              </div>
            </div>
          </div>
        );
      case 'logistics':
        return <LogisticsInventory />;
      case 'communication':
        return <CommunicationBroadcaster />;
      case 'human-resources':
        return (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-premium text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Active Staff Profiles (SSO linked)</span>
              <span className="text-xs text-[#7B1E3A] font-extrabold">Auto-Payslip Active</span>
            </div>
            <div className="space-y-2 text-xs font-bold text-slate-805 dark:text-white">
              <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-850">
                <span>Dr. Sandeep Sen (Principal)</span>
                <span className="text-[10px] text-slate-400">Active • $4,500/mo</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-slate-855">
                <span>Sister Mary D\'Souza (Coordinator)</span>
                <span className="text-[10px] text-slate-400">Active • $2,800/mo</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Mr. Rajat Bose (Admissions Head)</span>
                <span className="text-[10px] text-slate-400">Active • $2,600/mo</span>
              </div>
            </div>
          </div>
        );
      case 'enterprise-features':
        return <ApiRequestLogger />;
      default:
        return (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-premium text-left space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Executive KPI Board</span>
              <span className="text-xs text-slate-550 font-bold">Q2 Consolidated Summary</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl text-center">
                <span className="text-[8px] text-slate-400 font-bold uppercase">System Uptime SLA</span>
                <span className="block text-lg font-black text-[#0A4D8C] mt-0.5">99.99%</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl text-center">
                <span className="text-[8px] text-slate-400 font-bold uppercase">Staff Retention Index</span>
                <span className="block text-lg font-black text-[#0A4D8C] mt-0.5">98.2%</span>
              </div>
            </div>
          </div>
        );
    }
  };

  const currentSteps = OPTIMISATION_STEPS[page.slug] || [
    { step: '01', title: 'Consultation & Audit', desc: 'Our team assesses your school data records, databases, and compliance requirements.' },
    { step: '02', title: 'Configuration', desc: 'We customize modules, fees rules, and templates to map to your system.' },
    { step: '03', title: 'Staff Onboarding', desc: 'Coordinators and teachers undergo self-paced training walkthroughs.' },
    { step: '04', title: 'Live Deployment', desc: 'We sync parent directories and active biometric logs in 24 hours.' }
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4 w-full">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Live interactive panel</span>
            {renderOptimisationDashboard(page.slug)}
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-855 bg-white dark:bg-slate-900 shadow-premium space-y-6">
            <span className="text-xs font-extrabold text-[#0A4D8C] dark:text-sky-400 uppercase tracking-widest block">System Diagnostics</span>
            <div className="space-y-4 text-xs text-slate-505 dark:text-slate-400 font-medium leading-relaxed">
              <p>
                This mock console represents the primary dashboard designed specifically for our <strong>{page.title}</strong> module.
              </p>
              <p>
                In a production environment, this dashboard is linked with your school's multi-tenant cloud storage node to auto-audit parent checkins, biometrics, library registers, and ledger statements in real time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Implementation Pipeline Flow */}
      <div className="border-t border-slate-200 dark:border-slate-850 pt-16 space-y-10">
        <h3 className="text-2xl font-extrabold tracking-tight">Our 4-Step Operational Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {currentSteps.map((item: { step: string; title: string; desc: string }, idx: number) => (
            <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 relative overflow-hidden flex flex-col justify-between gap-4">
              <span className="absolute -top-3 -right-3 text-5xl font-black text-slate-100 dark:text-slate-850/60 pointer-events-none select-none z-0">
                {item.step}
              </span>
              <div className="relative z-10 space-y-2">
                <h4 className="font-bold text-slate-805 dark:text-white text-sm">{item.title}</h4>
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
          <Button variant="primary" size="md" onClick={openDemoModal} className="bg-[#138D75] hover:bg-[#0e6f5c] border-none text-white font-bold cursor-pointer">
            Schedule Process Audit
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// SUCCESS STORIES LAYOUT (Testimonial Quote Carousel & Before-After comparison)
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
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
            <button onClick={handleNext} className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer">
              <ChevronRight className="h-4 w-4 text-white" />
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
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
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
// INSIGHTS LAYOUT (Interactive Video, Podcast, News or Zones switcher)
// ---------------------------------------------------------
function InsightsLayout({ page }: { page: any }) {
  const [emailSubbed, setEmailSubbed] = useState(false);

  switch (page.slug) {
    case 'coverage':
      return (
        <div className="space-y-12 text-left">
          <div className="space-y-3">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
              Press Releases
            </span>
            <h2 className="text-3xl font-extrabold">SubhraEdu in the News</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Read how the educational community is discussing our modular K-12 systems and secure active directory databases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                outlet: 'TechCrunch',
                date: 'June 2026',
                title: 'SubhraEdu Pioneers Cloud Multi-Tenant Isolation for Indian K-12 Schools',
                desc: 'By building high-speed AES-256 databases and modular admissions consoles, SubhraEdu helps campuses remove administrative overhead by 45%.',
                readTime: '4 min read'
              },
              {
                outlet: 'EdTech World',
                date: 'April 2026',
                title: 'Why Real-Time Biometric Syncing is Redefining Classroom Attendance',
                desc: 'A case study on how SubhraEdu automated RFID check-in notices to notify parents in less than 1.5 seconds, cutting absenteeism by 35%.',
                readTime: '6 min read'
              }
            ].map((art, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-premium space-y-4 hover:border-slate-350 dark:hover:border-slate-800 transition-all">
                <div className="flex justify-between text-[10px] uppercase tracking-wider font-extrabold text-[#0A4D8C] dark:text-sky-400">
                  <span>{art.outlet}</span>
                  <span>{art.date}</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-855 dark:text-white leading-snug">{art.title}</h3>
                <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">{art.desc}</p>
                <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-slate-50 dark:border-slate-850">
                  <span>{art.readTime}</span>
                  <a href="#" className="hover:underline flex items-center gap-1">Read Full Article <ArrowRight className="h-3 w-3" /></a>
                </div>
              </div>
            ))}
          </div>

          {/* Press Kit */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white flex justify-between items-center">
            <div>
              <span className="text-xs font-black uppercase text-amber-500">Official Media Kit</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Download brand logo packs, high-res screen displays, and brochures.</p>
            </div>
            <button className="px-4 py-2 bg-slate-800 text-[10px] font-black uppercase rounded-lg hover:bg-slate-700 transition-colors cursor-pointer">Download (.ZIP)</button>
          </div>
        </div>
      );
    
    case 'video':
      return <VideoPlaylistConsole />;

    case 'ed-talks':
      return <PodcastPlayer />;

    case 'newsletter':
      return (
        <div className="space-y-12 text-left">
          <div className="space-y-3">
            <span className="text-xs font-extrabold text-school-green uppercase tracking-widest bg-[#e8f7f4] dark:bg-slate-900 px-3 py-1.5 rounded-full border border-teal-150 dark:border-slate-850">
              Monthly Newsletter
            </span>
            <h2 className="text-3xl font-extrabold">Tips for Modern School Administrations</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Join 8,500+ school directors, office coordinators, and teachers. Get free HTML notices, compliance checklists, and audit guides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-school-green/10 via-transparent to-transparent pointer-events-none" />
            <div className="md:col-span-7 space-y-4">
              <span className="text-[9px] uppercase tracking-widest text-school-green font-extrabold bg-school-green/10 border border-school-green/20 px-2 py-0.5 rounded">Subscribe</span>
              <h3 className="text-xl font-black text-left">Stay Ahead of EdTech Trends</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold text-left">
                Get monthly roundups of administrative tips, regulatory checklist files, and product feature details.
              </p>
            </div>
            <div className="md:col-span-5 relative z-10">
              {emailSubbed ? (
                <div className="p-4 bg-school-green/10 border border-school-green/30 rounded-2xl text-center text-xs font-bold text-school-green animate-bounce">
                  ✓ Subscribed! Check your inbox for the latest resources.
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
                    placeholder="office.email@school.edu" 
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none focus:ring-1 focus:ring-school-green"
                  />
                  <button 
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-school-green hover:bg-[#0e6f5c] text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    Join List
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Newsletter archives */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white">Previous Newsletter Issues</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'May 2026: End of Term Financial Audit Checklists', link: '#' },
                { title: 'April 2026: Safe Data Isolation Practices for Schools', link: '#' },
                { title: 'March 2026: RFID Attendance integration guide', link: '#' }
              ].map((iss, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-800 transition-all text-left">
                  <span className="text-[9px] text-slate-400 font-bold uppercase mb-2">Issue #{42 - i}</span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-normal mb-4">{iss.title}</h4>
                  <a href={iss.link} className="text-[10px] text-school-green font-extrabold hover:underline">Read Issue &gt;</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'student-zone':
      return <StudentZoneDashboard />;

    case 'educator-zone':
      return <TeacherZoneDashboard />;

    case 'educators-article':
      return <EducatorBlogCatalog />;

    default:
      return (
        <div className="space-y-6 text-left">
          <h2 className="text-2xl font-extrabold">Ecosystem Insights Overview</h2>
          <p className="text-slate-650 dark:text-slate-400 leading-relaxed font-semibold">
            {page.description}
          </p>
        </div>
      );
  }
}

// ---------------------------------------------------------
// ABOUT US LAYOUT (Timeline milestones & Core values)
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
          <p className="text-slate-550 dark:text-slate-400 font-medium">
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
              <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-855 shadow-premium space-y-3 text-left">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-655 dark:text-slate-350 shadow-sm">
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

  if (slug === 'subhraedu-one') {
    return <SubhraEduOnePage openDemoModal={openDemoModal} />;
  }

  if (slug === 'mobile-apps') {
    return <MobileAppsPage openDemoModal={openDemoModal} />;
  }

  if (slug === 'experiential-learning') {
    return <ExperientialLearningPage openDemoModal={openDemoModal} />;
  }

  if (slug === 'pre-school-management') {
    return <PreSchoolManagementPage openDemoModal={openDemoModal} />;
  }

  if (slug === 'case-studies') {
    return <CaseStudiesPage openDemoModal={openDemoModal} />;
  }

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
        return <InsightsLayout page={page} />;
      case 'about':
        return <AboutUsLayout />;
      default:
        return (
          <div className="space-y-6 text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold">Ecosystem Overview</h2>
            <p className="text-slate-655 dark:text-slate-400 leading-relaxed font-semibold">
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
      <section className="bg-slate-900 dark:bg-slate-955 text-white py-16 px-6 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-school-blue/30 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight">Experience SubhraEdu Operations Live</h3>
          <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Schedule a personalized walkthrough with our product architects today to deploy a customized sandboxed instance for your campus reviews.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Button variant="primary" size="lg" onClick={openDemoModal} className="bg-[#0A4D8C] hover:bg-[#083D70] border-none text-white font-bold px-8 shadow-lg cursor-pointer">
              Book a System Walkthrough
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
