// src/services/ratingService.js
import api from './api';

// Mark item as rated in order
export const markItemAsRated = async (orderId, itemId, ratingId) => {
  try {
    const response = await api.post(`/orders/${orderId}/items/${itemId}/rate`, { ratingId });
    return response.data;
  } catch (error) {
    console.error('Error marking item as rated:', error);
    throw error;
  }
};

// Check if user has rated product in order
export const checkItemRating = async (orderId, itemId) => {
  try {
    const response = await api.get(`/orders/${orderId}/items/${itemId}/rating`);
    return response.data;
  } catch (error) {
    console.error('Error checking item rating:', error);
    throw error;
  }
};


// Get all ratings for a product
export const getProductRatings = async (productId, page = 1, limit = 10) => {
  try {
    const response = await api.get(`/ratings/products/${productId}/ratings?page=${page}&limit=${limit}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching product ratings:', error);
    throw error;
  }
};

// Get user's own ratings
export const getUserRatings = async () => {
  try {
    // Fetch all products the user has rated
    // This endpoint needs to be created in the backend
    const response = await api.get('/ratings/my-ratings');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching user ratings:', error);
    // Return empty array if endpoint doesn't exist yet
    return [];
  }
};

// Get user rating for a specific product
export const getUserRating = async (productId) => {
  try {
    const response = await api.get(`/ratings/products/${productId}/user-rating`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching user rating:', error);
    throw error;
  }
};

// Submit a rating
export const submitRating = async (ratingData) => {
  try {
    const response = await api.post(`/ratings/products/${ratingData.productId}/ratings`, ratingData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error submitting rating:', error);
    throw error;
  }
};

// Update a rating
export const updateRating = async (ratingId, ratingData) => {
  try {
    const response = await api.put(`/ratings/${ratingId}`, ratingData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating rating:', error);
    throw error;
  }
};

// Delete a rating
export const deleteRating = async (ratingId) => {
  try {
    const response = await api.delete(`/ratings/${ratingId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting rating:', error);
    throw error;
  }
};