import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, Moon, Sun, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  const initials = user?.fullName
    ?.split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 dark:border-navy-800 bg-white/90 dark:bg-navy-900/90 px-4 backdrop-blur">
      <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition lg:hidden" onClick={onMenuClick}>
        <Menu size={20} />
      </button>

      <form onSubmit={handleSearch} className="relative hidden sm:block flex-1 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input pl-9 !py-2"
          placeholder="Search products by name or SKU…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <div className="flex-1 sm:hidden" />

      <div className="flex items-center gap-1.5">
        <button
          onClick={toggle}
          className="rounded-lg p-2 text-slate-500 dark:text-navy-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition"
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={() => navigate('/notifications')}
          className="relative rounded-lg p-2 text-slate-500 dark:text-navy-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        <div className="relative ml-1" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-navy-800 transition"
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${user?.avatarColor || 'bg-indigo-600'} text-xs font-bold text-white`}>
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{user?.fullName}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{user?.role}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 py-1.5 shadow-lg">
              <div className="border-b border-slate-100 dark:border-navy-800 px-4 py-2 md:hidden">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.fullName}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
              <button className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-800 transition" onClick={() => { setProfileOpen(false); navigate('/settings'); }}>
                <User size={15} /> Profile
              </button>
              <button className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-navy-800 transition" onClick={() => { setProfileOpen(false); navigate('/settings'); }}>
                <Settings size={15} /> Settings
              </button>
              <button className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition" onClick={() => { logout(); navigate('/login'); }}>
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
