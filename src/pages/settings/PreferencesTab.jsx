// src/pages/settings/PreferencesTab.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiSun, 
  FiMoon, 
  FiMonitor, 
  FiSave, 
  FiBell, 
  FiMail, 
  FiPhone, 
  FiTag, 
  FiShoppingBag,
  FiGlobe,
  FiDollarSign,
  FiCheck,
  FiAlertCircle,
  FiSettings,
  FiSmartphone,
  FiTrendingUp,
  FiHeart,
  FiStar,
  FiInfo,
  FiX
} from 'react-icons/fi';
import { MdNotifications, MdLanguage, MdCurrencyExchange, MdPalette, MdTranslate } from 'react-icons/md';
import { updatePreferences } from '../../services/userService';
import '../../styles/preferences.css';

const PreferencesTab = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    currency: 'KES',
    notifications: {
      email: true,
      sms: false,
      push: false,
      orderUpdates: true,
      promotions: false,
      priceAlerts: false,
      newsletter: false
    }
  });

  useEffect(() => {
    if (user?.preferences) {
      setPreferences(prev => ({
        ...prev,
        ...user.preferences,
        notifications: {
          ...prev.notifications,
          ...user.preferences.notifications
        }
      }));
    }
  }, [user]);

  const handleNotificationChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

