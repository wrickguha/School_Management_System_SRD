import { User, UserRole, AuthSession } from '../types';
import { apiClient } from './apiClient';

// Credentials map matching all 10 ERP roles
export const MOCK_USERS: Record<UserRole, User & { psw: string }> = {
  super_admin: { id: 'usr-1', name: 'Albus Dumbledore', email: 'superadmin@hogwarts.edu', role: 'super_admin', psw: 'admin123', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80' },
  school_admin: { id: 'usr-2', name: 'Minerva McGonagall', email: 'admin@hogwarts.edu', role: 'school_admin', psw: 'admin123', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80' },
  principal: { id: 'usr-3', name: 'Severus Snape', email: 'principal@hogwarts.edu', role: 'principal', psw: 'admin123', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80' },
  teacher: { id: 'usr-4', name: 'Remus Lupin', email: 'teacher@hogwarts.edu', role: 'teacher', psw: 'admin123', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' },
  student: { id: 'usr-5', name: 'Harry Potter', email: 'student@hogwarts.edu', role: 'student', psw: 'admin123', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80' },
  parent: { id: 'usr-6', name: 'James Potter', email: 'parent@hogwarts.edu', role: 'parent', psw: 'admin123', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
  accountant: { id: 'usr-7', name: 'Filius Flitwick', email: 'accountant@hogwarts.edu', role: 'accountant', psw: 'admin123', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80' },
  librarian: { id: 'usr-8', name: 'Irma Pince', email: 'library@hogwarts.edu', role: 'librarian', psw: 'admin123', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
  transport_manager: { id: 'usr-9', name: 'Rubeus Hagrid', email: 'transport@hogwarts.edu', role: 'transport_manager', psw: 'admin123', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80' },
  hr_reception: { id: 'usr-10', name: 'Pomona Sprout', email: 'hr@hogwarts.edu', role: 'hr_reception', psw: 'admin123', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80' },
};

class AuthService {
  async login(email: string, role: UserRole): Promise<AuthSession> {
    const user = MOCK_USERS[role];
    const session: AuthSession = {
      token: `mock_jwt_token_for_${role}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    };
    
    // Simulating Laravel login route POST /api/login
    const result = await apiClient.post<AuthSession>('/api/login', session);
    localStorage.setItem('sms_session', JSON.stringify(result));
    return result;
  }

  getCurrentUser(): User | null {
    const sessionStr = localStorage.getItem('sms_session');
    if (!sessionStr) return null;
    try {
      const session = JSON.parse(sessionStr) as AuthSession;
      return session.user;
    } catch {
      return null;
    }
  }

  logout(): void {
    console.log('[REST API Request] POST /api/logout');
    localStorage.removeItem('sms_session');
  }
}

export const authService = new AuthService();
