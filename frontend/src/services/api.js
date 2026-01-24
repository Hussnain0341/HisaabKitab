import axios from 'axios';
import { getServerUrl } from '../utils/connectionStatus';

// Use dynamic server URL for LAN support
const API_BASE_URL = getServerUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle read-only errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.readOnly) {
      console.warn('Read-only mode: Operation blocked');
    }
    return Promise.reject(error);
  }
);

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Suppliers API
export const suppliersAPI = {
  getAll: () => api.get('/suppliers'),
  getById: (id) => api.get(`/suppliers/${id}`),
  getLedger: (id) => api.get(`/suppliers/${id}/ledger`),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

// Supplier Payments API
export const supplierPaymentsAPI = {
  getAll: (params) => api.get('/supplier-payments', { params }),
  getById: (id) => api.get(`/supplier-payments/${id}`),
  create: (data) => api.post('/supplier-payments', data),
  update: (id, data) => api.put(`/supplier-payments/${id}`, data),
  delete: (id) => api.delete(`/supplier-payments/${id}`),
};

// Sales API
export const salesAPI = {
  getAll: () => api.get('/sales'),
  getById: (id) => api.get(`/sales/${id}`),
  create: (data) => api.post('/sales', data),
};

// Reports API
export const reportsAPI = {
  getComprehensive: (period, productId, supplierId, startDate = null, endDate = null) => {
    let url = `/reports/comprehensive?period=${period}`;
    if (productId) url += `&productId=${productId}`;
    if (supplierId) url += `&supplierId=${supplierId}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    return api.get(url);
  },
  getProducts: () => api.get('/reports/products'),
  getSuppliers: () => api.get('/reports/suppliers'),
  getStock: () => api.get('/reports/stock'),
  getCustomersOutstanding: () => api.get('/reports/customers-outstanding'),
  getSuppliersPayable: () => api.get('/reports/suppliers-payable'),
  getCustomersDue: (params) => api.get('/reports/customers-due', { params }),
  // New endpoints
  getDashboardSummary: (params) => api.get('/reports/dashboard-summary', { params }),
  getSalesSummary: (params) => api.get('/reports/sales-summary', { params }),
  getSalesByProduct: (params) => api.get('/reports/sales-by-product', { params }),
  getProfit: (params) => api.get('/reports/profit', { params }),
  getExpensesSummary: (params) => api.get('/reports/expenses-summary', { params }),
  getExpensesList: (params) => api.get('/reports/expenses-list', { params }),
  getStockCurrent: () => api.get('/reports/stock-current'),
  getStockLow: (params) => api.get('/reports/stock-low', { params }),
  getCustomerStatement: (id, params) => api.get(`/reports/customer-statement/${id}`, { params }),
  getSupplierHistory: (id, params) => api.get(`/reports/supplier-history/${id}`, { params }),
  getDashboard: () => api.get('/reports/dashboard'),
};

// Settings API
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

// Customers API
export const customersAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  getHistory: (id) => api.get(`/customers/${id}/history`),
  getLedger: (id) => api.get(`/customers/${id}/ledger`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
  // Sub-categories
  getSubCategoriesAll: () => api.get('/categories/sub-categories/all'),
  createSubCategory: (data) => api.post('/categories/sub-categories', data),
  updateSubCategory: (id, data) => api.put(`/categories/sub-categories/${id}`, data),
  deleteSubCategory: (id) => api.delete(`/categories/sub-categories/${id}`),
};

// Purchases API
export const purchasesAPI = {
  getAll: () => api.get('/purchases'),
  getById: (id) => api.get(`/purchases/${id}`),
  create: (data) => api.post('/purchases', data),
  update: (id, data) => api.put(`/purchases/${id}`, data),
  delete: (id) => api.delete(`/purchases/${id}`),
};

// Expenses API
export const expensesAPI = {
  getAll: (params) => api.get('/expenses', { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  getSummary: (params) => api.get('/expenses/summary', { params }),
  getMonthly: () => api.get('/expenses/monthly'),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

// Customer Payments API
export const customerPaymentsAPI = {
  getAll: (params) => api.get('/customer-payments', { params }),
  getById: (id) => api.get(`/customer-payments/${id}`),
  create: (data) => api.post('/customer-payments', data),
  update: (id, data) => api.put(`/customer-payments/${id}`, data),
  delete: (id) => api.delete(`/customer-payments/${id}`),
};

// Backup API
export const backupAPI = {
  create: () => api.post('/backup/create'),
  list: () => api.get('/backup/list'),
  status: () => api.get('/backup/status'),
  restore: (filename = null) => api.post('/backup/restore', { filename }),
  updateSettings: (settings) => api.put('/backup/settings', settings),
};

// Setup API
export const setupAPI = {
  check: () => api.get('/setup/check'),
  migrate: () => api.post('/setup/migrate'),
};

export default api;
