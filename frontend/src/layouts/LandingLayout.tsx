import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Award, CheckCircle, ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [activeDropdown, setActiveDropdown] = useState<'platforms' | 'schoolOptimisation' | 'successStories' | 'insights' | 'aboutUs' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<'platforms' | 'schoolOptimisation' | 'successStories' | 'insights' | 'aboutUs' | null>(null);

  const toggleMobileSection = (section: 'platforms' | 'schoolOptimisation' | 'successStories' | 'insights' | 'aboutUs') => {
    setExpandedMobileSection(prev => prev === section ? null : section);
  };

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
      <div className="hidden lg:block w-full bg-[#e6f4fc] dark:bg-slate-955/80 border-b border-sky-100 dark:border-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400 py-2.5 px-6">
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
        className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md"
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/subhraedu_logo.png" alt="SubhraEdu Logo" className="h-14 w-auto object-contain group-hover:scale-[1.03] transition-transform duration-300" />
          </Link>

          {/* Navigation Links with dropdown indicators */}
          <nav className="hidden md:flex items-center gap-7 h-full">
            {/* Platforms */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveDropdown('platforms')}
            >
              <button className={`flex items-center gap-1.5 text-sm font-bold transition-colors cursor-pointer py-4 ${activeDropdown === 'platforms' ? 'text-school-green' : 'text-slate-700 dark:text-slate-300 hover:text-school-green'}`}>
                <span>Platforms</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${activeDropdown === 'platforms' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'platforms' && (
                <div 
                  className="absolute left-0 top-[100%] -mt-1 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1.5 z-50 text-left"
                  onMouseEnter={() => setActiveDropdown('platforms')}
                >
                  {[
                    { label: 'SubhraEdu One', to: '/platforms/subhraedu-one' },
                    { label: 'CampusCloud 10X', to: '/platforms/campuscloud-10x' },
                    { label: 'Mobile Apps', to: '/platforms/mobile-apps' },
                    { label: 'Experiential Learning', to: '/platforms/experiential-learning' },
                    { label: 'Pre-School Management', to: '/platforms/pre-school-management' }
                  ].map((item, idx) => (
                    <Link 
                      key={idx}
                      to={item.to}
                      className="block px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-school-green dark:hover:text-school-green transition-colors border-b border-slate-50 dark:border-slate-800 last:border-b-0"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* School Optimisation */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveDropdown('schoolOptimisation')}
            >
              <button className={`flex items-center gap-1.5 text-sm font-bold transition-colors cursor-pointer py-4 ${activeDropdown === 'schoolOptimisation' ? 'text-school-green' : 'text-slate-700 dark:text-slate-300 hover:text-school-green'}`}>
                <span>School Optimisation</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${activeDropdown === 'schoolOptimisation' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'schoolOptimisation' && (
                <div 
                  className="absolute left-0 top-[100%] -mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1.5 z-50 text-left"
                  onMouseEnter={() => setActiveDropdown('schoolOptimisation')}
                >
                  {[
                    { label: 'Administration', to: '/optimisation/administration' },
                    { label: 'Finance', to: '/optimisation/finance' },
                    { label: 'Learning', to: '/optimisation/learning' },
                    { label: 'Academics', to: '/optimisation/academics' },
                    { label: 'Intelligence', to: '/optimisation/intelligence' },
                    { label: 'Logistics', to: '/optimisation/logistics' },
                    { label: 'Leadership / Management', to: '/optimisation/leadership-management' },
                    { label: 'Enterprise Features', to: '/optimisation/enterprise-features' },
                    { label: 'Communication', to: '/optimisation/communication' },
                    { label: 'Human Resources', to: '/optimisation/human-resources' }
                  ].map((item, idx) => (
                    <Link 
                      key={idx}
                      to={item.to}
                      className="block px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-school-green dark:hover:text-school-green transition-colors border-b border-slate-50 dark:border-slate-800 last:border-b-0"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Success Stories */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveDropdown('successStories')}
            >
              <button className={`flex items-center gap-1.5 text-sm font-bold transition-colors cursor-pointer py-4 ${activeDropdown === 'successStories' ? 'text-school-green' : 'text-slate-700 dark:text-slate-300 hover:text-school-green'}`}>
                <span>Success Stories</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${activeDropdown === 'successStories' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'successStories' && (
                <div 
                  className="absolute left-0 top-[100%] -mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1.5 z-50 text-left"
                  onMouseEnter={() => setActiveDropdown('successStories')}
                >
                  {[
                    { label: 'Case Studies', to: '/success-stories/case-studies' }
                  ].map((item, idx) => (
                    <Link 
                      key={idx}
                      to={item.to}
                      className="block px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-school-green dark:hover:text-school-green transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Insights */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveDropdown('insights')}
            >
              <button className={`flex items-center gap-1.5 text-sm font-bold transition-colors cursor-pointer py-4 ${activeDropdown === 'insights' ? 'text-school-green' : 'text-slate-700 dark:text-slate-300 hover:text-school-green'}`}>
                <span>Insights</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${activeDropdown === 'insights' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'insights' && (
                <div 
                  className="absolute left-0 top-[100%] -mt-1 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1.5 z-50 text-left"
                  onMouseEnter={() => setActiveDropdown('insights')}
                >
                  {[
                    { label: 'Coverage', to: '/insights/coverage' },
                    { label: 'Video', to: '/insights/video' },
                    { label: 'Ed Talks', to: '/insights/ed-talks' },
                    { label: 'Newsletter', to: '/insights/newsletter' },
                    { label: 'Student Zone', to: '/insights/student-zone' },
                    { label: 'Educator Zone', to: '/insights/educator-zone' },
                    { label: 'Educators Article', to: '/insights/educators-article' }
                  ].map((item, idx) => (
                    <Link 
                      key={idx}
                      to={item.to}
                      className="block px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-school-green dark:hover:text-school-green transition-colors border-b border-slate-50 dark:border-slate-800 last:border-b-0"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* About Us */}
            <div 
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveDropdown('aboutUs')}
            >
              <button className={`flex items-center gap-1.5 text-sm font-bold transition-colors cursor-pointer py-4 ${activeDropdown === 'aboutUs' ? 'text-school-green' : 'text-slate-700 dark:text-slate-300 hover:text-school-green'}`}>
                <span>About Us</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${activeDropdown === 'aboutUs' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'aboutUs' && (
                <div 
                  className="absolute left-0 top-[100%] -mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1.5 z-50 text-left"
                  onMouseEnter={() => setActiveDropdown('aboutUs')}
                >
                  {[
                    { label: 'Our Story', to: '/about/our-story' }
                  ].map((item, idx) => (
                    <Link 
                      key={idx}
                      to={item.to}
                      className="block px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-school-green dark:hover:text-school-green transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Us */}
            <div className="h-full flex items-center">
              <button 
                onClick={() => setIsDemoModalOpen(true)}
                className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-school-green transition-colors cursor-pointer py-4"
              >
                Contact Us
              </button>
            </div>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/login" className="hidden sm:inline-block">
              <Button variant="ghost" size="sm" className="font-bold text-slate-700 dark:text-slate-300">Sign In</Button>
            </Link>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={() => setIsDemoModalOpen(true)} 
              className="hidden md:inline-block font-bold bg-[#0A4D8C] hover:bg-[#083D70] border-none text-white text-[11px] tracking-wider rounded-lg px-5 py-2.5 uppercase transition-all"
            >
              REGISTER FOR DEMO
            </Button>
            
            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto max-h-[calc(100vh-5rem)]"
            >
              <div className="px-6 py-6 space-y-4">
                {/* Platforms Accordion */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <button
                    onClick={() => toggleMobileSection('platforms')}
                    className="w-full flex justify-between items-center text-sm font-bold text-slate-800 dark:text-white py-2 cursor-pointer"
                  >
                    <span>Platforms</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedMobileSection === 'platforms' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedMobileSection === 'platforms' && (
                    <div className="pl-4 pt-2 space-y-2.5">
                      {[
                        { label: 'SubhraEdu One', to: '/platforms/subhraedu-one' },
                        { label: 'CampusCloud 10X', to: '/platforms/campuscloud-10x' },
                        { label: 'Mobile Apps', to: '/platforms/mobile-apps' },
                        { label: 'Experiential Learning', to: '/platforms/experiential-learning' },
                        { label: 'Pre-School Management', to: '/platforms/pre-school-management' }
                      ].map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.to}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-school-green py-1"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* School Optimisation Accordion */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <button
                    onClick={() => toggleMobileSection('schoolOptimisation')}
                    className="w-full flex justify-between items-center text-sm font-bold text-slate-800 dark:text-white py-2 cursor-pointer"
                  >
                    <span>School Optimisation</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedMobileSection === 'schoolOptimisation' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedMobileSection === 'schoolOptimisation' && (
                    <div className="pl-4 pt-2 space-y-2.5 max-h-60 overflow-y-auto">
                      {[
                        { label: 'Administration', to: '/optimisation/administration' },
                        { label: 'Finance', to: '/optimisation/finance' },
                        { label: 'Learning', to: '/optimisation/learning' },
                        { label: 'Academics', to: '/optimisation/academics' },
                        { label: 'Intelligence', to: '/optimisation/intelligence' },
                        { label: 'Logistics', to: '/optimisation/logistics' },
                        { label: 'Leadership / Management', to: '/optimisation/leadership-management' },
                        { label: 'Enterprise Features', to: '/optimisation/enterprise-features' },
                        { label: 'Communication', to: '/optimisation/communication' },
                        { label: 'Human Resources', to: '/optimisation/human-resources' }
                      ].map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.to}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-school-green py-1"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Success Stories Accordion */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <button
                    onClick={() => toggleMobileSection('successStories')}
                    className="w-full flex justify-between items-center text-sm font-bold text-slate-800 dark:text-white py-2 cursor-pointer"
                  >
                    <span>Success Stories</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedMobileSection === 'successStories' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedMobileSection === 'successStories' && (
                    <div className="pl-4 pt-2 space-y-2.5">
                      {[
                        { label: 'Case Studies', to: '/success-stories/case-studies' }
                      ].map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.to}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-school-green py-1"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Insights Accordion */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <button
                    onClick={() => toggleMobileSection('insights')}
                    className="w-full flex justify-between items-center text-sm font-bold text-slate-800 dark:text-white py-2 cursor-pointer"
                  >
                    <span>Insights</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedMobileSection === 'insights' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedMobileSection === 'insights' && (
                    <div className="pl-4 pt-2 space-y-2.5">
                      {[
                        { label: 'Coverage', to: '/insights/coverage' },
                        { label: 'Video', to: '/insights/video' },
                        { label: 'Ed Talks', to: '/insights/ed-talks' },
                        { label: 'Newsletter', to: '/insights/newsletter' },
                        { label: 'Student Zone', to: '/insights/student-zone' },
                        { label: 'Educator Zone', to: '/insights/educator-zone' },
                        { label: 'Educators Article', to: '/insights/educators-article' }
                      ].map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.to}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-school-green py-1"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* About Us Accordion */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <button
                    onClick={() => toggleMobileSection('aboutUs')}
                    className="w-full flex justify-between items-center text-sm font-bold text-slate-800 dark:text-white py-2 cursor-pointer"
                  >
                    <span>About Us</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedMobileSection === 'aboutUs' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedMobileSection === 'aboutUs' && (
                    <div className="pl-4 pt-2 space-y-2.5">
                      {[
                        { label: 'Our Story', to: '/about/our-story' }
                      ].map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.to}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-school-green py-1"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contact Us Direct Link */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsDemoModalOpen(true);
                    }}
                    className="w-full text-left text-sm font-bold text-slate-800 dark:text-white py-2 cursor-pointer"
                  >
                    Contact Us
                  </button>
                </div>

                {/* Mobile CTA Actions */}
                <div className="pt-4 flex flex-col gap-3">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                    <Button variant="ghost" size="md" className="w-full font-bold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      Sign In
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsDemoModalOpen(true);
                    }}
                    className="w-full font-bold bg-[#0A4D8C] hover:bg-[#083D70] border-none text-white uppercase text-xs tracking-wider"
                  >
                    REGISTER FOR DEMO
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
