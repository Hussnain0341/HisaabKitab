import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { customersAPI } from '../services/api';
import CustomerModal from './CustomerModal';
import CustomerDetailView from './CustomerDetailView';
import Pagination from './Pagination';
import './Customers.css';

const Customers = ({ readOnly = false }) => {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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
      setError(err.response?.data?.error || t('customers.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const handleView = (customer) => {
    setViewingCustomer(customer.customer_id);
  };

  const handleAdd = () => {
    setEditingCustomer(null);
    setModalOpen(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setModalOpen(true);
  };

  const handleDelete = async (customerId) => {
    try {
      await customersAPI.delete(customerId);
      setCustomers(customers.filter(c => c.customer_id !== customerId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert(err.response?.data?.error || t('customers.failedToDelete'));
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCustomer(null);
  };

  const handleModalSave = async (customerData) => {
    try {
      if (editingCustomer) {
        const response = await customersAPI.update(editingCustomer.customer_id, customerData);
        setCustomers(customers.map(c => 
          c.customer_id === editingCustomer.customer_id ? response.data : c
        ));
      } else {
        const response = await customersAPI.create(customerData);
        setCustomers([...customers, response.data].sort((a, b) => 
          (parseFloat(b.current_due) || 0) - (parseFloat(a.current_due) || 0)
        ));
      }
      handleModalClose();
    } catch (err) {
      console.error('Error saving customer:', err);
      throw err; // Let modal handle the error display
    }
  };

  const formatCurrency = (amount) => {
    return `PKR ${Number(amount || 0).toFixed(2)}`;
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) {
      return customers;
    }
    const query = searchQuery.toLowerCase().trim();
    return customers.filter(customer => {
      const name = (customer.name || '').toLowerCase();
      const phone = (customer.phone || '').toLowerCase();
      return name.includes(query) || phone.includes(query);
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
    return (
      <div className="content-container">
        <div className="loading">{t('common.loading')} {t('customers.title').toLowerCase()}...</div>
      </div>
    );
  }

  // Show customer detail view if viewing a customer
  if (viewingCustomer) {
    return (
      <CustomerDetailView
        customerId={viewingCustomer}
        onClose={() => {
          setViewingCustomer(null);
          fetchCustomers(); // Refresh list when returning
        }}
        readOnly={readOnly}
      />
    );
  }

  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title">{t('customers.title')}</h1>
        <p className="page-subtitle">{t('customers.subtitle')}</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!readOnly && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="card-header">
            <div className="card-header-content">
              <h2>{t('customers.title')}</h2>
              <button className="btn btn-primary" onClick={handleAdd}>
                + {t('customers.addCustomer')}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <CustomerModal
          customer={editingCustomer}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}

      {!modalOpen && (
        <>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, maxWidth: '400px' }}>
                  <label className="form-label" style={{ marginBottom: '8px', display: 'block', fontSize: '13px' }}>{t('customers.searchCustomer')}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={t('customers.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ fontSize: '14px', width: '100%' }}
                  />
                </div>
                {searchQuery && (
                  <button className="btn btn-secondary" onClick={() => setSearchQuery('')}>
                    {t('common.clear')}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-header-content">
                <h2>{t('customers.customersList')}</h2>
                {readOnly && (
                  <span className="read-only-notice">{t('common.readOnlyMode')}</span>
                )}
              </div>
            </div>

            <div className="table-container">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>{t('customers.customerName')}</th>
                    <th>{t('customers.mobileNumber')}</th>
                    <th>{t('customers.totalDue')}</th>
                    <th>{t('customers.lastActivity')}</th>
                    <th>{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        {searchQuery ? t('customers.noCustomersMatching', { query: searchQuery }) : t('customers.noCustomers')}
                      </td>
                    </tr>
                  ) : (
                    paginatedCustomers.map((customer) => {
                      const due = parseFloat(customer.current_due || customer.current_balance || 0);
                      const lastActivity = customer.last_sale_date || customer.last_payment_date;
                      return (
                        <tr key={customer.customer_id}>
                          <td><strong>{customer.name}</strong></td>
                          <td>{customer.phone || '-'}</td>
                          <td>
                            <span 
                              style={{
                                fontWeight: 'bold',
                                color: due > 0 ? '#dc2626' : due === 0 ? '#059669' : '#64748b',
                                fontSize: '15px'
                              }}
                            >
                              {formatCurrency(due)}
                            </span>
                          </td>
                          <td>{formatDate(lastActivity)}</td>
                          <td className="actions-cell">
                            {!readOnly ? (
                              <>
                                <button
                                  className="btn-view"
                                  onClick={() => handleView(customer)}
                                >
                                  {t('common.view')}
                                </button>
                                <button
                                  className="btn-edit"
                                  onClick={() => handleEdit(customer)}
                                >
                                  {t('common.edit')}
                                </button>
                                <button
                                  className="btn-delete"
                                  onClick={() => setDeleteConfirm(customer.customer_id)}
                                >
                                  {t('common.delete')}
                                </button>
                              </>
                            ) : (
                              <span className="read-only-label">{t('common.viewOnly')}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
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
          </div>

          {deleteConfirm && (
            <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
              <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
                <h3>{t('common.confirmDelete')}</h3>
                <p>{t('customers.deleteConfirm')} {t('common.cannotBeUndone')}</p>
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                    {t('common.cancel')}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(deleteConfirm)}
                  >
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Customers;

