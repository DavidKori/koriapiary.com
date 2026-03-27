// src/pages/VerifyEmail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCheck, FiMail, FiSend, FiAlertCircle, FiClock, FiArrowLeft } from 'react-icons/fi';
import { GiHoneyJar } from 'react-icons/gi';

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const { verifyEmail, resendVerificationCode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from location state
    const emailFromState = location.state?.email;
    
    console.log('Email from state:', emailFromState);
    
    if (emailFromState) {
      setEmail(emailFromState);
    } else {
      // If no email, redirect to login
      navigate('/login');
    }
  }, [location, navigate]);

  useEffect(() => {
    // Start countdown for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // src/pages/VerifyEmail.jsx - Update handleVerify function

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
    console.log('Verification result:', result);
    
    if (result.success) {
      // Verification successful - navigation happens in verifyEmail function
      console.log('Verification successful');
    } else if (result.codeExpired && result.newCodeSent) {
      // Code expired, new code sent
      setError('Your code expired. A new code has been sent to your email.');
      setCode(''); // Clear the input
      // Don't close modal, let user try again with new code
    } else if (result.alreadyVerified) {
      // Already verified, redirecting to login
      console.log('Already verified');
    } else {
      setError(result.error || 'Invalid verification code');
    }
  } catch (err) {
    console.error('Verification error:', err);
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
      setCountdown(60); // 60 seconds cooldown
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button 
          onClick={() => navigate(-1)} 
          className="back-to-login"
        >
          <FiArrowLeft /> Back 
        </button>
        
        <div className="auth-header">
          <GiHoneyJar className="auth-logo" />
          <h1 className="auth-title">Verify Your Email</h1>
          <p className="auth-subtitle">
            We've sent a verification code to
            <br />
            <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerify} className="auth-form">
          <div className="form-group">
            <label htmlFor="code">
              <FiMail className="input-icon" />
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              maxLength="6"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Enter 6-digit code"
              className={error ? 'error' : ''}
              autoFocus
              disabled={loading}
            />
            <div className="code-hint">
              <FiClock />
              <span>Enter the 6-digit code sent to your email</span>
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
            className={`btn btn-primary btn-block ${loading ? 'loading' : ''}`}
            disabled={loading || code.length !== 6}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Verifying...
              </>
            ) : (
              <>
                <FiCheck /> Verify Email
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
        
        <div className="verify-footer-note">
          <FiAlertCircle />
          <span>Check your spam folder if you don't see the email</span>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;