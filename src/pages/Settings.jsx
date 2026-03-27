// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateUser, getUserById } from '../services/userService';
import { getMyOrders } from '../services/orderService';
import { getProductRatings, getUserRating } from '../services/ratingService';
import SEO from '../components/common/SEO';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import {
  FiUser,
  FiMail,
  FiLock,
  FiMapPin,
  FiCreditCard,
  FiPackage,
  FiStar,
  FiBell,
  FiShield,
  FiGlobe,
  FiMonitor,
  FiMoon,
  FiSun,
  FiLogOut,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiCheck,
  FiX,
  FiClock,
  FiTruck,
  FiDollarSign,
  FiHeart,
  FiShoppingBag,
  FiSettings,
  FiSave,
  FiCamera
} from 'react-icons/fi';
import { MdLocalShipping, MdPayment, MdVerified } from 'react-icons/md';
import '../styles/settings.css';

const Settings = () => {
  const { user, isAuthenticated, logout, updateUser: updateAuthUser } = useAuth();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [error, setError] = useState('');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Address form state
  const [addressForm, setAddressForm] = useState({
    name: '',
    address: '',
    city: '',
    county: '',
    postalCode: '',
    phone: '',
    isDefault: false
  });
  
  // Payment method form state
  const [paymentForm, setPaymentForm] = useState({
    type: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    isDefault: false
  });
  
  // User addresses (mock data - replace with API)
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Home',
      address: '123 Honey Lane',
      city: 'Nairobi',
      county: 'Nairobi',
      postalCode: '00100',
      phone: '0712345678',
      isDefault: true
    }
  ]);
  
  // Payment methods (mock data - replace with API)
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      last4: '4242',
      cardName: 'John Doe',
      expiryDate: '12/25',
      isDefault: true
    }
  ]);

  // Preferences
  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: {
      email: true,
      sms: false,
      promotions: true,
      orderUpdates: true
    },
    language: 'en',
    currency: 'KES'
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Load user profile
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
      
      // Load orders
      const ordersData = await getMyOrders();
      setOrders(ordersData || []);
      
      // Load user reviews
      if (user._id) {
        // You'll need to implement this API endpoint
        // const reviewsData = await getUserReviews(user._id);
        // setReviews(reviewsData || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      showToast('Failed to load user data', 'error');
    } finally {
      setLoading(false);
    }
  };

