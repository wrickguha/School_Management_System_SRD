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

// Fallback Module sandbox for additional requested modules
const SandboxModule = lazy(() => import('../pages/dashboard/SandboxModule'));

// Auth Guard
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<LandingPage />} />
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
          
          {/* Universal Sandboxed Modules for remaining modules */}
          <Route path="admissions" element={<SandboxModule moduleName="Admissions Management" />} />
          <Route path="teachers" element={<SandboxModule moduleName="Teachers Directory" />} />
          <Route path="parents" element={<SandboxModule moduleName="Parents Registry" />} />
          <Route path="homework" element={<SandboxModule moduleName="Homework & Tasks" />} />
          <Route path="transport" element={<SandboxModule moduleName="Transport Fleet" />} />
          <Route path="library" element={<SandboxModule moduleName="Library Catalog" />} />
          <Route path="hostel" element={<SandboxModule moduleName="Hostel Rooms" />} />
          <Route path="payroll" element={<SandboxModule moduleName="HR & Payroll Ledger" />} />
          <Route path="communication" element={<SandboxModule moduleName="Global Announcements & SMS" />} />
          
          {/* Wildcard redirect inside Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Global Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
