// src/components/checkout/PaystackForm.jsx
import React, { useState, useEffect } from 'react';
import { FiLoader, FiPhone, FiCheckCircle, FiAlertCircle, FiCreditCard, FiSmartphone, FiPercent, FiDollarSign } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';
import { verifyPaystackPayment } from '../../services/paymentService';
import '../../styles/paystackForm.css';
import { FaUniversity } from 'react-icons/fa';

const PaystackForm = ({ amount, email, name, phoneNumber, orderId, onPaymentComplete, onCancel, processing, orderDetails }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [paystackReady, setPaystackReady] = useState(false);
  const { showToast } = useToast();

  // Get order details from props or calculate from cart
  const subtotal = orderDetails?.subtotal || amount;
  const originalSubtotal = orderDetails?.originalSubtotal || amount;
  const totalSavings = orderDetails?.totalSavings || 0;
  const tax = orderDetails?.tax || amount * 0.16;
  const shipping = orderDetails?.shipping || 0;
  const hasDiscount = totalSavings > 0;

  // Check if Paystack script is loaded
  useEffect(() => {
    const checkPaystack = () => {
      if (window.PaystackPop) {
        console.log('✅ Paystack script loaded successfully');
        setPaystackReady(true);
      } else {
        console.log('⏳ Waiting for Paystack script...');
        setTimeout(checkPaystack, 500);
      }
    };
    
    checkPaystack();
  }, []);

  const generateReference = () => {
    return `APIARY-${orderId?.slice(-8)}-${Date.now()}`;
  };

  const payWithPaystack = async () => {
    if (!orderId) {
      showToast('Order not created. Please go back and try again.', 'error');
      return;
    }

    if (!paystackReady || !window.PaystackPop) {
      showToast('Payment service is still loading. Please wait a moment and try again.', 'error');
      return;
    }

    setLoading(true);
    setStatus('processing');

    const ref = generateReference();
    const amountInKobo = Math.round(amount * 100);
    // const publicKey = "pk_test_b4f111440682847d5e054bc6d3900255e0de8bb6";
    const publicKey = "pk_live_f01f783b88feb18f405620462cfa34d57c3a28af";

    if (!publicKey) {
      showToast('Payment configuration error. Please contact support.', 'error');
      setLoading(false);
      return;
    }

    try {
      // The callback function MUST be defined as a regular function (not arrow) to avoid 'this' binding issues
      const callback = function(response) {
        console.log('Payment callback received:', response);
        
        // Update status to verifying
        setStatus('verifying');
        showToast('Verifying payment...', 'info');
        
        // Verify payment with backend
        verifyPaystackPayment(response.reference)
          .then(verification => {
            console.log('Verification result:', verification);
            
            if (verification.success && verification.data?.status === 'success') {
              setStatus('success');
              showToast('Payment successful!', 'success');
              onPaymentComplete({ 
                status: 'successful', 
                method: 'paystack',
                reference: response.reference
              });
            } else {
              setStatus('error');
              setErrorMessage(verification.message || 'Payment verification failed');
              showToast(verification.message || 'Payment verification failed', 'error');
              setLoading(false);
            }
          })
          .catch(error => {
            console.error('Verification error:', error);
            setStatus('error');
            setErrorMessage('Payment verification failed. Please contact support.');
            showToast('Payment verification failed. Please contact support.', 'error');
            setLoading(false);
          });
      };

      const onClose = function() {
        console.log('Payment modal closed by user');
        if (status !== 'success') {
          setStatus('idle');
          setLoading(false);
          showToast('Payment was not completed. You can try again.', 'warning');
        }
      };

      console.log('Setting up Paystack with:', {
        key: publicKey.substring(0, 10) + '...',
        email,
        amount: amountInKobo,
        ref
      });

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: email,
        amount: amountInKobo,
        currency: 'KES',
        ref: ref,
        label: "Apiary Honey Payment",
        metadata: {
          orderId: orderId,
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: orderId
            },
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: name
            },
            {
              display_name: "Phone Number",
              variable_name: "phone_number",
              value: phoneNumber
            }
          ]
        },
        channels: ['card', 'mobile_money'],
        callback: callback,
        onClose: onClose
      });
      
      handler.openIframe();
      
    } catch (error) {
      console.error('Paystack payment error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Payment failed. Please try again.');
      showToast(error.message || 'Payment failed. Please try again.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="paystack-payment-form">
      <div className="payment-header">
        <FiCreditCard className="header-icon" />
        <h3>Pay with Paystack</h3>
        <p>Secure payment with Card or M-Pesa</p>
      </div>

      {/* Enhanced Order Summary with Discounts */}
      <div className="payment-order-summary">
        <h4>Order Summary</h4>
        
        {/* Show original subtotal if discounts exist */}
        {hasDiscount && (
          <div className="summary-row original-price-row">
            <span>Original Subtotal</span>
            <span className="strikethrough">KES {originalSubtotal.toLocaleString()}</span>
          </div>
        )}
        
        <div className="summary-row">
          <span>Subtotal</span>
          <span>KES {subtotal.toLocaleString()}</span>
        </div>
        
        {/* Show discount savings */}
        {hasDiscount && totalSavings > 0 && (
          <div className="summary-row discount-row">
            <span>
              <FiPercent className="discount-icon" />
              Discount Savings
            </span>
            <span className="discount-amount">-KES {totalSavings.toLocaleString()}</span>
          </div>
        )}
        
        <div className="summary-row">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'FREE' : `KES ${shipping.toLocaleString()}`}</span>
        </div>
        
        <div className="summary-row">
          <span>Tax (16% VAT)</span>
          <span>KES {tax.toLocaleString()}</span>
        </div>
        
        <div className="summary-row total">
          <span>Total to Pay</span>
          <span className="total-amount">KES {amount.toLocaleString()}</span>
        </div>
        
        {/* Show savings message if applicable */}
        {hasDiscount && totalSavings > 0 && (
          <div className="savings-message">
            <FiCheckCircle />
            <span>You saved KES {totalSavings.toLocaleString()} on this order!</span>
          </div>
        )}
      </div>

      {!paystackReady && (
        <div className="status-card loading">
          <FiLoader className="status-icon spinning" />
          <h4>Loading Payment Gateway</h4>
          <p>Please wait while we initialize the payment system...</p>
        </div>
      )}

      {paystackReady && status === 'idle' && (
        <>
          <div className="payment-instructions">
            <FiCreditCard className="info-icon" />
            <div>
              <strong>Payment Options:</strong>
              <ul>
                <li>
                  <FiCreditCard color="#1A1F71" /> Credit/Debit Card (Visa, Mastercard, Verve)
                </li>
                <li>
                  <FiSmartphone color="#34B233" /> M-Pesa (STK Push to your phone)
                </li>
                <li>
                  <FiSmartphone color="#E60000" /> Airtel Money
                </li>
              </ul>
            </div>
          </div>

          <div className="payment-info">
            <div className="info-row">
              <span>Amount to pay:</span>
              <strong>KES {amount.toLocaleString()}</strong>
            </div>
            <div className="info-row">
              <span>Order ID:</span>
              <span>#{orderId?.slice(-8)}</span>
            </div>
            <div className="info-row">
              <span>Customer:</span>
              <span>{name}</span>
            </div>
            <div className="info-row">
              <span>Email:</span>
              <span>{email}</span>
            </div>
          </div>

          <div className="payment-features">
            <div className="feature">
              <FiCheckCircle className="feature-icon" />
              <span>SSL Secure</span>
            </div>
            <div className="feature">
              <FiCheckCircle className="feature-icon" />
              <span>PCI DSS Compliant</span>
            </div>
            <div className="feature">
              <FiSmartphone className="feature-icon" />
              <span>M-Pesa & Airtel Money Available</span>
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
              type="button" 
              onClick={payWithPaystack}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <FiLoader className="spinner-icon" />
                  Loading...
                </>
              ) : (
                <>
                  <FiCreditCard />
                  Pay KES {amount.toLocaleString()}
                </>
              )}
            </button>
          </div>
        </>
      )}

      {status === 'processing' && (
        <div className="status-card processing">
          <FiLoader className="status-icon spinning" />
          <h4>Opening Payment Window</h4>
          <p>Please wait while we prepare your secure payment...</p>
        </div>
      )}

      {status === 'verifying' && (
        <div className="status-card verifying">
          <FiLoader className="status-icon spinning" />
          <h4>Verifying Payment</h4>
          <p>Please wait while we verify your payment...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="status-card success">
          <FiCheckCircle className="status-icon" />
          <h4>Payment Successful!</h4>
          <p>Your payment has been received. Processing your order...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="status-card error">
          <FiAlertCircle className="status-icon" />
          <h4>Payment Failed</h4>
          <p>{errorMessage || 'There was an issue processing your payment. Please try again.'}</p>
          <button 
            onClick={() => {
              setStatus('idle');
              setLoading(false);
            }} 
            className="btn btn-outline"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default PaystackForm;