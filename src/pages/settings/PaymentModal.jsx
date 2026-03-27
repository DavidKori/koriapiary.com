// src/pages/settings/PaymentModal.jsx
import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { FiCreditCard, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';

const PaymentModal = ({ isOpen, onClose, payment, onSubmit, saving }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    type: payment?.type || 'card',
    cardNumber: payment?.cardNumber || '',
    cardName: payment?.cardName || '',
    expiryDate: payment?.expiryDate || '',
    cvv: '',
    phoneNumber: payment?.phoneNumber || '',
    isDefault: payment?.isDefault || false
  });
  const [errors, setErrors] = useState({});
  const [showCVV, setShowCVV] = useState(false);

  // Auto-format card number
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '').replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.slice(0, 19);
  };

  // Auto-format expiry date with auto-slash
  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    
    // Auto-add slash after 2 digits
    if (cleaned.length <= 2) {
      return cleaned;
    }
    
    // Format month part
    let month = cleaned.substring(0, 2);
    if (parseInt(month) > 12) {
      month = '12';
    }
    if (parseInt(month) < 1 && month.length === 2) {
      month = '01';
    }
    
    const year = cleaned.substring(2, 4);
    return `${month}/${year}`;
  };

  // Auto-format phone number - supports all Kenyan formats
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    
    // For 10-digit numbers (starting with 07 or 01)
    if (cleaned.length <= 10) {
      if (cleaned.length <= 4) return cleaned;
      if (cleaned.length <= 7) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 10)}`;
    }
    
    // For 12-digit numbers (starting with 254)
    if (cleaned.length <= 12) {
      if (cleaned.length <= 3) return cleaned;
      if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
      if (cleaned.length <= 9) return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9, 12)}`;
    }
    
    return value;
  };

  const validateCardNumber = (number) => {
    const clean = number.replace(/\s/g, '');
    if (!/^\d{16}$/.test(clean)) {
      return 'Card number must be 16 digits';
    }
    
    // Luhn algorithm validation
    let sum = 0;
    let alternate = false;
    for (let i = clean.length - 1; i >= 0; i--) {
      let digit = parseInt(clean.charAt(i), 10);
      if (alternate) {
        digit *= 2;
        if (digit > 9) {
          digit = digit - 9;
        }
      }
      sum += digit;
      alternate = !alternate;
    }
    return sum % 10 === 0 ? null : 'Invalid card number';
  };

  const validateExpiryDate = (date) => {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(date)) {
      return 'Invalid expiry date format (MM/YY)';
    }
    
    const [month, year] = date.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month), 0);
    const now = new Date();
    
    if (expiry < now) {
      return 'Card has expired';
    }
    return null;
  };

  const validatePhoneNumber = (phone) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Acceptable formats:
    // 07xxxxxxxx (10 digits starting with 07)
    // 01xxxxxxxx (10 digits starting with 01)
    // 2547xxxxxxxx (12 digits starting with 2547)
    // 2541xxxxxxxx (12 digits starting with 2541)
    
    if (cleaned.length === 10 && (cleaned.startsWith('07') || cleaned.startsWith('01'))) {
      return null; // Valid 10-digit Kenyan number
    }
    
    if (cleaned.length === 12 && cleaned.startsWith('254')) {
      return null; // Valid international format
    }
    
    return 'Please enter a valid Kenyan phone number (e.g., 0712345678, 0112345678, or 254712345678)';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = value;
    
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'phoneNumber') {
      formattedValue = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : formattedValue }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.type === 'card') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else {
        const cardError = validateCardNumber(formData.cardNumber);
        if (cardError) newErrors.cardNumber = cardError;
      }
      
      if (!formData.cardName) {
        newErrors.cardName = 'Cardholder name is required';
      }
      
      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else {
        const expiryError = validateExpiryDate(formData.expiryDate);
        if (expiryError) newErrors.expiryDate = expiryError;
      }
      
      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'CVV must be 3 or 4 digits';
      }
    } else if (formData.type === 'mpesa') {
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      } else {
        const phoneError = validatePhoneNumber(formData.phoneNumber);
        if (phoneError) newErrors.phoneNumber = phoneError;
      }
      
      if (!formData.cardName) {
        newErrors.cardName = 'Account name is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Format phone number for backend before sending
      const submitData = { ...formData };
      if (submitData.type === 'mpesa' && submitData.phoneNumber) {
        // Clean phone number for backend
        const cleaned = submitData.phoneNumber.replace(/\D/g, '');
        if (cleaned.length === 10 && (cleaned.startsWith('07') || cleaned.startsWith('01'))) {
          submitData.phoneNumber = '254' + cleaned.slice(1);
        } else {
          submitData.phoneNumber = cleaned;
        }
      }
      onSubmit(submitData);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={payment ? 'Edit Payment Method' : 'Add Payment Method'}
      size="medium"
    >
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label>Payment Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={errors.type ? 'error' : ''}
          >
            <option value="card">Credit/Debit Card</option>
            <option value="mpesa">M-Pesa</option>
          </select>
        </div>

        {formData.type === 'card' ? (
          <>
            <div className="form-group">
              <label>Card Number</label>
              <div className="input-with-icon">
                <FiCreditCard className="input-icon" />
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className={errors.cardNumber ? 'error' : ''}
                />
              </div>
              {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
            </div>

            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                placeholder="Name as on card"
                className={errors.cardName ? 'error' : ''}
              />
              {errors.cardName && <span className="error-text">{errors.cardName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  className={errors.expiryDate ? 'error' : ''}
                />
                {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
              </div>
              <div className="form-group">
                <label>CVV</label>
                <div className="input-with-icon">
                  <input
                    type={showCVV ? 'text' : 'password'}
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength="4"
                    className={errors.cvv ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="input-icon-button"
                    onClick={() => setShowCVV(!showCVV)}
                  >
                    {showCVV ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.cvv && <span className="error-text">{errors.cvv}</span>}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>M-Pesa Phone Number</label>
              <div className="input-with-icon">
                <FiPhone className="input-icon" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="0712 345 678"
                  maxLength="16"
                  className={errors.phoneNumber ? 'error' : ''}
                />
              </div>
              <small className="help-text">
                Enter your M-Pesa registered phone number (e.g., 0712345678, 0112345678, or 254712345678)
              </small>
              {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
            </div>

            <div className="form-group">
              <label>Account Name</label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                placeholder="Name on the M-Pesa account"
                className={errors.cardName ? 'error' : ''}
              />
              {errors.cardName && <span className="error-text">{errors.cardName}</span>}
            </div>
          </>
        )}

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
          />
          <span>Set as default payment method</span>
        </label>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : (payment ? 'Update' : 'Add')} Payment Method
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal;