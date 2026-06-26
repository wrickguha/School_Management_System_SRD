import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { LandingLayout } from '../layouts/LandingLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

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
          <Route index element={<DashboardHome />} />
          <Route path="students" element={<StudentModule />} />
          <Route path="attendance" element={<AttendanceModule />} />
          <Route path="exams" element={<ExaminationModule />} />
          <Route path="fees" element={<FeeModule />} />
          <Route path="reports" element={<ReportsModule />} />
          <Route path="settings" element={<SettingsModule />} />
          
          {/* Custom Integrated Modules */}
          <Route path="admissions" element={<AdmissionsModule />} />
          <Route path="teachers" element={<TeachersModule />} />
          <Route path="parents" element={<ParentsModule />} />
          <Route path="homework" element={<HomeworkModule />} />
          <Route path="transport" element={<TransportModule />} />
          <Route path="library" element={<LibraryModule />} />
          <Route path="hostel" element={<HostelModule />} />
          <Route path="payroll" element={<PayrollModule />} />
          <Route path="communication" element={<CommunicationModule />} />
          <Route path="events" element={<EventCalendarModule />} />
          <Route path="members" element={<MembersModule />} />
          
          {/* Wildcard redirect inside Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Global Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
