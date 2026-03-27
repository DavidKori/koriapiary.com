// src/services/blogService.js
import api from './api';

// Get all blog posts with filters
export const getBlogPosts = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/blogs${params ? `?${params}` : ''}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

// Get featured blog posts - using the isFeatured field from your model
export const getFeaturedPosts = async (limit = 3) => {
  try {
    const response = await api.get(`/blogs?isFeatured=true&status=published&limit=${limit}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
};

// Get single blog post by slug
export const getBlogPostBySlug = async (slug) => {
  try {
    const response = await api.get(`/blogs/${slug}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }
};

// Get related blog posts
export const getRelatedPosts = async (postId, categoryId, limit = 3) => {
  try {
    const response = await api.get(`/blogs?category=${categoryId}&limit=${limit}&exclude=${postId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
};

// Like blog post
export const likeBlogPost = async (id) => {
  try {
    const response = await api.post(`/blogs/${id}/like`);
    return response.data;
  } catch (error) {
    console.error('Error liking blog post:', error);
    throw error;
  }
};

// Add comment to blog post
export const addBlogComment = async (id, commentData) => {
  try {
    const response = await api.post(`/blogs/${id}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};