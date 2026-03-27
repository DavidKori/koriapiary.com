// src/services/userService.js
import api from './api';

// ==================== USER CRUD OPERATIONS ====================

// Get all users (admin only)
export const getUsers = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `/users?${queryParams}` : '/users';
    
    const response = await api.get(url);
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get single user by ID (admin only)
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Get current user profile (authenticated user)
export const getMyProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Update user profile
// src/services/userService.js - Fix the updateUser function
export const updateUser = async (id, userData) => {
  try {
    // Ensure id is a valid string
    let userId = id;
    
    // If id is an object, try to extract the _id or id property
    if (typeof id === 'object') {
      userId = id._id || id.id;
    }
    
    // Convert to string if needed
    if (userId && typeof userId !== 'string') {
      userId = userId.toString();
    }
    
    if (!userId || userId === '[object Object]') {
      throw new Error('Invalid user ID: ' + userId);
    }
    
    console.log('Updating user with ID:', userId);
    console.log('Update data:', userData);
    
    const response = await api.put(`/users/${userId}`, userData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
// Update own profile (authenticated user)
export const updateMyProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/profile', profileData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Delete user (admin only)
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Delete own account (authenticated user)
export const deleteMyAccount = async () => {
  try {
    const response = await api.delete('/users/account');
    return response.data;
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};
// Send delete confirmation code (for admin)
export const sendDeleteConfirmationCode = async (email) => {
  try {
    const response = await api.post('/users/account/send-delete-code', { email });
    return response.data;
  } catch (error) {
    console.error('Send delete code error:', error);
    throw error;
  }
};
// Verify delete code (for admin)
export const verifyDeleteCode = async (email, code) => {
  try {
    const response = await api.post('/users/account/verify-delete-code', { email, code });
    return response.data;
  } catch (error) {
    console.error('Verify delete code error:', error);
    throw error;
  }
};

// ==================== PASSWORD MANAGEMENT ====================

// Update password
export const updatePassword = async (userId, passwordData) => {
  try {
    const response = await api.put(`/users/${userId}/password`, passwordData);
    return response.data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Update own password
// src/services/userService.js - Add this function
export const updateMyPassword = async (passwordData) => {
  try {
    const response = await api.put('/users/me/password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Reset password (admin only)
export const resetUserPassword = async (userId) => {
  try {
    const response = await api.post(`/users/${userId}/reset-password`);
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Forgot password (public)
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw error;
  }
};

// Reset password with token
export const resetPasswordWithToken = async (token, newPassword) => {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, { password: newPassword });
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// ==================== ADDRESS MANAGEMENT ====================

// Get user addresses
export const getAddresses = async () => {
  try {
    const response = await api.get('/user/addresses');
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
};

// Add new address
export const addAddress = async (addressData) => {
  try {
    const response = await api.post('/user/addresses', addressData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error adding address:', error);
    throw error;
  }
};

// Update address
export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await api.put(`/user/addresses/${addressId}`, addressData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

// Delete address
export const deleteAddress = async (addressId) => {
  try {
    const response = await api.delete(`/user/addresses/${addressId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

// Set default address
export const setDefaultAddress = async (addressId) => {
  try {
    const response = await api.put(`/user/addresses/${addressId}/default`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
};

// ==================== PAYMENT METHODS ====================

// Get payment methods
export const getPaymentMethods = async () => {
  try {
    const response = await api.get('/user/payment-methods');
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

// Add payment method
export const addPaymentMethod = async (paymentData) => {
  try {
    const response = await api.post('/user/payment-methods', paymentData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }
};

// Update payment method
export const updatePaymentMethod = async (paymentId, paymentData) => {
  try {
    const response = await api.put(`/user/payment-methods/${paymentId}`, paymentData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }
};

// Delete payment method
export const deletePaymentMethod = async (paymentId) => {
  try {
    const response = await api.delete(`/user/payment-methods/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
};

// Set default payment method
export const setDefaultPaymentMethod = async (paymentId) => {
  try {
    const response = await api.put(`/users/payment-methods/${paymentId}/default`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error setting default payment method:', error);
    throw error;
  }
};

// ==================== USER PREFERENCES ====================

// Get user preferences
export const getPreferences = async () => {
  try {
    const response = await api.get('/users/preferences');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching preferences:', error);
    throw error;
  }
};

// Update user preferences
export const updatePreferences = async (preferences) => {
  try {
    const response = await api.put('/users/preferences', preferences);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};

// Update notification settings
export const updateNotificationSettings = async (settings) => {
  try {
    const response = await api.put('/users/notifications', settings);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
};

// Update theme preference
export const updateThemePreference = async (theme) => {
  try {
    const response = await api.put('/user/theme', { theme });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating theme:', error);
    throw error;
  }
};

// Update language preference
export const updateLanguage = async (language) => {
  try {
    const response = await api.put('/user/language', { language });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating language:', error);
    throw error;
  }
};

// Update currency preference
export const updateCurrency = async (currency) => {
  try {
    const response = await api.put('/user/currency', { currency });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating currency:', error);
    throw error;
  }
};

// ==================== USER STATISTICS ====================

// Get user statistics
export const getUserStats = async () => {
  try {
    const response = await api.get('/user/stats');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

// Get user activity
export const getUserActivity = async (limit = 10) => {
  try {
    const response = await api.get(`/user/activity?limit=${limit}`);
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching user activity:', error);
    throw error;
  }
};

// ==================== USER AVATAR ====================

// Upload avatar
export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

// Delete avatar
export const deleteAvatar = async () => {
  try {
    const response = await api.delete('/user/avatar');
    return response.data;
  } catch (error) {
    console.error('Error deleting avatar:', error);
    throw error;
  }
};

// ==================== USER SESSIONS ====================

// Get active sessions
export const getActiveSessions = async () => {
  try {
    const response = await api.get('/user/sessions');
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
};

// Terminate session
export const terminateSession = async (sessionId) => {
  try {
    const response = await api.delete(`/user/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error terminating session:', error);
    throw error;
  }
};

// Terminate all other sessions
export const terminateAllOtherSessions = async () => {
  try {
    const response = await api.delete('/user/sessions');
    return response.data;
  } catch (error) {
    console.error('Error terminating sessions:', error);
    throw error;
  }
};

// ==================== USER ROLE MANAGEMENT (Admin) ====================

// Change user role (admin only)
export const changeUserRole = async (userId, role) => {
  try {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error changing user role:', error);
    throw error;
  }
};

// Toggle user status (admin only)
export const toggleUserStatus = async (userId, isActive) => {
  try {
    const response = await api.patch(`/users/${userId}/status`, { isActive });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error toggling user status:', error);
    throw error;
  }
};

// Bulk create users (admin only)
export const bulkCreateUsers = async (users) => {
  try {
    const response = await api.post('/users/bulk', { users });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error bulk creating users:', error);
    throw error;
  }
};

// Export users (admin only)
export const exportUsers = async (format = 'csv', filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await api.get(`/users/export/${format}?${queryParams}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting users:', error);
    throw error;
  }
};

// ==================== USER SEARCH ====================

// Search users
export const searchUsers = async (query, filters = {}) => {
  try {
    const params = new URLSearchParams({ search: query, ...filters }).toString();
    const response = await api.get(`/users/search?${params}`);
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// ==================== USER NOTIFICATIONS ====================

// Get user notifications
export const getNotifications = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(`/user/notifications?page=${page}&limit=${limit}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationRead = async (notificationId) => {
  try {
    const response = await api.patch(`/user/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsRead = async () => {
  try {
    const response = await api.patch('/user/notifications/read-all');
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/user/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};
