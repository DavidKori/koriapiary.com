// src/services/paymentService.js
import api from './api';

// Initialize Flutterwave card payment
export const initializeCardPayment = async (paymentData) => {
  try {
    const response = await api.post('/payment/flutterwave/initiate', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error initializing card payment:', error);
    throw error;
  }
};

// Check payment status
export const checkPaymentStatus = async (tx_ref) => {
  try {
    const response = await api.get(`/payment/flutterwave/status/${tx_ref}`);
    return response.data;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

// Process M-Pesa payment (Daraja)
export const processMpesaPayment = async (paymentData) => {
  try {
    const response = await api.post('/mpesa/stkpush', paymentData);
    console.log('processMpesaPayment response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error processing M-Pesa payment:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Check M-Pesa payment status
export const checkMpesaPaymentStatus = async (checkoutRequestId) => {
  try {
    const response = await api.get(`/mpesa/status/${checkoutRequestId}`);
    console.log('checkMpesaPaymentStatus response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

// export const initializePaystackPayment = async (paymentData) => {
//   try {
//     const response = await api.post('/paystack/initialize', paymentData);
//     return response.data;
//   } catch (error) {
//     console.error('Error initializing Paystack payment:', error);
//     throw error;
//   }
// };

export const verifyPaystackPayment = async (reference) => {
  try {
    const response = await api.get(`/paystack/verify/${reference}`);
    return response.data;
  } catch (error) {
    console.error('Error verifying Paystack payment:', error);
    throw error;
  }
};

// Get all payment methods
export const getPaymentMethods = async () => {
  try {
    const response = await api.get('/users/payment-methods');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
};

// Add new payment method
export const addPaymentMethod = async (paymentData) => {
  try {
    const response = await api.post('/users/payment-methods', paymentData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }
};

// Update payment method
export const updatePaymentMethod = async (paymentId, paymentData) => {
  try {
    const response = await api.put(`/users/payment-methods/${paymentId}`, paymentData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }
};

// Delete payment method
export const deletePaymentMethod = async (paymentId) => {
  try {
    const response = await api.delete(`/users/payment-methods/${paymentId}`);
    return response.data.data || response.data;
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