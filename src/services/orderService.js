import {
  orders as mockOrders,
  addOrder as mockAddOrder,
  updateOrderStatus as mockUpdateStatus,
  updateOrderPayment as mockUpdatePayment,
  addActivity,
} from '../data/mockData';

// TODO: Replace with real API calls when the Spring Boot backend is available:
//   GET  /api/orders
//   POST /api/orders
//   PUT  /api/orders/{id}/status
//   GET  /api/orders/{id}

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
export const PAYMENT_STATUSES = ['PAID', 'PENDING', 'FAILED', 'REFUNDED'];

export const orderService = {
  async list({ page = 1, pageSize = 10, search = '', orderStatus = null, paymentStatus = null } = {}) {
    await delay();
    let rows = [...mockOrders];
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (o) => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)
      );
    }
    if (orderStatus) rows = rows.filter((o) => o.orderStatus === orderStatus);
    if (paymentStatus) rows = rows.filter((o) => o.paymentStatus === paymentStatus);
    rows.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    const total = rows.length;
    const start = (page - 1) * pageSize;
    return { data: rows.slice(start, start + pageSize), total, page, pageSize };
  },

  async get(id) {
    await delay(200);
    return mockOrders.find((o) => o.id === id) || null;
  },

  async create(data) {
    await delay(450);
    return mockAddOrder(data);
  },

  async updateStatus(id, status) {
    await delay(300);
    const updated = mockUpdateStatus(id, status);
    if (updated) addActivity(`Order ${updated.orderNumber} marked as ${status}`, 'order');
    return updated;
  },

  async updatePaymentStatus(id, paymentStatus) {
    await delay(300);
    return mockUpdatePayment(id, paymentStatus);
  },
};
