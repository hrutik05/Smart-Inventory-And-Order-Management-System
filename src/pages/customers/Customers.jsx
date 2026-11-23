import { useEffect, useState } from 'react';
import { Plus, Pencil, Mail, Phone, MapPin, Users, Eye, ShoppingCart } from 'lucide-react';
import { customerService } from '../../services/dataService';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { PageHeader, Modal, EmptyState, OrderStatusBadge, ErrorState } from '../../components/common/CommonComponents';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/format';

const EMPTY_FORM = { name: '', email: '', phone: '', address: '' };

export default function Customers() {
  const { can } = useAuth();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileOrders, setProfileOrders] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const load = () => {
    setError(false);
    setRows(null);
    customerService.list().then(setRows).catch(() => setError(true));
  };
  useEffect(load, []);

  const openProfile = async (c) => {
    setProfile(c);
    setProfileOrders(null);
    const res = await orderService.list({ search: c.name, pageSize: 100 });
    setProfileOrders(res.data.filter((o) => o.customerId === c.id));
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, email: c.email, phone: c.phone, address: c.address });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      if (editing) { await customerService.update(editing.id, form); toast.success('Customer updated'); }
      else { await customerService.create(form); toast.success('Customer added'); }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    }
  };

  const filtered = (rows || []).filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle={`${rows?.length || 0} customers`}
        actions={can('customer:write') ? (
          <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Customer</button>
        ) : null}
      />

      <div className="card mb-4 p-4">
        <input className="input" placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {error ? (
        <ErrorState message="Could not load customers." onRetry={load} />
      ) : rows === null ? (
        <div className="card"><div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="animate-pulse h-8 rounded bg-slate-200 dark:bg-navy-800" />)} </div></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No customers" message="Add your first customer to start recording orders." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-slate-50 dark:bg-navy-800/50 border-b border-slate-200 dark:border-navy-800">
                <tr>
                  <th className="table-th">Customer</th>
                  <th className="table-th">Contact</th>
                  <th className="table-th">Location</th>
                  <th className="table-th">Total Purchases</th>
                  <th className="table-th">Since</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-navy-800/50 transition">
                    <td className="table-td">
                      <p className="font-medium text-slate-900 dark:text-white">{c.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1"><Mail size={11} /> {c.email}</p>
                    </td>
                    <td className="table-td text-xs">{c.phone || '—'}</td>
                    <td className="table-td text-xs max-w-[220px] truncate">{c.address || '—'}</td>
                    <td className="table-td font-semibold">{formatCurrency(c.totalPurchases)}</td>
                    <td className="table-td text-xs">{formatDate(c.createdAt)}</td>
                    <td className="table-td">
                      <div className="flex justify-end gap-1">
                        <button className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition" title="View profile" onClick={() => openProfile(c)}><Eye size={16} /></button>
                        {can('customer:write') && (
                          <button className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition" title="Edit" onClick={() => openEdit(c)}><Pencil size={16} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Customer' : 'Add Customer'}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Create'}</button>
          </>
        }
      >
        <div className="space-y-4">
          {[
            ['Full Name *', 'name'],
            ['Email *', 'email', 'email'],
            ['Phone', 'phone'],
            ['Address', 'address'],
          ].map(([label, key, type]) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">{label}</label>
              <input className="input" type={type || 'text'} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
              {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
            </div>
          ))}
        </div>
      </Modal>

      <Modal open={!!profile} onClose={() => setProfile(null)} title="Customer Profile" wide>
        {profile && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                {profile.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{profile.name}</p>
                <div className="text-xs text-slate-500 space-x-3">
                  <span className="inline-flex items-center gap-1"><Mail size={11} /> {profile.email}</span>
                  <span className="inline-flex items-center gap-1"><Phone size={11} /> {profile.phone || '—'}</span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={11} /> {profile.address || '—'}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-slate-500">Total Purchases</p>
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(profile.totalPurchases)}</p>
              </div>
            </div>
            <div className="border-t border-slate-100 dark:border-navy-800 pt-3">
              <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5"><ShoppingCart size={13} /> Order History</p>
              {profileOrders === null ? (
                <div className="animate-pulse h-20 rounded bg-slate-100 dark:bg-navy-800" />
              ) : profileOrders.length === 0 ? (
                <p className="text-xs text-slate-400">No orders yet.</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-navy-800">
                  {profileOrders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{o.orderNumber}</p>
                        <p className="text-[11px] text-slate-400">{formatDateTime(o.orderDate)}</p>
                      </div>
                      <OrderStatusBadge status={o.orderStatus} />
                      <p className="text-xs font-semibold">{formatCurrency(o.totalAmount)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
