import { useEffect, useState } from 'react';
import { Bell, AlertTriangle, Package, ShoppingCart, Check } from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import { dashboardService } from '../../services/dataService';
import { PageHeader, EmptyState, StockBadge, Skeleton, ErrorState } from '../../components/common/CommonComponents';
import { formatDate } from '../../utils/format';

const TYPE_ICONS = {
  order: { icon: ShoppingCart, color: 'text-sky-600 bg-sky-100 dark:bg-sky-500/15' },
  inventory: { icon: Package, color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-500/15' },
  alert: { icon: AlertTriangle, color: 'text-red-600 bg-red-100 dark:bg-red-500/15' },
  product: { icon: Package, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-500/15' },
  supplier: { icon: Package, color: 'text-amber-600 bg-amber-100 dark:bg-amber-500/15' },
};

export default function Notifications() {
  const [activity, setActivity] = useState(null);
  const [lowStock, setLowStock] = useState(null);
  const [dismissed, setDismissed] = useState([]);
  const [error, setError] = useState(false);

  const load = () => {
    setError(false);
    Promise.all([dashboardService.activity(), inventoryService.lowStock()])
      .then(([a, ls]) => { setActivity(a); setLowStock(ls); })
      .catch(() => setError(true));
  };
  useEffect(load, []);

  const activeAlerts = (lowStock || []).filter((p) => !dismissed.includes(p.id));

  return (
    <div>
      <PageHeader title="Notifications" subtitle="Alerts and recent system activity" />

      {error ? (
        <ErrorState message="Could not load notifications." onRetry={load} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="rounded-lg bg-red-100 dark:bg-red-500/15 p-2 text-red-600"><AlertTriangle size={17} /></div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Low Stock Alerts</h3>
              {activeAlerts.length > 0 && (
                <span className="rounded-full bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400 text-xs font-medium px-2 py-0.5">{activeAlerts.length}</span>
              )}
            </div>
            {lowStock === null ? (
              <Skeleton className="h-32 w-full" />
            ) : activeAlerts.length === 0 ? (
              <EmptyState icon={Check} title="All clear" message="No stock alerts right now." />
            ) : (
              <ul className="space-y-3">
                {activeAlerts.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-navy-800 p-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.sku} — {p.quantity} left (min {p.minStockLevel})</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StockBadge status={inventoryService.stockStatus(p)} />
                      <button
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800 transition"
                        title="Dismiss"
                        onClick={() => setDismissed((d) => [...d, p.id])}
                      >
                        <Check size={15} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="rounded-lg bg-indigo-100 dark:bg-indigo-500/15 p-2 text-indigo-600"><Bell size={17} /></div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
            </div>
            {activity === null ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <ul className="space-y-3.5">
                {activity.map((a) => {
                  const cfg = TYPE_ICONS[a.type] || TYPE_ICONS.inventory;
                  return (
                    <li key={a.id} className="flex gap-3">
                      <div className={`rounded-lg p-2 h-8 w-8 flex items-center justify-center shrink-0 ${cfg.color}`}>
                        <cfg.icon size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-slate-700 dark:text-slate-300">{a.action}</p>
                        <p className="text-xs text-slate-400">{a.user} · {formatDate(a.timestamp)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
