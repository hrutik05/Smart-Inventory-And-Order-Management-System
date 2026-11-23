import { useEffect, useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, History, PackageSearch } from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import { categoryService, warehouseService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { PageHeader, Modal, EmptyState, TableSkeleton, StockBadge, ErrorState } from '../../components/common/CommonComponents';
import { formatDateTime } from '../../utils/format';

function StockOpModal({ open, onClose, type, products, warehouses, onSubmit, preselect }) {
  const [productId, setProductId] = useState(preselect || '');
  const [warehouseId, setWarehouseId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reference, setReference] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setProductId(preselect || '');
      setWarehouseId('');
      setQuantity('');
      setReference('');
      setError('');
    }
  }, [open, preselect]);

  const selected = products.find((p) => String(p.id) === String(productId));

  const submit = async () => {
    if (!productId) return setError('Select a product');
    if (!warehouseId) return setError('Select a warehouse');
    if (!quantity || Number(quantity) <= 0) return setError('Enter a valid quantity');
    setSaving(true);
    try {
      await onSubmit(Number(productId), Number(quantity), Number(warehouseId), reference.trim() || `ADJ-${Date.now()}`);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={type === 'IN' ? 'Stock In' : 'Stock Out'}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Confirm'}</button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Product *</label>
          <select className="input" value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="">Select product…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.sku}) — {p.quantity} in stock</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Warehouse *</label>
          <select className="input" value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)}>
            <option value="">Select warehouse…</option>
            {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name} ({w.code})</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Quantity *</label>
          <input className="input" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          {selected && type === 'OUT' && Number(quantity) > selected.quantity && (
            <p className="mt-1 text-xs text-red-600">Only {selected.quantity} units available</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Reference</label>
          <input className="input" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="PO number / Order number" />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </Modal>
  );
}

