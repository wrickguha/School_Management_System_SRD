import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Tv, BookOpen, ChevronRight, Sparkles, Download, 
  TrendingUp, Clock, CheckCircle, RefreshCcw, Volume2, VolumeX
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface CaseStudiesPageProps {
  openDemoModal: () => void;
}

type CaseStudyKey = 'tagore' | 'birla' | 'pallotti' | 'airforce';

interface CaseStudyDetails {
  key: CaseStudyKey;
  schoolName: string;
  headline: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  metricBadge: string;
  bgGradient: string;
  accentText: string;
}

export default function CaseStudiesPage({ openDemoModal }: CaseStudiesPageProps) {
  // 1. Video Player Simulator States
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoTime, setVideoTime] = useState('00:00');
  const [videoSubtitle, setVideoSubtitle] = useState('Click play to watch the success story...');
  const [isMuted, setIsMuted] = useState(false);
  const videoIntervalRef = useRef<any>(null);

  // 2. Active Case Study Modal State
  const [selectedCase, setSelectedCase] = useState<CaseStudyKey | null>(null);

  // 3. Calculator States
  const [studentCount, setStudentCount] = useState(1200);
  const [avgTuition, setAvgTuition] = useState(150);
  const [currency, setCurrency] = useState<'USD' | 'INR'>('INR');

  // Video Simulator Clock Logic
  useEffect(() => {
    if (isVideoPlaying) {
      videoIntervalRef.current = setInterval(() => {
        setVideoProgress((prev) => {
          const next = prev + 1.5;
          if (next >= 100) {
            setIsVideoPlaying(false);
            clearInterval(videoIntervalRef.current);
            setVideoSubtitle('Video finished. Replay to watch again!');
            return 100;
          }
          
          // Subtitles based on progress
          if (next < 20) {
            setVideoSubtitle('Intro: The severe challenge of manual, fragmented school operations...');
          } else if (next >= 20 && next < 45) {
            setVideoSubtitle('Deployment Phase: Integrating fees, GPS tracking, and parent apps...');
          } else if (next >= 45 && next < 75) {
            setVideoSubtitle('Operational Shift: Teachers save 2+ hours daily. Zero cash leakage...');
          } else {
            setVideoSubtitle('Key Outcome: Command-level dashboard transparency across all schools...');
          }

          // Format simulated time
          const totalSeconds = Math.floor((next / 100) * 165); // 2 mins 45s total
          const mins = Math.floor(totalSeconds / 60);
          const secs = totalSeconds % 60;
          setVideoTime(`0${mins}:${secs < 10 ? '0' : ''}${secs}`);
          return next;
        });
      }, 1000);
    } else {
      if (videoIntervalRef.current) {
        clearInterval(videoIntervalRef.current);
      }
    }

    return () => {
      if (videoIntervalRef.current) {
        clearInterval(videoIntervalRef.current);
      }
    };
  }, [isVideoPlaying]);

  const handleVideoPlayToggle = () => {
    if (videoProgress >= 100) {
      setVideoProgress(0);
      setVideoTime('00:00');
    }
    setIsVideoPlaying(!isVideoPlaying);
  };

  const handleVideoReset = () => {
    setVideoProgress(0);
    setVideoTime('00:00');
    setIsVideoPlaying(false);
    setVideoSubtitle('Ready to play.');
  };

  // Case Studies Config
  const caseStudiesList: CaseStudyDetails[] = [
    {
      key: 'tagore',
      schoolName: 'Tagore International School',
      headline: 'What happens when a school stops managing chaos and starts leading?',
      summary: 'Tagore International School cut administrative workload by 70%, tripled admission conversion rates, and freed their teachers to teach by choosing one platform over dozens of broken processes.',
      challenge: 'Tagore was burdened by paper-heavy circulars, long queues at fee windows, and delayed communications. Teachers spent over 2.5 hours daily managing manual registers and parent homework diaries.',
      solution: 'Implemented SubhraEdu unified cloud core including Online Fee Gateway, Automated SIS Database, and the Parent-Teacher Communication mobile application.',
      results: [
        '70% administrative workload reduction in the first term.',
        '3x increase in online admissions registration conversions.',
        'Syllabus tracking dashboard increased classroom compliance by 100%.'
      ],
      metricBadge: '70% Workload Drop',
      bgGradient: 'from-pink-500/10 via-rose-500/5 to-transparent border-pink-500/20',
      accentText: 'text-pink-600 dark:text-pink-400'
    },
    {
      key: 'birla',
      schoolName: 'Aditya Birla Group of Schools',
      headline: 'One platform. 52 schools. Zero compromise.',
      summary: 'How the Aditya Birla Group of Schools unified a 45,000 student network across 12 states eliminating operational chaos, accelerating admissions, and giving group leadership the visibility to govern at scale.',
      challenge: 'Managing 52 schools dispersed across 12 Indian states meant leadership had zero real-time insights into fee defaults, employee rotas, and enrollment trends. System audits took several weeks.',
      solution: 'Deployed the SubhraEdu Multi-Tenant Campus Governance Cockpit, providing centralized reporting, unified ledger structures, and synchronized security controls.',
      results: [
        'Real-time access to operational registers across all 52 campuses.',
        'Zero fee revenue leakage with automated direct bank settlement integrations.',
        'Unified database schema securing records of 45,000+ students with Microsoft security shields.'
      ],
      metricBadge: '52 Campuses Synced',
      bgGradient: 'from-indigo-500/10 via-blue-500/5 to-transparent border-indigo-500/20',
      accentText: 'text-indigo-650 dark:text-indigo-400'
    },
    {
      key: 'pallotti',
      schoolName: 'Vincent Pallotti Group Schools',
      headline: 'One vision. Five campuses. One connected school ecosystem.',
      summary: 'How the Vincent Pallotti Group moved from scattered registers and manual follow-ups to a single, real-time platform accelerating admissions, giving leadership live visibility, and handing thousands of hours back to its teachers.',
      challenge: 'Fragmented WhatsApp groups, physical gradebook errors, and manual attendance notices caused parental frustration and delayed fee compliance across their 5 city campuses.',
      solution: 'Launched the integrated SubhraEdu Parent mobile application and Biometric Attendance Synced engine.',
      results: [
        'Unexplained student absences reduced by 35% using instant automated notifications.',
        '20,000+ total teaching hours saved per year across all campuses.',
        'Centralized fee ledger resolved parent reconciliation queries instantly.'
      ],
      metricBadge: '20,000 Hours Saved',
      bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/20',
      accentText: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      key: 'airforce',
      schoolName: 'Air Force Schools',
      headline: 'Discipline. Data. Digital Sovereignty.',
      summary: 'How Air Force Schools unified campuses across IAF stations on one secure, compliant platform protecting sensitive student data, eliminating operational chaos, and giving command-level leadership real-time visibility across the entire network.',
      challenge: 'IAF station schools required the highest standards of data security, compliance, and multi-level data isolation protocols to protect military families\' identities and locations.',
      solution: 'Deployed SubhraEdu on a private, sovereign Microsoft cloud setup equipped with active directory role-based permissions and high-grade data encryption.',
      results: [
        '100% cyber-compliance audit compliance under defense security standard vectors.',
        'Secure multi-tier role-based access for IAF Station commandants and education cells.',
        'Consolidated command-level dashboards updating daily enrollment parameters.'
      ],
      metricBadge: '100% Data Sovereignty',
      bgGradient: 'from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/20',
      accentText: 'text-amber-600 dark:text-amber-400'
    }
  ];

  // Calculator logic
  const symbol = currency === 'USD' ? '$' : '₹';
  const currencyMultiplier = currency === 'USD' ? 1 : 83; // Approx rate for representation

  // Formulas
  const hoursSavedVal = Math.floor(studentCount * 0.16);
  const sheetsSavedVal = Math.floor(studentCount * 9.5);
  const revenueRecoveredVal = Math.floor(studentCount * (avgTuition * currencyMultiplier) * 0.045);

  const selectedCaseDetails = caseStudiesList.find(c => c.key === selectedCase);

  return (
    <div className="relative bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. HERO HEADER SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-br from-indigo-50 via-blue-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-850">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e508_1px,transparent_1px),linear-gradient(to_bottom,#4f46e508_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f46e505_1px,transparent_1px),linear-gradient(to_bottom,#4f46e505_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 dark:bg-indigo-400/5 blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-left space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-full max-w-max border border-slate-200/50 dark:border-slate-805">
            <span className="hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer">Home</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer">Success Stories</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-indigo-600 dark:text-indigo-400">Case Studies</span>
          </div>

          {/* Title block */}
          <div className="space-y-4 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-200/40 dark:border-indigo-900/30 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-indigo-500" />
              <span>Campus Transformation Portfolios</span>
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              Ecosystem <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-sky-500 bg-clip-text text-transparent">Case Studies</span>
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-slate-650 dark:text-slate-400 leading-relaxed font-semibold max-w-2xl">
              Stories of Progress, Innovation & Growth. Discover how leading schools and large multi-campus group networks converted paper-heavy administrative blocks into high-performing digital workspaces.
            </p>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE VIDEO PLAYER SIMULATOR */}
      <section className="py-16 max-w-5xl mx-auto px-6 text-left">
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Video Showcase</span>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Watch Our Digital Transformation Journey
            </h2>
            <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Play the documentary simulator below to see our ERP cockpit in action across top schools.
            </p>
          </div>

          <div className="relative aspect-video rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between p-6">
            {/* Visual Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff02_1px,_transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            {/* Video Thumbnail & State Visualiser */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-gradient-to-b from-transparent via-slate-950/45 to-slate-950/80">
              {!isVideoPlaying && videoProgress === 0 ? (
                <div className="space-y-4">
                  <button 
                    onClick={handleVideoPlayToggle}
                    className="h-16 w-16 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg hover:bg-indigo-700 cursor-pointer"
                  >
                    <Play className="h-8 w-8 fill-current ml-1" />
                  </button>
                  <div>
                    <span className="text-xs text-white font-extrabold uppercase tracking-widest block">Play Documentary</span>
                    <span className="text-[10px] text-slate-400 font-bold block mt-1">Duration: 2:45 • Subtitles Included</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col justify-between items-center text-white pointer-events-none">
                  {/* Status indicator */}
                  <div className="w-full flex justify-between items-center bg-slate-950/60 backdrop-blur-sm p-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                      <span className="text-[10px] font-black uppercase text-red-500">Documentary Stream Active</span>
                    </div>
                    <span className="text-[9.5px] font-mono text-slate-300">{videoTime} / 02:45</span>
                  </div>

                  {/* Subtitle Board */}
                  <div className="bg-slate-950/85 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-white/10 text-xs md:text-sm font-extrabold max-w-lg shadow-2xl leading-relaxed text-indigo-300 animate-pulse text-center">
                    "{videoSubtitle}"
                  </div>

                  {/* Empty spacer to align items */}
                  <div />
                </div>
              )}
            </div>

            {/* Bottom Controls Bar (always visible) */}
            <div className="w-full bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex items-center gap-4 relative z-20 mt-auto">
              <button 
                onClick={handleVideoPlayToggle}
                className="h-10 w-10 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                {isVideoPlaying ? <Tv className="h-4.5 w-4.5 animate-pulse text-white" /> : <Play className="h-4.5 w-4.5 fill-current ml-0.5 text-white" />}
              </button>

              <button 
                onClick={handleVideoReset}
                className="h-10 w-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Restart Video"
              >
                <RefreshCcw className="h-4 w-4" />
              </button>

              {/* Progress Bar Container */}
              <div className="flex-1 h-2.5 bg-slate-850 rounded-full overflow-hidden relative border border-white/5">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300 relative" 
                  style={{ width: `${videoProgress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow border border-indigo-600" />
                </div>
              </div>

              {/* Mute button */}
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="h-10 w-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                {isMuted ? <VolumeX className="h-4.5 w-4.5 text-red-400" /> : <Volume2 className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CASE STUDIES GRID SECTION */}
      <section className="py-20 bg-slate-50 dark:bg-slate-955/30 border-y border-slate-100 dark:border-slate-850 text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block font-black">Success Portfolios</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              Proven School Transformations
            </h2>
            <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-405 leading-relaxed">
              Read detailed accounts of how we helped schools optimize workload, enhance cashflow, and secure data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-semibold">
            {caseStudiesList.map((cs) => (
              <div 
                key={cs.key}
                className={`p-6 md:p-8 rounded-3xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 shadow-premium flex flex-col justify-between space-y-6 hover:shadow-cardHover transition-all relative overflow-hidden group bg-gradient-to-br ${cs.bgGradient}`}
              >
                <div className="space-y-4">
                  {/* Category badge */}
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-xl bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 shadow-sm ${cs.accentText}`}>
                      {cs.metricBadge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">Case Study</span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider">{cs.schoolName}</h3>
                  
                  <h4 className="text-base md:text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                    {cs.headline}
                  </h4>
                  
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                    {cs.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-850/80 flex items-center justify-between">
                  <button 
                    onClick={() => setSelectedCase(cs.key)}
                    className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    Read Tagore Success Story <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE SAVINGS CALCULATOR */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sliders Input Panel */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block font-black">ROI Calculator</span>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Calculate Your ERP Savings Index
              </h2>
              <p className="text-xs md:text-sm font-semibold text-slate-505 dark:text-slate-400 leading-relaxed">
                Adjust the school size and tuition parameters to simulate potential administrative resources saved by implementing the SubhraEdu platform.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-855 shadow-inner space-y-6 font-semibold">
              
              {/* Currency Toggle */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-slate-650 dark:text-slate-400">Display Currency</span>
                <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden p-0.5 bg-white dark:bg-slate-900">
                  <button 
                    onClick={() => setCurrency('USD')}
                    className={`px-3 py-1 text-[10px] font-black rounded-lg transition-colors cursor-pointer ${currency === 'USD' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    USD ($)
                  </button>
                  <button 
                    onClick={() => setCurrency('INR')}
                    className={`px-3 py-1 text-[10px] font-black rounded-lg transition-colors cursor-pointer ${currency === 'INR' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    INR (₹)
                  </button>
                </div>
              </div>

              {/* Student slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-slate-650 dark:text-slate-400">Total Enrolled Students:</span>
                  <span className="text-indigo-650 dark:text-indigo-400 text-sm font-black">{studentCount} Students</span>
                </div>
                <input 
                  type="range" 
                  min="300" 
                  max="5000" 
                  step="100"
                  value={studentCount} 
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                  <span>300</span>
                  <span>2,500</span>
                  <span>5,000</span>
                </div>
              </div>

              {/* Fee slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-slate-650 dark:text-slate-400">Average Monthly Tuition:</span>
                  <span className="text-indigo-650 dark:text-indigo-400 text-sm font-black">{symbol}{avgTuition} / month</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="800" 
                  step="10"
                  value={avgTuition} 
                  onChange={(e) => setAvgTuition(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                  <span>{symbol}20</span>
                  <span>{symbol}400</span>
                  <span>{symbol}800</span>
                </div>
              </div>

            </div>
          </div>

          {/* Savings Calculations Output Panel */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-indigo-600 text-white space-y-6 shadow-2xl relative overflow-hidden bg-gradient-to-b from-indigo-600 to-blue-700">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.07),_transparent)] pointer-events-none" />
            
            <div className="border-b border-white/10 pb-3">
              <span className="text-[9.5px] font-black uppercase tracking-widest text-indigo-200 block">Monthly Savings Index</span>
              <span className="text-[10px] text-indigo-100/70 font-semibold block mt-0.5">Calculated based on SubhraEdu system averages</span>
            </div>

            <div className="space-y-6 text-left">
              {/* Metric 1 */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-indigo-200 uppercase font-black block tracking-wider">Admin Hours Saved</span>
                  <span className="text-2xl font-black block mt-0.5">{hoursSavedVal.toLocaleString()} Hours</span>
                  <p className="text-[9.5px] text-indigo-100/70 mt-0.5 font-medium leading-tight">Freed from registers, manual billing & roll-calls</p>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-indigo-200 uppercase font-black block tracking-wider">Paperwork Eliminated</span>
                  <span className="text-2xl font-black block mt-0.5">{sheetsSavedVal.toLocaleString()} Sheets</span>
                  <p className="text-[9.5px] text-indigo-100/70 mt-0.5 font-medium leading-tight">Digital circulars, diaries & online receipts</p>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-indigo-200 uppercase font-black block tracking-wider">Revenue Leakage Recovered</span>
                  <span className="text-2xl font-black block mt-0.5">{symbol}{revenueRecoveredVal.toLocaleString()}</span>
                  <p className="text-[9.5px] text-indigo-100/70 mt-0.5 font-medium leading-tight">4.5% improvement via automated SMS fee reminders</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-center">
              <Button 
                variant="outline" 
                size="md" 
                onClick={openDemoModal}
                className="w-full font-bold border-white/30 text-white hover:bg-white/10 bg-transparent cursor-pointer text-xs uppercase tracking-wider"
              >
                Request Custom Audit
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* 5. MOCK SUCCESS CASE DETAILS DRAWER/MODAL */}
      <AnimatePresence>
        {selectedCase && selectedCaseDetails && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[999] flex justify-center items-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 space-y-6 text-left shadow-2xl relative"
            >
              {/* Close Trigger */}
              <button 
                onClick={() => setSelectedCase(null)}
                className="absolute top-4 right-4 h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>

              <div className="space-y-4">
                <span className="text-xs font-black text-indigo-650 dark:text-indigo-400 uppercase tracking-widest block">Detailed Profile Overview</span>
                
                <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  {selectedCaseDetails.schoolName}
                </h2>
                
                <p className="text-xs md:text-sm font-extrabold text-slate-700 dark:text-indigo-300 italic">
                  "{selectedCaseDetails.headline}"
                </p>
              </div>

              {/* Detail Blocks */}
              <div className="space-y-5 font-semibold text-xs leading-relaxed">
                
                {/* Challenge */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">The Challenge</h4>
                  <p className="text-slate-600 dark:text-slate-400">{selectedCaseDetails.challenge}</p>
                </div>

                {/* Solution */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">The Solution</h4>
                  <p className="text-slate-650 dark:text-slate-400">{selectedCaseDetails.solution}</p>
                </div>

                {/* Results list */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Key Outcomes</h4>
                  <div className="space-y-2">
                    {selectedCaseDetails.results.map((res, i) => (
                      <div key={i} className="flex gap-2.5 items-start">
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-slate-600 dark:text-slate-400 font-semibold">{res}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-805 flex flex-col sm:flex-row justify-end gap-3.5">
                <Button 
                  variant="outline" 
                  size="md" 
                  onClick={() => alert('Mock Case Study PDF Download Triggered Successfully!')}
                  className="font-bold border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase"
                >
                  <Download className="h-4 w-4" /> Download PDF Report
                </Button>
                <Button 
                  variant="primary" 
                  size="md" 
                  onClick={() => {
                    setSelectedCase(null);
                    openDemoModal();
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 border-none font-bold text-white shadow-lg text-xs uppercase tracking-wider"
                >
                  Schedule Solution Audit
                </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. BEFORE AND AFTER METRICS COMPARISON */}
      <section className="py-20 bg-slate-50 dark:bg-slate-955/30 border-t border-slate-100 dark:border-slate-850 text-left font-semibold">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          
          <div className="space-y-3">
            <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-widest block">Operations Comparison</span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Standard Administrative Processing Speed
            </h2>
            <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Comparison statistics compiled across 1,200+ active school deployments comparing legacy manual workflows vs SubhraEdu ERP.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Attendance Check-in (Classroom)', beforeVal: '45 mins', afterVal: '1.2 mins', beforePct: 100, afterPct: 3 },
              { label: 'Ledger Audit & Reconciliation', beforeVal: '14 hrs', afterVal: '10 mins', beforePct: 100, afterPct: 2 },
              { label: 'Absence Parent SMS Dispatch', beforeVal: '4 hrs', afterVal: '1.5 secs', beforePct: 100, afterPct: 1 }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-premium space-y-5">
                <h4 className="font-extrabold text-slate-850 dark:text-white text-xs">{item.label}</h4>
                
                <div className="space-y-3">
                  {/* Before */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>Manual Process</span>
                      <span>{item.beforeVal}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-350 dark:bg-slate-700 rounded-full" style={{ width: `${item.beforePct}%` }} />
                    </div>
                  </div>

                  {/* After */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">
                      <span>SubhraEdu Connected</span>
                      <span>{item.afterVal}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full animate-pulse" style={{ width: `${item.afterPct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-center">
        <div className="p-8 md:p-12 rounded-[32px] bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 border border-indigo-150/40 dark:border-indigo-900/30 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Ready to Build Your School's Success Story?
          </h2>
          <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-450 max-w-xl mx-auto leading-relaxed">
            Partner with SubhraEdu to deploy a centralized, secure digital campus. Schedule your system walkthrough to begin.
          </p>

          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-850/50 max-w-xs mx-auto">
            <Button 
              variant="outline" 
              size="md" 
              onClick={openDemoModal} 
              className="font-extrabold border-indigo-650 text-indigo-650 hover:bg-indigo-50 dark:hover:bg-slate-800 w-full cursor-pointer text-xs uppercase"
            >
              Request For System Demo
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
