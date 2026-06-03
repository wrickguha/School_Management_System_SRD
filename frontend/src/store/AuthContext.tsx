import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'Admin' | 'Teacher' | 'Parent';

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
  login: (email: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load session from localStorage on start (for demo persistence)
  useEffect(() => {
    const savedUser = localStorage.getItem('erp_auth_user');
    const savedRole = localStorage.getItem('erp_auth_role');
    const savedAuth = localStorage.getItem('erp_auth_status');

    if (savedAuth === 'true' && savedUser && savedRole) {
      setUser(JSON.parse(savedUser));
      setRole(savedRole as UserRole);
      setIsAuthenticated(true);
    } else {
      // Default initial state (for instant demo explore)
      const defaultUser: User = {
        name: 'Alexander Sterling',
        email: 'admin.sterling@academic.edu',
        role: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };
      setUser(defaultUser);
      setRole('Admin');
      setIsAuthenticated(true);
      localStorage.setItem('erp_auth_user', JSON.stringify(defaultUser));
      localStorage.setItem('erp_auth_role', 'Admin');
      localStorage.setItem('erp_auth_status', 'true');
    }
  }, []);

  const login = async (email: string, selectedRole: UserRole): Promise<boolean> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    let name = 'Alexander Sterling';
    let avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    if (selectedRole === 'Teacher') {
      name = 'Dr. Sunita Rao';
      avatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
    } else if (selectedRole === 'Parent') {
      name = 'Ramesh Sharma (Parent of Aarav)';
      avatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';
    }

    const userData: User = {
      name,
      email,
      role: selectedRole,
      avatar
    };

    setUser(userData);
    setRole(selectedRole);
    setIsAuthenticated(true);

    localStorage.setItem('erp_auth_user', JSON.stringify(userData));
    localStorage.setItem('erp_auth_role', selectedRole);
    localStorage.setItem('erp_auth_status', 'true');

    return true;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('erp_auth_user');
    localStorage.removeItem('erp_auth_role');
    localStorage.removeItem('erp_auth_status');
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    
    let name = 'Alexander Sterling';
    let email = 'admin.sterling@academic.edu';
    let avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    if (newRole === 'Teacher') {
      name = 'Dr. Sunita Rao';
      email = 'sunita.rao@school.edu';
      avatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
    } else if (newRole === 'Parent') {
      name = 'Ramesh Sharma';
      email = 'ramesh.sharma@example.com';
      avatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';
    }

    const updatedUser: User = {
      name,
      email,
      role: newRole,
      avatar
    };

    setUser(updatedUser);
    setRole(newRole);
    localStorage.setItem('erp_auth_user', JSON.stringify(updatedUser));
    localStorage.setItem('erp_auth_role', newRole);
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, login, logout, switchRole }}>
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
