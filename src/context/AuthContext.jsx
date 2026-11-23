import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const ROLE_PERMISSIONS = {
  ADMIN: {
    pages: ['dashboard', 'products', 'categories', 'inventory', 'warehouses', 'orders', 'suppliers', 'customers', 'reports', 'notifications', 'users', 'settings'],
    actions: ['product:write', 'product:delete', 'inventory:write', 'warehouse:write', 'warehouse:transfer', 'order:write', 'order:cancel', 'supplier:write', 'customer:write', 'user:manage', 'settings:write', 'reports:view'],
  },
  MANAGER: {
    pages: ['dashboard', 'products', 'categories', 'inventory', 'warehouses', 'orders', 'suppliers', 'customers', 'reports', 'notifications', 'settings'],
    actions: ['product:write', 'product:delete', 'inventory:write', 'warehouse:write', 'warehouse:transfer', 'order:write', 'order:cancel', 'supplier:write', 'customer:write', 'reports:view'],
  },
  STAFF: {
    pages: ['dashboard', 'products', 'inventory', 'orders', 'notifications'],
    actions: ['inventory:write', 'order:write'],
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const login = async (email, password) => {
    const u = await authService.login(email, password);
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const u = await authService.register(data);
    setUser(u);
    return u;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const canAccessPage = (page) => !!user && ROLE_PERMISSIONS[user.role]?.pages.includes(page);
  const can = (action) => !!user && ROLE_PERMISSIONS[user.role]?.actions.includes(action);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, canAccessPage, can, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
