import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, type UserRole } from '../store/AuthContext';
import { Lock, Mail, Users, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('Super Admin');
  const [email, setEmail] = useState('admin@subhraedu.com');
  const [password, setPassword] = useState('admin123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isLoading, isAuthenticated, navigate]);
 
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'Teacher') {
      setEmail('teacher@greenwood.edu');
      setPassword('password');
    } else if (role === 'Parent') {
      setEmail('parent@greenwood.edu');
      setPassword('');
    } else if (role === 'Student') {
      setEmail('');
      setPassword('');
    } else if (role === 'Faculty') {
      setEmail('faculty@greenwood.edu');
      setPassword('password');
    } else if (role === 'Librarian') {
      setEmail('librarian@greenwood.edu');
      setPassword('password');
    } else if (role === 'Super Admin') {
      setEmail('admin@subhraedu.com');
      setPassword('admin123');
    } else if (role === 'School Admin') {
      setEmail('admin@greenwood.edu');
      setPassword('password');
    } else if (role === 'Principal') {
      setEmail('principal@greenwood.edu');
      setPassword('password');
    } else if (role === 'Accountant') {
      setEmail('accountant@greenwood.edu');
      setPassword('password');
    } else if (role === 'HR') {
      setEmail('hr@greenwood.edu');
      setPassword('password');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const success = await login(email, selectedRole, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Try using default values.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-900 dark:text-slate-100 transition-colors">
      <Link to="/" className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-school-blue transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-3">
          <div className="mx-auto bg-white p-3.5 rounded-3xl inline-block shadow-premium border border-slate-100 hover:scale-[1.05] hover:shadow-cardHover transition-all duration-300">
            <img src="/subhraedu_logo.png" alt="SubhraEdu Logo" className="h-24 w-auto object-contain" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Access SubhraEdu Portal</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Select your administrative profile card to authenticate.
          </p>
        </div>

        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-premium">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role Selectors Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-450 uppercase tracking-widest block mb-1">Login Profile / Role</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <select
                  value={selectedRole}
                  onChange={(e) => handleRoleSelect(e.target.value as UserRole)}
                  className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 appearance-none transition-all cursor-pointer"
                >
                  {(['Super Admin', 'School Admin', 'Principal', 'Teacher', 'Faculty', 'Librarian', 'Parent', 'Student', 'Accountant', 'HR'] as UserRole[]).map((r) => (
                    <option key={r} value={r} className="text-slate-900 bg-white dark:bg-slate-900 dark:text-slate-100 font-semibold">
                      {r} Profile
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-slate-450">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Error display */}
            {error && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl text-xs font-bold text-red-650 text-center">
                {error}
              </div>
            )}

            {/* Password info for non-admin roles */}
            {!['Super Admin', 'School Admin'].includes(selectedRole) && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-700 dark:text-blue-400 space-y-1">
                <p className="font-bold">Login Note ({selectedRole})</p>
                {selectedRole === 'Student' && (
                  <>
                    <p><span className="font-semibold">Email:</span> Your admission number in lowercase + @student.school<br/><span className="font-mono font-bold ml-4">e.g. adm20261234@student.school</span></p>
                    <p><span className="font-semibold">Password:</span> Your date of birth in YYYYMMDD format<br/><span className="font-mono font-bold ml-4">e.g. 20100315</span></p>
                  </>
                )}
                {selectedRole === 'Parent' && (
                  <p>Your password is your child&apos;s date of birth in YYYYMMDD format (e.g. 20100315)</p>
                )}
                {!['Student', 'Parent'].includes(selectedRole) && (
                  <p>Your password is your date of birth in YYYYMMDD format (e.g. 20100315)</p>
                )}
              </div>
            )}

            {/* Email input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Portal Username / Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@school.edu"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Access Pin / Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
                Sign In to Dashboard
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
