import React, { useState, useEffect } from 'react';
import { suppliersAPI, supplierPaymentsAPI, purchasesAPI, productsAPI } from '../services/api';
import Pagination from './Pagination';
import './SupplierDetailView.css';
import './Purchases.css';

const SupplierDetailView = ({ supplierId, onClose, readOnly = false }) => {
  const [supplier, setSupplier] = useState(null);
  const [ledger, setLedger] = useState(null);
  const [payments, setPayments] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ledger');
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [purchasesPage, setPurchasesPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [deletePaymentConfirm, setDeletePaymentConfirm] = useState(null);
  const [viewingPurchase, setViewingPurchase] = useState(null);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [deletePurchaseConfirm, setDeletePurchaseConfirm] = useState(null);
  const [newPurchaseModalOpen, setNewPurchaseModalOpen] = useState(false);

  useEffect(() => {
    fetchSupplierDetails();
    fetchLedger();
    fetchPayments();
    fetchPurchases();
    fetchProducts();
  }, [supplierId]);

  useEffect(() => {
    if (activeTab === 'payments') {
      fetchPayments();
    } else if (activeTab === 'purchases') {
      fetchPurchases();
    }
  }, [activeTab, supplierId]);

  const fetchSupplierDetails = async () => {
    try {
      const response = await suppliersAPI.getById(supplierId);
      setSupplier(response.data);
    } catch (err) {
      console.error('Error fetching supplier details:', err);
      setError(err.response?.data?.error || 'Failed to load supplier details');
    }
  };

  const fetchLedger = async () => {
    try {
      setLoading(true);
      const response = await suppliersAPI.getLedger(supplierId);
      setLedger(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching supplier ledger:', err);
      setError(err.response?.data?.error || 'Failed to load supplier ledger');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoadingPayments(true);
      const response = await supplierPaymentsAPI.getAll({ supplier_id: supplierId });
      setPayments(response.data || []);
    } catch (err) {
      console.error('Error fetching supplier payments:', err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const fetchPurchases = async () => {
    try {
      setLoadingPurchases(true);
      const response = await purchasesAPI.getAll();
      const filteredPurchases = (response.data || []).filter(p => p.supplier_id === supplierId);
      setPurchases(filteredPurchases);
    } catch (err) {
      console.error('Error fetching purchases:', err);
    } finally {
      setLoadingPurchases(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handlePurchaseDelete = async (purchaseId) => {
    try {
      await purchasesAPI.delete(purchaseId);
      await fetchPurchases();
      await fetchSupplierDetails();
      await fetchLedger();
      setDeletePurchaseConfirm(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete purchase');
    }
  };

  const handlePurchaseSave = async () => {
    await fetchPurchases();
    await fetchProducts();
    await fetchSupplierDetails();
    await fetchLedger();
    setEditingPurchase(null);
    setViewingPurchase(null);
  };

  const handlePaymentSave = async () => {
    await fetchPayments();
    await fetchSupplierDetails();
    await fetchLedger();
    setPaymentModalOpen(false);
    setEditingPayment(null);
  };

  const handlePaymentDelete = async (paymentId) => {
    try {
      await supplierPaymentsAPI.delete(paymentId);
      await fetchPayments();
      await fetchSupplierDetails();
      await fetchLedger();
      setDeletePaymentConfirm(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete payment');
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

  // Pagination for purchases
  const purchasesTotalPages = Math.ceil(purchases.length / itemsPerPage);
  const purchasesStartIndex = (purchasesPage - 1) * itemsPerPage;
  const paginatedPurchases = purchases.slice(purchasesStartIndex, purchasesStartIndex + itemsPerPage);

  if (loading && !supplier) {
    return (
      <div className="content-container">
        <div className="loading">Loading supplier details...</div>
      </div>
    );
  }

  if (error && !supplier) {
    return (
      <div className="content-container">
        <div className="error-message">{error}</div>
        <button className="btn btn-secondary" onClick={onClose}>Back to Suppliers</button>
      </div>
    );
  }

  const balance = parseFloat(supplier?.current_payable_balance || 0);

  return (
    <div className="content-container">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Supplier Details</h1>
            <p className="page-subtitle">View supplier information, payments, and purchases</p>
          </div>
          <button className="btn btn-secondary" onClick={onClose}>
            ← Back to Suppliers
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Supplier Information Card */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <h2>Supplier Information</h2>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', padding: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                Supplier Name
              </label>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                {supplier?.name || 'N/A'}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                Phone Number
              </label>
              <div style={{ fontSize: '16px', color: '#475569' }}>
                {supplier?.contact_number || '-'}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                Address
              </label>
              <div style={{ fontSize: '16px', color: '#475569' }}>
                {supplier?.address || '-'}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                Amount Already Owed
              </label>
              <div style={{ fontSize: '16px', color: '#475569' }}>
                {formatCurrency(supplier?.opening_balance || 0)}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                Total Credit Purchases
              </label>
              <div style={{ fontSize: '16px', color: '#475569' }}>
                {formatCurrency(supplier?.total_credit_purchases || 0)}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                Total Paid
              </label>
              <div style={{ fontSize: '16px', color: '#475569' }}>
                {formatCurrency(supplier?.total_paid || 0)}
              </div>
            </div>
          </div>

          {/* Current Payable Balance - Prominent Display */}
          <div style={{ 
            marginTop: '24px', 
            padding: '20px', 
            backgroundColor: balance > 0 ? '#fef2f2' : balance === 0 ? '#f0fdf4' : '#f8fafc',
            borderTop: '2px solid',
            borderColor: balance > 0 ? '#dc2626' : balance === 0 ? '#059669' : '#cbd5e1',
            borderRadius: '0 0 8px 8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  Current Payable Balance
                </label>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: '700',
                  color: balance > 0 ? '#dc2626' : balance === 0 ? '#059669' : '#64748b'
                }}>
                  {formatCurrency(balance)}
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', marginBottom: 0 }}>
                  Balance = Amount Already Owed + Credit Purchases − Payments
                </p>
              </div>
              <div style={{ 
                padding: '12px 24px',
                backgroundColor: balance > 0 ? '#dc2626' : balance === 0 ? '#059669' : '#64748b',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px'
              }}>
                {balance > 0 ? 'Amount Due' : balance === 0 ? 'All Paid' : 'Advance Paid'}
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
              className={`tab-button ${activeTab === 'ledger' ? 'active' : ''}`}
              onClick={() => setActiveTab('ledger')}
            >
              Money History
            </button>
            <button
              className={`tab-button ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              Payments
            </button>
            <button
              className={`tab-button ${activeTab === 'purchases' ? 'active' : ''}`}
              onClick={() => setActiveTab('purchases')}
            >
              Purchases
            </button>
          </div>
        </div>

        <div className="card-content">
          {/* Ledger Tab */}
          {activeTab === 'ledger' && (
            <div>
              {loading ? (
                <div className="loading">Loading money history...</div>
              ) : !ledger || !ledger.transactions || ledger.transactions.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '2px dashed #cbd5e1' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>No Transactions Found</div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>No money history available for this supplier.</div>
                </div>
              ) : (
                <>
                  {/* Money History Summary */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                    gap: '20px', 
                    marginBottom: '24px',
                    padding: '20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Amount Already Owed
                      </label>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
                        {formatCurrency(ledger.opening_balance || 0)}
                      </div>
                    </div>
                    <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Current Balance
                      </label>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: '700', 
                        color: parseFloat(ledger.current_balance || 0) > 0 ? '#dc2626' : parseFloat(ledger.current_balance || 0) === 0 ? '#059669' : '#64748b'
                      }}>
                        {formatCurrency(ledger.current_balance || 0)}
                      </div>
                    </div>
                    <div style={{ padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Total Transactions
                      </label>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
                        {ledger.transactions?.length || 0}
                      </div>
                    </div>
                  </div>

                  {/* Money History Table */}
                  <div className="table-container">
                    <table className="ledger-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Description</th>
                          <th style={{ textAlign: 'right' }}>Amount</th>
                          <th style={{ textAlign: 'right' }}>Running Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedTransactions.map((transaction, index) => {
                          const isPurchase = transaction.transaction_type === 'Purchase';
                          const isCredit = isPurchase && transaction.payment_type === 'credit';
                          const runningBalance = parseFloat(transaction.running_balance || 0);
                          
                          return (
                            <tr key={`${transaction.transaction_type}-${transaction.transaction_id}-${index}`}>
                              <td>{formatDateShort(transaction.transaction_date)}</td>
                              <td>
                                <span className={`transaction-type-badge ${isPurchase ? 'purchase' : 'payment'}`}>
                                  {isPurchase ? 'Purchase' : 'Payment'}
                                </span>
                              </td>
                              <td>
                                <div>
                                  <div style={{ fontWeight: '500' }}>
                                    {transaction.description || (isPurchase ? 'Credit Purchase' : 'Payment')}
                                  </div>
                                  {transaction.payment_method && (
                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                                      Method: {transaction.payment_method}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <span style={{
                                  fontWeight: '600',
                                  color: isPurchase ? '#059669' : '#dc2626'
                                }}>
                                  {isPurchase ? '+' : '-'}{formatCurrency(transaction.amount)}
                                </span>
                              </td>
                              <td style={{ textAlign: 'right' }}>
                                <span style={{
                                  fontWeight: '600',
                                  color: runningBalance > 0 ? '#dc2626' : runningBalance === 0 ? '#059669' : '#64748b',
                                  fontSize: '15px'
                                }}>
                                  {formatCurrency(runningBalance)}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
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

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #e2e8f0' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>Supplier Payments</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>All payments made to this supplier</p>
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
                    <span>+</span> Record Payment
                  </button>
                )}
              </div>

              {loadingPayments ? (
                <div className="loading">Loading payments...</div>
              ) : payments.length === 0 ? (
                <div className="empty-state" style={{ padding: '60px 40px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '2px dashed #cbd5e1' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>💳</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>No Payments Found</div>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>No payment records found for this supplier.</div>
                  {!readOnly && (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setEditingPayment(null);
                        setPaymentModalOpen(true);
                      }}
                    >
                      Record First Payment
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="table-container">
                    <table className="supplier-payments-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Payment Method</th>
                          <th>Notes</th>
                          {!readOnly && <th>Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedPayments.map((payment) => (
                          <tr key={payment.payment_id}>
                            <td>{formatDateShort(payment.payment_date)}</td>
                            <td style={{ fontWeight: 'bold', color: '#059669' }}>
                              {formatCurrency(payment.amount)}
                            </td>
                            <td>
                              <span className="payment-method-badge">
                                {payment.payment_method || 'cash'}
                              </span>
                            </td>
                            <td>{payment.notes || '-'}</td>
                            {!readOnly && (
                              <td className="actions-cell">
                                <button
                                  className="btn-edit"
                                  onClick={() => {
                                    setEditingPayment(payment);
                                    setPaymentModalOpen(true);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn-delete"
                                  onClick={() => setDeletePaymentConfirm(payment.payment_id)}
                                >
                                  Delete
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

          {/* Purchases Tab */}
          {activeTab === 'purchases' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #e2e8f0' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>Purchase History</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>All purchases made from this supplier - View, Edit, or Delete purchases</p>
                </div>
                {!readOnly && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setNewPurchaseModalOpen(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <span>+</span> New Purchase
                  </button>
                )}
              </div>

              {loadingPurchases ? (
                <div className="loading">Loading purchases...</div>
              ) : purchases.length === 0 ? (
                  <div className="empty-state" style={{ padding: '60px 40px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '2px dashed #cbd5e1' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>No Purchases Found</div>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>No purchase records found for this supplier.</div>
                  {!readOnly && (
                    <button
                      className="btn btn-primary"
                      onClick={() => setNewPurchaseModalOpen(true)}
                    >
                      Create First Purchase
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="table-container" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                    <table className="purchases-table" style={{ margin: 0 }}>
                      <thead>
                        <tr>
                          <th>Purchase ID</th>
                          <th>Date</th>
                          <th>Items</th>
                          <th style={{ textAlign: 'right' }}>Total Amount</th>
                          <th>Payment Type</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedPurchases.map((purchase) => (
                          <tr key={purchase.purchase_id}>
                            <td><strong style={{ color: '#1e293b' }}>#{purchase.purchase_id}</strong></td>
                            <td>{formatDateShort(purchase.date)}</td>
                            <td>
                              <span style={{ 
                                display: 'inline-block', 
                                padding: '4px 10px', 
                                backgroundColor: '#eff6ff', 
                                color: '#1e40af', 
                                borderRadius: '4px',
                                fontSize: '13px',
                                fontWeight: '600'
                              }}>
                                {purchase.item_count || 0} item{purchase.item_count !== 1 ? 's' : ''}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: '700', fontSize: '15px', color: '#059669' }}>
                              {formatCurrency(purchase.total_amount)}
                            </td>
                            <td>
                              <span className={`payment-badge ${purchase.payment_type || 'cash'}`} style={{ textTransform: 'capitalize', fontSize: '13px' }}>
                                {purchase.payment_type || 'cash'}
                              </span>
                            </td>
                            <td className="actions-cell">
                              <button
                                className="btn-view"
                                onClick={async () => {
                                  try {
                                    const response = await purchasesAPI.getById(purchase.purchase_id);
                                    setViewingPurchase(response.data);
                                  } catch (err) {
                                    alert('Failed to load purchase details');
                                  }
                                }}
                              >
                                View
                              </button>
                              {!readOnly && (
                                <>
                                  <button
                                    className="btn-edit"
                                    onClick={async () => {
                                      try {
                                        const response = await purchasesAPI.getById(purchase.purchase_id);
                                        setEditingPurchase(response.data);
                                      } catch (err) {
                                        alert('Failed to load purchase for editing');
                                      }
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn-delete"
                                    onClick={() => setDeletePurchaseConfirm(purchase.purchase_id)}
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {purchases.length > 0 && (
                    <Pagination
                      currentPage={purchasesPage}
                      totalPages={purchasesTotalPages}
                      itemsPerPage={itemsPerPage}
                      totalItems={purchases.length}
                      onPageChange={setPurchasesPage}
                      onItemsPerPageChange={(newItemsPerPage) => {
                        setItemsPerPage(newItemsPerPage);
                        setPurchasesPage(1);
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
        <SupplierPaymentModal
          payment={editingPayment}
          supplierId={supplierId}
          supplierName={supplier?.name}
          currentBalance={supplier?.current_payable_balance || 0}
          onClose={() => {
            setPaymentModalOpen(false);
            setEditingPayment(null);
          }}
          onSave={handlePaymentSave}
        />
      )}

      {/* Delete Payment Confirmation */}
      {deletePaymentConfirm && (
        <div className="modal-overlay" onClick={() => setDeletePaymentConfirm(null)}>
          <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this payment? This will update the supplier balance.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeletePaymentConfirm(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handlePaymentDelete(deletePaymentConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Detail View Modal */}
      {viewingPurchase && !editingPurchase && (
        <PurchaseDetailModal
          purchase={viewingPurchase}
          onClose={() => setViewingPurchase(null)}
          onEdit={() => {
            setEditingPurchase(viewingPurchase);
            setViewingPurchase(null);
          }}
          onDelete={(purchaseId) => {
            if (window.confirm('Are you sure you want to delete this purchase? This will reverse stock updates.')) {
              handlePurchaseDelete(purchaseId);
              setViewingPurchase(null);
            }
          }}
          readOnly={readOnly}
        />
      )}

      {/* New Purchase Modal */}
      {newPurchaseModalOpen && (
        <PurchaseEditModal
          purchase={null}
          supplierId={supplierId}
          supplierName={supplier?.name}
          products={products}
          onSave={async () => {
            await handlePurchaseSave();
            setNewPurchaseModalOpen(false);
          }}
          onClose={() => setNewPurchaseModalOpen(false)}
        />
      )}

      {/* Purchase Edit Modal */}
      {editingPurchase && (
        <PurchaseEditModal
          purchase={editingPurchase}
          supplierId={supplierId}
          supplierName={supplier?.name}
          products={products}
          onSave={handlePurchaseSave}
          onClose={() => {
            setEditingPurchase(null);
            setViewingPurchase(null);
          }}
        />
      )}

      {/* Delete Purchase Confirmation */}
      {deletePurchaseConfirm && (
        <div className="modal-overlay" onClick={() => setDeletePurchaseConfirm(null)}>
          <div className="modal delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this purchase? This will reverse stock updates and supplier balance.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeletePurchaseConfirm(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  handlePurchaseDelete(deletePurchaseConfirm);
                  setDeletePurchaseConfirm(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Purchase Detail Modal Component
const PurchaseDetailModal = ({ purchase, onClose, onEdit, onDelete, readOnly }) => {
  const formatCurrency = (amount) => `PKR ${Number(amount || 0).toFixed(2)}`;
  const formatDate = (date) => new Date(date).toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
      <div className="modal" style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', zIndex: 2001, backgroundColor: '#ffffff' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', padding: '20px', backgroundColor: '#f8fafc' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>Purchase Details</h2>
          <button className="modal-close" onClick={onClose} style={{ fontSize: '24px', color: '#64748b' }}>×</button>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#ffffff' }}>
          {/* Purchase Information Card */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-header">
              <h2>Purchase Information</h2>
            </div>
            <div className="card-content">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', padding: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Purchase ID</label>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>#{purchase.purchase_id}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Supplier</label>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>{purchase.supplier_name || 'N/A'}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Date</label>
              <div style={{ fontSize: '16px', color: '#475569' }}>{formatDate(purchase.date)}</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Payment Type</label>
              <div>
                <span className={`payment-badge ${purchase.payment_type || 'cash'}`} style={{ textTransform: 'capitalize' }}>
                  {purchase.payment_type || 'cash'}
                </span>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Total Items</label>
              <div style={{ fontSize: '16px', color: '#475569' }}>{purchase.items?.length || 0} item(s)</div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Total Amount</label>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#059669' }}>{formatCurrency(purchase.total_amount)}</div>
            </div>
              </div>
            </div>
          </div>

          {/* Items Table Card */}
          <div className="card">
            <div className="card-header">
              <h2>Purchase Items</h2>
            </div>
            <div className="table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Cost Price</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {purchase.items && purchase.items.length > 0 ? (
                    purchase.items.map((item, idx) => (
                      <tr key={idx}>
                        <td><strong>{item.item_name || 'N/A'}</strong></td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.cost_price)}</td>
                        <td style={{ textAlign: 'right' }}><strong>{formatCurrency(item.subtotal || (item.quantity * item.cost_price))}</strong></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="empty-state">No items found</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'right', fontWeight: '700', padding: '16px' }}>Total:</td>
                    <td style={{ fontWeight: '700', fontSize: '18px', color: '#059669', padding: '16px', textAlign: 'right' }}>
                      {formatCurrency(purchase.total_amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Actions */}
          {!readOnly && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
              <button className="btn btn-primary" onClick={onEdit}>
                Edit Purchase
              </button>
              <button className="btn btn-danger" onClick={() => onDelete(purchase.purchase_id)}>
                Delete Purchase
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Purchase Edit Modal Component (simplified version for supplier detail view)
const PurchaseEditModal = ({ purchase, supplierId, supplierName, products, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    supplier_id: supplierId.toString(),
    payment_type: purchase?.payment_type || 'cash',
    date: purchase?.date?.split('T')[0] || new Date().toISOString().split('T')[0],
    items: purchase?.items?.map(item => ({
      item_id: item.item_id || item.product_id,
      quantity: item.quantity,
      cost_price: item.cost_price,
    })) || [],
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [itemQty, setItemQty] = useState('1');
  const [itemPrice, setItemPrice] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddItem = () => {
    if (!selectedProduct || !itemQty || !itemPrice) return;
    const existingIndex = formData.items.findIndex(i => i.item_id === selectedProduct.product_id);
    if (existingIndex >= 0) {
      const updated = [...formData.items];
      updated[existingIndex].quantity += parseInt(itemQty);
      updated[existingIndex].cost_price = parseFloat(itemPrice);
      setFormData({...formData, items: updated});
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, {
          item_id: selectedProduct.product_id,
          quantity: parseInt(itemQty),
          cost_price: parseFloat(itemPrice),
        }]
      });
    }
    setSelectedProduct(null);
    setItemQty('1');
    setItemPrice('');
  };

  const handleRemoveItem = (index) => {
    setFormData({...formData, items: formData.items.filter((_, i) => i !== index)});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      alert('Please add at least one item');
      return;
    }
    setSaving(true);
    try {
      await purchasesAPI.update(purchase.purchase_id, formData);
      await onSave();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update purchase');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => `PKR ${Number(amount || 0).toFixed(2)}`;
  const total = formData.items.reduce((sum, item) => sum + (item.quantity * item.cost_price), 0);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
      <div className="modal purchase-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', zIndex: 2001 }}>
        <div className="modal-header">
          <h2>{purchase ? `Edit Purchase #${purchase.purchase_id}` : 'New Purchase'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-content">
          {supplierName && (
            <div style={{ padding: '12px 16px', marginBottom: '16px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Supplier</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1e40af' }}>{supplierName}</div>
            </div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payment Type</label>
              <select className="form-input" value={formData.payment_type} onChange={(e) => setFormData({...formData, payment_type: e.target.value})}>
                <option value="cash">Cash</option>
                <option value="credit">Credit</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>

          <div className="purchase-items-section">
            <h3>Items</h3>
            <div className="form-row">
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Product</label>
                <select className="form-input" value={selectedProduct?.product_id || ''} onChange={(e) => {
                  const product = products.find(p => p.product_id === parseInt(e.target.value));
                  setSelectedProduct(product || null);
                  setItemPrice(product?.purchase_price || '');
                }}>
                  <option value="">Select Product</option>
                  {products.map(p => <option key={p.product_id} value={p.product_id}>
                    {p.item_name_english || p.name || 'Product'} (Stock: {p.quantity_in_stock || 0})
                  </option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input 
                  type="number" 
                  className="form-input purchase-input" 
                  min="1" 
                  value={itemQty} 
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || (!isNaN(val) && parseFloat(val) >= 0)) {
                      setItemQty(val);
                    }
                  }}
                  onBlur={(e) => {
                    if (!e.target.value || parseFloat(e.target.value) < 1) {
                      setItemQty('1');
                    }
                  }}
                  placeholder="Enter quantity"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cost Price</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="form-input purchase-input" 
                  min="0"
                  value={itemPrice} 
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || (!isNaN(val) && parseFloat(val) >= 0)) {
                      setItemPrice(val);
                    }
                  }}
                  onBlur={(e) => {
                    if (!e.target.value || parseFloat(e.target.value) < 0) {
                      setItemPrice('0');
                    }
                  }}
                  placeholder="Enter cost price"
                />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="button" className="btn btn-primary" onClick={handleAddItem}>Add</button>
              </div>
            </div>

            {formData.items.length > 0 && (
              <table className="items-table" style={{ marginTop: '12px', width: '100%' }}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, idx) => {
                    const product = products.find(p => p.product_id === item.item_id);
                    const productName = product?.item_name_english || product?.name || 'N/A';
                    return (
                      <tr key={idx}>
                        <td>{productName}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.cost_price)}</td>
                        <td>{formatCurrency(item.quantity * item.cost_price)}</td>
                        <td><button type="button" className="btn-delete" onClick={() => handleRemoveItem(idx)}>Remove</button></td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3"><strong>Total:</strong></td>
                    <td><strong>{formatCurrency(total)}</strong></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : purchase ? 'Update Purchase' : 'Save Purchase'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Payment Modal Component
const SupplierPaymentModal = ({ payment, supplierId, supplierName, currentBalance, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    amount: payment?.amount?.toString() || '',
    payment_method: payment?.payment_method || 'cash',
    payment_date: payment?.payment_date?.split('T')[0] || new Date().toISOString().split('T')[0],
    notes: payment?.notes || '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const newErrors = {};

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (amount > parseFloat(currentBalance || 0)) {
      newErrors.amount = `Payment amount exceeds payable balance (${formatCurrency(currentBalance)})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSaving(true);
    try {
      const submitData = {
        supplier_id: supplierId,
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method,
        payment_date: formData.payment_date,
        notes: formData.notes.trim() || null,
      };

      if (payment) {
        await supplierPaymentsAPI.update(payment.payment_id, submitData);
      } else {
        await supplierPaymentsAPI.create(submitData);
      }
      await onSave();
    } catch (err) {
      const errorMessage = err.response?.data?.error || `Failed to ${payment ? 'update' : 'create'} payment`;
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => `PKR ${Number(amount || 0).toFixed(2)}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal supplier-payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{payment ? 'Edit Payment' : 'Record Supplier Payment'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="supplier-payment-form">
          <div className="form-group">
            <label className="form-label">
              Supplier
            </label>
            <input
              type="text"
              className="form-input"
              value={supplierName || ''}
              disabled
              style={{ backgroundColor: '#f8fafc', color: '#64748b' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Amount (PKR) <span className="required">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              className={`form-input ${errors.amount ? 'error' : ''}`}
              placeholder="0.00"
            />
            {errors.amount && <span className="error-message">{errors.amount}</span>}
            <p className="form-help-text" style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Current Payable Balance: <strong>{formatCurrency(currentBalance)}</strong>
            </p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className="form-input"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="payment_date"
                value={formData.payment_date}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-input"
              placeholder="Payment notes..."
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : (payment ? 'Update Payment' : 'Record Payment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierDetailView;
