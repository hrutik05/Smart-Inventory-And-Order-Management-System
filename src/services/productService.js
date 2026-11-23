import {
  products as mockProducts,
  addProduct as mockAddProduct,
  updateProduct as mockUpdateProduct,
  deleteProduct as mockDeleteProduct,
  getStockStatus,
  addActivity,
} from '../data/mockData';

// TODO: Replace with real API calls when the Spring Boot backend is available:
//   GET    /api/products
//   POST   /api/products
//   PUT    /api/products/{id}
//   DELETE /api/products/{id}

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const productService = {
  async list({ page = 1, pageSize = 10, search = '', categoryId = null, stockStatus = null, sortBy = 'name', sortDir = 'asc' } = {}) {
    await delay();
    let rows = [...mockProducts];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (categoryId) rows = rows.filter((p) => p.categoryId === categoryId);
    if (stockStatus) rows = rows.filter((p) => getStockStatus(p) === stockStatus);
    rows.sort((a, b) => {
      let av = a[sortBy];
      let bv = b[sortBy];
      if (typeof av === 'string') {
        av = av.toLowerCase();
        bv = bv.toLowerCase();
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    const total = rows.length;
    const start = (page - 1) * pageSize;
    return { data: rows.slice(start, start + pageSize), total, page, pageSize };
  },

  async get(id) {
    await delay(200);
    return mockProducts.find((p) => p.id === id) || null;
  },

  async create(data) {
    await delay(400);
    return mockAddProduct(data);
  },

  async update(id, changes) {
    await delay(400);
    return mockUpdateProduct(id, changes);
  },

  async remove(id) {
    await delay(300);
    return mockDeleteProduct(id);
  },

  stockStatus: getStockStatus,
};
