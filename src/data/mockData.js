// Central mock data store used when the Spring Boot backend is unavailable.
// All services read from these arrays; replace services with real API calls later.

let productSeq = 100;

export const users = [
  {
    id: 1,
    fullName: 'Alex Morgan',
    email: 'admin@inventory.com',
    phone: '+1 555-0100',
    role: 'ADMIN',
    avatarColor: 'bg-indigo-600',
  },
  {
    id: 2,
    fullName: 'Priya Sharma',
    email: 'manager@inventory.com',
    phone: '+1 555-0101',
    role: 'MANAGER',
    avatarColor: 'bg-emerald-600',
  },
  {
    id: 3,
    fullName: 'Sam Rivera',
    email: 'staff@inventory.com',
    phone: '+1 555-0102',
    role: 'STAFF',
    avatarColor: 'bg-amber-600',
  },
];

export const categories = [
  { id: 1, name: 'Electronics', description: 'Consumer electronics and gadgets' },
  { id: 2, name: 'Clothing', description: 'Apparel and fashion items' },
  { id: 3, name: 'Home & Kitchen', description: 'Household appliances and utensils' },
  { id: 4, name: 'Sports', description: 'Fitness and outdoor equipment' },
  { id: 5, name: 'Books', description: 'Printed and digital books' },
  { id: 6, name: 'Toys & Games', description: 'Kids toys and board games' },
];

export const warehouses = [
  {
    id: 1,
    name: 'Central Distribution Hub',
    code: 'WH-EAST-01',
    location: 'Chicago, IL',
    managerName: 'Laura Chen',
    contactNumber: '+1 555-2001',
    totalCapacity: 10000,
    currentOccupancy: 7420,
  },
  {
    id: 2,
    name: 'West Coast Fulfillment',
    code: 'WH-WEST-01',
    location: 'Oakland, CA',
    managerName: 'Marcus Webb',
    contactNumber: '+1 555-2002',
    totalCapacity: 8000,
    currentOccupancy: 6650,
  },
  {
    id: 3,
    name: 'Southern Depot',
    code: 'WH-SOUTH-01',
    location: 'Austin, TX',
    managerName: 'Dana Patel',
    contactNumber: '+1 555-2003',
    totalCapacity: 6000,
    currentOccupancy: 2980,
  },
];

export const suppliers = [
  {
    id: 1,
    name: 'TechSource Ltd',
    companyName: 'TechSource Distribution Ltd',
    email: 'sales@techsource.com',
    phone: '+1 555-3001',
    address: '500 Tech Park Dr, San Jose, CA',
    gstNumber: 'GST-TS-2024-8891',
    suppliedProducts: ['Wireless Mouse', 'USB-C Hub', 'Mechanical Keyboard'],
  },
  {
    id: 2,
    name: 'StyleHub Apparel',
    companyName: 'StyleHub Fashions Inc',
    email: 'orders@stylehub.com',
    phone: '+1 555-3002',
    address: '88 Fashion Ave, New York, NY',
    gstNumber: 'GST-SH-2024-4420',
    suppliedProducts: ['Cotton T-Shirt', 'Denim Jacket'],
  },
  {
    id: 3,
    name: 'HomeCraft Supplies',
    companyName: 'HomeCraft Manufacturing',
    email: 'b2b@homecraft.com',
    phone: '+1 555-3003',
    address: '12 Industrial Rd, Dallas, TX',
    gstNumber: 'GST-HC-2024-7734',
    suppliedProducts: ['Espresso Maker', 'Stand Mixer'],
  },
];

