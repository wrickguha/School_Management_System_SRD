import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface PermissionContextType {
  permissions: string[];
  hasPermission: (permission: string | string[]) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  refreshPermissions: () => Promise<void>;
  isSuperAdmin: boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);

  const isSuperAdmin = role === 'Super Admin' || String(user?.role) === 'super_admin' || String(user?.role) === 'Super Admin';

  useEffect(() => {
    if (user && user.permissions) {
      setPermissions(user.permissions);
    } else {
      // Fallback default permissions by role if auth payload hasn't synced
      const defaultRolePermissionsMap: Record<string, string[]> = {
        'Super Admin': ['ALL'],
        'School Admin': ['student.view', 'student.create', 'student.edit', 'student.delete', 'teacher.view', 'teacher.create', 'teacher.edit', 'fee.view', 'fee.create', 'attendance.view', 'attendance.mark', 'exam.view', 'exam.create', 'settings.view'],
        'Teacher': ['student.view', 'attendance.view', 'attendance.mark', 'attendance.edit', 'exam.view', 'exam.create', 'homework.view', 'homework.create', 'certificate.view'],
        'Accountant': ['student.view', 'fee.view', 'fee.create', 'fee.edit', 'fee.approve', 'payroll.view', 'payroll.create'],
        'HR': ['teacher.view', 'teacher.create', 'teacher.edit', 'payroll.view', 'payroll.create', 'user.view', 'user.create'],
        'Receptionist': ['student.view', 'student.create', 'visitor.view', 'visitor.create', 'enquiry.view', 'enquiry.create', 'appointment.view', 'complaint.view'],
        'Librarian': ['student.view', 'library.view', 'library.create', 'library.issue', 'library.return'],
        'Transport Manager': ['student.view', 'transport.view', 'transport.create', 'transport.assign_route'],
        'Hostel Warden': ['student.view', 'hostel.view', 'hostel.create', 'hostel.allocate'],
        'Student': ['attendance.view', 'exam.view', 'homework.view', 'fee.view', 'certificate.view', 'library.view'],
        'Parent': ['attendance.view', 'exam.view', 'homework.view', 'fee.view', 'certificate.view'],
      };

      const currentRole = role || 'Student';
      setPermissions(defaultRolePermissionsMap[currentRole] || ['dashboard.view']);
    }
  }, [user, role]);

  const refreshPermissions = async () => {
    if (user && user.permissions) {
      setPermissions(user.permissions);
      return;
    }

    await refreshUser();
  };

  useEffect(() => {
    const handlePermissionsUpdated = async () => {
      await refreshUser();
    };
    window.addEventListener('role-permissions-updated', handlePermissionsUpdated);
    return () => window.removeEventListener('role-permissions-updated', handlePermissionsUpdated);
  }, [refreshUser]);

  useEffect(() => {
    if (user && user.permissions) {
      setPermissions(user.permissions);
    } else {
      // Fallback default permissions by role if auth payload hasn't synced
      const defaultRolePermissionsMap: Record<string, string[]> = {
        'Super Admin': ['ALL'],
        'School Admin': ['student.view', 'student.create', 'student.edit', 'student.delete', 'teacher.view', 'teacher.create', 'teacher.edit', 'fee.view', 'fee.create', 'attendance.view', 'attendance.mark', 'exam.view', 'exam.create', 'settings.view'],
        'Teacher': ['student.view', 'attendance.view', 'attendance.mark', 'attendance.edit', 'exam.view', 'exam.create', 'homework.view', 'homework.create', 'certificate.view'],
        'Accountant': ['student.view', 'fee.view', 'fee.create', 'fee.edit', 'fee.approve', 'payroll.view', 'payroll.create'],
        'HR': ['teacher.view', 'teacher.create', 'teacher.edit', 'payroll.view', 'payroll.create', 'user.view', 'user.create'],
        'Receptionist': ['student.view', 'student.create', 'visitor.view', 'visitor.create', 'enquiry.view', 'enquiry.create', 'appointment.view', 'complaint.view'],
        'Librarian': ['student.view', 'library.view', 'library.create', 'library.issue', 'library.return'],
        'Transport Manager': ['student.view', 'transport.view', 'transport.create', 'transport.assign_route'],
        'Hostel Warden': ['student.view', 'hostel.view', 'hostel.create', 'hostel.allocate'],
        'Student': ['attendance.view', 'exam.view', 'homework.view', 'fee.view', 'certificate.view', 'library.view'],
        'Parent': ['attendance.view', 'exam.view', 'homework.view', 'fee.view', 'certificate.view'],
      };

      const currentRole = role || 'Student';
      setPermissions(defaultRolePermissionsMap[currentRole] || ['dashboard.view']);
    }
  }, [user, role, refreshUser]);

  const hasPermission = (permission: string | string[]): boolean => {
    if (isSuperAdmin) return true;

    if (Array.isArray(permission)) {
      return permission.some(p => permissions.includes(p));
    }

    return permissions.includes(permission) || permissions.includes('ALL');
  };

  const hasAnyPermission = (permList: string[]): boolean => {
    if (isSuperAdmin) return true;
    return permList.some(p => permissions.includes(p) || permissions.includes('ALL'));
  };

  const hasAllPermissions = (permList: string[]): boolean => {
    if (isSuperAdmin) return true;
    return permList.every(p => permissions.includes(p) || permissions.includes('ALL'));
  };

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        refreshPermissions,
        isSuperAdmin,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermission must be used within a PermissionProvider');
  }
  return context;
};

/**
 * Reusable Guard Component: <Can permission="student.create"> ... </Can>
 */
export const Can: React.FC<{
  permission: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ permission, fallback = null, children }) => {
  const { hasPermission } = usePermission();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
