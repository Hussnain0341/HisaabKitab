import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLicense } from '../contexts/LicenseContext';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isFeatureEnabled } = useLicense();
  const { user, isAdmin } = useAuth();

  const menuItems = [
    { id: 'dashboard', labelKey: 'menu.dashboard', path: '/', icon: '🏠' },
    { id: 'billing', labelKey: 'menu.billing', path: '/billing', icon: '🧾' },
    { id: 'sales', labelKey: 'menu.sales', path: '/sales', icon: '💰' },
    { id: 'products', labelKey: 'menu.products', path: '/inventory', icon: '📦' },
    { id: 'customers', labelKey: 'menu.customers', path: '/customers', icon: '👤' },
    { id: 'suppliers', labelKey: 'menu.suppliers', path: '/suppliers', icon: '👥', adminOnly: true },
    { id: 'purchases', labelKey: 'menu.purchases', path: '/purchases', icon: '🛒', adminOnly: true },
    { id: 'expenses', labelKey: 'menu.expenses', path: '/expenses', icon: '💰', adminOnly: true },
    { id: 'rate-list', labelKey: 'menu.rateList', path: '/rate-list', icon: '📋' },
    { id: 'reports', labelKey: 'menu.reports', path: '/reports', icon: '📈', feature: 'reports', adminOnly: true },
    { id: 'users', labelKey: 'menu.users', path: '/users', icon: '👤', adminOnly: true },
    { id: 'settings', labelKey: 'menu.settings', path: '/settings', icon: '⚙️' },
    { id: 'categories', labelKey: 'menu.categories', path: '/categories', icon: '🏷️', adminOnly: true },
  ];

  // Filter menu items based on license features and user role
  const visibleMenuItems = menuItems.filter(item => {
    // Check license feature
    if (item.feature && !isFeatureEnabled(item.feature)) {
      return false;
    }
    // Check admin-only restriction
    if (item.adminOnly && !isAdmin()) {
      return false;
    }
    return true;
  });

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="app-title">{t('app.name')}</h1>
        <p className="app-subtitle">{t('app.subtitle')}</p>
      </div>
      <nav className="sidebar-nav">
        <ul className="menu-list">
          {visibleMenuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                data-navigation="true"
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{t(item.labelKey)}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <p className="app-version">{t('app.version')}</p>
        <p className="app-status">{t('app.offlineMode')}</p>
      </div>
    </aside>
  );
};

export default Sidebar;

