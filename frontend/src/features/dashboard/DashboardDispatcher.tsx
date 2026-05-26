import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  SuperAdminDashboard,
  SchoolAdminDashboard,
  PrincipalDashboard,
  TeacherDashboard,
  StudentDashboard,
  ParentDashboard,
  AccountantDashboard,
  LibrarianDashboard,
  TransportManagerDashboard,
  HRReceptionDashboard
} from './RoleDashboards';

export const DashboardDispatcher: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'super_admin':
      return <SuperAdminDashboard />;
    case 'school_admin':
      return <SchoolAdminDashboard />;
    case 'principal':
      return <PrincipalDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'parent':
      return <ParentDashboard />;
    case 'accountant':
      return <AccountantDashboard />;
    case 'librarian':
      return <LibrarianDashboard />;
    case 'transport_manager':
      return <TransportManagerDashboard />;
    case 'hr_reception':
      return <HRReceptionDashboard />;
    default:
      return (
        <div style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
          <h3>Unknown User Profile Role</h3>
          <p>Please log out and sign in with a supported simulation role.</p>
        </div>
      );
  }
};

export default DashboardDispatcher;
