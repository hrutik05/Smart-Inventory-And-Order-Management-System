import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageSearch, Mail, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address');
    setError('');
    setSent(true);
    toast.success('Reset instructions sent');
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
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Forgot password</h2>
          {sent ? (
            <>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                If an account exists for <span className="font-medium">{email}</span>, we've sent reset instructions. Check your inbox.
              </p>
              <Link to="/login" className="btn-primary w-full mt-5">Back to Sign In</Link>
            </>
          ) : (
            <>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Enter your email and we'll send you a reset link.</p>
              {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
              <form onSubmit={submit} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" className="input pl-9" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full"><KeyRound size={16} /> Send Reset Link</button>
              </form>
              <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
                <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Back to Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
