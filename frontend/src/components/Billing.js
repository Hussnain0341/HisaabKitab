import React, { useState, useEffect } from 'react';
import { productsAPI, salesAPI, settingsAPI, customersAPI, categoriesAPI } from '../services/api';
import InvoicePreview from './InvoicePreview';
import './Billing.css';

const Billing = ({ readOnly = false }) => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sellingPrice, setSellingPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [shopName, setShopName] = useState('My Shop');
  const [printerName, setPrinterName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [paymentType, setPaymentType] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    fetchCategories();
    fetchSettings();
    setInvoiceNumber('AUTO');
  }, []);

  useEffect(() => {
    // Auto-select price based on customer type
    if (selectedProduct && selectedCustomer) {
      const customerType = selectedCustomer.customer_type || 'walk-in';
      let autoPrice = selectedProduct.retail_price || selectedProduct.selling_price;
      
      if (customerType === 'wholesale' && selectedProduct.wholesale_price) {
        autoPrice = selectedProduct.wholesale_price;
      } else if (customerType === 'special' && selectedProduct.special_price) {
        autoPrice = selectedProduct.special_price;
      }
      
      setSellingPrice(autoPrice);
    } else if (selectedProduct && !selectedCustomer) {
      // Walk-in customer uses retail price
      setSellingPrice(selectedProduct.retail_price || selectedProduct.selling_price);
    }
  }, [selectedProduct, selectedCustomer]);

  const fetchCategories = async () => {
    try {
      const [catsResponse, subsResponse] = await Promise.all([
        categoriesAPI.getAll(),
        categoriesAPI.getSubCategoriesAll()
      ]);
      setCategories(catsResponse.data);
      setSubCategories(subsResponse.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    // Filter products based on category, sub-category, and search
    let filtered = products.filter(p => p.quantity_in_stock > 0);

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category_id === selectedCategory);
    }

    // Sub-category filter
    if (selectedSubCategory) {
      filtered = filtered.filter(p => p.sub_category_id === selectedSubCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        (p.item_name_english && p.item_name_english.toLowerCase().includes(query)) ||
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.item_name_urdu && p.item_name_urdu.toLowerCase().includes(query)) ||
        (p.sku && p.sku.toLowerCase().includes(query))
      );
    }

    // Sort: frequently sold first, then by display_order, then by name
    filtered.sort((a, b) => {
      if (a.is_frequently_sold && !b.is_frequently_sold) return -1;
      if (!a.is_frequently_sold && b.is_frequently_sold) return 1;
      if (a.display_order !== b.display_order) return (a.display_order || 0) - (b.display_order || 0);
      const nameA = (a.item_name_english || a.name || '').toLowerCase();
      const nameB = (b.item_name_english || b.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });

    setFilteredProducts(filtered);
  }, [searchQuery, products, selectedCategory, selectedSubCategory]);

  // Handle barcode scan or Enter key in search
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && filteredProducts.length > 0) {
      // Auto-select first product when Enter is pressed
      const firstProduct = filteredProducts[0];
      handleProductSelect(firstProduct);
      // Clear search after selection
      setTimeout(() => {
        setSearchQuery('');
        handleAddItem();
      }, 100);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      const data = response.data;
      
      if (data.other_app_settings) {
        const otherSettings = typeof data.other_app_settings === 'string' 
          ? JSON.parse(data.other_app_settings) 
          : data.other_app_settings;
        setShopName(otherSettings.shop_name || 'My Shop');
      }
      
      if (data.printer_config) {
        const printerConfig = typeof data.printer_config === 'string' 
          ? JSON.parse(data.printer_config) 
          : data.printer_config;
        setPrinterName(printerConfig?.printerName || '');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      const availableProducts = response.data.filter(p => p.quantity_in_stock > 0);
      setProducts(availableProducts);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.error || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll();
      setCustomers(response.data.filter(c => c.status === 'active'));
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    
    // Auto-select price based on customer type
    if (selectedCustomer) {
      const customerType = selectedCustomer.customer_type || 'walk-in';
      let autoPrice = product.retail_price || product.selling_price;
      
      if (customerType === 'wholesale' && product.wholesale_price) {
        autoPrice = product.wholesale_price;
      } else if (customerType === 'special' && product.special_price) {
        autoPrice = product.special_price;
      }
      setSellingPrice(autoPrice);
    } else {
      // Walk-in uses retail price
      setSellingPrice(product.retail_price || product.selling_price);
    }
    
    setQuantity(1);
    setSearchQuery(''); // Clear search when product is selected
  };

  const handleAddItem = () => {
    if (!selectedProduct) {
      alert('Please select a product');
      return;
    }

    const qty = parseInt(quantity);
    const price = parseFloat(sellingPrice);

    // Validation
    if (!qty || qty <= 0) {
      alert('Quantity must be greater than 0');
      return;
    }

    if (qty > selectedProduct.quantity_in_stock) {
      alert(`Insufficient stock! Available: ${selectedProduct.quantity_in_stock}`);
      return;
    }

    if (!price || price <= 0) {
      alert('Selling price must be greater than 0');
      return;
    }

    // Check if product already in invoice
    const existingIndex = invoiceItems.findIndex(
      item => item.product_id === selectedProduct.product_id
    );

    if (existingIndex >= 0) {
      // Update existing item
      const updatedItems = [...invoiceItems];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + qty,
        selling_price: price,
      };
      setInvoiceItems(updatedItems);
    } else {
      // Add new item
      const newItem = {
        product_id: selectedProduct.product_id,
        product_name: selectedProduct.name,
        sku: selectedProduct.sku,
        quantity: qty,
        selling_price: price,
        purchase_price: selectedProduct.purchase_price,
        stock_available: selectedProduct.quantity_in_stock,
      };
      setInvoiceItems([...invoiceItems, newItem]);
    }

    // Reset form
    setSelectedProduct(null);
    setQuantity(1);
    setSellingPrice('');
  };

  const handleRemoveItem = (index) => {
    const newItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(newItems);
  };

  const handleUpdateItem = (index, field, value) => {
    const updatedItems = [...invoiceItems];
    const item = updatedItems[index];

    if (field === 'quantity') {
      const qty = parseInt(value) || 0;
      if (qty > item.stock_available) {
        alert(`Insufficient stock! Available: ${item.stock_available}`);
        return;
      }
      item.quantity = qty;
    } else if (field === 'selling_price') {
      item.selling_price = parseFloat(value) || 0;
    }

    setInvoiceItems(updatedItems);
  };

  const handleQuantityChange = (index, delta) => {
    const updatedItems = [...invoiceItems];
    const item = updatedItems[index];
    const newQty = Math.max(1, Math.min(item.stock_available, item.quantity + delta));
    item.quantity = newQty;
    setInvoiceItems(updatedItems);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalProfit = 0;

    invoiceItems.forEach(item => {
      const itemTotal = item.quantity * item.selling_price;
      const itemProfit = item.quantity * (item.selling_price - item.purchase_price);
      subtotal += itemTotal;
      totalProfit += itemProfit;
    });

    const discountAmount = parseFloat(discount) || 0;
    const taxAmount = parseFloat(tax) || 0;
    const grandTotal = subtotal - discountAmount + taxAmount;

    return { subtotal, discountAmount, taxAmount, grandTotal, totalProfit };
  };

  useEffect(() => {
    const { grandTotal } = calculateTotals();
    if (paymentType === 'cash' || paymentType === 'card') {
      setPaidAmount(grandTotal);
    } else if (paymentType === 'credit') {
      setPaidAmount(0);
    }
  }, [paymentType, invoiceItems, discount, tax]);

  const handleSaveInvoice = async () => {
    if (invoiceItems.length === 0) {
      alert('Please add at least one item to the invoice');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const { grandTotal, totalProfit } = calculateTotals();

      const saleData = {
        customer_id: customerId || null,
        customer_name: customerId ? null : (customerName.trim() || null),
        payment_type: paymentType,
        paid_amount: parseFloat(paidAmount) || 0,
        discount: parseFloat(discount) || 0,
        tax: parseFloat(tax) || 0,
        items: invoiceItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          selling_price: item.selling_price,
        })),
      };

      const response = await salesAPI.create(saleData);
      
      // Success - reset form and show success
      alert(`Invoice ${response.data.invoice_number} saved successfully!`);
      
      // Reset form
      setInvoiceItems([]);
      setCustomerId(null);
      setCustomerName('');
      setInvoiceNumber('AUTO');
      setSelectedProduct(null);
      setQuantity(1);
      setSellingPrice('');
      setPaymentType('cash');
      setDiscount(0);
      setTax(0);
      setPaidAmount(0);

      // Refresh products to update stock
      await fetchProducts();

    } catch (err) {
      console.error('Error saving invoice:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.details || 'Failed to save invoice';
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    if (invoiceItems.length === 0) {
      alert('Please add items to the invoice first');
      return;
    }

    // Show preview first
    setShowPreview(true);
  };

  const handleConfirmPrint = async () => {
    const { grandTotal, totalProfit } = calculateTotals();
    await printInvoice(invoiceNumber, customerName, invoiceItems, grandTotal, totalProfit);
    setShowPreview(false);
  };

  const printInvoice = async (invNumber, customer, items, total, profit) => {
    // ESC/POS commands for thermal printer
    const ESC = '\x1B';
    const GS = '\x1D';
    let commands = '';

    // Initialize printer
    commands += ESC + '@'; // Initialize

    // Header
    commands += ESC + 'a' + '\x01'; // Center align
    commands += ESC + '!' + '\x18'; // Double height and width
    commands += shopName.toUpperCase() + '\n';
    commands += ESC + '!' + '\x00'; // Normal size
    commands += 'POS & Inventory\n';
    commands += '----------------\n';
    commands += '\n';

    // Invoice info
    commands += ESC + 'a' + '\x00'; // Left align
    commands += `Invoice: ${invNumber || 'AUTO'}\n`;
    commands += `Date: ${new Date().toLocaleString()}\n`;
    if (customer) {
      commands += `Customer: ${customer}\n`;
    }
    commands += '----------------\n';
    commands += '\n';

    // Items
    commands += ESC + '!' + '\x08'; // Bold
    commands += 'Items:\n';
    commands += ESC + '!' + '\x00'; // Normal
    commands += '----------------\n';
    
    items.forEach((item, index) => {
      const itemTotal = item.quantity * item.selling_price;
      const itemName = item.product_name || item.name || `Item ${index + 1}`;
      commands += `${index + 1}. ${itemName}\n`;
      if (item.sku) {
        commands += `   SKU: ${item.sku}\n`;
      }
      commands += `   Qty: ${item.quantity} x ${formatCurrency(item.selling_price)} = ${formatCurrency(itemTotal)}\n`;
      commands += '\n';
    });

    commands += '----------------\n';
    
    // Totals
    commands += ESC + '!' + '\x00'; // Normal
    commands += `Subtotal: ${formatCurrency(total)}\n`;
    commands += ESC + '!' + '\x08'; // Bold
    commands += `Total: ${formatCurrency(total)}\n`;
    commands += ESC + '!' + '\x00'; // Normal
    commands += `Profit: ${formatCurrency(profit)}\n`;
    commands += ESC + '!' + '\x00'; // Normal
    commands += '----------------\n';
    commands += '\n';
    commands += '\n';

    // Footer
    commands += ESC + 'a' + '\x01'; // Center align
    commands += 'Thank you for your business!\n';
    commands += '\n';
    commands += '\n';
    commands += '\n';
    
    // Cut paper
    commands += GS + 'V' + '\x41' + '\x03'; // Cut paper

    // Try to send to printer using Electron API
    if (window.electronAPI && window.electronAPI.printRaw) {
      try {
        const result = await window.electronAPI.printRaw(printerName, commands);
        if (result.success) {
          alert('Invoice sent to printer successfully!');
        } else {
          throw new Error(result.error || 'Print failed');
        }
      } catch (err) {
        console.error('Print error:', err);
        alert('Print failed: ' + err.message + '. Opening print dialog...');
        // Fallback to browser print dialog
        openPrintDialog(invNumber, customer, items, total, profit, shopName);
      }
    } else {
      // Fallback: open browser print dialog
      openPrintDialog(invNumber, customer, items, total, profit, shopName);
    }
  };

  const openPrintDialog = (invNumber, customer, items, total, profit, shopName) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invNumber || 'AUTO'}</title>
            <style>
              body { 
                font-family: monospace; 
                font-size: 12px; 
                padding: 20px;
                max-width: 300px;
                margin: 0 auto;
              }
              .header { text-align: center; font-weight: bold; font-size: 16px; }
              .center { text-align: center; }
              .line { border-bottom: 1px solid #000; margin: 10px 0; }
              .item { margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="header">${shopName.toUpperCase()}</div>
            <div class="center">POS & Inventory</div>
            <div class="line"></div>
            <p>Invoice: <strong>${invNumber || 'AUTO'}</strong></p>
            <p>Date: ${new Date().toLocaleString()}</p>
            ${customer ? `<p>Customer: ${customer}</p>` : ''}
            <div class="line"></div>
            <div class="header">Items:</div>
            ${items.map((item, idx) => {
              const itemTotal = item.quantity * item.selling_price;
              const itemName = item.product_name || item.name || `Item ${idx + 1}`;
              return `
                <div class="item">
                  ${idx + 1}. ${itemName}<br>
                  ${item.sku ? `SKU: ${item.sku}<br>` : ''}
                  Qty: ${item.quantity} x ${formatCurrency(item.selling_price)} = ${formatCurrency(itemTotal)}
                </div>
              `;
            }).join('')}
            <div class="line"></div>
            <p>Subtotal: ${formatCurrency(total)}</p>
            <p><strong>Total: ${formatCurrency(total)}</strong></p>
            <p>Profit: ${formatCurrency(profit)}</p>
            <div class="line"></div>
            <div class="center">Thank you for your business!</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const formatCurrency = (amount) => {
    return `PKR ${Number(amount).toFixed(2)}`;
  };

  const { grandTotal, totalProfit } = calculateTotals();
  const currentDate = new Date().toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  if (loading) {
    return (
      <div className="content-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="content-container">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* POS Header */}
      <div className="pos-header">
        <div className="pos-header-top">
          <div className="pos-shop-name">{shopName}</div>
          <div className="pos-invoice-info">
            <span>📄 Invoice #{invoiceNumber || 'AUTO'}</span>
            <span>🕐 {currentDate}</span>
          </div>
        </div>
        <div className="pos-header-bottom" style={{ gridTemplateColumns: '1fr 1fr 200px' }}>
          <div className="pos-search-box">
            <span className="pos-search-icon">🔍</span>
            <input
              type="text"
              className="pos-search-input"
              placeholder="Search by item name (English/Urdu) or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              autoFocus
            />
          </div>
          <select
            className="pos-customer-input"
            value={customerId || ''}
            onChange={(e) => {
              const selectedId = e.target.value ? parseInt(e.target.value) : null;
              setCustomerId(selectedId);
              if (selectedId) {
                const selected = customers.find(c => c.customer_id === selectedId);
                setSelectedCustomer(selected || null);
                setCustomerName(selected?.name || '');
                // Auto-update price if product is already selected
                if (selectedProduct) {
                  handleProductSelect(selectedProduct);
                }
                if (paymentType === 'cash' || paymentType === 'card') {
                  setPaymentType('credit'); // Default to credit for registered customers
                }
              } else {
                setSelectedCustomer(null);
                setCustomerName('');
                // Reset to retail price for walk-in
                if (selectedProduct) {
                  setSellingPrice(selectedProduct.retail_price || selectedProduct.selling_price);
                }
              }
            }}
            style={{ padding: '12px 16px', fontSize: '15px' }}
          >
            <option value="">Walk-in Customer</option>
            {customers.map(c => {
              const balance = Number(c.current_balance || 0);
              return (
                <option key={c.customer_id} value={c.customer_id}>
                  {c.name} ({c.customer_type || 'walk-in'}) {balance !== 0 ? `- Balance: PKR ${balance.toFixed(2)}` : ''}
                </option>
              );
            })}
          </select>
          {!customerId && (
            <input
              type="text"
              className="pos-customer-input"
              placeholder="Or enter name..."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          )}
        </div>
      </div>

      {/* POS Main Body - 3 Columns */}
      <div className="pos-main-container">
        {/* Left Column - Product Entry */}
        <div className="pos-product-entry">
          <h3>Products</h3>
          
          {/* Category Filters */}
          <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexDirection: 'column' }}>
            <select 
              className="pos-form-input" 
              value={selectedCategory || ''} 
              onChange={(e) => {
                setSelectedCategory(e.target.value ? parseInt(e.target.value) : null);
                setSelectedSubCategory(null);
              }}
              style={{ fontSize: '13px', padding: '8px' }}
            >
              <option value="">All Categories</option>
              {categories.filter(c => c.status === 'active').map(cat => (
                <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
              ))}
            </select>
            {selectedCategory && (
              <select 
                className="pos-form-input" 
                value={selectedSubCategory || ''} 
                onChange={(e) => setSelectedSubCategory(e.target.value ? parseInt(e.target.value) : null)}
                style={{ fontSize: '13px', padding: '8px' }}
              >
                <option value="">All Sub-Categories</option>
                {subCategories.filter(sc => sc.category_id === selectedCategory && sc.status === 'active')
                  .map(subCat => (
                    <option key={subCat.sub_category_id} value={subCat.sub_category_id}>
                      {subCat.sub_category_name}
                    </option>
                  ))}
              </select>
            )}
          </div>

          {/* Product List - Show filtered products or frequently sold */}
          <div className="pos-product-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {filteredProducts.length > 0 ? (
              filteredProducts.slice(0, 15).map(product => {
                const displayName = product.item_name_english || product.name || 'N/A';
                const displayPrice = selectedCustomer?.customer_type === 'wholesale' && product.wholesale_price
                  ? product.wholesale_price
                  : (selectedCustomer?.customer_type === 'special' && product.special_price
                    ? product.special_price
                    : (product.retail_price || product.selling_price));
                return (
                  <div
                    key={product.product_id}
                    className={`pos-product-item ${selectedProduct?.product_id === product.product_id ? 'selected' : ''}`}
                    onClick={() => handleProductSelect(product)}
                  >
                    <div className="pos-product-item-name">
                      {displayName}
                      {product.item_name_urdu && (
                        <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                          {product.item_name_urdu}
                        </span>
                      )}
                    </div>
                    <div className="pos-product-item-details">
                      <span>Stock: {product.quantity_in_stock} {product.unit_type || 'pcs'}</span>
                      <span className="pos-product-item-price">{formatCurrency(displayPrice)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                {searchQuery || selectedCategory ? 'No products found' : 'Select category or search to find products'}
              </div>
            )}
          </div>
          {selectedProduct && (
            <div className="pos-product-form">
              <div className="pos-form-group">
                <label className="pos-form-label">
                  Quantity (Available: {selectedProduct.quantity_in_stock})
                </label>
                <input
                  type="number"
                  className="pos-form-input"
                  min="1"
                  max={selectedProduct.quantity_in_stock}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="pos-form-group">
                <label className="pos-form-label">Selling Price (PKR)</label>
                <input
                  type="number"
                  className="pos-form-input"
                  step="0.01"
                  min="0.01"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                />
              </div>
              {!readOnly ? (
                <button className="pos-add-btn" onClick={handleAddItem}>
                  ➕ Add to Invoice
                </button>
              ) : (
                <div className="read-only-notice">Read-only mode</div>
              )}
            </div>
          )}
        </div>

        {/* Center Column - Invoice Items */}
        <div className="pos-invoice-items">
          <table className="pos-items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoiceItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="pos-empty-items">
                    <div className="pos-empty-items-icon">🛒</div>
                    <div>No items in invoice. Search and add products.</div>
                  </td>
                </tr>
              ) : (
                invoiceItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="pos-item-name">{item.product_name}</div>
                      {item.sku && <div className="pos-item-sku">SKU: {item.sku}</div>}
                    </td>
                    <td>
                      <div className="pos-qty-controls">
                        <button 
                          className="pos-qty-btn"
                          onClick={() => handleQuantityChange(index, -1)}
                        >−</button>
                        <input
                          type="number"
                          className="pos-qty-input"
                          min="1"
                          max={item.stock_available}
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                        />
                        <button 
                          className="pos-qty-btn"
                          onClick={() => handleQuantityChange(index, 1)}
                        >+</button>
                      </div>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="pos-price-input"
                        step="0.01"
                        min="0.01"
                        value={item.selling_price}
                        onChange={(e) => handleUpdateItem(index, 'selling_price', e.target.value)}
                      />
                    </td>
                    <td className="pos-item-total">
                      {formatCurrency(item.quantity * item.selling_price)}
                    </td>
                    <td>
                      <button
                        className="pos-item-remove"
                        onClick={() => handleRemoveItem(index)}
                        title="Remove"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Right Column - Summary Panel */}
        <div className="pos-summary-panel">
          <h3 className="pos-summary-title">Summary</h3>
          <div className="pos-summary-item">
            <span className="pos-summary-label">Items:</span>
            <span className="pos-summary-value">{invoiceItems.length}</span>
          </div>
          <div className="pos-summary-item">
            <span className="pos-summary-label">Subtotal:</span>
            <span className="pos-summary-value">{formatCurrency(calculateTotals().subtotal)}</span>
          </div>
          {(discount > 0 || tax > 0) && (
            <>
              {discount > 0 && (
                <div className="pos-summary-item">
                  <span className="pos-summary-label">Discount:</span>
                  <span className="pos-summary-value" style={{ color: '#059669' }}>-{formatCurrency(discount)}</span>
                </div>
              )}
              {tax > 0 && (
                <div className="pos-summary-item">
                  <span className="pos-summary-label">Tax:</span>
                  <span className="pos-summary-value">+{formatCurrency(tax)}</span>
                </div>
              )}
            </>
          )}
          <div className="pos-grand-total">
            <div className="pos-grand-total-label">Grand Total</div>
            <div className="pos-grand-total-value">{formatCurrency(calculateTotals().grandTotal)}</div>
          </div>
          <div style={{ marginTop: '12px', padding: '12px', background: '#f1f5f9', borderRadius: '6px' }}>
            <div className="pos-form-group" style={{ marginBottom: '8px' }}>
              <label className="pos-form-label">Payment Type</label>
              <select 
                className="pos-form-input" 
                value={paymentType}
                onChange={(e) => {
                  setPaymentType(e.target.value);
                  const { grandTotal } = calculateTotals();
                  if (e.target.value === 'cash' || e.target.value === 'card') {
                    setPaidAmount(grandTotal);
                  } else if (e.target.value === 'credit') {
                    setPaidAmount(0);
                  }
                }}
                disabled={!customerId && paymentType === 'credit'}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                {customerId && <option value="credit">Credit</option>}
                {customerId && <option value="split">Split</option>}
              </select>
            </div>
            {paymentType === 'split' && (
              <div className="pos-form-group">
                <label className="pos-form-label">Paid Amount</label>
                <input
                  type="number"
                  step="0.01"
                  className="pos-form-input"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                />
              </div>
            )}
            {(discount === 0 && tax === 0) && (
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                <button 
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '8px', fontSize: '12px' }}
                  onClick={() => {
                    const discountVal = prompt('Enter discount amount:');
                    if (discountVal !== null) setDiscount(parseFloat(discountVal) || 0);
                  }}
                >
                  Add Discount
                </button>
              </div>
            )}
          </div>
          <div className="pos-profit-info">
            <div className="pos-profit-label">Total Profit</div>
            <div className="pos-profit-value">{formatCurrency(calculateTotals().totalProfit)}</div>
          </div>
        </div>
      </div>

      {/* Footer - Payment Actions */}
      <div className="pos-footer">
        <button
          className="pos-footer-btn pos-footer-btn-secondary"
          onClick={handlePrint}
          disabled={invoiceItems.length === 0 || readOnly}
        >
          👁️ Preview & Print
        </button>
        {!readOnly ? (
          <button
            className="pos-footer-btn pos-footer-btn-primary"
            onClick={handleSaveInvoice}
            disabled={invoiceItems.length === 0 || saving}
          >
            💰 {saving ? 'Processing...' : 'Pay & Save Invoice'}
          </button>
        ) : (
          <span className="read-only-notice">Read-only mode: Cannot save invoices</span>
        )}
      </div>

      {/* Invoice Preview Modal */}
      {showPreview && (
        <InvoicePreview
          invoiceNumber={invoiceNumber}
          customerName={customerName}
          items={invoiceItems}
          totalAmount={grandTotal}
          totalProfit={totalProfit}
          onClose={() => setShowPreview(false)}
          onPrint={handleConfirmPrint}
        />
      )}
    </div>
  );
};

export default Billing;
