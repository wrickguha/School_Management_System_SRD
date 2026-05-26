import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { ProtectedRoute } from './ProtectedRoute';

// Lazy loading feature pages
import Login from '../features/auth/Login';
import DashboardDispatcher from '../features/dashboard/DashboardDispatcher';
import StudentDirectory from '../features/students/StudentDirectory';
import Admissions from '../features/students/Admissions';
import StaffDirectory from '../features/faculty/StaffDirectory';
import LeaveManagement from '../features/admin/LeaveManagement';
import ClassSchedules from '../features/classes/ClassSchedules';
import AttendanceEntry from '../features/academic/AttendanceEntry';
import HomeworkLogs from '../features/academic/HomeworkLogs';
import ExamsGrades from '../features/academic/ExamsGrades';
import FeesInvoicing from '../features/finance/FeesInvoicing';
import LibraryInventory from '../features/logistics/LibraryInventory';
import TransportRoutes from '../features/logistics/TransportRoutes';
import NoticeBoard from '../features/communications/NoticeBoard';
import SchoolSettings from '../features/admin/SchoolSettings';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Authentication Path */}
      <Route path="/login" element={<Login />} />

      {/* Secure ERP Core Routes (AppShell Wrapper) */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Core dashboard router */}
        <Route path="dashboard" element={<DashboardDispatcher />} />
        
        {/* Admissions funnel */}
        <Route 
          path="admissions" 
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'principal', 'hr_reception']}>
              <Admissions />
            </ProtectedRoute>
          } 
        />

        {/* Student directory */}
        <Route 
          path="students" 
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'principal', 'teacher', 'hr_reception']}>
              <StudentDirectory />
            </ProtectedRoute>
          } 
        />

        {/* Staff registry */}
        <Route 
          path="staff" 
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'principal', 'hr_reception']}>
              <StaffDirectory />
            </ProtectedRoute>
          } 
        />

        {/* Leave application & approvals */}
        <Route path="leaves" element={<LeaveManagement />} />

        {/* Timetables */}
        <Route path="classes" element={<ClassSchedules />} />

        {/* Attendance marker */}
        <Route 
          path="attendance" 
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'principal', 'teacher']}>
              <AttendanceEntry />
            </ProtectedRoute>
          } 
        />

        {/* Assignments */}
        <Route path="homework" element={<HomeworkLogs />} />

        {/* Exams grades */}
        <Route path="exams" element={<ExamsGrades />} />

        {/* Invoicing fee receipts */}
        <Route path="fees" element={<FeesInvoicing />} />

        {/* Library rentals logs */}
        <Route path="library" element={<LibraryInventory />} />

        {/* Transport fleet routes */}
        <Route path="transport" element={<TransportRoutes />} />

        {/* NoticeBoard announcements */}
        <Route path="notices" element={<NoticeBoard />} />

        {/* School config profile */}
        <Route 
          path="settings" 
          element={
            <ProtectedRoute allowedRoles={['super_admin', 'school_admin', 'principal']}>
              <SchoolSettings />
            </ProtectedRoute>
          } 
        />

        {/* Wildcard redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Outer Wildcard redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
