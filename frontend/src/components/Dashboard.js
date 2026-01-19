import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI, reportsAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = ({ readOnly = false }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    todaySales: 0,
    todayProfit: 0,
    monthSales: 0,
    monthProfit: 0,
    lowStockCount: 0,
  });
  const [recentSales, setRecentSales] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    // Listen for refresh events
    const handleRefresh = () => {
      fetchDashboardData();
    };
    window.addEventListener('data-refresh', handleRefresh);
    
    return () => {
      window.removeEventListener('data-refresh', handleRefresh);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch products for total count and low stock
      const productsResponse = await productsAPI.getAll();
      const products = productsResponse.data;
      
      // Fetch today's and monthly reports
      const [todayReport, monthlyReport, salesResponse] = await Promise.all([
        reportsAPI.getComprehensive('daily'),
        reportsAPI.getComprehensive('monthly'),
        reportsAPI.getComprehensive('daily', null, null), // Get sales for recent list
      ]);

      // Calculate stats
      const totalProducts = products.length;
      const lowStockItems = products.filter(p => p.quantity_in_stock <= 5);
      
      const todaySales = todayReport.data?.totals?.totalSales || 0;
      const todayProfit = todayReport.data?.totals?.netProfit || 0;
      const monthSales = monthlyReport.data?.totals?.totalSales || 0;
      const monthProfit = monthlyReport.data?.totals?.netProfit || 0;

      // Get recent sales (last 5) - comprehensive report returns sales array
      const salesArray = Array.isArray(salesResponse.data?.sales) ? salesResponse.data.sales : 
                         Array.isArray(salesResponse.data?.data?.sales) ? salesResponse.data.data.sales :
                         [];
      const recentSalesList = salesArray.slice(0, 5);
      
      // Ensure lowStockItems is an array
      const safeLowStockItems = Array.isArray(lowStockItems) ? lowStockItems : [];

      setStats({
        totalProducts,
        todaySales,
        todayProfit,
        monthSales,
        monthProfit,
        lowStockCount: safeLowStockItems.length,
      });
      
      setRecentSales(Array.isArray(recentSalesList) ? recentSalesList : []);
      setLowStockItems(safeLowStockItems);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `PKR ${Number(amount).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="content-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your shop's performance</p>
      </div>

      {/* Quick Actions Section - Moved to Top */}
      <div className="dashboard-section" style={{ marginBottom: '20px' }}>
        <div className="card">
          <div className="card-header">Quick Actions</div>
          <div className="card-content">
            <div className="quick-actions">
              {!readOnly && (
                <>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => navigate('/billing')}
                  >
                    💰 New Sale
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => navigate('/inventory')}
                  >
                    📦 Add Product
                  </button>
                </>
              )}
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/reports')}
              >
                📈 View Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3 className="stat-label">Total Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3 className="stat-label">Today's Sales</h3>
            <p className="stat-value">{formatCurrency(stats.todaySales)}</p>
            <p className="stat-subvalue">Profit: {formatCurrency(stats.todayProfit)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3 className="stat-label">This Month</h3>
            <p className="stat-value">{formatCurrency(stats.monthSales)}</p>
            <p className="stat-subvalue">Profit: {formatCurrency(stats.monthProfit)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3 className="stat-label">Low Stock Items</h3>
            <p className="stat-value">{stats.lowStockCount}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="card">
            <div className="card-header">
              <h2>Recent Sales</h2>
              <button 
                className="btn-link-small" 
                onClick={() => navigate('/reports')}
              >
                View All →
              </button>
            </div>
            <div className="card-content">
              {recentSales.length === 0 ? (
                <p className="empty-message">No recent sales. Start billing to see transactions here.</p>
              ) : (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Invoice #</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(recentSales) ? recentSales : []).map((sale) => (
                      <tr key={sale.sale_id}>
                        <td>{formatDate(sale.date)}</td>
                        <td>{sale.invoice_number}</td>
                        <td>{sale.customer_name || '-'}</td>
                        <td>{formatCurrency(sale.total_amount)}</td>
                        <td className={sale.total_profit >= 0 ? 'profit-positive' : 'profit-negative'}>
                          {formatCurrency(sale.total_profit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="card">
            <div className="card-header">
              <h2>Stock Alerts</h2>
              <button 
                className="btn-link-small" 
                onClick={() => navigate('/inventory')}
              >
                View Inventory →
              </button>
            </div>
            <div className="card-content">
              {lowStockItems.length === 0 ? (
                <p className="empty-message">All products have sufficient stock.</p>
              ) : (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Current Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(lowStockItems) ? lowStockItems : []).map((product) => (
                      <tr key={product.product_id}>
                        <td>{product.name}</td>
                        <td>{product.sku || '-'}</td>
                        <td className="low-stock-value">{product.quantity_in_stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
