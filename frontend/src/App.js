import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Billing from './components/Billing';
import Suppliers from './components/Suppliers';
import SupplierPayments from './components/SupplierPayments';
import Customers from './components/Customers';
import Categories from './components/Categories';
import Purchases from './components/Purchases';
import Expenses from './components/Expenses';
import RateList from './components/RateList';
import Invoices from './components/Invoices';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import ConnectionStatus from './components/ConnectionStatus';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [readOnlyMode, setReadOnlyMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    // Force re-fetch of data by updating key prop on components
    window.dispatchEvent(new Event('data-refresh'));
  };

  return (
    <Router>
      <div className="app">
        <ConnectionStatus 
          onRefresh={handleRefresh}
          readOnlyMode={readOnlyMode}
          setReadOnlyMode={setReadOnlyMode}
        />
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <main className="main-content">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard key={refreshTrigger} readOnly={readOnlyMode} />} />
              <Route path="/inventory" element={<Inventory key={refreshTrigger} readOnly={readOnlyMode} />} />
              <Route path="/billing" element={<Billing key={refreshTrigger} readOnly={readOnlyMode} />} />
              <Route path="/suppliers" element={<Suppliers key={refreshTrigger} readOnly={readOnlyMode} />} />
              <Route path="/supplier-payments" element={<SupplierPayments key={refreshTrigger} readOnly={readOnlyMode} />} />
              <Route path="/customers" element={<Customers key={refreshTrigger} readOnly={readOnlyMode} />} />
              <Route path="/categories" element={<Categories key={refreshTrigger} readOnly={readOnlyMode} />} />
              <Route path="/purchases" element={<Purchases key={refreshTrigger} readOnly={readOnlyMode} />} />
              <Route path="/expenses" element={<Expenses key={refreshTrigger} readOnly={readOnlyMode} />} />
              <Route path="/rate-list" element={<RateList key={readOnlyMode} />} />
              <Route path="/invoices" element={<Invoices key={refreshTrigger} readOnly={readOnlyMode} />} />
              <Route path="/reports" element={<Reports key={refreshTrigger} readOnly={readOnlyMode} />} />
              <Route path="/settings" element={<Settings key={refreshTrigger} readOnly={readOnlyMode} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </Router>
  );
}

export default App;

