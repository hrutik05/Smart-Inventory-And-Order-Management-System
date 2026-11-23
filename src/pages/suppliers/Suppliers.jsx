import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Mail, Phone, MapPin, Truck, FileText } from 'lucide-react';
import { supplierService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { PageHeader, Modal, ConfirmDialog, EmptyState, ErrorState } from '../../components/common/CommonComponents';

const EMPTY_FORM = { name: '', companyName: '', email: '', phone: '', address: '', gstNumber: '' };

export default function Suppliers() {
  const { can } = useAuth();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const load = () => {
    setError(false);
    setRows(null);
    supplierService.list().then(setRows).catch(() => setError(true));
  };
  useEffect(load, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); };
  const openEdit = (s) => {
    setEditing(s);
    setForm({ name: s.name, companyName: s.companyName, email: s.email, phone: s.phone, address: s.address, gstNumber: s.gstNumber });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Supplier name is required';
    if (!form.companyName.trim()) e.companyName = 'Company name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      if (editing) { await supplierService.update(editing.id, form); toast.success('Supplier updated'); }
      else { await supplierService.create(form); toast.success('Supplier added'); }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    }
  };

  const handleDelete = async () => {
    await supplierService.remove(deleting.id);
    toast.success('Supplier deleted');
    setDeleting(null);
    load();
  };

  const filtered = (rows || []).filter((s) =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.companyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Suppliers"
        subtitle={`${rows?.length || 0} suppliers`}
        actions={can('supplier:write') ? (
          <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Supplier</button>
        ) : null}
      />

      <div className="card mb-4 p-4">
        <input className="input" placeholder="Search suppliers…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {error ? (
        <ErrorState message="Could not load suppliers." onRetry={load} />
      ) : rows === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="card p-5"><div className="animate-pulse h-28" /></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Truck} title="No suppliers" message="Add your first supplier to start tracking purchase orders." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <div key={s.id} className="card p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100 dark:bg-indigo-500/15 p-2.5 text-indigo-600"><Truck size={20} /></div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{s.name}</h3>
                    <p className="text-xs text-slate-500">{s.companyName}</p>
                  </div>
                </div>
                {can('supplier:write') && (
                  <div className="flex gap-1">
                    <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 transition" onClick={() => openEdit(s)}><Pencil size={15} /></button>
                    <button className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition" onClick={() => setDeleting(s)}><Trash2 size={15} /></button>
                  </div>
                )}
              </div>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-4">
                <p className="flex items-center gap-1.5"><Mail size={13} className="text-slate-400" /> {s.email}</p>
                <p className="flex items-center gap-1.5"><Phone size={13} className="text-slate-400" /> {s.phone}</p>
                <p className="flex items-center gap-1.5"><MapPin size={13} className="text-slate-400" /> {s.address}</p>
              </div>
              <button className="w-full btn-secondary" onClick={() => setDetail(s)}><FileText size={15} /> View Details</button>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Supplier' : 'Add Supplier'}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Create'}</button>
          </>
        }
      >
        <div className="space-y-4">
          {[
            ['Supplier Name *', 'name'],
            ['Company Name *', 'companyName'],
            ['Email *', 'email', 'email'],
            ['Phone', 'phone'],
            ['Address', 'address'],
            ['GST Number', 'gstNumber'],
          ].map(([label, key, type]) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">{label}</label>
              <input className="input" type={type || 'text'} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
              {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
            </div>
          ))}
        </div>
      </Modal>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.companyName || 'Supplier Details'}>
        {detail && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div><p className="text-xs text-slate-500">Contact</p><p className="font-medium">{detail.name}</p></div>
              <div><p className="text-xs text-slate-500">Email</p><p className="font-medium">{detail.email}</p></div>
              <div><p className="text-xs text-slate-500">Phone</p><p className="font-medium">{detail.phone || '—'}</p></div>
              <div><p className="text-xs text-slate-500">GST Number</p><p className="font-medium">{detail.gstNumber || '—'}</p></div>
              <div className="col-span-2"><p className="text-xs text-slate-500">Address</p><p className="font-medium">{detail.address || '—'}</p></div>
            </div>
            <div className="border-t border-slate-100 dark:border-navy-800 pt-3">
              <p className="text-xs text-slate-500 mb-2">Supplied Products</p>
              {detail.suppliedProducts?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {detail.suppliedProducts.map((p) => (
                    <span key={p} className="rounded-full bg-slate-100 dark:bg-navy-800 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300">{p}</span>
                  ))}
                </div>
              ) : <p className="text-xs text-slate-400">No products linked yet.</p>}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete}
        title="Delete supplier?"
        message={`"${deleting?.name}" will be permanently removed. This cannot be undone.`}
      />
    </div>
  );
}