// In Settings.jsx, fix the handleProfileUpdate function
// In Settings.jsx, update the handleProfileUpdate function
const handleProfileUpdate = async (e) => {
  e.preventDefault();
  setSaving(true);
  setError('');
  
  try {
    // Get the correct user ID
    const userId = user?._id || user?.id;
    
    if (!userId) {
      throw new Error('User ID not found');
    }
    
    // Make sure userId is a string
    const userIdString = userId.toString();
    
    console.log('Updating profile for user ID:', userIdString);
    
    // Prepare only the fields we want to update
    const updateData = {
      name: profileForm.name.trim(),
      phone: profileForm.phone?.trim() || '',
      bio: profileForm.bio?.trim() || ''
    };
    
    console.log('Update data:', updateData);
    
    // Use the updateUser service function
    const updatedUser = await updateUser(userIdString, updateData);
    
    // Update the auth context with the new user data
    updateAuthUser(updatedUser);
    
    showToast('Profile updated successfully', 'success');
    
  } catch (error) {
    console.error('Error updating profile:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
    showToast(errorMessage, 'error');
    setError(errorMessage);
  } finally {
    setSaving(false);
  }
};

 // In Settings.jsx - Fix handlePasswordChange
const handlePasswordChange = async (e) => {
  e.preventDefault();
  setSaving(true);
  setError('');
  
  // Validate passwords
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    showToast('New passwords do not match', 'error');
    setSaving(false);
    return;
  }
  if (passwordForm.newPassword.length < 6) {
    showToast('Password must be at least 6 characters', 'error');
    setSaving(false);
    return;
  }
  if (!passwordForm.currentPassword) {
    showToast('Current password is required', 'error');
    setSaving(false);
    return;
  }
  
  try {
    // Call the update password API
    const response = await fetch(`http://localhost:5000/api/users/${user._id}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      showToast('Password changed successfully', 'success');
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      throw new Error(data.message || 'Failed to change password');
    }
  } catch (error) {
    console.error('Error changing password:', error);
    showToast(error.message || 'Failed to change password', 'error');
    setError(error.message);
  } finally {
    setSaving(false);
  }
};

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Implement add address API call
      const newAddress = {
        ...addressForm,
        id: Date.now()
      };
      setAddresses([...addresses, newAddress]);
      showToast('Address added successfully', 'success');
      setShowAddressModal(false);
      setAddressForm({
        name: '',
        address: '',
        city: '',
        county: '',
        postalCode: '',
        phone: '',
        isDefault: false
      });
    } catch (error) {
      console.error('Error adding address:', error);
      showToast('Failed to add address', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
      showToast('Address deleted', 'success');
    }
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    showToast('Default address updated', 'success');
  };

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const newPayment = {
        ...paymentForm,
        id: Date.now(),
        last4: paymentForm.cardNumber.slice(-4)
      };
      setPaymentMethods([...paymentMethods, newPayment]);
      showToast('Payment method added successfully', 'success');
      setShowPaymentModal(false);
      setPaymentForm({
        type: 'card',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        isDefault: false
      });
    } catch (error) {
      console.error('Error adding payment method:', error);
      showToast('Failed to add payment method', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePaymentMethod = (id) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
      showToast('Payment method deleted', 'success');
    }
  };

  const handleSetDefaultPayment = (id) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
    showToast('Default payment method updated', 'success');
  };

  const handlePreferenceChange = (category, field, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      // Implement save preferences API call
      showToast('Preferences saved', 'success');
    } catch (error) {
      console.error('Error saving preferences:', error);
      showToast('Failed to save preferences', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return <FiCheck className="status-icon delivered" />;
      case 'processing': return <FiTruck className="status-icon processing" />;
      case 'shipped': return <MdLocalShipping className="status-icon shipped" />;
      case 'pending': return <FiClock className="status-icon pending" />;
      case 'cancelled': return <FiX className="status-icon cancelled" />;
      default: return <FiPackage className="status-icon" />;
    }
  };

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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
    { id: 'addresses', label: 'Addresses', icon: <FiMapPin /> },
    { id: 'payments', label: 'Payments', icon: <FiCreditCard /> },
    { id: 'orders', label: 'Orders', icon: <FiPackage /> },
    { id: 'reviews', label: 'Reviews', icon: <FiStar /> },
    { id: 'preferences', label: 'Preferences', icon: <FiSettings /> },
    { id: 'security', label: 'Security', icon: <FiShield /> }
  ];

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
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="settings-section">
                <h2>Profile Information</h2>
                <form onSubmit={handleProfileUpdate} className="profile-form">
                  <div className="avatar-section">
                    <div className="avatar-preview">
                      <div className="avatar">
                        {profileForm.name?.charAt(0) || user?.email?.charAt(0)}
                      </div>
                      <button type="button" className="change-avatar-btn">
                        <FiCamera />
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={profileForm.email}
                      disabled
                      className="disabled-input"
                    />
                    <small>Email cannot be changed</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                      id="bio"
                      rows="4"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Tell us a little about yourself"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      <FiLock /> Change Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Addresses Settings */}
            {activeTab === 'addresses' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Shipping Addresses</h2>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowAddressModal(true)}
                  >
                    <FiPlus /> Add Address
                  </button>
                </div>

                <div className="addresses-list">
                  {addresses.map(address => (
                    <div key={address.id} className="address-card">
                      <div className="address-header">
                        <div className="address-name">
                          <FiMapPin />
                          <span>{address.name}</span>
                          {address.isDefault && <span className="default-badge">Default</span>}
                        </div>
                        <div className="address-actions">
                          <button
                            className="icon-btn edit"
                            onClick={() => {
                              setEditingAddress(address);
                              setAddressForm(address);
                              setShowAddressModal(true);
                            }}
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="icon-btn delete"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      <div className="address-details">
                        <p>{address.address}</p>
                        <p>{address.city}, {address.county}</p>
                        <p>Postal Code: {address.postalCode}</p>
                        <p>Phone: {address.phone}</p>
                      </div>
                      {!address.isDefault && (
                        <button
                          className="set-default-btn"
                          onClick={() => handleSetDefaultAddress(address.id)}
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {addresses.length === 0 && (
                  <div className="empty-state">
                    <FiMapPin className="empty-icon" />
                    <p>No addresses added yet</p>
                    <button className="btn btn-primary" onClick={() => setShowAddressModal(true)}>
                      Add Your First Address
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Payment Methods */}
            {activeTab === 'payments' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Payment Methods</h2>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <FiPlus /> Add Payment Method
                  </button>
                </div>

                <div className="payment-methods-list">
                  {paymentMethods.map(method => (
                    <div key={method.id} className="payment-card">
                      <div className="payment-header">
                        <div className="payment-info">
                          <FiCreditCard className="payment-icon" />
                          <div>
                            <div className="payment-type">
                              {method.type === 'card' ? 'Credit/Debit Card' : 'Mobile Money'}
                            </div>
                            <div className="payment-details">
                              •••• {method.last4} | Expires {method.expiryDate}
                            </div>
                            <div className="cardholder-name">{method.cardName}</div>
                          </div>
                        </div>
                        <div className="payment-actions">
                          {method.isDefault && <span className="default-badge">Default</span>}
                          <button
                            className="icon-btn delete"
                            onClick={() => handleDeletePaymentMethod(method.id)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      {!method.isDefault && (
                        <button
                          className="set-default-btn"
                          onClick={() => handleSetDefaultPayment(method.id)}
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {paymentMethods.length === 0 && (
                  <div className="empty-state">
                    <FiCreditCard className="empty-icon" />
                    <p>No payment methods added yet</p>
                    <button className="btn btn-primary" onClick={() => setShowPaymentModal(true)}>
                      Add Payment Method
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Order History */}
            {activeTab === 'orders' && (
              <div className="settings-section">
                <h2>Order History</h2>
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <span className="order-number">#{order._id.slice(-8)}</span>
                          <span className="order-date">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className={`order-status ${order.orderStatus}`}>
                          {getStatusIcon(order.orderStatus)}
                          <span>{order.orderStatus}</span>
                        </div>
                      </div>
                      <div className="order-items-preview">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="order-item-preview">
                            <img src={item.product?.images?.[0]?.url} alt={item.name} />
                            <div className="item-info">
                              <span className="item-name">{item.name}</span>
                              <span className="item-quantity">x{item.quantity}</span>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="more-items">+{order.items.length - 2} more</div>
                        )}
                      </div>
                      <div className="order-footer">
                        <div className="order-total">
                          <span>Total:</span>
                          <strong>KES {order.totalPrice?.toLocaleString()}</strong>
                        </div>
                        <Link to={`/orders/${order._id}`} className="view-order-btn">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {orders.length === 0 && (
                  <div className="empty-state">
                    <FiPackage className="empty-icon" />
                    <p>No orders yet</p>
                    <Link to="/products" className="btn btn-primary">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <div className="settings-section">
                <h2>My Reviews</h2>
                <div className="reviews-list">
                  {reviews.map(review => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <div className="product-info">
                          <img src={review.product?.images?.[0]?.url} alt={review.product?.name} />
                          <div>
                            <h4>{review.product?.name}</h4>
                            <div className="review-rating">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={i < review.rating ? 'star-filled' : 'star-empty'}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="review-date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="review-content">{review.review}</p>
                      <button className="edit-review-btn">
                        <FiEdit2 /> Edit Review
                      </button>
                    </div>
                  ))}
                </div>

                {reviews.length === 0 && (
                  <div className="empty-state">
                    <FiStar className="empty-icon" />
                    <p>You haven't written any reviews yet</p>
                    <Link to="/products" className="btn btn-primary">
                      Shop and Review
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <div className="settings-section">
                <h2>Preferences</h2>
                
                <div className="preference-group">
                  <h3>Theme</h3>
                  <div className="theme-options">
                    <button
                      className={`theme-option ${preferences.theme === 'light' ? 'active' : ''}`}
                      onClick={() => handlePreferenceChange('theme', 'theme', 'light')}
                    >
                      <FiSun /> Light
                    </button>
                    <button
                      className={`theme-option ${preferences.theme === 'dark' ? 'active' : ''}`}
                      onClick={() => handlePreferenceChange('theme', 'theme', 'dark')}
                    >
                      <FiMoon /> Dark
                    </button>
                    <button
                      className={`theme-option ${preferences.theme === 'system' ? 'active' : ''}`}
                      onClick={() => handlePreferenceChange('theme', 'theme', 'system')}
                    >
                      <FiMonitor /> System
                    </button>
                  </div>
                </div>

                <div className="preference-group">
                  <h3>Notifications</h3>
                  <div className="notification-options">
                    <label className="toggle-option">
                      <input
                        type="checkbox"
                        checked={preferences.notifications.email}
                        onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                      />
                      <span>Email Notifications</span>
                    </label>
                    <label className="toggle-option">
                      <input
                        type="checkbox"
                        checked={preferences.notifications.sms}
                        onChange={(e) => handlePreferenceChange('notifications', 'sms', e.target.checked)}
                      />
                      <span>SMS Notifications</span>
                    </label>
                    <label className="toggle-option">
                      <input
                        type="checkbox"
                        checked={preferences.notifications.promotions}
                        onChange={(e) => handlePreferenceChange('notifications', 'promotions', e.target.checked)}
                      />
                      <span>Promotions & Offers</span>
                    </label>
                    <label className="toggle-option">
                      <input
                        type="checkbox"
                        checked={preferences.notifications.orderUpdates}
                        onChange={(e) => handlePreferenceChange('notifications', 'orderUpdates', e.target.checked)}
                      />
                      <span>Order Updates</span>
                    </label>
                  </div>
                </div>

                <div className="preference-group">
                  <h3>Language & Region</h3>
                  <div className="form-group">
                    <label>Language</label>
                    <select
                      value={preferences.language}
                      onChange={(e) => handlePreferenceChange('language', 'language', e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="sw">Swahili</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Currency</label>
                    <select
                      value={preferences.currency}
                      onChange={(e) => handlePreferenceChange('currency', 'currency', e.target.value)}
                    >
                      <option value="KES">Kenyan Shilling (KES)</option>
                      <option value="USD">US Dollar (USD)</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button className="btn btn-primary" onClick={savePreferences} disabled={saving}>
                    <FiSave /> {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="settings-section">
                <h2>Security Settings</h2>
                
                <div className="security-group">
                  <div className="security-item">
                    <div className="security-info">
                      <FiLock className="security-icon" />
                      <div>
                        <h3>Password</h3>
                        <p>Last changed 3 months ago</p>
                      </div>
                    </div>
                    <button className="btn btn-secondary" onClick={() => setShowPasswordModal(true)}>
                      Change Password
                    </button>
                  </div>

                  <div className="security-item">
                    <div className="security-info">
                      <FiMail className="security-icon" />
                      <div>
                        <h3>Email Address</h3>
                        <p>{user?.email}</p>
                      </div>
                    </div>
                    <button className="btn btn-secondary" disabled>
                      Cannot Change
                    </button>
                  </div>

                  <div className="security-item">
                    <div className="security-info">
                      <FiShield className="security-icon" />
                      <div>
                        <h3>Two-Factor Authentication</h3>
                        <p>Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <button className="btn btn-primary">Enable 2FA</button>
                  </div>

                  <div className="security-item">
                    <div className="security-info">
                      <FiBell className="security-icon" />
                      <div>
                        <h3>Login Alerts</h3>
                        <p>Get notified when someone logs into your account</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="security-item danger">
                    <div className="security-info">
                      <FiTrash2 className="security-icon" />
                      <div>
                        <h3>Delete Account</h3>
                        <p>Permanently delete your account and all data</p>
                      </div>
                    </div>
                    <button className="btn btn-danger">Delete Account</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        size="medium"
      >
        <form onSubmit={handlePasswordChange} className="password-form">
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Address Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
        size="medium"
      >
        <form onSubmit={handleAddAddress} className="address-form">
          <div className="form-group">
            <label>Address Name (e.g., Home, Office)</label>
            <input
              type="text"
              value={addressForm.name}
              onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              value={addressForm.address}
              onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>County</label>
              <input
                type="text"
                value={addressForm.county}
                onChange={(e) => setAddressForm({ ...addressForm, county: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                value={addressForm.postalCode}
                onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                required
              />
            </div>
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
            />
            <span>Set as default address</span>
          </label>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowAddressModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : (editingAddress ? 'Update' : 'Add')} Address
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Payment Method Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title={editingPayment ? 'Edit Payment Method' : 'Add Payment Method'}
        size="medium"
      >
        <form onSubmit={handleAddPaymentMethod} className="payment-form">
          <div className="form-group">
            <label>Payment Type</label>
            <select
              value={paymentForm.type}
              onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}
            >
              <option value="card">Credit/Debit Card</option>
              <option value="mpesa">M-Pesa</option>
            </select>
          </div>
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              value={paymentForm.cardNumber}
              onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              required
            />
          </div>
          <div className="form-group">
            <label>Cardholder Name</label>
            <input
              type="text"
              value={paymentForm.cardName}
              onChange={(e) => setPaymentForm({ ...paymentForm, cardName: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="text"
                value={paymentForm.expiryDate}
                onChange={(e) => setPaymentForm({ ...paymentForm, expiryDate: e.target.value })}
                placeholder="MM/YY"
                maxLength="5"
                required
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="password"
                value={paymentForm.cvv}
                onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                placeholder="123"
                maxLength="4"
                required
              />
            </div>
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={paymentForm.isDefault}
              onChange={(e) => setPaymentForm({ ...paymentForm, isDefault: e.target.checked })}
            />
            <span>Set as default payment method</span>
          </label>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : (editingPayment ? 'Update' : 'Add')} Payment Method
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Settings;