// src/pages/settings/OrdersTab.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyOrders } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import Loader from '../../components/common/Loader';
import { 
  FiPackage, 
  FiCheck, 
  FiX, 
  FiClock, 
  FiTruck, 
  FiEye, 
  FiShoppingBag,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
  FiPhone,
  FiMail,
  FiUser,
  FiChevronRight,
  FiStar
} from 'react-icons/fi';
import { MdLocalShipping, MdReceipt, MdVerified } from 'react-icons/md';
import '../../styles/orders.css';

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getMyOrders();
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
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

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  if (loading) {
    return <Loader size="small" text="Loading your orders..." />;
  }

  return (
    <div className="orders-tab">
      <div className="tab-header">
        <h2>Order History</h2>
        <p className="tab-description">
          View and track all your orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <FiShoppingBag className="empty-icon" />
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
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="more-items">
                    +{order.items.length - 3} more items
                  </div>
                )}
              </div>

              {/* Order Summary */}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;