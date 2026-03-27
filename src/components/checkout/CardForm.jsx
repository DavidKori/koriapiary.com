// src/components/checkout/CardForm.jsx
import React, { useState } from 'react';
import { FiCreditCard, FiLock, FiShield, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';
import { initializeCardPayment } from '../../services/paymentService';
import '../../styles/cardForm.css';

const CardForm = ({ amount, email, name, phoneNumber, orderId, onSuccess, onCancel, processing }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const { showToast } = useToast();

  const supportedCards = [
    { name: 'Visa', icon: <FaCcVisa />, color: '#1a1f71' },
    { name: 'Mastercard', icon: <FaCcMastercard />, color: '#eb001b' },
    { name: 'American Express', icon: <FaCcAmex />, color: '#2e77bb' },
    { name: 'Discover', icon: <FaCcDiscover />, color: '#ff6000' }
  ];

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/gi, '').substring(0, 4);
    setCvv(value);
  };

  const validateForm = () => {
    const cardNumberClean = cardNumber.replace(/\s/g, '');
    if (!cardNumberClean.match(/^\d{16}$/)) {
      showToast('Please enter a valid 16-digit card number', 'error');
      return false;
    }
    if (!expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      showToast('Please enter a valid expiry date (MM/YY)', 'error');
      return false;
    }
    if (!cvv.match(/^\d{3,4}$/)) {
      showToast('Please enter a valid CVV', 'error');
      return false;
    }
    if (!cardName.trim()) {
      showToast('Please enter the cardholder name', 'error');
      return false;
    }
    return true;
  };

  const handleCardPayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!orderId) {
      showToast('Order not created. Please go back and try again.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate card payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, assume payment is successful
      onSuccess({ 
        status: 'successful',
        method: 'card',
        transactionId: `TXN-${Date.now()}`,
        last4: cardNumber.slice(-4)
      });
      
    } catch (error) {
      console.error('Card payment error:', error);
      showToast('Payment failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-payment-form">
      <div className="payment-header">
        <FiCreditCard className="header-icon" />
        <h3>Card Payment</h3>
        <p>Enter your card details to complete payment</p>
      </div>

      <div className="supported-cards">
        <div className="cards-title">We Accept:</div>
        <div className="cards-grid">
          {supportedCards.map((card, index) => (
            <div key={index} className="card-badge" style={{ borderColor: card.color }}>
              <span className="card-icon">{card.icon}</span>
              <span className="card-name">{card.name}</span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleCardPayment}>
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            className="card-input"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="text"
              value={expiryDate}
              onChange={handleExpiryChange}
              placeholder="MM/YY"
              maxLength="5"
              className="card-input"
            />
          </div>
          <div className="form-group">
            <label>CVV</label>
            <input
              type="text"
              value={cvv}
              onChange={handleCVVChange}
              placeholder="123"
              maxLength="4"
              className="card-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Cardholder Name</label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Name as on card"
          />
        </div>

        <div className="payment-info">
          <div className="info-row">
            <span>Order Amount:</span>
            <strong>KSh {amount.toLocaleString()}</strong>
          </div>
          <div className="info-row">
            <span>Order ID:</span>
            <span>#{orderId?.slice(-8)}</span>
          </div>
        </div>

        <div className="security-features">
          <div className="feature">
            <FiLock className="feature-icon" />
            <span>256-bit SSL Secure</span>
          </div>
          <div className="feature">
            <FiShield className="feature-icon" />
            <span>PCI DSS Compliant</span>
          </div>
        </div>

        <div className="payment-buttons">
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn btn-secondary"
            disabled={processing || isLoading}
          >
            Back
          </button>
          <button 
            type="submit" 
            disabled={processing || isLoading}
            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <>
                <FiLoader className="spinner-icon" />
                Processing...
              </>
            ) : (
              <>
                <FiCreditCard />
                Pay KSh {amount.toLocaleString()}
              </>
            )}
          </button>
        </div>

        <div className="payment-note">
          <FiLock className="note-icon" />
          <p>Your payment information is encrypted and secure. We do not store your card details.</p>
        </div>
      </form>
    </div>
  );
};

export default CardForm;