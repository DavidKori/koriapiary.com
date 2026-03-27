// src/services/authService.js
import api from './api';

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('AuthService: Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const adminLogin = async (credentials) => {
  try {
    const response = await api.post('/auth/admin-login', credentials);
    return response.data;
  } catch (error) {
    console.error('AuthService: Admin login error:', error.response?.data || error.message);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('AuthService: Register error:', error.response?.data || error.message);
    throw error;
  }
};

export const verifyEmail = async (email, code) => {
  try {
    const response = await api.post('/auth/verify-email', { email, code });
    return response.data;
  } catch (error) {
    console.error('AuthService: Verify email error:', error.response?.data || error.message);
    throw error;
  }
};

export const resendVerificationCode = async (email) => {
  try {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  } catch (error) {
    console.error('AuthService: Resend verification error:', error.response?.data || error.message);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/profile');
    console.log('Get current user response:', response.data);
    return response.data.data || response.data;
  } catch (error) {
    console.error('AuthService: Get user error:', error.response?.data || error.message);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};