import {
  categories,
  warehouses,
  suppliers,
  customers,
  monthlySales,
  topProducts,
  activityLog,
  products,
  orders,
  getStockStatus,
  addCategory,
  updateCategory,
  deleteCategory,
  addWarehouse,
  updateWarehouse,
  deleteWarehouse,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  addCustomer,
  updateCustomer,
  addActivity,
} from '../data/mockData';

// TODO: Replace with real API calls when the Spring Boot backend is available:
//   GET /api/dashboard/summary
//   GET /api/dashboard/sales
//   GET /api/dashboard/top-products
//   CRUD for /api/categories, /api/warehouses, /api/suppliers, /api/customers

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

const CRUD = (rows, addFn, updateFn, deleteFn) => ({
  async list() {
    await delay(200);
    return [...rows];
  },
  async create(data) {
    await delay(350);
    return addFn(data);
  },
  async update(id, changes) {
    await delay(350);
    return updateFn(id, changes);
  },
  async remove(id) {
    await delay(300);
    return deleteFn(id);
  },
});

export const categoryService = CRUD(categories, addCategory, updateCategory, deleteCategory);
export const warehouseService = {
  ...CRUD(warehouses, addWarehouse, updateWarehouse, deleteWarehouse),
  async inventoryFor(warehouseId) {
    await delay(200);
    return products.filter((p) => p.warehouseId === warehouseId);
  },
};
export const supplierService = CRUD(suppliers, addSupplier, updateSupplier, deleteSupplier);
export const customerService = {
  ...CRUD(customers, addCustomer, updateCustomer, null),
  async list() {
    await delay(200);
    return [...customers];
  },
};

export const dashboardService = {
  async summary() {
    await delay(350);
    const inventoryValue = products.reduce((s, p) => s + p.quantity * p.purchasePrice, 0);
    const statusCounts = orders.reduce((acc, o) => {
      acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
      return acc;
    }, {});
    const byCategory = {};
    products.forEach((p) => {
      const cat = categories.find((c) => c.id === p.categoryId);
      const key = cat ? cat.name : 'Other';
      byCategory[key] = (byCategory[key] || 0) + p.quantity;
    });
    return {
      totalProducts: products.length,
      inventoryValue,
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.orderStatus === 'PENDING').length,
      lowStockProducts: products.filter((p) => getStockStatus(p) === 'LOW_STOCK').length,
      outOfStock: products.filter((p) => getStockStatus(p) === 'OUT_OF_STOCK').length,
      totalCustomers: customers.length,
      totalRevenue: orders.filter((o) => o.orderStatus !== 'CANCELLED').reduce((s, o) => s + o.totalAmount, 0),
      statusCounts,
      stockByCategory: Object.entries(byCategory).map(([name, units]) => ({ name, units })),
    };
  },
  async sales() {
    await delay(250);
    return [...monthlySales];
  },
  async topProducts() {
    await delay(250);
    return [...topProducts];
  },
  async activity() {
    await delay(200);
    return [...activityLog];
  },
};
