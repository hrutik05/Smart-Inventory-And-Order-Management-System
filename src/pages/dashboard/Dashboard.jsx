import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';
import {
  Package, DollarSign, ShoppingCart, Clock, AlertTriangle, Users, TrendingUp, TrendingDown,
} from 'lucide-react';
import { dashboardService } from '../../services/dataService';
import { orderService } from '../../services/orderService';
import { inventoryService } from '../../services/inventoryService';
import { PageHeader, Skeleton, StockBadge, OrderStatusBadge, EmptyState } from '../../components/common/CommonComponents';
import { formatCurrency, formatNumber, formatDate } from '../../utils/format';
import { PackageSearch, Activity } from 'lucide-react';

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  CONFIRMED: '#3b82f6',
  PROCESSING: '#06b6d4',
  SHIPPED: '#6366f1',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444',
};

function StatCard({ icon: Icon, label, value, change, up, color, link }) {
  const body = (
    <div className="card p-5 hover:shadow-card-hover transition-shadow h-full">
      <div className="flex items-start justify-between">
        <div className={`rounded-lg p-2.5 ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        {change !== undefined && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${up ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'}`}>
            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change}%
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
  return link ? <Link to={link}>{body}</Link> : body;
}

function ChartCard({ title, children, height = 280 }) {
  return (
    <div className="card p-5">
      <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
      <div style={{ height }}>{children}</div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [sales, setSales] = useState(null);
  const [topProducts, setTopProducts] = useState(null);
  const [recentOrders, setRecentOrders] = useState(null);
  const [lowStock, setLowStock] = useState(null);
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState(false);

  const load = () => {
    setError(false);
    Promise.all([
      dashboardService.summary(),
      dashboardService.sales(),
      dashboardService.topProducts(),
      orderService.list({ page: 1, pageSize: 5 }),
      inventoryService.lowStock(),
      dashboardService.activity(),
    ])
      .then(([s, sa, tp, ro, ls, ac]) => {
        setSummary(s);
        setSales(sa);
        setTopProducts(tp);
        setRecentOrders(ro);
        setLowStock(ls);
        setActivity(ac);
      })
      .catch(() => setError(true));
  };
  useEffect(load, []);

  if (error) return <EmptyState icon={AlertTriangle} title="Failed to load dashboard" message="Please try again." action={<button className="btn-primary" onClick={load}>Retry</button>} />;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your inventory and sales performance"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {[
          { icon: Package, label: 'Total Products', get: () => [formatNumber(summary?.totalProducts), '+4.2%', true, 'bg-indigo-600', '/products'] },
          { icon: DollarSign, label: 'Total Inventory Value', get: () => [formatCurrency(summary?.inventoryValue), '+7.8%', true, 'bg-emerald-600', '/reports'] },
          { icon: ShoppingCart, label: 'Total Orders', get: () => [formatNumber(summary?.totalOrders), '+11.5%', true, 'bg-sky-600', '/orders'] },
          { icon: Clock, label: 'Pending Orders', get: () => [formatNumber(summary?.pendingOrders), '-2.4%', false, 'bg-amber-500', '/orders'] },
          { icon: AlertTriangle, label: 'Low Stock Products', get: () => [formatNumber((summary?.lowStockProducts || 0) + (summary?.outOfStock || 0)), '+3', true, 'bg-red-500', '/inventory'] },
          { icon: Users, label: 'Total Customers', get: () => [formatNumber(summary?.totalCustomers), '+5.1%', true, 'bg-violet-600', '/customers'] },
        ].map((cfg, i) => {
          const [value, change, up, color, link] = summary ? cfg.get() : [null, null, null, 'bg-indigo-600', null];
          return summary ? (
            <StatCard key={i} icon={cfg.icon} label={cfg.label} value={value} change={change} up={up} color={color} link={link} />
          ) : (
            <div key={i} className="card p-5"><Skeleton className="h-20 w-full" /></div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <ChartCard title="Monthly Sales Overview">
            {sales ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sales} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickFormatter={(m) => m.split(' ')[0]} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip formatter={(v) => [formatCurrency(v), 'Sales']} />
                  <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2} fill="url(#salesGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton className="h-full w-full" />
            )}
          </ChartCard>
        </div>
        <ChartCard title="Order Status Distribution">
          {summary ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(summary.statusCounts).map(([name, value]) => ({ name, value }))}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {Object.entries(summary.statusCounts).map(([name]) => (
                    <Cell key={name} fill={STATUS_COLORS[name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton className="h-full w-full" />
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Inventory Stock Levels by Category">
          {summary ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.stockByCategory} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="units" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton className="h-full w-full" />
          )}
        </ChartCard>
        <ChartCard title="Top Selling Products">
          {topProducts ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 10, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={110} />
                <Tooltip />
                <Bar dataKey="unitsSold" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton className="h-full w-full" />
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-navy-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Orders</h3>
            <Link to="/orders" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">View all</Link>
          </div>
          {recentOrders ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-navy-800/50 border-b border-slate-200 dark:border-navy-800">
                  <tr>
                    <th className="table-th">Order</th>
                    <th className="table-th">Customer</th>
                    <th className="table-th">Date</th>
                    <th className="table-th">Total</th>
                    <th className="table-th">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
                  {recentOrders.data.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-navy-800/50 transition">
                      <td className="table-td font-medium text-indigo-600 dark:text-indigo-400">{o.orderNumber}</td>
                      <td className="table-td">{o.customerName}</td>
                      <td className="table-td">{formatDate(o.orderDate)}</td>
                      <td className="table-td">{formatCurrency(o.totalAmount)}</td>
                      <td className="table-td"><OrderStatusBadge status={o.orderStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Low Stock Alerts</h3>
              <Link to="/inventory" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">View all</Link>
            </div>
            {lowStock ? (
              lowStock.length === 0 ? (
                <p className="text-xs text-slate-500">All products are sufficiently stocked.</p>
              ) : (
                <ul className="space-y-2.5">
                  {lowStock.slice(0, 4).map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">{p.name}</p>
                        <p className="text-[11px] text-slate-500">{p.sku}</p>
                      </div>
                      <StockBadge status={inventoryService.stockStatus(p)} />
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <Skeleton className="h-24 w-full" />
            )}
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={15} className="text-indigo-600" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
            </div>
            {activity ? (
              <ul className="space-y-3">
                {activity.slice(0, 5).map((a) => (
                  <li key={a.id} className="flex gap-2.5">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-700 dark:text-slate-300">{a.action}</p>
                      <p className="text-[11px] text-slate-400">{a.user} · {formatDate(a.timestamp)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Skeleton className="h-28 w-full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
