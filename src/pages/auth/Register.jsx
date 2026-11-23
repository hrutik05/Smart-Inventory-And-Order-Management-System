import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PackageSearch, Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setError('');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created — welcome!');
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
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
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create your account</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">New accounts start with Staff access</p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3.5 py-2.5 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="mt-5 space-y-4">
            {[
              ['Full Name', 'fullName', User, 'Alex Morgan'],
              ['Email', 'email', Mail, 'you@company.com', 'email'],
              ['Phone', 'phone', Phone, '+1 555-0100', 'tel'],
            ].map(([label, key, Icon, ph, type]) => (
              <div key={key}>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">{label}</label>
                <div className="relative">
                  <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={type || 'text'}
                    className="input pl-9"
                    placeholder={ph}
                    value={form[key]}
                    onChange={set(key)}
                  />
                </div>
                {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
              </div>
            ))}

            {[
              ['Password', 'password', 'At least 8 characters'],
              ['Confirm Password', 'confirmPassword', ''],
            ].map(([label, key, ph]) => (
              <div key={key}>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">{label}</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input pl-9"
                    placeholder={ph}
                    value={form[key]}
                    onChange={set(key)}
                  />
                </div>
                {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
              </div>
            ))}

            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />
              Show passwords
            </label>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              <UserPlus size={16} /> {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
