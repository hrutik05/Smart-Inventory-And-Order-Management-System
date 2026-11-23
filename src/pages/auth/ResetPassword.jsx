import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (confirmPassword !== password) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    toast.success('Password reset — sign in with your new password');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-navy-950 p-4">
      <div className="w-full max-w-md card p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Set a new password</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {token ? `Reset token: ${token.slice(0, 12)}…` : 'Choose a strong password for your account.'}
        </p>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">New Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="password" className="input pl-9" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Confirm Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="password" className="input pl-9" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
          </div>
          <button type="submit" className="btn-primary w-full"><KeyRound size={16} /> Reset Password</button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
