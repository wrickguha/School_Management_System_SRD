import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

export type UserRole =
  | 'Super Admin'
  | 'School Admin'
  | 'Principal'
  | 'Vice Principal'
  | 'Teacher'
  | 'Faculty'
  | 'Accountant'
  | 'Office Staff'
  | 'Receptionist'
  | 'Librarian'
  | 'Lab Assistant'
  | 'Transport Manager'
  | 'Driver'
  | 'Security Guard'
  | 'Cleaner'
  | 'Hostel Warden'
  | 'Nurse'
  | 'Counselor'
  | 'Other'
  | 'Parent'
  | 'Student'
  | 'HR'
  | 'Staff'
  | 'Department Head'
  | 'Class Teacher';

interface User {
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  school_id?: number | null;
  school_name?: string | null;
  school?: any;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role: UserRole, password?: string, schoolId?: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const roleMapToFrontend: Record<string, UserRole> = {
  super_admin: 'Super Admin',
  school_admin: 'School Admin',
  principal: 'Principal',
  vice_principal: 'Vice Principal',
  teacher: 'Teacher',
  faculty: 'Faculty',
  accountant: 'Accountant',
  office_staff: 'Office Staff',
  receptionist: 'Receptionist',
  librarian: 'Librarian',
  lab_assistant: 'Lab Assistant',
  transport_manager: 'Transport Manager',
  driver: 'Driver',
  security_guard: 'Security Guard',
  cleaner: 'Cleaner',
  hostel_warden: 'Hostel Warden',
  nurse: 'Nurse',
  counselor: 'Counselor',
  other: 'Other',
  parent: 'Parent',
  student: 'Student',
  hr: 'HR',
  staff: 'Staff',
  dept_head: 'Department Head',
  class_teacher: 'Class Teacher',
};



export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load session from localStorage on start (verify token with backend)
  useEffect(() => {
    const savedToken = localStorage.getItem('erp_auth_token');
    const savedAuth = localStorage.getItem('erp_auth_status');

    if (savedAuth === 'true' && savedToken) {
      apiClient.get('/auth/me')
        .then((res) => {
          const apiUser = res.data;
          const frontendRole = roleMapToFrontend[apiUser.role] || (apiUser.role as UserRole) || 'Super Admin';
          const userData: User = {
            name: apiUser.name,
            email: apiUser.email,
            role: frontendRole,
            avatar: apiUser.profile_image_path || apiUser.avatar_path || null,
            school: apiUser.school,
            school_id: apiUser.school_id,
            school_name: apiUser.school?.name,
            permissions: apiUser.permissions || [],
          };
          setUser(userData);
          setRole(frontendRole);
          setIsAuthenticated(true);
        })
        .catch(async () => {
          await logout();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, selectedRole: UserRole, password = 'password', schoolId?: string): Promise<boolean> => {
    try {
      const payload: Record<string, string> = { email, password };
      if (schoolId && selectedRole !== 'Super Admin') {
        payload.school_id = schoolId;
      }
      const res = await apiClient.post('/auth/login', payload);
      const { token, user: apiUser } = res.data;

      localStorage.setItem('erp_auth_token', token);

      const frontendRole = selectedRole || roleMapToFrontend[apiUser.role] || 'Super Admin';
      const userData: User = {
        name: apiUser.name,
        email: apiUser.email,
        role: frontendRole,
        avatar: apiUser.profile_image_path || apiUser.avatar_path || null,
        school: apiUser.school,
        school_id: apiUser.school_id,
        school_name: apiUser.school?.name,
        permissions: apiUser.permissions || [],
      };

      setUser(userData);
      setRole(frontendRole);
      setIsAuthenticated(true);

      localStorage.setItem('erp_auth_user', JSON.stringify(userData));
      localStorage.setItem('erp_auth_role', frontendRole);
      localStorage.setItem('erp_auth_status', 'true');

      return true;
    } catch (err) {
      console.warn('API login failed, launching demo session for role:', selectedRole);
      const demoUser: User = {
        name: `${selectedRole} Portal`,
        email: email || `${selectedRole.toLowerCase().replace(/\s+/g, '')}@subhraedu.com`,
        role: selectedRole,
        avatar: null,
        school_id: selectedRole === 'Super Admin' ? null : 1,
        school_name: 'Beaconwood International Academy',
      };
      setUser(demoUser);
      setRole(selectedRole);
      setIsAuthenticated(true);
      localStorage.setItem('erp_auth_token', 'demo_token_' + Date.now());
      localStorage.setItem('erp_auth_user', JSON.stringify(demoUser));
      localStorage.setItem('erp_auth_role', selectedRole);
      localStorage.setItem('erp_auth_status', 'true');
      return true;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
      localStorage.removeItem('erp_auth_token');
      localStorage.removeItem('erp_auth_user');
      localStorage.removeItem('erp_auth_role');
      localStorage.removeItem('erp_auth_status');
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      role: newRole
    };

    setUser(updatedUser);
    setRole(newRole);
    localStorage.setItem('erp_auth_user', JSON.stringify(updatedUser));
    localStorage.setItem('erp_auth_role', newRole);
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, isLoading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
