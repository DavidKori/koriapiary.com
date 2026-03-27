// src/components/checkout/MpesaForm.jsx
import React, { useState } from 'react';
import { FiLoader, FiCheckCircle, FiAlertCircle, FiInfo, FiPhone } from 'react-icons/fi';
import { MdPhoneAndroid } from 'react-icons/md';
import { useToast } from '../../context/ToastContext';
import { processMpesaPayment, checkMpesaPaymentStatus } from '../../services/paymentService';
import '../../styles/mpesaForm.css';

const MpesaForm = ({ amount, phoneNumber: initialPhone, orderId, onPaymentComplete, onCancel, processing }) => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || '');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, processing, waiting, success, error
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { showToast } = useToast();

  const validatePhoneNumber = (phone) => {
    const regex = /^(\+?254|0)[71]\d{8}$/;
    return regex.test(phone);
  };

  const formatPhoneNumber = (phone) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.slice(1);
    }
    if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }
    return cleaned;
  };

  const checkPaymentStatus = async (requestId, maxAttempts = 12, interval = 3000) => {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Checking payment status - Attempt ${attempts}/${maxAttempts}`);
      
      try {
        const response = await checkMpesaPaymentStatus(requestId);
        console.log('Payment status response:', response);
        
        // Check if payment was successful
        if (response.data?.ResultCode === '0' || response.data?.ResultCode === 0) {
          setStatus('success');
          showToast('Payment successful!', 'success');
          onPaymentComplete({ 
            status: 'successful', 
            method: 'mpesa',
            transactionId: response.data?.TransactionId || response.data?.CallbackMetadata?.Item?.find(i => i.Name === 'MpesaReceiptNumber')?.Value
          });
          return true;
        } 
        
        // Check if payment failed
        if (response.data?.ResultCode && response.data.ResultCode !== '0' && response.data.ResultCode !== '1037') {
          const errorMsg = response.data?.ResultDesc || 'Payment failed';
          setErrorMessage(errorMsg);
          setStatus('error');
          showToast(errorMsg, 'error');
          return false;
        }
        
        // Check if user cancelled (ResultCode 1032)
        if (response.data?.ResultCode === 1032) {
          setErrorMessage('Payment was cancelled');
          setStatus('error');
          showToast('Payment was cancelled', 'warning');
          return false;
        }
        
      } catch (error) {
        console.error('Error checking payment status:', error);
        // Don't fail immediately, continue polling
      }
      
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
    
    setStatus('error');
    setErrorMessage('Payment timeout. Please check your M-Pesa app for status.');
    showToast('Payment timeout. Please check your M-Pesa app.', 'warning');
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(phoneNumber)) {
      showToast('Please enter a valid Kenyan phone number (e.g., 0712345678)', 'error');
      return;
    }

    if (!orderId) {
      showToast('Order not created. Please go back and try again.', 'error');
      return;
    }

    setLoading(true);
    setStatus('processing');
    setErrorMessage('');

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      console.log('Initiating M-Pesa payment:', { phoneNumber: formattedPhone, amount, orderId });
      
      // Initiate STK push
      const response = await processMpesaPayment({
        phoneNumber: formattedPhone,
        amount: Math.round(amount),
        orderId
      });

      console.log('STK Push Response:', response);

      if (response.success && response.data) {
        setCheckoutRequestId(response.data.checkoutRequestId);
        setStatus('waiting');
        
        showToast('Check your phone for M-Pesa prompt', 'info');
        
        // Start polling for payment status
        await checkPaymentStatus(response.data.checkoutRequestId);
        
      } else {
        setStatus('error');
        setErrorMessage(response.message || 'Failed to initiate payment');
        showToast(response.message || 'Failed to initiate payment', 'error');
      }

    } catch (error) {
      console.error('Payment error:', error);
      setStatus('error');
      const errorMsg = error.response?.data?.message || error.message || 'Payment failed. Please try again.';
      setErrorMessage(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mpesa-payment-form">
      <div className="payment-header">
        <MdPhoneAndroid className="header-icon" />
        <h3>M-Pesa Payment</h3>
        <p>Pay securely with M-Pesa mobile money</p>
      </div>

      <div className="payment-instructions">
        <FiInfo className="info-icon" />
        <div>
          <strong>How it works:</strong>
          <ul>
            <li>Enter your M-Pesa registered phone number</li>
            <li>Click "Pay with M-Pesa"</li>
            <li>You'll receive an STK push prompt on your phone</li>
            <li>Enter your M-Pesa PIN to complete payment</li>
          </ul>
        </div>
      </div>

      {status === 'idle' && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="phoneNumber">M-Pesa Phone Number</label>
            <div className="phone-input-wrapper">
              <span className="country-code">+254</span>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="712345678"
                disabled={loading}
                className="phone-input"
                autoFocus
              />
            </div>
            <small className="help-text">Example: 0712345678 or 712345678</small>
          </div>

          <div className="payment-info">
            <div className="info-row">
              <span>Amount to pay:</span>
              <strong>KSh {amount.toLocaleString()}</strong>
            </div>
            <div className="info-row">
              <span>Order ID:</span>
              <span>#{orderId?.slice(-8)}</span>
            </div>
          </div>

          <div className="payment-buttons">
            <button 
              type="button" 
              onClick={onCancel} 
              className="btn btn-secondary"
              disabled={loading}
            >
              Back
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <FiLoader className="spinner-icon" />
                  Processing...
                </>
              ) : (
                <>
                  <MdPhoneAndroid />
                  Pay KSh {amount.toLocaleString()}
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {status === 'processing' && (
        <div className="status-card processing">
          <FiLoader className="status-icon spinning" />
          <h4>Initializing Payment</h4>
          <p>Please wait while we initiate your M-Pesa payment...</p>
        </div>
      )}

      {status === 'waiting' && (
        <div className="status-card waiting">
          <MdPhoneAndroid className="status-icon pulse" />
          <h4>Check Your Phone</h4>
          <p>You should receive an STK push prompt on <strong>{formatPhoneNumber(phoneNumber)}</strong></p>
          <p className="instruction">Enter your M-Pesa PIN to complete the payment</p>
          <div className="waiting-loader">
            <FiLoader className="spinner" />
            <span>Waiting for confirmation...</span>
          </div>
          <button 
            onClick={() => checkPaymentStatus(checkoutRequestId)} 
            className="btn btn-outline"
          >
            Check Status
          </button>
        </div>
      )}

      {status === 'success' && (
        <div className="status-card success">
          <FiCheckCircle className="status-icon" />
          <h4>Payment Successful!</h4>
          <p>Your payment has been received. Redirecting...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="status-card error">
          <FiAlertCircle className="status-icon" />
          <h4>Payment Failed</h4>
          <p>{errorMessage || 'There was an issue processing your payment. Please try again.'}</p>
          <button 
            onClick={() => setStatus('idle')} 
            className="btn btn-outline"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default MpesaForm;


