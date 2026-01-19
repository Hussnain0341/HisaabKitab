import React, { useState, useEffect, useMemo } from 'react';
import { productsAPI, suppliersAPI, categoriesAPI } from '../services/api';
import ProductModal from './ProductModal';
import Pagination from './Pagination';
import './Inventory.css';

const Inventory = ({ readOnly = false }) => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [showFrequentlySoldOnly, setShowFrequentlySoldOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];
  
  // Filter products based on search query, category, and sub-category
  const filteredProducts = useMemo(() => {
    let filtered = safeProducts;
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category_id === selectedCategory);
    }
    
    // Apply sub-category filter
    if (selectedSubCategory) {
      filtered = filtered.filter(p => p.sub_category_id === selectedSubCategory);
    }
    
    // Apply frequently sold filter
    if (showFrequentlySoldOnly) {
      filtered = filtered.filter(p => p.is_frequently_sold);
    }
    
    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => {
        const nameEnglish = (product.item_name_english || product.name || '').toLowerCase();
        const nameUrdu = (product.item_name_urdu || '').toLowerCase();
        const sku = (product.sku || '').toLowerCase();
        return nameEnglish.includes(query) || nameUrdu.includes(query) || sku.includes(query);
      });
    }
    
    return filtered;
  }, [safeProducts, searchQuery, selectedCategory, selectedSubCategory, showFrequentlySoldOnly]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSubCategory, showFrequentlySoldOnly]);

  // Fetch products and suppliers on component mount
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories();
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [suppliersResponse, categoriesResponse] = await Promise.all([
        suppliersAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      
      const suppliersData = Array.isArray(suppliersResponse.data) ? suppliersResponse.data : [];
      setSuppliers(suppliersData);
      setCategories(categoriesResponse.data || []);
      
      await fetchProducts();
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Cannot connect to backend server. Please ensure the backend is running on port 5000.');
      } else {
        setError(err.response?.data?.error || 'Failed to load inventory data. Please check the console for details.');
      }
      setSuppliers([]);
      setCategories([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      // Fetch all products - filtering will be done client-side
      const productsResponse = await productsAPI.getAll();
      const productsData = Array.isArray(productsResponse.data) ? productsResponse.data : [];
      
      // Sort: frequently sold first, then display_order, then name
      productsData.sort((a, b) => {
        if (a.is_frequently_sold && !b.is_frequently_sold) return -1;
        if (!a.is_frequently_sold && b.is_frequently_sold) return 1;
        if (a.display_order !== b.display_order) return (a.display_order || 0) - (b.display_order || 0);
        const nameA = (a.item_name_english || a.name || '').toLowerCase();
        const nameB = (b.item_name_english || b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
      
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await categoriesAPI.getSubCategoriesAll();
      const filtered = response.data.filter(sc => sc.category_id === selectedCategory);
      setSubCategories(filtered || []);
    } catch (err) {
      console.error('Error fetching sub-categories:', err);
      setSubCategories([]);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const safeProducts = Array.isArray(products) ? products : [];
    const sortedProducts = [...safeProducts].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      // Handle null/undefined values
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Handle numeric values (quantity_in_stock)
      if (key === 'quantity_in_stock') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // Handle string values (name, sku)
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setProducts(sortedProducts);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (productId) => {
    try {
      await productsAPI.delete(productId);
      const safeProducts = Array.isArray(products) ? products : [];
      setProducts(safeProducts.filter(p => p.product_id !== productId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(err.response?.data?.error || 'Failed to delete product');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleModalSave = async (productData) => {
    try {
      const safeProducts = Array.isArray(products) ? products : [];
      if (editingProduct) {
        // Update existing product
        const response = await productsAPI.update(editingProduct.product_id, productData);
        setProducts(safeProducts.map(p => 
          p.product_id === editingProduct.product_id ? response.data : p
        ));
      } else {
        // Create new product
        const response = await productsAPI.create(productData);
        setProducts([...safeProducts, response.data]);
      }
      handleModalClose();
    } catch (err) {
      console.error('Error saving product:', err);
      throw err; // Let modal handle the error display
    }
  };

  const formatCurrency = (amount) => {
    return `PKR ${Number(amount).toFixed(2)}`;
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="content-container">
        <div className="loading">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title">Inventory</h1>
        <p className="page-subtitle">Manage your shop's products and stock</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block', fontSize: '13px' }}>Search Products</label>
            <input
              type="text"
              className="form-input"
              placeholder="Search by name (English/Urdu) or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: '14px', width: '100%' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block', fontSize: '13px' }}>Category</label>
            <select 
              className="form-input" 
              value={selectedCategory || ''} 
              onChange={(e) => {
                setSelectedCategory(e.target.value ? parseInt(e.target.value) : null);
                setSelectedSubCategory(null);
              }}
              style={{ fontSize: '14px' }}
            >
              <option value="">All Categories</option>
              {categories.filter(c => c.status === 'active').map(cat => (
                <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block', fontSize: '13px' }}>Sub-Category</label>
            <select 
              className="form-input" 
              value={selectedSubCategory || ''} 
              onChange={(e) => setSelectedSubCategory(e.target.value ? parseInt(e.target.value) : null)}
              disabled={!selectedCategory}
              style={{ fontSize: '14px' }}
            >
              <option value="">All Sub-Categories</option>
              {subCategories.filter(sc => sc.status === 'active').map(subCat => (
                <option key={subCat.sub_category_id} value={subCat.sub_category_id}>{subCat.sub_category_name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={showFrequentlySoldOnly}
                onChange={(e) => setShowFrequentlySoldOnly(e.target.checked)}
                style={{ marginRight: '6px', width: '16px', height: '16px' }}
              />
              Frequently Sold Only
            </label>
            {(selectedCategory || selectedSubCategory || showFrequentlySoldOnly || searchQuery) && (
              <button className="btn btn-secondary" onClick={() => {
                setSelectedCategory(null);
                setSelectedSubCategory(null);
                setShowFrequentlySoldOnly(false);
                setSearchQuery('');
              }}>
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-header-content">
            <h2>Products</h2>
            {!readOnly && (
              <button className="btn btn-primary" onClick={handleAdd}>
                + Add Product
              </button>
            )}
            {readOnly && (
              <span className="read-only-notice">Read-only mode: Editing disabled</span>
            )}
          </div>
        </div>

        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  Product Name {getSortIcon('name')}
                </th>
                <th onClick={() => handleSort('sku')} className="sortable">
                  SKU {getSortIcon('sku')}
                </th>
                <th>Category</th>
                <th>Purchase Price</th>
                <th>Selling Price</th>
                <th onClick={() => handleSort('quantity_in_stock')} className="sortable">
                  Quantity in Stock {getSortIcon('quantity_in_stock')}
                </th>
                <th>Supplier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    {searchQuery ? `No products found matching "${searchQuery}".` : 'No products found. Click "Add Product" to get started.'}
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => {
                  const displayName = product.item_name_english || product.name || 'N/A';
                  const retailPrice = product.retail_price || product.selling_price;
                  const wholesalePrice = product.wholesale_price || retailPrice;
                  return (
                  <tr key={product.product_id}>
                    <td>
                      <div>{displayName}</div>
                      {product.item_name_urdu && (
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          {product.item_name_urdu}
                        </div>
                      )}
                      {product.is_frequently_sold && (
                        <span style={{ fontSize: '10px', color: '#059669', fontWeight: '600', marginLeft: '4px' }}>⭐</span>
                      )}
                    </td>
                    <td>{product.sku || '-'}</td>
                    <td>
                      {product.category_name || product.category || '-'}
                      {product.sub_category_name && (
                        <div style={{ fontSize: '11px', color: '#64748b' }}>→ {product.sub_category_name}</div>
                      )}
                    </td>
                    <td>{formatCurrency(product.purchase_price)}</td>
                    <td>
                      <div>{formatCurrency(retailPrice)}</div>
                      {wholesalePrice !== retailPrice && (
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Wh: {formatCurrency(wholesalePrice)}</div>
                      )}
                      {product.special_price && (
                        <div style={{ fontSize: '11px', color: '#dc2626' }}>Sp: {formatCurrency(product.special_price)}</div>
                      )}
                    </td>
                    <td className={product.quantity_in_stock === 0 ? 'low-stock' : ''}>
                      {product.quantity_in_stock} {product.unit_type ? `(${product.unit_type})` : ''}
                    </td>
                    <td>{product.supplier_name || '-'}</td>
                    <td className="actions-cell">
                      {!readOnly ? (
                        <>
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => setDeleteConfirm(product.product_id)}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span className="read-only-label">View Only</span>
                      )}
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredProducts.length}
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
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
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
        <ProductModal
          product={editingProduct}
          suppliers={suppliers}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default Inventory;
