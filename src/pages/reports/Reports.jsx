import { useEffect, useState, useMemo } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { Download, FileText, TrendingUp, Boxes, ShoppingCart, AlertTriangle } from 'lucide-react';
import { dashboardService, warehouseService } from '../../services/dataService';
import { inventoryService } from '../../services/inventoryService';
import { PageHeader, Skeleton, StockBadge, ErrorState } from '../../components/common/CommonComponents';
import { formatCurrency, formatNumber, downloadCSV } from '../../utils/format';
import toast from 'react-hot-toast';

function ReportCard({ icon: Icon, title, children, onExport }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-indigo-100 dark:bg-indigo-500/15 p-2 text-indigo-600"><Icon size={17} /></div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
        </div>
        <button className="btn-secondary !px-2.5 !py-1.5" onClick={onExport} title="Export CSV">
          <Download size={14} />
        </button>
      </div>
      {children}
    </div>
  );
}

export default function Reports() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [from, setFrom] = useState('2025-01-01');
  const [to, setTo] = useState('2025-12-31');
  const [warehouseReport, setWarehouseReport] = useState(null);
  const [lowStockReport, setLowStockReport] = useState(null);

  const load = () => {
    setError(false);
    setData(null);
    Promise.all([
      dashboardService.sales(),
      dashboardService.summary(),
      dashboardService.topProducts(),
      inventoryService.lowStock(),
      warehouseService.list(),
    ])
      .then(([sales, summary, top, low, whs]) => {
        setData({ sales, summary, top });
        setLowStockReport(low);
        setWarehouseReport(whs.map((w) => ({ name: w.name, code: w.code, occupancy: w.currentOccupancy, capacity: w.totalCapacity })));
      })
      .catch(() => setError(true));
  };
  useEffect(load, []);

  const filteredSales = useMemo(() => {
    if (!data) return [];
    return data.sales.filter((s) => {
      const d = new Date(s.month).toISOString().slice(0, 7);
      return d >= from.slice(0, 7) && d <= to.slice(0, 7);
    });
  }, [data, from, to]);

  const exportCsv = (filename, rows) => {
    downloadCSV(filename, rows);
    toast.success(`Exported ${filename}`);
  };

  if (error) return <ErrorState message="Could not load reports." onRetry={load} />;

  return (
    <div>
      <PageHeader title="Reports & Analytics" subtitle="Business performance across sales, inventory, and orders" />

      <div className="card mb-4 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">From</label>
            <input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">To</label>
            <input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <button className="btn-secondary" onClick={() => exportCsv('sales-report.csv', filteredSales.map((s) => ({ month: s.month, sales: s.sales, orders: s.orders })))}>
            <Download size={15} /> Export Sales CSV
          </button>
          <button className="btn-secondary" onClick={() => window.print()}>
            <FileText size={15} /> Print / PDF
          </button>
        </div>
      </div>

      {!data ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="card p-5"><Skeleton className="h-56 w-full" /></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ReportCard icon={TrendingUp} title="Monthly Sales Report" onExport={() => exportCsv('sales-report.csv', data.sales)}>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredSales.length ? filteredSales : data.sales}>
                  <defs>
                    <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={(m) => m.split(' ')[0]} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2} fill="url(#rGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ReportCard>

          <ReportCard icon={Boxes} title="Inventory Valuation Report" onExport={() => exportCsv('inventory-valuation.csv', data.summary.stockByCategory)}>
            <div className="space-y-3">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(data.summary.inventoryValue)}</p>
              <p className="text-xs text-slate-500">Total stock value at purchase price, across {formatNumber(data.summary.totalProducts)} products.</p>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.summary.stockByCategory} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
                    <Tooltip />
                    <Bar dataKey="units" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ReportCard>

          <ReportCard icon={ShoppingCart} title="Product Performance Report" onExport={() => exportCsv('product-performance.csv', data.top)}>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.top} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="unitsSold" name="Units Sold" fill="#10b981" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="revenue" name="Revenue ($)" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ReportCard>

          <ReportCard icon={Boxes} title="Warehouse Stock Report" onExport={() => exportCsv('warehouse-stock.csv', warehouseReport || [])}>
            <div className="space-y-3">
              {(warehouseReport || []).map((w) => {
                const pct = Math.round((w.occupancy / w.capacity) * 100);
                return (
                  <div key={w.code}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-200">{w.name} <span className="text-slate-400">({w.code})</span></span>
                      <span className="text-slate-500">{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-navy-800 overflow-hidden">
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.min(100, pct)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </ReportCard>

          <div className="lg:col-span-2">
            <ReportCard icon={AlertTriangle} title="Low Stock Report" onExport={() => exportCsv('low-stock.csv', (lowStockReport || []).map((p) => ({ sku: p.sku, product: p.name, quantity: p.quantity, minLevel: p.minStockLevel })))}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-navy-800">
                      <th className="table-th">Product</th>
                      <th className="table-th">SKU</th>
                      <th className="table-th">Available</th>
                      <th className="table-th">Min Level</th>
                      <th className="table-th">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-navy-800">
                    {(lowStockReport || []).map((p) => (
                      <tr key={p.id}>
                        <td className="table-td">{p.name}</td>
                        <td className="table-td font-mono text-xs">{p.sku}</td>
                        <td className="table-td font-semibold">{p.quantity}</td>
                        <td className="table-td">{p.minStockLevel}</td>
                        <td className="table-td"><StockBadge status={inventoryService.stockStatus(p)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ReportCard>
          </div>
        </div>
      )}
    </div>
  );
}
