import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-navy-950 p-4">
      <div className="text-center card p-10 max-w-md">
        <div className="mx-auto rounded-full bg-indigo-100 dark:bg-indigo-500/15 p-4 w-16 h-16 flex items-center justify-center mb-4">
          <Compass size={30} className="text-indigo-600" />
        </div>
        <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">404</p>
        <h1 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary mt-6">Back to Dashboard</Link>
      </div>
    </div>
  );
}
