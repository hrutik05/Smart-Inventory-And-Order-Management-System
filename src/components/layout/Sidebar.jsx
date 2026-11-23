import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tags, Boxes, Warehouse, ShoppingCart, Truck, Users,
  BarChart3, Bell, UserCog, Settings, LogOut, ChevronsLeft, ChevronsRight, PackageSearch,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { key: 'products', label: 'Products', icon: Package, path: '/products' },
  { key: 'categories', label: 'Categories', icon: Tags, path: '/categories' },
  { key: 'inventory', label: 'Inventory', icon: Boxes, path: '/inventory' },
  { key: 'warehouses', label: 'Warehouses', icon: Warehouse, path: '/warehouses' },
  { key: 'orders', label: 'Orders', icon: ShoppingCart, path: '/orders' },
  { key: 'suppliers', label: 'Suppliers', icon: Truck, path: '/suppliers' },
  { key: 'customers', label: 'Customers', icon: Users, path: '/customers' },
  { key: 'reports', label: 'Reports & Analytics', icon: BarChart3, path: '/reports' },
  { key: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
  { key: 'users', label: 'User Management', icon: UserCog, path: '/users', adminOnly: true },
  { key: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  const { user, canAccessPage, logout } = useAuth();
  const navigate = useNavigate();

  const items = NAV_ITEMS.filter((item) => canAccessPage(item.key) && !(item.adminOnly && user?.role !== 'ADMIN'));

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/login');
  };

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-navy-950/50 backdrop-blur-sm lg:hidden" onClick={onCloseMobile} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-navy-900 dark:bg-navy-950 border-r border-navy-800 transition-all duration-300 lg:static lg:translate-x-0 ${
          collapsed ? 'w-[72px]' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className={`flex h-16 items-center gap-3 border-b border-navy-800 px-4 shrink-0 ${collapsed ? 'justify-center px-0' : ''}`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
            <PackageSearch size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">StockPilot</p>
              <p className="truncate text-[11px] text-navy-300">Inventory Suite</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-0.5">
          {items.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              end={item.path === '/'}
              onClick={onCloseMobile}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  collapsed ? 'justify-center px-0' : ''
                } ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-navy-200 hover:bg-navy-800 hover:text-white'
                }`
              }
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-navy-800 p-2 space-y-0.5">
          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-200 hover:bg-navy-800 hover:text-white transition ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && 'Logout'}
          </button>
          <button
            onClick={onToggle}
            className={`hidden w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-300 hover:bg-navy-800 hover:text-white transition lg:flex ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            {!collapsed && 'Collapse'}
          </button>
        </div>
      </aside>
    </>
  );
}
