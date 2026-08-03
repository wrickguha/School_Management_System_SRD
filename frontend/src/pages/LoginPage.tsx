import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, type UserRole } from '../store/AuthContext';
import { Lock, Mail, Users, ArrowLeft, Building2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import logoUrl from '../assets/subhraedu_logo.png';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('Super Admin');
  const [schoolId, setSchoolId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isLoading, isAuthenticated, navigate]);
 
  const ALL_ROLES: UserRole[] = [
    'Super Admin', 'School Admin', 'Principal', 'Vice Principal', 'Department Head',
    'Class Teacher', 'Teacher', 'Faculty', 'Accountant', 'HR', 'Office Staff',
    'Receptionist', 'Librarian', 'Lab Assistant', 'Transport Manager', 'Driver',
    'Security Guard', 'Cleaner', 'Hostel Warden', 'Nurse', 'Counselor',
    'Student', 'Parent', 'Staff', 'Other'
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'Super Admin') {
      setEmail('admin@subhraedu.com');
      setSchoolId('');
    } else {
      setSchoolId('BHS2026');
      const roleSlug = role.toLowerCase().replace(/\s+/g, '');
      setEmail(`${roleSlug}@beaconwood.edu`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (selectedRole !== 'Super Admin' && !schoolId.trim()) {
      setError('Please enter your School ID or Subdomain to log in.');
      setIsSubmitting(false);
      return;
    }

    try {
      await login(email, selectedRole, password, schoolId);
      navigate('/dashboard');
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      const serverMsg = errors?.school_id?.[0] || errors?.email?.[0] || errors?.password?.[0] || err.response?.data?.message;
      setError(serverMsg || 'Invalid credentials. Please check your username, password, and School ID.');
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
          <div className="mx-auto bg-white p-5 md:p-6 rounded-3xl inline-block shadow-premium border border-slate-100 hover:scale-[1.05] hover:shadow-cardHover transition-all duration-300">
            <img src={logoUrl} alt="SubhraEdu Logo" className="h-32 md:h-36 w-auto object-contain" />
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
                  {ALL_ROLES.map((r) => (
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

            {/* School ID / Institution Code Input */}
            {selectedRole !== 'Super Admin' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-widest block mb-1">
                  School ID / Institution Code <span className="text-red-500 font-extrabold">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    placeholder="e.g. BHS2026 or beaconwood"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl text-xs font-bold text-red-650 text-center">
                {error}
              </div>
            )}

            {/* Password info for non-admin roles */}
            {/* Password info for non-admin roles */}
            {!['Super Admin', 'School Admin'].includes(selectedRole) && (
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-700 dark:text-blue-300 space-y-1.5">
                <p className="font-extrabold flex items-center gap-1">
                  <span>📌 Member Authentication Guidance ({selectedRole})</span>
                </p>
                <p>
                  <span className="font-semibold">Official Email:</span> <code className="font-mono bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.5 rounded text-[11px] font-bold">username@subdomain.subhraedu.com</code>
                </p>
                <p>
                  <span className="font-semibold">Default Password:</span> Member&apos;s Date of Birth in <code className="font-mono bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded text-[11px] font-bold">YYYYMMDD</code> format (e.g. <span className="font-mono font-bold">19920515</span>).
                </p>
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
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all font-semibold"
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
