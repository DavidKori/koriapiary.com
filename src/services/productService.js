// src/services/productService.js
import api from './api';

// Get all products with filters
export const getProducts = async (filters = {}) => {
  try {
    // Build query parameters based on what your backend expects
    const params = new URLSearchParams();
    
    // Category filter
    if (filters.category) {
      params.append('category', filters.category);
    }
    
    // Search filter - your backend might use 'q' or 'search'
    if (filters.search) {
      params.append('search', filters.search); // Try 'q' if this doesn't work
    }
    
    // Price filters
    if (filters.minPrice) {
      params.append('minPrice', filters.minPrice);
    }
    if (filters.maxPrice) {
      params.append('maxPrice', filters.maxPrice);
    }
    
    // Sorting - your backend might use different format
    if (filters.sort) {
      const [sortBy, sortOrder] = filters.sort.split(':');
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
    }
    
    // Pagination
    if (filters.page) {
      params.append('page', filters.page);
    }
    if (filters.limit) {
      params.append('limit', filters.limit);
    }
    
    console.log('Fetching products with params:', params.toString());
    
    const response = await api.get(`/products?${params.toString()}`);
    console.log('Products API response:', response.data);
    
    // Handle different response structures
    let products = [];
    let pagination = { total: 0, page: 1, limit: 12, pages: 0 };
    
    if (response.data) {
      if (Array.isArray(response.data)) {
        // Response is directly an array
        products = response.data;
        pagination = {
          total: products.length,
          page: filters.page || 1,
          limit: filters.limit || 12,
          pages: Math.ceil(products.length / (filters.limit || 12))
        };
      } else if (response.data.data) {
        // Response has data wrapper
        products = response.data.data;
        pagination = response.data.pagination || {
          total: products.length,
          page: filters.page || 1,
          limit: filters.limit || 12,
          pages: Math.ceil(products.length / (filters.limit || 12))
        };
      } else if (response.data.products) {
        // Response has products wrapper
        products = response.data.products;
        pagination = response.data.pagination || {
          total: products.length,
          page: filters.page || 1,
          limit: filters.limit || 12,
          pages: Math.ceil(products.length / (filters.limit || 12))
        };
      }
    }
    
    return {
      data: products,
      pagination
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async (limit = 8) => {
  try {
    const response = await api.get(`/products?featured=true&limit=${limit}`);
    
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data.data) {
      return response.data.data;
    } else if (response.data.products) {
      return response.data.products;
    }
    return [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

// Get product by slug
export const getProductBySlug = async (slug) => {
  try {
    console.log('Fetching product with slug:', slug);
    
    if (!slug) {
      throw new Error('No slug provided');
    }
    
    const response = await api.get(`/products/slug/${slug}`);
    console.log('Product API response:', response.data);
    
    // Handle different response structures
    if (response.data.success) {
      return response.data.data || response.data.product;
    }
    
    if (response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    console.error('Error details:', error.response?.data);
    
    // If 404, throw a more specific error
    if (error.response?.status === 404) {
      throw new Error('Product not found');
    }
    
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Get related products
export const getRelatedProducts = async (productId, categoryId, limit = 4) => {
  try {
    const response = await api.get(`/products?category=${categoryId}&limit=${limit}&exclude=${productId}`);
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
};

// Search products
export const searchProducts = async (query) => {
  try {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};