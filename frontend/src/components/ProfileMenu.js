import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './ProfileMenu.css';

const ProfileMenu = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    if (window.confirm(t('auth.confirmLogout'))) {
      await onLogout();
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleProfileSettings = () => {
    setIsOpen(false);
    navigate('/settings');
  };

  return (
    <div className="profile-menu-container" ref={dropdownRef}>
      <button 
        className="profile-avatar-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Profile Menu"
      >
        <div className="profile-avatar">
          {getInitials(user?.name || user?.username || 'U')}
        </div>
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-info">
            <div className="profile-avatar-large">
              {getInitials(user?.name || user?.username || 'U')}
            </div>
            <div className="profile-details">
              <h4 className="profile-name">{user?.name || user?.username || 'User'}</h4>
              <p className="profile-role">
                {user?.role === 'administrator' ? t('auth.admin') : t('auth.cashier')}
              </p>
            </div>
          </div>

          <div className="profile-menu-divider"></div>

          <div className="profile-menu-items">
            <button 
              className="profile-menu-item"
              onClick={handleProfileSettings}
            >
              <span className="menu-item-icon">⚙️</span>
              <span>{t('header.profileSettings')}</span>
            </button>

            <button 
              className="profile-menu-item logout-item"
              onClick={handleLogout}
            >
              <span className="menu-item-icon">🚪</span>
              <span>{t('auth.logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;

