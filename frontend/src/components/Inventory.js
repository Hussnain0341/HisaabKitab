import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { productsAPI, suppliersAPI, categoriesAPI } from '../services/api';
import ProductModal from './ProductModal';
import Pagination from './Pagination';
import './Inventory.css';

const Inventory = ({ readOnly = false }) => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
  
  // Filter products based on search query and category
  const filteredProducts = useMemo(() => {
    let filtered = safeProducts;
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category_id === selectedCategory);
    }
    
    // Apply frequently sold filter - check for boolean true
    if (showFrequentlySoldOnly) {
      filtered = filtered.filter(p => p.is_frequently_sold === true || p.is_frequently_sold === 1);
    }
    
    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => {
        const nameEnglish = (product.item_name_english || product.name || '').toLowerCase();
        return nameEnglish.includes(query);
      });
    }
    
    return filtered;
  }, [safeProducts, searchQuery, selectedCategory, showFrequentlySoldOnly]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, showFrequentlySoldOnly]);

  // Fetch products and suppliers on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // CRITICAL: Suppliers API requires admin role, so catch and continue for cashiers
      // Categories and Products should work for cashiers
      let suppliersData = [];
      try {
        const suppliersResponse = await suppliersAPI.getAll();
        suppliersData = Array.isArray(suppliersResponse.data) ? suppliersResponse.data : [];
      } catch (supplierErr) {
        // If suppliers API fails (e.g., access denied for cashier), continue without suppliers
        console.warn('Suppliers API not accessible (may require admin role):', supplierErr.message);
        suppliersData = [];
      }
      
      // Fetch categories and products (both should work for cashiers)
      const categoriesResponse = await categoriesAPI.getAll();
      
      setSuppliers(suppliersData);
      setCategories(categoriesResponse.data || []);
      
      await fetchProducts();
    } catch (err) {
      console.error('Error fetching data:', err);
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Cannot connect to backend server. Please ensure the backend is running on port 5000.');
      } else if (err.response?.status === 403 || err.response?.data?.error === 'Access denied') {
        setError(err.response?.data?.message || 'Access denied. Please contact administrator.');
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
      
      // Sort: frequently sold first, then name
      productsData.sort((a, b) => {
        const aFrequent = a.is_frequently_sold === true || a.is_frequently_sold === 1;
        const bFrequent = b.is_frequently_sold === true || b.is_frequently_sold === 1;
        if (aFrequent && !bFrequent) return -1;
        if (!aFrequent && bFrequent) return 1;
        const nameA = (a.item_name_english || a.name || '').toLowerCase();
        const nameB = (b.item_name_english || b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
      
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching products:', err);
      // Check if it's an access denied error
      if (err.response?.status === 403 || err.response?.data?.error === 'Access denied') {
        setError(err.response?.data?.message || 'Access denied. Please contact administrator.');
      } else {
        setError(err.response?.data?.error || 'Failed to load products. Please check the console for details.');
      }
      setProducts([]);
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
      alert(err.response?.data?.error || t('inventory.productFailed'));
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
        <div className="loading">{t('common.loading')} {t('inventory.title').toLowerCase()}...</div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title">{t('inventory.title')}</h1>
        <p className="page-subtitle">{t('inventory.subtitle')}</p>
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
            <label className="form-label" style={{ marginBottom: '8px', display: 'block', fontSize: '13px' }}>{t('inventory.searchProducts')}</label>
            <input
              type="text"
              className="form-input"
              placeholder={t('inventory.searchProducts')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: '14px', width: '100%' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block', fontSize: '13px' }}>{t('inventory.category')}</label>
            <select 
              className="form-input" 
              value={selectedCategory || ''} 
              onChange={(e) => {
                setSelectedCategory(e.target.value ? parseInt(e.target.value) : null);
              }}
              style={{ fontSize: '14px' }}
            >
              <option value="">{t('inventory.allCategories')}</option>
              {categories.filter(c => c.status === 'active').map(cat => (
                <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
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
              {t('inventory.frequentlySoldOnly')}
            </label>
            {(selectedCategory || showFrequentlySoldOnly || searchQuery) && (
              <button className="btn btn-secondary" onClick={() => {
                setSelectedCategory(null);
                setShowFrequentlySoldOnly(false);
                setSearchQuery('');
              }}>
                {t('common.clearFilters')}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-header-content">
            <h2>{t('menu.products')}</h2>
            {!readOnly && (
              <button className="btn btn-primary" onClick={handleAdd}>
                + {t('inventory.addProduct')}
              </button>
            )}
            {readOnly && (
              <span className="read-only-notice">{t('common.readOnlyMode')}</span>
            )}
          </div>
        </div>

        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">
                  {t('inventory.productName')} {getSortIcon('name')}
                </th>
                <th>{t('inventory.category')}</th>
                <th>{t('inventory.purchasePrice')}</th>
                <th>{t('inventory.sellingPrice')}</th>
                <th onClick={() => handleSort('quantity_in_stock')} className="sortable">
                  {t('inventory.stock')} {getSortIcon('quantity_in_stock')}
                </th>
                <th>{t('suppliers.title')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">
                    {searchQuery ? t('inventory.noProductsMatching', { query: searchQuery }) : t('inventory.noProducts')}
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => {
                  const displayName = product.item_name_english || product.name || 'N/A';
                  const retailPrice = product.retail_price || product.selling_price;
                  const wholesalePrice = product.wholesale_price || retailPrice;
                  const isFrequent = product.is_frequently_sold === true || product.is_frequently_sold === 1;
                  return (
                  <tr key={product.product_id}>
                    <td>
                      <div>{displayName}</div>
                      {isFrequent && (
                        <span style={{ fontSize: '10px', color: '#059669', fontWeight: '600', marginLeft: '4px' }}>⭐</span>
                      )}
                    </td>
                    <td>
                      {product.category_name || product.category || '-'}
                    </td>
                    <td>{formatCurrency(product.purchase_price)}</td>
                    <td>
                      <div>{formatCurrency(retailPrice)}</div>
                      {wholesalePrice !== retailPrice && (
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{t('billing.wholesale')}: {formatCurrency(wholesalePrice)}</div>
                      )}
                      {product.special_price && (
                        <div style={{ fontSize: '11px', color: '#dc2626' }}>{t('billing.special')}: {formatCurrency(product.special_price)}</div>
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
                            {t('common.edit')}
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => setDeleteConfirm(product.product_id)}
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
            <h3>{t('common.confirmDelete')}</h3>
            <p>{t('inventory.deleteConfirm')} {t('common.cannotBeUndone')}</p>
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
