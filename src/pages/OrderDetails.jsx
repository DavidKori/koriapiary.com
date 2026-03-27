// src/pages/OrderDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate,useLocation } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SEO from '../components/common/SEO';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import {
  FiPackage,
  FiCheck,
  FiX,
  FiClock,
  FiTruck,
  FiMapPin,
  FiPhone,
  FiMail,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiArrowLeft,
  FiPrinter,
  FiDownload,
  FiShare2,
  FiAlertCircle,
  FiShoppingBag,
  FiTruck as FiDelivery,
  FiRefreshCw,
  FiShield,
  FiStar
} from 'react-icons/fi';
import { MdLocalShipping, MdReceipt, MdVerified, MdPayment } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import '../styles/orderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrder();
    }
  }, [id, isAuthenticated]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await getOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      showToast('Failed to load order details', 'error');
      navigate('/settings?tab=orders');
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    // Check if there's a previous page in history
    if (window.history.length > 2) {
      navigate(-1); // Go back to previous page
    } else {
      // Fallback to orders tab if no history
      navigate('/settings?tab=orders');
    }
  };
  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      await cancelOrder(id);
      showToast('Order cancellation request submitted. Support will contact you.', 'success');
      setShowCancelModal(false);
      await fetchOrder();
    } catch (error) {
      console.error('Error cancelling order:', error);
      showToast(error.response?.data?.message || 'Failed to cancel order', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return <FiCheck className="status-icon delivered" />;
      case 'processing':
        return <FiTruck className="status-icon processing" />;
      case 'shipped':
        return <MdLocalShipping className="status-icon shipped" />;
      case 'pending':
      case 'pending_payment':
        return <FiClock className="status-icon pending" />;
      case 'cancelled':
        return <FiX className="status-icon cancelled" />;
      default:
        return <FiPackage className="status-icon" />;
    }
  };

  const getStatusText = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return 'Delivered';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'pending':
        return 'Pending';
      case 'pending_payment':
        return 'Awaiting Payment';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status || 'Unknown';
    }
  };

  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'pending':
      case 'pending_payment':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Order link copied to clipboard!', 'success');
    } catch (error) {
      console.error('Share error:', error);
      showToast('Failed to copy link', 'error');
    }
  };

  const handleWhatsApp = () => {
    const message = `I need help with order #${order._id.slice(-8).toUpperCase()}`;
    const whatsappUrl = `https://wa.me/254115685773?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return <Loader size="large" text="Loading order details..." />;
  }

  if (!order) {
    return (
      <div className="order-not-found">
        <FiAlertCircle className="not-found-icon" />
        <h2>Order Not Found</h2>
        <p>The order you're looking for doesn't exist or has been removed.</p>
        <Link to="/settings?tab=orders" className="btn btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  const canCancel = order.orderStatus === 'pending' || order.orderStatus === 'pending_payment';

  return (
    <>
      <SEO 
        title={`Order #${order._id.slice(-8)}`}
        description={`View details for order #${order._id.slice(-8)}`}
      />

      <div className="order-details-page">
        {/* Header */}
        <div className="order-details-header">
      <button className="back-btn" onClick={handleBack}>
        <FiArrowLeft /> Back
      </button>
                
          <div className="header-actions">
            <button className="action-btn" onClick={handlePrint} title="Print">
              <FiPrinter />
            </button>
            <button className="action-btn" onClick={handleShare} title="Share">
              <FiShare2 />
            </button>
            <button className="action-btn" onClick={handleWhatsApp} title="Contact Support">
              <FaWhatsapp />
            </button>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="order-summary-card">
          <div className="summary-header">
            <div className="order-number-large">
              <MdReceipt />
              <div>
                <span className="label">Order Number</span>
                <span className="value">#{order._id.slice(-8).toUpperCase()}</span>
              </div>
            </div>
            <div className={`order-status-large ${getStatusClass(order.orderStatus)}`}>
              {getStatusIcon(order.orderStatus)}
              <span>{getStatusText(order.orderStatus)}</span>
            </div>
          </div>

          <div className="summary-grid">
            <div className="summary-item">
              <FiCalendar className="item-icon" />
              <div>
                <span className="label">Order Date</span>
                <span className="value">{formatDate(order.createdAt)}</span>
              </div>
            </div>
            <div className="summary-item">
              <FiDollarSign className="item-icon" />
              <div>
                <span className="label">Total Amount</span>
                <span className="value">{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
            <div className="summary-item">
              <MdPayment className="item-icon" />
              <div>
                <span className="label">Payment Method</span>
                <span className="value capitalize">{order.paymentMethod || 'Not specified'}</span>
              </div>
            </div>
            <div className="summary-item">
              <FiCheck className="item-icon" />
              <div>
                <span className="label">Payment Status</span>
                <span className={`payment-status ${order.isPaid ? 'paid' : 'unpaid'}`}>
                  {order.isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Section */}
        <div className="order-items-section">
          <h2>Order Items</h2>
          <div className="items-list">
            {order.items.map((item, index) => (
              <div key={index} className="order-item-card">
                <div className="item-image">
                  <img 
                    src={item.product?.images?.[0]?.url || '/images/placeholder.jpg'} 
                    alt={item.name}
                  />
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <div className="item-sku">SKU: {item.variant?.sku || 'N/A'}</div>
                  <div className="item-price">Unit Price: {formatPrice(item.price)}</div>
                </div>
                <div className="item-quantity">
                  <div className="quantity-label">Quantity</div>
                  <div className="quantity-value">{item.quantity}</div>
                </div>
                <div className="item-total">
                  <div className="total-label">Total</div>
                  <div className="total-value">{formatPrice(item.price * item.quantity)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="price-breakdown-section">
          <h2>Price Breakdown</h2>
          <div className="breakdown-card">
            <div className="breakdown-row">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="breakdown-row">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
            </div>
            <div className="breakdown-row">
              <span>Tax (16% VAT)</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            {order.discount > 0 && (
              <div className="breakdown-row discount">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="breakdown-row total">
              <span>Total</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="shipping-section">
          <h2>
            <FiMapPin /> Shipping Information
          </h2>
          <div className="shipping-card">
            <div className="shipping-details">
              <div className="detail-row">
                <FiUser className="detail-icon" />
                <span>{order.shippingAddress?.name}</span>
              </div>
              <div className="detail-row">
                <FiMapPin className="detail-icon" />
                <span>{order.shippingAddress?.address}</span>
              </div>
              <div className="detail-row">
                <FiMapPin className="detail-icon" />
                <span>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</span>
              </div>
              <div className="detail-row">
                <FiMapPin className="detail-icon" />
                <span>{order.shippingAddress?.country}</span>
              </div>
              <div className="detail-row">
                <FiPhone className="detail-icon" />
                <span>{order.shippingAddress?.phone}</span>
              </div>
              <div className="detail-row">
                <FiMail className="detail-icon" />
                <span>{order.guestEmail || order.user?.email}</span>
              </div>
            </div>

            {order.trackingNumber && (
              <div className="tracking-info">
                <FiDelivery className="tracking-icon" />
                <div>
                  <strong>Tracking Number:</strong>
                  <span>{order.trackingNumber}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="notes-section">
            <h2>
              <FiAlertCircle /> Order Notes
            </h2>
            <div className="notes-card">
              <p>{order.notes}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          {canCancel && (
            <button className="btn-danger btn-lg" onClick={() => setShowCancelModal(true)}>
              <FiX /> Cancel Order
            </button>
          )}
          <Link to="/products" className="btn-primary btn-lg">
            <FiShoppingBag /> Continue Shopping
          </Link>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Order"
        size="medium"
      >
        <div className="cancel-order-modal">
          <FiAlertCircle className="cancel-icon" />
          <h3>Are you sure you want to cancel this order?</h3>
          <p className="order-reference">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
          
          <div className="cancel-warning">
            <FiAlertCircle />
            <div>
              <strong>Important:</strong> Order cancellation requires support confirmation.
              Clicking "Request Cancellation" will notify our support team who will
              process your request within 24 hours.
            </div>
          </div>

          <div className="support-contact">
            <h4>Need help?</h4>
            <div className="contact-options">
              <a href="tel:+254115685773" className="contact-link">
                <FiPhone /> Call Support
              </a>
              <a href="https://wa.me/254115685773" target="_blank" rel="noopener noreferrer" className="contact-link">
                <FaWhatsapp /> WhatsApp
              </a>
              <a href="mailto:support@apiaryhoney.com" className="contact-link">
                <FiMail /> Email Support
              </a>
            </div>
          </div>

          <div className="modal-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => setShowCancelModal(false)}
              disabled={cancelling}
            >
              Keep Order
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleCancelOrder}
              disabled={cancelling}
            >
              {cancelling ? 'Processing...' : 'Request Cancellation'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default OrderDetails;