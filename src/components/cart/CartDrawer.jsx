// ==========================================
// CART DRAWER - Slide-out cart panel
// ==========================================
import React from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

const CartDrawer = () => {
  const { cartOpen, setCartOpen, cartItems, itemCount } = useCart();

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div 
          className="cart-overlay"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h2>
            <FiShoppingBag />
            Your Cart ({itemCount})
          </h2>
          <button 
            className="close-btn"
            onClick={() => setCartOpen(false)}
          >
            <FiX />
          </button>
        </div>

        <div className="cart-drawer-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <FiShoppingBag className="empty-icon" />
              <p>Your cart is empty</p>
              <Link 
                to="/products" 
                className="continue-shopping-btn"
                onClick={() => setCartOpen(false)}
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              
              <CartSummary />
              
              <div className="cart-drawer-footer">
                <Link 
                  to="/checkout" 
                  className="checkout-btn"
                  onClick={() => setCartOpen(false)}
                >
                  Proceed to Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;