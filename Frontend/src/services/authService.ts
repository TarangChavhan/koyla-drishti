import { User, UserRole } from '../types';
import { INITIAL_USERS } from './mockData';

const AUTH_STORAGE_KEY = 'koyla_drishti_auth_user';
const USERS_STORAGE_KEY = 'koyla_drishti_users';

function getStoredUsers(): User[] {
  const data = localStorage.getItem(USERS_STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
  return INITIAL_USERS;
}

export const authService = {
  getCurrentUser(): User | null {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!data) {
      return null;
    }
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  async login(emailOrId: string, password?: string, preferredRole?: UserRole): Promise<User> {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 350));

    const users = getStoredUsers();
    let foundUser: User | undefined;

    if (preferredRole) {
      foundUser = users.find((u) => u.role === preferredRole);
    } else {
      foundUser = users.find(
        (u) =>
          u.email.toLowerCase() === emailOrId.toLowerCase() ||
          u.id.toLowerCase() === emailOrId.toLowerCase() ||
          u.name.toLowerCase().includes(emailOrId.toLowerCase())
      );
    }

    if (!foundUser) {
      // If entered a custom email, let's create a session or return first matching role or throw
      if (emailOrId.includes('admin')) {
        foundUser = users.find((u) => u.role === 'admin');
      } else if (emailOrId.includes('inspector') || emailOrId.includes('dgms')) {
        foundUser = users.find((u) => u.role === 'inspector');
      } else if (emailOrId.includes('mine') || emailOrId.includes('coal')) {
        foundUser = users.find((u) => u.role === 'mine');
      } else {
        foundUser = users[0]; // fallback to admin
      }
    }

    if (foundUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(foundUser));
      return foundUser;
    }

    throw new Error('Invalid credentials. Please verify your government email or user ID.');
  },

  switchRole(role: UserRole): User {
    const users = getStoredUsers();
    const targetUser = users.find((u) => u.role === role) || users[0];
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(targetUser));
    return targetUser;
  },

  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  getUsers(): User[] {
    return getStoredUsers();
  },

  createUser(user: Omit<User, 'id'>): User {
    const users = getStoredUsers();
    const newUser: User = {
      ...user,
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      avatarText: user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    };
    const updated = [newUser, ...users];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
    return newUser;
  },

  updateUser(id: string, updates: Partial<User>): User {
    const users = getStoredUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');
    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    const currentUser = this.getCurrentUser();
    if (currentUser?.id === id) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    }
    return updatedUser;
  }
};
