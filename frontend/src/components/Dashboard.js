import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { reportsAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh on data changes
    const handleRefresh = () => {
      fetchDashboardData();
    };
    window.addEventListener('data-refresh', handleRefresh);
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    return () => {
      window.removeEventListener('data-refresh', handleRefresh);
      clearInterval(interval);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getDashboard();
      setDashboardData(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `PKR ${Number(amount || 0).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
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
        <div className="loading">{t('dashboard.loading')}</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="content-container">
        <div className="error-message">{t('dashboard.failedToLoad')}</div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title">{t('dashboard.title')}</h1>
        <p className="page-subtitle">{t('dashboard.subtitle')}</p>
      </div>

      {/* Summary Cards - 6 Cards */}
      <div className="dashboard-summary-cards">
        <div className="dashboard-summary-card">
          <div className="summary-card-icon">💰</div>
          <div className="summary-card-content">
            <div className="summary-card-label">{t('dashboard.todaySale')}</div>
            <div className="summary-card-value">{formatCurrency(dashboardData.todaySale)}</div>
          </div>
        </div>

        <div className="dashboard-summary-card">
          <div className="summary-card-icon">📈</div>
          <div className="summary-card-content">
            <div className="summary-card-label">{t('dashboard.todayProfit')}</div>
            <div className={`summary-card-value ${dashboardData.todayProfit >= 0 ? 'profit-positive' : 'profit-negative'}`}>
              {formatCurrency(dashboardData.todayProfit)}
            </div>
          </div>
        </div>

        <div className="dashboard-summary-card">
          <div className="summary-card-icon">💵</div>
          <div className="summary-card-content">
            <div className="summary-card-label">{t('dashboard.cashInHand')}</div>
            <div className="summary-card-value">{formatCurrency(dashboardData.cashInHand)}</div>
          </div>
        </div>

        <div 
          className="dashboard-summary-card clickable"
          onClick={() => navigate('/reports?tab=customers')}
        >
          <div className="summary-card-icon">👥</div>
          <div className="summary-card-content">
            <div className="summary-card-label">{t('dashboard.customerDue')}</div>
            <div className="summary-card-value profit-negative">{formatCurrency(dashboardData.customerDue)}</div>
            <div className="summary-card-hint">{t('dashboard.clickToViewList')}</div>
          </div>
        </div>

        <div 
          className="dashboard-summary-card clickable"
          onClick={() => navigate('/reports?tab=suppliers')}
        >
          <div className="summary-card-icon">🏪</div>
          <div className="summary-card-content">
            <div className="summary-card-label">{t('dashboard.supplierDue')}</div>
            <div className="summary-card-value profit-negative">{formatCurrency(dashboardData.supplierDue)}</div>
            <div className="summary-card-hint">{t('dashboard.clickToViewList')}</div>
          </div>
        </div>

        <div 
          className="dashboard-summary-card clickable"
          onClick={() => navigate('/reports?tab=stock-low')}
        >
          <div className="summary-card-icon">⚠️</div>
          <div className="summary-card-content">
            <div className="summary-card-label">{t('dashboard.lowStockItems')}</div>
            <div className="summary-card-value">{dashboardData.lowStockCount}</div>
            <div className="summary-card-hint">{t('dashboard.clickToViewList')}</div>
          </div>
        </div>
      </div>

      {/* Quick Insights Section */}
      <div className="dashboard-insights">
        {/* Top Selling Items */}
        <div className="dashboard-section">
          <div className="card">
            <div className="card-header">
              <h2>{t('dashboard.topSellingItems')} ({t('dashboard.todaySale')})</h2>
            </div>
            <div className="card-content">
              {dashboardData.topSellingItems && dashboardData.topSellingItems.length > 0 ? (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>{t('common.name')}</th>
                      <th>{t('dashboard.quantitySold')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.topSellingItems.map((item) => (
                      <tr key={item.product_id}>
                        <td>{item.product_name}</td>
                        <td>{item.quantity_sold}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="empty-message">{t('dashboard.noSalesToday')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Bills */}
        <div className="dashboard-section">
          <div className="card">
            <div className="card-header">
              <h2>{t('dashboard.recentBills')} ({t('dashboard.todaySale')})</h2>
            </div>
            <div className="card-content">
              {dashboardData.recentBills && dashboardData.recentBills.length > 0 ? (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>{t('billing.invoiceNumber')}</th>
                      <th>{t('billing.customerName')}</th>
                      <th>{t('common.total')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentBills.map((bill) => (
                      <tr 
                        key={bill.sale_id}
                        className="clickable-row"
                        onClick={() => navigate(`/invoices`)}
                      >
                        <td>{bill.invoice_number}</td>
                        <td>{bill.customer_name}</td>
                        <td>{formatCurrency(bill.total_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="empty-message">{t('dashboard.noBillsToday')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
