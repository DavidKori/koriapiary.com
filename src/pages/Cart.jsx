// src/pages/Cart.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SEO from '../components/common/SEO';
import CartItem from '../components/cart/CartItem';
import { FiShoppingBag, FiArrowRight, FiTrash2, FiPercent, FiDollarSign } from 'react-icons/fi';
import '../styles/pages.css';

const Cart = () => {
  const { cartItems, cartTotal, formattedTotal, itemCount, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Debug: Log cart items to see if duplicates exist
  useEffect(() => {
    console.log('Cart items:', cartItems);
    console.log('Cart items count:', cartItems.length);
    // Check for duplicate IDs
    const ids = cartItems.map(item => item.id);
    const uniqueIds = [...new Set(ids)];
    if (ids.length !== uniqueIds.length) {
      console.warn('Duplicate items detected in cart!');
    }
  }, [cartItems]);

  // Calculate item price with discount (same logic as ProductDetails)
  const calculateItemPrice = (item) => {
    let price = item.price;
    
    // Apply product discount if active (same as ProductDetails)
    if (item.discount?.isActive) {
      if (item.discount.type === 'percentage') {
        price = item.price * (1 - item.discount.value / 100);
      } else if (item.discount.type === 'fixed') {
        price = Math.max(0, item.price - item.discount.value);
      }
    }
    
    return price;
  };

  // Calculate item discount info for display
  const getItemDiscountInfo = (item) => {
    if (!item.discount?.isActive) return null;
    
    const discountedPrice = calculateItemPrice(item);
    const saved = item.price - discountedPrice;
    
    return {
      hasDiscount: true,
      type: item.discount.type,
      value: item.discount.value,
      discountedPrice,
      saved,
      label: item.discount.type === 'percentage' 
        ? `${item.discount.value}% OFF` 
        : `KES ${item.discount.value} OFF`
    };
  };

  // Calculate subtotal with discounts applied to individual items
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const itemPrice = calculateItemPrice(item);
      return sum + (itemPrice * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 5000 ? 0 : 299;
  const tax = subtotal * 0.16;
  const total = subtotal + shipping + tax;

  // Check if any item has discount
  const hasAnyDiscount = cartItems.some(item => item.discount?.isActive);
  
  // Calculate total savings
  const totalSavings = cartItems.reduce((sum, item) => {
    if (item.discount?.isActive) {
      const originalPrice = item.price * item.quantity;
      const discountedPrice = calculateItemPrice(item) * item.quantity;
      return sum + (originalPrice - discountedPrice);
    }
    return sum;
  }, 0);

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      showToast('Cart cleared', 'success');
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <SEO title="Shopping Cart" />
        <div className="empty-cart-page">
          <FiShoppingBag className="empty-icon" />
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any items yet.</p>
          <Link to="/products" className="btn btn-primary">
            Continue Shopping <FiArrowRight />
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Shopping Cart" />
      <div className="cart-page">
        <div className="page-header">
          <h1 className="page-title">
            <FiShoppingBag className="title-icon" />
            Shopping Cart
          </h1>
          <p className="page-description">
            You have {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="cart-layout">
          <div className="cart-items-section">
            <div className="cart-items-header">
              <div className="product-info-header">Product</div>
              <div className="quantity-header">Quantity</div>
              <div className="total-header">Total</div>
            </div>

            <div className="cart-items-list">
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="cart-actions">
              <Link to="/products" className="continue-shopping">
                <FiArrowRight /> Continue Shopping
              </Link>
              <button className="clear-cart-btn" onClick={handleClearCart}>
                <FiTrash2 /> Clear Cart
              </button>
            </div>
          </div>

          <div className="order-summary-section">
            <h3>Order Summary</h3>
            
            {/* Discount Banner if any items have discount */}
            {hasAnyDiscount && (
              <div className="discount-banner">
                <div className="discount-banner-icon">
                  <FiPercent />
                </div>
                <div className="discount-banner-content">
                  <strong>Discounts Applied!</strong>
                  <p>You're saving KES {totalSavings.toLocaleString()} on this order</p>
                </div>
              </div>
            )}
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>
              
              {/* Show original price if any discounts */}
              {hasAnyDiscount && (
                <div className="summary-row discount-row">
                  <span>Original Price</span>
                  <span className="original-price">
                    KES {(subtotal + totalSavings).toLocaleString()}
                  </span>
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
              {shipping > 0 && subtotal < 5000 && (
                <div className="shipping-notice">
                  Add KES {(5000 - subtotal).toLocaleString()} more for free shipping!
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
            </div>

            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout <FiArrowRight />
            </Link>

            <div className="secure-checkout">
              <div className="secure-icon">🔒</div>
              <div className="secure-text">
                <strong>Secure Checkout</strong>
                <span>Your payment information is encrypted</span>
              </div>
            </div>

            {!isAuthenticated && (
              <div className="guest-note">
                <p>Checkout as a guest or <Link to="/login">log in</Link> for faster checkout</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;