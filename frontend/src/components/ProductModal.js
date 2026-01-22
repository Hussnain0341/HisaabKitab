import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../services/api';
import './ProductModal.css';

const ProductModal = ({ product, suppliers, onClose, onSave }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    item_name_english: '',
    category_id: '',
    category: '',
    purchase_price: '',
    retail_price: '',
    wholesale_price: '',
    special_price: '',
    selling_price: '',
    unit_type: 'piece',
    is_frequently_sold: false,
    quantity_in_stock: '0',
    supplier_id: '',
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        item_name_english: product.item_name_english || product.name || '',
        category_id: product.category_id || '',
        category: product.category || '',
        purchase_price: product.purchase_price || '',
        retail_price: product.retail_price || product.selling_price || '',
        wholesale_price: product.wholesale_price || product.retail_price || product.selling_price || '',
        special_price: product.special_price || '',
        selling_price: product.selling_price || product.retail_price || '',
        unit_type: product.unit_type || 'piece',
        is_frequently_sold: product.is_frequently_sold || false,
        quantity_in_stock: product.quantity_in_stock || '0',
        supplier_id: product.supplier_id || '',
      });
    }
  }, [product, categories, suppliers]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const validate = () => {
    const newErrors = {};

    // Item Name English: required
    if (!formData.item_name_english || !formData.item_name_english.trim()) {
      newErrors.item_name_english = 'Item name (English) is required';
    }

    // Purchase Price: numeric, >0
    const purchasePrice = parseFloat(formData.purchase_price);
    if (isNaN(purchasePrice) || purchasePrice <= 0) {
      newErrors.purchase_price = 'Purchase price must be greater than 0';
    }

    // Retail Price: numeric, >0
    const retailPrice = parseFloat(formData.retail_price);
    if (isNaN(retailPrice) || retailPrice <= 0) {
      newErrors.retail_price = 'Retail price must be greater than 0';
    }

    // Quantity: integer, ≥0
    const quantity = parseInt(formData.quantity_in_stock);
    if (isNaN(quantity) || quantity < 0) {
      newErrors.quantity_in_stock = 'Quantity must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
        name: formData.item_name_english.trim(), // Backward compatibility
        item_name_english: formData.item_name_english.trim(),
        category_id: formData.category_id || null,
        category: formData.category.trim() || null,
        purchase_price: parseFloat(formData.purchase_price),
        retail_price: parseFloat(formData.retail_price),
        wholesale_price: formData.wholesale_price ? parseFloat(formData.wholesale_price) : parseFloat(formData.retail_price),
        special_price: formData.special_price ? parseFloat(formData.special_price) : null,
        selling_price: parseFloat(formData.retail_price), // For backward compatibility
        unit_type: formData.unit_type || 'piece',
        is_frequently_sold: formData.is_frequently_sold || false,
        quantity_in_stock: parseInt(formData.quantity_in_stock),
        supplier_id: formData.supplier_id || null,
      };

      await onSave(submitData);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to save product';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const activeCategories = categories.filter(c => c.status === 'active');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal product-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label className="form-label">
              Item Name (English) <span className="required">*</span>
            </label>
            <input
              type="text"
              name="item_name_english"
              value={formData.item_name_english}
              onChange={handleChange}
              className={`form-input ${errors.item_name_english ? 'error' : ''}`}
              placeholder="Enter item name in English"
            />
            {errors.item_name_english && <span className="error-message">{errors.item_name_english}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Product Group <span style={{ fontSize: '11px', color: '#64748b' }}>(Optional)</span>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px' }}>سامان کی قسم</span>
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Auto (General)</option>
                {activeCategories.map(c => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Unit Type</label>
              <select
                name="unit_type"
                value={formData.unit_type}
                onChange={handleChange}
                className="form-input"
              >
                <option value="piece">Piece</option>
                <option value="packet">Packet</option>
                <option value="meter">Meter</option>
                <option value="box">Box</option>
                <option value="kg">Kilogram</option>
                <option value="roll">Roll</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Purchase Price (PKR) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="purchase_price"
                value={formData.purchase_price}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                className={`form-input ${errors.purchase_price ? 'error' : ''}`}
                placeholder="0.00"
              />
              {errors.purchase_price && (
                <span className="error-message">{errors.purchase_price}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Retail Price (PKR) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="retail_price"
                value={formData.retail_price}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                className={`form-input ${errors.retail_price ? 'error' : ''}`}
                placeholder="0.00"
              />
              {errors.retail_price && (
                <span className="error-message">{errors.retail_price}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Wholesale Price (PKR)</label>
              <input
                type="number"
                name="wholesale_price"
                value={formData.wholesale_price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="form-input"
                placeholder="Auto-fills from retail price"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Special Price (PKR)</label>
              <input
                type="number"
                name="special_price"
                value={formData.special_price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="form-input"
                placeholder="Optional override price"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Quantity in Stock <span className="required">*</span>
              </label>
              <input
                type="number"
                name="quantity_in_stock"
                value={formData.quantity_in_stock}
                onChange={handleChange}
                min="0"
                step="1"
                className={`form-input ${errors.quantity_in_stock ? 'error' : ''}`}
                placeholder="0"
              />
              {errors.quantity_in_stock && (
                <span className="error-message">{errors.quantity_in_stock}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Supplier</label>
              <select
                name="supplier_id"
                value={formData.supplier_id}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">No Supplier</option>
                {suppliers.map(s => (
                  <option key={s.supplier_id} value={s.supplier_id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="is_frequently_sold"
                  checked={formData.is_frequently_sold}
                  onChange={handleChange}
                  style={{ marginRight: '8px', width: '18px', height: '18px' }}
                />
                <span>Frequently Sold Item (appears first in POS)</span>
              </label>
            </div>
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
              {saving ? 'Saving...' : (product ? 'Update' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
