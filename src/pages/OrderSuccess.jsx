// src/pages/OrderSuccess.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { 
  FiCheckCircle, 
  FiPackage, 
  FiMail, 
  FiPrinter, 
  FiShoppingBag, 
  FiArrowRight,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiCreditCard,
  FiTruck,
  FiHeart,
  FiDownload,
  FiShare2
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { getOrderById } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import '../styles/orderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(10);

  // Get orderId from URL params
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');

  useEffect(() => {
    if (!orderId) {
      setError('No order ID found');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await getOrderById(orderId);
        setOrder(response.data || response);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    // Auto redirect countdown
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatDate = (date) => {
    if (!date) return 'Just now';
    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return `KES ${price?.toLocaleString() || '0'}`;
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Order Confirmation - Apiary Honey',
        text: `Thank you for your order! Order #${order?.orderNumber || order?._id?.slice(-8)}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Order link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="order-success-loading">
        <Loader size="large" text="Loading order details..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-success-error">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load Order</h2>
          <p>{error || 'Order not found'}</p>
          <Link to="/" className="btn btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const orderNumber = order.orderNumber || order._id?.slice(-8).toUpperCase();
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <>
      <SEO 
        title="Order Successful - Thank You!" 
        description={`Order ${orderNumber} confirmed successfully. Thank you for shopping with Apiary Honey.`}
      />
      
      <div className="order-success-page">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">
            <FiCheckCircle />
          </div>
          <h1>Thank You for Your Order!</h1>
          <p>Your order has been placed successfully.</p>
          <div className="order-number-card">
            <span className="order-number-label">Order Number</span>
            <strong className="order-number-value">#{orderNumber}</strong>
          </div>
        </div>

        <div className="order-success-content">
          {/* Order Status Timeline */}
          <div className="order-timeline">
            <div className="timeline-step completed">
              <div className="step-icon">
                <FiCheckCircle />
              </div>
              <div className="step-info">
                <h4>Order Placed</h4>
                <p>{formatDate(order.createdAt)}</p>
              </div>
            </div>
            <div className="timeline-step active">
              <div className="step-icon">
                <FiPackage />
              </div>
              <div className="step-info">
                <h4>Processing</h4>
                <p>We're preparing your order</p>
              </div>
            </div>
            <div className="timeline-step">
              <div className="step-icon">
                <FiTruck />
              </div>
              <div className="step-info">
                <h4>Shipped</h4>
                <p>Estimated: {estimatedDelivery.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="timeline-step">
              <div className="step-icon">
                <FiHeart />
              </div>
              <div className="step-info">
                <h4>Delivered</h4>
                <p>We hope you love it!</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="order-details-grid">
            {/* Order Items */}
            <div className="order-items-card">
              <h3>
                <FiPackage />
                Order Items
              </h3>
              <div className="order-items-list">
                {order.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image">
                      {item.product?.images?.[0]?.url ? (
                        <img src={item.product.images[0].url} alt={item.name} />
                      ) : (
                        <div className="item-placeholder">
                          <FiPackage />
                        </div>
                      )}
                    </div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-variant">Variant: {item.variant?.name || 'Standard'}</p>
                      <div className="item-price-info">
                        <span className="item-quantity">Qty: {item.quantity}</span>
                        <span className="item-price">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                    <div className="item-total">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-summary-card">
              <h3>
                <FiDollarSign />
                Order Summary
              </h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="summary-row discount">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (16% VAT)</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="shipping-info-card">
              <h3>
                <FiMapPin />
                Shipping Information
              </h3>
              <div className="shipping-details">
                <p className="shipping-name">
                  <strong>{order.shippingAddress?.name}</strong>
                </p>
                <p>{order.shippingAddress?.address}</p>
                <p>{order.shippingAddress?.city}</p>
                <p>{order.shippingAddress?.postalCode}</p>
                <p>{order.shippingAddress?.phone}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="payment-info-card">
              <h3>
                <FiCreditCard />
                Payment Information
              </h3>
              <div className="payment-details">
                <div className="payment-row">
                  <span>Method:</span>
                  <strong>
                    {order.paymentMethod === 'paystack' ? 'Paystack' : 
                     order.paymentMethod === 'whatsapp' ? 'WhatsApp Order' : 
                     order.paymentMethod}
                  </strong>
                </div>
                <div className="payment-row">
                  <span>Status:</span>
                  <span className={`payment-status ${order.isPaid ? 'paid' : 'pending'}`}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </div>
                {order.paymentDetails?.paidAt && (
                  <div className="payment-row">
                    <span>Paid on:</span>
                    <span>{formatDate(order.paymentDetails.paidAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="order-notes-card">
              <h3>Order Notes</h3>
              <p>{order.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="action-btn print-btn" onClick={handlePrintOrder}>
              <FiPrinter />
              Print Order
            </button>
            <button className="action-btn share-btn" onClick={handleShareOrder}>
              <FiShare2 />
              Share Order
            </button>
            <Link to="/" className="action-btn shop-btn">
              <FiShoppingBag />
              Continue Shopping
              <FiArrowRight />
            </Link>
          </div>

          {/* Email Confirmation Notice */}
          <div className="email-notice">
            <FiMail />
            <div>
              <strong>Check your email</strong>
              <p>We've sent a confirmation email with your order details to {order.guestEmail || user?.email}</p>
            </div>
          </div>

          {/* WhatsApp Support */}
          <div className="whatsapp-support">
            <FaWhatsapp className="whatsapp-icon" />
            <div>
              <strong>Need help?</strong>
              <p>Contact us on WhatsApp for any questions about your order</p>
              <a 
                href="https://wa.me/254115685773?text=Hello! I have a question about my order #${orderNumber}" 
                target="_blank" 
                rel="noopener noreferrer"
                className="whatsapp-link"
              >
                Chat with Support <FiArrowRight />
              </a>
            </div>
          </div>

          {/* Auto Redirect */}
          <div className="auto-redirect">
            <p>You will be redirected to the home page in {countdown} seconds</p>
            <Link to="/" className="redirect-link">
              Go now <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;