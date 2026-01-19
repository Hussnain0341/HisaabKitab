import React, { useState, useEffect, useMemo } from 'react';
import { categoriesAPI, productsAPI } from '../services/api';
import Pagination from './Pagination';
import './Categories.css';

const Categories = ({ readOnly = false }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [subSearchQuery, setSubSearchQuery] = useState('');
  const [viewingSubCategories, setViewingSubCategories] = useState(null);
  const [viewingItems, setViewingItems] = useState(null);
  const [itemsList, setItemsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [subCurrentPage, setSubCurrentPage] = useState(1);
  const [subItemsPerPage, setSubItemsPerPage] = useState(20);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.error || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await categoriesAPI.getSubCategoriesAll();
      setSubCategories(response.data);
    } catch (err) {
      console.error('Error fetching sub-categories:', err);
    }
  };

  const handleSaveCategory = async (data) => {
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.category_id, data);
      } else {
        await categoriesAPI.create(data);
      }
      await fetchCategories();
      setModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      throw err;
    }
  };

  const handleSaveSubCategory = async (data) => {
    try {
      if (editingSubCategory) {
        await categoriesAPI.updateSubCategory(editingSubCategory.sub_category_id, data);
      } else {
        await categoriesAPI.createSubCategory(data);
      }
      await fetchSubCategories();
      await fetchCategories();
      setSubModalOpen(false);
      setEditingSubCategory(null);
      setSelectedCategory(null);
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure? This will also delete all sub-categories.')) return;
    try {
      await categoriesAPI.delete(categoryId);
      await fetchCategories();
      await fetchSubCategories();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete category');
    }
  };

  const handleDeleteSubCategory = async (subCategoryId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await categoriesAPI.deleteSubCategory(subCategoryId);
      await fetchSubCategories();
      await fetchCategories();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete sub-category');
    }
  };

  const handleViewSubCategories = (category) => {
    const subs = subCategories.filter(sc => sc.category_id === category.category_id);
    setViewingSubCategories({ category, subCategories: subs });
  };

  const handleViewItems = async (category, subCategory = null) => {
    try {
      const params = {};
      if (category) params.category_id = category.category_id;
      if (subCategory) params.sub_category_id = subCategory.sub_category_id;
      
      const response = await productsAPI.getAll(params);
      setItemsList(response.data || []);
      setViewingItems({ category, subCategory });
    } catch (err) {
      console.error('Error fetching items:', err);
      alert('Failed to load items');
    }
  };

  // Filter categories and sub-categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories;
    }
    const query = searchQuery.toLowerCase().trim();
    return categories.filter(cat => {
      const name = (cat.category_name || '').toLowerCase();
      return name.includes(query);
    });
  }, [categories, searchQuery]);

  const filteredSubCategories = useMemo(() => {
    if (!subSearchQuery.trim()) {
      return subCategories;
    }
    const query = subSearchQuery.toLowerCase().trim();
    return subCategories.filter(sub => {
      const name = (sub.sub_category_name || '').toLowerCase();
      const catName = (sub.category_name || '').toLowerCase();
      return name.includes(query) || catName.includes(query);
    });
  }, [subCategories, subSearchQuery]);

  // Pagination logic for categories
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  // Pagination logic for sub-categories
  const subTotalPages = Math.ceil(filteredSubCategories.length / subItemsPerPage);
  const subStartIndex = (subCurrentPage - 1) * subItemsPerPage;
  const subEndIndex = subStartIndex + subItemsPerPage;
  const paginatedSubCategories = filteredSubCategories.slice(subStartIndex, subEndIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setSubCurrentPage(1);
  }, [subSearchQuery]);

  if (loading) {
    return <div className="content-container"><div className="loading">Loading categories...</div></div>;
  }

  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <p className="page-subtitle">Manage product categories and sub-categories</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Search Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="card">
          <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block', fontSize: '13px' }}>Search Categories</label>
            <input
              type="text"
              className="form-input"
              placeholder="Search by category name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: '14px', width: '100%' }}
            />
          </div>
        </div>
        <div className="card">
          <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block', fontSize: '13px' }}>Search Sub-Categories</label>
            <input
              type="text"
              className="form-input"
              placeholder="Search by sub-category or category name..."
              value={subSearchQuery}
              onChange={(e) => setSubSearchQuery(e.target.value)}
              style={{ fontSize: '14px', width: '100%' }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Categories Section */}
        <div className="card">
          <div className="card-header">
            <div className="card-header-content">
              <h2>Categories</h2>
              {!readOnly && (
                <button className="btn btn-primary" onClick={() => { setEditingCategory(null); setModalOpen(true); }}>
                  + Add Category
                </button>
              )}
            </div>
          </div>
          <div className="table-container">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Sub-Categories</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.length === 0 ? (
                  <tr><td colSpan="4" className="empty-state">{searchQuery ? `No categories found matching "${searchQuery}".` : 'No categories found'}</td></tr>
                ) : (
                  paginatedCategories.map(cat => (
                    <tr key={cat.category_id}>
                      <td><strong>{cat.category_name}</strong></td>
                      <td>{cat.sub_category_count || 0}</td>
                      <td><span className={`status-badge ${cat.status}`}>{cat.status}</span></td>
                      <td className="actions-cell" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button className="btn-view" onClick={() => handleViewSubCategories(cat)}>View Sub Categories</button>
                        <button className="btn-view" onClick={() => handleViewItems(cat)}>View Items List</button>
                        <button className="btn-edit" onClick={() => { setSelectedCategory(cat); setSubModalOpen(true); }}>Add Sub-Category</button>
                        {!readOnly && (
                          <>
                            <button className="btn-edit" onClick={() => { setEditingCategory(cat); setModalOpen(true); }}>Edit</button>
                            <button className="btn-delete" onClick={() => handleDelete(cat.category_id)}>Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {filteredCategories.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={filteredCategories.length}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(newItemsPerPage) => {
                setItemsPerPage(newItemsPerPage);
                setCurrentPage(1);
              }}
            />
          )}
        </div>

        {/* Sub-Categories Section */}
        <div className="card">
          <div className="card-header">
            <h2>Sub-Categories</h2>
          </div>
          <div className="table-container">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Sub-Category Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubCategories.length === 0 ? (
                  <tr><td colSpan="4" className="empty-state">{subSearchQuery ? `No sub-categories found matching "${subSearchQuery}".` : 'No sub-categories found'}</td></tr>
                ) : (
                  paginatedSubCategories.map(sub => (
                    <tr key={sub.sub_category_id}>
                      <td>{sub.category_name}</td>
                      <td><strong>{sub.sub_category_name}</strong></td>
                      <td><span className={`status-badge ${sub.status}`}>{sub.status}</span></td>
                      <td className="actions-cell" style={{ display: 'flex', gap: '8px' }}>
                        {!readOnly && (
                          <>
                            <button className="btn-edit" onClick={() => { setEditingSubCategory(sub); setSelectedCategory({ category_id: sub.category_id }); setSubModalOpen(true); }}>Edit</button>
                            <button className="btn-delete" onClick={() => handleDeleteSubCategory(sub.sub_category_id)}>Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {filteredSubCategories.length > 0 && (
            <Pagination
              currentPage={subCurrentPage}
              totalPages={subTotalPages}
              itemsPerPage={subItemsPerPage}
              totalItems={filteredSubCategories.length}
              onPageChange={setSubCurrentPage}
              onItemsPerPageChange={(newItemsPerPage) => {
                setSubItemsPerPage(newItemsPerPage);
                setSubCurrentPage(1);
              }}
            />
          )}
        </div>
      </div>

      {/* Category Modal */}
      {modalOpen && (
        <CategoryModal
          category={editingCategory}
          onSave={handleSaveCategory}
          onClose={() => { setModalOpen(false); setEditingCategory(null); }}
        />
      )}

      {/* Sub-Category Modal */}
      {subModalOpen && (
        <SubCategoryModal
          subCategory={editingSubCategory}
          categoryId={selectedCategory?.category_id}
          categories={categories}
          onSave={handleSaveSubCategory}
          onClose={() => { setSubModalOpen(false); setEditingSubCategory(null); setSelectedCategory(null); }}
        />
      )}

      {/* View Sub-Categories Modal */}
      {viewingSubCategories && (
        <SubCategoriesViewModal
          category={viewingSubCategories.category}
          subCategories={viewingSubCategories.subCategories}
          onClose={() => setViewingSubCategories(null)}
          onViewItems={handleViewItems}
        />
      )}

      {/* View Items Modal */}
      {viewingItems && (
        <ItemsListViewModal
          category={viewingItems.category}
          subCategory={viewingItems.subCategory}
          items={itemsList}
          onClose={() => { setViewingItems(null); setItemsList([]); }}
        />
      )}
    </div>
  );
};

const CategoryModal = ({ category, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    category_name: category?.category_name || '',
    status: category?.status || 'active',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{category ? 'Edit Category' : 'Add Category'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-group">
            <label className="form-label">Category Name *</label>
            <input className="form-input" required value={formData.category_name} onChange={(e) => setFormData({...formData, category_name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-input" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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

const SubCategoryModal = ({ subCategory, categoryId, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    category_id: categoryId || subCategory?.category_id || '',
    sub_category_name: subCategory?.sub_category_name || '',
    status: subCategory?.status || 'active',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_id) {
      alert('Please select a category');
      return;
    }
    setSaving(true);
    try {
      await onSave(formData);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save sub-category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{subCategory ? 'Edit Sub-Category' : 'Add Sub-Category'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select className="form-input" required value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})} disabled={!!categoryId}>
              <option value="">Select Category</option>
              {categories.filter(c => c.status === 'active').map(cat => (
                <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Sub-Category Name *</label>
            <input className="form-input" required value={formData.sub_category_name} onChange={(e) => setFormData({...formData, sub_category_name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-input" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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

const SubCategoriesViewModal = ({ category, subCategories, onClose, onViewItems }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="modal-header">
          <h2>Sub-Categories: {category.category_name}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          {subCategories.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
              <p>No sub-categories found for this category.</p>
              <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => { onClose(); onViewItems(category); }}>
                View Items List
              </button>
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="categories-table">
                  <thead>
                    <tr>
                      <th>Sub-Category Name</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subCategories.map(sub => (
                      <tr key={sub.sub_category_id}>
                        <td><strong>{sub.sub_category_name}</strong></td>
                        <td><span className={`status-badge ${sub.status}`}>{sub.status}</span></td>
                        <td>
                          <button className="btn-view" onClick={() => { onClose(); onViewItems(category, sub); }}>
                            View Items List
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <button className="btn btn-secondary" onClick={() => { onClose(); onViewItems(category); }}>
                  View All Items in Category
                </button>
              </div>
            </>
          )}
          <div className="modal-actions" style={{ marginTop: '20px' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ItemsListViewModal = ({ category, subCategory, items, onClose }) => {
  const formatCurrency = (amount) => `PKR ${Number(amount || 0).toFixed(2)}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1000px', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="modal-header">
          <h2>
            Items: {category.category_name}
            {subCategory && ` > ${subCategory.sub_category_name}`}
          </h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          {items.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
              <p>No items found for this {subCategory ? 'sub-category' : 'category'}.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="categories-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>SKU</th>
                    <th>Purchase Price</th>
                    <th>Retail Price</th>
                    <th>Wholesale Price</th>
                    <th>Stock</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.product_id}>
                      <td>
                        <div>{item.item_name_english || item.name || 'N/A'}</div>
                        {item.item_name_urdu && (
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{item.item_name_urdu}</div>
                        )}
                      </td>
                      <td>{item.sku || '-'}</td>
                      <td>{formatCurrency(item.purchase_price)}</td>
                      <td>{formatCurrency(item.retail_price || item.selling_price)}</td>
                      <td>{formatCurrency(item.wholesale_price || item.retail_price || item.selling_price)}</td>
                      <td>{item.quantity_in_stock || 0}</td>
                      <td>{item.unit_type || 'piece'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="modal-actions" style={{ marginTop: '20px' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;

