import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { settingsAPI } from '../services/api';
import Notifications from './Notifications';
import ProfileMenu from './ProfileMenu';
import './Header.css';

const Header = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState('HisaabKitab');
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStoreName = async () => {
      try {
        const response = await settingsAPI.get();
        const data = response.data;
        
        // Try to get shop name from settings
        if (data && data.other_app_settings) {
          const otherSettings = typeof data.other_app_settings === 'string' 
            ? JSON.parse(data.other_app_settings) 
            : data.other_app_settings;
          
          if (otherSettings?.businessInfo?.shopName) {
            setStoreName(otherSettings.businessInfo.shopName);
          } else if (data.shop_name) {
            setStoreName(data.shop_name);
          }
        } else if (data?.shop_name) {
          setStoreName(data.shop_name);
        }
      } catch (error) {
        console.error('[Header] Error fetching store name:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStoreName();
    }
  }, [user]);

  // Format time
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    const displaySeconds = seconds.toString().padStart(2, '0');
    
    return `${displayHours}:${displayMinutes}:${displaySeconds} ${ampm}`;
  };

  // Format date
  const formatDate = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dayOfMonth = date.getDate();
    const year = date.getFullYear();
    
    return `${day}, ${month} ${dayOfMonth}, ${year}`;
  };

  if (!user) {
    return null;
  }

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="store-name">{storeName || 'HisaabKitab'}</h1>
      </div>
      
      <div className="header-right">
        <div className="header-time">
          <div className="time-display">{formatTime(currentTime)}</div>
          <div className="date-display">{formatDate(currentTime)}</div>
        </div>
        <Notifications />
        <ProfileMenu user={user} onLogout={logout} />
      </div>
    </header>
  );
};

export default Header;

