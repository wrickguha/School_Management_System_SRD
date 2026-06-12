import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, Compass, Target, 
  Activity, Cpu, Layers, Video, Globe, 
  FileText, Play, Flame, Thermometer
} from 'lucide-react';
import { Button } from '../components/ui/Button';

interface ExperientialLearningPageProps {
  openDemoModal: () => void;
}

type KolbStage = 'experience' | 'observation' | 'conceptualization' | 'experimentation';
type SandboxTab = 'chemistry' | 'orbit';

export default function ExperientialLearningPage({ openDemoModal }: ExperientialLearningPageProps) {
  // 1. Kolb Cycle State
  const [activeStage, setActiveStage] = useState<KolbStage>('experience');

  // 2. Sandbox State
  const [activeSandbox, setActiveSandbox] = useState<SandboxTab>('chemistry');
  
  // 3. Chemistry Simulator States
  const [chemicalColor, setChemicalColor] = useState('bg-sky-400/80');
  const [chemicalName, setChemicalName] = useState('H2O (Pure Water)');
  const [temperature, setTemperature] = useState(25); // Celsius
  const [phLevel, setPhLevel] = useState(7.0);
  const [isReacting, setIsReacting] = useState(false);

  // 4. Orbit Simulator States
  const [planetDistance, setPlanetDistance] = useState(150); // million km
  const [planetMass, setPlanetMass] = useState(1.0); // Earth masses
  const [orbitSpeed, setOrbitSpeed] = useState(29.8); // km/s

  // 5. PBL Connector State
  const [activeNode, setActiveNode] = useState<'science' | 'geography' | 'social'>('science');

  // Helper for mixing chemicals
  const handleMix = (color: string, name: string, ph: number) => {
    setIsReacting(true);
    setChemicalColor(color);
    setChemicalName(name);
    setPhLevel(ph);
    setTimeout(() => setIsReacting(false), 1800);
  };

  // Helper for heating chemicals
  const handleHeat = () => {
    if (temperature < 100) {
      setIsReacting(true);
      setTemperature(prev => Math.min(prev + 25, 100));
      setTimeout(() => setIsReacting(false), 1000);
    }
  };

  // Helper for cooling chemicals
  const handleCool = () => {
    if (temperature > 0) {
      setIsReacting(true);
      setTemperature(prev => Math.max(prev - 25, 0));
      setTimeout(() => setIsReacting(false), 1000);
    }
  };

  // Update orbit metrics based on sliders
  const handleOrbitUpdate = (distance: number, mass: number) => {
    setPlanetDistance(distance);
    setPlanetMass(mass);
    // Rough physical simulation formula for visual speed
    const calculatedSpeed = parseFloat((29.8 * Math.sqrt(mass / (distance / 150))).toFixed(1));
    setOrbitSpeed(calculatedSpeed);
  };

  const partnerSchools = [
    { name: "Air Force Golden Jubilee School", logo: "✈️" },
    { name: "Chavara CMI Public School", logo: "🏫" },
    { name: "Delhi Public School", logo: "🎓" },
    { name: "Father Agnel School", logo: "⭐" },
    { name: "Khaitan Public School", logo: "🏛️" },
    { name: "The Cathedral & John Connon", logo: "⚜️" },
    { name: "Don Bosco School", logo: "☀️" },
    { name: "Lotus Valley School", logo: "🪷" }
  ];

  const kolbStages = [
    {
      key: 'experience',
      label: 'Concrete Experience (DO)',
      number: '01',
      title: 'Active Involvement in Real-world Scenarios',
      description: 'Traditional classrooms lack opportunities for hands-on trial. SubhraEdu provides virtual labs, 3D simulations, and place-based tasks to let students experience concepts directly.',
      metric: '69% Retention',
      metricDesc: 'Harvard Study: Experiential learning retention vs 3% for passive lecture.',
      icon: Activity,
      color: 'border-orange-500 text-orange-500 bg-orange-500/10'
    },
    {
      key: 'observation',
      label: 'Reflective Observation (REFLECT)',
      number: '02',
      title: 'Reviewing and Analysing the Experience',
      description: 'After running a model, students watch expert HD video-based experiments (4-7 minutes long) to cross-verify physical outcomes, noting chemical or mechanical discrepancies.',
      metric: '30% More Focused',
      metricDesc: 'EDT Research: Virtual laboratories increase focus and data analysis skills.',
      icon: Compass,
      color: 'border-amber-500 text-amber-500 bg-amber-500/10'
    },
    {
      key: 'conceptualization',
      label: 'Abstract Conceptualisation (THINK)',
      number: '03',
      title: 'Formulating Theories and Academic Logic',
      description: 'Students bridge the visual outcomes to mathematical formulas. Aided by 3D AR assets (like Cardiac blood pressure flow), abstract concepts become tangible structures.',
      metric: '75% Retention Lift',
      metricDesc: 'PwC Study: 3D AR modeling significantly boosts structural comprehension.',
      icon: Lightbulb,
      color: 'border-emerald-500 text-emerald-500 bg-emerald-500/10'
    },
    {
      key: 'experimentation',
      label: 'Active Experimentation (APPLY)',
      number: '04',
      title: 'Testing Theories in New Contexts',
      description: 'Students construct interdisciplinary projects (Project-Based Learning) and self-assess via AI-guided custom assessments, earning gamified skill level badges.',
      metric: '27% Performance Jump',
      metricDesc: 'Study shows significant test score increases through PBL assessments.',
      icon: Target,
      color: 'border-blue-500 text-blue-500 bg-blue-500/10'
    }
  ];

  const pblDetails = {
    science: {
      title: "Science: Chemical Composition & pH Levels",
      desc: "Students measure heavy metals, toxic chemical parameters, and acidity indices in the water samples, learning lab safety standards.",
      icon: Lightbulb,
      items: ["Volumetric water titrations", "pH scale comparisons", "Heavy metal precipitation runs"]
    },
    geography: {
      title: "Geography: Topographical Catchment Vectors",
      desc: "Students map rainfall contour elevations, regional groundwater tables, and natural runoff paths to analyze contamination spreading.",
      icon: Globe,
      items: ["Contour elevation mappings", "Rainfall density modeling", "Groundwater basin overlays"]
    },
    social: {
      title: "Social Studies: Demographic Resource Access",
      desc: "Students survey local residential districts to evaluate the socioeconomic impacts of water quality disparities on families.",
      icon: FileText,
      items: ["Socioeconomic questionnaires", "Resource access charts", "Public health vector correlation"]
    }
  };

  return (
    <div className="relative bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 bg-gradient-to-br from-[#fff7ed] via-[#fffbeb] to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-100 dark:border-slate-850">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f9731610_1px,transparent_1px),linear-gradient(to_bottom,#f9731610_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#f9731608_1px,transparent_1px),linear-gradient(to_bottom,#f9731608_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] rounded-full bg-orange-500/5 dark:bg-orange-400/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[5%] w-[450px] h-[450px] rounded-full bg-amber-500/5 dark:bg-amber-400/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 text-left">
          
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-950/40 border border-orange-200/50 dark:border-orange-900/30 px-3.5 py-1.5 rounded-full text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              NEP 2020 & NCFSE 2023 Compliant
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              Empowering Teachers for <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 bg-clip-text text-transparent">Experiential Learning</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-semibold max-w-2xl">
              Powering Educators to Build Champions for Life. Transform traditional classrooms into active sandbox labs with virtual experiments, AR modeling, and interdisciplinary Project-Based Learning.
            </p>

            <div className="flex gap-4 pt-2">
              <Button 
                variant="primary" 
                size="md" 
                onClick={openDemoModal} 
                className="bg-orange-600 hover:bg-orange-700 border-none font-bold text-white shadow-lg text-xs uppercase tracking-wider"
              >
                Request For Demo
              </Button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/60 dark:border-slate-800/80">
              {[
                { val: '69%', label: 'Retention Boost' },
                { val: '2K+', label: 'Schools Trusted' },
                { val: '3X', label: 'Engagement Lift' }
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

          {/* Right Side Visual - Interactive Simulator Preview */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-[380px] rounded-[32px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-premium p-6 text-left space-y-6">
              
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 bg-orange-500/10 text-orange-600 rounded-xl flex items-center justify-center">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-black text-slate-900 dark:text-white">Active Sandbox Simulator</span>
                    <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">Module Sandbox v2.4</span>
                  </div>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              </div>

              {/* Chemical Simulator View */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900 flex flex-col justify-between aspect-[1.1] overflow-hidden text-slate-300 relative">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Virtual Chemical Mix</span>
                
                <div className="flex-1 flex justify-center items-center gap-4 my-2">
                  {/* Beaker Container */}
                  <div className="relative w-12 h-20 border-4 border-slate-700 rounded-b-xl border-t-0 bg-slate-900/30 flex flex-col justify-end p-0.5 overflow-hidden">
                    <div className="absolute left-1 top-2 w-1.5 h-0.5 bg-slate-700" />
                    <div className="absolute left-1 top-6 w-2.5 h-0.5 bg-slate-700" />
                    <div className="absolute left-1 top-10 w-1.5 h-0.5 bg-slate-700" />
                    <div className="absolute left-1 top-14 w-2.5 h-0.5 bg-slate-700" />

                    {/* Liquid */}
                    <div className={`w-full transition-all duration-700 rounded-b-lg relative ${chemicalColor}`} style={{ height: '60%' }}>
                      {isReacting && (
                        <div className="absolute inset-0 flex justify-around items-end pb-2">
                          <span className="h-1 w-1 rounded-full bg-white/50 animate-bounce" />
                          <span className="h-1.5 w-1.5 rounded-full bg-white/40 animate-bounce delay-150" />
                          <span className="h-1 w-1 rounded-full bg-white/50 animate-bounce delay-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="leading-tight">
                      <span className="block text-[8px] text-slate-500 font-bold uppercase">Compound</span>
                      <span className="font-extrabold text-white text-[11px]">{chemicalName}</span>
                    </div>
                    <div className="leading-tight">
                      <span className="block text-[8px] text-slate-500 font-bold uppercase">pH Level</span>
                      <span className="font-black text-amber-500 text-[11px]">{phLevel.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-center border-t border-slate-900 pt-3">
                  <button 
                    onClick={() => handleMix('bg-emerald-500/80', 'NiCl2 Nickel Solution', 6.2)}
                    disabled={isReacting}
                    className="px-2 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-[8.5px] font-bold text-white rounded transition-all cursor-pointer border border-slate-800"
                  >
                    Add Solution A
                  </button>
                  <button 
                    onClick={() => handleMix('bg-indigo-500/80', 'KMnO4 Permanganate', 8.5)}
                    disabled={isReacting}
                    className="px-2 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-[8.5px] font-bold text-white rounded transition-all cursor-pointer border border-slate-800"
                  >
                    Add Solution B
                  </button>
                </div>
              </div>

              <div className="text-center text-[9px] font-bold text-slate-400">
                Interactive science tools increase lab retention by 30%
              </div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[390px] h-[390px] rounded-full border border-orange-500/10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full border border-orange-500/5 pointer-events-none" />
          </div>

        </div>
      </section>

      {/* 2. TRUSTED SCHOOLS SLIDER */}
      <section className="py-8 bg-slate-50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center block">
            Trusted by 2K+ Educational Institutions Across India
          </span>
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {partnerSchools.map((school, sIdx) => (
              <div key={sIdx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm text-xs font-bold text-slate-600 dark:text-slate-450 hover:border-orange-500/30 transition-all">
                <span>{school.logo}</span>
                <span>{school.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BEYOND ACADEMICS INTRO */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-left space-y-10">
        <div className="space-y-4 text-center">
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">Bridging The Competency Gap</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Rethinking K-12 Knowledge Delivery
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-5">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Educators worldwide are now rethinking how knowledge is delivered, addressing students' diverse learning styles and behavioral differences.
              <br /><br />
              With the **National Education Policy 2020 (NEP 2020)** and the **National Curriculum Framework for School Education 2023 (NCFSE 2023)**, India’s education system is transitioning significantly from an outdated factory model to a more personalised, experiential learning framework.
              <br /><br />
              SubhraEdu's Experiential Learning Portal combined with central ERP empowers teachers to leverage technology to disrupt traditional classrooms, creating more engaging, competency-based learning environments.
            </p>
          </div>
          <div className="md:col-span-5">
            <div className="p-6 rounded-3xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-4 shadow-sm">
              <div className="h-10 w-10 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center">
                <Flame className="h-5.5 w-5.5" />
              </div>
              <h4 className="text-sm font-black uppercase text-amber-700 dark:text-amber-400">Future Skill Gap Forecast</h4>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                By **2030, 35% of students** are expected to work in roles that do not exist today, making the shift toward experiential learning and personalised education essential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE KOLB'S CYCLE WORKSPACE */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950/45 border-y border-slate-200/80 dark:border-slate-850/80 text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest font-black">Methodology In Action</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Kolb's Experiential Learning Cycle
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              David Kolb’s learning cycle emphasizes concrete experience as the foundation of meaningful education. Click any cycle stage below to see how SubhraEdu bridges the classroom gaps.
            </p>
          </div>

          {/* Interactive Steps Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kolbStages.map((stage) => {
              const isSelected = activeStage === stage.key;
              const StageIcon = stage.icon;
              return (
                <button
                  key={stage.key}
                  onClick={() => setActiveStage(stage.key as KolbStage)}
                  className={`p-5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between aspect-[1.4] hover:shadow-md ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-orange-500 dark:border-orange-500 shadow-premium ring-2 ring-orange-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-400 hover:border-slate-350 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="text-[10px] font-black text-slate-400 tracking-wider">{stage.number}</span>
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-orange-500/10 text-orange-500' : 'bg-slate-100 dark:bg-slate-850 text-slate-400'
                    }`}>
                      <StageIcon className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <span className="text-xs font-black tracking-tight">{stage.label}</span>
                </button>
              );
            })}
          </div>

          {/* Detail Showcase of active cycle stage */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 shadow-premium">
            <AnimatePresence mode="wait">
              {kolbStages.map((stage) => {
                if (stage.key !== activeStage) return null;
                return (
                  <motion.div
                    key={stage.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                  >
                    <div className="lg:col-span-8 space-y-4">
                      <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-850 px-3 py-1 rounded-xl text-[10px] font-extrabold text-orange-600 dark:text-orange-400 uppercase tracking-widest">
                        Learning Stage {stage.number}
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                        {stage.title}
                      </h3>
                      <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                        {stage.description}
                      </p>
                    </div>

                    <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-850 space-y-2 text-center">
                      <span className="block text-2xl font-black text-orange-600 dark:text-orange-400 tracking-tight leading-none">
                        {stage.metric}
                      </span>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-normal max-w-[200px] mx-auto">
                        {stage.metricDesc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE SANDBOX LAB EXPERIMENT */}
      <section className="py-20 max-w-7xl mx-auto px-6 text-left">
        <div className="space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest font-black">Active Virtual Sandbox</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Interactive Educational Simulators
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Experience the hands-on portal student view. Toggle between the Chemistry Beaker lab and the Physics Gravity Orbit simulator.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Toggle Simulator controls left */}
            <div className="lg:col-span-4 space-y-4">
              <button 
                onClick={() => setActiveSandbox('chemistry')}
                className={`w-full p-5 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-4 hover:shadow-sm ${
                  activeSandbox === 'chemistry'
                    ? 'bg-white dark:bg-slate-900 border-orange-500 dark:border-orange-500 shadow-premium ring-2 ring-orange-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-400'
                }`}
              >
                <div className="h-9 w-9 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                  🧪
                </div>
                <div className="space-y-1">
                  <span className="block text-xs font-black text-slate-900 dark:text-white leading-none">Chemistry Beaker Sandbox</span>
                  <p className="text-[10px] font-semibold text-slate-400 leading-normal mt-0.5">Test acid-base litmus reagents and temperature bubbles.</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveSandbox('orbit')}
                className={`w-full p-5 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-4 hover:shadow-sm ${
                  activeSandbox === 'orbit'
                    ? 'bg-white dark:bg-slate-900 border-orange-500 dark:border-orange-500 shadow-premium ring-2 ring-orange-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-400'
                }`}
              >
                <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  🪐
                </div>
                <div className="space-y-1">
                  <span className="block text-xs font-black text-slate-900 dark:text-white leading-none">Physics Gravity & Orbit</span>
                  <p className="text-[10px] font-semibold text-slate-400 leading-normal mt-0.5">Vary planet mass and radial vectors to calculate orbital velocity.</p>
                </div>
              </button>
            </div>

            {/* Display active Sandbox Simulator */}
            <div className="lg:col-span-8 p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 flex flex-col justify-between aspect-[16/9] min-h-[350px] relative overflow-hidden shadow-inner">
              <AnimatePresence mode="wait">
                {activeSandbox === 'chemistry' ? (
                  <motion.div 
                    key="chemistry"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-center w-full border-b border-slate-200 dark:border-slate-855 pb-3 mb-4">
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Science Lab Simulator v3.2</span>
                      <span className="text-[10px] text-slate-400 font-bold">Status: {isReacting ? 'Reaction Active ⚗️' : 'Idle 🧪'}</span>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      {/* Interactive Beaker */}
                      <div className="flex justify-center items-center">
                        <div className="relative w-16 h-28 border-[5px] border-slate-700 rounded-b-2xl border-t-0 bg-slate-900/30 flex flex-col justify-end p-0.5 overflow-hidden">
                          <div className="absolute left-1 top-2 w-2 h-0.5 bg-slate-600" />
                          <div className="absolute left-1 top-6 w-3 h-0.5 bg-slate-600" />
                          <div className="absolute left-1 top-10 w-2 h-0.5 bg-slate-600" />
                          <div className="absolute left-1 top-14 w-3.5 h-0.5 bg-slate-600" />
                          <div className="absolute left-1 top-18 w-2 h-0.5 bg-slate-600" />
                          <div className="absolute left-1 top-22 w-3.5 h-0.5 bg-slate-600" />

                          {/* Liquid container */}
                          <div className={`w-full transition-all duration-700 rounded-b-xl relative ${chemicalColor}`} style={{ height: `${50 + (temperature/2)}%` }}>
                            {isReacting && (
                              <div className="absolute inset-0 bg-repeat-x flex justify-around items-end pb-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-white/50 animate-bounce" />
                                <span className="h-2 w-2 rounded-full bg-white/30 animate-bounce delay-75" />
                                <span className="h-1.5 w-1.5 rounded-full bg-white/40 animate-bounce delay-150" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Controls Panel */}
                      <div className="space-y-4 text-xs font-semibold text-left">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-0.5">
                            <span className="block text-[8px] text-slate-400 font-bold uppercase">Compound Mix</span>
                            <span className="font-extrabold text-slate-900 dark:text-white text-[12px]">{chemicalName}</span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="block text-[8px] text-slate-400 font-bold uppercase">PH Index</span>
                            <span className="font-black text-orange-500 text-[12px]">{phLevel.toFixed(1)}</span>
                          </div>
                        </div>

                        {/* Temperature Control */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-450">
                            <span>Temperature: {temperature}°C</span>
                            <span className="flex items-center gap-0.5">
                              <Thermometer className="h-3 w-3 text-red-500" />
                              {temperature >= 75 ? 'Boiling!' : temperature <= 25 ? 'Cold' : 'Warm'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={handleHeat}
                              disabled={isReacting}
                              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-[10px] text-white rounded-lg transition-colors cursor-pointer"
                            >
                              Heat (+25°C)
                            </button>
                            <button 
                              onClick={handleCool}
                              disabled={isReacting}
                              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-[10px] text-white rounded-lg transition-colors cursor-pointer"
                            >
                              Cool (-25°C)
                            </button>
                          </div>
                        </div>

                        {/* Reagents Buttons */}
                        <div className="space-y-1">
                          <span className="block text-[8.5px] text-slate-400 uppercase tracking-wider">Add Reagents</span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleMix('bg-purple-600/80', 'Litmus Alkaline Solution', 9.2)}
                              disabled={isReacting}
                              className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 text-[9.5px] text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer hover:bg-slate-50"
                            >
                              Alkali Reagent
                            </button>
                            <button 
                              onClick={() => handleMix('bg-rose-500/80', 'HCI Acid Reaction', 2.1)}
                              disabled={isReacting}
                              className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 text-[9.5px] text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer hover:bg-slate-50"
                            >
                              Acid Reagent
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="orbit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-center w-full border-b border-slate-200 dark:border-slate-855 pb-3 mb-4">
                      <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Physics Gravity Simulation</span>
                      <span className="text-[10px] text-slate-400 font-bold">Uptime Sync: Active 📡</span>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      {/* Graphic Orbit Circle */}
                      <div className="flex justify-center items-center relative h-36">
                        <div className="h-10 w-10 bg-amber-500 rounded-full blur-[2px] flex items-center justify-center font-black text-slate-900 text-xs">
                          SUN
                        </div>
                        {/* Orbit Path */}
                        <div 
                          className="absolute border border-dashed border-slate-700 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${planetDistance * 0.8}px`, 
                            height: `${planetDistance * 0.8}px` 
                          }}
                        />
                        {/* Rotating Planet */}
                        <motion.div 
                          className="absolute h-4.5 w-4.5 bg-blue-500 rounded-full flex items-center justify-center text-[7px] text-white font-bold"
                          style={{
                            originX: 0,
                            originY: 0,
                            x: (planetDistance * 0.4),
                          }}
                          animate={{ rotate: 360 }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: Math.max(10 - (orbitSpeed / 5), 1.5), 
                            ease: "linear" 
                          }}
                        >
                          E
                        </motion.div>
                      </div>

                      {/* Controls Sliders */}
                      <div className="space-y-4 text-xs font-semibold text-left">
                        <div className="grid grid-cols-3 gap-2 text-center bg-slate-900 border border-slate-855 p-2.5 rounded-xl text-white">
                          <div className="space-y-0.5">
                            <span className="block text-[7px] text-slate-500 font-bold uppercase">Distance</span>
                            <span className="font-extrabold text-[10px]">{planetDistance}M km</span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="block text-[7px] text-slate-500 font-bold uppercase">Mass</span>
                            <span className="font-extrabold text-[10px]">{planetMass} M⊕</span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="block text-[7px] text-slate-500 font-bold uppercase">Orbital Speed</span>
                            <span className="font-black text-orange-500 text-[10px]">{orbitSpeed} km/s</span>
                          </div>
                        </div>

                        {/* Distance Slider */}
                        <div className="space-y-1">
                          <label className="block text-[9px] text-slate-400 uppercase tracking-wider font-extrabold">Orbit Radius (Distance)</label>
                          <input 
                            type="range" 
                            min="80" 
                            max="220" 
                            value={planetDistance}
                            onChange={(e) => handleOrbitUpdate(parseInt(e.target.value), planetMass)}
                            className="w-full accent-orange-600 cursor-pointer h-1.5 rounded-lg bg-slate-200 dark:bg-slate-800"
                          />
                        </div>

                        {/* Mass Slider */}
                        <div className="space-y-1">
                          <label className="block text-[9px] text-slate-400 uppercase tracking-wider font-extrabold">Sun Mass Scale</label>
                          <input 
                            type="range" 
                            min="0.5" 
                            max="2.5" 
                            step="0.1"
                            value={planetMass}
                            onChange={(e) => handleOrbitUpdate(planetDistance, parseFloat(e.target.value))}
                            className="w-full accent-orange-600 cursor-pointer h-1.5 rounded-lg bg-slate-200 dark:bg-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* 6. CORE EXPERIENCE MODULES GRID */}
      <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-950/45 border-y border-slate-200/80 dark:border-slate-850/80 text-left">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest font-black">Curricular Deep Dive</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Virtual Labs, AR, and Immersive Field Trips
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
              Ditching passive text lists in favor of 3D virtual maps, augmented assets, and field explorations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Box 1 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 hover:border-orange-500/25 transition-all">
              <div className="h-10 w-10 bg-orange-500/10 text-orange-600 rounded-xl flex items-center justify-center">
                <Video className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Virtual Science & Math Labs</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                  Grades 3 to 9 can watch HD lab experiments conducted by expert educators. Video-based demonstrations (4 to 7 minutes) ensure conceptual grasp before physical trials, boosting safety.
                </p>
                <span className="inline-block text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-full">+30% Engagement Rate</span>
              </div>
            </div>

            {/* Box 2 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 hover:border-orange-500/25 transition-all">
              <div className="h-10 w-10 bg-rose-500/10 text-rose-600 rounded-xl flex items-center justify-center">
                <Layers className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Augmented Reality (AR) Assets</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                  Students inspect a fully interactive 3D representation of complex processes, such as real-time cardiac blood circulation flows or atomic nucleus structures.
                </p>
                <span className="inline-block text-[10px] font-black text-rose-600 dark:text-rose-455 bg-rose-500/5 px-2.5 py-1 rounded-full">PwC: +75% Memory Retention</span>
              </div>
            </div>

            {/* Box 3 */}
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 hover:border-orange-500/25 transition-all">
              <div className="h-10 w-10 bg-indigo-500/10 text-indigo-650 rounded-xl flex items-center justify-center">
                <Globe className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Virtual Field Trips & Maps</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                  Geographical concepts (rain patterns, topography, vectors) are explored virtually from the safety of the classroom, solving logistical, budget, and safety issues.
                </p>
                <span className="inline-block text-[10px] font-black text-indigo-650 dark:text-indigo-400 bg-indigo-500/5 px-2.5 py-1 rounded-full">Gates study: +32% Motivation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERDISCIPLINARY PBL CONNECTOR */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest font-black font-semibold">NCF 2023 Guidelines</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Interdisciplinary Project-Based Learning
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
              Modern school subjects cannot function in isolation. Aligned with NCF 2023 directives, SubhraEdu supports cross-subject collaborative assignments (PBL) and team-teaching modules.
            </p>

            {/* Interactive Subject Tabs */}
            <div className="flex gap-2.5 border-b border-slate-100 dark:border-slate-805 pb-2">
              {(['science', 'geography', 'social'] as const).map((node) => (
                <button
                  key={node}
                  onClick={() => setActiveNode(node)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all border ${
                    activeNode === node
                      ? 'bg-orange-600 border-orange-600 text-white shadow'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-805 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {node.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Dynamic Subject Details */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-855 space-y-4 font-semibold">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center">
                  <Play className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  {pblDetails[activeNode].title}
                </h4>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                {pblDetails[activeNode].desc}
              </p>
              <ul className="space-y-1.5 text-xs text-slate-650 dark:text-slate-450 font-bold">
                {pblDetails[activeNode].items.map((bullet, idx) => (
                  <li key={idx} className="flex gap-2 items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Visual Node Diagram Column */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative p-8 rounded-[36px] bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 w-full max-w-sm aspect-[1.1] flex flex-col justify-center items-center shadow-inner gap-4">
              <div className="text-[10px] font-bold text-slate-450 uppercase tracking-widest text-center border-b border-slate-200/60 dark:border-slate-800 pb-2 w-full absolute top-6">
                Active Project Connection
              </div>
              
              <div className="flex flex-col gap-6 items-center pt-6 relative z-10 w-full">
                {/* Science Node */}
                <div className={`px-4 py-2.5 rounded-xl border text-xs font-black transition-all flex items-center gap-2 ${
                  activeNode === 'science' ? 'bg-orange-600 border-orange-600 text-white scale-105 shadow-md' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-855 text-slate-500'
                }`}>
                  🧪 Science (Chemicals)
                </div>

                <div className="flex gap-8 justify-center items-center w-full">
                  {/* Geography Node */}
                  <div className={`px-4 py-2.5 rounded-xl border text-xs font-black transition-all flex items-center gap-2 ${
                    activeNode === 'geography' ? 'bg-orange-600 border-orange-600 text-white scale-105 shadow-md' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-855 text-slate-500'
                  }`}>
                    🗺️ Geography (Contours)
                  </div>
                  
                  {/* Social Studies Node */}
                  <div className={`px-4 py-2.5 rounded-xl border text-xs font-black transition-all flex items-center gap-2 ${
                    activeNode === 'social' ? 'bg-orange-600 border-orange-600 text-white scale-105 shadow-md' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-855 text-slate-500'
                  }`}>
                    📊 Social (Demographics)
                  </div>
                </div>
              </div>

              {/* Connecting vectors SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                <line x1="50" y1="40" x2="30" y2="65" stroke="#f97316" strokeWidth="0.8" strokeDasharray="3 3" className="opacity-40" />
                <line x1="50" y1="40" x2="70" y2="65" stroke="#f97316" strokeWidth="0.8" strokeDasharray="3 3" className="opacity-40" />
                <line x1="30" y1="65" x2="70" y2="65" stroke="#f97316" strokeWidth="0.8" strokeDasharray="3 3" className="opacity-40" />
              </svg>
            </div>
          </div>

        </div>
      </section>

      {/* 8. AI-POWERED ASSESSMENTS */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950/45 border-y border-slate-200/80 dark:border-slate-850/80 text-left">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 flex justify-center">
            {/* AI Custom Report Mockup Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-premium w-full max-w-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider">AI Report Card</span>
                <span className="text-[9px] font-bold text-slate-400">Class Grade 8</span>
              </div>

              <div className="space-y-3 font-semibold text-xs text-slate-650 dark:text-slate-400">
                <div className="flex justify-between items-center">
                  <span>Chemical Formula Mastery:</span>
                  <span className="text-emerald-500 font-extrabold">92% (Excellent)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Fluid Pressure Logic:</span>
                  <span className="text-emerald-500 font-extrabold">88% (Proficient)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Rain Contours Vector Analysis:</span>
                  <span className="text-amber-500 font-extrabold">74% (Review Needed)</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-orange-500/5 border border-orange-500/10 text-[11px] font-semibold leading-normal text-orange-700 dark:text-orange-400">
                💡 **Recommendation**: Try running the virtual Contour Elevation mapping inside the Geography Sandbox to clarify rain vectors.
              </div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-6">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest font-black">Continuous Improvement</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              AI-Powered Assessments & Reports
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
              AI-powered assessments allow students to practice and self-assess their learning, providing instant feedback on performance. With custom report cards, students receive personalized guidance on improving in specific structural areas that need review.
              <br /><br />
              According to IBM research, **90% of educators** using AI-driven assessments reported significant improvements in student outcomes. This saves time and allows students to learn at their own pace.
            </p>
          </div>
        </div>
      </section>

      {/* 9. CONCLUSION & DOWNLOAD BADGES */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-center">
        <div className="p-8 md:p-12 rounded-[32px] bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-950 dark:to-slate-900 border border-orange-150/40 dark:border-orange-900/30 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Bring Experiential Learning to Your School Today
          </h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Invest in SubhraEdu's Experiential Learning Portal today. Give your educators and students the immersive tools needed to build champions for life.
          </p>

          {/* Badges */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center font-semibold">
            {/* Play store badge */}
            <a 
              href="https://play.google.com/store/apps/details?id=com.entab.learninglab" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transform hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <div className="bg-slate-950 border border-slate-800 text-white rounded-2xl px-5 py-3 flex items-center gap-3 w-52 shadow-lg">
                <Play className="h-6 w-6 text-orange-500" />
                <div className="text-left leading-tight">
                  <span className="block text-[8px] text-slate-400 font-bold uppercase">Google Play</span>
                  <span className="block text-xs font-black">i² Experiential App</span>
                </div>
              </div>
            </a>

            {/* App store badge */}
            <a 
              href="https://apps.apple.com/in/app/entab-experiential-learning/id1611283814" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transform hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <div className="bg-slate-950 border border-slate-800 text-white rounded-2xl px-5 py-3 flex items-center gap-3 w-52 shadow-lg">
                <Globe className="h-6 w-6 text-amber-500" />
                <div className="text-left leading-tight">
                  <span className="block text-[8px] text-slate-400 font-bold uppercase">App Store</span>
                  <span className="block text-xs font-black">i² Experiential App</span>
                </div>
              </div>
            </a>
          </div>

          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-850/50 max-w-xs mx-auto">
            <Button 
              variant="outline" 
              size="md" 
              onClick={openDemoModal} 
              className="font-extrabold border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-slate-800 w-full"
            >
              Request For Demo
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
