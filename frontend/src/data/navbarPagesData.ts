import { 
  ShieldCheck, Smartphone, Lightbulb, Compass, Award, 
  Settings, Landmark, BookOpen, GraduationCap, BarChart3, 
  Truck, Users, Layout, MessageSquare, Briefcase, 
  Search, Target, Newspaper, Play, 
  Tv, FileText, Heart, History, Sparkles, Mic, CheckCircle,
  CreditCard
} from 'lucide-react';

export interface PageMetric {
  value: number;
  suffix: string;
  label: string;
}

export interface PageFeature {
  icon: any;
  title: string;
  desc: string;
}

export interface PageData {
  slug: string;
  category: 'platforms' | 'optimisation' | 'success-stories' | 'insights' | 'about';
  title: string;
  subtitle: string;
  description: string;
  gradient: string; // Tailwind gradient classes
  accentColor: string; // hex or tailwind text class
  metrics: PageMetric[];
  features: PageFeature[];
  highlightTitle: string;
  highlightText: string;
}

export const navbarPagesData: Record<string, PageData> = {
  // --- PLATFORMS ---
  'subhraedu-one': {
    slug: 'subhraedu-one',
    category: 'platforms',
    title: 'SubhraEdu One',
    subtitle: 'The Ultimate All-in-One School Management System',
    description: 'SubhraEdu One is our flagship ERP built for modern school chains. It integrates admissions, fee collection, grade book management, and security infrastructure into a single, lightning-fast cloud console.',
    gradient: 'from-blue-600 via-sky-700 to-indigo-850',
    accentColor: 'text-school-blue',
    metrics: [
      { value: 98, suffix: '%', label: 'Migration Speed' },
      { value: 45, suffix: 'min', label: 'Daily Saved / Staff' },
      { value: 99.99, suffix: '%', label: 'Ecosystem Uptime' }
    ],
    features: [
      { icon: ShieldCheck, title: 'Ironclad Data Security', desc: 'Bank-grade database encryption and multi-tenant isolation protocols.' },
      { icon: Settings, title: 'Modular Architecture', desc: 'Activate or scale modules instantly depending on student strength.' },
      { icon: Landmark, title: 'Fee Gateway Hub', desc: 'Secure debit/credit card pipelines, automatic ledgers, and cash registers.' },
      { icon: Users, title: 'Identity Registry', desc: 'Centralized profiles for students, parents, teachers, and security teams.' }
    ],
    highlightTitle: 'Enterprise-Grade Centralization',
    highlightText: 'Whether you run a single neighborhood academy or an international group of 50+ campuses, SubhraEdu One synthesizes all active databases under a single secure login.'
  },
  'campuscloud-10x': {
    slug: 'campuscloud-10x',
    category: 'platforms',
    title: 'CampusCloud 10X',
    subtitle: 'Next-Gen Cognitive Learning & Management Console',
    description: 'Empower administrators with CampusCloud 10X. By embedding cognitive insights and predictive analysis directly into student records, it assists principals in flagging learning gaps and optimizing resources.',
    gradient: 'from-[#138D75] via-teal-700 to-emerald-900',
    accentColor: 'text-school-green',
    metrics: [
      { value: 10, suffix: 'X', label: 'Operational Efficiency' },
      { value: 35, suffix: '%', label: 'Reduced Administrative Overhead' },
      { value: 94, suffix: '%', label: 'Parent Engagement Score' }
    ],
    features: [
      { icon: BarChart3, title: 'Predictive GPA Index', desc: 'Leverages historical test curves to forecast student learning trajectories.' },
      { icon: Lightbulb, title: 'Resource Optimisation', desc: 'Smart room allocations, classroom scheduler audits, and teacher loads.' },
      { icon: Landmark, title: 'Smart Financials', desc: 'Fully automated invoicing cycles and automated late fee triggers.' },
      { icon: GraduationCap, title: 'Academics Planner', desc: 'Dynamic lesson planners, exam schedulers, and gradecard templates.' }
    ],
    highlightTitle: 'Cognitive Insight Engines',
    highlightText: 'We went beyond simple spreadsheet registers. CampusCloud 10X uses advanced pattern recognition to warn coordinators of student performance declines before they occur.'
  },
  'mobile-apps': {
    slug: 'mobile-apps',
    category: 'platforms',
    title: 'Mobile Apps Suite',
    subtitle: 'Stay Connected Anytime, Anywhere',
    description: 'Beautiful, native iOS and Android apps custom-built for Parents, Teachers, Students, and School Directors. Stay in sync with push notifications, bus tracking, and immediate payment checkouts.',
    gradient: 'from-purple-600 via-indigo-700 to-slate-900',
    accentColor: 'text-purple-500',
    metrics: [
      { value: 4.8, suffix: '★', label: 'App Store Rating' },
      { value: 120, suffix: 'K+', label: 'Active Daily Users' },
      { value: 1.2, suffix: 's', label: 'Push Alert Dispatch' }
    ],
    features: [
      { icon: Smartphone, title: 'Native Performance', desc: 'Smooth touch gestures, offline data caching, and biometrics login.' },
      { icon: MessageSquare, title: 'Classroom Direct Chat', desc: 'Secure communication channels between parents and subject educators.' },
      { icon: Compass, title: 'GPS Bus Route Map', desc: 'Live geo-fencing and estimated arrival timers for student transport.' },
      { icon: Award, title: 'Digital Badge Vault', desc: 'Real-time report cards, library catalogs, and homework logs.' }
    ],
    highlightTitle: 'Real-Time Notification Pipeline',
    highlightText: 'Never miss an emergency notice or fee invoice. Our push pipeline dispatches notices to student devices in less than 1.5 seconds.'
  },
  'experiential-learning': {
    slug: 'experiential-learning',
    category: 'platforms',
    title: 'Experiential Learning Portal',
    subtitle: 'Hands-on Digital Lab & Creative Hub',
    description: 'Transform traditional classrooms into sandbox labs. The Experiential Learning Portal features simulation assets, virtual science sandboxes, and gamified quiz systems to boost student focus.',
    gradient: 'from-orange-550 via-red-600 to-amber-900',
    accentColor: 'text-orange-550',
    metrics: [
      { value: 85, suffix: '%', label: 'Student Retention Rise' },
      { value: 140, suffix: 'K+', label: 'Interactive Sandbox Labs' },
      { value: 3, suffix: 'X', label: 'Engagement Multiplier' }
    ],
    features: [
      { icon: Lightbulb, title: 'Virtual Simulator Labs', desc: 'Interactive physics, chemistry, and biology test models.' },
      { icon: Target, title: 'Gamified Skill Badges', desc: 'Encourage students to unlock levels as they master core skills.' },
      { icon: BookOpen, title: 'Experiential Library', desc: 'A rich media repository containing video walkthroughs and 3D maps.' },
      { icon: Sparkles, title: 'AI Sandbox Mentor', desc: 'Automated digital helper providing clues to students during experiment runs.' }
    ],
    highlightTitle: 'Hands-On Knowledge Retrieval',
    highlightText: 'By giving students visual and interactive controls instead of text formulas, they retain structural science concepts 3X more effectively.'
  },
  'pre-school-management': {
    slug: 'pre-school-management',
    category: 'platforms',
    title: 'Pre-School Management Platform',
    subtitle: 'Early Education Administration Made Simple',
    description: 'Nurture early education with specialized tracking tools. Build developmental reports, schedule meal planners, track nap times, and share baby step photo timelines with parents instantly.',
    gradient: 'from-pink-500 via-rose-600 to-red-800',
    accentColor: 'text-pink-500',
    metrics: [
      { value: 100, suffix: '%', label: 'Peace of Mind Rating' },
      { value: 50, suffix: 'K+', label: 'Happy Toddlers Tracked' },
      { value: 20, suffix: 'min', label: 'Saved on Daily Checklists' }
    ],
    features: [
      { icon: Heart, title: 'Development Tracker', desc: 'Log motor skills, vocabulary growth, and social milestones.' },
      { icon: Compass, title: 'Activity Planners', desc: 'Visual schedules for music, play times, and story circles.' },
      { icon: Smartphone, title: 'Instant Photo Broadcast', desc: 'Share secure snapshots of toddler activities directly with guardians.' },
      { icon: ShieldCheck, title: 'Allergen & Health Log', desc: 'Monitors dietary restrictions, nap intervals, and medical charts.' }
    ],
    highlightTitle: 'Dedicated Early Education Portal',
    highlightText: 'We understand that early education requires a softer, more visual touch. Our Pre-School system balances complex safety registers with family sharing features.'
  },

  // --- SCHOOL OPTIMISATION ---
  'administration': {
    slug: 'administration',
    category: 'optimisation',
    title: 'School Administration Core',
    subtitle: 'Smooth Operational Control Desk',
    description: 'Centralize operations from one central dashboard. Admin Core handles multiple branches, staff rotas, database permissions, and institutional compliance checks.',
    gradient: 'from-slate-700 via-slate-800 to-slate-950',
    accentColor: 'text-slate-700',
    metrics: [
      { value: 100, suffix: '%', label: 'Paperless Administration' },
      { value: 12, suffix: 'hrs', label: 'Weekly Coordinator Time Saved' },
      { value: 0, suffix: 'Errors', label: 'Compliance Ledger Faults' }
    ],
    features: [
      { icon: Settings, title: 'Multi-Branch Master Sync', desc: 'Update policy documents and parameters across all campuses globally.' },
      { icon: Briefcase, title: 'Staff Rota Schedulers', desc: 'Manage teachers schedules, substitute logs, and office rotas.' },
      { icon: ShieldCheck, title: 'Audit Trail Logs', desc: 'Detailed tracking of data changes, staff logins, and file exports.' },
      { icon: FileText, title: 'Regulatory Compliance', desc: 'One-click generation of government data sheets and registration forms.' }
    ],
    highlightTitle: 'Institutional Control System',
    highlightText: 'Take command of your school system with robust permission profiles. Securely delegate tasks to coordinators, office clerks, and security personnel.'
  },
  'finance': {
    slug: 'finance',
    category: 'optimisation',
    title: 'Finance & Ledger System',
    subtitle: 'Transparent, Automated Cash Flow Control',
    description: 'Optimise school revenue collection. Automated fee invoicing, multi-gateway online checkouts, employee salaries, and balance sheets are managed automatically.',
    gradient: 'from-green-600 via-emerald-700 to-slate-900',
    accentColor: 'text-[#138D75]',
    metrics: [
      { value: 14, suffix: '%', label: 'Revenue Recovery Boost' },
      { value: 98.4, suffix: '%', label: 'Online Payment Rate' },
      { value: 10, suffix: 'min', label: 'Auditor Reconciliation' }
    ],
    features: [
      { icon: Landmark, title: 'Ledger Automation', desc: 'Invoices auto-generate based on student grades, transport routes, and discounts.' },
      { icon: CreditCard, title: 'Multi-Gateway Pipeline', desc: 'Supports credit/debit cards, net banking, and digital wallets.' },
      { icon: Briefcase, title: 'Payroll Integration', desc: 'Integrate employee salaries, tax deductions, and expense claims.' },
      { icon: BarChart3, title: 'Cash Flow Projection', desc: 'AI-generated reports showing outstanding dues and expected collections.' }
    ],
    highlightTitle: 'Paperless Revenue Pipelines',
    highlightText: 'Ditch manual cash receipting. Our Finance suite automatically balances ledgers, sends reminders, and compiles audit records for end-of-year tax declarations.'
  },
  'learning': {
    slug: 'learning',
    category: 'optimisation',
    title: 'Learning Management System (LMS)',
    subtitle: 'Dynamic Virtual Classroom & Video Gateway',
    description: 'Empower virtual learning. Host live lectures, upload digital syllabus files, grade interactive quizzes, and track lecture attendance from a single clean screen.',
    gradient: 'from-[#0A4D8C] via-indigo-800 to-sky-950',
    accentColor: 'text-school-blue',
    metrics: [
      { value: 150, suffix: 'K+', label: 'Active Live Lectures' },
      { value: 92, suffix: '%', label: 'Student Completion Rate' },
      { value: 14, suffix: 'GB', label: 'Free Lesson Storage / Staff' }
    ],
    features: [
      { icon: Tv, title: 'Virtual Live Classrooms', desc: 'Seamlessly host lectures with integrated whiteboard layouts.' },
      { icon: BookOpen, title: 'Syllabus Organizer', desc: 'Categorize lessons, upload PDFs, slides, and video chapters.' },
      { icon: Award, title: 'Smart Grade Assessments', desc: 'Build interactive multiple-choice tests with automated grading.' },
      { icon: MessageSquare, title: 'Peer Study Channels', desc: 'Supervised group chats for group projects and topic discussions.' }
    ],
    highlightTitle: 'Interactive Classroom Software',
    highlightText: 'A beautiful, clean dashboard designed to remove digital fatigue. Teachers can launch courses and students can complete lessons with no technical friction.'
  },
  'academics': {
    slug: 'academics',
    category: 'optimisation',
    title: 'Academics & Lesson Matrix',
    subtitle: 'Structured Curriculum & Performance Core',
    description: 'Academics core helps coordinators structure course frameworks, design syllabi, track textbook progress, and monitor grading curves across departments.',
    gradient: 'from-amber-600 via-orange-700 to-yellow-950',
    accentColor: 'text-amber-600',
    metrics: [
      { value: 100, suffix: '%', label: 'Syllabus Mapping' },
      { value: 4.8, suffix: '/5.0', label: 'Academics Quality Rating' },
      { value: 85, suffix: '%', label: 'Resource Utilization' }
    ],
    features: [
      { icon: GraduationCap, title: 'Curriculum Builder', desc: 'Plan course syllabi, set objectives, and assign textbook chapters.' },
      { icon: BookOpen, title: 'Lesson Plan Audits', desc: 'Track daily teaching progress against planned school milestones.' },
      { icon: BarChart3, title: 'Department Metrics', desc: 'Compare grade curves across classrooms, teachers, and regions.' },
      { icon: Award, title: 'Student Achievement Tracker', desc: 'Recognize co-curricular awards, honors rolls, and athletic files.' }
    ],
    highlightTitle: 'Syllabus Alignment Systems',
    highlightText: 'Structure school curricula with precision. Map lesson objectives to board requirements and monitor textbook progress in real time.'
  },
  'intelligence': {
    slug: 'intelligence',
    category: 'optimisation',
    title: 'Intelligence & Analytics Hub',
    subtitle: 'Data-Driven AI Decision Portal',
    description: 'Transform records into actionable decisions. The Intelligence Hub uses advanced forecasting to alert staff of student drop-out risks, fee defaulters, and supply demands.',
    gradient: 'from-cyan-600 via-sky-700 to-indigo-950',
    accentColor: 'text-cyan-500',
    metrics: [
      { value: 98.2, suffix: '%', label: 'Prediction Accuracy' },
      { value: 45, suffix: '%', label: 'Reduced Student Attrition' },
      { value: 5, suffix: 's', label: 'Insight Report Generation' }
    ],
    features: [
      { icon: Sparkles, title: 'AI Predictive Insights', desc: 'Identifies behavioral changes and academic patterns before they trigger risk.' },
      { icon: BarChart3, title: 'Interactive Powerboards', desc: 'Customizable graphs, pie charts, and collection maps.' },
      { icon: Landmark, title: 'Cash Flow Forecasts', desc: 'Predictive fee calculations to support budget planning.' },
      { icon: Settings, title: 'System Diagnostics', desc: 'Monitors database access patterns, query performance, and user traffic.' }
    ],
    highlightTitle: 'Predictive School Management',
    highlightText: 'Ditch lagging retrospective reports. Our cognitive algorithms continuously parse data inputs to provide actionable alerts for administrators.'
  },
  'logistics': {
    slug: 'logistics',
    category: 'optimisation',
    title: 'Logistics & Asset Ledger',
    subtitle: 'Flawless Supply Chain & Inventory Control',
    description: 'Optimise physical resources. From classroom desks and laboratory supplies to cafeteria stock and uniforms, monitor real-time stock levels and trigger automated order requests.',
    gradient: 'from-amber-700 via-zinc-800 to-neutral-950',
    accentColor: 'text-slate-600',
    metrics: [
      { value: 100, suffix: '%', label: 'Inventory Auditing' },
      { value: 30, suffix: '%', label: 'Decreased Supply Waste' },
      { value: 24, suffix: 'hr', label: 'Reorder Fulfillment Time' }
    ],
    features: [
      { icon: Truck, title: 'Live Inventory Logs', desc: 'Track classroom equipment, library books, and sports assets.' },
      { icon: Settings, title: 'Automated Reorder Limits', desc: 'Triggers supplier email requests when stock drops below threshold.' },
      { icon: Landmark, title: 'Cafeteria POS System', desc: 'Cashless student checkout logs linked to parent wallets.' },
      { icon: ShieldCheck, title: 'Maintenance Schedules', desc: 'Auto-flags school bus checkups and campus equipment cycles.' }
    ],
    highlightTitle: 'Zero-Leakage Resource Control',
    highlightText: 'Keep campus operations running smoothly. Eliminate manual item registers and monitor inventory flow from intake to classroom assignment.'
  },
  'leadership-management': {
    slug: 'leadership-management',
    category: 'optimisation',
    title: 'Leadership & Management Desk',
    subtitle: 'High-Level Strategic Control Portal',
    description: 'Specifically engineered for School Boards, Trustees, and Principals. The Management Desk compiles multi-branch reports, budget summaries, and staff performance indexes.',
    gradient: 'from-slate-800 via-indigo-950 to-zinc-950',
    accentColor: 'text-slate-800',
    metrics: [
      { value: 100, suffix: '%', label: 'Strategic Alignment' },
      { value: 3.5, suffix: 'X', label: 'Board Meeting Prep Speedup' },
      { value: 99.8, suffix: '%', label: 'Budget Accuracy' }
    ],
    features: [
      { icon: BarChart3, title: 'Executive Summary Cards', desc: 'Real-time dashboard for admissions, revenues, and test indexes.' },
      { icon: Landmark, title: 'Global Budget Ledgers', desc: 'Track salary disbursements, operational costs, and investment plans.' },
      { icon: Briefcase, title: 'Staff Quality Scores', desc: 'Evaluate teacher performance based on class metrics and parent reviews.' },
      { icon: FileText, title: 'Compliance Reports', desc: 'Pre-formatted legal files for educational boards and tax authorities.' }
    ],
    highlightTitle: 'Strategic Oversight Tools',
    highlightText: 'Provide board members and principals with real-time strategic summaries. Remove manual Excel prep and lead board reviews with visual data.'
  },
  'enterprise-features': {
    slug: 'enterprise-features',
    category: 'optimisation',
    title: 'Enterprise Architecture Platform',
    subtitle: 'Robust Infrastructure for School Chains',
    description: 'Built for large-scale multi-campus operations. It integrates central active directories, load-balanced servers, custom API hooks, and regional data centers.',
    gradient: 'from-[#0A4D8C] via-slate-800 to-indigo-950',
    accentColor: 'text-school-blue',
    metrics: [
      { value: 50, suffix: 'k+', label: 'Concurrent Users Supported' },
      { value: 99.99, suffix: '%', label: 'Ecosystem SLA Uptime' },
      { value: 50, suffix: 'ms', label: 'Global API Response' }
    ],
    features: [
      { icon: Layout, title: 'Active Directory SSO', desc: 'SAML, OAuth2, and Google Workspace user single sign-on.' },
      { icon: ShieldCheck, title: 'Granular Access Policies', desc: 'Custom database permissions down to specific cells and files.' },
      { icon: Settings, title: 'Developer API Hub', desc: 'Connect third-party school software or external biometric gates.' },
      { icon: Compass, title: 'Multi-Region Datastores', desc: 'Data hosting in local regional nodes to guarantee latency compliance.' }
    ],
    highlightTitle: 'Scalable Cloud Foundations',
    highlightText: 'We host your records on state-of-the-art server infrastructure. Scale from 1,000 to 500,000 students without speed drops or data delays.'
  },
  'communication': {
    slug: 'communication',
    category: 'optimisation',
    title: 'Unified Communication Gateway',
    subtitle: 'Instant Multi-Channel Messaging Center',
    description: 'Ensure parents and teachers stay aligned. Dispatches bulk SMS campaigns, email templates, mobile app push alerts, and direct teacher-parent chat logs.',
    gradient: 'from-emerald-600 via-[#138D75] to-teal-900',
    accentColor: 'text-school-green',
    metrics: [
      { value: 99.98, suffix: '%', label: 'Delivery Success Rate' },
      { value: 1.2, suffix: 's', label: 'Emergency Broadcast Speed' },
      { value: 1.5, suffix: 'M+', label: 'Monthly Alerts Dispatched' }
    ],
    features: [
      { icon: MessageSquare, title: 'Automated Broadcasts', desc: 'Triggers SMS notices for student absences or emergency updates.' },
      { icon: FileText, title: 'HTML Newsletter Creator', desc: 'Build premium school announcements using drag-and-drop elements.' },
      { icon: Smartphone, title: 'In-App Direct Chat', desc: 'Encrypted communication lines keeping parent numbers private.' },
      { icon: Settings, title: 'Queue Priority Engine', desc: 'Ensures urgent weather alerts bypass standard message queues.' }
    ],
    highlightTitle: 'Instant Campus Broadcasting',
    highlightText: 'Keep parent and teacher directories aligned. Dispatch emergency notifications, homework boards, and general newsletters instantly.'
  },
  'human-resources': {
    slug: 'human-resources',
    category: 'optimisation',
    title: 'Human Resources & Payroll',
    subtitle: 'Sleek Employee Management Suite',
    description: 'Manage teachers and office staff profiles. Tracks employee attendance, lesson log cards, tax filings, paid leave balances, and salary disbursement pipelines.',
    gradient: 'from-rose-700 via-[#7B1E3A] to-zinc-950',
    accentColor: 'text-[#7B1E3A]',
    metrics: [
      { value: 100, suffix: '%', label: 'Payroll Accuracy' },
      { value: 18, suffix: '%', label: 'Reduced HR Overhead' },
      { value: 4, suffix: 'hr', label: 'Leave Audit Response' }
    ],
    features: [
      { icon: Users, title: 'Active Teacher Profiles', desc: 'Tracks employee certifications, classes assigned, and student scores.' },
      { icon: Landmark, title: 'Salary Slip Generator', desc: 'Calculates basic pay, allowances, deductions, and tax files.' },
      { icon: ShieldCheck, title: 'Biometric Attendance Sync', desc: 'Syncs teacher check-in times to payroll records.' },
      { icon: Briefcase, title: 'Recruitment Funnel', desc: 'Post teaching roles, screen applications, and log interviews.' }
    ],
    highlightTitle: 'Sleek Staff Operations',
    highlightText: 'Automate salary processing, tax records, and leave requests. Empower teachers with a self-service portal to submit leave claims and download salary statements.'
  },

  // --- SUCCESS STORIES ---
  'case-studies': {
    slug: 'case-studies',
    category: 'success-stories',
    title: 'Ecosystem Success Stories',
    subtitle: 'Proven Operational Transformations',
    description: 'Discover how schools and international school chains converted paper-heavy offices into streamlined, data-driven digital campuses with SubhraEdu.',
    gradient: 'from-indigo-600 via-blue-700 to-sky-900',
    accentColor: 'text-indigo-500',
    metrics: [
      { value: 1200, suffix: '+', label: 'Empowered Schools' },
      { value: 45, suffix: '%', label: 'Average Time Saved' },
      { value: 100, suffix: '%', label: 'Client Retention Rate' }
    ],
    features: [
      { icon: Landmark, title: 'St. Xavier International', desc: 'Automated fee collections across 5 campuses, saving 200 coordinator hours monthly.' },
      { icon: Award, title: 'Greenwood Academy Group', desc: 'Restructured their academics syllabus trackers, raising student GPA by 12%.' },
      { icon: ShieldCheck, title: 'Bright Future School Chain', desc: 'Integrated biometric attendance with parent SMS alerts to reduce absenteeism by 35%.' },
      { icon: Sparkles, title: 'Oakridge Prep Schools', desc: 'Implemented AI diagnostics, assisting principals in identifying learning delays.' }
    ],
    highlightTitle: 'Proven Transformation Metrics',
    highlightText: 'We do not just install software; we partner with your coordinators to build a tailored cloud dashboard. Our technical team guides data migration to prevent speed bumps.'
  },

  // --- INSIGHTS ---
  'coverage': {
    slug: 'coverage',
    category: 'insights',
    title: 'Press & Media Coverage',
    subtitle: 'SubhraEdu in the News',
    description: 'Explore press features, tech reviews, and news releases highlighting SubhraEdu’s contributions to educational technology and cloud software.',
    gradient: 'from-slate-600 via-slate-700 to-slate-900',
    accentColor: 'text-slate-500',
    metrics: [
      { value: 15, suffix: '+', label: 'National Press Features' },
      { value: 100, suffix: 'k+', label: 'Monthly Readers reached' },
      { value: 5, suffix: '★', label: 'Top EdTech Review Score' }
    ],
    features: [
      { icon: Newspaper, title: 'TechCrunch Spotlight', desc: 'Reviews our cloud multi-tenant architecture and data compliance.' },
      { icon: Tv, title: 'EdTech World News', desc: 'Feature coverage on our parent-teacher chat logs and bus route maps.' },
      { icon: FileText, title: 'Annual Industry Reports', desc: 'Ranked as a top classroom ERP solution for school chains.' },
      { icon: Sparkles, title: 'Developer Awards', desc: 'Recognized for building accessible, responsive school dashboards.' }
    ],
    highlightTitle: 'Industry-Standard Recognition',
    highlightText: 'Educators and technology reporters recognize SubhraEdu’s focus on page speed, security compliance, and premium design aesthetics.'
  },
  'video': {
    slug: 'video',
    category: 'insights',
    title: 'Video Library & Walkthroughs',
    subtitle: 'Visual Feature Guides & Tutorials',
    description: 'Watch video tutorials showing our ERP interface in action. Learn to generate invoices, set up databases, review grade curves, and manage library registers.',
    gradient: 'from-rose-600 via-red-700 to-rose-950',
    accentColor: 'text-red-500',
    metrics: [
      { value: 45, suffix: '+', label: 'Tutorial Videos' },
      { value: 100, suffix: '%', label: 'Self-Paced Guides' },
      { value: 10, suffix: 'min', label: 'Avg Learning Time' }
    ],
    features: [
      { icon: Play, title: 'Admin Setup Guides', desc: 'Step-by-step videos on adding student accounts and managing settings.' },
      { icon: Tv, title: 'Teacher Training Series', desc: 'Guides for grade cards, syllabus planners, and attendance records.' },
      { icon: Smartphone, title: 'Parent Mobile App Demo', desc: 'Shows payment gateways, chat channels, and GPS trackers.' },
      { icon: Search, title: 'Quick Feature Explanations', desc: 'Short 2-minute videos covering individual modules and updates.' }
    ],
    highlightTitle: 'Visual Learning System',
    highlightText: 'We believe in clean visual walkthroughs. Empower your staff to learn individual modules at their own pace using our HD tutorial catalog.'
  },
  'ed-talks': {
    slug: 'ed-talks',
    category: 'insights',
    title: 'Ed Talks Series',
    subtitle: 'Interviews with Educational Pioneers',
    description: 'Listen to podcast episodes and interviews with leading school principals, educational board members, and tech architects discussing modern school strategies.',
    gradient: 'from-amber-600 via-orange-700 to-stone-900',
    accentColor: 'text-orange-500',
    metrics: [
      { value: 25, suffix: '+', label: 'Host Podcast Episodes' },
      { value: 12, suffix: 'k+', label: 'Active Listeners' },
      { value: 4.9, suffix: '★', label: 'Apple Podcast Score' }
    ],
    features: [
      { icon: Mic, title: 'Digital Transformation Talks', desc: 'Principals discuss converting paper registers into online databases.' },
      { icon: Play, title: 'Future of Academics', desc: 'Educators discuss using AI metrics to catch learning delays early.' },
      { icon: ShieldCheck, title: 'Data Security Panel', desc: 'Privacy compliance officers discuss protecting student records.' },
      { icon: Users, title: 'Parent Engagement Panel', desc: 'Coordinators outline strategies to raise school-parent connection.' }
    ],
    highlightTitle: 'Leading the EdTech Conversation',
    highlightText: 'Stay informed on modern school management strategies. Listen to coordinators discuss practical approaches to digital transformation.'
  },
  'newsletter': {
    slug: 'newsletter',
    category: 'insights',
    title: 'Monthly EdTech Newsletter',
    subtitle: 'Tips for Modern Academies',
    description: 'Subscribe to our monthly newsletter. Get updates on tech trends, classroom ideas, lesson structures, and school audit checklists direct to your inbox.',
    gradient: 'from-[#138D75] via-teal-700 to-[#0A4D8C]',
    accentColor: 'text-[#138D75]',
    metrics: [
      { value: 8500, suffix: '+', label: 'School Subscribers' },
      { value: 42, suffix: '%', label: 'Average Email Open Rate' },
      { value: 100, suffix: '%', label: 'Free Resource Access' }
    ],
    features: [
      { icon: FileText, title: 'Classroom Audit Checklists', desc: 'Free PDF guides for end-of-year accounts and supply lists.' },
      { icon: Newspaper, title: 'Software Feature Updates', desc: 'Announcements on new modules, dashboard adjustments, and API tools.' },
      { icon: Lightbulb, title: 'Lesson Plan Guides', desc: 'Free strategies and templates to structure regional courses.' },
      { icon: Landmark, title: 'Fee Collection Tips', desc: 'Checklists to decrease late payments and structure payment schemes.' }
    ],
    highlightTitle: 'Empower School Office Staff',
    highlightText: 'Join thousands of principals and office coordinators. Get actionable school operational guides delivered on the first Tuesday of every month.'
  },
  'student-zone': {
    slug: 'student-zone',
    category: 'insights',
    title: 'Student Zone Portal',
    subtitle: 'Empowering Student Learning & Growth',
    description: 'A portal custom-made for students. Track personal test curves, view daily homework lists, request library books, and access interactive learning tools.',
    gradient: 'from-[#0A4D8C] via-violet-800 to-fuchsia-950',
    accentColor: 'text-school-blue',
    metrics: [
      { value: 96, suffix: '%', label: 'Homework Submission Rate' },
      { value: 4.8, suffix: '/5.0', label: 'Portal Usability Score' },
      { value: 120, suffix: 'k+', label: 'Active Study Folders' }
    ],
    features: [
      { icon: Layout, title: 'Personal Grade Boards', desc: 'Review your test curves and download report cards securely.' },
      { icon: BookOpen, title: 'Daily Homework Board', desc: 'Displays class syllabus deadlines, task details, and upload cards.' },
      { icon: Compass, title: 'School Bus Geo-Tracker', desc: 'Check bus location and estimated time to arrival in real time.' },
      { icon: Sparkles, title: 'Interactive Quizzes', desc: 'Study skills and complete practice exams to earn study badges.' }
    ],
    highlightTitle: 'Accessible Student Portals',
    highlightText: 'A modern, clean workspace that replaces messy paper sheets. Students can review schedules, upload tasks, and track performance in real time.'
  },
  'educator-zone': {
    slug: 'educator-zone',
    category: 'insights',
    title: 'Educator Zone Portal',
    subtitle: 'Sleek Tools for Classroom Teachers',
    description: 'Designed to simplify teacher admin tasks. Easily log class attendance, input exam grades, build lesson trackers, and send notes to parents.',
    gradient: 'from-teal-650 via-[#138D75] to-emerald-950',
    accentColor: 'text-school-green',
    metrics: [
      { value: 20, suffix: 'hrs', label: 'Saved on Administration / Month' },
      { value: 99.4, suffix: '%', label: 'Grade Input Speed' },
      { value: 100, suffix: '%', label: 'Digital Lesson Planners' }
    ],
    features: [
      { icon: CheckCircle, title: 'One-Click Attendance Register', desc: 'Record attendance and automatically notify guardians of student absences.' },
      { icon: Award, title: 'Grade Ledger Desk', desc: 'Input grades, calculate class averages, and export report cards.' },
      { icon: BookOpen, title: 'Curriculum Progress Log', desc: 'Record daily lessons and track syllabus goals against board standards.' },
      { icon: MessageSquare, title: 'Secure Parent Chat Channels', desc: 'Direct message channels to coordinate student assistance.' }
    ],
    highlightTitle: 'Simplify Teacher Administration',
    highlightText: 'Give teachers their time back. We replace slow spreadsheets and paper logs with a visual portal, allowing educators to focus on teaching.'
  },
  'educators-article': {
    slug: 'educators-article',
    category: 'insights',
    title: 'Educator Article Catalog',
    subtitle: 'Professional Teacher Articles & Strategies',
    description: 'Browse articles and classroom strategies written by school principals, child psychologists, and curriculum coordinators.',
    gradient: 'from-amber-600 via-stone-700 to-stone-900',
    accentColor: 'text-stone-500',
    metrics: [
      { value: 150, suffix: '+', label: 'Teacher Articles' },
      { value: 10, suffix: 'k+', label: 'Monthly Readers' },
      { value: 120, suffix: '+', label: 'Educator Writers' }
    ],
    features: [
      { icon: FileText, title: 'Classroom Control Articles', desc: 'Strategies to organize classrooms and coordinate group studies.' },
      { icon: Heart, title: 'Student Support Guides', desc: 'Articles on supporting student mental health and managing exam anxiety.' },
      { icon: Landmark, title: 'School Operations Trends', desc: 'Analyses of board regulations, funding profiles, and audit updates.' },
      { icon: Sparkles, title: 'AI in Classrooms', desc: 'How to use digital learning platforms to support student progress.' }
    ],
    highlightTitle: 'Collaborative Educational Library',
    highlightText: 'Our article vault compiles strategies and strategies from educational professionals to support teachers and principals.'
  },

  // --- ABOUT US ---
  'our-story': {
    slug: 'our-story',
    category: 'about',
    title: 'Our Story & Vision',
    subtitle: 'Connecting Technology with Modern Education',
    description: 'SubhraEdu was founded in West Bengal with a clear goal: replace slow school databases with high-speed, secure, and beautiful cloud dashboards.',
    gradient: 'from-[#0A4D8C] via-[#7B1E3A] to-slate-950',
    accentColor: 'text-[#0A4D8C]',
    metrics: [
      { value: 2018, suffix: '', label: 'Year Founded' },
      { value: 50, suffix: '+', label: 'Core Team Members' },
      { value: 200, suffix: 'M+', label: 'Database Records Secured' }
    ],
    features: [
      { icon: History, title: 'Our Educational Background', desc: 'Built by engineers and former school principals who understand admin bottlenecks.' },
      { icon: ShieldCheck, title: 'Security First Strategy', desc: 'Continuous security testing and server redundancy to protect student logs.' },
      { icon: Target, title: 'Clear Product Vision', desc: 'Provide premium, accessible, and fast tools for schools worldwide.' },
      { icon: Heart, title: 'Dedicated Customer Service', desc: 'We assist with onboarding, data migration, and provide 24/7 technical support.' }
    ],
    highlightTitle: 'A Partner in School Operations',
    highlightText: 'We do more than build databases. We provide the technical support and tools to help coordinators, teachers, and parents stay aligned.'
  }
};
