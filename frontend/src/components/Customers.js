import React, { useState, useEffect, useMemo } from 'react';
import { customersAPI } from '../services/api';
import Pagination from './Pagination';
import './Customers.css';

const Customers = ({ readOnly = false }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [customerHistory, setCustomerHistory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customersAPI.getAll();
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.response?.data?.error || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = async (customerId) => {
    try {
      const response = await customersAPI.getHistory(customerId);
      setCustomerHistory(response.data);
      setViewingCustomer(customers.find(c => c.customer_id === customerId));
    } catch (err) {
      console.error('Error fetching customer history:', err);
      alert('Failed to load customer history');
    }
  };

  const handleSaveCustomer = async (customerData) => {
    try {
      if (editingCustomer) {
        await customersAPI.update(editingCustomer.customer_id, customerData);
      } else {
        await customersAPI.create(customerData);
      }
      await fetchCustomers();
      setModalOpen(false);
      setEditingCustomer(null);
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await customersAPI.delete(customerId);
      await fetchCustomers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete customer');
    }
  };

  const formatCurrency = (amount) => `PKR ${Number(amount || 0).toFixed(2)}`;

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) {
      return customers;
    }
    const query = searchQuery.toLowerCase().trim();
    return customers.filter(customer => {
      const name = (customer.name || '').toLowerCase();
      const phone = (customer.phone || '').toLowerCase();
      const address = (customer.address || '').toLowerCase();
      return name.includes(query) || phone.includes(query) || address.includes(query);
    });
  }, [customers, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) {
    return <div className="content-container"><div className="loading">Loading customers...</div></div>;
  }

  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <p className="page-subtitle">Manage customers and track outstanding balances</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {customerHistory ? (
        <CustomerHistoryView 
          customer={viewingCustomer} 
          history={customerHistory}
          onClose={() => { setCustomerHistory(null); setViewingCustomer(null); }}
        />
      ) : modalOpen ? (
        <CustomerModal
          customer={editingCustomer}
          onSave={handleSaveCustomer}
          onClose={() => { setModalOpen(false); setEditingCustomer(null); }}
        />
      ) : (
        <>
          {!readOnly && (
            <div className="card" style={{ marginBottom: '20px' }}>
              <div className="card-header">
                <div className="card-header-content">
                  <h2>Customers</h2>
                  <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                    + Add Customer
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, maxWidth: '400px' }}>
                  <label className="form-label" style={{ marginBottom: '8px', display: 'block', fontSize: '13px' }}>Search Customer</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search by name, phone, or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ fontSize: '14px', width: '100%' }}
                  />
                </div>
                {searchQuery && (
                  <button className="btn btn-secondary" onClick={() => setSearchQuery('')}>
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Opening Balance</th>
                  <th>Current Balance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.length === 0 ? (
                  <tr><td colSpan="6" className="empty-state">{searchQuery ? `No customers found matching "${searchQuery}".` : 'No customers found. Add your first customer.'}</td></tr>
                ) : (
                  paginatedCustomers.map(customer => (
                    <tr key={customer.customer_id}>
                      <td><strong>{customer.name}</strong></td>
                      <td>{customer.phone || '-'}</td>
                      <td>{formatCurrency(customer.opening_balance)}</td>
                      <td className={customer.current_balance >= 0 ? 'positive-balance' : 'negative-balance'}>
                        {formatCurrency(customer.current_balance)}
                      </td>
                      <td><span className={`status-badge ${customer.status}`}>{customer.status}</span></td>
                      <td>
                        <button className="btn-view" onClick={() => handleViewHistory(customer.customer_id)}>View</button>
                        {!readOnly && (
                          <>
                            <button className="btn-edit" onClick={() => { setEditingCustomer(customer); setModalOpen(true); }}>Edit</button>
                            <button className="btn-delete" onClick={() => handleDelete(customer.customer_id)}>Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {filteredCustomers.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredCustomers.length}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(newItemsPerPage) => {
                setItemsPerPage(newItemsPerPage);
                setCurrentPage(1);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

const CustomerModal = ({ customer, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    opening_balance: customer?.opening_balance || 0,
    customer_type: customer?.customer_type || 'walk-in',
    status: customer?.status || 'active',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save customer');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{customer ? 'Edit Customer' : 'Add Customer'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input className="form-input" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea className="form-input" rows="3" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Opening Balance</label>
              <input type="number" step="0.01" className="form-input" value={formData.opening_balance} onChange={(e) => setFormData({...formData, opening_balance: parseFloat(e.target.value) || 0})} />
            </div>
            <div className="form-group">
              <label className="form-label">Customer Type</label>
              <select className="form-input" value={formData.customer_type} onChange={(e) => setFormData({...formData, customer_type: e.target.value})}>
                <option value="walk-in">Walk-in</option>
                <option value="retail">Retail</option>
                <option value="wholesale">Wholesale</option>
                <option value="special">Special</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CustomerHistoryView = ({ customer, history, onClose }) => {
  const formatCurrency = (amount) => `PKR ${Number(amount || 0).toFixed(2)}`;
  const formatDate = (date) => new Date(date).toLocaleString();

  if (!customer) return null;

  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title">Customer History</h1>
        <button className="btn btn-secondary" onClick={onClose}>← Back to Customers</button>
      </div>

      {/* Customer Details Section */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <h2>Customer Details</h2>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', padding: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Name</label>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>{customer.name}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Phone</label>
              <div style={{ fontSize: '16px', color: '#475569' }}>{customer.phone || 'N/A'}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Address</label>
              <div style={{ fontSize: '16px', color: '#475569' }}>{customer.address || 'N/A'}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Customer Type</label>
              <div style={{ fontSize: '16px', color: '#475569', textTransform: 'capitalize' }}>{customer.customer_type || 'walk-in'}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Opening Balance</label>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>{formatCurrency(customer.opening_balance || 0)}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Current Balance</label>
              <div style={{ fontSize: '18px', fontWeight: '700', color: customer.current_balance >= 0 ? '#059669' : '#dc2626' }}>
                {formatCurrency(customer.current_balance || 0)}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Status</label>
              <div>
                <span className={`status-badge ${customer.status || 'active'}`} style={{ textTransform: 'capitalize' }}>
                  {customer.status || 'active'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Transaction History</h2>
        </div>
        <div className="customer-history-content">

        <h3>Sales History</h3>
        <table className="history-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Payment Type</th>
            </tr>
          </thead>
          <tbody>
            {history.sales.length === 0 ? (
              <tr><td colSpan="6">No sales found</td></tr>
            ) : (
              history.sales.map(sale => (
                <tr key={sale.sale_id}>
                  <td>{sale.invoice_number}</td>
                  <td>{formatDate(sale.date)}</td>
                  <td>{formatCurrency(sale.total_amount)}</td>
                  <td>{formatCurrency(sale.paid_amount)}</td>
                  <td>{formatCurrency(sale.balance)}</td>
                  <td>{sale.payment_type}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <h3>Payment History</h3>
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {history.payments.length === 0 ? (
              <tr><td colSpan="4">No payments found</td></tr>
            ) : (
              history.payments.map(payment => (
                <tr key={payment.payment_id}>
                  <td>{formatDate(payment.payment_date)}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>{payment.payment_method}</td>
                  <td>{payment.notes || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;

