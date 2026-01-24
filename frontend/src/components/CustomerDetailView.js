import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { customersAPI, customerPaymentsAPI, salesAPI } from '../services/api';
import Pagination from './Pagination';
import './CustomerDetailView.css';
import './SupplierDetailView.css';

const CustomerDetailView = ({ customerId, onClose, readOnly = false }) => {
  const { t } = useTranslation();
  const [customer, setCustomer] = useState(null);
  const [ledger, setLedger] = useState(null);
  const [payments, setPayments] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [loadingSales, setLoadingSales] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [salesPage, setSalesPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [deletePaymentConfirm, setDeletePaymentConfirm] = useState(null);
  const [viewingSale, setViewingSale] = useState(null);

  useEffect(() => {
    fetchCustomerDetails();
    fetchLedger();
    fetchPayments();
    fetchSales();
  }, [customerId]);

  useEffect(() => {
    if (activeTab === 'payments') {
      fetchPayments();
    } else if (activeTab === 'sales') {
      fetchSales();
    }
  }, [activeTab, customerId]);

  const fetchCustomerDetails = async () => {
    try {
      const response = await customersAPI.getById(customerId);
      setCustomer(response.data);
    } catch (err) {
      console.error('Error fetching customer details:', err);
      setError(err.response?.data?.error || t('customers.failedToLoadDetails'));
    }
  };

  const fetchLedger = async () => {
    try {
      setLoading(true);
      const response = await customersAPI.getLedger(customerId);
      setLedger(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching customer ledger:', err);
      setError(err.response?.data?.error || t('customers.failedToLoadLedger'));
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoadingPayments(true);
      const response = await customerPaymentsAPI.getAll({ customer_id: customerId });
      setPayments(response.data || []);
    } catch (err) {
      console.error('Error fetching customer payments:', err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const fetchSales = async () => {
    try {
      setLoadingSales(true);
      const response = await salesAPI.getAll();
      const filteredSales = (response.data || []).filter(s => s.customer_id === customerId);
      setSales(filteredSales);
    } catch (err) {
      console.error('Error fetching sales:', err);
    } finally {
      setLoadingSales(false);
    }
  };

  const handlePaymentSave = async () => {
    await fetchPayments();
    await fetchCustomerDetails();
    await fetchLedger();
    setPaymentModalOpen(false);
    setEditingPayment(null);
  };

  const handlePaymentDelete = async (paymentId) => {
    try {
      await customerPaymentsAPI.delete(paymentId);
      await fetchPayments();
      await fetchCustomerDetails();
      await fetchLedger();
      setDeletePaymentConfirm(null);
    } catch (err) {
      alert(err.response?.data?.error || t('customers.failedToDeletePayment'));
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Pagination for ledger transactions
  const ledgerTransactions = ledger?.transactions || [];
  const ledgerTotalPages = Math.ceil(ledgerTransactions.length / itemsPerPage);
  const ledgerStartIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = ledgerTransactions.slice(ledgerStartIndex, ledgerStartIndex + itemsPerPage);

  // Pagination for payments
  const paymentsTotalPages = Math.ceil(payments.length / itemsPerPage);
  const paymentsStartIndex = (paymentsPage - 1) * itemsPerPage;
  const paginatedPayments = payments.slice(paymentsStartIndex, paymentsStartIndex + itemsPerPage);

  // Pagination for sales
  const salesTotalPages = Math.ceil(sales.length / itemsPerPage);
  const salesStartIndex = (salesPage - 1) * itemsPerPage;
  const paginatedSales = sales.slice(salesStartIndex, salesStartIndex + itemsPerPage);

  // Calculate summary values
  const totalPurchases = sales.reduce((sum, sale) => sum + (parseFloat(sale.total_amount) || 0), 0);
  const totalPaymentsReceived = payments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
  const previousDue = parseFloat(customer?.opening_balance) || 0;
  const currentRemainingDue = parseFloat(customer?.current_due) || 0;

  if (loading && !customer) {
    return (
      <div className="content-container">
        <div className="loading">{t('common.loading')} {t('customers.customerDetails').toLowerCase()}...</div>
      </div>
    );
  }

  if (error && !customer) {
    return (
      <div className="content-container">
        <div className="error-message">{error}</div>
        <button className="btn btn-secondary" onClick={onClose}>{t('customers.backToCustomers')}</button>
      </div>
    );
  }

  return (
    <div className="content-container">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">{t('customers.customerDetails')}</h1>
            <p className="page-subtitle">{t('customers.customerDetailsSubtitle')}</p>
          </div>
          <button className="btn btn-secondary" onClick={onClose}>
            ← {t('customers.backToCustomers')}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Customer Information Card */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <h2>{t('customers.customerInformation')}</h2>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', padding: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                {t('customers.customerName')}
              </label>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                {customer?.name || 'N/A'}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                {t('customers.mobileNumber')}
              </label>
              <div style={{ fontSize: '16px', color: '#475569' }}>
                {customer?.phone || '-'}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                {t('customers.address')}
              </label>
              <div style={{ fontSize: '16px', color: '#475569' }}>
                {customer?.address || '-'}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                {t('customers.customerType')}
              </label>
              <div style={{ fontSize: '16px', color: '#475569', textTransform: 'capitalize' }}>
                {customer?.customer_type || 'cash'}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                {t('customers.previousDue')}
              </label>
              <div style={{ fontSize: '16px', color: '#475569' }}>
                {formatCurrency(previousDue)}
              </div>
            </div>
            {customer?.credit_limit && (
              <div>
                <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  {t('customers.creditLimit')}
                </label>
                <div style={{ fontSize: '16px', color: '#475569' }}>
                  {formatCurrency(customer.credit_limit)}
                </div>
              </div>
            )}
          </div>

          {/* Current Remaining Due - Prominent Display */}
          <div style={{ 
            marginTop: '24px', 
            padding: '20px', 
            backgroundColor: currentRemainingDue > 0 ? '#fef2f2' : currentRemainingDue === 0 ? '#f0fdf4' : '#f8fafc',
            borderTop: '2px solid',
            borderColor: currentRemainingDue > 0 ? '#dc2626' : currentRemainingDue === 0 ? '#059669' : '#cbd5e1',
            borderRadius: '0 0 8px 8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  {t('customers.currentRemainingDue')}
                </label>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: '700',
                  color: currentRemainingDue > 0 ? '#dc2626' : currentRemainingDue === 0 ? '#059669' : '#64748b'
                }}>
                  {formatCurrency(currentRemainingDue)}
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', marginBottom: 0 }}>
                  {t('customers.dueFormula')}
                </p>
              </div>
              <div style={{ 
                padding: '12px 24px',
                backgroundColor: currentRemainingDue > 0 ? '#dc2626' : currentRemainingDue === 0 ? '#059669' : '#64748b',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px'
              }}>
                {currentRemainingDue > 0 ? t('customers.amountDue') : currentRemainingDue === 0 ? t('customers.allPaid') : t('customers.advancePaid')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="card-header">
          <div className="tabs-container">
            <button
              className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              {t('customers.summary')}
            </button>
            <button
              className={`tab-button ${activeTab === 'sales' ? 'active' : ''}`}
              onClick={() => setActiveTab('sales')}
            >
              {t('customers.sales')}
            </button>
            <button
              className={`tab-button ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              {t('customers.payments')}
            </button>
            <button
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              {t('customers.moneyHistory')}
            </button>
          </div>
        </div>

        <div className="card-content">

          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div className="summary-card" style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>{t('customers.totalPurchases')}</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>{formatCurrency(totalPurchases)}</div>
                </div>
                <div className="summary-card" style={{ padding: '24px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>{t('customers.totalPaymentsReceived')}</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#059669' }}>{formatCurrency(totalPaymentsReceived)}</div>
                </div>
                <div className="summary-card" style={{ padding: '24px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>{t('customers.previousDue')}</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#d97706' }}>{formatCurrency(previousDue)}</div>
                </div>
                <div className="summary-card" style={{ padding: '24px', backgroundColor: currentRemainingDue > 0 ? '#fee2e2' : '#f0fdf4', borderRadius: '8px', border: `1px solid ${currentRemainingDue > 0 ? '#fecaca' : '#bbf7d0'}` }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase' }}>{t('customers.currentRemainingDue')}</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: currentRemainingDue > 0 ? '#dc2626' : '#059669' }}>{formatCurrency(currentRemainingDue)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Sales Tab */}
          {activeTab === 'sales' && (
            <div style={{ padding: '20px' }}>
              {loadingSales ? (
                <div className="loading">{t('common.loading')} {t('customers.sales').toLowerCase()}...</div>
              ) : sales.length === 0 ? (
                <div className="empty-state" style={{ padding: '60px 40px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '2px dashed #cbd5e1' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>{t('customers.noSalesFound')}</div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>{t('customers.noSalesRecords')}</div>
                </div>
              ) : (
                <>
                  <div className="table-container" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <table className="purchases-table" style={{ margin: 0 }}>
                      <thead>
                        <tr>
                          <th>{t('customers.invoiceNumber')}</th>
                          <th>{t('common.date')}</th>
                          <th style={{ textAlign: 'right' }}>{t('customers.totalAmount')}</th>
                          <th style={{ textAlign: 'right' }}>{t('customers.paidAmount')}</th>
                          <th style={{ textAlign: 'right' }}>{t('customers.remainingDue')}</th>
                          <th>{t('common.actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedSales.map((sale) => {
                          const remainingDue = (parseFloat(sale.total_amount) || 0) - (parseFloat(sale.paid_amount) || 0);
                          return (
                            <tr key={sale.sale_id}>
                              <td><strong>{sale.invoice_number}</strong></td>
                              <td>{formatDateShort(sale.date)}</td>
                              <td style={{ textAlign: 'right' }}>{formatCurrency(sale.total_amount)}</td>
                              <td style={{ textAlign: 'right' }}>{formatCurrency(sale.paid_amount)}</td>
                              <td style={{ textAlign: 'right', fontWeight: '600', color: remainingDue > 0 ? '#dc2626' : '#059669' }}>
                                {formatCurrency(remainingDue)}
                              </td>
                              <td>
                                <button
                                  className="btn-view"
                                  onClick={() => setViewingSale(sale)}
                                >
                                  {t('common.view')}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {sales.length > 0 && (
                    <Pagination
                      currentPage={salesPage}
                      totalPages={salesTotalPages}
                      itemsPerPage={itemsPerPage}
                      totalItems={sales.length}
                      onPageChange={setSalesPage}
                      onItemsPerPageChange={(newItemsPerPage) => {
                        setItemsPerPage(newItemsPerPage);
                        setSalesPage(1);
                      }}
                    />
                  )}
                </>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>{t('customers.paymentHistory')}</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>{t('customers.allPaymentsReceived')}</p>
                </div>
                {!readOnly && (
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setEditingPayment(null);
                      setPaymentModalOpen(true);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <span>+</span> {t('customers.receivePayment')}
                  </button>
                )}
              </div>

          {loadingPayments ? (
            <div className="loading">{t('common.loading')} {t('customers.payments').toLowerCase()}...</div>
          ) : payments.length === 0 ? (
            <div className="empty-state" style={{ padding: '60px 40px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '2px dashed #cbd5e1' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>💰</div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>{t('customers.noPaymentsFound')}</div>
              <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>{t('customers.noPaymentRecords')}</div>
              {!readOnly && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingPayment(null);
                    setPaymentModalOpen(true);
                  }}
                >
                  {t('customers.recordFirstPayment')}
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="table-container" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <table className="purchases-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>{t('common.date')}</th>
                      <th style={{ textAlign: 'right' }}>{t('customers.amountReceived')}</th>
                      <th>{t('customers.paymentMethod')}</th>
                      <th>{t('expenses.notes')}</th>
                      {!readOnly && <th>{t('common.actions')}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPayments.map((payment) => (
                      <tr key={payment.payment_id}>
                        <td>{formatDateShort(payment.payment_date)}</td>
                        <td style={{ textAlign: 'right', fontWeight: '600', color: '#059669' }}>
                          {formatCurrency(payment.amount)}
                        </td>
                        <td>{payment.payment_method || t('billing.cash')}</td>
                        <td>{payment.notes || '-'}</td>
                        {!readOnly && (
                          <td>
                            <button
                              className="btn-edit"
                              onClick={() => {
                                setEditingPayment(payment);
                                setPaymentModalOpen(true);
                              }}
                              style={{ marginRight: '8px' }}
                            >
                              {t('common.edit')}
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => setDeletePaymentConfirm(payment.payment_id)}
                            >
                              {t('common.delete')}
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {payments.length > 0 && (
                <Pagination
                  currentPage={paymentsPage}
                  totalPages={paymentsTotalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={payments.length}
                  onPageChange={setPaymentsPage}
                  onItemsPerPageChange={(newItemsPerPage) => {
                    setItemsPerPage(newItemsPerPage);
                    setPaymentsPage(1);
                  }}
                />
              )}
            </>
          )}
        </div>
      )}

          {/* History Tab (Money History) */}
          {activeTab === 'history' && (
            <div style={{ padding: '20px' }}>
              {loading ? (
                <div className="loading">Loading history...</div>
              ) : ledgerTransactions.length === 0 ? (
                <div className="empty-state" style={{ padding: '60px 40px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '2px dashed #cbd5e1' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>📊</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>No History Found</div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>No transaction history found for this customer.</div>
                </div>
              ) : (
                <>
                  <div className="table-container" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <table className="purchases-table" style={{ margin: 0 }}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Description</th>
                          <th style={{ textAlign: 'right' }}>Amount</th>
                          <th style={{ textAlign: 'right' }}>Running Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedTransactions.map((transaction, index) => (
                          <tr key={`${transaction.type}-${transaction.sale_id || transaction.payment_id || index}`}>
                            <td>{formatDateShort(transaction.date)}</td>
                            <td>
                              <strong>{transaction.description}</strong>
                              {transaction.invoice_number && (
                                <span style={{ marginLeft: '8px', fontSize: '12px', color: '#64748b' }}>
                                  ({transaction.invoice_number})
                                </span>
                              )}
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: '600', color: transaction.amount >= 0 ? '#dc2626' : '#059669' }}>
                              {transaction.amount >= 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: '700', color: transaction.running_balance > 0 ? '#dc2626' : transaction.running_balance === 0 ? '#059669' : '#64748b' }}>
                              {formatCurrency(transaction.running_balance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {ledgerTransactions.length > 0 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={ledgerTotalPages}
                      itemsPerPage={itemsPerPage}
                      totalItems={ledgerTransactions.length}
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
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {paymentModalOpen && (
        <CustomerPaymentModal
          customerId={customerId}
          customerName={customer?.name}
          payment={editingPayment}
          onSave={handlePaymentSave}
          onClose={() => {
            setPaymentModalOpen(false);
            setEditingPayment(null);
          }}
        />
      )}

      {/* Delete Payment Confirmation */}
      {deletePaymentConfirm && (
        <div className="modal-overlay" onClick={() => setDeletePaymentConfirm(null)}>
          <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t('common.confirmDelete')}</h3>
            <p>{t('customers.confirmDeletePayment')}</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeletePaymentConfirm(null)}>
                {t('common.cancel')}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handlePaymentDelete(deletePaymentConfirm)}
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sale Detail Modal */}
      {viewingSale && (
        <SaleDetailModal
          sale={viewingSale}
          onClose={() => setViewingSale(null)}
        />
      )}
    </div>
  );
};

// Customer Payment Modal Component
const CustomerPaymentModal = ({ customerId, customerName, payment, onSave, onClose }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    amount: payment?.amount?.toString() || '',
    payment_date: payment?.payment_date?.split('T')[0] || new Date().toISOString().split('T')[0],
    payment_method: payment?.payment_method || 'cash',
    notes: payment?.notes || '',
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = t('customers.amountMustBeGreaterThanZero');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const submitData = {
        customer_id: customerId,
        amount: parseFloat(formData.amount),
        payment_date: formData.payment_date,
        payment_method: formData.payment_method,
        notes: formData.notes.trim() || null,
      };

      if (payment) {
        await customerPaymentsAPI.update(payment.payment_id, submitData);
      } else {
        await customerPaymentsAPI.create(submitData);
      }
      await onSave();
    } catch (err) {
      alert(err.response?.data?.error || (payment ? t('customers.failedToUpdatePayment') : t('customers.failedToCreatePayment')));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', zIndex: 2001 }}>
        <div className="modal-header">
          <h2>{payment ? t('customers.editPayment') : t('customers.receivePayment')}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-content">
          {customerName && (
            <div style={{ padding: '12px 16px', marginBottom: '16px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>{t('customers.customer')}</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af' }}>{customerName}</div>
            </div>
          )}
          <div className="form-group">
            <label className="form-label">{t('expenses.amount')} *</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
            />
            {errors.amount && <div className="error-text">{errors.amount}</div>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('customers.paymentMethod')}</label>
              <select
                className="form-input"
                value={formData.payment_method}
                onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
              >
                <option value="cash">{t('billing.cash')}</option>
                <option value="bank">{t('billing.bankTransfer')}</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('common.date')}</label>
              <input
                type="date"
                className="form-input"
                value={formData.payment_date}
                onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">{t('expenses.notes')} ({t('common.optional')})</label>
            <textarea
              className="form-input"
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder={t('customers.paymentNotesPlaceholder')}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>{t('common.cancel')}</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? t('common.loading') : payment ? t('customers.updatePayment') : t('customers.savePayment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sale Detail Modal Component
const SaleDetailModal = ({ sale, onClose }) => {
  const { t } = useTranslation();
  const formatCurrency = (amount) => `PKR ${Number(amount || 0).toFixed(2)}`;
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
      <div className="modal purchase-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', zIndex: 2001 }}>
        <div className="modal-header">
          <h2>{t('customers.saleDetails')} - {t('customers.invoice')} #{sale.invoice_number}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>{t('customers.invoiceNumber')}</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{sale.invoice_number}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>{t('common.date')}</div>
                <div style={{ fontSize: '16px' }}>{formatDate(sale.date)}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>{t('billing.paymentType')}</div>
                <div style={{ fontSize: '16px', textTransform: 'capitalize' }}>{sale.payment_type}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>{t('customers.totalAmount')}</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>{formatCurrency(sale.total_amount)}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>{t('customers.paidAmount')}</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#059669' }}>{formatCurrency(sale.paid_amount)}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>{t('customers.remainingDue')}</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#dc2626' }}>
                  {formatCurrency((parseFloat(sale.total_amount) || 0) - (parseFloat(sale.paid_amount) || 0))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailView;

