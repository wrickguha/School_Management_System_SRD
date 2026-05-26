import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[] | 'all';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = 'all',
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div 
        style={{ 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)'
        }}
      >
        <span>Verifying secure connection...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect to login page and store source path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles !== 'all' && !allowedRoles.includes(user.role)) {
    // Role not authorized, fallback to generic dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
