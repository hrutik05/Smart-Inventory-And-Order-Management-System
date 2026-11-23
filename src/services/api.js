import axios from 'axios';

// Centralized HTTP client for the Java Spring Boot backend.
// Set VITE_API_BASE_URL in your .env file (e.g. VITE_API_BASE_URL=http://localhost:8080).
// When the backend is not reachable, the mock services in this project are used instead.

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

const TOKEN_KEY = 'ims_auth_user';

function readToken() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    return raw ? JSON.parse(raw).token : null;
  } catch {
    return null;
  }
}

api.interceptors.request.use((config) => {
  const token = readToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      if (window.location.pathname !== '/login') window.location.assign('/login');
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (payload) => api.post('/api/auth/login', payload),
  register: (payload) => api.post('/api/auth/register', payload),
  refresh: () => api.post('/api/auth/refresh'),
};

export const productApi = {
  list: (params) => api.get('/api/products', { params }),
  get: (id) => api.get(`/api/products/${id}`),
  create: (payload) => api.post('/api/products', payload),
  update: (id, payload) => api.put(`/api/products/${id}`, payload),
  remove: (id) => api.delete(`/api/products/${id}`),
};

export const inventoryApi = {
  list: (params) => api.get('/api/inventory', { params }),
  stockIn: (payload) => api.post('/api/inventory/stock-in', payload),
  stockOut: (payload) => api.post('/api/inventory/stock-out', payload),
  lowStock: () => api.get('/api/inventory/low-stock'),
};

export const orderApi = {
  list: (params) => api.get('/api/orders', { params }),
  get: (id) => api.get(`/api/orders/${id}`),
  create: (payload) => api.post('/api/orders', payload),
  updateStatus: (id, status) => api.put(`/api/orders/${id}/status`, { status }),
};

export const warehouseApi = {
  list: () => api.get('/api/warehouses'),
  create: (payload) => api.post('/api/warehouses', payload),
  update: (id, payload) => api.put(`/api/warehouses/${id}`, payload),
};

export const supplierApi = {
  list: () => api.get('/api/suppliers'),
  create: (payload) => api.post('/api/suppliers', payload),
};

export const dashboardApi = {
  summary: () => api.get('/api/dashboard/summary'),
  sales: () => api.get('/api/dashboard/sales'),
  topProducts: () => api.get('/api/dashboard/top-products'),
};

export default api;
