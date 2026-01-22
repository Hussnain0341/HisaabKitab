import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/', icon: '🏠' },
    { id: 'billing', label: 'Billing', path: '/billing', icon: '🧾' },
    { id: 'products', label: 'Products', path: '/inventory', icon: '📦' },
    { id: 'customers', label: 'Customers', path: '/customers', icon: '👤' },
    { id: 'suppliers', label: 'Suppliers', path: '/suppliers', icon: '👥' },
    { id: 'purchases', label: 'Purchases', path: '/purchases', icon: '🛒' },
    { id: 'expenses', label: 'Expenses', path: '/expenses', icon: '💰' },
    { id: 'rate-list', label: 'Rate List', path: '/rate-list', icon: '📋' },
    { id: 'reports', label: 'Reports', path: '/reports', icon: '📈' },
    { id: 'settings', label: 'Settings', path: '/settings', icon: '⚙️' },
    { id: 'categories', label: 'Product Categories', path: '/categories', icon: '🏷️' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="app-title">HisaabKitab</h1>
        <p className="app-subtitle">POS & Inventory</p>
      </div>
      <nav className="sidebar-nav">
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <p className="app-version">Version 1.0.0</p>
        <p className="app-status">● Offline Mode</p>
      </div>
    </aside>
  );
};

export default Sidebar;

