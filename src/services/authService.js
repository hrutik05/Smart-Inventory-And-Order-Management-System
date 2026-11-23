import { users, addUser } from '../data/mockData';

// TODO: Replace with real API calls when the Spring Boot backend is available:
//   POST /api/auth/login
//   POST /api/auth/register
//   POST /api/auth/refresh

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));
const STORAGE_KEY = 'ims_auth_user';

export const authService = {
  async login(email, password) {
    await delay();
    if (!email || !password) throw new Error('Email and password are required');
    // Mock credential check — any registered user with password "password123" works.
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || password !== 'password123') {
      throw new Error('Invalid email or password. Try admin@inventory.com / password123');
    }
    const session = { ...user, token: `mock-jwt-${user.id}-${Date.now()}` };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  async register({ fullName, email, phone, password }) {
    await delay();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists');
    }
    const user = addUser({ id: users.length + 1, fullName, email, phone, role: 'STAFF', avatarColor: 'bg-indigo-600' });
    const session = { ...user, token: `mock-jwt-${user.id}-${Date.now()}` };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  },

  getCurrentUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem(STORAGE_KEY);
  },
};
