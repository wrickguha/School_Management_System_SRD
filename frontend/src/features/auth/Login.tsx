import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { SPLINE_SCENES } from '../../config/splineUrls';
import { SplineWrapper } from '../../components/spline/SplineWrapper';
import { Card } from '../../components/ui/Card';
import { Input, Select } from '../../components/ui/FormFields';
import * as Icons from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('student@hogwarts.edu');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const roleConfigs: { role: UserRole; email: string; label: string }[] = [
    { role: 'super_admin', email: 'superadmin@hogwarts.edu', label: 'Super Admin' },
    { role: 'school_admin', email: 'admin@hogwarts.edu', label: 'School Admin' },
    { role: 'principal', email: 'principal@hogwarts.edu', label: 'Principal' },
    { role: 'teacher', email: 'teacher@hogwarts.edu', label: 'Teacher' },
    { role: 'student', email: 'student@hogwarts.edu', label: 'Student' },
    { role: 'parent', email: 'parent@hogwarts.edu', label: 'Parent' },
    { role: 'accountant', email: 'accountant@hogwarts.edu', label: 'Accountant' },
    { role: 'librarian', email: 'library@hogwarts.edu', label: 'Librarian' },
    { role: 'transport_manager', email: 'transport@hogwarts.edu', label: 'Transport Manager' },
    { role: 'hr_reception', email: 'hr@hogwarts.edu', label: 'HR / Reception' },
  ];

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole;
    setSelectedRole(role);
    const conf = roleConfigs.find(c => c.role === role);
    if (conf) {
      setEmail(conf.email);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, selectedRole);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      {/* Glow effect background */}
      <div className="glow-orb glow-orb-primary" />
      
      <div className="login-card-shell glass-panel">
        
        {/* Left Side: Stunning 3D Spline Scene (magical school theme) */}
        <div className="login-visual-side">
          <div style={{ position: 'absolute', top: '30px', left: '30px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icons.GraduationCap size={32} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Hogwarts ERP</h2>
          </div>
          
          <SplineWrapper 
            sceneUrl={SPLINE_SCENES.hero} 
            height="100%" 
            fallbackType="campus"
            interactionMode="hover"
            loadingStrategy="eager"
          />

          <div className="visual-caption">
            <h3>Enterprise School Governance</h3>
            <p>Empowered by immersive analytics and fast interfaces.</p>
          </div>
        </div>

        {/* Right Side: Sign In Form */}
        <div className="login-form-side">
          <div style={{ maxWidth: '400px', width: '100%' }}>
            
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Portal Sign In
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Please select your role and sign in to access the system.
              </p>
            </div>

            {error && (
              <div className="error-box">
                <Icons.AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              {/* Quick Role Selection Dropdown */}
              <Select 
                label="Select Profile Role Simulator"
                value={selectedRole}
                onChange={handleRoleChange}
                options={roleConfigs.map(c => ({ value: c.role, label: c.label }))}
              />

              <Input 
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input 
                label="Secure Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 'var(--space-md) 0' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked /> Remember session
                </label>
                <a href="#forgot" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
                  Reset Password?
                </a>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={loading}
                style={{ padding: '0.8rem' }}
              >
                {loading ? 'Securing Session...' : 'Sign In To Dashboard'}
              </button>
            </form>
            
          </div>
        </div>

      </div>

      <style>{`
        .login-page-container {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-primary);
          overflow: hidden;
          position: relative;
          padding: var(--space-md);
          box-sizing: border-box;
        }

        .login-card-shell {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          width: 1000px;
          height: 600px;
          overflow: hidden;
          z-index: 10;
          border-radius: var(--radius-lg);
        }

        .login-visual-side {
          position: relative;
          background-color: rgba(var(--accent-primary-rgb), 0.02);
          border-right: 1px solid var(--border-color);
          overflow: hidden;
          height: 100%;
        }
        .visual-caption {
          position: absolute;
          bottom: 40px;
          left: 40px;
          right: 40px;
          z-index: 10;
        }
        .visual-caption h3 { font-size: 1.35rem; color: var(--text-primary); margin-bottom: 6px; }
        .visual-caption p { font-size: 0.85rem; color: var(--text-secondary); }

        .login-form-side {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-xl);
          background-color: var(--bg-secondary);
        }

        .error-box {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm) var(--space-md);
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--danger);
          border-radius: var(--radius-md);
          color: var(--danger);
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: var(--space-md);
        }

        @media (max-width: 900px) {
          .login-card-shell {
            grid-template-columns: 1fr;
            width: 450px;
            height: auto;
          }
          .login-visual-side {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
export default Login;
