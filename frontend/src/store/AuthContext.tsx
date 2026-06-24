import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient';

export type UserRole = 'Super Admin' | 'School Admin' | 'Principal' | 'Teacher' | 'Faculty' | 'Librarian' | 'Parent' | 'Student' | 'Accountant' | 'HR';

interface User {
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role: UserRole, password?: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const roleMapToFrontend: Record<string, UserRole> = {
  super_admin: 'Super Admin',
  school_admin: 'School Admin',
  principal: 'Principal',
  teacher: 'Teacher',
  faculty: 'Faculty',
  librarian: 'Librarian',
  parent: 'Parent',
  student: 'Student',
  accountant: 'Accountant',
  hr: 'HR'
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
          const frontendRole = roleMapToFrontend[apiUser.role] || 'Super Admin';
          const userData: User = {
            name: apiUser.name,
            email: apiUser.email,
            role: frontendRole,
            avatar: apiUser.avatar_path || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
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

  const login = async (email: string, selectedRole: UserRole, password = 'password'): Promise<boolean> => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      const { token, user: apiUser } = res.data;

      localStorage.setItem('erp_auth_token', token);

      const frontendRole = roleMapToFrontend[apiUser.role] || selectedRole;
      const userData: User = {
        name: apiUser.name,
        email: apiUser.email,
        role: frontendRole,
        avatar: apiUser.avatar_path || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };

      setUser(userData);
      setRole(frontendRole);
      setIsAuthenticated(true);

      localStorage.setItem('erp_auth_user', JSON.stringify(userData));
      localStorage.setItem('erp_auth_role', frontendRole);
      localStorage.setItem('erp_auth_status', 'true');

      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
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
