// src/services/orderService.js
import api from './api';

// Create order (works for both authenticated and guest users)
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    console.log('Create order response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Get my orders (authenticated users only)
export const getMyOrders = async () => {
  try {
    const response = await api.get('/orders/my-orders');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching my orders:', error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Get order by tracking number
export const getOrderByTracking = async (trackingNumber) => {
  try {
    const response = await api.get(`/orders/track/${trackingNumber}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Cancel order
export const cancelOrder = async (id) => {
  try {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};