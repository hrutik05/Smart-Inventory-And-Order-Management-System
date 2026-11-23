import { useState } from 'react';
import { Save, Moon, Sun, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { PageHeader } from '../../components/common/CommonComponents';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();
  const [profile, setProfile] = useState({ fullName: user?.fullName || '', email: user?.email || '', phone: user?.phone || '' });
  const [company, setCompany] = useState({ name: 'StockPilot Commerce Inc', currency: 'USD', lowStockThreshold: '10' });

  const saveProfile = () => toast.success('Profile saved');
  const saveCompany = () => toast.success('Company settings saved');

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account and application preferences" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Profile</h3>
          <div className="space-y-4">
            {[
              ['Full Name', 'fullName'],
              ['Email', 'email', 'email'],
              ['Phone', 'phone'],
            ].map(([label, key, type]) => (
              <div key={key}>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">{label}</label>
                <input className="input" type={type || 'text'} value={profile[key]} onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Role</label>
              <input className="input" value={user?.role || ''} disabled />
            </div>
            <button className="btn-primary" onClick={saveProfile}><Save size={15} /> Save Profile</button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <Building2 size={17} className="text-indigo-600" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Company</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Company Name</label>
                <input className="input" value={company.name} onChange={(e) => setCompany((c) => ({ ...c, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Currency</label>
                  <select className="input" value={company.currency} onChange={(e) => setCompany((c) => ({ ...c, currency: e.target.value }))}>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Default Low-Stock Threshold</label>
                  <input className="input" type="number" min="0" value={company.lowStockThreshold} onChange={(e) => setCompany((c) => ({ ...c, lowStockThreshold: e.target.value }))} />
                </div>
              </div>
              <button className="btn-primary" onClick={saveCompany}><Save size={15} /> Save Company</button>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Appearance</h3>
            <button className="btn-secondary" onClick={toggle}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
              {dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
