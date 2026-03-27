// src/services/categoryService.js
import api from './api';

export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const getCategoryBySlug = async (slug) => {
  try {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};