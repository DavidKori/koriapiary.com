// src/pages/AdminDeleteConfirm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FiShield, FiMail, FiSend, FiClock, FiAlertCircle, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { deleteMyAccount, sendDeleteConfirmationCode, verifyDeleteCode } from '../services/userService';
import '../styles/auth.css';

const AdminDeleteConfirm = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
    const hasRun = useRef(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    } else {
      navigate('/settings');
    }
  }, [user, navigate]);

useEffect(() => {
  if (!user?.email || hasRun.current) return; // prevent double run
  hasRun.current = true;

  // Send initial verification code when page loads
  const sendInitialCode = async () => {
    if (user?.email) {
      try {
        await sendDeleteConfirmationCode(user.email);
        setCountdown(60);
        showToast('Verification code sent to your email', 'info');
      } catch (error) {
        console.error('Failed to send code:', error);
        setError(
          error.response?.data?.message ||
          'Failed to send verification code. Please try again.'
        );
      }
    }
  };

  sendInitialCode();
}, [user]);
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyAndDelete = async (e) => {
    e.preventDefault();
    
    if (!code || code.length !== 8) {
      setError('Please enter a valid 8-digit verification code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Verify the code
      const verifyResult = await verifyDeleteCode(user.email, code);
      
      if (verifyResult.success) {
        // Delete account using /account endpoint
        const deleteResult = await deleteMyAccount();
        if (deleteResult.navigate === "/") {
            showToast('Cant delete this account', 'success');
            navigate("/")
        }
        if (deleteResult.success || deleteResult.message ==='Cannot delete the last admin account') {
          showToast('Account deleted successfully', 'success');
          await logout();
          navigate('/');
        } else {
          setError(deleteResult.message || 'Failed to delete account');
        }
      } else {
        setError(verifyResult.message || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Delete verification error:', error);
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setResendLoading(true);
    setError('');
    
    try {
      await sendDeleteConfirmationCode(user.email);
      setCountdown(60);
      showToast('New verification code sent to your email', 'success');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button onClick={() => navigate('/settings')} className="back-to-settings">
          <FiArrowLeft /> Back to Settings
        </button>
        
        <div className="auth-header">
          <FiShield className="auth-logo" style={{ fontSize: '3rem', color: '#e74c3c' }} />
          <h1 className="auth-title">Delete Admin Account</h1>
          <p className="auth-subtitle">
            This action is permanent and cannot be undone
          </p>
        </div>

        <div className="warning-box">
          <FiAlertCircle />
          <div>
            <strong>Warning:</strong>
            <p>Deleting your admin account will remove all your data and access to the admin panel.</p>
          </div>
        </div>

        <form onSubmit={handleVerifyAndDelete} className="auth-form">
          <div className="form-group">
            <label htmlFor="code">
              <FiMail className="input-icon" />
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              maxLength="8"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter 8-character code"
              className={error ? 'error' : ''}
              autoFocus
              disabled={loading}
            />
            <div className="code-hint">
              <FiClock />
              <span>Code sent to {email}</span>
            </div>
            <div className="code-format-hint">
              <span>Format: 8 characters including letters, numbers, and symbols (e.g., A3!xK9@M)</span>
            </div>
          </div>
          
          {error && (
            <div className="auth-error">
              <FiAlertCircle className="error-icon" />
              <span>{error}</span>
            </div>
          )}
          
          <button 
            type="submit" 
            className={`btn btn-danger btn-block ${loading ? 'loading' : ''}`}
            disabled={loading || code.length !== 8}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Verifying & Deleting...
              </>
            ) : (
              <>
                <FiTrash2 /> Verify & Delete Account
              </>
            )}
          </button>
        </form>
        
        <div className="resend-section">
          <p className="resend-text">Didn't receive the code?</p>
          <button
            onClick={handleResendCode}
            disabled={resendLoading || countdown > 0}
            className="resend-btn-link"
          >
            {resendLoading ? (
              <>
                <span className="spinner-small"></span>
                Sending...
              </>
            ) : countdown > 0 ? (
              <>
                <FiClock />
                Resend in {countdown}s
              </>
            ) : (
              <>
                <FiSend />
                Resend Code
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDeleteConfirm;