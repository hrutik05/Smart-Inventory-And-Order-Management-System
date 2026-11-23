import {
  products as mockProducts,
  stockMovements,
  warehouses as mockWarehouses,
  addStockMovement,
  addActivity,
  getStockStatus,
} from '../data/mockData';

// TODO: Replace with real API calls when the Spring Boot backend is available:
//   GET  /api/inventory
//   POST /api/inventory/stock-in
//   POST /api/inventory/stock-out
//   GET  /api/inventory/low-stock

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const inventoryService = {
  async list({ warehouseId = null, categoryId = null, stockStatus = null, search = '' } = {}) {
    await delay();
    let rows = mockProducts.map((p) => ({
      product: p,
      warehouse: mockWarehouses.find((w) => w.id === p.warehouseId),
      status: getStockStatus(p),
    }));
    if (warehouseId) rows = rows.filter((r) => r.product.warehouseId === warehouseId);
    if (categoryId) rows = rows.filter((r) => r.product.categoryId === categoryId);
    if (stockStatus) rows = rows.filter((r) => r.status === stockStatus);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => r.product.name.toLowerCase().includes(q) || r.product.sku.toLowerCase().includes(q));
    }
    return rows;
  },

  async lowStock() {
    await delay(200);
    return mockProducts.filter((p) => getStockStatus(p) !== 'IN_STOCK');
  },

  async stockIn(productId, quantity, warehouseId, reference, performedBy) {
    await delay(400);
    const p = mockProducts.find((x) => x.id === productId);
    if (!p) throw new Error('Product not found');
    const qty = parseInt(quantity, 10);
    if (!Number.isFinite(qty) || qty <= 0) throw new Error('Quantity must be a positive number');
    p.quantity += qty;
    const wh = mockWarehouses.find((w) => w.id === warehouseId);
    if (wh) wh.currentOccupancy = Math.min(wh.totalCapacity, wh.currentOccupancy + qty);
    const movement = addStockMovement({
      productId: p.id,
      productName: p.name,
      type: 'IN',
      quantity: qty,
      warehouseId,
      reference,
      timestamp: new Date().toISOString(),
      performedBy,
    });
    addActivity(`Stock In: ${qty} units of ${p.name}`, 'inventory', performedBy);
    return movement;
  },

  async stockOut(productId, quantity, warehouseId, reference, performedBy) {
    await delay(400);
    const p = mockProducts.find((x) => x.id === productId);
    if (!p) throw new Error('Product not found');
    const qty = parseInt(quantity, 10);
    if (!Number.isFinite(qty) || qty <= 0) throw new Error('Quantity must be a positive number');
    if (qty > p.quantity) throw new Error(`Only ${p.quantity} units available`);
    p.quantity -= qty;
    const wh = mockWarehouses.find((w) => w.id === warehouseId);
    if (wh) wh.currentOccupancy = Math.max(0, wh.currentOccupancy - qty);
    const movement = addStockMovement({
      productId: p.id,
      productName: p.name,
      type: 'OUT',
      quantity: qty,
      warehouseId,
      reference,
      timestamp: new Date().toISOString(),
      performedBy,
    });
    addActivity(`Stock Out: ${qty} units of ${p.name}`, 'inventory', performedBy);
    return movement;
  },

  async movements() {
    await delay(200);
    return [...stockMovements];
  },

  async transferStock(productId, quantity, fromWarehouseId, toWarehouseId, performedBy) {
    await delay(450);
    const p = mockProducts.find((x) => x.id === productId);
    if (!p) throw new Error('Product not found');
    const qty = parseInt(quantity, 10);
    if (!Number.isFinite(qty) || qty <= 0) throw new Error('Quantity must be a positive number');
    if (qty > p.quantity) throw new Error(`Only ${p.quantity} units available`);
    p.warehouseId = toWarehouseId;
    const from = mockWarehouses.find((w) => w.id === fromWarehouseId);
    const to = mockWarehouses.find((w) => w.id === toWarehouseId);
    if (from) from.currentOccupancy = Math.max(0, from.currentOccupancy - qty);
    if (to) to.currentOccupancy = Math.min(to.totalCapacity, to.currentOccupancy + qty);
    const movement = addStockMovement({
      productId: p.id,
      productName: p.name,
      type: 'TRANSFER',
      quantity: qty,
      warehouseId: fromWarehouseId,
      reference: `TRF → ${to ? to.code : toWarehouseId}`,
      timestamp: new Date().toISOString(),
      performedBy,
    });
    addActivity(`Transferred ${qty} units of ${p.name} to ${to ? to.code : toWarehouseId}`, 'inventory', performedBy);
    return movement;
  },

  stockStatus: getStockStatus,
};
