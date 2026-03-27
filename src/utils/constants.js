// src/utils/constants.js

// Payment methods
export const PAYMENT_METHODS = [
  { id: 'stripe', name: 'Credit / Debit Card', icon: 'Stripe' },
  { id: 'mpesa', name: 'M-Pesa', icon: 'Mpesa' },
  { id: 'whatsapp', name: 'Order via WhatsApp', icon: 'WhatsApp' }
];

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

// Product sort options
export const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'price:asc', label: 'Price: Low to High' },
  { value: 'price:desc', label: 'Price: High to Low' },
  { value: 'name:asc', label: 'Name: A to Z' },
  { value: 'name:desc', label: 'Name: Z to A' },
  { value: 'soldCount:desc', label: 'Best Selling' }
];

// Product limits
export const PRODUCTS_PER_PAGE = 12;
export const RELATED_PRODUCTS_LIMIT = 4;

// Cart constants
export const FREE_SHIPPING_THRESHOLD = 50;
export const SHIPPING_COST = 5.99;
export const TAX_RATE = 0.08; // 8%

// Image constants
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Cache keys
export const CACHE_KEYS = {
  CART: 'cart',
  THEME: 'theme',
  USER: 'user',
  TOKEN: 'token'
};

// Routes
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: '/product/:slug',
  ABOUT: '/about',
  BLOG: '/blog',
  BLOG_POST: '/blog/:slug',
  CONTACT: '/contact',
  PROJECTS: '/projects',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order-success',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ORDERS: '/orders',
  ORDER_DETAILS: '/orders/:id'
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me'
  },
  PRODUCTS: {
    BASE: '/products',
    FEATURED: '/products/featured',
    RELATED: '/products/related',
    SEARCH: '/products/search'
  },
  CATEGORIES: '/categories',
  BLOGS: {
    BASE: '/blogs',
    FEATURED: '/blogs/featured',
    RELATED: '/blogs/related',
    SEARCH: '/blogs/search',
    CATEGORIES: '/blogs/categories',
    TAGS: '/blogs/tags'
  },
  ORDERS: {
    BASE: '/orders',
    MY_ORDERS: '/orders/my-orders',
    TRACK: '/orders/track'
  },
  PAYMENTS: {
    STRIPE: '/payment/stripe',
    MPESA: '/mpesa/stkpush',
    WHATSAPP: '/whatsapp'
  }
};

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  CART: 'cart',
  TOKEN: 'token',
  USER: 'user',
  WISHLIST: 'wishlist'
};

// Theme modes
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Social media links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/apiaryhoney',
  TWITTER: 'https://twitter.com/apiaryhoney',
  INSTAGRAM: 'https://instagram.com/apiaryhoney',
  YOUTUBE: 'https://youtube.com/apiaryhoney'
};

// Contact information
export const CONTACT_INFO = {
  EMAIL: 'info@apiaryhoney.com',
  PHONE: '+1 (555) 123-4567',
  ADDRESS: '123 Honey Lane, Apiary Valley, CA 12345',
  HOURS: 'Mon-Fri: 9am - 6pm'
};

// SEO defaults
export const SEO_DEFAULTS = {
  TITLE: 'Apiary Honey - Pure Natural Honey',
  DESCRIPTION: 'Discover pure, organic honey from our family-owned apiary. Raw, unfiltered honey with natural health benefits.',
  KEYWORDS: 'honey, organic honey, raw honey, apiary, beekeeping',
  OG_IMAGE: '/images/og-default.jpg'
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  SERVER: 'Server error. Please try again later.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You must be logged in to access this page.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  VALIDATION: 'Please check your input and try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in!',
  REGISTER: 'Account created successfully!',
  LOGOUT: 'Successfully logged out!',
  ORDER_PLACED: 'Your order has been placed successfully!',
  CART_ADD: 'Item added to cart!',
  CART_REMOVE: 'Item removed from cart!',
  CART_CLEAR: 'Cart cleared!',
  PROFILE_UPDATE: 'Profile updated successfully!'
};