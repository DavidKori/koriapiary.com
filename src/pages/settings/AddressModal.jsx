// src/pages/settings/AddressModal.jsx
import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import { KENYA_COUNTIES, COUNTY_CITIES } from '../../utils/kenyaData';
import { FiHome, FiMapPin, FiPhone } from 'react-icons/fi';

const AddressModal = ({ isOpen, onClose, address, onSubmit, saving }) => {
  const [formData, setFormData] = useState({
    name: address?.name || '',
    address: address?.address || '',
    city: address?.city || '',
    county: address?.county || '',
    postalCode: address?.postalCode || '',
    phone: address?.phone || '',
    isDefault: address?.isDefault || false
  });
  
  const [availableCities, setAvailableCities] = useState(
    formData.county ? COUNTY_CITIES[formData.county] || [] : []
  );
  const [errors, setErrors] = useState({});

  const handleCountyChange = (e) => {
    const county = e.target.value;
    setFormData(prev => ({ ...prev, county, city: '' }));
    setAvailableCities(COUNTY_CITIES[county] || []);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Address name is required';
    if (!formData.address) newErrors.address = 'Street address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.county) newErrors.county = 'County is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^(\+?254|0)[71]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Kenyan phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={address ? 'Edit Address' : 'Add New Address'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="address-form">
        <div className="form-group">
          <label htmlFor="name">
            <FiHome className="input-icon" />
            Address Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Home, Office, Apartment"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="address">
            <FiMapPin className="input-icon" />
            Street Address *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="House number and street name"
            className={errors.address ? 'error' : ''}
          />
          {errors.address && <span className="error-text">{errors.address}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="county">County *</label>
            <select
              id="county"
              name="county"
              value={formData.county}
              onChange={handleCountyChange}
              className={errors.county ? 'error' : ''}
            >
              <option value="">Select county</option>
              {KENYA_COUNTIES.map(county => (
                <option key={county} value={county}>{county}</option>
              ))}
            </select>
            {errors.county && <span className="error-text">{errors.county}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="city">City/Town *</label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!formData.county}
              className={errors.city ? 'error' : ''}
            >
              <option value="">
                {formData.county ? 'Select city/town' : 'Select county first'}
              </option>
              {availableCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {errors.city && <span className="error-text">{errors.city}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="00100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <FiPhone className="input-icon" />
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0712345678"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
          />
          <span>Set as default address</span>
        </label>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : (address ? 'Update Address' : 'Add Address')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddressModal;