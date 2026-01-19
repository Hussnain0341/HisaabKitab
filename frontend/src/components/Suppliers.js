import React, { useState, useEffect, useMemo } from 'react';
import { suppliersAPI } from '../services/api';
import SupplierModal from './SupplierModal';
import Pagination from './Pagination';
import './Suppliers.css';

const Suppliers = ({ readOnly = false }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await suppliersAPI.getAll();
      setSuppliers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError(err.response?.data?.error || 'Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSupplier(null);
    setModalOpen(true);
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setModalOpen(true);
  };

  const handleDelete = async (supplierId) => {
    try {
      await suppliersAPI.delete(supplierId);
      setSuppliers(suppliers.filter(s => s.supplier_id !== supplierId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting supplier:', err);
      alert(err.response?.data?.error || 'Failed to delete supplier');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingSupplier(null);
  };

  const handleModalSave = async (supplierData) => {
    try {
      if (editingSupplier) {
        // Update existing supplier
        const response = await suppliersAPI.update(editingSupplier.supplier_id, supplierData);
        setSuppliers(suppliers.map(s => 
          s.supplier_id === editingSupplier.supplier_id ? response.data : s
        ));
      } else {
        // Create new supplier
        const response = await suppliersAPI.create(supplierData);
        setSuppliers([...suppliers, response.data].sort((a, b) => 
          a.name.localeCompare(b.name)
        ));
      }
      handleModalClose();
    } catch (err) {
      console.error('Error saving supplier:', err);
      throw err; // Let modal handle the error display
    }
  };

  const formatCurrency = (amount) => {
    return `PKR ${Number(amount).toFixed(2)}`;
  };

  // Filter suppliers based on search query
  const filteredSuppliers = useMemo(() => {
    if (!searchQuery.trim()) {
      return suppliers;
    }
    const query = searchQuery.toLowerCase().trim();
    return suppliers.filter(supplier => {
      const name = (supplier.name || '').toLowerCase();
      const contact = (supplier.contact_number || '').toLowerCase();
      return name.includes(query) || contact.includes(query);
    });
  }, [suppliers, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="content-container">
        <div className="loading">Loading suppliers...</div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title">Suppliers</h1>
        <p className="page-subtitle">Manage your suppliers and purchase orders</p>
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
              <h2>Suppliers</h2>
              <button className="btn btn-primary" onClick={handleAdd}>
                + Add Supplier
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, maxWidth: '400px' }}>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block', fontSize: '13px' }}>Search Supplier</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search by supplier name or contact number..."
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
        <div className="card-header">
          <div className="card-header-content">
            <h2>Suppliers List</h2>
            {readOnly && (
              <span className="read-only-notice">Read-only mode: Editing disabled</span>
            )}
          </div>
        </div>

        <div className="table-container">
          <table className="suppliers-table">
            <thead>
              <tr>
                <th>Supplier Name</th>
                <th>Contact Number</th>
                <th>Total Purchased</th>
                <th>Total Paid</th>
                <th>Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSuppliers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-state">
                    {searchQuery ? `No suppliers found matching "${searchQuery}".` : 'No suppliers found. Click "Add Supplier" to get started.'}
                  </td>
                </tr>
              ) : (
                paginatedSuppliers.map((supplier) => (
                  <tr key={supplier.supplier_id}>
                    <td>{supplier.name}</td>
                    <td>{supplier.contact_number || '-'}</td>
                    <td>{formatCurrency(supplier.total_purchased)}</td>
                    <td>{formatCurrency(supplier.total_paid)}</td>
                    <td className={supplier.balance < 0 ? 'negative-balance' : supplier.balance > 0 ? 'positive-balance' : ''}>
                      {formatCurrency(supplier.balance)}
                    </td>
                    <td className="actions-cell">
                      {!readOnly ? (
                        <>
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(supplier)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => setDeleteConfirm(supplier.supplier_id)}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span className="read-only-label">View Only</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {filteredSuppliers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredSuppliers.length}
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
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this supplier? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <SupplierModal
          supplier={editingSupplier}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default Suppliers;
