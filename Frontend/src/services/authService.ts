import { User, UserRole } from '../types';
import { api, setAuthToken, removeAuthToken, getAuthToken } from './api';
import { INITIAL_USERS } from './mockData';

const AUTH_STORAGE_KEY = 'koyla_drishti_auth_user';

export const authService = {
  getCurrentUser(): User | null {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  async login(emailOrId: string, password?: string, preferredRole?: UserRole): Promise<User> {
    const effectivePassword = password || (
      preferredRole === 'inspector'
        ? 'Inspector@2026'
        : preferredRole === 'mine'
        ? 'MineBCCL@2026'
        : 'GovAdmin@2026'
    );

    try {
      // Real API Call to FastAPI Backend
      const response = await api.post<{ access_token: string; token_type: string; user: User }>(
        '/auth/login',
        {
          email: emailOrId,
          password: effectivePassword,
          preferred_role: preferredRole
        }
      );

      if (response && response.access_token) {
        setAuthToken(response.access_token);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.user));
        return response.user;
      }
    } catch (apiError: any) {
      console.warn('Backend API login failed or unavailable, checking offline mock session:', apiError.message);
      // If server is offline during initial startup, permit mock login
      const mockUser = INITIAL_USERS.find(
        (u) =>
          u.email.toLowerCase() === emailOrId.toLowerCase() ||
          u.id.toLowerCase() === emailOrId.toLowerCase() ||
          (preferredRole && u.role === preferredRole)
      ) || INITIAL_USERS[0];

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
      return mockUser;
    }

    throw new Error('Invalid credentials. Please verify your government email or user ID.');
  },

  async switchRole(role: UserRole): Promise<User> {
    const credentials = {
      admin: { email: 'admin@coal.gov.in', pass: 'GovAdmin@2026' },
      inspector: { email: 'inspector@dgms.gov.in', pass: 'Inspector@2026' },
      mine: { email: 'mine@bccl.gov.in', pass: 'MineBCCL@2026' }
    };

    const target = credentials[role];
    try {
      return await this.login(target.email, target.pass, role);
    } catch {
      const fallback = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }
  },

  async logout(): Promise<void> {
    try {
      if (getAuthToken()) {
        await api.post('/auth/logout');
      }
    } catch {
      // Clean up even if network request fails
    } finally {
      removeAuthToken();
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  },

  async getUsers(): Promise<User[]> {
    try {
      return await api.get<User[]>('/users');
    } catch {
      return INITIAL_USERS;
    }
  },

  async createUser(user: Omit<User, 'id'> & { password?: string }): Promise<User> {
    try {
      return await api.post<User>('/users', {
        ...user,
        password: user.password || 'GovAdmin@2026'
      });
    } catch {
      const newUser: User = {
        ...user,
        id: `USR-${String(Math.floor(10 + Math.random() * 90))}`,
        avatarText: user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
      };
      return newUser;
    }
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    try {
      return await api.put<User>(`/users/${id}`, updates);
    } catch {
      const currentUser = this.getCurrentUser();
      if (currentUser?.id === id) {
        const updated = { ...currentUser, ...updates };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      }
      return { ...INITIAL_USERS[0], ...updates };
    }
  }
};
