import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Award, CheckCircle } from 'lucide-react';
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
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/subhraedu_logo.png" alt="SUBHRAEDU Logo" className="h-10 w-auto object-contain rounded-lg" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-school-blue transition-colors">Features</a>
            <a href="#why-choose-us" className="text-sm font-medium hover:text-school-blue transition-colors">Why Us</a>
            <a href="#modules" className="text-sm font-medium hover:text-school-blue transition-colors">Modules</a>
            <a href="#pricing" className="text-sm font-medium hover:text-school-blue transition-colors">Pricing</a>
            <a href="#faqs" className="text-sm font-medium hover:text-school-blue transition-colors">FAQs</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Button variant="primary" size="sm" onClick={() => setIsDemoModalOpen(true)}>
              Request Demo
            </Button>
          </div>
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
            <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl inline-block max-w-max">
              <img src="/subhraedu_logo.png" alt="SUBHRAEDU Logo" className="h-8 w-auto object-contain" />
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
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a></li>
              <li><Link to="/login" className="hover:text-white transition-colors">ERP Dashboard Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Contact Us</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-school-blue mt-0.5 shrink-0" />
                <span>SRD Technologies, Kulsum Complex,<br />Bagdogra, West Bengal</span>
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
          <p>© 2026 SUBHRAEDU. All rights reserved.</p>
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