const handleLanguageChange = async (e) => {
  const newLanguage = e.target.value;
  setPreferences(prev => ({
    ...prev,
    language: newLanguage
  }));
  
  // Apply Google Translate
  if (newLanguage !== 'en') {
    const success = await googleTranslateService.changeLanguage(newLanguage);
    if (success) {
      showToast(`Language changed to ${newLanguage.toUpperCase()}`, 'success');
    } else {
      showToast('Language change failed. Please refresh the page.', 'error');
    }
  } else {
    // Reset to English
    const success = await googleTranslateService.changeLanguage('en');
    if (success) {
      showToast('Language reset to English', 'success');
    }
  }
};

  const handleCurrencyChange = (e) => {
    // Only allow KES
    if (e.target.value === 'KES') {
      setPreferences(prev => ({
        ...prev,
        currency: e.target.value
      }));
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);
    
    try {
      const updatedUser = await updatePreferences(preferences);
      updateUser(updatedUser);
      setSuccess(true);
      showToast('Preferences saved successfully!', 'success');
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError(error.response?.data?.message || 'Failed to save preferences');
      showToast('Failed to save preferences', 'error');
    } finally {
      setSaving(false);
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧', native: 'English', direction: 'ltr' },
    { code: 'sw', name: 'Swahili', flag: '🇰🇪', native: 'Kiswahili', direction: 'ltr' },
    { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français', direction: 'ltr' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español', direction: 'ltr' },
    { code: 'de', name: 'German', flag: '🇩🇪', native: 'Deutsch', direction: 'ltr' },
    { code: 'it', name: 'Italian', flag: '🇮🇹', native: 'Italiano', direction: 'ltr' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹', native: 'Português', direction: 'ltr' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳', native: '中文', direction: 'ltr' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵', native: '日本語', direction: 'ltr' }
  ];

  const currencies = [
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', country: '🇰🇪', rate: 1 }
  ];

  const notificationCategories = [
    {
      title: 'Communication Channels',
      icon: FiBell,
      items: [
        { key: 'email', label: 'Email Notifications', icon: FiMail, description: 'Receive notifications via email' },
        { key: 'sms', label: 'SMS Notifications', icon: FiPhone, description: 'Get important updates via text message' },
        { key: 'push', label: 'Push Notifications', icon: FiSmartphone, description: 'Receive real-time alerts on your device' }
      ]
    },
    {
      title: 'What to Receive',
      icon: FiTag,
      items: [
        { key: 'orderUpdates', label: 'Order Updates', icon: FiShoppingBag, description: 'Order confirmation, shipping, and delivery status' },
                { key: 'promotions', label: 'Promotions & Offers', icon: FiTrendingUp, description: 'Exclusive deals, sales, and special offers' },
        { key: 'priceAlerts', label: 'Price Alerts', icon: FiHeart, description: 'Get notified when prices drop on favorite items' },
        { key: 'newsletter', label: 'Weekly Newsletter', icon: FiStar, description: 'Weekly digest of new arrivals and top picks' }
      ]
    }
  ];

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="modal-close" onClick={onClose}>
              <FiX />
            </button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="preferences-tab">
      <div className="tab-header">
        <h2>
          <FiSettings className="header-icon" />
          Preferences
        </h2>
        <p className="tab-description">
          Customize your shopping experience
        </p>
      </div>

      {success && (
        <div className="success-message">
          <FiCheck className="success-icon" />
          <span>Preferences saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="error-message">
          <FiAlertCircle className="error-icon" />
          <span>{error}</span>
        </div>
      )}

      <div className="preferences-grid">
        {/* Theme Section - Enhanced */}
        <div className="preference-card theme-card">
          <div className="card-header"
           onClick={() => setActiveModal('theme')}
           style={{'cursor':'pointer'}}>
            <MdPalette className="header-icon" />
            <h3>Theme</h3>
            <button 
              className="info-button"
             
            >
              <FiInfo />
            </button>
          </div>
          <div className="card-content">
            <div className="theme-options-enhanced">
              <button
                className={`theme-option-enhanced ${preferences.theme === 'light' ? 'active' : ''}`}
                onClick={() => {
                  setPreferences(prev => ({ ...prev, theme: 'light' }));
                  theme==="dark"?toggleTheme('light'):"";
                }}
              >
                <div className="theme-visual light">
                  <div className="theme-header"></div>
                  <div className="theme-body">
                    <div className="theme-card-demo"></div>
                    <div className="theme-text-demo"></div>
                  </div>
                </div>
                <div className="theme-info">
                  <span>Light Mode</span>
                  <p>Bright and clean interface</p>
                </div>
                {preferences.theme === 'light' && <FiCheck className="active-check" />}
              </button>
              
              <button
                className={`theme-option-enhanced ${preferences.theme === 'dark' ? 'active' : ''}`}
                onClick={() => {
                  setPreferences(prev => ({ ...prev, theme: 'dark' }));
                  theme==="light"?toggleTheme('dark'):"";

                }}
              >
                <div className="theme-visual dark">
                  <div className="theme-header"></div>
                  <div className="theme-body">
                    <div className="theme-card-demo"></div>
                    <div className="theme-text-demo"></div>
                  </div>
                </div>
                <div className="theme-info">
                  <span>Dark Mode</span>
                  <p>Easy on the eyes, great for night</p>
                </div>
                {preferences.theme === 'dark' && <FiCheck className="active-check" />}
              </button>
              
              <button
                className={`theme-option-enhanced ${preferences.theme === 'system' ? 'active' : ''}`}
                onClick={() => setPreferences(prev => ({ ...prev, theme: 'system' }))}
              >
                <div className="theme-visual system">
                  <div className="theme-header"></div>
                  <div className="theme-body">
                    <div className="theme-card-demo"></div>
                    <div className="theme-text-demo"></div>
                  </div>
                </div>
                <div className="theme-info">
                  <span>System Default</span>
                  <p>Follows your device settings</p>
                </div>
                {preferences.theme === 'system' && <FiCheck className="active-check" />}
              </button>
            </div>
          </div>
        </div>

        {/* Language & Currency Section with Google Translate Integration */}
        <div className="preference-card">
          <div className="card-header" 
            onClick={() => setActiveModal('language')}
            style={{'cursor':'pointer'}}>
            <MdLanguage className="header-icon" />
            <h3>Language & Region</h3>
            <button 
              className="info-button"
            >
              <FiInfo />
            </button>
          </div>
          <div className="card-content">
            <div className="form-group-enhanced">
              <label className="form-label">
                <FiGlobe className="label-icon" />
                <span>Select Language</span>
                <span className="label-badge">Google Translate </span>
              </label>
              <div className="language-selector">
                <select
                  value={preferences.language}
                  onChange={handleLanguageChange}
                  className="preference-select-enhanced"
                  disabled
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.native} ({lang.name})
                    </option>
                  ))}
                </select>
                <div className="google-translate-badge">
                  <MdTranslate className="translate-icon" />
                  <span>Powered by Google Translate</span>
                </div>
              </div>
              <p className="field-description">
                Supported language: English
              </p>
            </div>

            <div className="form-group-enhanced">
              <label className="form-label">
                <MdCurrencyExchange className="label-icon" />
                <span>Currency</span>
              </label>
              <select
                value={preferences.currency}
                onChange={handleCurrencyChange}
                className="preference-select-enhanced currency-select"
                disabled
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.country} {currency.name} ({currency.symbol})
                  </option>
                ))}
              </select>
              <p className="field-description">
                Currency is locked to KES 
              </p>
            </div>
          </div>
        </div>

        {/* Comprehensive Notifications Section */}
        <div className="preference-card notifications-card">
          <div className="card-header"
          onClick={() => setActiveModal('notifications')}
                         style={{'cursor':'pointer'}}>

            <MdNotifications className="header-icon" />
            <h3>Notifications</h3>
            <button 
              className="info-button"
              
            >
              <FiInfo />
            </button>
          </div>
          <div className="card-content">
            {notificationCategories.map((category, idx) => (
              <div key={idx} className="notification-category">
                <div className="category-header">
                  <category.icon className="category-icon" />
                  <span className="category-title">{category.title}</span>
                </div>
                <div className="notification-items">
                  {category.items.map((item) => (
                    <label key={item.key} className="notification-item">
                      <div className="notification-item-left">
                        <item.icon className="item-icon" />
                        <div className="item-info">
                          <span className="item-label">{item.label}</span>
                          <span className="item-description">{item.description}</span>
                        </div>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={preferences.notifications[item.key]}
                          onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                          id={`notif-${item.key}`}
                          
                        />
                        <label htmlFor={`notif-${item.key}`} className="toggle-label-custom">
                          <span className="toggle-track">
                            <span className="toggle-thumb"></span>
                          </span>
                        </label>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="save-section">
        <button 
          className={`btn-save-modern ${saving ? 'saving' : ''} ${success ? 'success' : ''}`}
          onClick={savePreferences}
          disabled={saving}
        >
          {saving ? (
            <>
              <div className="spinner"></div>
              Saving Changes...
            </>
          ) : success ? (
            <>
              <FiCheck /> Saved Successfully!
            </>
          ) : (
            <>
              <FiSave /> Save All Preferences
            </>
          )}
        </button>
      </div>

      {/* Modals */}
      <Modal isOpen={activeModal === 'theme'} onClose={() => setActiveModal(null)} title="About Theme">
        <p>Choose your preferred visual appearance for the application.</p>
        <ul>
          <li><strong>Light Mode:</strong> Bright interface with light backgrounds, perfect for daytime use.</li>
          <li><strong>Dark Mode:</strong> Dark interface that reduces eye strain in low-light conditions.</li>
          <li><strong>System Default:</strong> Automatically follows your device's theme settings.</li>
        </ul>
      </Modal>

      <Modal isOpen={activeModal === 'language'} onClose={() => setActiveModal(null)} title="About Language & Region">
        <p>Customize your language preferences and regional settings.</p>
        <ul>
          <li><strong>Language:</strong> We currently support English.</li>
          <li><strong>Currency:</strong> Currently locked to Kenyan Shilling (KES)</li>
        </ul>
        <p>Language changer coming soon...</p>
      </Modal>

      <Modal isOpen={activeModal === 'notifications'} onClose={() => setActiveModal(null)} title="About Notifications">
        <p>Control how and when you receive notifications.</p>
        <ul>
          <li><strong>Communication Channels:</strong> Choose your preferred delivery methods.</li>
          <li><strong>What to Receive:</strong> Select which types of notifications you want.</li>
        </ul>
        <p>You can change these settings at any time.</p>
      </Modal>
    </div>
  );
};

export default PreferencesTab;