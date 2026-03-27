// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SEO from '../components/common/SEO';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { GiHoneyJar } from 'react-icons/gi';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        showToast('Please enter both email and password', 'error');
        setLoading(false);
        return;
      }

      console.log('Attempting login with:', { email });
      
      const result = await login({ email, password });
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful');
        showToast('Login successful!', 'success');
        // Navigation happens inside login function
      } else if (result.requiresVerification) {
        console.log('Verification required, redirecting to verify page');
        // Toast already shown in login function
        // Navigation happens inside login function to /verify
      } else if (result.error) {
        showToast(result.error, 'error');
      }
    } catch (err) {
      console.error('Login error:', err);
      showToast(err.message || 'An error occurred during login', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Login - Apiary Honey" />
      
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <GiHoneyJar className="auth-logo" />
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">
                <FiMail className="input-icon" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FiLock className="input-icon" />
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password" style={{"marginLeft":"1rem"}}>
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary btn-block ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                <>
                  <FiLogIn /> Sign In
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Create an account</Link>
            </p>
          </div>

          <div className="auth-alternate">
            <p className="demo-credentials" style={{"textAlign":"center","fontStyle":"italic"}}>
              &copy;  KoriDevifys 2026
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;