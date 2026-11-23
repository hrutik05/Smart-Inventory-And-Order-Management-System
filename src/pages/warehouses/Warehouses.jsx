import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Warehouse as WarehouseIcon, Boxes } from 'lucide-react';
import { warehouseService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { PageHeader, Modal, ConfirmDialog, EmptyState, TableSkeleton, ErrorState } from '../../components/common/CommonComponents';
import { formatCurrency } from '../../utils/format';

const EMPTY_FORM = { name: '', code: '', location: '', managerName: '', contactNumber: '', totalCapacity: '' };

function OccupancyBar({ used, total }) {
  const pct = Math.min(100, Math.round((used / total) * 100));
  const color = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-600 dark:text-slate-300">{used.toLocaleString()} / {total.toLocaleString()} units</span>
        <span className={pct >= 90 ? 'text-red-600 font-medium' : 'text-slate-500'}>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-navy-800 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Warehouses() {
  const { can } = useAuth();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailInventory, setDetailInventory] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const load = () => {
    setError(false);
    setRows(null);
    warehouseService.list().then(setRows).catch(() => setError(true));
  };
  useEffect(load, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); };
  const openEdit = (w) => {
    setEditing(w);
    setForm({ name: w.name, code: w.code, location: w.location, managerName: w.managerName, contactNumber: w.contactNumber, totalCapacity: String(w.totalCapacity) });
    setErrors({});
    setModalOpen(true);
  };

  const openDetail = async (w) => {
    setDetail(w);
    setDetailInventory(null);
    const inv = await warehouseService.inventoryFor(w.id);
    setDetailInventory(inv);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.code.trim()) e.code = 'Code is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (form.totalCapacity === '' || Number(form.totalCapacity) <= 0) e.totalCapacity = 'Enter a valid capacity';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const payload = {
      name: form.name.trim(), code: form.code.trim(), location: form.location.trim(),
      managerName: form.managerName.trim(), contactNumber: form.contactNumber.trim(),
      totalCapacity: Number(form.totalCapacity),
    };
    try {
      if (editing) {
        await warehouseService.update(editing.id, payload);
        toast.success('Warehouse updated');
      } else {
        await warehouseService.create(payload);
        toast.success('Warehouse created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    }
  };

  const handleDelete = async () => {
    try {
      await warehouseService.remove(deleting.id);
      toast.success('Warehouse deleted');
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <div>
      <PageHeader
        title="Warehouses"
        subtitle="Manage storage locations and capacity"
        actions={can('warehouse:write') ? (
          <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Warehouse</button>
        ) : null}
      />

      {error ? (
        <ErrorState message="Could not load warehouses." onRetry={load} />
      ) : rows === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="card p-5"><div className="animate-pulse h-32" /></div>)}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState icon={WarehouseIcon} title="No warehouses" message="Add your first warehouse to start tracking stock." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {rows.map((w) => (
            <div key={w.id} className="card p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100 dark:bg-indigo-500/15 p-2.5 text-indigo-600">
                    <WarehouseIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{w.name}</h3>
                    <p className="text-xs text-slate-500">{w.code}</p>
                  </div>
                </div>
                {can('warehouse:write') && (
                  <div className="flex gap-1">
                    <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 transition" onClick={() => openEdit(w)}><Pencil size={15} /></button>
                    <button className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition" onClick={() => setDeleting(w)}><Trash2 size={15} /></button>
                  </div>
                )}
              </div>
              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 mb-4">
                <p><span className="text-slate-400">Location:</span> {w.location}</p>
                <p><span className="text-slate-400">Manager:</span> {w.managerName || '—'}</p>
                <p><span className="text-slate-400">Contact:</span> {w.contactNumber || '—'}</p>
              </div>
              <OccupancyBar used={w.currentOccupancy} total={w.totalCapacity} />
              <button className="mt-4 w-full btn-secondary" onClick={() => openDetail(w)}>
                <Boxes size={15} /> View Inventory
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Warehouse' : 'Add Warehouse'}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Create'}</button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ['Warehouse Name *', 'name'],
            ['Warehouse Code *', 'code', 'e.g. WH-EAST-01'],
            ['Location *', 'location'],
            ['Manager Name', 'managerName'],
            ['Contact Number', 'contactNumber'],
          ].map(([label, key, ph]) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">{label}</label>
              <input className="input" placeholder={ph || ''} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
              {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
            </div>
          ))}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Total Capacity (units) *</label>
            <input className="input" type="number" min="1" value={form.totalCapacity} onChange={(e) => setForm((f) => ({ ...f, totalCapacity: e.target.value }))} />
            {errors.totalCapacity && <p className="mt-1 text-xs text-red-600">{errors.totalCapacity}</p>}
          </div>
        </div>
      </Modal>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={`${detail?.name} — Inventory`} wide>
        {detailInventory === null ? (
          <TableSkeleton rows={4} cols={4} />
        ) : detailInventory.length === 0 ? (
          <EmptyState icon={Boxes} title="No stock here" message="This warehouse currently holds no products." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-navy-800">
                  <th className="table-th">Product</th>
                  <th className="table-th">SKU</th>
                  <th className="table-th">Quantity</th>
                  <th className="table-th">Stock Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
                {detailInventory.map((p) => (
                  <tr key={p.id}>
                    <td className="table-td">{p.name}</td>
                    <td className="table-td font-mono text-xs">{p.sku}</td>
                    <td className="table-td">{p.quantity}</td>
                    <td className="table-td">{formatCurrency(p.quantity * p.purchasePrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete warehouse?"
        message={`"${deleting?.name}" will be permanently removed. This cannot be undone.`}
      />
    </div>
  );
}