const baseProducts = [
  ['Wireless Mouse', 'ELEC-WM-001', 1, 'TechGear', 12.5, 29.99, 145, 40, 1],
  ['USB-C Hub 7-in-1', 'ELEC-HB-002', 1, 'TechGear', 22, 54.99, 32, 30, 1],
  ['Mechanical Keyboard', 'ELEC-KB-003', 1, 'KeyPro', 45, 99.99, 68, 25, 2],
  ['27" 4K Monitor', 'ELEC-MN-004', 1, 'ViewMax', 210, 379.99, 18, 10, 1],
  ['Cotton T-Shirt', 'CLTH-TS-005', 2, 'UrbanFit', 4.5, 14.99, 420, 100, 2],
  ['Denim Jacket', 'CLTH-DJ-006', 2, 'UrbanFit', 18, 49.99, 55, 60, 2],
  ['Running Shoes', 'SPRT-RS-007', 4, 'StrideWell', 24, 69.99, 95, 40, 3],
  ['Yoga Mat Premium', 'SPRT-YM-008', 4, 'ZenFlex', 11, 34.99, 8, 25, 3],
  ['Espresso Maker', 'HOME-EM-009', 3, 'BrewMaster', 85, 189.99, 24, 12, 1],
  ['Stand Mixer', 'HOME-SM-010', 3, 'BrewMaster', 130, 279.99, 15, 8, 1],
  ['Non-stick Cookware Set', 'HOME-CK-011', 3, 'ChefLine', 55, 119.99, 41, 15, 3],
  ['Smart LED Bulb Pack', 'ELEC-BL-012', 1, 'LumaCo', 9, 24.99, 210, 50, 2],
  ['Bluetooth Speaker', 'ELEC-BS-013', 1, 'SoniQ', 19, 59.99, 0, 20, 2],
  ['Phone Power Bank 20K', 'ELEC-PB-014', 1, 'VoltMax', 16, 44.99, 74, 30, 1],
  ['Backpack 30L', 'SPRT-BP-015', 4, 'TrailGo', 21, 64.99, 38, 20, 3],
  ['Water Bottle Steel 1L', 'SPRT-WB-016', 4, 'TrailGo', 6, 19.99, 260, 80, 2],
  ['Fantasy Novel Box Set', 'BOOK-BS-017', 5, 'PagePress', 14, 39.99, 47, 20, 3],
  ['Board Game Deluxe', 'TOYS-BG-018', 6, 'PlayWise', 17, 44.99, 6, 15, 2],
  ['Kids Building Blocks', 'TOYS-BB-019', 6, 'PlayWise', 12, 32.99, 88, 30, 3],
  ['Desk Lamp LED', 'HOME-DL-020', 3, 'LumaCo', 13, 39.99, 52, 25, 1],
  ['HDMI Cable 2m', 'ELEC-HD-021', 1, 'TechGear', 3.5, 12.99, 340, 100, 2],
  ['Summer Dress', 'CLTH-SD-022', 2, 'UrbanFit', 11, 39.99, 63, 40, 2],
  ['Hand Grip Strengthener', 'SPRT-HG-023', 4, 'StrideWell', 4, 14.99, 120, 50, 3],
  ['Notebook A5 Dotted', 'BOOK-NB-024', 5, 'PagePress', 2.5, 9.99, 185, 60, 2],
];

export const products = baseProducts.map(
  ([name, sku, categoryId, brand, purchasePrice, sellingPrice, quantity, minStock, warehouseId], i) => ({
    id: i + 1,
    name,
    sku,
    description: `${name} — quality ${brand} product, inspected and ready to ship.`,
    categoryId,
    brand,
    purchasePrice,
    sellingPrice,
    quantity,
    minStockLevel: minStock,
    warehouseId,
    imageUrl: null,
    createdAt: '2025-08-15T10:00:00Z',
    updatedAt: '2025-09-01T10:00:00Z',
  })
);

