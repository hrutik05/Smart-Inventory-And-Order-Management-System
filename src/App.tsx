import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Products from './pages/products/Products';
import Categories from './pages/categories/Categories';
import Inventory from './pages/inventory/Inventory';
import Warehouses from './pages/warehouses/Warehouses';
import Orders from './pages/orders/Orders';
import Suppliers from './pages/suppliers/Suppliers';
import Customers from './pages/customers/Customers';
import Reports from './pages/reports/Reports';
import Notifications from './pages/notifications/Notifications';
import UserManagement from './pages/users/UserManagement';
import Settings from './pages/settings/Settings';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Unauthorized from './pages/auth/Unauthorized';
import NotFound from './pages/auth/NotFound';
import { Skeleton } from './components/common/CommonComponents';
import { useTheme } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-navy-950">
        <div className="w-64 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function RequirePage({ pageKey, children }) {
  const { canAccessPage } = useAuth();
  if (!canAccessPage(pageKey)) return <Navigate to="/unauthorized" replace />;
  return children;
}

function ToastThemeSync() {
  const { dark } = useTheme();
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: dark ? '#102a43' : '#ffffff',
          color: dark ? '#e2e8f0' : '#1e293b',
          border: `1px solid ${dark ? '#243b53' : '#e2e8f0'}`,
        },
      }}
    />
  );
}

function PageTitleSync() {
  const location = useLocation();
  useEffect(() => {
    const segment = location.pathname.split('/').filter(Boolean)[0];
    document.title = segment
      ? `${segment.charAt(0).toUpperCase() + segment.slice(1)} · StockPilot`
      : 'Dashboard · StockPilot';
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <PageTitleSync />
          <ToastThemeSync />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route
              path="/"
              element={
                <RequireAuth>
                  <DashboardLayout />
                </RequireAuth>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<RequirePage pageKey="products"><Products /></RequirePage>} />
              <Route path="categories" element={<RequirePage pageKey="categories"><Categories /></RequirePage>} />
              <Route path="inventory" element={<RequirePage pageKey="inventory"><Inventory /></RequirePage>} />
              <Route path="warehouses" element={<RequirePage pageKey="warehouses"><Warehouses /></RequirePage>} />
              <Route path="orders" element={<RequirePage pageKey="orders"><Orders /></RequirePage>} />
              <Route path="suppliers" element={<RequirePage pageKey="suppliers"><Suppliers /></RequirePage>} />
              <Route path="customers" element={<RequirePage pageKey="customers"><Customers /></RequirePage>} />
              <Route path="reports" element={<RequirePage pageKey="reports"><Reports /></RequirePage>} />
              <Route path="notifications" element={<RequirePage pageKey="notifications"><Notifications /></RequirePage>} />
              <Route path="users" element={<RequirePage pageKey="users"><UserManagement /></RequirePage>} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
