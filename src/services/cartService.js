// src/services/cartService.js
import api from './api';

// Get user's cart
export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    console.log('Get cart response:', response.data);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (item) => {
  try {
    const response = await api.post('/cart/add', item);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItem = async (productId, variantId, quantity) => {
  try {
    const response = await api.put('/cart/update', {
      productId,
      variantId,
      quantity
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (productId, variantId) => {
  try {
    const response = await api.delete(`/cart/remove/${productId}/${variantId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

// Clear entire cart
export const clearCart = async () => {
  try {
    const response = await api.delete('/cart/clear');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// Sync guest cart with user cart after login
export const syncCart = async (items) => {
  try {
    const response = await api.post('/cart/sync', { items });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error syncing cart:', error);
    throw error;
  }
};

// Get cart item count
export const getCartCount = async () => {
  try {
    const response = await api.get('/cart/count');
    return response.data.data || response.data || 0;
  } catch (error) {
    console.error('Error fetching cart count:', error);
    throw error;
  }
};