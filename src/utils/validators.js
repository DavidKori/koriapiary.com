// src/utils/validators.js

// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (international format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

// Kenyan phone number validation (for M-Pesa)
export const isValidKenyanPhone = (phone) => {
  const kenyanPhoneRegex = /^(\+?254|0)[71]\d{8}$/;
  return kenyanPhoneRegex.test(phone);
};

// Password validation (min 6 chars, at least 1 number, 1 letter)
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return passwordRegex.test(password);
};

// Name validation
export const isValidName = (name) => {
  return name && name.trim().length >= 2;
};

// Credit card validation (Luhn algorithm)
export const isValidCreditCard = (cardNumber) => {
  const trimmed = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(trimmed)) return false;
  
  let sum = 0;
  let alternate = false;
  
  for (let i = trimmed.length - 1; i >= 0; i--) {
    let digit = parseInt(trimmed.charAt(i), 10);
    
    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit = (digit % 10) + 1;
      }
    }
    
    sum += digit;
    alternate = !alternate;
  }
  
  return sum % 10 === 0;
};

// CVV validation
export const isValidCVV = (cvv) => {
  return /^\d{3,4}$/.test(cvv);
};

// Expiry date validation (MM/YY)
export const isValidExpiryDate = (expiry) => {
  const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!expiryRegex.test(expiry)) return false;
  
  const [month, year] = expiry.split('/');
  const now = new Date();
  const currentYear = parseInt(now.getFullYear().toString().slice(-2));
  const currentMonth = now.getMonth() + 1;
  
  const expYear = parseInt(year);
  const expMonth = parseInt(month);
  
  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;
  
  return true;
};

// Postal code validation
export const isValidPostalCode = (postalCode, country = 'US') => {
  const patterns = {
    US: /^\d{5}(-\d{4})?$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
    CA: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i,
    AU: /^\d{4}$/,
    KE: /^\d{5}$/
  };
  
  return patterns[country]?.test(postalCode) || false;
};

// URL validation - FIXED
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Product quantity validation
export const isValidQuantity = (quantity, maxStock = Infinity) => {
  const qty = parseInt(quantity);
  return !isNaN(qty) && qty > 0 && qty <= maxStock;
};

// Form validation helper
export const validateCheckoutForm = (formData) => {
  const errors = {};
  
  if (!formData.email) errors.email = 'Email is required';
  else if (!isValidEmail(formData.email)) errors.email = 'Invalid email format';
  
  if (!formData.firstName) errors.firstName = 'First name is required';
  else if (!isValidName(formData.firstName)) errors.firstName = 'Name must be at least 2 characters';
  
  if (!formData.lastName) errors.lastName = 'Last name is required';
  else if (!isValidName(formData.lastName)) errors.lastName = 'Name must be at least 2 characters';
  
  if (!formData.address) errors.address = 'Address is required';
  if (!formData.city) errors.city = 'City is required';
  if (!formData.postalCode) errors.postalCode = 'Postal code is required';
  else if (!isValidPostalCode(formData.postalCode, formData.country)) {
    errors.postalCode = 'Invalid postal code for selected country';
  }
  
  if (!formData.country) errors.country = 'Country is required';
  if (!formData.phone) errors.phone = 'Phone number is required';
  else if (!isValidPhone(formData.phone)) errors.phone = 'Invalid phone number format';
  
  return errors;
};

// Login form validation
export const validateLoginForm = (formData) => {
  const errors = {};
  
  if (!formData.email) errors.email = 'Email is required';
  else if (!isValidEmail(formData.email)) errors.email = 'Invalid email format';
  
  if (!formData.password) errors.password = 'Password is required';
  
  return errors;
};

// Register form validation
export const validateRegisterForm = (formData) => {
  const errors = {};
  
  if (!formData.name) errors.name = 'Name is required';
  else if (!isValidName(formData.name)) errors.name = 'Name must be at least 2 characters';
  
  if (!formData.email) errors.email = 'Email is required';
  else if (!isValidEmail(formData.email)) errors.email = 'Invalid email format';
  
  if (!formData.password) errors.password = 'Password is required';
  else if (!isValidPassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters and contain at least one letter and one number';
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return errors;
};