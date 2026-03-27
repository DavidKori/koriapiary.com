// src/services/addressService.js
import api from './api';

// Get all addresses
export const getAddresses = async () => {
  try {
    console.log('Fetching addresses from API...');
    const response = await api.get('/users/addresses');
    console.log('Addresses response:', response.data);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
};

// Add new address
export const addAddress = async (addressData) => {
  try {
    const response = await api.post('/users/addresses', addressData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error adding address:', error);
    throw error;
  }
};

// Update address
export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await api.put(`/users/addresses/${addressId}`, addressData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

// Delete address
export const deleteAddress = async (addressId) => {
  try {
    const response = await api.delete(`/users/addresses/${addressId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

// Set default address
export const setDefaultAddress = async (addressId) => {
  try {
    const response = await api.put(`/users/addresses/${addressId}/default`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error setting default address:', error);
    throw error;
  }
};