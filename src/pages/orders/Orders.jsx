import { useEffect, useState } from 'react';
import { Eye, Printer, Ban, Plus, ShoppingCart } from 'lucide-react';
import { orderService, ORDER_STATUSES, PAYMENT_STATUSES } from '../../services/orderService';
import { customerService } from '../../services/dataService';
import { productService } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  PageHeader, Modal, EmptyState, TableSkeleton, Pagination, OrderStatusBadge, PaymentStatusBadge, ConfirmDialog, ErrorState,
} from '../../components/common/CommonComponents';
import { formatCurrency, formatDateTime } from '../../utils/format';

function Invoice({ order }) {
  const subtotal = order.totalAmount;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  return (
    <div id="invoice-print" className="bg-white text-slate-800 p-6 rounded-lg border border-slate-200 text-sm">
      <div className="flex justify-between mb-6">
        <div>
          <p className="text-lg font-bold text-indigo-700">StockPilot</p>
          <p className="text-xs text-slate-500">Inventory & Order Management</p>
        </div>
        <div className="text-right">
          <p className="font-bold">INVOICE</p>
          <p className="text-xs text-slate-500">{order.orderNumber}</p>
          <p className="text-xs text-slate-500">{formatDateTime(order.orderDate)}</p>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-xs uppercase text-slate-400 mb-0.5">Bill To</p>
        <p className="font-medium">{order.customerName}</p>
        <p className="text-xs text-slate-500">{order.shippingAddress}</p>
      </div>
      <table className="w-full mb-4">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-400">
            <th className="py-1.5">Item</th><th className="py-1.5">Qty</th><th className="py-1.5">Unit</th><th className="py-1.5 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((it, i) => (
            <tr key={i} className="border-b border-slate-100">
              <td className="py-1.5">{it.productName}</td>
              <td className="py-1.5">{it.quantity}</td>
              <td className="py-1.5">{formatCurrency(it.unitPrice)}</td>
              <td className="py-1.5 text-right">{formatCurrency(it.quantity * it.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="ml-auto w-44 space-y-1">
        <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Tax (8%)</span><span>{formatCurrency(tax)}</span></div>
        <div className="flex justify-between font-bold border-t border-slate-200 pt-1"><span>Total</span><span>{formatCurrency(subtotal + tax)}</span></div>
      </div>
      <div className="mt-6 flex justify-between items-center text-xs">
        <span>Payment Method: {order.paymentMethod}</span>
        <span className="font-medium">Payment Status: {order.paymentStatus}</span>
      </div>
    </div>
  );
}

function OrderDetail({ order, canWrite, onStatusChange, onPaymentChange, onCancel }) {
  return (
    <div className="space-y-5 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500">Order ID</p>
          <p className="font-semibold text-slate-900 dark:text-white">{order.orderNumber}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Order Date</p>
          <p className="font-medium">{formatDateTime(order.orderDate)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Customer</p>
          <p className="font-medium">{order.customerName}</p>
          <p className="text-xs text-slate-500">{order.shippingAddress}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Payment</p>
          <p className="font-medium">{order.paymentMethod}</p>
          <div className="mt-1"><PaymentStatusBadge status={order.paymentStatus} /></div>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-navy-800 pt-3">
        <p className="text-xs text-slate-500 mb-2">Items</p>
        <table className="w-full">
          <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
            {order.items.map((it, i) => (
              <tr key={i}>
                <td className="py-1.5">
                  <p className="font-medium text-slate-800 dark:text-slate-200">{it.productName}</p>
                  <p className="text-xs text-slate-400 font-mono">{it.sku}</p>
                </td>
                <td className="py-1.5 text-center">×{it.quantity}</td>
                <td className="py-1.5 text-right">{formatCurrency(it.quantity * it.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-2 font-bold text-slate-900 dark:text-white">
          <span>Total</span><span>{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-navy-800 pt-3">
        <p className="text-xs text-slate-500 mb-2">Order Timeline</p>
        <ol className="space-y-2.5">
          {order.timeline.map((t, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
              <div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{t.status}</p>
                <p className="text-[11px] text-slate-400">{formatDateTime(t.timestamp)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {canWrite && (
        <div className="border-t border-slate-100 dark:border-navy-800 pt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Order Status</label>
            <select
              className="input"
              value={order.orderStatus}
              onChange={(e) => onStatusChange(order.id, e.target.value)}
              disabled={order.orderStatus === 'CANCELLED' || order.orderStatus === 'DELIVERED'}
            >
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Payment Status</label>
            <select className="input" value={order.paymentStatus} onChange={(e) => onPaymentChange(order.id, e.target.value)}>
              {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'DELIVERED' && (
            <button className="btn-danger col-span-2" onClick={() => onCancel(order)}><Ban size={15} /> Cancel Order</button>
          )}
        </div>
      )}
    </div>
  );
}

function NewOrderModal({ open, onClose, customers, onCreated }) {
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [productResults, setProductResults] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) { setCustomerId(''); setItems([]); setProductSearch(''); setProductResults([]); setError(''); }
  }, [open]);

  useEffect(() => {
    if (!productSearch.trim()) { setProductResults([]); return; }
    let alive = true;
    productService.list({ search: productSearch, pageSize: 5 }).then((res) => {
      if (alive) setProductResults(res.data);
    });
    return () => { alive = false; };
  }, [productSearch]);

  const addItem = (p) => {
    if (!items.find((it) => it.productId === p.id)) {
      setItems((xs) => [...xs, { productId: p.id, productName: p.name, sku: p.sku, quantity: 1, unitPrice: p.sellingPrice }]);
    }
    setProductSearch('');
    setProductResults([]);
  };

  const total = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);

  const submit = async () => {
    if (!customerId) return setError('Select a customer');
    if (items.length === 0) return setError('Add at least one product');
    setSaving(true);
    try {
      const cust = customers.find((c) => String(c.id) === customerId);
      await onCreated({
        customerId: cust.id,
        customerName: cust.name,
        shippingAddress: cust.address,
        items,
        totalAmount: Math.round(total * 100) / 100,
        paymentMethod: 'Credit Card',
        paymentStatus: 'PENDING',
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create order');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open} onClose={onClose} title="New Order" wide
      footer={
        <>
          <span className="mr-auto text-sm font-medium text-slate-700 dark:text-slate-200">Total: {formatCurrency(total)}</span>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit} disabled={saving}>{saving ? 'Creating…' : 'Create Order'}</button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Customer *</label>
          <select className="input" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Select customer…</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Add Products *</label>
          <input
            className="input" placeholder="Type to search products…" value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />
          {productResults.length > 0 && (
            <div className="mt-1 border border-slate-200 dark:border-navy-700 rounded-lg divide-y divide-slate-100 dark:divide-navy-800 max-h-40 overflow-y-auto">
              {productResults.map((p) => (
                <button key={p.id} className="w-full flex justify-between px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-navy-800 transition" onClick={() => addItem(p)}>
                  <span>{p.name} <span className="font-mono text-slate-400">{p.sku}</span></span>
                  <span className="font-medium">{formatCurrency(p.sellingPrice)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div className="border border-slate-200 dark:border-navy-700 rounded-lg divide-y divide-slate-100 dark:divide-navy-800">
            {items.map((it) => (
              <div key={it.productId} className="flex items-center gap-3 px-3 py-2 text-xs">
                <span className="flex-1">{it.productName}</span>
                <input
                  type="number" min="1" className="input !w-16 !py-1 text-center" value={it.quantity}
                  onChange={(e) => setItems((xs) => xs.map((x) => x.productId === it.productId ? { ...x, quantity: Math.max(1, Number(e.target.value) || 1) } : x))}
                />
                <span className="w-20 text-right font-medium">{formatCurrency(it.quantity * it.unitPrice)}</span>
                <button className="text-red-500 hover:text-red-700" onClick={() => setItems((xs) => xs.filter((x) => x.productId !== it.productId))}><X size={14} /></button>
              </div>
            ))}
          </div>
        )}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </Modal>
  );
}

export default function Orders() {
  const { can } = useAuth();
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [detail, setDetail] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [newOpen, setNewOpen] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState(false);
  const pageSize = 10;

  const load = () => {
    setError(false);
    setData(null);
    Promise.all([
      orderService.list({ page, pageSize, search, orderStatus: statusFilter || null, paymentStatus: paymentFilter || null }),
      customerService.list(),
    ])
      .then(([res, custs]) => {
        let rows = res.data;
        if (dateFilter) {
          rows = rows.filter((o) => o.orderDate.startsWith(dateFilter));
        }
        setData(rows);
        setTotal(dateFilter ? rows.length : res.total);
        setCustomers(custs);
      })
      .catch(() => setError(true));
  };
  useEffect(load, [page, search, statusFilter, paymentFilter, dateFilter]);

  const refreshDetail = async (id) => {
    const o = await orderService.get(id);
    setDetail(o);
    load();
  };

  const handleStatus = async (id, status) => {
    await orderService.updateStatus(id, status);
    toast.success(`Order marked as ${status}`);
    refreshDetail(id);
  };

  const handlePayment = async (id, ps) => {
    await orderService.updatePaymentStatus(id, ps);
    toast.success('Payment status updated');
    refreshDetail(id);
  };

  const handleCancel = async () => {
    await orderService.updateStatus(cancelling.id, 'CANCELLED');
    toast.success('Order cancelled');
    setCancelling(null);
    if (detail?.id === cancelling.id) setDetail(null);
    load();
  };

  const printInvoice = () => window.print();

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle={`${total} orders`}
        actions={can('order:write') ? (
          <button className="btn-primary" onClick={() => setNewOpen(true)}><Plus size={16} /> New Order</button>
        ) : null}
      />

      <div className="card mb-4 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input className="input" placeholder="Search by order ID or customer…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <select className="input" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Order Statuses</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="input" value={paymentFilter} onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}>
            <option value="">All Payment Statuses</option>
            {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="date" className="input" value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setPage(1); }} />
        </div>
      </div>

      <div className="card overflow-hidden">
        {error ? (
          <ErrorState message="Could not load orders." onRetry={load} />
        ) : data === null ? (
          <TableSkeleton rows={6} cols={6} />
        ) : data.length === 0 ? (
          <EmptyState icon={ShoppingCart} title="No orders found" message="Try adjusting your search or filters." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px]">
                <thead className="bg-slate-50 dark:bg-navy-800/50 border-b border-slate-200 dark:border-navy-800">
                  <tr>
                    <th className="table-th">Order</th>
                    <th className="table-th">Customer</th>
                    <th className="table-th">Date</th>
                    <th className="table-th">Total</th>
                    <th className="table-th">Order Status</th>
                    <th className="table-th">Payment</th>
                    <th className="table-th text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
                  {data.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-navy-800/50 transition">
                      <td className="table-td font-medium text-indigo-600 dark:text-indigo-400">{o.orderNumber}</td>
                      <td className="table-td">{o.customerName}</td>
                      <td className="table-td text-xs">{formatDateTime(o.orderDate)}</td>
                      <td className="table-td font-medium">{formatCurrency(o.totalAmount)}</td>
                      <td className="table-td"><OrderStatusBadge status={o.orderStatus} /></td>
                      <td className="table-td"><PaymentStatusBadge status={o.paymentStatus} /></td>
                      <td className="table-td">
                        <div className="flex justify-end gap-1">
                          <button className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition" title="View details" onClick={async () => setDetail(await orderService.get(o.id))}>
                            <Eye size={16} />
                          </button>
                          <button className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition" title="Invoice" onClick={() => setInvoice(o)}>
                            <Printer size={16} />
                          </button>
                          {can('order:cancel') && o.orderStatus !== 'CANCELLED' && o.orderStatus !== 'DELIVERED' && (
                            <button className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition" title="Cancel order" onClick={() => setCancelling(o)}>
                              <Ban size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!dateFilter && <Pagination page={page} pageSize={pageSize} total={total} onPage={setPage} />}
          </>
        )}
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={`Order ${detail?.orderNumber || ''}`} wide>
        {detail && (
          <OrderDetail
            order={detail}
            canWrite={can('order:write')}
            onStatusChange={handleStatus}
            onPaymentChange={handlePayment}
            onCancel={(o) => setCancelling(o)}
          />
        )}
      </Modal>

      <Modal open={!!invoice} onClose={() => setInvoice(null)} title="Invoice" wide>
        {invoice && (
          <>
            <Invoice order={invoice} />
            <div className="mt-4 flex justify-end print:hidden">
              <button className="btn-primary" onClick={printInvoice}><Printer size={15} /> Print / Download</button>
            </div>
          </>
        )}
      </Modal>

      {can('order:write') && (
        <NewOrderModal
          open={newOpen}
          onClose={() => setNewOpen(false)}
          customers={customers}
          onCreated={async (payload) => {
            await orderService.create(payload);
            toast.success('Order created');
            load();
          }}
        />
      )}

      <ConfirmDialog
        open={!!cancelling}
        onClose={() => setCancelling(null)}
        onConfirm={handleCancel}
        title="Cancel order?"
        message={`Order ${cancelling?.orderNumber} will be marked as CANCELLED.`}
        confirmLabel="Cancel Order"
      />
    </div>
  );
}
