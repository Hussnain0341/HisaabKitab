import React, { useState, useEffect, useMemo } from 'react';
import { reportsAPI } from '../services/api';
import Pagination from './Pagination';
import './Reports.css';

const Reports = () => {
  const [filterType, setFilterType] = useState('monthly');
  const [reportData, setReportData] = useState(null);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    updateDateRange();
  }, [filterType]);

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    fetchReportData(filterType, selectedProduct, selectedSupplier, startDate, endDate);
  }, [filterType, selectedProduct, selectedSupplier, startDate, endDate]);

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

  const fetchProducts = async () => {
    try {
      const response = await reportsAPI.getProducts();
      const productsData = Array.isArray(response.data) ? response.data : [];
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]); // Set empty array on error
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await reportsAPI.getSuppliers();
      const suppliersData = Array.isArray(response.data) ? response.data : [];
      setSuppliers(suppliersData);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setSuppliers([]); // Set empty array on error
    }
  };

  const fetchReportData = async (period, productId, supplierId, startDate = null, endDate = null) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        period,
        product_id: productId || null,
        supplier_id: supplierId || null,
      };
      if (startDate && endDate) {
        params.start_date = startDate;
        params.end_date = endDate;
      }
      const response = await reportsAPI.getComprehensive(
        period,
        productId || null,
        supplierId || null,
        startDate,
        endDate
      );
      setReportData(response.data);
    } catch (err) {
      console.error('Error fetching report:', err);
      setError(err.response?.data?.error || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!reportData) return;

    // Prepare CSV data
    let csvContent = 'HisaabKitab Report\n';
    const filterLabels = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      last3months: 'Last 3 Months',
      last6months: 'Last 6 Months',
      thisyear: 'This Year',
      lastyear: 'Last Year',
      custom: 'Custom Range'
    };
    csvContent += `Period: ${filterLabels[filterType] || 'Monthly'}\n`;
    csvContent += `Date Range: ${formatDate(reportData.dateRange.start)} - ${formatDate(reportData.dateRange.end)}\n\n`;

    // Totals
    csvContent += 'TOTALS\n';
    csvContent += `Total Sales,${formatCurrency(reportData.totals.totalSales)}\n`;
    csvContent += `Total Profit,${formatCurrency(reportData.totals.totalProfit)}\n`;
    csvContent += `Total Loss,${formatCurrency(reportData.totals.totalLoss)}\n`;
    csvContent += `Net Profit,${formatCurrency(reportData.totals.netProfit)}\n`;
    csvContent += `Total Purchases,${formatCurrency(reportData.totals.totalPurchases)}\n\n`;

    // Sales
    csvContent += 'SALES\n';
    csvContent += 'Date,Invoice #,Customer,Total Amount,Profit/Loss\n';
    reportData.sales.forEach(sale => {
      csvContent += `${formatDate(sale.date)},${sale.invoice_number},${sale.customer_name || ''},${formatCurrency(sale.total_amount)},${formatCurrency(sale.total_profit)}\n`;
    });

    // Purchases
    csvContent += '\nPURCHASES\n';
    csvContent += 'Date,Product,Supplier,Quantity,Price,Total\n';
    reportData.purchases.forEach(purchase => {
      csvContent += `${formatDate(purchase.date)},${purchase.product_name},${purchase.supplier_name || ''},${purchase.quantity},${formatCurrency(purchase.purchase_price)},${formatCurrency(purchase.total_amount)}\n`;
    });

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `report_${filterType}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount) => {
    return Number(amount).toFixed(2);
  };

  const formatCurrencyDisplay = (amount) => {
    return `PKR ${Number(amount).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getProfitColor = (profit) => {
    const profitValue = parseFloat(profit);
    if (profitValue > 0) return 'profit-positive';
    if (profitValue < 0) return 'profit-negative';
    return '';
  };

  // Combine sales and purchases for pagination
  const combinedReportData = useMemo(() => {
    if (!reportData) return [];
    const sales = Array.isArray(reportData.sales) ? reportData.sales.map(s => ({ ...s, type: 'sale' })) : [];
    const purchases = Array.isArray(reportData.purchases) ? reportData.purchases.map(p => ({ ...p, type: 'purchase' })) : [];
    return [...sales, ...purchases].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [reportData]);

  // Pagination logic
  const totalPages = Math.ceil(combinedReportData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReportData = combinedReportData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, selectedProduct, selectedSupplier, startDate, endDate]);

  const handleClearFilters = () => {
    setSelectedProduct('');
    setSelectedSupplier('');
    setFilterType('monthly');
    setCustomStartDate('');
    setCustomEndDate('');
  };

  if (loading && !reportData) {
    return (
      <div className="content-container">
        <div className="loading">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">View sales, profit/loss, purchases, and cash flow</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Date Filter Section */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <h2>Filter Reports</h2>
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
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '16px' }}>
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
            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '14px', marginBottom: '16px' }}>
              <strong>Date Range:</strong> {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
            </div>
          )}
          
          {/* Product and Supplier Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Filter by Product</label>
              <select
                className="form-input"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">All Products</option>
                {(Array.isArray(products) ? products : []).map(product => (
                  <option key={product.product_id} value={product.product_id}>
                    {product.name || product.item_name_english}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Filter by Supplier</label>
              <select
                className="form-input"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
              >
                <option value="">All Suppliers</option>
                {(Array.isArray(suppliers) ? suppliers : []).map(supplier => (
                  <option key={supplier.supplier_id} value={supplier.supplier_id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={handleClearFilters}>
              Clear Filters
            </button>
            <button className="btn btn-primary" onClick={handleExportCSV}>
              📥 Export to CSV
            </button>
          </div>
        </div>
      </div>

      {/* Totals */}
      {reportData && (
        <div className="totals-container">
          <div className="total-card">
            <div className="total-label">Total Sales</div>
            <div className="total-value">{formatCurrencyDisplay(reportData.totals.totalSales)}</div>
          </div>
          <div className="total-card">
            <div className="total-label">Total Profit</div>
            <div className={`total-value profit-positive`}>
              {formatCurrencyDisplay(reportData.totals.totalProfit)}
            </div>
          </div>
          <div className="total-card">
            <div className="total-label">Total Loss</div>
            <div className={`total-value profit-negative`}>
              {formatCurrencyDisplay(reportData.totals.totalLoss)}
            </div>
          </div>
          <div className="total-card">
            <div className="total-label">Net Profit/Loss</div>
            <div className={`total-value ${getProfitColor(reportData.totals.netProfit)}`}>
              {formatCurrencyDisplay(reportData.totals.netProfit)}
            </div>
          </div>
          <div className="total-card">
            <div className="total-label">Total Purchases</div>
            <div className="total-value">{formatCurrencyDisplay(reportData.totals.totalPurchases)}</div>
          </div>
        </div>
      )}

      {/* Report Table */}
      {reportData && (
        <div className="card">
          <div className="card-header">
            <h2>Sales & Purchases Report</h2>
            {reportData.dateRange.start && (
              <div className="date-range">
                {formatDate(reportData.dateRange.start)} - {formatDate(reportData.dateRange.end)}
              </div>
            )}
          </div>

          <div className="table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Invoice/Ref</th>
                  <th>Customer/Supplier</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReportData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      No data found for this period.
                    </td>
                  </tr>
                ) : (
                  paginatedReportData.map((item) => {
                    if (item.type === 'sale') {
                      return (
                        <tr key={`sale-${item.sale_id}`} className="row-sale">
                          <td>{formatDate(item.date)}</td>
                          <td><span className="badge badge-sale">Sale</span></td>
                          <td>{item.invoice_number}</td>
                          <td>{item.customer_name || '-'}</td>
                          <td>-</td>
                          <td>-</td>
                          <td>{formatCurrencyDisplay(item.total_amount)}</td>
                          <td className={getProfitColor(item.total_profit)}>
                            {formatCurrencyDisplay(item.total_profit)}
                          </td>
                        </tr>
                      );
                    } else {
                      return (
                        <tr key={`purchase-${item.purchase_id}`} className="row-purchase">
                          <td>{formatDate(item.date)}</td>
                          <td><span className="badge badge-purchase">Purchase</span></td>
                          <td>PUR-{item.purchase_id}</td>
                          <td>{item.supplier_name || '-'}</td>
                          <td>{item.product_name}</td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrencyDisplay(item.total_amount)}</td>
                          <td className="profit-negative">
                            -{formatCurrencyDisplay(item.total_amount)}
                          </td>
                        </tr>
                      );
                    }
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {combinedReportData.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={combinedReportData.length}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(newItemsPerPage) => {
                setItemsPerPage(newItemsPerPage);
                setCurrentPage(1);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
