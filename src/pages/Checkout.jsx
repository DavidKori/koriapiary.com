// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createOrder } from '../services/orderService';
import PaymentMethods from '../components/checkout/PaymentMethods';
import CartSummary from '../components/cart/CartSummary';
import SEO from '../components/common/SEO';
import { FiLock, FiTruck, FiCheckCircle } from 'react-icons/fi';
import '../styles/pages.css'

// We'll create simple placeholder forms for now
const StripeForm = ({ amount, onSuccess, onCancel, processing }) => (
  <div className="stripe-form">
    <p>Stripe payment integration coming soon...</p>
    <button onClick={() => onSuccess({ id: 'test' })} className="btn btn-primary">
      Simulate Payment
    </button>
  </div>
);

const MpesaForm = ({ amount, onSuccess, onCancel, processing }) => (
  <div className="mpesa-form">
    <p>M-Pesa payment integration coming soon...</p>
    <button onClick={() => onSuccess({ id: 'test' })} className="btn btn-primary">
      Simulate Payment
    </button>
  </div>
);

const WhatsAppOrder = ({ orderData, onSuccess, onCancel, processing }) => (
  <div className="whatsapp-order">
    <p>WhatsApp order integration coming soon...</p>
    <button onClick={() => onSuccess({ id: 'test' })} className="btn btn-primary">
      Place Order
    </button>
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated, isGuest } = useAuth();
  const { showToast } = useToast();
  
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderComplete]);

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && paymentMethod) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentComplete = async (paymentResult) => {
    setProcessing(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          name: item.productName,
          variantName: item.variantName
        })),
        subtotal: cartTotal,
        tax: cartTotal * 0.08,
        shipping: cartTotal > 50 ? 0 : 5.99,
        total: cartTotal + (cartTotal * 0.08) + (cartTotal > 50 ? 0 : 5.99),
        paymentMethod,
        paymentDetails: paymentResult,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        notes: formData.notes,
        userId: user?._id
      };

      // Simulate order creation
      console.log('Order placed:', orderData);
      
      setOrderId('ORD-' + Date.now());
      setOrderComplete(true);
      clearCart();
      
      showToast('Order placed successfully!', 'success');

    } catch (error) {
      console.error('Order creation failed:', error);
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="order-success">
        <FiCheckCircle className="success-icon" />
        <h1>Thank You for Your Order!</h1>
        <p>Your order has been placed successfully.</p>
        <p className="order-id">Order ID: #{orderId}</p>
        <div className="success-actions">
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Continue Shopping
          </button>
          <button onClick={() => navigate('/profile')} className="btn btn-outline">
            View Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Checkout"
        description="Secure checkout for your honey order"
      />

      <div className="checkout-page">
        <h1 className="page-title">Checkout</h1>

        {/* Checkout Steps */}
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Information</span>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Payment</span>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Confirm</span>
          </div>
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            {/* Step 1: Information */}
            {step === 1 && (
              <div className="checkout-step">
                <h2>Contact Information</h2>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <h2>Shipping Information</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="error-text">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code *</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={errors.postalCode ? 'error' : ''}
                    />
                    {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="country">Country *</label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={errors.country ? 'error' : ''}
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="KE">Kenya</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                    </select>
                    {errors.country && <span className="error-text">{errors.country}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder="e.g., +1234567890"
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Order Notes (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Special instructions for your order"
                  />
                </div>

                <div className="step-actions">
                  <button onClick={() => navigate('/cart')} className="btn btn-secondary">
                    Back to Cart
                  </button>
                  <button onClick={handleNextStep} className="btn btn-primary">
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="checkout-step">
                <h2>Payment Method</h2>
                
                <PaymentMethods 
                  selectedMethod={paymentMethod}
                  onSelect={setPaymentMethod}
                />

                <div className="step-actions">
                  <button onClick={handlePrevStep} className="btn btn-secondary">
                    Back
                  </button>
                  <button 
                    onClick={handleNextStep} 
                    className="btn btn-primary"
                    disabled={!paymentMethod}
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Processing */}
            {step === 3 && (
              <div className="checkout-step">
                <h2>Complete Payment</h2>
                
                {paymentMethod === 'stripe' && (
                  <StripeForm 
                    amount={cartTotal}
                    onSuccess={handlePaymentComplete}
                    onCancel={handlePrevStep}
                    processing={processing}
                  />
                )}

                {paymentMethod === 'mpesa' && (
                  <MpesaForm 
                    amount={cartTotal}
                    phoneNumber={formData.phone}
                    onSuccess={handlePaymentComplete}
                    onCancel={handlePrevStep}
                    processing={processing}
                  />
                )}

                {paymentMethod === 'whatsapp' && (
                  <WhatsAppOrder 
                    orderData={{
                      items: cartItems,
                      total: cartTotal,
                      customer: formData
                    }}
                    onSuccess={handlePaymentComplete}
                    onCancel={handlePrevStep}
                    processing={processing}
                  />
                )}

                {paymentMethod === 'cash' && (
                  <div className="cash-form">
                    <p>You've selected Cash on Delivery.</p>
                    <p>Please have the exact amount ready when your order arrives.</p>
                    <button 
                      onClick={() => handlePaymentComplete({ method: 'cash' })}
                      className="btn btn-primary"
                      disabled={processing}
                    >
                      {processing ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <aside className="checkout-sidebar">
            <CartSummary />
            
            <div className="checkout-security">
              <FiLock />
              <span>Secure Checkout</span>
            </div>

            <div className="checkout-guarantee">
              <FiTruck />
              <div>
                <h4>Free Shipping</h4>
                <p>On orders over Ksh10,000</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Checkout;