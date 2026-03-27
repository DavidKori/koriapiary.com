// src/components/cart/CartSummary.jsx
import React from 'react';
import { useCart } from '../../context/CartContext';

const CartSummary = () => {
  const { cartItems, cartTotal, formattedTotal } = useCart();

  const subtotal = cartTotal;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-summary">
      <h3>Order Summary</h3>
      
      <div className="summary-row">
        <span>Subtotal ({cartItems.length} items)</span>
        <span>{formattedTotal}</span>
      </div>
      
      <div className="summary-row">
        <span>Shipping</span>
        <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
      </div>
      
      {shipping > 0 && (
        <div className="shipping-note">
          Add KES{(10000 - subtotal).toFixed(2)} more for free shipping
        </div>
      )}
      
      <div className="summary-row">
        <span>Tax (8%)</span>
        <span>KES{tax.toFixed(2)}</span>
      </div>
      
      <div className="summary-row total">
        <span>Total</span>
        <span>KES{total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default CartSummary;