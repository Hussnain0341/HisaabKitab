import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLicense } from '../contexts/LicenseContext';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isFeatureEnabled } = useLicense();

  const menuItems = [
    { id: 'dashboard', labelKey: 'menu.dashboard', path: '/', icon: '🏠' },
    { id: 'billing', labelKey: 'menu.billing', path: '/billing', icon: '🧾' },
    { id: 'products', labelKey: 'menu.products', path: '/inventory', icon: '📦' },
    { id: 'customers', labelKey: 'menu.customers', path: '/customers', icon: '👤' },
    { id: 'suppliers', labelKey: 'menu.suppliers', path: '/suppliers', icon: '👥' },
    { id: 'purchases', labelKey: 'menu.purchases', path: '/purchases', icon: '🛒' },
    { id: 'expenses', labelKey: 'menu.expenses', path: '/expenses', icon: '💰' },
    { id: 'rate-list', labelKey: 'menu.rateList', path: '/rate-list', icon: '📋' },
    { id: 'reports', labelKey: 'menu.reports', path: '/reports', icon: '📈', feature: 'reports' },
    { id: 'settings', labelKey: 'menu.settings', path: '/settings', icon: '⚙️' },
    { id: 'categories', labelKey: 'menu.categories', path: '/categories', icon: '🏷️' },
  ];

  // Filter menu items based on license features
  const visibleMenuItems = menuItems.filter(item => {
    if (item.feature) {
      return isFeatureEnabled(item.feature);
    }
    return true; // Show items without feature requirement
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

