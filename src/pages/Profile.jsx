// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SEO from '../components/common/SEO';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { updateMyProfile, uploadAvatar } from '../services/userService';
import { getMyOrders, cancelOrder } from '../services/orderService';
import { getUserRatings } from '../services/ratingService';
import { getWishlist } from '../services/wishlistService';

import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiEdit2,
  FiSave,
  FiX,
  FiCamera,
  FiMapPin,
  FiCreditCard,
  FiBell,
  FiGlobe,
  FiMoon,
  FiSun,
  FiMonitor,
  FiDollarSign,
  FiCheck,
  FiAlertCircle,
  FiShoppingCart,
  FiShield,
  FiClock,
  FiUserCheck,
  FiPackage,
  FiHeart,
  FiShoppingBag,
  FiTrendingUp,
  FiStar
} from 'react-icons/fi';
import '../styles/profile.css';

const Profile = () => {
  const [wishlist, setWishlist] = useState({ totalItems: 0 });
  
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState(0)
  const { user, updateUser,isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    emailVerified:""
  });
  console.log(formData.emailVerified)
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      loadReviews();;
      fetchWishlist();
    }
  }, [isAuthenticated]);
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        emailVerified: user.emailVerified || ""
      });
    }
  }, [user]);
  
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        showToast('Failed to fetch orders', 'error');
      } finally {
        setLoading(false);
      }
    };

    const loadReviews = async () => {
        setLoading(true);
        try {
          // Fetch user's ratings from the API
          const data = await getUserRatings();
          const userReviews = data || [];
          setReviews(userReviews.length);
          
        } catch (error) {
          console.error('Error loading reviews:', error);
          showToast('Failed to load your reviews', 'error');
        } finally {
          setLoading(false);
        }
      };

    const fetchWishlist = async () => {
          setLoading(true);
          try {
            const data = await getWishlist();
            setWishlist({
              totalItems: data.totalItems || 0
            });
          } catch (error) {
            console.error('Error fetching wishlist:', error);
            showToast('Failed to fetch wishlist', 'error');
          } finally {
            setLoading(false);
          }
        };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const updatedUser = await updateMyProfile(formData);
      updateUser(updatedUser);
      showToast('Profile updated successfully', 'success');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size should be less than 2MB', 'error');
        return;
      }
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setShowAvatarModal(true);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      const updatedUser = await uploadAvatar(formData);
      updateUser(updatedUser);
      showToast('Avatar updated successfully', 'success');
      setShowAvatarModal(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showToast(error.response?.data?.message || 'Failed to upload avatar', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Stats (you can fetch these from API)
  const stats = {
    order: orders.length,
    wishlist: wishlist.totalItems,
    reviews: reviews,
    totalSpent: 12450
  };

  return (
    <>
      <SEO title="My Profile - Apiary Honey" />
      
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account information and preferences</p>
        </div>

        <div className="profile-grid">
          {/* Profile Card */}
          <div className="profile-card profile-info-card">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt={user.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {getInitials(user?.name)}
                  </div>
                )}
                <button 
                  className="avatar-edit-btn"
                  // onClick={() => document.getElementById('avatar-input').click()}
                >
                  <FiCamera />
                </button>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="profile-name">
                <h2>{user?.name || 'User'}</h2>
                <span className={`user-role ${user?.role}`}>
                  {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                </span>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <FiMail className="detail-icon" />
                <div>
                  <label>Email Address</label>
                  <p>{user?.email}</p>
                  {user?.emailVerified && (
                    <span className="verified-badge">
                      <FiCheck /> Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="detail-item">
                <FiPhone className="detail-icon" />
                <div>
                  <label>Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="edit-input"
                    />
                  ) : (
                    <p>{user?.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="detail-item">
                <FiCalendar className="detail-icon" />
                <div>
                  <label>Member Since</label>
                  <p>{formatDate(user?.createdAt)}</p>
                </div>
              </div>

              <div className="detail-item">
                <FiClock className="detail-icon" />
                <div>
                  <label>Last Login</label>
                  <p>{formatDate(user?.lastLogin)}</p>
                </div>
              </div>

              <div className="detail-item bio-section">
                <FiUser className="detail-icon" />
                <div>
                  <label>Bio</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                      rows="3"
                      className="edit-textarea"
                      maxLength="500"
                    />
                  ) : (
                    <p>{user?.bio || 'No bio added yet'}</p>
                  )}
                </div>
              </div>
            </div>

            {isEditing ? (
              <div className="profile-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      phone: user?.phone || '',
                      bio: user?.bio || ''
                    });
                  }}
                  disabled={loading}
                >
                  <FiX /> Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpdateProfile}
                  disabled={loading}
                >
                  <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <button
                className="btn btn-outline edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                <FiEdit2 /> Edit Profile
              </button>
            )}
          </div>

          {/* Stats Card */}
          <div className="profile-card stats-card">
            <h3>Account Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <FiPackage className="stat-icon" />
                <div>
                  <span className="stat-value">{stats.order}</span>
                  <span className="stat-label">Total Orders</span>
                </div>
              </div>
              <div className="stat-item">
                <FiHeart className="stat-icon" />
                <div>
                  <span className="stat-value">{stats.wishlist}</span>
                  <span className="stat-label">Wishlist Items</span>
                </div>
              </div>
              <div className="stat-item">
                <FiStar className="stat-icon" />
                <div>
                  <span className="stat-value">{stats.reviews}</span>
                  <span className="stat-label">Reviews</span>
                </div>
              </div>
              {/* <div className="stat-item">
                <FiTrendingUp className="stat-icon" />
                <div>
                  <span className="stat-value">KES {stats.totalSpent.toLocaleString()}</span>
                  <span className="stat-label">Total Spent</span>
                </div>
              </div> */}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="profile-card quick-actions-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => window.location.href = '/orders'}>
                <FiShoppingBag /> View Orders
              </button>
              <button className="quick-action-btn" onClick={() => window.location.href = '/wishlist'}>
                <FiHeart /> View Wishlist
              </button>
              <button className="quick-action-btn" onClick={() => window.location.href = '/settings'}>
                <FiShield /> Account Settings
              </button>
              <button className="quick-action-btn" onClick={() => window.location.href = '/cart'}>
                <FiShoppingCart /> Manage Cart
              </button>
            </div>
          </div>

          {/* Account Security Card */}
          <div className="profile-card security-card">
            <h3>Account Security</h3>
            <div className="security-items">
              <div className="security-item">
                <FiShield className="security-icon" />
                <div>
                  <label>Email Verification</label>
                  <p>
                    {formData.emailVerified ? (
                      <span className="verified"><FiCheck /> Verified</span>
                    ) : (
                      <span className="unverified"><FiAlertCircle /> Not Verified</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="security-item">
                <FiUserCheck className="security-icon" />
                <div>
                  <label>Account Status</label>
                  <p>
                    {user?.isActive ? (
                      <span className="active">Active</span>
                    ) : (
                      <span className="inactive">Inactive</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="security-item">
                <FiClock className="security-icon" />
                <div>
                  <label>Account Created</label>
                  <p>{formatDate(user?.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      <ConfirmationModal
        isOpen={showAvatarModal}
        onClose={() => {
          setShowAvatarModal(false);
          setAvatarFile(null);
          setAvatarPreview(null);
        }}
        onConfirm={handleUploadAvatar}
        title="Update Profile Picture"
        message={
          <div className="avatar-modal-content">
            <p>Do you want to update your profile picture?</p>
            {avatarPreview && (
              <div className="avatar-preview">
                <img src={avatarPreview} alt="Preview" />
              </div>
            )}
          </div>
        }
        confirmText="Upload"
        cancelText="Cancel"
        type="info"
        loading={loading}
      />
    </>
  );
};

export default Profile;