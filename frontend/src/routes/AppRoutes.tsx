import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { LandingLayout } from '../layouts/LandingLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PermissionGuard } from '../components/PermissionGuard';

// Loading Skeleton Component for Suspense
const RouteSkeleton = () => (
  <div className="space-y-6 animate-pulse p-4">
    <div className="flex justify-between items-center">
      <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
    </div>
    <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
  </div>
);

// Lazy Loaded Pages
const LandingPage = lazy(() => import('../pages/LandingPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'));
const StudentModule = lazy(() => import('../pages/dashboard/StudentModule'));
const AttendanceModule = lazy(() => import('../pages/dashboard/AttendanceModule'));
const ExaminationModule = lazy(() => import('../pages/dashboard/ExaminationModule'));
const FeeModule = lazy(() => import('../pages/dashboard/FeeModule'));
const ReportsModule = lazy(() => import('../pages/dashboard/ReportsModule'));
const SettingsModule = lazy(() => import('../pages/dashboard/SettingsModule'));

// Newly Integrated Modules
const AdmissionsModule = lazy(() => import('../pages/dashboard/AdmissionsModule'));
const TeachersModule = lazy(() => import('../pages/dashboard/TeachersModule'));
const ParentsModule = lazy(() => import('../pages/dashboard/ParentsModule'));
const HomeworkModule = lazy(() => import('../pages/dashboard/HomeworkModule'));
const TransportModule = lazy(() => import('../pages/dashboard/TransportModule'));
const LibraryModule = lazy(() => import('../pages/dashboard/LibraryModule'));
const HostelModule = lazy(() => import('../pages/dashboard/HostelModule'));
const PayrollModule = lazy(() => import('../pages/dashboard/PayrollModule'));
const CommunicationModule = lazy(() => import('../pages/dashboard/CommunicationModule'));
const EventCalendarModule = lazy(() => import('../pages/dashboard/EventCalendarModule'));
const MembersModule = lazy(() => import('../pages/dashboard/MembersModule'));
const CertificatesModule = lazy(() => import('../pages/dashboard/CertificatesModule'));
const BatchModule = lazy(() => import('../pages/dashboard/BatchModule'));
const WorkAssignmentModule = lazy(() => import('../pages/dashboard/WorkAssignmentModule'));
const ReceptionistModule = lazy(() => import('../pages/dashboard/ReceptionistModule'));
const RbacManagementModule = lazy(() => import('../pages/dashboard/RbacManagementModule'));

// Dynamic Navbar Detail Sub-Pages
const NavbarDetailPage = lazy(() => import('../pages/NavbarDetailPage'));

// Auth Guard
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <RouteSkeleton />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="platforms/:slug" element={<NavbarDetailPage />} />
          <Route path="optimisation/:slug" element={<NavbarDetailPage />} />
          <Route path="success-stories/:slug" element={<NavbarDetailPage />} />
          <Route path="insights/:slug" element={<NavbarDetailPage />} />
          <Route path="about/:slug" element={<NavbarDetailPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected ERP Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route index element={<PermissionGuard permission="dashboard.view"><DashboardHome /></PermissionGuard>} />
          <Route path="rbac" element={<PermissionGuard permission="role.view"><RbacManagementModule /></PermissionGuard>} />
          <Route path="students" element={<PermissionGuard permission="student.view"><StudentModule /></PermissionGuard>} />
          <Route path="attendance" element={<PermissionGuard permission="attendance.view"><AttendanceModule /></PermissionGuard>} />
          <Route path="exams" element={<PermissionGuard permission="exam.view"><ExaminationModule /></PermissionGuard>} />
          <Route path="fees" element={<PermissionGuard permission="fee.view"><FeeModule /></PermissionGuard>} />
          <Route path="reports" element={<PermissionGuard permission="dashboard.reports"><ReportsModule /></PermissionGuard>} />
          <Route path="settings" element={<PermissionGuard permission="settings.view"><SettingsModule /></PermissionGuard>} />
          
          {/* Custom Integrated Modules */}
          <Route path="admissions" element={<PermissionGuard permission="enquiry.view"><AdmissionsModule /></PermissionGuard>} />
          <Route path="teachers" element={<PermissionGuard permission="teacher.view"><TeachersModule /></PermissionGuard>} />
          <Route path="parents" element={<PermissionGuard permission="parent.view"><ParentsModule /></PermissionGuard>} />
          <Route path="homework" element={<PermissionGuard permission="homework.view"><HomeworkModule /></PermissionGuard>} />
          <Route path="transport" element={<PermissionGuard permission="transport.view"><TransportModule /></PermissionGuard>} />
          <Route path="library" element={<PermissionGuard permission="library.view"><LibraryModule /></PermissionGuard>} />
          <Route path="hostel" element={<PermissionGuard permission="hostel.view"><HostelModule /></PermissionGuard>} />
          <Route path="payroll" element={<PermissionGuard permission="payroll.view"><PayrollModule /></PermissionGuard>} />
          <Route path="communication" element={<PermissionGuard permission="communication.view"><CommunicationModule /></PermissionGuard>} />
          <Route path="events" element={<EventCalendarModule />} />
          <Route path="members" element={<PermissionGuard permission="user.view"><MembersModule /></PermissionGuard>} />
          <Route path="certificates" element={<PermissionGuard permission="certificate.view"><CertificatesModule /></PermissionGuard>} />
          <Route path="batches" element={<PermissionGuard permission="batch.view"><BatchModule /></PermissionGuard>} />
          <Route path="work-assignments" element={<PermissionGuard permission="work.view"><WorkAssignmentModule /></PermissionGuard>} />
          <Route path="visitors" element={<PermissionGuard permission="visitor.view"><ReceptionistModule initialTab="visitors" /></PermissionGuard>} />
          <Route path="appointments" element={<PermissionGuard permission="appointment.view"><ReceptionistModule initialTab="appointments" /></PermissionGuard>} />
          <Route path="complaints" element={<PermissionGuard permission="complaint.view"><ReceptionistModule initialTab="complaints" /></PermissionGuard>} />
          
          {/* Wildcard redirect inside Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Global Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
