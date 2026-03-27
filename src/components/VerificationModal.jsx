// src/components/VerificationModal.jsx
import React, { useState, useEffect } from 'react';
import { FiMail, FiCheck, FiSend, FiAlertCircle, FiClock, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './VerificationModal.css';

const VerificationModal = ({ isOpen, onClose, email, onSuccess }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const { verifyEmail, resendVerificationCode } = useAuth();

  useEffect(() => {
    if (isOpen && email) {
      setCode('');
      setError('');
      // Start countdown when modal opens
      setCountdown(60);
    }
  }, [isOpen, email]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await verifyEmail(email, code);
      
      if (result.success) {
        onSuccess && onSuccess(result.user);
        onClose();
      } else {
        setError(result.error || 'Invalid verification code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setResendLoading(true);
    setError('');
    
    try {
      await resendVerificationCode(email);
      setCountdown(60);
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="verification-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <FiX />
        </button>
        
        <div className="modal-icon">
          <FiMail />
        </div>
        
        <h2>Verify Your Email</h2>
        
        <p className="modal-description">
          We've sent a verification code to
          <br />
          <strong>{email}</strong>
        </p>
        
        <form onSubmit={handleVerify} className="verification-form">
          <div className="code-input-group">
            <input
              type="text"
              maxLength="6"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Enter 6-digit code"
              className="code-input"
              autoFocus
              disabled={loading}
            />
            <div className="code-hint">
              <FiClock />
              <span>Enter the 6-digit code sent to your email</span>
            </div>
          </div>
          
          {error && (
            <div className="modal-error">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}
          
          <button 
            type="submit" 
            className="verify-submit-btn"
            disabled={loading || code.length !== 6}
          >
            {loading ? (
              <>
                <div className="spinner-small"></div>
                Verifying...
              </>
            ) : (
              <>
                <FiCheck />
                Verify Email
              </>
            )}
          </button>
        </form>
        
        <div className="resend-section">
          <p className="resend-text">Didn't receive the code?</p>
          <button
            onClick={handleResendCode}
            disabled={resendLoading || countdown > 0}
            className="resend-btn"
          >
            {resendLoading ? (
              <>
                <div className="spinner-small"></div>
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
        
        <div className="modal-footer-note">
          <FiAlertCircle />
          <span>Check your spam folder if you don't see the email</span>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;