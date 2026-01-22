import React, { useState, useEffect } from 'react';
import { expensesAPI } from '../services/api';
import Pagination from './Pagination';
import './Expenses.css';

const Expenses = ({ readOnly = false }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filterType, setFilterType] = useState('daily');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    updateDateRange();
  }, [filterType]);

  useEffect(() => {
    fetchExpenses();
  }, [startDate, endDate]);

  const updateDateRange = () => {
    const today = new Date();
    let start, end;
    
    switch (filterType) {
      case 'daily':
        start = end = today.toISOString().split('T')[0];
        break;
      case 'weekly':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        start = weekStart.toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      case 'monthly':
        start = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      case 'last3months':
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        start = threeMonthsAgo.toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      case 'last6months':
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        start = sixMonthsAgo.toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      case 'thisyear':
        start = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      case 'lastyear':
        const lastYear = today.getFullYear() - 1;
        start = new Date(lastYear, 0, 1).toISOString().split('T')[0];
        end = new Date(lastYear, 11, 31).toISOString().split('T')[0];
        break;
      case 'custom':
        start = customStartDate || today.toISOString().split('T')[0];
        end = customEndDate || today.toISOString().split('T')[0];
        break;
      default:
        start = end = today.toISOString().split('T')[0];
    }
    
    setStartDate(start);
    setEndDate(end);
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expensesAPI.getAll({ start_date: startDate, end_date: endDate });
      setExpenses(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(err.response?.data?.error || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };


  const handleSave = async (data) => {
    try {
      if (editingExpense) {
        await expensesAPI.update(editingExpense.expense_id, data);
      } else {
        await expensesAPI.create(data);
      }
      await fetchExpenses();
      setModalOpen(false);
      setEditingExpense(null);
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await expensesAPI.delete(expenseId);
      await fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete expense');
    }
  };

  const formatCurrency = (amount) => `PKR ${Number(amount || 0).toFixed(2)}`;
  const totalToday = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  
  // Calculate statistics - essential metrics
  const totalExpenses = expenses.length;
  const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  const averageAmount = totalExpenses > 0 ? totalAmount / totalExpenses : 0;
  const highestExpense = expenses.length > 0 
    ? Math.max(...expenses.map(exp => parseFloat(exp.amount || 0)))
    : 0;

  // Pagination logic
  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedExpenses = expenses.slice(startIndex, endIndex);

  // Reset to page 1 when date filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate]);

  if (loading) {
    return <div className="content-container"><div className="loading">Loading expenses...</div></div>;
  }

  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title">Daily Expenses</h1>
        <p className="page-subtitle">Track and manage daily business expenses</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Date Filter Section */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <h2>Filter Expenses</h2>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <button 
              className={`btn ${filterType === 'daily' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('daily')}
            >
              Daily
            </button>
            <button 
              className={`btn ${filterType === 'weekly' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`btn ${filterType === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`btn ${filterType === 'last3months' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('last3months')}
            >
              Last 3 Months
            </button>
            <button 
              className={`btn ${filterType === 'last6months' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('last6months')}
            >
              Last 6 Months
            </button>
            <button 
              className={`btn ${filterType === 'thisyear' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('thisyear')}
            >
              This Year
            </button>
            <button 
              className={`btn ${filterType === 'lastyear' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('lastyear')}
            >
              Last Year
            </button>
            <button 
              className={`btn ${filterType === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('custom')}
            >
              Custom Range
            </button>
          </div>
          {filterType === 'custom' && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={customStartDate} 
                  onChange={(e) => {
                    setCustomStartDate(e.target.value);
                    if (e.target.value && customEndDate) {
                      setStartDate(e.target.value);
                      setEndDate(customEndDate);
                    }
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={customEndDate} 
                  onChange={(e) => {
                    setCustomEndDate(e.target.value);
                    if (customStartDate && e.target.value) {
                      setStartDate(customStartDate);
                      setEndDate(e.target.value);
                    }
                  }}
                />
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  if (customStartDate && customEndDate) {
                    if (new Date(customStartDate) > new Date(customEndDate)) {
                      alert('Start date cannot be after end date');
                      return;
                    }
                    setStartDate(customStartDate);
                    setEndDate(customEndDate);
                  } else {
                    alert('Please select both start and end dates');
                  }
                }}
              >
                Apply
              </button>
            </div>
          )}
          {filterType !== 'custom' && (
            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '14px' }}>
              <strong>Date Range:</strong> {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Statistics Cards Section - Essential Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div className="card" style={{ background: '#3b82f6', color: 'white', padding: '16px' }}>
          <div style={{ fontSize: '13px', opacity: 0.95, marginBottom: '6px' }}>Number of Expenses</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{totalExpenses}</div>
        </div>

        <div className="card" style={{ background: '#ef4444', color: 'white', padding: '16px' }}>
          <div style={{ fontSize: '13px', opacity: 0.95, marginBottom: '6px' }}>Total Expense Amount</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{formatCurrency(totalAmount)}</div>
        </div>

        <div className="card" style={{ background: '#10b981', color: 'white', padding: '16px' }}>
          <div style={{ fontSize: '13px', opacity: 0.95, marginBottom: '6px' }}>Average Expense</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{formatCurrency(averageAmount)}</div>
        </div>

        <div className="card" style={{ background: '#f59e0b', color: 'white', padding: '16px' }}>
          <div style={{ fontSize: '13px', opacity: 0.95, marginBottom: '6px' }}>Highest Expense</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{formatCurrency(highestExpense)}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <div className="card-header-content">
            <h2>Expenses</h2>
            {!readOnly && (
              <button className="btn btn-primary" onClick={() => { setEditingExpense(null); setModalOpen(true); }}>
                + Add Expense
              </button>
            )}
          </div>
        </div>
        <div className="table-container">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Expense Name</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedExpenses.length === 0 ? (
                <tr><td colSpan="5" className="empty-state">No expenses found for the selected date range</td></tr>
              ) : (
                paginatedExpenses.map(expense => (
                  <tr key={expense.expense_id}>
                    <td><strong>{expense.expense_category}</strong></td>
                    <td>{formatCurrency(expense.amount)}</td>
                    <td>{expense.payment_method}</td>
                    <td>{expense.notes || '-'}</td>
                    <td>
                      {!readOnly && (
                        <>
                          <button className="btn-edit" onClick={() => { setEditingExpense(expense); setModalOpen(true); }}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDelete(expense.expense_id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <td><strong>Total:</strong></td>
                <td><strong>{formatCurrency(totalToday)}</strong></td>
                <td colSpan="3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {expenses.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={expenses.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newItemsPerPage) => {
              setItemsPerPage(newItemsPerPage);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {modalOpen && (
        <ExpenseModal
          expense={editingExpense}
          date={startDate}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditingExpense(null); }}
        />
      )}
    </div>
  );
};

const ExpenseModal = ({ expense, date, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    expense_category: expense?.expense_category || '',
    amount: expense?.amount || '',
    expense_date: expense?.expense_date?.split('T')[0] || date,
    payment_method: expense?.payment_method || 'cash',
    notes: expense?.notes || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.expense_category || !formData.amount) {
      alert('Please fill all required fields');
      return;
    }
    setSaving(true);
    try {
      await onSave(formData);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save expense');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{expense ? 'Edit Expense' : 'Add Expense'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-group">
            <label className="form-label">Expense Name *</label>
            <input className="form-input" required value={formData.expense_category} onChange={(e) => setFormData({...formData, expense_category: e.target.value})} placeholder="e.g., Rent, Utilities, Supplies" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount *</label>
              <input type="number" step="0.01" className="form-input" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" value={formData.expense_date} onChange={(e) => setFormData({...formData, expense_date: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select className="form-input" value={formData.payment_method} onChange={(e) => setFormData({...formData, payment_method: e.target.value})}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-input" rows="3" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
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

export default Expenses;

