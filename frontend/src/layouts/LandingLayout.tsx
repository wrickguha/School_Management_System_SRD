import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Award, CheckCircle, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import apiClient from '../services/apiClient';

export const LandingLayout: React.FC = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoForm, setDemoForm] = useState({
    schoolName: '',
    contactName: '',
    email: '',
    phone: '',
    studentCount: '100-500'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeMega, setActiveMega] = useState<'solutions' | 'modules' | null>(null);

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/demo/request', {
        schoolName: demoForm.schoolName,
        contactName: demoForm.contactName,
        email: demoForm.email,
        phone: demoForm.phone,
        studentCount: demoForm.studentCount
      });
      setSubmitted(true);
      setTimeout(() => {
        setIsDemoModalOpen(false);
        setSubmitted(false);
        setDemoForm({ schoolName: '', contactName: '', email: '', phone: '', studentCount: '100-500' });
      }, 2000);
    } catch (err) {
      console.error('Failed to submit demo request:', err);
      alert('Failed to submit demo request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Utility Bar */}
      <div className="hidden lg:block w-full bg-[#e6f4fc] dark:bg-slate-950/80 border-b border-sky-100 dark:border-slate-800 text-[11px] font-semibold text-slate-650 dark:text-slate-400 py-2.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              Sales: <a href="tel:+917478727864" className="hover:underline font-bold text-[#0A4D8C] dark:text-sky-400">+91 74787 27864</a>
            </span>
            <span className="flex items-center gap-1.5">
              Parent Help Desk: <a href="mailto:parentdesk@subhraedu.com" className="hover:underline font-bold text-[#0A4D8C] dark:text-sky-400">parentdesk@subhraedu.com</a>
            </span>
            <span className="flex items-center gap-1.5">
              <a href="mailto:info@subhraedu.com" className="hover:underline font-bold text-[#0A4D8C] dark:text-sky-400">info@subhraedu.com</a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Follow Us:</span>
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <a href="#" className="hover:text-school-blue">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-school-blue">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-school-blue">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.65-.07 4.85-.07M12 2C8.74 2 8.33 2.01 7.05 2.07 2.7 2.27 2.27 2.71 2.07 7.05 2.01 8.33 2 8.74 2 12s.01 3.67.07 4.95c.2 4.34.63 4.78 4.98 4.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 4.78-.63 4.98-4.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.34-.63-4.78-4.98-4.98C15.67 2.01 15.26 2 12 2zm0 4.86c-2.84 0-5.14 2.3-5.14 5.14s2.3 5.14 5.14 5.14 5.14-2.3 5.14-5.14-2.3-5.14-5.14-5.14zm0 8.64c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5zm5.35-8.77c-.69 0-1.26.57-1.26 1.27a1.27 1.27 0 0 0 1.27 1.27c.69 0 1.26-.57 1.26-1.27a1.27 1.27 0 0 0-1.27-1.27z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-school-blue">
                <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-school-blue">
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.5 6.6a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.5A3 3 0 0 0 .5 6.6C0 8.5 0 12 0 12s0 3.5.5 5.4a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.4.5-5.4s0-3.5-.5-5.4zm-13.8 8.4V9l6 3-6 3z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header 
        className="sticky top-0 z-45 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md"
        onMouseLeave={() => setActiveMega(null)}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/subhraedu_logo.png" alt="SubhraEdu Logo" className="h-14 w-auto object-contain group-hover:scale-[1.03] transition-transform duration-300" />
          </Link>

          {/* Navigation Links with dropdown indicators */}
          <nav className="hidden md:flex items-center gap-7 h-full">
            <div 
              className="h-full flex items-center"
              onMouseEnter={() => setActiveMega('solutions')}
            >
              <button className="flex items-center gap-1.5 text-sm font-bold text-slate-750 dark:text-slate-300 hover:text-[#0A4D8C] dark:hover:text-sky-400 transition-colors cursor-pointer py-4">
                <span>Platforms</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-305 ${activeMega === 'solutions' ? 'rotate-180 text-school-blue' : ''}`} />
              </button>
            </div>

            <div 
              className="h-full flex items-center"
              onMouseEnter={() => setActiveMega('modules')}
            >
              <button className="flex items-center gap-1.5 text-sm font-bold text-slate-750 dark:text-slate-300 hover:text-[#0A4D8C] dark:hover:text-sky-400 transition-colors cursor-pointer py-4">
                <span>School Optimisation</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-305 ${activeMega === 'modules' ? 'rotate-180 text-school-blue' : ''}`} />
              </button>
            </div>

            <div className="h-full flex items-center">
              <a href="#testimonials" className="flex items-center gap-1.5 text-sm font-bold text-slate-750 dark:text-slate-300 hover:text-[#0A4D8C] dark:hover:text-sky-400 transition-colors py-4">
                <span>Success Stories</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </a>
            </div>

            <div className="h-full flex items-center">
              <a href="#case-studies" className="flex items-center gap-1.5 text-sm font-bold text-slate-750 dark:text-slate-300 hover:text-[#0A4D8C] dark:hover:text-sky-400 transition-colors py-4">
                <span>Insights</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </a>
            </div>

            <div className="h-full flex items-center">
              <a href="#footer" className="flex items-center gap-1.5 text-sm font-bold text-slate-750 dark:text-slate-300 hover:text-[#0A4D8C] dark:hover:text-sky-400 transition-colors py-4">
                <span>About Us</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </a>
            </div>

            <div className="h-full flex items-center">
              <button 
                onClick={() => setIsDemoModalOpen(true)}
                className="text-sm font-bold text-slate-750 dark:text-slate-300 hover:text-[#0A4D8C] dark:hover:text-sky-400 transition-colors cursor-pointer py-4"
              >
                Contact Us
              </button>
            </div>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-bold text-slate-700 dark:text-slate-300">Sign In</Button>
            </Link>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => setIsDemoModalOpen(true)} 
              className="font-bold bg-[#0A4D8C] hover:bg-[#083D70] border-none text-white text-[11px] tracking-wider rounded-lg px-5 py-2.5 uppercase transition-all"
            >
              REGISTER FOR DEMO
            </Button>
          </div>

          {/* Mega Menu Dropdowns */}
          {activeMega === 'solutions' && (
            <div 
              className="absolute left-0 right-0 top-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-premium transition-all duration-300 z-50 p-8 grid grid-cols-3 gap-8"
              onMouseEnter={() => setActiveMega('solutions')}
            >
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">By Institution Role</h4>
                <div className="space-y-3">
                  <Link to="/login" className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <span className="text-lg">🎓</span>
                    <div>
                      <span className="text-xs font-bold block text-slate-800 dark:text-white">Principal View</span>
                      <span className="text-[10px] text-slate-450 block">Oversight, audits, trends, calendar checks</span>
                    </div>
                  </Link>
                  <Link to="/login" className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <span className="text-lg">✍️</span>
                    <div>
                      <span className="text-xs font-bold block text-slate-800 dark:text-white">Teacher Command Portal</span>
                      <span className="text-[10px] text-slate-450 block">Quick attendance checks, marks uploads, homework posting</span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">For Families</h4>
                <div className="space-y-3">
                  <Link to="/login" className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <span className="text-lg">🏡</span>
                    <div>
                      <span className="text-xs font-bold block text-slate-800 dark:text-white">Parent Portal</span>
                      <span className="text-[10px] text-slate-450 block">Grade review checks, 3-click fee checks, live bus alerts</span>
                    </div>
                  </Link>
                  <Link to="/login" className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <span className="text-lg">🎒</span>
                    <div>
                      <span className="text-xs font-bold block text-slate-800 dark:text-white">Student Hub</span>
                      <span className="text-[10px] text-slate-450 block">Assignment logs, exam calendars, report card archives</span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">Core SaaS Infrastructure</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-school-blue/5 rounded-2xl border border-school-blue/10 space-y-2">
                    <span className="text-[10px] font-bold text-school-blue uppercase tracking-wider block">Enterprise Grade Cloud</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold text-left">
                      SubhraEdu leverages robust microservices to support multiple tenant campus schools with 99.98% SLA and unified central databases.
                    </p>
                    <button onClick={() => setIsDemoModalOpen(true)} className="text-[10px] font-extrabold text-school-blue hover:underline cursor-pointer block">
                      Schedule Guided Tour →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modules Showcase Mega Menu */}
          {activeMega === 'modules' && (
            <div 
              className="absolute left-0 right-0 top-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-premium transition-all duration-300 z-50 p-8 grid grid-cols-4 gap-6 text-left"
              onMouseEnter={() => setActiveMega('modules')}
            >
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block border-b border-slate-100 dark:border-slate-800 pb-1.5">Academics</span>
                <ul className="space-y-2 text-xs font-bold">
                  <li><a href="#features" className="hover:text-school-blue flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40">📚 Student Profiles (SIS)</a></li>
                  <li><a href="#features" className="hover:text-school-blue flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40">📅 Attendance Tracker</a></li>
                  <li><a href="#features" className="hover:text-school-blue flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40">📝 Homework Planners</a></li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block border-b border-slate-100 dark:border-slate-800 pb-1.5">Administration</span>
                <ul className="space-y-2 text-xs font-bold">
                  <li><a href="#features" className="hover:text-school-blue flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40">🏫 Online Admissions</a></li>
                  <li><a href="#features" className="hover:text-school-blue flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40">💳 Fee & Bills Portal</a></li>
                  <li><a href="#features" className="hover:text-school-blue flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40">💼 HR & Staff Payroll</a></li>
                </ul>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block border-b border-slate-100 dark:border-slate-800 pb-1.5">Campus Services</span>
                <ul className="space-y-2 text-xs font-bold">
                  <li><a href="#features" className="hover:text-school-blue flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40">🚌 Fleet Route Trackers</a></li>
                  <li><a href="#features" className="hover:text-school-blue flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40">📖 Smart Library shelf</a></li>
                  <li><a href="#features" className="hover:text-school-blue flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40">🏠 Hostels & Housing</a></li>
                </ul>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block border-b border-slate-100 dark:border-slate-800 pb-1.5">Analytics & Comms</span>
                <ul className="space-y-2 text-xs font-bold">
                  <li><a href="#features" className="hover:text-school-blue flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40">📊 AI Analytics diagnostics</a></li>
                  <li><a href="#features" className="hover:text-school-blue flex items-center gap-1.5 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40">💬 Announcement Center</a></li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        {/* Pass down callback to allow child pages (like Hero or Pricing) to trigger the global Demo Modal */}
        <Outlet context={{ openDemoModal: () => setIsDemoModalOpen(true) }} />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-premium border border-slate-100 hover:scale-[1.03] transition-all duration-300 inline-block max-w-max">
              <img src="/subhraedu_logo.png" alt="SubhraEdu Logo" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering global schools with premium, enterprise-grade academic administration, financial operations, and real-time learning analytics.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-school-blue flex items-center justify-center text-white transition-colors">
                <Award className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Core Features</a></li>
              <li><a href="#modules" className="hover:text-white transition-colors">All Modules</a></li>
              <li><Link to="/login" className="hover:text-white transition-colors">ERP Dashboard Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Contact Us</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-school-blue mt-0.5 shrink-0" />
                <span>SRD Technologies India, Kulsum Complex,<br />Bagdogra, West Bengal</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-school-blue" /> +91 7478727864
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-school-blue" /> info@subhraedu.com
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Ready to Transform?</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Schedule a personalized walkthrough with our product architects today.
            </p>
            <Button variant="primary" size="md" className="w-full" onClick={() => setIsDemoModalOpen(true)}>
              Request Demo Now
            </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 SubhraEdu. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">SLA Agreement</a>
          </div>
        </div>
      </footer>

      {/* Global Request Demo Modal */}
      <Modal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} title="Schedule custom ERP walkthrough">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 bg-school-green/10 rounded-full flex items-center justify-center text-school-green mb-4">
              <CheckCircle className="h-10 w-10 animate-bounce" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Walkthrough Scheduled!</h4>
            <p className="text-sm text-slate-500 mt-2 max-w-xs">
              One of our educational technology architects will contact you in the next 12 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleDemoSubmit} className="space-y-5">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Provide your school details and our system architect will deploy a customized sandboxed instance for your review.
            </p>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Institution/School Name</label>
              <input
                type="text"
                required
                value={demoForm.schoolName}
                onChange={(e) => setDemoForm({ ...demoForm, schoolName: e.target.value })}
                placeholder="e.g. St. Xavier International Academy"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Person</label>
                <input
                  type="text"
                  required
                  value={demoForm.contactName}
                  onChange={(e) => setDemoForm({ ...demoForm, contactName: e.target.value })}
                  placeholder="e.g. Dr. Robert Vance"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Strength</label>
                <select
                  value={demoForm.studentCount}
                  onChange={(e) => setDemoForm({ ...demoForm, studentCount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
                >
                  <option value="100-500">100 - 500 Students</option>
                  <option value="500-1500">500 - 1500 Students</option>
                  <option value="1500-5000">1500 - 5000 Students</option>
                  <option value="5000+">5000+ Students</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Work Email Address</label>
                <input
                  type="email"
                  required
                  value={demoForm.email}
                  onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                  placeholder="robert.vance@school.edu"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Number</label>
                <input
                  type="tel"
                  required
                  value={demoForm.phone}
                  onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                  placeholder="+1 (555) 012-3456"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsDemoModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                Schedule Walkthrough
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
