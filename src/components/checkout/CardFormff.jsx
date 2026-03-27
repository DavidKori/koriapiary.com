// src/components/checkout/CardForm.jsx
import React, { useState } from 'react';
import { FiCreditCard, FiLock, FiShield, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover } from 'react-icons/fa';
import { useToast } from '../../context/ToastContext';
import { initializeCardPayment } from '../../services/paymentService';
import '../../styles/cardForm.css';

const CardForm = ({ amount, email, name, phoneNumber, orderId, onSuccess, onCancel, processing }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  // Kenyan banks logos
  const supportedCards = [
    { name: 'Visa', icon: <FaCcVisa />, color: '#1a1f71' },
    { name: 'Mastercard', icon: <FaCcMastercard />, color: '#eb001b' },
    { name: 'American Express', icon: <FaCcAmex />, color: '#2e77bb' },
    { name: 'Discover', icon: <FaCcDiscover />, color: '#ff6000' },
    { name: 'Equity Bank', icon: '🏦', color: '#00843D' },
    { name: 'KCB', icon: '🏦', color: '#C7022C' },
    { name: 'Co-op Bank', icon: '🏦', color: '#0047AB' },
    { name: 'Stanbic', icon: '🏦', color: '#003366' }
  ];

  const handleCardPayment = async () => {
    setIsLoading(true);

    try {
      // Initialize payment with backend (all keys are on backend)
      const response = await initializeCardPayment({
        amount,
        email,
        name,
        phoneNumber,
        orderId,
        currency: 'KES'
      });

      if (response.success && response.data.link) {
        // Redirect to Flutterwave payment page
        window.location.href = response.data.link;
      } else {
        showToast(response.message || 'Failed to initialize payment', 'error');
        setIsLoading(false);
      }

    } catch (error) {
      console.error('Card payment error:', error);
      showToast(error.message || 'Payment failed. Please try again.', 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="card-payment-form">
      <div className="payment-header">
        <FiCreditCard className="header-icon" />
        <h3>Card Payment</h3>
        <p>Pay securely with your debit or credit card</p>
      </div>

      <div className="supported-cards">
        <div className="cards-title">Supported Cards:</div>
        <div className="cards-grid">
          {supportedCards.map((card, index) => (
            <div key={index} className="card-badge" style={{ borderColor: card.color }}>
              <span className="card-icon">{card.icon}</span>
              <span className="card-name">{card.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="payment-info">
        <div className="info-row">
          <span>Amount to pay:</span>
          <strong>KSh {amount.toLocaleString()}</strong>
        </div>
        <div className="info-row">
          <span>Order ID:</span>
          <span>#{orderId?.slice(-8) || 'Pending'}</span>
        </div>
        <div className="info-row">
          <span>Customer:</span>
          <span>{name}</span>
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
        <div className="feature">
          <FiCheckCircle className="feature-icon" />
          <span>Instant Confirmation</span>
        </div>
      </div>

      <div className="card-preview">
        <div className="preview-card">
          <div className="card-chip"></div>
          <div className="card-number">**** **** **** ****</div>
          <div className="card-details">
            <div className="card-name">{name || 'CARDHOLDER NAME'}</div>
            <div className="card-expiry">MM/YY</div>
          </div>
          <div className="card-logo">
            <FaCcVisa />
            <FaCcMastercard />
          </div>
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
          type="button" 
          onClick={handleCardPayment}
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
        <p>You will be redirected to Flutterwave secure payment page. We do not store your card details.</p>
      </div>
    </div>
  );
};

export default CardForm;