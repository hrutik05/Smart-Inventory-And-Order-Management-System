import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Tags } from 'lucide-react';
import { categoryService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { PageHeader, Modal, ConfirmDialog, EmptyState, ErrorState } from '../../components/common/CommonComponents';

export default function Categories() {
  const { can } = useAuth();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');

  const load = () => {
    setError(false);
    setRows(null);
    categoryService.list().then(setRows).catch(() => setError(true));
  };
  useEffect(load, []);

  const openAdd = () => { setEditing(null); setName(''); setDescription(''); setNameError(''); setModalOpen(true); };
  const openEdit = (c) => { setEditing(c); setName(c.name); setDescription(c.description || ''); setNameError(''); setModalOpen(true); };

  const handleSave = async () => {
    if (!name.trim()) return setNameError('Category name is required');
    try {
      if (editing) { await categoryService.update(editing.id, { name: name.trim(), description: description.trim() }); toast.success('Category updated'); }
      else { await categoryService.create({ name: name.trim(), description: description.trim() }); toast.success('Category added'); }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    }
  };

  const handleDelete = async () => {
    await categoryService.remove(deleting.id);
    toast.success('Category deleted');
    setDeleting(null);
    load();
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle={`${rows?.length || 0} product categories`}
        actions={can('product:write') ? (
          <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Category</button>
        ) : null}
      />

      {error ? (
        <ErrorState message="Could not load categories." onRetry={load} />
      ) : rows === null ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="card p-5"><div className="animate-pulse h-20" /></div>)}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState icon={Tags} title="No categories" message="Create categories to organize your products." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((c) => (
            <div key={c.id} className="card p-5 hover:shadow-card-hover transition-shadow flex items-start gap-3">
              <div className="rounded-lg bg-indigo-100 dark:bg-indigo-500/15 p-2.5 text-indigo-600 shrink-0"><Tags size={18} /></div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{c.description || 'No description'}</p>
              </div>
              {can('product:write') && (
                <div className="flex gap-1 shrink-0">
                  <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 transition" onClick={() => openEdit(c)}><Pencil size={15} /></button>
                  <button className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition" onClick={() => setDeleting(c)}><Trash2 size={15} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Category' : 'Add Category'}
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Create'}</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Category Name *</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Electronics" />
            {nameError && <p className="mt-1 text-xs text-red-600">{nameError}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Description</label>
            <textarea className="input" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete}
        title="Delete category?"
        message={`"${deleting?.name}" will be permanently removed. This cannot be undone.`}
      />
    </div>
  );
}
