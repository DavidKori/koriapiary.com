// src/services/wishlistService.js
import api from './api';

// Get user's wishlist
export const getWishlist = async () => {
  try {
    const response = await api.get('/wishlist');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

// Add to wishlist
export const addToWishlist = async (productId, variantId) => {
  try {
    const response = await api.post('/wishlist/add', { productId, variantId });
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

// Remove from wishlist
export const removeFromWishlist = async (productId, variantId) => {
  try {
    const response = await api.delete(`/wishlist/remove/${productId}/${variantId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

// Move item to cart - FIXED: Properly handles quantity
export const moveToCart = async (productId, variantId, quantity = 1) => {
  try {
    // Send the quantity as query parameter
    const response = await api.post(`/wishlist/move-to-cart/${productId}/${variantId}?quantity=${quantity}`);
    return response.data;
  } catch (error) {
    console.error('Error moving to cart:', error);
    throw error;
  }
};

// Clear wishlist
export const clearWishlist = async () => {
  try {
    const response = await api.delete('/wishlist/clear');
    return response.data;
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    throw error;
  }
};

// Check if product is in wishlist
export const checkWishlistStatus = async (productId, variantId) => {
  try {
    const response = await api.get(`/wishlist/check/${productId}/${variantId}`);
    const data = response.data.data || response.data;
    return { isInWishlist: data.isInWishlist || false };
  } catch (error) {
    console.error('Error checking wishlist status:', error);
    return { isInWishlist: false };
  }
};