export const customers = [
  ['Emily Johnson', 'emily.j@example.com', '+1 555-4001', '221B Maple St, Seattle, WA'],
  ['Daniel Kim', 'daniel.k@example.com', '+1 555-4002', '48 Oak Ave, Portland, OR'],
  ['Sofia Rossi', 'sofia.r@example.com', '+1 555-4003', '9 Pine Rd, Denver, CO'],
  ['Liam O\'Brien', 'liam.ob@example.com', '+1 555-4004', '77 Birch Ln, Austin, TX'],
  ['Ava Thompson', 'ava.t@example.com', '+1 555-4005', '310 Cedar St, Miami, FL'],
  ['Noah Garcia', 'noah.g@example.com', '+1 555-4006', '15 Willow Way, Phoenix, AZ'],
  ['Mia Nguyen', 'mia.n@example.com', '+1 555-4007', '62 Elm Dr, Boston, MA'],
  ['Ethan Walker', 'ethan.w@example.com', '+1 555-4008', '240 Spruce Ct, Nashville, TN'],
].map(([name, email, phone, address], i) => ({
  id: i + 1,
  name,
  email,
  phone,
  address,
  totalPurchases: 0,
  createdAt: '2025-07-01T10:00:00Z',
}));

const orderStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const paymentStatuses = ['PAID', 'PENDING', 'FAILED', 'REFUNDED'];
const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery'];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seededRandom(42);

export const orders = Array.from({ length: 32 }, (_, i) => {
  const customer = customers[Math.floor(rand() * customers.length)];
  const itemCount = 1 + Math.floor(rand() * 3);
  const items = [];
  for (let j = 0; j < itemCount; j++) {
    const p = products[Math.floor(rand() * products.length)];
    if (!items.find((it) => it.productId === p.id)) {
      items.push({
        productId: p.id,
        productName: p.name,
        sku: p.sku,
        quantity: 1 + Math.floor(rand() * 4),
        unitPrice: p.sellingPrice,
      });
    }
  }
  const totalAmount = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
  const dayOffset = Math.floor(rand() * 28);
  const date = new Date(2025, 8, 1 + dayOffset);
  return {
    id: i + 1,
    orderNumber: `ORD-2025-${String(1000 + i)}`,
    customerId: customer.id,
    customerName: customer.name,
    items,
    totalAmount: Math.round(totalAmount * 100) / 100,
    orderStatus: orderStatuses[Math.floor(rand() * orderStatuses.length)],
    paymentStatus: paymentStatuses[Math.floor(rand() * paymentStatuses.length)],
    paymentMethod: paymentMethods[Math.floor(rand() * paymentMethods.length)],
    shippingAddress: customer.address,
    orderDate: date.toISOString(),
    timeline: [
      { status: 'Order Placed', timestamp: date.toISOString(), note: 'Order received' },
      ...(orderStatuses.indexOf(orderStatuses[Math.floor(rand() * 6)]) > 0
        ? [{ status: 'Confirmed', timestamp: new Date(date.getTime() + 36e5 * 5).toISOString(), note: '' }]
        : []),
    ],
  };
});

customers.forEach((c) => {
  c.totalPurchases = orders
    .filter((o) => o.customerId === c.id && o.orderStatus !== 'CANCELLED')
    .reduce((s, o) => s + o.totalAmount, 0);
});

