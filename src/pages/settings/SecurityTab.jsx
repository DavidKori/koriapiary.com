// src/pages/settings/SecurityTab.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import PasswordModal from './PasswordModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { deleteMyAccount } from '../../services/userService';
import { FiLock, FiMail, FiShield, FiBell, FiTrash2 } from 'react-icons/fi';

const SecurityTab = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDeleteAccount = () => {
    if (user.role === 'admin') {
    // Admin: Navigate to delete confirmation page with code verification
    setShowDeleteModal(false);
    navigate('/admin-delete-confirm');
  }
    setShowDeleteModal(true);

  };
 // - Update confirmDeleteAccount function
const confirmDeleteAccount = async () => {
  console.log(user.role)
  if (user.role === 'admin') {
    // Admin: Navigate to delete confirmation page with code verification
    setShowDeleteModal(false);
  } else {
    // Customer: Direct delete with confirmation
    if (confirmText.toLocaleUpperCase() !== 'DELETE') {
      showToast('Please type DELETE to confirm', 'error');
      return;
    }
    
    setDeleteLoading(true);
    try {
      const result = await deleteMyAccount(); // Remove the id parameter
      if (result.success) {
        showToast('Account deleted successfully', 'success');
        await logout();
        navigate('/');
      } else {
        showToast(result.message || 'Failed to delete account', 'error');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      showToast(error.response?.data?.message || 'Failed to delete account', 'error');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setConfirmText('');
    }
  }
};

  return (
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
          <button className="btn btn-secondary" title="Cannot Change Email Once Created" disabled>
            Change Email
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
          <button className="btn btn-primary" title="Turned on by default" disabled>Enable 2FA</button>
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
            <input type="checkbox"  defaultChecked disabled/>
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
          <button className="btn btn-danger" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      {/* Customer Delete Confirmation Modal */}
      {user?.role !== 'admin' && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setConfirmText('');
          }}
          onConfirm={confirmDeleteAccount}
          title="Delete Account"
          message="Are you absolutely sure? This action cannot be undone. All your data will be permanently removed."
          confirmText="Delete Account"
          cancelText="Cancel"
          type="danger"
          showInput={true}
          inputPlaceholder='Type "DELETE" to confirm'
          inputValue={confirmText}
          onInputChange={setConfirmText}
          loading={deleteLoading}
        />
      )}
      
      {/* Admin delete will navigate to separate page */}
    </div>
  );
};

export default SecurityTab;