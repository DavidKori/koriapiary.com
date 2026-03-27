// src/pages/settings/ProfileTab.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { updateUser } from '../../services/userService';
import PasswordModal from './PasswordModal';
import { FiSave, FiLock, FiCamera, FiUser, FiMail, FiPhone, FiInfo } from 'react-icons/fi';

const ProfileTab = () => {
  const { user, updateUser: updateAuthUser } = useAuth();
  const { showToast } = useToast();
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      const userId = user?._id || user?.id;
      if (!userId) throw new Error('User ID not found');
      
      const userIdString = userId.toString();
      
      const updateData = {
        name: profileForm.name.trim(),
        phone: profileForm.phone?.trim() || '',
        bio: profileForm.bio?.trim() || ''
      };
      
      const updatedUser = await updateUser(userIdString, updateData);
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

  return (
    <div className="settings-section">
      <h2>Profile Information</h2>
      <form onSubmit={handleProfileUpdate} className="profile-form">
        <div className="avatar-section">
          <div className="avatar-preview">
            <div className="avatar">
              {profileForm.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <button type="button" className="change-avatar-btn">
              <FiCamera />
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name">
            <FiUser className="input-icon" />
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={profileForm.name}
            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <FiMail className="input-icon" />
            Email Address
          </label>
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
          <label htmlFor="phone">
            <FiPhone className="input-icon" />
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={profileForm.phone}
            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">
            <FiInfo className="input-icon" />
            Bio
          </label>
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

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default ProfileTab;