export const stockMovements = [
  { id: 1, productId: 1, productName: 'Wireless Mouse', type: 'IN', quantity: 50, warehouseId: 1, reference: 'PO-2025-011', timestamp: '2025-09-08T09:15:00Z', performedBy: 'Laura Chen' },
  { id: 2, productId: 5, productName: 'Cotton T-Shirt', type: 'OUT', quantity: 30, warehouseId: 2, reference: 'ORD-2025-1004', timestamp: '2025-09-08T11:40:00Z', performedBy: 'Sam Rivera' },
  { id: 3, productId: 13, productName: 'Bluetooth Speaker', type: 'OUT', quantity: 20, warehouseId: 2, reference: 'ORD-2025-1007', timestamp: '2025-09-09T08:20:00Z', performedBy: 'Sam Rivera' },
  { id: 4, productId: 8, productName: 'Yoga Mat Premium', type: 'IN', quantity: 40, warehouseId: 3, reference: 'PO-2025-012', timestamp: '2025-09-09T14:05:00Z', performedBy: 'Dana Patel' },
  { id: 5, productId: 12, productName: 'Smart LED Bulb Pack', type: 'IN', quantity: 100, warehouseId: 2, reference: 'PO-2025-013', timestamp: '2025-09-10T10:30:00Z', performedBy: 'Marcus Webb' },
  { id: 6, productId: 18, productName: 'Board Game Deluxe', type: 'OUT', quantity: 12, warehouseId: 2, reference: 'ORD-2025-1010', timestamp: '2025-09-10T16:45:00Z', performedBy: 'Priya Sharma' },
  { id: 7, productId: 21, productName: 'HDMI Cable 2m', type: 'IN', quantity: 120, warehouseId: 2, reference: 'PO-2025-014', timestamp: '2025-09-11T09:00:00Z', performedBy: 'Marcus Webb' },
  { id: 8, productId: 2, productName: 'USB-C Hub 7-in-1', type: 'TRANSFER', quantity: 10, warehouseId: 1, reference: 'TRF-2025-003 → WH-WEST-01', timestamp: '2025-09-11T13:25:00Z', performedBy: 'Priya Sharma' },
];

export const activityLog = [
  { id: 1, action: 'Order ORD-2025-1031 marked as Shipped', user: 'Priya Sharma', timestamp: '2025-09-12T09:30:00Z', type: 'order' },
  { id: 2, action: 'Stock In: 50 units of Wireless Mouse at WH-EAST-01', user: 'Laura Chen', timestamp: '2025-09-12T08:10:00Z', type: 'inventory' },
  { id: 3, action: 'New product "Desk Lamp LED" added', user: 'Alex Morgan', timestamp: '2025-09-11T17:20:00Z', type: 'product' },
  { id: 4, action: 'Low stock alert: Bluetooth Speaker is out of stock', user: 'System', timestamp: '2025-09-11T15:00:00Z', type: 'alert' },
  { id: 5, action: 'Supplier TechSource Ltd updated contact info', user: 'Alex Morgan', timestamp: '2025-09-11T11:05:00Z', type: 'supplier' },
  { id: 6, action: 'Payment received for ORD-2025-1028', user: 'System', timestamp: '2025-09-10T19:40:00Z', type: 'order' },
];

export const monthlySales = [
  { month: 'Oct 2024', sales: 41000, orders: 118 },
  { month: 'Nov 2024', sales: 47500, orders: 132 },
  { month: 'Dec 2024', sales: 62800, orders: 171 },
  { month: 'Jan 2025', sales: 38200, orders: 104 },
  { month: 'Feb 2025', sales: 41900, orders: 112 },
  { month: 'Mar 2025', sales: 46300, orders: 125 },
  { month: 'Apr 2025', sales: 50100, orders: 136 },
  { month: 'May 2025', sales: 48700, orders: 130 },
  { month: 'Jun 2025', sales: 55600, orders: 148 },
  { month: 'Jul 2025', sales: 59200, orders: 156 },
  { month: 'Aug 2025', sales: 63400, orders: 167 },
  { month: 'Sep 2025', sales: 71000, orders: 184 },
];

export const topProducts = [
  { name: 'Wireless Mouse', unitsSold: 342, revenue: 10256.58 },
  { name: 'Cotton T-Shirt', unitsSold: 298, revenue: 4468.02 },
  { name: 'HDMI Cable 2m', unitsSold: 265, revenue: 3442.35 },
  { name: 'Water Bottle Steel 1L', unitsSold: 231, revenue: 4617.69 },
  { name: 'Smart LED Bulb Pack', unitsSold: 204, revenue: 5097.96 },
  { name: 'Running Shoes', unitsSold: 178, revenue: 12458.22 },
];

export function nextProductId() {
  return ++productSeq;
}

export function getStockStatus(product) {
  if (product.quantity <= 0) return 'OUT_OF_STOCK';
  if (product.quantity <= product.minStockLevel) return 'LOW_STOCK';
  return 'IN_STOCK';
}

