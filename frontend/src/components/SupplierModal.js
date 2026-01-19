import React, { useState, useEffect } from 'react';
import './SupplierModal.css';

const SupplierModal = ({ supplier, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact_number: '',
    total_purchased: '0',
    total_paid: '0',
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [calculatedBalance, setCalculatedBalance] = useState(0);

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        contact_number: supplier.contact_number || '',
        total_purchased: supplier.total_purchased || '0',
        total_paid: supplier.total_paid || '0',
      });
    }
  }, [supplier]);

  // Calculate balance whenever purchased or paid changes
  useEffect(() => {
    const purchased = parseFloat(formData.total_purchased) || 0;
    const paid = parseFloat(formData.total_paid) || 0;
    const balance = purchased - paid;
    setCalculatedBalance(balance);
  }, [formData.total_purchased, formData.total_paid]);

  const validate = () => {
    const newErrors = {};

    // Name: required
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = 'Supplier name is required';
    }

    // Total Purchased: numeric, >= 0
    const purchased = parseFloat(formData.total_purchased);
    if (isNaN(purchased) || purchased < 0) {
      newErrors.total_purchased = 'Total purchased must be 0 or greater';
    }

    // Total Paid: numeric, >= 0
    const paid = parseFloat(formData.total_paid);
    if (isNaN(paid) || paid < 0) {
      newErrors.total_paid = 'Total paid must be 0 or greater';
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
    // Clear error for this field
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
        name: formData.name.trim(),
        contact_number: formData.contact_number.trim() || null,
        total_purchased: parseFloat(formData.total_purchased) || 0,
        total_paid: parseFloat(formData.total_paid) || 0,
      };

      await onSave(submitData);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to save supplier';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    return `PKR ${Number(amount).toFixed(2)}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal supplier-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{supplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="supplier-form">
          <div className="form-group">
            <label className="form-label">
              Supplier Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter supplier name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Contact Number</label>
            <input
              type="text"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              className="form-input"
              placeholder="Phone number (optional)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Total Purchased (PKR) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="total_purchased"
                value={formData.total_purchased}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`form-input ${errors.total_purchased ? 'error' : ''}`}
                placeholder="0.00"
              />
              {errors.total_purchased && (
                <span className="error-message">{errors.total_purchased}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Total Paid (PKR) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="total_paid"
                value={formData.total_paid}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`form-input ${errors.total_paid ? 'error' : ''}`}
                placeholder="0.00"
              />
              {errors.total_paid && (
                <span className="error-message">{errors.total_paid}</span>
              )}
            </div>
          </div>

          <div className="balance-display">
            <label className="form-label">Balance (Auto-calculated)</label>
            <div className={`balance-value ${calculatedBalance < 0 ? 'negative' : calculatedBalance > 0 ? 'positive' : ''}`}>
              {formatCurrency(calculatedBalance)}
            </div>
            <p className="balance-help">
              Balance = Total Purchased − Total Paid
            </p>
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
              {saving ? 'Saving...' : (supplier ? 'Update' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierModal;





