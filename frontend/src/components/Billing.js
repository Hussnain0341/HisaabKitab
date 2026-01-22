import React, { useState, useEffect, useRef } from 'react';
import { productsAPI, salesAPI, settingsAPI, customersAPI } from '../services/api';
import './Billing.css';

const Billing = ({ readOnly = false }) => {
  // Core state
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [shopName, setShopName] = useState('My Shop');
  const [shopPhone, setShopPhone] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash'); // cash, card, bank_transfer, etc.
  const [currentTime, setCurrentTime] = useState(new Date());
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  
  // Price type per item
  const [itemPriceTypes, setItemPriceTypes] = useState({});
  
  const searchInputRef = useRef(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, products]);

  useEffect(() => {
    const { grandTotal } = calculateTotals();
    // Auto-adjust paid amount if it exceeds grand total
    if (parseFloat(paidAmount) > grandTotal) {
      setPaidAmount(grandTotal);
    }
  }, [invoiceItems, discount]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchProducts(),
        fetchCustomers(),
        fetchSettings()
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      // Don't filter by stock - allow all products
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll();
      setCustomers((response.data || []).filter(c => c.status === 'active'));
    } catch (err) {
      console.error('Error fetching customers:', err);
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
        setShopPhone(otherSettings.shop_phone || '');
        setShopAddress(otherSettings.shop_address || '');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const filterProducts = () => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = products.filter(p => {
      const name = (p.item_name_english || p.name || '').toLowerCase();
      return name.includes(query);
    });

    // Sort: frequently sold first, then by name
    filtered.sort((a, b) => {
      const aFrequent = a.is_frequently_sold === true || a.is_frequently_sold === 1;
      const bFrequent = b.is_frequently_sold === true || b.is_frequently_sold === 1;
      if (aFrequent && !bFrequent) return -1;
      if (!aFrequent && bFrequent) return 1;
      const nameA = (a.item_name_english || a.name || '').toLowerCase();
      const nameB = (b.item_name_english || b.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });

    setFilteredProducts(filtered.slice(0, 10)); // Limit to 10 results
  };

  // Handle product selection from search - directly add to bill
  const handleProductSelect = (product) => {
    if (!product) return;

    // Determine default price based on customer
    let defaultPrice = product.retail_price || product.selling_price || 0;
    let priceType = 'retail';

    if (selectedCustomer) {
      const customerType = selectedCustomer.customer_type || 'walk-in';
      if (customerType === 'wholesale' && product.wholesale_price) {
        defaultPrice = product.wholesale_price;
        priceType = 'wholesale';
      } else if (customerType === 'special' && product.special_price) {
        defaultPrice = product.special_price || defaultPrice;
        priceType = 'special';
      }
    }

    // Check if product already exists in invoice
    const existingIndex = invoiceItems.findIndex(
      item => item.product_id === product.product_id
    );

    if (existingIndex >= 0) {
      // Increase quantity
      const updatedItems = [...invoiceItems];
      updatedItems[existingIndex].quantity += 1;
      setInvoiceItems(updatedItems);
    } else {
      // Add new item
      const newItem = {
        product_id: product.product_id,
        product_name: product.item_name_english || product.name,
        quantity: 1,
        selling_price: defaultPrice,
        purchase_price: product.purchase_price || 0,
        stock_available: product.quantity_in_stock || 0,
        unit_type: product.unit_type || 'piece',
      };
      setInvoiceItems([...invoiceItems, newItem]);
      setItemPriceTypes({ ...itemPriceTypes, [product.product_id]: priceType });
    }

    // Clear search and focus back
    setSearchQuery('');
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  // Handle Enter key in search
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && filteredProducts.length > 0) {
      handleProductSelect(filteredProducts[0]);
    }
  };

  // Update item quantity
  const handleQuantityChange = (index, value) => {
    const updatedItems = [...invoiceItems];
    const qty = parseFloat(value);
    
    // Only update if valid number, don't remove on empty or 0
    if (!isNaN(qty) && qty > 0) {
      updatedItems[index].quantity = qty;
      setInvoiceItems(updatedItems);
    } else if (value === '' || value === null || value === undefined) {
      // Allow empty input temporarily while user is typing
      updatedItems[index].quantity = '';
      setInvoiceItems(updatedItems);
    }
    // Don't remove item - only Remove button should do that
  };

  // Update item price
  const handlePriceChange = (index, value) => {
    const updatedItems = [...invoiceItems];
    const price = parseFloat(value) || 0;
    if (price > 0) {
      updatedItems[index].selling_price = price;
      setInvoiceItems(updatedItems);
    }
  };

  // Switch price type for an item
  const handlePriceTypeChange = (index, priceType) => {
    const item = invoiceItems[index];
    const product = products.find(p => p.product_id === item.product_id);
    if (!product) return;

    let newPrice = item.selling_price;
    if (priceType === 'retail') {
      newPrice = product.retail_price || product.selling_price || 0;
    } else if (priceType === 'wholesale') {
      newPrice = product.wholesale_price || product.retail_price || product.selling_price || 0;
    } else if (priceType === 'special') {
      newPrice = product.special_price || product.retail_price || product.selling_price || 0;
    }

    const updatedItems = [...invoiceItems];
    updatedItems[index].selling_price = newPrice;
    setInvoiceItems(updatedItems);
    setItemPriceTypes({ ...itemPriceTypes, [item.product_id]: priceType });
  };

  // Remove item
  const handleRemoveItem = (index) => {
    const updatedItems = invoiceItems.filter((_, i) => i !== index);
    setInvoiceItems(updatedItems);
  };

  // Calculate totals
  const calculateTotals = () => {
    let subtotal = 0;
    invoiceItems.forEach(item => {
      const qty = typeof item.quantity === 'number' ? item.quantity : parseFloat(item.quantity) || 0;
      const price = parseFloat(item.selling_price) || 0;
      subtotal += qty * price;
    });

    const discountAmount = parseFloat(discount) || 0;
    const grandTotal = Math.max(0, subtotal - discountAmount);
    const paid = parseFloat(paidAmount) || 0;
    const remainingDue = Math.max(0, grandTotal - paid);
    const change = Math.max(0, paid - grandTotal); // Change to return if overpaid

    return { subtotal, discountAmount, grandTotal, remainingDue, change, paid };
  };

  // Handle save invoice
  const handleSaveInvoice = async (shouldPrint = false) => {
    if (invoiceItems.length === 0) {
      alert('Please add at least one item to the invoice');
      return;
    }

    const { grandTotal } = calculateTotals();
    const paid = parseFloat(paidAmount) || 0;

    // Determine payment type
    let paymentType = 'cash';
    if (selectedCustomer) {
      if (paid === 0) {
        paymentType = 'credit';
      } else if (paid < grandTotal) {
        paymentType = 'split';
      } else {
        paymentType = 'cash';
      }
    } else {
      // Cash customer - always full payment
      paymentType = 'cash';
    }

    try {
      setSaving(true);
      setError(null);

      const saleData = {
        customer_id: selectedCustomer?.customer_id || null,
        customer_name: selectedCustomer ? null : (customerName.trim() || null),
        payment_type: paymentType,
        payment_mode: paymentMode, // cash, card, etc.
        paid_amount: paid,
        discount: parseFloat(discount) || 0,
        tax: 0, // No tax for now
        items: invoiceItems.map(item => ({
          product_id: item.product_id,
          quantity: typeof item.quantity === 'number' ? item.quantity : parseFloat(item.quantity) || 0,
          selling_price: item.selling_price,
        })),
      };

      const response = await salesAPI.create(saleData);
      const savedInvoice = response.data;
      
      // Update invoice number for display
      setInvoiceNumber(savedInvoice.invoice_number);

      // Print if requested
      if (shouldPrint) {
        await printInvoice(savedInvoice);
      }

      // Reset form
      resetForm();

      // Refresh products to update stock
      await fetchProducts();

      alert(`Invoice ${savedInvoice.invoice_number} saved successfully!`);
    } catch (err) {
      console.error('Error saving invoice:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.details || 'Failed to save invoice';
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setSaving(false);
    }
  };


  // Cancel bill
  const handleCancelBill = () => {
    if (invoiceItems.length === 0) {
      return;
    }

    if (window.confirm('Are you sure you want to cancel this bill?')) {
      resetForm();
    }
  };

  // Reset form
  const resetForm = () => {
    setInvoiceItems([]);
    setSelectedCustomer(null);
    setCustomerName('');
    setDiscount(0);
    setPaidAmount(0);
    setPaymentMode('cash');
    setSearchQuery('');
    setItemPriceTypes({});
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Print invoice
  const printInvoice = async (invoiceData = null) => {
    const { grandTotal, remainingDue } = calculateTotals();
    const invNumber = invoiceData?.invoice_number || invoiceNumber || 'DRAFT';
    const customer = invoiceData?.customer_name || (selectedCustomer?.name || customerName || 'Cash Customer');
    const items = invoiceData?.items || invoiceItems;
    const paid = invoiceData?.paid_amount || parseFloat(paidAmount) || 0;
    const disc = invoiceData?.discount || parseFloat(discount) || 0;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print invoice');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invNumber}</title>
          <style>
            @media print {
              @page { margin: 10mm; size: 80mm auto; }
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              max-width: 80mm;
              margin: 0 auto;
              padding: 10px;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #000;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .shop-name {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .shop-info {
              font-size: 11px;
              color: #333;
            }
            .invoice-info {
              margin: 10px 0;
              font-size: 11px;
            }
            .invoice-info div {
              margin: 3px 0;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
              font-size: 11px;
            }
            .items-table th {
              text-align: left;
              border-bottom: 1px solid #000;
              padding: 5px 0;
              font-weight: bold;
            }
            .items-table td {
              padding: 4px 0;
              border-bottom: 1px dotted #ccc;
            }
            .items-table .qty { text-align: center; width: 15%; }
            .items-table .rate { text-align: right; width: 25%; }
            .items-table .total { text-align: right; width: 25%; }
            .totals {
              margin-top: 10px;
              border-top: 2px dashed #000;
              padding-top: 10px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
              font-size: 12px;
            }
            .grand-total {
              font-weight: bold;
              font-size: 14px;
              border-top: 1px solid #000;
              padding-top: 5px;
              margin-top: 5px;
            }
            .due-amount {
              color: #d32f2f;
              font-weight: bold;
              font-size: 13px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding-top: 10px;
              border-top: 1px dashed #000;
              font-size: 11px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="shop-name">${shopName}</div>
            ${shopPhone ? `<div class="shop-info">Phone: ${shopPhone}</div>` : ''}
            ${shopAddress ? `<div class="shop-info">${shopAddress}</div>` : ''}
          </div>
          
          <div class="invoice-info">
            <div><strong>Invoice:</strong> ${invNumber}</div>
            <div><strong>Date:</strong> ${new Date().toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' })}</div>
            <div><strong>Customer:</strong> ${customer}</div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th class="qty">Qty</th>
                <th class="rate">Rate</th>
                <th class="total">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item, idx) => {
                const itemName = item.product_name || item.name || `Item ${idx + 1}`;
                const qty = item.quantity || 0;
                const rate = item.selling_price || 0;
                const total = qty * rate;
                return `
                  <tr>
                    <td>${itemName}</td>
                    <td class="qty">${qty}</td>
                    <td class="rate">${formatCurrency(rate)}</td>
                    <td class="total">${formatCurrency(total)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            ${disc > 0 ? `<div class="total-row"><span>Subtotal:</span><span>${formatCurrency(grandTotal + disc)}</span></div>` : ''}
            ${disc > 0 ? `<div class="total-row"><span>Discount:</span><span>-${formatCurrency(disc)}</span></div>` : ''}
            <div class="total-row grand-total">
              <span>Grand Total:</span>
              <span>${formatCurrency(grandTotal)}</span>
            </div>
            <div class="total-row">
              <span>Paid Amount:</span>
              <span>${formatCurrency(paid)}</span>
            </div>
            ${remainingDue > 0 ? `<div class="total-row due-amount"><span>Remaining Due:</span><span>${formatCurrency(remainingDue)}</span></div>` : ''}
          </div>
          
          <div class="footer">
            <div>Thank you for your business!</div>
            <div style="margin-top: 5px; font-size: 10px;">شکریہ</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const formatCurrency = (amount) => {
    return `PKR ${Number(amount || 0).toFixed(2)}`;
  };

  const { subtotal, discountAmount, grandTotal, remainingDue, change, paid } = calculateTotals();
  
  // Filter customers for searchable dropdown
  const filteredCustomers = customers.filter(c => {
    if (!customerSearchQuery.trim()) return true;
    const query = customerSearchQuery.toLowerCase();
    return c.name.toLowerCase().includes(query) || 
           (c.mobile && c.mobile.includes(query));
  });

  if (loading) {
    return (
      <div className="billing-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="billing-container">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Header with Time and Invoice Info */}
      <div className="billing-header-bar">
        <div className="billing-time-display">
          <div className="billing-date">{currentTime.toLocaleDateString('en-PK', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
          <div className="billing-time">{currentTime.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
        </div>
        <div className="billing-invoice-display">
          <span>Invoice: {invoiceNumber || 'New Bill'}</span>
          {selectedCustomer && (
            <span className="billing-customer-balance">
              {selectedCustomer.name} - Balance: {formatCurrency(selectedCustomer.current_due || selectedCustomer.current_balance || 0)}
            </span>
          )}
        </div>
      </div>


      {/* Top Search Bar */}
      <div className="billing-search-section">
        <div className="billing-search-box">
          <span className="billing-search-icon">⚡</span>
          <input
            ref={searchInputRef}
            type="text"
            className="billing-search-input"
            placeholder="Search product and press Enter to add..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            autoFocus
          />
        </div>
        {filteredProducts.length > 0 && (
          <div className="billing-search-results">
            {filteredProducts.map(product => {
              const displayPrice = selectedCustomer?.customer_type === 'wholesale' && product.wholesale_price
                ? product.wholesale_price
                : (selectedCustomer?.customer_type === 'special' && product.special_price
                  ? product.special_price
                  : (product.retail_price || product.selling_price));
              return (
                <div
                  key={product.product_id}
                  className="billing-search-result-item"
                  onClick={() => handleProductSelect(product)}
                >
                  <div className="billing-result-info">
                    <div className="billing-result-name">{product.item_name_english || product.name}</div>
                    <div className="billing-result-meta">
                      <span className="billing-result-stock">Stock: {product.quantity_in_stock || 0} {product.unit_type || 'pcs'}</span>
                      <span className="billing-result-price">{formatCurrency(displayPrice)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Layout: Left (Items) + Right (Summary) */}
      <div className="billing-main-layout">
        {/* LEFT SIDE - Bill Items Table */}
        <div className="billing-items-section">
          <div className="billing-section-header">
            <h3>Bill Items</h3>
            <div className="billing-customer-selector-wrapper">
              <div className="billing-customer-dropdown-container">
                <div 
                  className="billing-customer-select-trigger"
                  onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                >
                  {selectedCustomer ? selectedCustomer.name : 'Cash Customer'}
                  <span className="billing-dropdown-arrow">▼</span>
                </div>
                {showCustomerDropdown && (
                  <>
                    <div 
                      className="billing-customer-dropdown-overlay"
                      onClick={() => setShowCustomerDropdown(false)}
                    />
                    <div className="billing-customer-dropdown">
                      <input
                        type="text"
                        className="billing-customer-search-input"
                        placeholder="Search customer..."
                        value={customerSearchQuery}
                        onChange={(e) => setCustomerSearchQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                      <div className="billing-customer-options">
                        <div
                          className={`billing-customer-option ${!selectedCustomer ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedCustomer(null);
                            setCustomerName('');
                            setCustomerSearchQuery('');
                            setShowCustomerDropdown(false);
                          }}
                        >
                          Cash Customer
                        </div>
                        {filteredCustomers.map(c => (
                          <div
                            key={c.customer_id}
                            className={`billing-customer-option ${selectedCustomer?.customer_id === c.customer_id ? 'selected' : ''}`}
                            onClick={() => {
                              setSelectedCustomer(c);
                              setCustomerName('');
                              setCustomerSearchQuery('');
                              setShowCustomerDropdown(false);
                              
                              // Update prices for existing items based on customer type
                              const updatedItems = invoiceItems.map(item => {
                                const product = products.find(p => p.product_id === item.product_id);
                                if (!product) return item;
                                
                                const customerType = c.customer_type || 'walk-in';
                                let newPrice = item.selling_price;
                                let priceType = 'retail';
                                
                                if (customerType === 'wholesale' && product.wholesale_price) {
                                  newPrice = product.wholesale_price;
                                  priceType = 'wholesale';
                                } else if (customerType === 'special' && product.special_price) {
                                  newPrice = product.special_price || product.retail_price || product.selling_price;
                                  priceType = 'special';
                                } else {
                                  newPrice = product.retail_price || product.selling_price;
                                  priceType = 'retail';
                                }
                                
                                return { ...item, selling_price: newPrice };
                              });
                              setInvoiceItems(updatedItems);
                            }}
                          >
                            {c.name} {c.customer_type ? `(${c.customer_type})` : ''}
                            {c.current_due > 0 && (
                              <span className="billing-customer-due">Due: {formatCurrency(c.current_due)}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              {!selectedCustomer && (
                <input
                  type="text"
                  className="billing-customer-name-input"
                  placeholder="Or enter customer name..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="billing-items-table-container">
            <table className="billing-items-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="billing-empty-items">
                      <div>No items in bill. Search and add products.</div>
                    </td>
                  </tr>
                ) : (
                  invoiceItems.map((item, index) => {
                    const product = products.find(p => p.product_id === item.product_id);
                    const priceType = itemPriceTypes[item.product_id] || 'retail';
                    const stockWarning = item.stock_available < item.quantity;
                    
                    return (
                      <tr key={index} className={stockWarning ? 'billing-item-low-stock' : ''}>
                        <td>
                          <div className="billing-item-name">{item.product_name}</div>
                          {stockWarning && (
                            <div className="billing-stock-warning">
                              ⚠️ Low stock: {item.stock_available} available
                            </div>
                          )}
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            className="billing-qty-input"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                            onBlur={(e) => {
                              // Ensure minimum quantity on blur
                              const qty = parseFloat(e.target.value);
                              if (!qty || qty < 0.01) {
                                handleQuantityChange(index, 1);
                              }
                            }}
                          />
                        </td>
                        <td>
                          <div className="billing-price-controls">
                            <select
                              className="billing-price-type-select"
                              value={priceType}
                              onChange={(e) => handlePriceTypeChange(index, e.target.value)}
                            >
                              <option value="retail">Retail</option>
                              <option value="wholesale">Wholesale</option>
                              {product?.special_price && <option value="special">Special</option>}
                            </select>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              className="billing-price-input"
                              value={item.selling_price}
                              onChange={(e) => handlePriceChange(index, e.target.value)}
                            />
                          </div>
                        </td>
                        <td className="billing-item-total">
                          {formatCurrency(item.quantity * item.selling_price)}
                        </td>
                        <td>
                          <button
                            className="billing-remove-btn-text"
                            onClick={() => handleRemoveItem(index)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT SIDE - Bill Summary */}
        <div className="billing-summary-section">
          <div className="billing-summary-header">
            <h3>Bill Summary</h3>
          </div>

          <div className="billing-summary-content">
            <div className="billing-summary-row">
              <span className="billing-summary-label">Subtotal:</span>
              <span className="billing-summary-value">{formatCurrency(subtotal)}</span>
            </div>

            <div className="billing-summary-row">
              <label className="billing-summary-label">Discount:</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="billing-discount-input"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                placeholder="0.00"
              />
            </div>

            <div className="billing-summary-row billing-grand-total">
              <span className="billing-summary-label">Grand Total:</span>
              <span className="billing-summary-value">{formatCurrency(grandTotal)}</span>
            </div>

            <div className="billing-summary-row">
              <label className="billing-summary-label">Mode of Payment:</label>
              <select
                className="billing-payment-mode-select"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="billing-summary-row">
              <label className="billing-summary-label">Paid Amount:</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="billing-paid-input"
                value={paidAmount}
                onChange={(e) => {
                  const paid = Math.max(0, parseFloat(e.target.value) || 0);
                  setPaidAmount(paid);
                }}
                placeholder="0.00"
              />
            </div>

            {paid > 0 && (
              <div className="billing-summary-row billing-paid-display">
                <span className="billing-summary-label">Amount Paid:</span>
                <span className="billing-summary-value">{formatCurrency(paid)}</span>
              </div>
            )}

            {change > 0 && (
              <div className="billing-summary-row billing-change-display">
                <span className="billing-summary-label">Change to Return:</span>
                <span className="billing-summary-value">{formatCurrency(change)}</span>
              </div>
            )}

            {remainingDue > 0 && (
              <div className="billing-summary-row billing-remaining-due">
                <span className="billing-summary-label">Remaining Due:</span>
                <span className="billing-summary-value">{formatCurrency(remainingDue)}</span>
              </div>
            )}

            {remainingDue === 0 && grandTotal > 0 && (
              <div className="billing-summary-row billing-paid-full">
                <span className="billing-summary-label">✅ Fully Paid</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="billing-action-buttons">
            <button
              className="billing-btn billing-btn-save"
              onClick={() => handleSaveInvoice(false)}
              disabled={invoiceItems.length === 0 || saving || readOnly}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              className="billing-btn billing-btn-save-print"
              onClick={() => handleSaveInvoice(true)}
              disabled={invoiceItems.length === 0 || saving || readOnly}
            >
              {saving ? 'Saving...' : 'Save & Print'}
            </button>
            <button
              className="billing-btn billing-btn-cancel"
              onClick={handleCancelBill}
              disabled={invoiceItems.length === 0}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