function TransferModal({ open, onClose, products, warehouses, onSubmit }) {
  const [productId, setProductId] = useState('');
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) { setProductId(''); setFromId(''); setToId(''); setQuantity(''); setError(''); }
  }, [open]);

  const submit = async () => {
    if (!productId) return setError('Select a product');
    if (!fromId || !toId) return setError('Select both warehouses');
    if (fromId === toId) return setError('Source and destination must differ');
    if (!quantity || Number(quantity) <= 0) return setError('Enter a valid quantity');
    setSaving(true);
    try {
      await onSubmit(Number(productId), Number(quantity), Number(fromId), Number(toId));
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Transfer Stock"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit} disabled={saving}>{saving ? 'Transferring…' : 'Transfer'}</button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Product *</label>
          <select className="input" value={productId} onChange={(e) => setProductId(e.target.value)}>
            <option value="">Select product…</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.sku}) — {p.quantity} in stock</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">From *</label>
            <select className="input" value={fromId} onChange={(e) => setFromId(e.target.value)}>
              <option value="">From…</option>
              {warehouses.map((w) => <option key={w.id} value={w.id}>{w.code}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">To *</label>
            <select className="input" value={toId} onChange={(e) => setToId(e.target.value)}>
              <option value="">To…</option>
              {warehouses.map((w) => <option key={w.id} value={w.id}>{w.code}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Quantity *</label>
          <input className="input" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </Modal>
  );
}

export default function Inventory() {
  const { can, user } = useAuth();
  const [rows, setRows] = useState(null);
  const [movements, setMovements] = useState(null);
  const [categories, setCategories] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [search, setSearch] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [opModal, setOpModal] = useState(null); // 'IN' | 'OUT'
  const [transferOpen, setTransferOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [error, setError] = useState(false);

  const load = () => {
    setError(false);
    setRows(null);
    Promise.all([
      inventoryService.list({ warehouseId: warehouseFilter || null, categoryId: categoryFilter || null, stockStatus: statusFilter || null, search }),
      inventoryService.movements(),
      categoryService.list(),
      warehouseService.list(),
    ])
      .then(([r, mv, cats, whs]) => {
        setRows(r);
        setMovements(mv);
        setCategories(cats);
        setWarehouses(whs);
      })
      .catch(() => setError(true));
  };
  useEffect(load, [search, warehouseFilter, categoryFilter, statusFilter]);

  const handleOp = (type) => async (productId, quantity, warehouseId, reference) => {
    const fn = type === 'IN' ? inventoryService.stockIn : inventoryService.stockOut;
    await fn(productId, quantity, warehouseId, reference, user?.fullName || 'Unknown');
    toast.success(type === 'IN' ? 'Stock added' : 'Stock removed');
    load();
  };

  const handleTransfer = async (productId, quantity, from, to) => {
    await inventoryService.transferStock(productId, quantity, from, to, user?.fullName || 'Unknown');
    toast.success('Stock transferred');
    load();
  };

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle="Monitor stock levels and manage movements"
        actions={
          <>
            <button className="btn-secondary" onClick={() => setHistoryOpen(true)}><History size={16} /> Movement History</button>
            {can('warehouse:transfer') && (
              <button className="btn-secondary" onClick={() => setTransferOpen(true)}><ArrowLeftRight size={16} /> Transfer</button>
            )}
            {can('inventory:write') && (
              <>
                <button className="btn-secondary" onClick={() => setOpModal('OUT')}><ArrowUpFromLine size={16} /> Stock Out</button>
                <button className="btn-primary" onClick={() => setOpModal('IN')}><ArrowDownToLine size={16} /> Stock In</button>
              </>
            )}
          </>
        }
      />

      <div className="card mb-4 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input className="input" placeholder="Search product or SKU…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="input" value={warehouseFilter} onChange={(e) => setWarehouseFilter(e.target.value)}>
            <option value="">All Warehouses</option>
            {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
          <select className="input" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {error ? (
          <ErrorState message="Could not load inventory." onRetry={load} />
        ) : rows === null ? (
          <TableSkeleton rows={6} cols={6} />
        ) : rows.length === 0 ? (
          <EmptyState icon={PackageSearch} title="No inventory items" message="Adjust your filters to see more results." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-slate-50 dark:bg-navy-800/50 border-b border-slate-200 dark:border-navy-800">
                <tr>
                  <th className="table-th">Product</th>
                  <th className="table-th">Warehouse</th>
                  <th className="table-th">Category</th>
                  <th className="table-th">Available</th>
                  <th className="table-th">Min Level</th>
                  <th className="table-th">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
                {rows.map(({ product: p, warehouse, status }) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-navy-800/50 transition">
                    <td className="table-td">
                      <p className="font-medium text-slate-900 dark:text-white">{p.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{p.sku}</p>
                    </td>
                    <td className="table-td">{warehouse?.code || '—'}</td>
                    <td className="table-td">{categories.find((c) => c.id === p.categoryId)?.name || '—'}</td>
                    <td className="table-td font-semibold">{p.quantity}</td>
                    <td className="table-td">{p.minStockLevel}</td>
                    <td className="table-td"><StockBadge status={status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {can('inventory:write') && (
        <StockOpModal
          open={!!opModal}
          onClose={() => setOpModal(null)}
          type={opModal}
          products={(rows || []).map((r) => r.product)}
          warehouses={warehouses}
          onSubmit={handleOp(opModal)}
        />
      )}
      {can('warehouse:transfer') && (
        <TransferModal
          open={transferOpen}
          onClose={() => setTransferOpen(false)}
          products={(rows || []).map((r) => r.product)}
          warehouses={warehouses}
          onSubmit={handleTransfer}
        />
      )}

      <Modal open={historyOpen} onClose={() => setHistoryOpen(false)} title="Inventory Movement History" wide>
        {movements ? (
          movements.length === 0 ? (
            <EmptyState icon={History} title="No movements yet" message="Stock in/out operations will appear here." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-navy-800">
                    <th className="table-th">Date</th>
                    <th className="table-th">Product</th>
                    <th className="table-th">Type</th>
                    <th className="table-th">Qty</th>
                    <th className="table-th">Reference</th>
                    <th className="table-th">By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
                  {movements.map((m) => (
                    <tr key={m.id}>
                      <td className="table-td text-xs">{formatDateTime(m.timestamp)}</td>
                      <td className="table-td">{m.productName}</td>
                      <td className="table-td">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          m.type === 'IN' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                          : m.type === 'OUT' ? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                          : 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400'}`}>
                          {m.type}
                        </span>
                      </td>
                      <td className="table-td">{m.quantity}</td>
                      <td className="table-td text-xs">{m.reference}</td>
                      <td className="table-td text-xs">{m.performedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <TableSkeleton rows={4} cols={5} />
        )}
      </Modal>
    </div>
  );
}