export function addUser(user) {
  users.push(user);
  return user;
}

export function addCategory(cat) {
  const c = { id: Math.max(0, ...categories.map((x) => x.id)) + 1, ...cat };
  categories.push(c);
  return c;
}

export function updateCategory(id, changes) {
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  categories[idx] = { ...categories[idx], ...changes };
  return categories[idx];
}

export function deleteCategory(id) {
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  categories.splice(idx, 1);
  return true;
}

export function addProduct(data) {
  const p = {
    id: nextProductId(),
    description: '',
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,
  };
  products.push(p);
  const wh = warehouses.find((w) => w.id === p.warehouseId);
  if (wh) wh.currentOccupancy = Math.min(wh.totalCapacity, wh.currentOccupancy + p.quantity);
  return p;
}

export function updateProduct(id, changes) {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...changes, updatedAt: new Date().toISOString() };
  return products[idx];
}

export function deleteProduct(id) {
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  products.splice(idx, 1);
  return true;
}

export function addWarehouse(data) {
  const w = { id: Math.max(0, ...warehouses.map((x) => x.id)) + 1, currentOccupancy: 0, ...data };
  warehouses.push(w);
  return w;
}

export function updateWarehouse(id, changes) {
  const idx = warehouses.findIndex((w) => w.id === id);
  if (idx === -1) return null;
  warehouses[idx] = { ...warehouses[idx], ...changes };
  return warehouses[idx];
}

export function deleteWarehouse(id) {
  const idx = warehouses.findIndex((w) => w.id === id);
  if (idx === -1) return false;
  warehouses.splice(idx, 1);
  return true;
}

export function addSupplier(data) {
  const s = { id: Math.max(0, ...suppliers.map((x) => x.id)) + 1, suppliedProducts: [], ...data };
  suppliers.push(s);
  return s;
}

export function updateSupplier(id, changes) {
  const idx = suppliers.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  suppliers[idx] = { ...suppliers[idx], ...changes };
  return suppliers[idx];
}

export function deleteSupplier(id) {
  const idx = suppliers.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  suppliers.splice(idx, 1);
  return true;
}

export function addCustomer(data) {
  const c = {
    id: Math.max(0, ...customers.map((x) => x.id)) + 1,
    totalPurchases: 0,
    createdAt: new Date().toISOString(),
    ...data,
  };
  customers.push(c);
  return c;
}

export function updateCustomer(id, changes) {
  const idx = customers.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  customers[idx] = { ...customers[idx], ...changes };
  return customers[idx];
}

export function addOrder(data) {
  const o = {
    id: Math.max(0, ...orders.map((x) => x.id)) + 1,
    orderNumber: `ORD-2025-${1000 + orders.length}`,
    orderStatus: 'PENDING',
    paymentStatus: 'PENDING',
    orderDate: new Date().toISOString(),
    timeline: [{ status: 'Order Placed', timestamp: new Date().toISOString(), note: 'Order received' }],
    ...data,
  };
  orders.push(o);
  return o;
}

export function updateOrderStatus(id, status) {
  const o = orders.find((x) => x.id === id);
  if (!o) return null;
  o.orderStatus = status;
  o.timeline.push({ status, timestamp: new Date().toISOString(), note: '' });
  return o;
}

export function updateOrderPayment(id, paymentStatus) {
  const o = orders.find((x) => x.id === id);
  if (!o) return null;
  o.paymentStatus = paymentStatus;
  return o;
}

export function addStockMovement(m) {
  const mv = { id: Math.max(0, ...stockMovements.map((x) => x.id)) + 1, ...m };
  stockMovements.unshift(mv);
  return mv;
}

export function addActivity(action, type, user = 'System') {
  activityLog.unshift({
    id: Math.max(0, ...activityLog.map((x) => x.id)) + 1,
    action,
    type,
    timestamp: new Date().toISOString(),
    user,
  });
}
