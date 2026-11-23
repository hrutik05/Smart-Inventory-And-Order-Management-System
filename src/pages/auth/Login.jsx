import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PackageSearch, Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return setError('Please enter your email and password');
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-navy-950 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600">
            <PackageSearch size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">StockPilot</h1>
            <p className="text-xs text-slate-500">Inventory & Order Management</p>
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Sign in to your account</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Enter your credentials to continue</p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3.5 py-2.5 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  className="input pl-9"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pl-9 pr-16"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Forgot password?</Link>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              <LogIn size={16} /> {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 rounded-lg bg-slate-50 dark:bg-navy-800/60 border border-slate-200 dark:border-navy-800 p-3 text-xs text-slate-600 dark:text-slate-300">
            <p className="font-medium mb-1">Demo accounts (password: password123)</p>
            <p>admin@inventory.com · manager@inventory.com · staff@inventory.com</p>
          </div>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
