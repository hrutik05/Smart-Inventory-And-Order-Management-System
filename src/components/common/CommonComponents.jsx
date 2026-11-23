import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const TONES = {
  success: { icon: CheckCircle, chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' },
  danger: { icon: XCircle, chip: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400' },
  warning: { icon: AlertTriangle, chip: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400' },
  info: { icon: Info, chip: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400' },
  neutral: { icon: Info, chip: 'bg-slate-100 text-slate-600 dark:bg-navy-800 dark:text-slate-300' },
};

export function StatusBadge({ tone = 'neutral', children }) {
  const { icon: Icon, chip } = TONES[tone] || TONES.neutral;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${chip}`}>
      <Icon size={13} />
      {children}
    </span>
  );
}

export function StockBadge({ status }) {
  const map = {
    IN_STOCK: { tone: 'success', label: 'In Stock' },
    LOW_STOCK: { tone: 'warning', label: 'Low Stock' },
    OUT_OF_STOCK: { tone: 'danger', label: 'Out of Stock' },
  };
  const cfg = map[status] || map.IN_STOCK;
  return <StatusBadge tone={cfg.tone}>{cfg.label}</StatusBadge>;
}

export function OrderStatusBadge({ status }) {
  const map = {
    PENDING: 'warning',
    CONFIRMED: 'info',
    PROCESSING: 'info',
    SHIPPED: 'info',
    DELIVERED: 'success',
    CANCELLED: 'danger',
  };
  return <StatusBadge tone={map[status] || 'neutral'}>{status}</StatusBadge>;
}

export function PaymentStatusBadge({ status }) {
  const map = { PAID: 'success', PENDING: 'warning', FAILED: 'danger', REFUNDED: 'neutral' };
  return <StatusBadge tone={map[status] || 'neutral'}>{status}</StatusBadge>;
}

export function Modal({ open, onClose, title, children, footer, wide = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-navy-900 shadow-xl border border-slate-200 dark:border-navy-800`}>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-800 px-5 py-4 sticky top-0 bg-white dark:bg-navy-900 rounded-t-xl">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-navy-800 transition">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-slate-200 dark:border-navy-800 px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', message, confirmLabel = 'Delete' }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </>
      }
    >
      <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
    </Modal>
  );
}

export function EmptyState({ icon: Icon = Info, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      <div className="rounded-full bg-slate-100 dark:bg-navy-800 p-4 mb-4">
        <Icon size={28} className="text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded bg-slate-200 dark:bg-navy-800 ${className}`} />;
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} className="h-5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      <div className="rounded-full bg-red-100 dark:bg-red-500/15 p-4 mb-4">
        <XCircle size={28} className="text-red-500" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Something went wrong</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message}</p>
      {onRetry && (
        <button className="btn-secondary mt-4" onClick={onRetry}>Try again</button>
      )}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Pagination({ page, pageSize, total, onPage }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <div className="flex items-center justify-between border-t border-slate-200 dark:border-navy-800 px-4 py-3">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Showing {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button className="btn-secondary !px-3 !py-1.5 text-xs" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          Previous
        </button>
        <span className="px-3 text-xs text-slate-600 dark:text-slate-300">
          Page {page} of {totalPages}
        </span>
        <button className="btn-secondary !px-3 !py-1.5 text-xs" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
