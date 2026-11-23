import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, PackageSearch } from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  PageHeader, Modal, ConfirmDialog, EmptyState, TableSkeleton, Pagination, StockBadge, ErrorState,
} from '../../components/common/CommonComponents';
import { formatCurrency, formatDate } from '../../utils/format';

const EMPTY_FORM = {
  name: '', sku: '', description: '', categoryId: '', brand: '',
  purchasePrice: '', sellingPrice: '', quantity: '', minStockLevel: '', warehouseId: '', imageUrl: '',
};

export default function Products() {
  const { can } = useAuth();
  const [searchParams] = useSearchParams();
  const [rows, setRows] = useState(null);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [sort, setSort] = useState({ by: 'name', dir: 'asc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(false);
  const pageSize = 10;

  const load = () => {
    setError(false);
    setRows(null);
    Promise.all([
      productService.list({ page, pageSize, search, categoryId: categoryFilter || null, stockStatus: stockFilter || null, sortBy: sort.by, sortDir: sort.dir }),
      categoryService.list(),
    ])
      .then(([res, cats]) => {
        setRows(res.data);
        setTotal(res.total);
        setCategories(cats);
      })
      .catch(() => setError(true));
  };

  useEffect(load, [page, search, categoryFilter, stockFilter, sort]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name, sku: p.sku, description: p.description || '', categoryId: String(p.categoryId),
      brand: p.brand, purchasePrice: String(p.purchasePrice), sellingPrice: String(p.sellingPrice),
      quantity: String(p.quantity), minStockLevel: String(p.minStockLevel), warehouseId: String(p.warehouseId),
      imageUrl: p.imageUrl || '',
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.sku.trim()) e.sku = 'SKU is required';
    else if (!editing && rows?.some((r) => r.sku === form.sku.trim())) e.sku = 'SKU already exists';
    if (!form.categoryId) e.categoryId = 'Category is required';
    if (!form.warehouseId) e.warehouseId = 'Warehouse is required';
    for (const f of ['purchasePrice', 'sellingPrice']) {
      if (form[f] === '' || isNaN(Number(form[f])) || Number(form[f]) < 0) e[f] = 'Enter a valid amount';
    }
    for (const f of ['quantity', 'minStockLevel']) {
      if (form[f] === '' || !Number.isInteger(Number(form[f])) || Number(form[f]) < 0) e[f] = 'Enter a whole number';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      description: form.description.trim(),
      categoryId: Number(form.categoryId),
      brand: form.brand.trim(),
      purchasePrice: Number(form.purchasePrice),
      sellingPrice: Number(form.sellingPrice),
      quantity: Number(form.quantity),
      minStockLevel: Number(form.minStockLevel),
      warehouseId: Number(form.warehouseId),
      imageUrl: form.imageUrl.trim() || null,
    };
    try {
      if (editing) {
        await productService.update(editing.id, payload);
        toast.success('Product updated');
      } else {
        await productService.create(payload);
        toast.success('Product created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
    }
  };

  const handleDelete = async () => {
    try {
      await productService.remove(deleting.id);
      toast.success('Product deleted');
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const toggleSort = (by) => {
    setSort((s) => ({ by, dir: s.by === by && s.dir === 'asc' ? 'desc' : 'asc' }));
  };

  const SortHeader = ({ label, field }) => (
    <th className="table-th cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200" onClick={() => toggleSort(field)}>
      {label} {sort.by === field && (sort.dir === 'asc' ? '↑' : '↓')}
    </th>
  );

  const field = (label, key, props = {}) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">{label}</label>
      <input
        className="input"
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        {...props}
      />
      {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${total} products in catalog`}
        actions={can('product:write') ? (
          <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Product</button>
        ) : null}
      />

      <div className="card mb-4 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <form
            onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }}
            className="relative"
          >
            <input
              className="input"
              placeholder="Search by name or SKU…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
          <select className="input" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="input" value={stockFilter} onChange={(e) => { setStockFilter(e.target.value); setPage(1); }}>
            <option value="">All Stock Statuses</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {error ? (
          <ErrorState message="Could not load products." onRetry={load} />
        ) : rows === null ? (
          <TableSkeleton />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No products found"
            message="Try adjusting your search or filters, or add a new product."
            action={can('product:write') ? <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Add Product</button> : null}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px]">
                <thead className="bg-slate-50 dark:bg-navy-800/50 border-b border-slate-200 dark:border-navy-800">
                  <tr>
                    <SortHeader label="Product" field="name" />
                    <SortHeader label="SKU" field="sku" />
                    <th className="table-th">Category</th>
                    <SortHeader label="Price" field="sellingPrice" />
                    <SortHeader label="Qty" field="quantity" />
                    <th className="table-th">Stock Status</th>
                    <th className="table-th text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
                  {rows.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-navy-800/50 transition">
                      <td className="table-td">
                        <p className="font-medium text-slate-900 dark:text-white">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.brand}</p>
                      </td>
                      <td className="table-td font-mono text-xs">{p.sku}</td>
                      <td className="table-td">{categories.find((c) => c.id === p.categoryId)?.name || '—'}</td>
                      <td className="table-td">{formatCurrency(p.sellingPrice)}</td>
                      <td className="table-td">{p.quantity}</td>
                      <td className="table-td"><StockBadge status={productService.stockStatus(p)} /></td>
                      <td className="table-td">
                        <div className="flex justify-end gap-1">
                          <button className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition" title="View" onClick={() => setDetail(p)}>
                            <Eye size={16} />
                          </button>
                          {can('product:write') && (
                            <button className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition" title="Edit" onClick={() => openEdit(p)}>
                              <Pencil size={16} />
                            </button>
                          )}
                          {can('product:delete') && (
                            <button className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition" title="Delete" onClick={() => setDeleting(p)}>
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pageSize={pageSize} total={total} onPage={setPage} />
          </>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Product' : 'Add Product'}
        wide
        footer={
          <>
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>{editing ? 'Save Changes' : 'Create Product'}</button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field('Product Name *', 'name', { placeholder: 'e.g. Wireless Mouse' })}
          {field('SKU *', 'sku', { placeholder: 'e.g. ELEC-WM-001' })}
          {field('Brand', 'brand', { placeholder: 'e.g. TechGear' })}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Category *</label>
            <select className="input" value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
              <option value="">Select category…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>}
          </div>
          {field('Purchase Price ($) *', 'purchasePrice', { type: 'number', step: '0.01', min: '0' })}
          {field('Selling Price ($) *', 'sellingPrice', { type: 'number', step: '0.01', min: '0' })}
          {field('Available Quantity *', 'quantity', { type: 'number', min: '0' })}
          {field('Minimum Stock Level *', 'minStockLevel', { type: 'number', min: '0' })}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Warehouse *</label>
            <WarehouseSelect form={form} setForm={setForm} />
            {errors.warehouseId && <p className="mt-1 text-xs text-red-600">{errors.warehouseId}</p>}
          </div>
          {field('Image URL', 'imageUrl', { placeholder: 'https://… (optional)' })}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Description</label>
            <textarea className="input" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
        </div>
      </Modal>

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Product Details">
        {detail && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600">
                <PackageSearch size={24} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{detail.name}</p>
                <p className="text-xs text-slate-500 font-mono">{detail.sku}</p>
              </div>
            </div>
            {detail.description && <p className="text-slate-600 dark:text-slate-300">{detail.description}</p>}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 dark:border-navy-800 pt-3">
              <Detail label="Category" value={categories.find((c) => c.id === detail.categoryId)?.name} />
              <Detail label="Brand" value={detail.brand} />
              <Detail label="Purchase Price" value={formatCurrency(detail.purchasePrice)} />
              <Detail label="Selling Price" value={formatCurrency(detail.sellingPrice)} />
              <Detail label="Quantity" value={String(detail.quantity)} />
              <Detail label="Min Stock Level" value={String(detail.minStockLevel)} />
              <div className="col-span-2"><Detail label="Stock Status" value={<StockBadge status={productService.stockStatus(detail)} />} /></div>
              <Detail label="Created" value={formatDate(detail.createdAt)} />
              <Detail label="Last Updated" value={formatDate(detail.updatedAt)} />
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete product?"
        message={`"${deleting?.name}" will be permanently removed from the catalog. This cannot be undone.`}
      />
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{value || '—'}</p>
    </div>
  );
}

function WarehouseSelect({ form, setForm }) {
  const [warehouses, setWarehouses] = useState([]);
  useEffect(() => {
    import('../../services/dataService').then((m) => m.warehouseService.list().then(setWarehouses));
  }, []);
  return (
    <select className="input" value={form.warehouseId} onChange={(e) => setForm((f) => ({ ...f, warehouseId: e.target.value }))}>
      <option value="">Select warehouse…</option>
      {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name} ({w.code})</option>)}
    </select>
  );
}
