// src/pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyOrders, cancelOrder } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import SEO from '../components/common/SEO';
import RatingModal from '../components/orders/RatingModal';
import { 
  FiPackage, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiTruck, 
  FiMapPin, 
  FiCalendar, 
  FiDollarSign,
  FiEye,
  FiShoppingBag,
  FiAlertTriangle,
  FiPhoneCall,
  FiMail,
  FiInfo,
  FiStar,
  FiChevronRight
} from 'react-icons/fi';
import { MdLocalShipping, MdReceipt, MdVerified } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import '../styles/orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedItemForRating, setSelectedItemForRating] = useState(null);
  const [pendingRatings, setPendingRatings] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
      
      // Find items that need rating from delivered orders
      const pending = [];
      (Array.isArray(data) ? data : []).forEach(order => {
        if (order.orderStatus === 'delivered') {
          order.items.forEach(item => {
            if (!item.rated) {
              pending.push({
                orderId: order._id,
                item: item,
                orderNumber: order._id.slice(-8).toUpperCase(),
                existingRating: null
              });
            }
          });
        }
      });
      setPendingRatings(pending);
      
      // Show rating modal for first pending item if any
      if (pending.length > 0 && !showRatingModal) {
        setTimeout(() => {
          setSelectedItemForRating(pending[0]);
          setShowRatingModal(true);
        }, 1000);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast('Failed to fetch orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingComplete = () => {
    fetchOrders(); // Refresh orders to update rated status
    setShowRatingModal(false);
    setSelectedItemForRating(null);
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    
    setCancellingOrder(true);
    try {
      await cancelOrder(selectedOrder._id);
      showToast('Order cancellation request submitted. Support will contact you.', 'success');
      setShowCancelModal(false);
      await fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      showToast(error.response?.data?.message || 'Failed to cancel order', 'error');
    } finally {
      setCancellingOrder(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return <FiCheckCircle className="status-icon delivered" />;
      case 'processing':
        return <FiTruck className="status-icon processing" />;
      case 'shipped':
        return <MdLocalShipping className="status-icon shipped" />;
      case 'pending':
      case 'pending_payment':
        return <FiClock className="status-icon pending" />;
      case 'cancelled':
        return <FiXCircle className="status-icon cancelled" />;
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

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="orders-page">
        <div className="auth-required">
          <FiAlertTriangle className="auth-icon" />
          <h2>Authentication Required</h2>
          <p>Please log in to view your orders</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader size="large" text="Loading your orders..." />;
  }

  return (
    <>
      <SEO 
        title="My Orders"
        description="View your order history and track your deliveries"
      />

      <div className="orders-page">
        <div className="page-header">
          <h1 className="page-title">
            <FiShoppingBag className="title-icon" />
            My Orders
          </h1>
          <p className="page-description">
            View and track all your orders
          </p>
          {pendingRatings.length > 0 && (
            <div className="rating-reminder">
              <FiStar className="reminder-icon" />
              <span>You have {pendingRatings.length} item{pendingRatings.length !== 1 ? 's' : ''} waiting for your rating!</span>
            </div>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <FiPackage className="empty-icon" />
            <h3>No Orders Yet</h3>
            <p>You haven't placed any orders yet.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                {/* Order Header */}
                <div className="order-header">
                  <div className="order-info">
                    <div className="order-number">
                      <MdReceipt className="info-icon" />
                      <span>Order #{order._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="order-date">
                      <FiCalendar className="info-icon" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                  <div className={`order-status ${getStatusClass(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    <span>{getStatusText(order.orderStatus)}</span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="preview-item">
                      <div className="item-image">
                        <img 
                          src={item.product?.images?.[0]?.url || '/images/placeholder.jpg'} 
                          alt={item.name}
                        />
                      </div>
                      <div className="item-info">
                        <div className="item-name">{item.name}</div>
                        <div className="item-meta">
                          <span className="item-quantity">Qty: {item.quantity}</span>
                          <span className="item-price">{formatPrice(item.price)}</span>
                        </div>
                      </div>
                      {order.orderStatus === 'delivered' && (
                        <button 
                          className={`rate-btn ${item.rated ? 'rated' : ''}`}
                          onClick={() => {
                            setSelectedItemForRating({
                              orderId: order._id,
                              item: item,
                              orderNumber: order._id.slice(-8).toUpperCase(),
                              existingRating: item.existingRating || null
                            });
                            setShowRatingModal(true);
                          }}
                        >
                          <FiStar /> 
                          {item.rated ? 'Edit Rating' : 'Rate'}
                        </button>
                      )}
                      {item.rated && (
                        <div className="rated-badge">
                          <FiCheckCircle /> Rated
                        </div>
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="more-items">
                      +{order.items.length - 3} more items
                    </div>
                  )}
                </div>

                {/* Order Footer */}
                <div className="order-footer">
                  <div className="order-total">
                    <span className="total-label">Total:</span>
                    <span className="total-amount">{formatPrice(order.totalPrice)}</span>
                  </div>
                  <div className="order-actions">
                    <button 
                      className="btn-secondary btn-sm"
                      onClick={() => handleViewOrder(order._id)}
                    >
                      <FiEye /> View Details
                      <FiChevronRight />
                    </button>
                    {(order.orderStatus === 'pending' || order.orderStatus === 'pending_payment') && (
                      <button 
                        className="btn-danger btn-sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowCancelModal(true);
                        }}
                      >
                        <FiXCircle /> Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Order Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedOrder(null);
        }}
        title="Cancel Order"
        size="medium"
      >
        {selectedOrder && (
          <div className="cancel-order-modal">
            <div className="cancel-icon">
              <FiAlertTriangle />
            </div>
            <h3>Are you sure you want to cancel this order?</h3>
            <p className="order-reference">
              Order #{selectedOrder._id.slice(-8).toUpperCase()}
            </p>
            <div className="order-summary-cancel">
              <div className="cancel-items">
                {selectedOrder.items.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="cancel-item">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                {selectedOrder.items.length > 2 && (
                  <div className="more-items-cancel">
                    +{selectedOrder.items.length - 2} more items
                  </div>
                )}
              </div>
              <div className="cancel-total">
                <span>Total Amount:</span>
                <strong>{formatPrice(selectedOrder.totalPrice)}</strong>
              </div>
            </div>

            <div className="cancel-warning">
              <FiInfo />
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
                  <FiPhoneCall /> Call Support
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
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedOrder(null);
                }}
                disabled={cancellingOrder}
              >
                Keep Order
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleCancelOrder}
                disabled={cancellingOrder}
              >
                {cancellingOrder ? 'Processing...' : 'Request Cancellation'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Rating Modal */}
      {showRatingModal && selectedItemForRating && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedItemForRating(null);
          }}
          orderId={selectedItemForRating?.orderId}
          item={selectedItemForRating?.item}
          existingRating={selectedItemForRating?.existingRating}
          onRatingComplete={handleRatingComplete}
        />
      )}
    </>
  );
};

export default Orders;


