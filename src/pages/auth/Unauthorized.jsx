import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-navy-950 p-4">
      <div className="text-center card p-10 max-w-md">
        <div className="mx-auto rounded-full bg-red-100 dark:bg-red-500/15 p-4 w-16 h-16 flex items-center justify-center mb-4">
          <ShieldX size={30} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Access Denied</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          You don't have permission to view this page. Contact an administrator if you believe this is a mistake.
        </p>
        <Link to="/" className="btn-primary mt-6">Back to Dashboard</Link>
      </div>
    </div>
  );
}
