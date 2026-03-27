// src/components/cart/CartItem.jsx
import React, { useState } from 'react';
import { FiTrash2, FiPlus, FiMinus, FiHeart, FiPercent } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { addToWishlist } from '../../services/wishlistService';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [movingToWishlist, setMovingToWishlist] = useState(false);

  // Calculate discounted price if discount exists (same logic as ProductDetails)
  const calculateDiscountedPrice = () => {
    let price = item.price;
    if (item.discount?.isActive) {
      if (item.discount.type === 'percentage') {
        price = item.price * (1 - item.discount.value / 100);
      } else if (item.discount.type === 'fixed') {
        price = Math.max(0, item.price - item.discount.value);
      }
    }
    return price;
  };

  const discountedPrice = calculateDiscountedPrice();
  const hasDiscount = item.discount?.isActive;
  const itemTotal = discountedPrice * item.quantity;
  const originalTotal = item.price * item.quantity;
  const savedAmount = originalTotal - itemTotal;

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleMoveToWishlist = async () => {
    if (!isAuthenticated) {
      showToast('Please login to add items to wishlist', 'warning');
      return;
    }

    setMovingToWishlist(true);
    try {
      await addToWishlist(item.productId, item.variantId);
      removeFromCart(item.id);
      showToast(`${item.productName} moved to wishlist`, 'success');
    } catch (error) {
      console.error('Error moving to wishlist:', error);
      showToast(error.response?.data?.message || 'Failed to move item to wishlist', 'error');
    } finally {
      setMovingToWishlist(false);
    }
  };

  const imageUrl = item.image || (typeof item.image === 'object' ? item.image?.url : '') || '/images/placeholder.jpg';
  
  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={imageUrl} alt={item.productName} />
      </div>
      
      <div className="cart-item-details">
        <h4 className="cart-item-title">{item.productName}</h4>
        <p className="cart-item-variant">{item.variantName}</p>
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="cart-item-discount-badge" style={{"fontSize":".5rem"}}>
            <FiPercent className="discount-icon" style={{"display":"none"}}/>
            <span className="discount-badge" style={{"fontSize":".6rem"}}>
              {item.discount.type === 'percentage' 
                ? `${item.discount.value}% OFF` 
                : `KES ${item.discount.value} OFF`}
            </span>
          </div>
        )}
        
        <div className="cart-item-price-section">
          {hasDiscount ? (
            <>
              <span className="discounted-price">
                KES {discountedPrice.toLocaleString()}
              </span> <br/>
              <span className="original-price">
                KES {item.price.toLocaleString()}
              </span>
              <span className="saved-amount" style={{"fontSize":".5rem"}}>
                Save KES {savedAmount.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="regular-price">
              KES {item.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <div className="cart-item-actions">
        <div className="quantity-control">
          <button 
            className="wishlist-move-btn"
            onClick={handleMoveToWishlist}
            disabled={movingToWishlist}
            title="Move to wishlist"
          >
            <FiHeart />
          </button>
          <button 
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
            className="quantity-btn"
          >
            <FiMinus />
          </button>
          <span className="quantity-value">{item.quantity}</span>
          <button 
            onClick={handleIncrement}
            disabled={item.quantity >= item.maxStock}
            className="quantity-btn"
          >
            <FiPlus />
          </button>
        </div>

        <div className="cart-item-total">
          <div className="total-amount">
            KES {itemTotal.toLocaleString()}
          </div>
          {hasDiscount && savedAmount > 0 && (
            <div className="total-saved">
              Saved: KES {savedAmount.toLocaleString()}
            </div>
          )}
        </div>

        <button 
          className="remove-btn"
          onClick={() => removeFromCart(item.id)}
          title="Remove item"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

export default CartItem;