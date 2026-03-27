// src/pages/settings/index.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import SEO from '../../components/common/SEO';
import Loader from '../../components/common/Loader';
import ProfileTab from './ProfileTab';
import AddressesTab from './AddressesTab';
import PaymentsTab from './PaymentsTab';
import OrdersTab from './OrdersTab';
import ReviewsTab from './ReviewsTab';
import PreferencesTab from './PreferencesTab';
import SecurityTab from './SecurityTab';
import {
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiPackage,
  FiStar,
  FiSettings,
  FiShield,
  FiLogOut
} from 'react-icons/fi';
import '../../styles/settings.css';

const Settings = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
    { id: 'addresses', label: 'Addresses', icon: <FiMapPin /> },
    { id: 'payments', label: 'Payments', icon: <FiCreditCard /> },
    { id: 'orders', label: 'Orders', icon: <FiPackage /> },
    { id: 'reviews', label: 'Reviews', icon: <FiStar /> },
    { id: 'preferences', label: 'Preferences', icon: <FiSettings /> },
    { id: 'security', label: 'Security', icon: <FiShield /> }
  ];

  if (!isAuthenticated) {
    return (
      <div className="settings-page">
        <div className="auth-required">
          <FiShield className="auth-icon" />
          <h2>Authentication Required</h2>
          <p>Please log in to access your settings</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader size="large" text="Loading your settings..." />;
  }

  return (
    <>
      <SEO title="Settings" description="Manage your account settings" />
      
      <div className="settings-page">
        <div className="settings-header">
          <h1 className="settings-title">
            <FiSettings className="title-icon" />
            Account Settings
          </h1>
          <p className="settings-description">
            Manage your profile, addresses, payments and preferences
          </p>
        </div>

        <div className="settings-container">
          <div className="settings-sidebar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
            <button className="settings-tab logout" onClick={logout}>
              <FiLogOut className="tab-icon" />
              <span className="tab-label">Logout</span>
            </button>
          </div>

          <div className="settings-content">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'addresses' && <AddressesTab />}
            {activeTab === 'payments' && <PaymentsTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'reviews' && <ReviewsTab />}
            {activeTab === 'preferences' && <PreferencesTab />}
            {activeTab === 'security' && <SecurityTab />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;