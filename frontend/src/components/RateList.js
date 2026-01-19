import React, { useState, useEffect, useMemo } from 'react';
import { productsAPI, categoriesAPI } from '../services/api';
import Pagination from './Pagination';
import './RateList.css';

const RateList = ({ readOnly = false }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

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
      const [catsResponse, subsResponse, productsResponse] = await Promise.all([
        categoriesAPI.getAll(),
        categoriesAPI.getSubCategoriesAll(),
        productsAPI.getAll()
      ]);
      setCategories(catsResponse.data || []);
      setSubCategories(subsResponse.data || []);
      const productsData = Array.isArray(productsResponse.data) ? productsResponse.data : [];
      const filtered = productsData.filter(p => p.status !== 'inactive');
      setProducts(filtered);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.error || 'Failed to load rate list');
      setProducts([]);
      setCategories([]);
      setSubCategories([]);
    } finally {
      setLoading(false);
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

  // fetchProducts is no longer needed - products are fetched in fetchData

  const formatCurrency = (amount) => `PKR ${Number(amount || 0).toFixed(2)}`;

  // Apply filters to products (search, category, sub-category)
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category_id === selectedCategory);
    }
    
    // Apply sub-category filter
    if (selectedSubCategory) {
      filtered = filtered.filter(p => p.sub_category_id === selectedSubCategory);
    }
    
    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        (p.item_name_english && p.item_name_english.toLowerCase().includes(query)) ||
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.item_name_urdu && p.item_name_urdu.toLowerCase().includes(query)) ||
        (p.sku && p.sku.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [products, searchQuery, selectedCategory, selectedSubCategory]);

  // Group products by category
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const catName = product.category_name || product.category || 'Uncategorized';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(product);
    return acc;
  }, {});

  // Flatten grouped products for pagination
  const flattenedProducts = Object.entries(groupedProducts).flatMap(([categoryName, categoryProducts]) => {
    return [{ type: 'header', categoryName }, ...categoryProducts.map(p => ({ type: 'product', ...p }))];
  });

  // Pagination logic
  const totalPages = Math.ceil(flattenedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = flattenedProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSubCategory]);

  if (loading) {
    return <div className="content-container"><div className="loading">Loading rate list...</div></div>;
  }

  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title">Rate List</h1>
        <p className="page-subtitle">Product prices for reference</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filters & Search */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ padding: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }}>
            <div>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Search by Name (English/Urdu) or SKU</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '14px' }}
              />
            </div>
            <div>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Category</label>
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
            <div>
              <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Sub-Category</label>
              <select 
                className="form-input" 
                value={selectedSubCategory || ''} 
                onChange={(e) => setSelectedSubCategory(e.target.value ? parseInt(e.target.value) : null)}
                disabled={!selectedCategory}
                style={{ fontSize: '14px' }}
              >
                <option value="">All Sub-Categories</option>
                {subCategories.filter(sc => sc.status === 'active').map(subCat => (
                  <option key={subCat.sub_category_id} value={subCat.sub_category_id}>
                    {subCat.sub_category_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button 
                className="btn btn-secondary" 
                onClick={() => { 
                  setSelectedCategory(null); 
                  setSelectedSubCategory(null); 
                  setSearchQuery('');
                }}
                style={{ whiteSpace: 'nowrap' }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rate List by Category */}
      <div className="card">
        <div className="table-container">
          <table className="rate-list-table">
            <thead>
              <tr>
                <th>Item Name (English)</th>
                <th>Item Name (Urdu)</th>
                <th>Unit</th>
                <th>Retail Price</th>
                <th>Wholesale Price</th>
                <th>Special Price</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr><td colSpan="6" className="empty-state">No products found{searchQuery ? ' matching your search' : ''}</td></tr>
              ) : (
                paginatedProducts.map((item, index) => {
                  if (item.type === 'header') {
                    return (
                      <tr key={`header-${item.categoryName}-${index}`} className="category-header-row">
                        <td colSpan="6"><strong>{item.categoryName}</strong></td>
                      </tr>
                    );
                  } else {
                    const product = item;
                    return (
                      <tr key={product.product_id}>
                        <td>{product.item_name_english || product.name || 'N/A'}</td>
                        <td style={{ direction: 'rtl', textAlign: 'right' }}>
                          {product.item_name_urdu || '-'}
                        </td>
                        <td>{product.unit_type || 'piece'}</td>
                        <td className="price-cell">{formatCurrency(product.retail_price || product.selling_price)}</td>
                        <td className="price-cell">{formatCurrency(product.wholesale_price || product.retail_price || product.selling_price)}</td>
                        <td className="price-cell">{product.special_price ? formatCurrency(product.special_price) : '-'}</td>
                      </tr>
                    );
                  }
                })
              )}
            </tbody>
          </table>
        </div>
        
        {flattenedProducts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={flattenedProducts.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newItemsPerPage) => {
              setItemsPerPage(newItemsPerPage);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default RateList;

