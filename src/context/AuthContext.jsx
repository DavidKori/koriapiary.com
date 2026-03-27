// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister, getCurrentUser, adminLogin as apiAdminLogin, verifyEmail as apiVerifyEmail, resendVerificationCode as apiResendCode } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Check if user is already logged in on mount
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        console.log('Initial auth check - Token exists:', !!token);
        console.log('Initial auth check - Saved user exists:', !!savedUser);
        
        if (token && savedUser) {
          try {
            // Get fresh user data from backend
            const userData = await getCurrentUser();
            console.log('Loaded user data from backend:', userData);
            
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            console.log('User loaded from storage and verified:', userData.email);
          } catch (error) {
            console.error('Token invalid or expired:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };
    
    loadUserFromStorage();
  }, []);

  // Login function
// src/context/AuthContext.jsx - Fixed login function

// Login function
// src/context/AuthContext.jsx - Fixed login function with proper admin/customer handling

// Login function
// src/context/AuthContext.jsx - Fixed login function using emailVerified

// Login function
// src/context/AuthContext.jsx - Fixed login function

const login = async (credentials) => {
  setLoading(true);
  setError(null);
  
  try {
    console.log('Attempting login with:', credentials.email);
    
    const response = await apiLogin(credentials);
    console.log('Login response:', response);

    // Handle successful login (status 200)
    let token = response.token;
    let userData = response.user || response.data?.user || response;
    
    if (response.data && !token) {
      token = response.data.token;
      userData = response.data.user || response.data;
    }
    
    if (token && userData) {
      // Check if user is admin
      if (userData.role === 'admin') {
        console.log('Admin login detected, checking admin verification...');
        
        // Check if admin login is already verified
        if (!userData.adminLoginVerified) {
          // Admin already verified, login successful
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          showToast('Admin login successful!', 'success');
          navigate('/');
          return { success: true, user: userData };
        } else {
          // Admin needs verification
          console.log('Admin needs verification');
          showToast('Please verify your admin login. A verification code has been sent.', 'info');
          setLoading(false);
          navigate('/verify', { state: { email: userData.email, isAdmin: true } });
          return { 
            success: false, 
            requiresVerification: true, 
            email: userData.email,
            isAdmin: true
          };
        }
      }
      
      // Customer login - check email verified
      if (userData.role === 'customer') {
        if (!userData.emailVerified) {
          console.log('Customer email not verified');
          showToast('Please verify your email first. A verification code has been sent.', 'info');
          setLoading(false);
          navigate('/verify', { state: { email: userData.email, isAdmin: false } });
          return { 
            success: false, 
            requiresVerification: true, 
            email: userData.email 
          };
        }
        
        // Customer verified, login successful
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        showToast('Login successful!', 'success');
        navigate('/');
        return { success: true, user: userData };
      }
    }
    
    throw new Error('Invalid response format');
    
  } catch (error) {
    console.error('Login error:', error);
    
    // Check if this is a verification required error (403 status)
    if (error.response?.status === 403 && error.response?.data?.requiresVerification) {
      const verificationData = error.response.data;
      console.log('Verification required:', verificationData);
      showToast(verificationData.message || 'Please verify your email first', 'info');
      setLoading(false);
      navigate('/verify', { state: { email: verificationData.email, isAdmin: verificationData.isAdmin || false } });
      return { 
        success: false, 
        requiresVerification: true, 
        email: verificationData.email,
        isAdmin: verificationData.isAdmin || false
      };
    }
    
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    setError(errorMessage);
    showToast(errorMessage, 'error');
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRegister(userData);
      console.log('Register response:', response);
      
      // Handle successful registration with verification required
      if (response.requiresVerification) {
        console.log('Verification required for email:', response.email);
        showToast(response.message || 'Registration successful! Please verify your email.', 'success');
        setLoading(false);
        // Navigate to verify page with email in state
        navigate('/verify', { state: { email: response.email } });
        return { 
          success: true, 
          requiresVerification: true, 
          email: response.email 
        };
      }
      
      // Handle direct login (if no verification required)
      let token = response.token;
      let user = response.user || response.data?.user || response;
      
      if (response.data && !token) {
        token = response.data.token;
        user = response.data.user || response.data;
      }
      
      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        showToast('Registration successful!', 'success');
        navigate('/');
        
        return { success: true, user };
      }
      
      throw new Error('Invalid response format');
      
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Verify email function
 // src/context/AuthContext.jsx - Fixed verifyEmail function

// src/context/AuthContext.jsx - Alternative verifyEmail with more robust response handling

const verifyEmail = async (email, code) => {
  setLoading(true);
  
  try {
    console.log('Verifying email:', email, 'with code:', code);
    const response = await apiVerifyEmail(email, code);
    console.log('Full verify email response:', response);
    
    // Extract the actual data (axios might wrap it)
    let responseData = response;
    
    // If response has a data property (axios interceptor might add)
    if (response.data) {
      responseData = response.data;
    }
    
    console.log('Processed response data:', responseData);
    
    // Check if verification was successful
    if (responseData.success === true) {
      // Get token and user from response
      const token = responseData.token;
      const userData = responseData.user;
      
      console.log('Token found:', !!token);
      console.log('User data found:', !!userData);
      
      if (token && userData) {
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        showToast('Email verified successfully!', 'success');
        
        // Redirect based on role
        if (userData.role === 'admin') {
          navigate('/');
        } else {
          navigate('/');
        }
        
        return { success: true, user: userData };
      } else if (token) {
        // Has token but no user data - maybe need to fetch user
        localStorage.setItem('token', token);
        showToast('Email verified successfully!', 'success');
        navigate('/');
        return { success: true };
      } else {
        // Success but no token - maybe just show success
        showToast('Email verified successfully! Please log in.', 'success');
        navigate('/login');
        return { success: true };
      }
    } else {
      // Handle unsuccessful verification
      const errorMessage = responseData.message || 'Verification failed';
      showToast(errorMessage, 'error');
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    console.error('Verify email error:', error);
    console.error('Error response:', error.response?.data);
    
    // Extract error data
    const errorData = error.response?.data;
    const errorMessage = errorData?.message || 'Invalid verification code';
    
    // Check for specific error types
    if (errorData?.codeExpired && errorData?.newCodeSent) {
      showToast('Your code expired. A new code has been sent to your email.', 'info');
      return { success: false, error: errorMessage, codeExpired: true, newCodeSent: true };
    }
    
    if (errorData?.alreadyVerified) {
      showToast('Email already verified! Please log in.', 'info');
      navigate('/login');
      return { success: true, alreadyVerified: true };
    }
    
    if (errorData?.needsNewCode) {
      showToast('No verification code found. A new code has been sent.', 'info');
      return { success: false, error: errorMessage, needsNewCode: true };
    }
    
    showToast(errorMessage, 'error');
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};

  // Resend verification code function
  const resendVerificationCode = async (email) => {
    setLoading(true);
    
    try {
      console.log('Resending verification code to:', email);
      const response = await apiResendCode(email);
      console.log('Resend code response:', response);
      
      if (response.success) {
        showToast('New verification code sent to your email!', 'success');
        return { success: true };
      } else {
        showToast(response.message || 'Failed to resend code', 'error');
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Resend code error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to resend verification code';
      showToast(errorMessage, 'error');
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // UPDATE USER FUNCTION
  const updateUser = (updatedUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUserData
    }));
    
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser);
      const mergedUser = { ...parsedUser, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(mergedUser));
    }
    
    showToast('Profile updated successfully', 'success');
  };

  // Logout function
  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    verifyEmail,
    resendVerificationCode,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  console.log('AuthProvider state:', { 
    user: user?.email, 
    role: user?.role,
    loading, 
    isAdmin: value.isAdmin,
    initialized
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
