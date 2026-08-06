import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermission } from '../store/PermissionContext';

interface PermissionGuardProps {
  permission?: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ permission, fallback = null, children }) => {
  const { hasPermission } = usePermission();

  if (!permission) {
    return <>{children}</>;
  }

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="mx-auto my-16 max-w-2xl rounded-3xl border border-rose-200/80 bg-rose-50/80 p-10 text-center text-rose-800 shadow-sm shadow-rose-200/50 dark:border-rose-800/80 dark:bg-rose-950/60 dark:text-rose-200">
      <h2 className="mb-3 text-2xl font-extrabold">Access Denied</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        You do not have permission to view this section. If your role permissions were recently updated, please refresh the page.
      </p>
    </div>
  );
};
